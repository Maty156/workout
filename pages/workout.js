/* ════════════════════════════════════════════
   PAGES/WORKOUT.JS — Fully guided session flow
   Premium Version
   ════════════════════════════════════════════ */

window.WorkoutPage = {

  /* ─── STATE ─── */
  trackData:   {},
  startDate:   null,
  viewingPd:   0,       
  sessionState: null,   

  /* ─── INIT ─── */
  init() {
    this.startDate = Store.getStartDate();
    this.trackData = Store.loadTrack();
    const today = new Date(); today.setHours(0,0,0,0);
    this.viewingPd = Math.max(0, Store.getProgramDay(today, this.startDate));
    this.render();
  },

  refresh() {
    this.trackData = Store.loadTrack();
    this.startDate = Store.getStartDate();
    this.renderDayPicker();
    this.renderOverview();
  },

  /* ══════════════════════════════════════════
     RENDER SHELL
  ══════════════════════════════════════════ */
  render() {
    const el = document.getElementById('page-workout');
    el.innerHTML = `
      <div id="day-picker-wrap" class="anim-fade-in"></div>
      <div id="wo-overview" class="anim-fade-up"></div>
      <div id="wo-flow" class="session-flow anim-fade-in"></div>
    `;
    this.renderDayPicker();
    this.renderOverview();
  },

  /* ══════════════════════════════════════════
     DAY PICKER
  ══════════════════════════════════════════ */
  renderDayPicker() {
    const wrap = document.getElementById('day-picker-wrap');
    if (!wrap) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const todayPd = Store.getProgramDay(today, this.startDate);

    const pds = [];
    for (let offset = -14; offset <= 14; offset++) {
      const pd = todayPd + offset;
      if (pd < 0 || pd >= 84) continue;
      if (getDayInfo(pd)) pds.push(pd);
    }
    if (!pds.includes(this.viewingPd) && this.viewingPd >= 0 && this.viewingPd < 84) {
      pds.push(this.viewingPd); pds.sort((a,b) => a-b);
    }

    const btnHtml = pds.map(pd => {
      const info   = getDayInfo(pd);
      const date   = new Date(this.startDate); date.setDate(date.getDate() + pd);
      const key    = Store.dateToKey(date);
      const status = this.trackData[key];
      const isActive  = pd === this.viewingPd;
      const isToday   = pd === todayPd;
      const isDone    = status === 'done';
      const isMissed  = status === 'missed';
      
      let cls = 'dp-btn glass';
      if (isActive)  cls += ' dp-active';
      else if (isDone)   cls += ' dp-done';
      else if (isMissed) cls += ' dp-missed';
      else if (isToday)  cls += ' dp-today';
      
      const icon = isDone ? Icons.get('check', { size: 10, class:'dp-icon' }) : '';
      return `<button class="${cls}" data-pd="${pd}">
        <span class="dp-week">W${Math.floor(pd/7)+1}</span>
        <span class="dp-day">D${(pd%7)+1}</span>
        ${icon}
      </button>`;
    }).join('');

    wrap.innerHTML = `
      <div class="day-picker-container">
        <button class="dp-arrow glass" id="dp-prev">${Icons.get('arrowLeft', { size: 16 })}</button>
        <div class="dp-scroll" id="dp-scroll">${btnHtml}</div>
        <button class="dp-arrow glass" id="dp-next">${Icons.get('arrowRight', { size: 16 })}</button>
      </div>`;

    wrap.querySelectorAll('.dp-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.sessionState = null;
        this.viewingPd = parseInt(btn.dataset.pd);
        this.renderDayPicker();
        this.renderOverview();
        this.hideFlow();
      });
    });
    wrap.querySelector('#dp-prev').addEventListener('click', () => {
      const newPd = this.viewingPd - 1;
      if (newPd >= 0) { this.sessionState = null; this.viewingPd = newPd; this.renderDayPicker(); this.renderOverview(); this.hideFlow(); }
    });
    wrap.querySelector('#dp-next').addEventListener('click', () => {
      const newPd = this.viewingPd + 1;
      if (newPd < 84) { this.sessionState = null; this.viewingPd = newPd; this.renderDayPicker(); this.renderOverview(); this.hideFlow(); }
    });

    setTimeout(() => {
      const active = wrap.querySelector('.dp-active');
      if (active) active.scrollIntoView({ inline:'center', behavior:'smooth' });
    }, 50);
  },

  /* ══════════════════════════════════════════
     OVERVIEW
  ══════════════════════════════════════════ */
  renderOverview() {
    const el = document.getElementById('wo-overview');
    if (!el) return;
    const pd   = this.viewingPd;
    const info = getDayInfo(pd);

    if (!info) { el.innerHTML = this.buildRestView(pd); return; }

    const date   = new Date(this.startDate); date.setDate(date.getDate() + pd);
    const key    = Store.dateToKey(date);
    const status = this.trackData[key];
    const checks = Store.getChecksForDate(key);
    const exOnly = info.dayData.exercises.filter(e => !e.type);
    const totalMins = this.estimateTime(info.dayData);
    const muscles = [...new Set(exOnly.map(e => e.muscle).filter(Boolean).join(' · ').split(' · '))];

    el.innerHTML = `
      <div class="session-overview-layout">
        <div class="ov-main">
          ${this.buildOverviewHeader(info, date, pd)}
          ${this.buildExPreviewList(info, checks, key)}
          
          <div class="ov-actions">
            <button class="btn btn-primary btn-full start-session-btn ${status==='done'?'is-done':''}" id="start-btn" style="height: 56px; font-size: 16px;">
              ${status==='done' ? Icons.get('rotate', { size: 18 }) + ' REDO SESSION' : this.sessionState ? Icons.get('play', { size: 18 }) + ' RESUME SESSION' : Icons.get('play', { size: 18 }) + ' START SESSION'}
            </button>
            ${status==='done' ? `<button class="btn btn-secondary btn-full" style="margin-top:12px" id="undo-done-btn">UNDO COMPLETION</button>` : ''}
          </div>
        </div>

        <div class="ov-sidebar">
          <div class="ov-stat-card glass">
            <div class="ov-stat-label">SESSION INFO</div>
            <div class="ov-stat-grid">
              <div class="ov-stat-box"><div class="stat-v color-m${info.month}">${exOnly.length}</div><div class="stat-l">EXERCISES</div></div>
              <div class="ov-stat-box"><div class="stat-v" style="color:var(--accent)">${totalMins}</div><div class="stat-l">MINUTES</div></div>
            </div>
          </div>

          <div class="ov-stat-card glass">
            <div class="ov-stat-label">MUSCLES TARGETED</div>
            <div class="muscle-tags">${muscles.map(m=>`<span class="muscle-tag">${m}</span>`).join('')}</div>
          </div>

          <div class="ov-stat-card glass">
            <div class="ov-stat-label">GOAL</div>
            <div class="ov-goal-text">${info.dayData.goal}</div>
          </div>
        </div>
      </div>`;

    document.getElementById('start-btn').addEventListener('click', () => this.startSession(pd, info));
    const undoBtn = document.getElementById('undo-done-btn');
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        delete this.trackData[key];
        Store.saveTrack(this.trackData);
        this.renderOverview(); this.renderDayPicker();
        HomePage.updateHeroStats();
      });
    }
  },

  buildOverviewHeader(info, date, pd) {
    const week = Math.floor(pd/7)+1;
    const ds   = date.toLocaleDateString('en-US', { weekday:'long', month:'short', day:'numeric' });
    return `
      <div class="ov-header">
        <div class="ov-badge" style="background:${info.color}22; color:${info.color}">WEEK ${week}</div>
        <h1 class="ov-title font-bebas">${info.label}</h1>
        <div class="ov-meta font-mono">${ds.toUpperCase()}</div>
      </div>`;
  },

  buildExPreviewList(info, checks, key) {
    const exs = info.dayData.exercises;
    const rows = exs.map(ex => {
      let icon = Icons.get('dumbbell', { size: 16, color: 'var(--muted)' });
      let label = ex.name;
      let meta = `<strong>${ex.sets} sets</strong> · ${ex.reps}`;

      if (ex.type === 'warmup') {
        icon = Icons.get('flame', { size: 16, color: 'var(--m1)' });
        label = 'Warm-up Routine'; meta = '5-7 min';
      } else if (ex.type === 'cooldown') {
        icon = Icons.get('snowflake', { size: 16, color: 'var(--m3)' });
        label = 'Cool-down Stretches'; meta = '5-10 min';
      }

      return `<div class="ov-ex-row glass">
        <div class="ov-ex-icon">${icon}</div>
        <div class="ov-ex-info">
          <div class="ov-ex-name">${label}</div>
          <div class="ov-ex-meta">${meta}</div>
        </div>
      </div>`;
    }).join('');
    
    return `<div class="ov-ex-list">${rows}</div>`;
  },

  estimateTime(dayData) {
    const exs = dayData.exercises.filter(e => !e.type);
    let secs = 600; // warmup + cooldown approx
    exs.forEach(ex => { secs += ex.sets * (ex.isTimed ? ex.defaultSecs : 45) + ex.sets * ex.restSecs; });
    return Math.round(secs/60);
  },

  buildRestView(pd) {
    return `
      <div class="rest-day-hero anim-fade-up">
        <div class="rd-icon">${Icons.get('clock', { size: 64, color: 'var(--muted)' })}</div>
        <h1 class="font-bebas">REST & RECOVER</h1>
        <p>Recovery is where the growth happens. Use today to hydrate, stretch, and sleep well.</p>
        <div class="rd-tips-grid">
          <div class="rd-tip-card glass">
            <div class="rd-tip-icon">💧</div>
            <div class="rd-tip-title">HYDRATE</div>
          </div>
          <div class="rd-tip-card glass">
            <div class="rd-tip-icon">🥩</div>
            <div class="rd-tip-title">PROTEIN</div>
          </div>
          <div class="rd-tip-card glass">
            <div class="rd-tip-icon">🧘</div>
            <div class="rd-tip-title">STRETCH</div>
          </div>
        </div>
      </div>`;
  },

  /* ══════════════════════════════════════════
     SESSION FLOW
  ══════════════════════════════════════════ */
  startSession(pd, info) {
    const date = new Date(this.startDate); date.setDate(date.getDate()+pd);
    const key  = Store.dateToKey(date);

    if (!this.sessionState) {
      const steps = this.buildSteps(info.dayData, key);
      this.sessionState = { pd, info, key, steps, stepIdx: 0, startTime: Date.now() };
    }

    document.getElementById('wo-overview').style.display = 'none';
    document.getElementById('day-picker-wrap').style.display = 'none';
    const flowEl = document.getElementById('wo-flow');
    flowEl.classList.add('active');
    this.renderStep();
  },

  buildSteps(dayData, key) {
    const steps = [];
    const exercises = dayData.exercises.filter(e => !e.type);
    steps.push({ type:'warmup' });
    exercises.forEach((ex, idx) => {
      steps.push({ type:'exercise', ex, key });
      if (idx < exercises.length - 1) {
        steps.push({ type:'rest', restSecs: ex.restSecs, nextEx: exercises[idx+1] });
      }
    });
    steps.push({ type:'cooldown' });
    steps.push({ type:'done' });
    return steps;
  },

  renderStep() {
    const { steps, stepIdx } = this.sessionState;
    const step = steps[stepIdx];
    const flowEl = document.getElementById('wo-flow');
    const pct = Math.round((stepIdx / (steps.length - 1)) * 100);

    flowEl.innerHTML = `
      <div class="flow-container">
        <div class="flow-header">
          <div class="flow-progress">
            <div class="flow-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="flow-nav-top">
             <div class="flow-phase">${this.phaseLabel(step)}</div>
             <div class="flow-step-num font-mono">${stepIdx+1} / ${steps.length}</div>
          </div>
        </div>
        <div id="step-body" class="anim-fade-in"></div>
      </div>
    `;

    const body = document.getElementById('step-body');
    if (step.type === 'warmup')   this.renderWarmupStep(body, false);
    else if (step.type === 'cooldown') this.renderWarmupStep(body, true);
    else if (step.type === 'exercise') this.renderExerciseStep(body, step);
    else if (step.type === 'rest')     this.renderRestStep(body, step);
    else if (step.type === 'done')     this.renderDoneStep(body);
  },

  phaseLabel(step) {
    if (step.type === 'warmup')   return 'WARM-UP';
    if (step.type === 'cooldown') return 'COOL-DOWN';
    if (step.type === 'rest')     return 'REST';
    if (step.type === 'done')     return 'COMPLETE';
    if (step.type === 'exercise') return `EXERCISE ${step.ex.id}`;
    return '';
  },

  renderWarmupStep(body, isCooldown) {
    const moves = isCooldown ? COOLDOWN_STEPS : WARMUP_STEPS;
    const color = isCooldown ? 'var(--m3)' : 'var(--m1)';
    let moveIdx = 0;
    let timerInt = null;
    let remaining = moves[0].duration;
    let isRunning = false;

    const build = () => {
      const move = moves[moveIdx];
      body.innerHTML = `
        <div class="wc-card glass">
          <div class="wc-header">
            <h2 style="color:${color}" class="font-bebas">${move.name}</h2>
            <p>${move.tip}</p>
          </div>
          <div class="wc-timer-section">
            <div class="wc-display font-bebas" id="wc-timer">${remaining}</div>
            <button class="btn btn-primary" id="wc-start-btn" style="background:${color}; color:#000; width: 140px;">
              ${isRunning ? Icons.get('pause', { size: 18 }) : Icons.get('play', { size: 18 })}
            </button>
          </div>
          <div class="wc-list">
            ${moves.map((m,i) => `
              <div class="wc-item ${i===moveIdx?'active':i<moveIdx?'done':''}">
                <div class="wc-dot"></div>
                <span>${m.name}</span>
                <span class="font-mono">${m.duration}s</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="flow-footer">
           <button class="btn btn-secondary" id="wc-exit">${Icons.get('x', { size: 16 })} EXIT</button>
           <div style="display:flex; gap:10px;">
             ${moveIdx > 0 ? `<button class="btn btn-secondary" id="wc-back">BACK</button>` : ''}
             <button class="btn btn-secondary" id="wc-skip">${moveIdx === moves.length-1 ? 'FINISH' : 'SKIP'}</button>
           </div>
        </div>`;

      document.getElementById('wc-start-btn').addEventListener('click', () => {
        if (isRunning) { clearInterval(timerInt); isRunning = false; build(); }
        else {
          isRunning = true; build();
          timerInt = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
              clearInterval(timerInt); this.beep();
              if (moveIdx < moves.length-1) { moveIdx++; remaining = moves[moveIdx].duration; isRunning=false; build(); }
              else this.advance();
            } else {
              const d = document.getElementById('wc-timer'); if (d) d.textContent = remaining;
            }
          }, 1000);
        }
      });
      document.getElementById('wc-skip').addEventListener('click', () => {
        clearInterval(timerInt);
        if (moveIdx < moves.length-1) { moveIdx++; remaining = moves[moveIdx].duration; build(); }
        else this.advance();
      });
      if (moveIdx > 0) document.getElementById('wc-back').addEventListener('click', () => { clearInterval(timerInt); moveIdx--; remaining = moves[moveIdx].duration; build(); });
      document.getElementById('wc-exit').addEventListener('click', () => { clearInterval(timerInt); this.exitSession(); });
    };
    build();
  },

  renderExerciseStep(body, step) {
    const { ex, key } = step;
    const checks = Store.getChecksForDate(key);
    
    body.innerHTML = `
      <div class="ex-step-layout">
        <div class="ex-main glass">
          <div class="ex-header-row">
            <h1 class="font-bebas">${ex.name}</h1>
            <div class="tag tag-info">${ex.muscle}</div>
          </div>
          <div class="ex-tip glass"><span style="color:var(--accent)">${Icons.get('lightbulb', { size: 14 })} TIP:</span> ${ex.tip}</div>
          <div class="ex-cues">
            ${(ex.cues||[]).map((c,i) => `<div class="cue-row"><span class="font-mono">${i+1}</span><p>${c}</p></div>`).join('')}
          </div>
        </div>
        <div class="ex-tracker glass">
           <div class="tracker-head font-bebas">SET TRACKER</div>
           <div class="tracker-body" id="tracker-body"></div>
        </div>
      </div>
      <div class="flow-footer">
        <button class="btn btn-secondary" id="ex-exit">EXIT</button>
        <div style="display:flex; gap:10px;">
          <button class="btn btn-secondary" id="ex-prev">BACK</button>
          <button class="btn btn-primary" id="ex-next">NEXT ${Icons.get('arrowRight', { size: 16 })}</button>
        </div>
      </div>`;

    this.renderSetRows(ex, key, checks);
    document.getElementById('ex-next').addEventListener('click', () => this.advance());
    document.getElementById('ex-prev').addEventListener('click', () => this.goBack());
    document.getElementById('ex-exit').addEventListener('click', () => this.exitSession());
  },

  renderSetRows(ex, key, checks) {
    const body = document.getElementById('tracker-body');
    body.innerHTML = Array.from({length: ex.sets}, (_,i) => {
      const done = !!checks[`${ex.id}_set_${i}`];
      return `
        <div class="set-row-item glass ${done?'is-done':''}" data-set="${i}">
           <div class="sr-label font-mono">SET ${i+1}</div>
           <div class="sr-reps">${ex.reps}</div>
           <button class="sr-check ${done?'checked':''}">${done ? Icons.get('check', { size: 14 }) : ''}</button>
        </div>
      `;
    }).join('');

    body.querySelectorAll('.set-row-item').forEach(row => {
      row.addEventListener('click', () => {
        const i = parseInt(row.dataset.set);
        const k = `${ex.id}_set_${i}`;
        const curr = !!Store.getChecksForDate(key)[k];
        Store.setCheckForDate(key, k, !curr);
        this.renderSetRows(ex, key, Store.getChecksForDate(key));
      });
    });
  },

  renderRestStep(body, step) {
    const { restSecs, nextEx } = step;
    let remaining = restSecs;
    let isRunning = true;
    
    body.innerHTML = `
      <div class="rest-card glass">
        <div class="rest-label font-mono">REST PERIOD</div>
        <div class="rest-timer font-bebas" id="rest-timer">${remaining}</div>
        <div class="rest-next-label">NEXT UP</div>
        <div class="rest-next-name">${nextEx.name}</div>
        <div class="rest-actions">
           <button class="btn btn-secondary" id="rest-pause">${Icons.get('pause', { size: 16 })}</button>
           <button class="btn btn-primary" id="rest-skip" style="flex:1">SKIP REST</button>
        </div>
      </div>
      <div class="flow-footer">
        <button class="btn btn-secondary" id="rest-exit">EXIT</button>
        <button class="btn btn-secondary" id="rest-back">BACK</button>
      </div>`;

    const timer = setInterval(() => {
      if (!isRunning) return;
      remaining--;
      if (remaining <= 0) { clearInterval(timer); this.beep(); this.advance(); }
      else { const d = document.getElementById('rest-timer'); if (d) d.textContent = remaining; }
    }, 1000);

    document.getElementById('rest-pause').addEventListener('click', () => {
      isRunning = !isRunning;
      document.getElementById('rest-pause').innerHTML = isRunning ? Icons.get('pause', { size: 16 }) : Icons.get('play', { size: 16 });
    });
    document.getElementById('rest-skip').addEventListener('click', () => { clearInterval(timer); this.advance(); });
    document.getElementById('rest-back').addEventListener('click', () => { clearInterval(timer); this.goBack(); });
    document.getElementById('rest-exit').addEventListener('click', () => { clearInterval(timer); this.exitSession(); });
  },

  renderDoneStep(body) {
    const { pd, key, startTime, info, steps } = this.sessionState;
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    this.trackData[key] = 'done';
    Store.saveTrack(this.trackData);
    HomePage.updateHeroStats();

    body.innerHTML = `
      <div class="done-hero anim-fade-up">
        <div class="done-icon">${Icons.get('trophy', { size: 80, color: 'var(--accent)' })}</div>
        <h1 class="font-bebas">SESSION COMPLETE!</h1>
        <p>Great work. Progress is made in every single rep.</p>
        <div class="done-stats-grid">
           <div class="done-stat-box glass"><div class="v">${elapsed}</div><div class="l">MINUTES</div></div>
           <div class="done-stat-box glass"><div class="v">${steps.filter(s=>s.type==='exercise').length}</div><div class="l">EXERCISES</div></div>
        </div>
        <button class="btn btn-primary btn-full" id="done-finish" style="margin-top:32px; height: 56px;">BACK TO PROGRAM</button>
      </div>`;

    document.getElementById('done-finish').addEventListener('click', () => {
      this.sessionState = null;
      this.hideFlow();
      this.renderDayPicker();
      this.renderOverview();
    });
  },

  /* ── NAVIGATION ── */
  advance() {
    this.sessionState.stepIdx = Math.min(this.sessionState.stepIdx + 1, this.sessionState.steps.length - 1);
    this.renderStep();
  },
  goBack() {
    this.sessionState.stepIdx = Math.max(this.sessionState.stepIdx - 1, 0);
    this.renderStep();
  },
  exitSession() {
    this.sessionState = null;
    this.hideFlow();
    this.renderOverview();
    this.renderDayPicker();
  },
  hideFlow() {
    const flowEl = document.getElementById('wo-flow');
    if (flowEl) { flowEl.classList.remove('active'); flowEl.innerHTML = ''; }
    const ov = document.getElementById('wo-overview');
    if (ov) ov.style.display = '';
    const dp = document.getElementById('day-picker-wrap');
    if (dp) dp.style.display = '';
  },

  beep() {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      [0, 0.15, 0.3].forEach(t => {
        const osc = ctx.createOscillator(); const g = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.frequency.value = 880;
        g.gain.setValueAtTime(0.2, ctx.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+0.1);
        osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+0.12);
      });
    } catch(e) {}
  }
};
