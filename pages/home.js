/* ════════════════════════════════════════════
   PAGES/HOME.JS — Program overview page
   ════════════════════════════════════════════ */

window.HomePage = {

  trackData: {},
  startDate: null,

  init() {
    this.startDate = Store.getStartDate();
    this.trackData = Store.loadTrack();
    this.render();
  },

  render() {
    const el = document.getElementById('page-home');
    el.innerHTML = this.buildHTML();
    this.bindEvents(el);
    this.updateHeroStats();
  },

  buildHTML() {
    return `
      ${this.buildHero()}
      ${this.buildMonthTabs()}
      ${this.buildMonthView(1)}
      ${this.buildMonthView(2)}
      ${this.buildMonthView(3)}
    `;
  },

  buildHero() {
    return `
    <div class="hero">
      <div class="hero-inner">
        <div>
          <div class="hero-title">
            <div class="hl1">CALI</div>
            <div class="hl2">STHENICS</div>
            <div class="hl3">PROGRAM</div>
          </div>
          <div class="hero-sub">3-MONTH BODYWEIGHT TRAINING · FOUNDATION → MASTERY</div>
        </div>
        <div class="hero-stats">
          <div class="h-stat">
            <div class="h-stat-num color-m1" id="hs-done">0</div>
            <div class="h-stat-label">SESSIONS DONE</div>
          </div>
          <div class="h-stat">
            <div class="h-stat-num color-m2" id="hs-streak">0</div>
            <div class="h-stat-label">DAY STREAK</div>
          </div>
          <div class="h-stat">
            <div class="h-stat-num color-m3">84</div>
            <div class="h-stat-label">TOTAL SESSIONS</div>
          </div>
          <div class="h-stat">
            <div class="h-stat-num" id="hs-pct">0%</div>
            <div class="h-stat-label">COMPLETE</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  buildMonthTabs() {
    return `
    <div class="month-tabs-wrap">
      <div class="month-tabs">
        <button class="month-tab active" data-m="1">MONTH 1 — FOUNDATION</button>
        <button class="month-tab" data-m="2">MONTH 2 — INTENSITY</button>
        <button class="month-tab" data-m="3">MONTH 3 — MASTERY</button>
      </div>
    </div>`;
  },

  buildMonthView(m) {
    const key = `month${m}`;
    const data = PROGRAM[key];
    const stripKey = `month${m}`;
    const active = m === 1 ? 'active' : '';

    // week strip
    const strip = WEEK_STRIPS[stripKey].map(p => {
      const cls = p.active ? 'active-pip' : 'rest-pip';
      const dotColor = p.active ? `style="background:${data.color}"` : '';
      return `
        <div class="week-pip ${cls}">
          <span class="pip-day">${p.day}</span>
          <span class="pip-type">${p.type}</span>
          ${p.active ? `<div class="pip-dot" ${dotColor}></div>` : ''}
        </div>`;
    }).join('');

    // day tabs and panels
    const dayKeys = Object.keys(data.days);
    const dsClass = `m${m}-ds`;

    const dsBtns = dayKeys.map((dk, i) => {
      const d = data.days[dk];
      return `<button class="ds-btn ${dsClass} ${i===0?'active':''}" data-day="${dk}" data-month="${m}">${d.label}</button>`;
    }).join('');

    const panels = dayKeys.map((dk, i) => {
      const d = data.days[dk];
      return `
        <div class="day-panel ${i===0?'active':''}" id="m${m}-panel-${dk}">
          <div class="grid-2">
            ${this.buildWorkoutCard(d, m)}
            ${this.buildInfoCard(data, d, m)}
          </div>
        </div>`;
    }).join('');

    return `
    <div class="month-view ${active}" id="mv-${m}">
      <div class="month-header">
        <span class="m-badge ${data.badge}">WEEKS ${data.weeks}</span>
        <span class="m-title">${data.label}</span>
        <span class="m-freq">${data.freq}</span>
      </div>

      <div class="section-head"><span class="section-sub">WEEKLY PATTERN</span><div class="section-line"></div></div>
      <div class="week-strip">${strip}</div>

      <div class="section-head"><span class="section-sub">SELECT DAY TYPE</span><div class="section-line"></div></div>
      <div class="day-selector" id="ds-m${m}">${dsBtns}</div>

      ${panels}

      <div class="tips-bar">
        ${data.tips.map(t => `
          <div class="tip-item">
            <div class="tip-label">${t.label}</div>
            <div class="tip-val">${t.val}</div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  buildWorkoutCard(dayData, m) {
    const mData = PROGRAM[`month${m}`];
    const exRows = dayData.exercises.map((ex, idx) => {
      if (ex.type === 'warmup') {
        return `<div class="note-row warmup"><div class="note-dot warmup-dot"></div><span>${ex.text}</span></div>`;
      }
      if (ex.type === 'cooldown') {
        return `<div class="note-row cooldown" style="margin-top:8px"><div class="note-dot cooldown-dot"></div><span>${ex.text}</span></div>`;
      }
      const noteHtml = ex.note ? `<em style="font-size:11px;color:var(--muted);display:block">${ex.note}</em>` : '';
      return `
        <div class="ex-row">
          <span class="ex-num">${ex.id}</span>
          <span class="ex-name">${ex.name}${noteHtml}</span>
          <span class="ex-sets"><strong>${ex.sets}</strong>${ex.reps}</span>
        </div>`;
    }).join('');

    const notesHtml = dayData.notes ? dayData.notes.map(n => `
      <div style="margin-bottom:10px">
        <div class="info-label">${n.label}</div>
        <div class="info-text">${n.text}</div>
      </div>`).join('') : '';

    return `
      <div class="card">
        <div class="card-head">
          <span class="card-title">${dayData.label}</span>
          <span class="tag ${dayData.tag}">${dayData.days}</span>
        </div>
        <div class="card-body">
          ${exRows}
          ${notesHtml ? `<div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border)">${notesHtml}</div>` : ''}
        </div>
      </div>`;
  },

  buildInfoCard(mData, dayData, m) {
    const info = mData.info;
    const color = m === 1 ? 'var(--m1)' : m === 2 ? 'var(--m2)' : 'var(--m3)';
    const hlCls = `m${m}`;
    return `
      <div class="card">
        <div class="card-head">
          <span class="card-title">${dayData.goal ? 'Day Goal' : `Month ${m} Notes`}</span>
          <span class="tag tag-info">NOTES</span>
        </div>
        <div class="card-body">
          <div class="info-items">
            ${dayData.goal ? `<div><div class="info-label">THIS DAY'S FOCUS</div><div class="info-text">${dayData.goal}</div></div>` : ''}
            <div><div class="info-label">MONTH GOAL</div><div class="info-text">${info.goal}</div></div>
            <div><div class="info-label">REST DAYS</div><div class="info-text">${info.rest}</div></div>
            <div><div class="info-label">TIP</div><div class="info-text">${info.tip}</div></div>
            <div class="info-highlight ${hlCls}">
              <div style="font-family:'DM Mono',monospace;font-size:12px;color:${color}">${info.highlight}</div>
            </div>
          </div>
        </div>
      </div>`;
  },

  bindEvents(el) {
    // Month tabs
    el.querySelectorAll('.month-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const m = tab.dataset.m;
        el.querySelectorAll('.month-tab').forEach(t => t.classList.remove('active'));
        el.querySelectorAll('.month-view').forEach(v => v.classList.remove('active'));
        tab.classList.add('active');
        el.querySelector('#mv-' + m).classList.add('active');
      });
    });

    // Day selector buttons
    el.querySelectorAll('.ds-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.dataset.month;
        const day = btn.dataset.day;
        const dsEl = el.querySelector('#ds-m' + m);
        dsEl.querySelectorAll('.ds-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Hide all panels for this month, show selected
        const mView = el.querySelector('#mv-' + m);
        mView.querySelectorAll('.day-panel').forEach(p => p.classList.remove('active'));
        const panel = el.querySelector(`#m${m}-panel-${day}`);
        if (panel) panel.classList.add('active');
      });
    });
  },

  updateHeroStats() {
    this.trackData = Store.loadTrack();
    const s = Stats.compute(this.trackData, this.startDate);
    const el = (id) => document.getElementById(id);
    if (el('hs-done'))   el('hs-done').textContent   = s.done;
    if (el('hs-streak')) el('hs-streak').textContent = s.streak;
    if (el('hs-pct'))    el('hs-pct').textContent    = s.pct + '%';
    Stats.updateNav(s);
  }
};
