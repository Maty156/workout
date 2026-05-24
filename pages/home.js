/* ════════════════════════════════════════════
   PAGES/HOME.JS — Program overview page
   Premium Version
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
      <div class="month-views-container">
        ${this.buildMonthView(1)}
        ${this.buildMonthView(2)}
        ${this.buildMonthView(3)}
      </div>
    `;
  },

  buildHero() {
    return `
    <div class="hero anim-fade-in">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-tag font-mono">${Icons.get('activity', { size: 12, color: 'var(--accent)' })} 12-WEEK PROGRESSIVE PROGRAM</div>
          <h1 class="hero-title font-bebas">CALI<span>X</span> TRANSFORMATION</h1>
          <p class="hero-desc">From foundation to elite mastery. A zero-equipment, results-driven calisthenics methodology.</p>
        </div>
        <div class="hero-stats-grid">
          <div class="h-stat glass">
            <div class="h-stat-icon">${Icons.get('check', { size: 16, color: 'var(--m1)' })}</div>
            <div class="h-stat-num font-bebas" id="hs-done">0</div>
            <div class="h-stat-label">SESSIONS</div>
          </div>
          <div class="h-stat glass">
            <div class="h-stat-icon">${Icons.get('flame', { size: 16, color: 'var(--m2)' })}</div>
            <div class="h-stat-num font-bebas" id="hs-streak">0</div>
            <div class="h-stat-label">STREAK</div>
          </div>
          <div class="h-stat glass">
            <div class="h-stat-icon">${Icons.get('trophy', { size: 16, color: 'var(--accent)' })}</div>
            <div class="h-stat-num font-bebas" id="hs-pct">0%</div>
            <div class="h-stat-label">COMPLETE</div>
          </div>
        </div>
      </div>
    </div>`;
  },

  buildMonthTabs() {
    return `
    <div class="month-tabs-wrap glass">
      <div class="month-tabs">
        <button class="month-tab active" data-m="1">
          <span class="m-t-num">01</span><span class="m-t-lbl">FOUNDATION</span>
        </button>
        <button class="month-tab" data-m="2">
          <span class="m-t-num">02</span><span class="m-t-lbl">INTENSITY</span>
        </button>
        <button class="month-tab" data-m="3">
          <span class="m-t-num">03</span><span class="m-t-lbl">MASTERY</span>
        </button>
      </div>
    </div>`;
  },

  buildMonthView(m) {
    const key = `month${m}`;
    const data = PROGRAM[key];
    const stripKey = `month${m}`;
    const active = m === 1 ? 'active' : '';

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

    const dayKeys = Object.keys(data.days);
    const dsBtns = dayKeys.map((dk, i) => {
      const d = data.days[dk];
      return `<button class="ds-btn m${m}-ds ${i===0?'active':''}" data-day="${dk}" data-month="${m}">${d.label}</button>`;
    }).join('');

    const panels = dayKeys.map((dk, i) => {
      const d = data.days[dk];
      return `
        <div class="day-panel anim-fade-in ${i===0?'active':''}" id="m${m}-panel-${dk}">
          <div class="prog-grid">
            ${this.buildWorkoutCard(d, m)}
            ${this.buildInfoCard(data, d, m)}
          </div>
        </div>`;
    }).join('');

    return `
    <div class="month-view ${active}" id="mv-${m}">
      <div class="month-header-row">
        <div class="m-badge" style="background:${data.color}22; color:${data.color}">WEEKS ${data.weeks}</div>
        <h2 class="m-title font-bebas">${data.label}</h2>
        <div class="m-freq font-mono">${data.freq}</div>
      </div>

      <div class="section-head"><span class="section-sub">CALENDAR PATTERN</span><div class="section-line"></div></div>
      <div class="week-strip glass">${strip}</div>

      <div class="section-head"><span class="section-sub">WORKOUT LIBRARIES</span><div class="section-line"></div></div>
      <div class="day-selector glass" id="ds-m${m}">${dsBtns}</div>

      ${panels}

      <div class="tips-grid">
        ${data.tips.map(t => `
          <div class="tip-card glass">
            <div class="tip-label">${t.label}</div>
            <div class="tip-val">${t.val}</div>
          </div>`).join('')}
      </div>
    </div>`;
  },

  buildWorkoutCard(dayData, m) {
    const exRows = dayData.exercises.map((ex, idx) => {
      if (ex.type === 'warmup') {
        return `<div class="note-row warmup">${Icons.get('flame', { size: 12 })} <span>WARM-UP INCLUDED</span></div>`;
      }
      if (ex.type === 'cooldown') {
        return `<div class="note-row cooldown">${Icons.get('snowflake', { size: 12 })} <span>COOL-DOWN INCLUDED</span></div>`;
      }
      return `
        <div class="ex-row">
          <span class="ex-num">${ex.id}</span>
          <span class="ex-name">${ex.name}</span>
          <span class="ex-sets"><strong>${ex.sets} SETS</strong>${ex.reps}</span>
        </div>`;
    }).join('');

    return `
      <div class="card glass">
        <div class="card-head">
          <span class="card-title">${dayData.label}</span>
          <span class="tag ${dayData.tag}">${dayData.days}</span>
        </div>
        <div class="card-body">
          ${exRows}
        </div>
      </div>`;
  },

  buildInfoCard(mData, dayData, m) {
    const info = mData.info;
    const color = m === 1 ? 'var(--m1)' : m === 2 ? 'var(--m2)' : 'var(--m3)';
    return `
      <div class="card glass">
        <div class="card-head">
          <span class="card-title">PROGRAM NOTES</span>
          <span class="tag tag-info">${Icons.get('lightbulb', { size: 10 })} GUIDANCE</span>
        </div>
        <div class="card-body">
          <div class="info-items">
            ${dayData.goal ? `<div class="info-item"><div class="info-label">FOCUS</div><div class="info-text">${dayData.goal}</div></div>` : ''}
            <div class="info-item"><div class="info-label">MONTHLY GOAL</div><div class="info-text">${info.goal}</div></div>
            <div class="info-item"><div class="info-label">RECOVERY</div><div class="info-text">${info.rest}</div></div>
            <div class="info-highlight" style="border-left: 2px solid ${color}">
              <div class="info-text" style="color:var(--text); font-weight: 500;">${info.highlight}</div>
            </div>
          </div>
        </div>
      </div>`;
  },

  bindEvents(el) {
    el.querySelectorAll('.month-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const m = tab.dataset.m;
        el.querySelectorAll('.month-tab').forEach(t => t.classList.remove('active'));
        el.querySelectorAll('.month-view').forEach(v => v.classList.remove('active'));
        tab.classList.add('active');
        el.querySelector('#mv-' + m).classList.add('active');
      });
    });

    el.querySelectorAll('.ds-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = btn.dataset.month;
        const day = btn.dataset.day;
        const dsEl = el.querySelector('#ds-m' + m);
        dsEl.querySelectorAll('.ds-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
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
