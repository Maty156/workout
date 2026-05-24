/* ════════════════════════════════════════════
   PAGES/WORKOUT.JS — Today's session + day browser
   ════════════════════════════════════════════ */

window.WorkoutPage = {

  trackData: {},
  startDate: null,
  viewingPd: 0,   // program day currently shown

  init() {
    this.startDate = Store.getStartDate();
    this.trackData = Store.loadTrack();
    const today = new Date(); today.setHours(0,0,0,0);
    this.viewingPd = Store.getProgramDay(today, this.startDate);
    this.render();
  },

  refresh() {
    this.trackData = Store.loadTrack();
    this.startDate = Store.getStartDate();
    this.renderContent();
  },

  render() {
    const el = document.getElementById('page-workout');
    el.innerHTML = `
      <div class="workout-layout">
        <div class="wo-main" id="wo-main">
          ${this.buildDayNav()}
          <div id="wo-content"></div>
        </div>
        <div class="wo-sidebar" id="wo-sidebar"></div>
      </div>`;
    this.bindNavEvents(el);
    this.renderContent();
  },

  buildDayNav() {
    // Show buttons for today + surrounding workout days in the program
    return `
      <div class="day-nav" id="day-nav">
        <button class="day-nav-arrow" id="dn-prev" title="Previous day">&#8249;</button>
        <div id="dn-btns" style="display:flex;gap:6px;flex-wrap:wrap;flex:1;justify-content:center"></div>
        <button class="day-nav-arrow" id="dn-next" title="Next day">&#8250;</button>
      </div>`;
  },

  buildDayButtons() {
    const today = new Date(); today.setHours(0,0,0,0);
    const todayPd = Store.getProgramDay(today, this.startDate);

    // Find nearby workout days (±14 days from today)
    const shown = [];
    for (let offset = -14; offset <= 14; offset++) {
      const pd = todayPd + offset;
      if (pd < 0 || pd >= 84) continue;
      const info = getDayInfo(pd);
      if (info) shown.push(pd);
    }
    // Always include today's pd even if rest
    if (!shown.includes(todayPd) && todayPd >= 0 && todayPd < 84) shown.push(todayPd);
    shown.sort((a,b) => a-b);

    const container = document.getElementById('dn-btns');
    if (!container) return;
    container.innerHTML = shown.map(pd => {
      const isToday  = pd === todayPd;
      const isCurrent = pd === this.viewingPd;
      const date = new Date(this.startDate);
      date.setDate(date.getDate() + pd);
      const week = Math.floor(pd / 7) + 1;
      const info = getDayInfo(pd);
      const status = this.trackData[Store.dateToKey(date)];
      const doneIcon = status === 'done' ? ' ✓' : status === 'missed' ? ' ✗' : '';

      let cls = 'day-nav-btn';
      if (isCurrent) cls += ' current-day';

      const label = `W${week}D${(pd%7)+1}${doneIcon}`;
      return `<button class="${cls}" data-pd="${pd}" title="${date.toDateString()}${info?' — '+info.label:' — REST'}">${label}</button>`;
    }).join('');

    container.querySelectorAll('.day-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.viewingPd = parseInt(btn.dataset.pd);
        this.renderContent();
        this.buildDayButtons();
      });
    });
  },

  renderContent() {
    this.buildDayButtons();
    const pd   = this.viewingPd;
    const info = getDayInfo(pd);
    const date = new Date(this.startDate);
    date.setDate(date.getDate() + pd);
    const key    = Store.dateToKey(date);
    const status = this.trackData[key];
    const today  = new Date(); today.setHours(0,0,0,0);
    const isToday = date.getTime() === today.getTime();

    const mainEl    = document.getElementById('wo-content');
    const sidebarEl = document.getElementById('wo-sidebar');
    if (!mainEl || !sidebarEl) return;

    if (!info) {
      mainEl.innerHTML = this.buildRestView(date, pd);
      sidebarEl.innerHTML = this.buildRestSidebar();
      return;
    }

    const mKey = `month${info.month}`;
    const mData = PROGRAM[mKey];
    const dayData = mData.days[info.type];

    mainEl.innerHTML = this.buildWorkoutMain(pd, info, dayData, date, key, status);
    sidebarEl.innerHTML = this.buildWorkoutSidebar(pd, info, dayData, date, key, status);

    this.bindCheckEvents(key, dayData);
    this.bindMarkDone(key, date, status, info, dayData);
    this.renderProgressRing(key, dayData);
    this.renderSetsTracker(key, dayData);
  },

  buildWorkoutMain(pd, info, dayData, date, key, status) {
    const week = Math.floor(pd / 7) + 1;
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday:'long' });
    const dateStr   = date.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    const checks    = Store.getChecksForDate(key);

    const exRows = dayData.exercises.map(ex => {
      if (ex.type === 'warmup') return `<div class="wo-note warmup"><div class="note-dot warmup-dot"></div>${ex.text}</div>`;
      if (ex.type === 'cooldown') return `<div class="wo-note cooldown"><div class="note-dot cooldown-dot"></div>${ex.text}</div>`;
      const isChecked = !!checks[ex.id];
      const noteHtml  = ex.note ? `<em style="font-size:11px;color:var(--muted);display:block">${ex.note}</em>` : '';
      return `
        <div class="ex-check-row ${isChecked?'is-checked':''}" data-ex="${ex.id}">
          <div class="check-box">${isChecked?'✓':''}</div>
          <div class="check-name">${ex.name}${noteHtml}</div>
          <div class="check-sets"><strong>${ex.sets}</strong>${ex.reps}</div>
        </div>`;
    }).join('');

    const statusBanner = status === 'done'
      ? `<div style="padding:12px 16px;background:rgba(78,255,149,0.07);border:1px solid rgba(78,255,149,0.2);border-radius:10px;margin-bottom:16px;font-family:'DM Mono',monospace;font-size:12px;color:var(--green);letter-spacing:1px">✓ SESSION MARKED COMPLETE</div>`
      : status === 'missed'
      ? `<div style="padding:12px 16px;background:rgba(255,92,92,0.06);border:1px solid rgba(255,92,92,0.18);border-radius:10px;margin-bottom:16px;font-family:'DM Mono',monospace;font-size:12px;color:var(--red);letter-spacing:1px">✗ MARKED AS MISSED</div>`
      : '';

    return `
      <div class="wo-header">
        <div class="wo-day-badge">W<span>${week}</span></div>
        <div class="wo-day-info">
          <div class="wo-date-str">${dayOfWeek.toUpperCase()} · ${dateStr.toUpperCase()}</div>
          <div class="wo-type-str" style="color:${info.color}">${dayData.label}</div>
          ${dayData.goal ? `<div style="font-size:12px;color:var(--muted);margin-top:2px">${dayData.goal}</div>` : ''}
        </div>
      </div>
      ${statusBanner}
      <div style="margin-bottom:16px">
        <div class="section-head"><span class="section-sub">EXERCISE CHECKLIST</span><div class="section-line"></div></div>
        <div class="ex-check-list" id="ex-check-list">${exRows}</div>
      </div>`;
  },

  buildWorkoutSidebar(pd, info, dayData, date, key, status) {
    const isDone = status === 'done';
    return `
      <div style="margin-bottom:16px" id="wo-ring-wrap"></div>
      <div class="side-card" style="margin-bottom:16px">
        <div class="side-head">SET TRACKER</div>
        <div class="side-body" id="sets-tracker-body"></div>
      </div>
      <div class="side-card">
        <div class="side-head">SESSION</div>
        <div class="side-body">
          <div style="font-size:12px;color:var(--muted);line-height:1.6;margin-bottom:4px">
            Click exercises to check them off.<br>Mark the whole session done when finished.
          </div>
          <button class="mark-done-btn ${isDone?'is-done':''}" id="mark-done-btn">
            ${isDone ? '✓ SESSION COMPLETE — UNDO' : '⚡ MARK SESSION DONE'}
          </button>
          ${status === 'missed' ? `<button class="btn btn-secondary btn-full" style="margin-top:8px" id="un-missed-btn">UNMARK MISSED</button>` : ''}
        </div>
      </div>`;
  },

  buildRestView(date, pd) {
    const week = Math.floor(pd / 7) + 1;
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday:'long' });
    const dateStr   = date.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    return `
      <div class="wo-header">
        <div class="wo-day-badge">W<span>${week}</span></div>
        <div class="wo-day-info">
          <div class="wo-date-str">${dayOfWeek.toUpperCase()} · ${dateStr.toUpperCase()}</div>
          <div class="wo-type-str" style="color:var(--muted)">REST DAY</div>
        </div>
      </div>
      <div class="rest-day-card">
        <div class="rest-emoji">💤</div>
        <div class="rest-title">REST DAY</div>
        <div class="rest-sub">Recovery is part of the program.<br>Light walking, stretching, and hydration are encouraged.</div>
      </div>`;
  },

  buildRestSidebar() {
    return `
      <div class="side-card">
        <div class="side-head">REST TIPS</div>
        <div class="side-body">
          <div class="ex-row"><span class="ex-num">💧</span><span class="ex-name">Hydrate well</span></div>
          <div class="ex-row"><span class="ex-num">🥗</span><span class="ex-name">Eat high-protein meal</span></div>
          <div class="ex-row"><span class="ex-num">🧘</span><span class="ex-name">10 min light stretching</span></div>
          <div class="ex-row"><span class="ex-num">😴</span><span class="ex-name">Prioritize 7–9h sleep</span></div>
        </div>
      </div>`;
  },

  renderProgressRing(key, dayData) {
    const wrap = document.getElementById('wo-ring-wrap');
    if (!wrap) return;
    const exOnly = dayData.exercises.filter(e => !e.type);
    const total  = exOnly.length;
    const checks = Store.getChecksForDate(key);
    const done   = exOnly.filter(e => checks[e.id]).length;
    const pct    = total > 0 ? done/total : 0;
    const R = 40, C = 2*Math.PI*R;
    const offset = C * (1 - pct);

    wrap.innerHTML = `
      <div class="ex-progress-wrap">
        <svg class="ring-svg" width="90" height="90" viewBox="0 0 90 90">
          <circle class="ring-track" cx="45" cy="45" r="${R}"/>
          <circle class="ring-fill" cx="45" cy="45" r="${R}"
            stroke-dasharray="${C}" stroke-dashoffset="${offset}"
            style="${pct>=1?'stroke:var(--green)':''}"/>
          <text class="ring-text" x="45" y="45">${done}/${total}</text>
        </svg>
        <div class="ring-info">
          <div class="ring-title">EXERCISES</div>
          <div class="ring-sub">${done} of ${total} checked off</div>
          <div style="margin-top:8px">
            <div class="prog-track"><div class="prog-fill" style="background:var(--green);width:${Math.round(pct*100)}%"></div></div>
          </div>
        </div>
      </div>`;
  },

  renderSetsTracker(key, dayData) {
    const body = document.getElementById('sets-tracker-body');
    if (!body) return;
    const exOnly = dayData.exercises.filter(e => !e.type);
    const checks = Store.getChecksForDate(key);
    // For each exercise, show set dots
    body.innerHTML = `<div class="sets-tracker">` +
      exOnly.map(ex => {
        const setCount = ex.sets ? parseInt(ex.sets) || 3 : 3;
        const dots = Array.from({length: setCount}, (_, i) => {
          const isDone = !!(checks[`${ex.id}_set_${i}`]);
          return `<div class="set-dot ${isDone?'done':''}" data-ex="${ex.id}" data-set="${i}">${isDone?'✓':''}</div>`;
        }).join('');
        return `
          <div class="set-row">
            <span class="set-label">${ex.id}</span>
            <div class="set-dots">${dots}</div>
            <span class="set-reps">${ex.reps}</span>
          </div>`;
      }).join('') + `</div>`;

    // Bind set dot clicks
    body.querySelectorAll('.set-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const exId  = dot.dataset.ex;
        const setI  = dot.dataset.set;
        const storeKey = `${exId}_set_${setI}`;
        const curr  = Store.getChecksForDate(key)[storeKey];
        Store.setCheckForDate(key, storeKey, !curr);
        dot.classList.toggle('done', !curr);
        dot.textContent = !curr ? '✓' : '';
      });
    });
  },

  bindCheckEvents(key, dayData) {
    const list = document.getElementById('ex-check-list');
    if (!list) return;
    list.querySelectorAll('.ex-check-row').forEach(row => {
      row.addEventListener('click', () => {
        const exId = row.dataset.ex;
        if (!exId) return;
        const curr = !!Store.getChecksForDate(key)[exId];
        Store.setCheckForDate(key, exId, !curr);
        row.classList.toggle('is-checked', !curr);
        const box = row.querySelector('.check-box');
        if (box) { box.textContent = !curr ? '✓' : ''; }
        this.renderProgressRing(key, dayData);
      });
    });
  },

  bindMarkDone(key, date, status, info, dayData) {
    const btn = document.getElementById('mark-done-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDone = this.trackData[key] === 'done';
      if (isDone) {
        delete this.trackData[key];
      } else {
        this.trackData[key] = 'done';
      }
      Store.saveTrack(this.trackData);
      this.renderContent();
      HomePage.updateHeroStats();
      if (window.CalendarPage) CalendarPage.trackData = this.trackData;
    });

    const unMissed = document.getElementById('un-missed-btn');
    if (unMissed) {
      unMissed.addEventListener('click', () => {
        delete this.trackData[key];
        Store.saveTrack(this.trackData);
        this.renderContent();
        HomePage.updateHeroStats();
      });
    }
  },

  bindNavEvents(el) {
    el.querySelector('#dn-prev').addEventListener('click', () => {
      // Go to previous program day (any day)
      this.viewingPd = Math.max(0, this.viewingPd - 1);
      this.renderContent();
    });
    el.querySelector('#dn-next').addEventListener('click', () => {
      this.viewingPd = Math.min(83, this.viewingPd + 1);
      this.renderContent();
    });
  }
};
