/* ════════════════════════════════════════════
   PAGES/CALENDAR.JS
   ════════════════════════════════════════════ */

window.CalendarPage = {

  trackData: {},
  startDate: null,
  calYear: 0,
  calMonth: 0,

  init() {
    this.startDate = Store.getStartDate();
    this.trackData = Store.loadTrack();
    const now = new Date();
    this.calYear  = now.getFullYear();
    this.calMonth = now.getMonth();
    this.render();
  },

  render() {
    const el = document.getElementById('page-calendar');
    el.innerHTML = `
      <div class="cal-page-layout">
        <div class="cal-main">
          <div class="cal-top">
            <button class="cal-nav-btn" id="cal-prev">&#8249;</button>
            <div class="cal-month-name" id="cal-month-lbl"></div>
            <button class="cal-nav-btn" id="cal-next">&#8250;</button>
            <button class="cal-today-btn" id="cal-today-btn">TODAY</button>
          </div>
          <div class="cal-grid" id="cal-grid">
            ${['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d=>`<div class="cal-dow">${d}</div>`).join('')}
          </div>
          <div class="heatmap-wrap">
            <div class="section-head" style="margin-top:32px">
              <span class="section-title font-bebas">12-WEEK HEATMAP</span>
              <div class="section-line"></div>
              <span class="section-sub">FULL PROGRAM</span>
            </div>
            <div class="heatmap-rows" id="heatmap"></div>
            <div class="hm-legend">
              <div class="hm-legend-dot" style="background:var(--surface2)"></div><span>REST</span>
              <div class="hm-legend-dot" style="background:rgba(255,92,92,0.3);margin-left:10px"></div><span>MISSED</span>
              <div class="hm-legend-dot" style="background:rgba(212,255,71,0.65);margin-left:10px"></div><span>DONE</span>
            </div>
          </div>
        </div>
        <div class="cal-sidebar">
          ${this.buildSidebarStats()}
          ${this.buildStartDateCard()}
          <div style="text-align:center;margin-top:8px">
            <button class="btn btn-danger" id="reset-btn">RESET ALL DATA</button>
          </div>
        </div>
      </div>`;

    this.bindEvents(el);
    this.renderCells();
    this.renderHeatmap();
    this.renderStats();
  },

  refresh() {
    this.trackData = Store.loadTrack();
    this.startDate = Store.getStartDate();
    this.renderCells();
    this.renderHeatmap();
    this.renderStats();
    const inp = document.getElementById('start-date-inp');
    if (inp) inp.value = Store.dateToKey(this.startDate);
    this.renderStartWeekLabel();
  },

  buildSidebarStats() {
    return `
      <div class="side-card">
        <div class="side-head">OVERALL STATS</div>
        <div class="side-body">
          <div class="stats-3">
            <div class="s3-card"><div class="s3-num color-green" id="s-done">0</div><div class="s3-lbl">DONE</div></div>
            <div class="s3-card"><div class="s3-num color-m2" id="s-missed">0</div><div class="s3-lbl">MISSED</div></div>
            <div class="s3-card"><div class="s3-num color-m1" id="s-streak">0</div><div class="s3-lbl">STREAK</div></div>
          </div>
          <div style="margin-top:14px">
            <div style="display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);margin-bottom:6px">
              <span>OVERALL PROGRESS</span><span id="s-pct">0%</span>
            </div>
            <div class="prog-track"><div class="prog-fill" id="s-prog-bar" style="background:var(--accent);width:0%"></div></div>
          </div>
          <div class="month-prog-list">
            ${[1,2,3].map(m => `
              <div class="mp-row">
                <div class="mp-top">
                  <span>MONTH ${m}</span>
                  <span id="mp-txt-${m}">0/${m===1?12:m===2?32:40}</span>
                </div>
                <div class="prog-track">
                  <div class="prog-fill" id="mp-bar-${m}" style="background:var(--m${m});width:0%"></div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  },

  buildStartDateCard() {
    return `
      <div class="side-card">
        <div class="side-head">PROGRAM START DATE</div>
        <div class="side-body">
          <div style="font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.5">
            Set the date you began. All tracking and the heatmap recalculate from this.
          </div>
          <input type="date" class="start-date-input" id="start-date-inp">
          <div class="start-week-txt" id="start-week-lbl"></div>
        </div>
      </div>`;
  },

  renderCells() {
    const grid = document.getElementById('cal-grid');
    if (!grid) return;
    // Remove old cells (keep 7 headers)
    const headers = Array.from(grid.children).slice(0, 7);
    grid.innerHTML = '';
    headers.forEach(h => grid.appendChild(h));

    document.getElementById('cal-month-lbl').textContent = MONTH_NAMES[this.calMonth] + ' ' + this.calYear;

    const today = new Date(); today.setHours(0,0,0,0);
    const firstDay = new Date(this.calYear, this.calMonth, 1);
    const lastDay  = new Date(this.calYear, this.calMonth+1, 0);

    // blanks
    for (let i = 0; i < firstDay.getDay(); i++) {
      const b = document.createElement('div');
      b.className = 'cal-cell is-empty';
      grid.appendChild(b);
    }

    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(this.calYear, this.calMonth, d);
      date.setHours(0,0,0,0);
      const key = Store.dateToKey(date);
      const pd  = Store.getProgramDay(date, this.startDate);
      const info = getDayInfo(pd);
      const status = this.trackData[key];
      const isToday = date.getTime() === today.getTime();

      const cell = document.createElement('div');
      cell.className = 'cal-cell';
      if (isToday) cell.classList.add('is-today');
      if (!info)   cell.classList.add('is-rest');
      if (info)    cell.classList.add('is-workout');
      if (status === 'done')   cell.classList.add('is-done');
      if (status === 'missed') cell.classList.add('is-missed');

      let dotHtml = '';
      if (info) {
        dotHtml = `<div class="cal-dot" style="background:${info.color}"></div>
                   <div class="cal-type">${info.label}</div>`;
        cell.title = info.label + (status ? ' — '+status.toUpperCase() : ' — click to track');
        cell.addEventListener('click', () => this.toggleDay(key, date, info, cell));
      }

      cell.innerHTML = `<span class="cal-num">${d}</span>${dotHtml}`;
      grid.appendChild(cell);
    }
  },

  toggleDay(key, date, info, cell) {
    const today = new Date(); today.setHours(0,0,0,0);
    const curr = this.trackData[key];
    if (!curr) {
      this.trackData[key] = 'done';
    } else if (curr === 'done') {
      this.trackData[key] = date <= today ? 'missed' : undefined;
      if (this.trackData[key] === undefined) delete this.trackData[key];
    } else {
      delete this.trackData[key];
    }
    Store.saveTrack(this.trackData);
    cell.classList.toggle('is-done',   this.trackData[key] === 'done');
    cell.classList.toggle('is-missed', this.trackData[key] === 'missed');
    cell.classList.add('anim-pop');
    setTimeout(() => cell.classList.remove('anim-pop'), 300);
    this.renderStats();
    this.renderHeatmap();
    HomePage.updateHeroStats();
  },

  renderHeatmap() {
    const container = document.getElementById('heatmap');
    if (!container) return;
    container.innerHTML = '';
    for (let w = 0; w < 12; w++) {
      const row = document.createElement('div');
      row.className = 'heatmap-row';
      const lbl = document.createElement('div');
      lbl.className = 'hm-label'; lbl.textContent = 'W'+(w+1);
      row.appendChild(lbl);
      const cells = document.createElement('div');
      cells.className = 'hm-cells';
      const today = new Date(); today.setHours(0,0,0,0);
      for (let d = 0; d < 7; d++) {
        const pd   = w*7 + d;
        const date = new Date(this.startDate);
        date.setDate(date.getDate() + pd);
        const key  = Store.dateToKey(date);
        const info = getDayInfo(pd);
        const status = this.trackData[key];
        const isPast = date < today;

        const cell = document.createElement('div');
        cell.className = 'hm-cell';
        if (!info) cell.classList.add('hm-rest');
        else if (status === 'done') cell.classList.add('hm-done');
        else if (status === 'missed') cell.classList.add('hm-missed');

        cell.title = date.toDateString() + (info ? ' — '+info.label : ' — REST') + (status ? ' ('+status+')':'');
        cells.appendChild(cell);
      }
      row.appendChild(cells);
      container.appendChild(row);
    }
  },

  renderStats() {
    const s = Stats.compute(this.trackData, this.startDate);
    const el = id => document.getElementById(id);
    if (!el('s-done')) return;
    el('s-done').textContent   = s.done;
    el('s-missed').textContent = s.missed;
    el('s-streak').textContent = s.streak;
    el('s-pct').textContent    = s.pct + '%';
    el('s-prog-bar').style.width = s.pct + '%';

    const tots = [12, 32, 40];
    const vals = [s.m1done, s.m2done, s.m3done];
    [1,2,3].forEach((m,i) => {
      el(`mp-txt-${m}`).textContent    = vals[i]+'/'+tots[i];
      el(`mp-bar-${m}`).style.width    = Math.round(vals[i]/tots[i]*100)+'%';
    });

    Stats.updateNav(s);
  },

  renderStartWeekLabel() {
    const lbl = document.getElementById('start-week-lbl');
    if (!lbl) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const pd = Store.getProgramDay(today, this.startDate);
    const week = Math.floor(pd / 7) + 1;
    if (pd < 0) lbl.textContent = 'PROGRAM NOT STARTED YET';
    else if (pd >= 84) lbl.textContent = 'PROGRAM COMPLETE 🎉';
    else lbl.textContent = `CURRENTLY ON WEEK ${Math.max(1,Math.min(12,week))} OF 12`;
  },

  bindEvents(el) {
    el.querySelector('#cal-prev').addEventListener('click', () => {
      this.calMonth--;
      if (this.calMonth < 0) { this.calMonth = 11; this.calYear--; }
      this.renderCells();
    });
    el.querySelector('#cal-next').addEventListener('click', () => {
      this.calMonth++;
      if (this.calMonth > 11) { this.calMonth = 0; this.calYear++; }
      this.renderCells();
    });
    el.querySelector('#cal-today-btn').addEventListener('click', () => {
      const now = new Date();
      this.calYear = now.getFullYear(); this.calMonth = now.getMonth();
      this.renderCells();
    });
    el.querySelector('#reset-btn').addEventListener('click', () => {
      if (!confirm('Reset all tracking data? Cannot be undone.')) return;
      Store.reset();
      this.trackData = {};
      this.renderCells(); this.renderHeatmap(); this.renderStats();
      HomePage.updateHeroStats();
    });
    // Start date input — rendered after, so use event delegation
    el.addEventListener('change', (e) => {
      if (e.target.id === 'start-date-inp') {
        Store.setStartDate(e.target.value);
        this.startDate = Store.getStartDate();
        this.renderCells(); this.renderHeatmap(); this.renderStats();
        this.renderStartWeekLabel();
        HomePage.updateHeroStats();
      }
    });
    // Populate input after it's mounted
    setTimeout(() => {
      const inp = document.getElementById('start-date-inp');
      if (inp) inp.value = Store.dateToKey(this.startDate);
      this.renderStartWeekLabel();
    }, 0);
  }
};
