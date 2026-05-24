/* ════════════════════════════════════════════
   PAGES/WORKOUT.JS — Fully guided session flow
   State machine: overview → warmup → exercise
   → rest → exercise → ... → cooldown → done
   ════════════════════════════════════════════ */

window.WorkoutPage = {

  /* ─── STATE ─── */
  trackData:   {},
  startDate:   null,
  viewingPd:   0,       // program day shown
  sessionState: null,   // null | session object

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
      <div id="day-picker-wrap"></div>
      <div id="wo-overview"></div>
      <div id="wo-flow" class="session-flow"></div>
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

    // Collect workout days ±21 from today
    const pds = [];
    for (let offset = -21; offset <= 21; offset++) {
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
      const week   = Math.floor(pd/7)+1;
      const isActive  = pd === this.viewingPd;
      const isToday   = pd === todayPd;
      const isDone    = status === 'done';
      const isMissed  = status === 'missed';
      let cls = 'dp-btn';
      if (isActive)  cls += ' dp-active';
      else if (isDone)   cls += ' dp-done';
      else if (isMissed) cls += ' dp-missed';
      else if (isToday)  cls += ' dp-today';
      const icon = isDone ? ' ✓' : isMissed ? ' ✗' : '';
      return `<button class="${cls}" data-pd="${pd}" title="${date.toDateString()} — ${info.label}">W${week}D${(pd%7)+1}${icon}</button>`;
    }).join('');

    wrap.innerHTML = `
      <div class="day-picker">
        <button class="dp-arrow" id="dp-prev">&#8249;</button>
        <div class="dp-scroll" id="dp-scroll">${btnHtml}</div>
        <button class="dp-arrow" id="dp-next">&#8250;</button>
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

    // Scroll active button into view
    setTimeout(() => {
      const active = wrap.querySelector('.dp-active');
      if (active) active.scrollIntoView({ inline:'center', behavior:'smooth' });
    }, 50);
  },

  /* ══════════════════════════════════════════
     OVERVIEW (before starting session)
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
    const today  = new Date(); today.setHours(0,0,0,0);
    const isToday = date.getTime() === today.getTime();
    const exOnly = info.dayData.exercises.filter(e => !e.type);
    const checks = Store.getChecksForDate(key);
    const completedSets = exOnly.filter(e => {
      for (let s=0; s<e.sets; s++) if (!checks[`${e.id}_set_${s}`]) return false;
      return true;
    }).length;
    const totalMins = this.estimateTime(info.dayData);

    // Build muscle group list
    const muscles = [...new Set(exOnly.map(e => e.muscle).filter(Boolean).join(' · ').split(' · '))];

    el.innerHTML = `
      <div class="session-overview">
        <div>
          ${this.buildOverviewHeader(info, date, pd)}
          ${this.buildExPreviewList(info, checks, key)}
          <button class="start-session-btn ${status==='done'?'is-done':''}" id="start-btn">
            ${status==='done' ? '✓ SESSION COMPLETE — REDO' : this.sessionState ? '▶ RESUME SESSION' : '▶ START SESSION'}
          </button>
          ${status==='done' ? `<button class="btn btn-secondary btn-full" style="margin-top:8px" id="undo-done-btn">UNDO COMPLETION</button>` : ''}
        </div>

        <div class="ov-sidebar">
          <div class="ov-stat-card">
            <div class="ov-stat-label">SESSION STATS</div>
            <div class="ov-stat-row">
              <div class="ov-stat-item"><div class="ov-stat-num color-m${info.month}">${exOnly.length}</div><div class="ov-stat-sub">EXERCISES</div></div>
              <div class="ov-stat-item"><div class="ov-stat-num" style="color:var(--accent)">${totalMins}</div><div class="ov-stat-sub">MIN EST.</div></div>
              <div class="ov-stat-item"><div class="ov-stat-num color-green">${completedSets}/${exOnly.length}</div><div class="ov-stat-sub">DONE</div></div>
            </div>
          </div>

          <div class="ov-stat-card">
            <div class="ov-stat-label">MUSCLES TODAY</div>
            <div style="margin-top:4px">${muscles.map(m=>`<span class="muscle-badge">${m}</span>`).join('')}</div>
          </div>

          <div class="ov-stat-card">
            <div class="ov-stat-label">PROGRAM PROGRESS</div>
            <div style="margin:8px 0 4px;display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)">
              <span>WEEK ${Math.floor(pd/7)+1} OF 12</span>
              <span>DAY ${pd+1} OF 84</span>
            </div>
            <div class="prog-track" style="margin-bottom:0">
              <div class="prog-fill" style="background:${info.color};width:${Math.round((pd/84)*100)}%"></div>
            </div>
          </div>

          ${status === 'done' ? `
          <div class="ov-stat-card" style="border-color:rgba(78,255,149,0.25);background:rgba(78,255,149,0.04)">
            <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--green);letter-spacing:1px">✓ COMPLETED</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px">This session is marked done. Great work.</div>
          </div>` : status === 'missed' ? `
          <div class="ov-stat-card" style="border-color:rgba(255,92,92,0.2);background:rgba(255,92,92,0.04)">
            <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--red);letter-spacing:1px">✗ MISSED</div>
            <div style="font-size:12px;color:var(--muted);margin-top:4px">Marked missed. Start the session to complete it.</div>
          </div>` : ''}
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
    const dow  = date.toLocaleDateString('en-US', { weekday:'long' });
    const ds   = date.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
    return `
      <div class="ov-header">
        <div class="ov-week-badge">W<span>${week}</span></div>
        <div class="ov-info">
          <div class="ov-date">${dow.toUpperCase()} · ${ds.toUpperCase()}</div>
          <div class="ov-type" style="color:${info.color}">${info.label}</div>
          <div class="ov-goal">${info.dayData.goal}</div>
        </div>
      </div>`;
  },

  buildExPreviewList(info, checks, key) {
    const exs = info.dayData.exercises;
    const rows = exs.map(ex => {
      if (ex.type === 'warmup') {
        return `<div class="ov-ex-item is-special">
          <span class="ov-ex-num">🔥</span>
          <span class="ov-ex-name">Warm-up (${WARMUP_STEPS.length} movements)</span>
          <span class="ov-ex-meta"><strong>~5 min</strong></span>
        </div>`;
      }
      if (ex.type === 'cooldown') {
        return `<div class="ov-ex-item is-special">
          <span class="ov-ex-num">🧊</span>
          <span class="ov-ex-name">Cool-down (${COOLDOWN_STEPS.length} stretches)</span>
          <span class="ov-ex-meta"><strong>~7 min</strong></span>
        </div>`;
      }
      // Check if all sets done
      let allDone = true;
      for (let s=0; s<ex.sets; s++) if (!checks[`${ex.id}_set_${s}`]) { allDone = false; break; }
      const indicator = allDone
        ? `<div class="ov-ex-done">✓</div>`
        : `<div class="ov-ex-pending"></div>`;
      return `<div class="ov-ex-item">
        ${indicator}
        <span class="ov-ex-num">${ex.id}</span>
        <span class="ov-ex-name">${ex.name}</span>
        <span class="ov-ex-meta"><strong>${ex.sets} sets</strong>${ex.reps}</span>
      </div>`;
    });
    return `
      <div class="section-head"><span class="section-sub">EXERCISES</span><div class="section-line"></div></div>
      <div class="ov-ex-list">${rows.join('')}</div>`;
  },

  estimateTime(dayData) {
    const exs = dayData.exercises.filter(e => !e.type);
    let secs = WARMUP_STEPS.reduce((s,w)=>s+w.duration,0)
             + COOLDOWN_STEPS.reduce((s,c)=>s+c.duration,0);
    exs.forEach(ex => { secs += ex.sets * (ex.isTimed ? ex.defaultSecs : 45) + ex.sets * ex.restSecs; });
    return Math.round(secs/60);
  },

  buildRestView(pd) {
    const week = Math.floor(pd/7)+1;
    const date = new Date(this.startDate); date.setDate(date.getDate()+pd);
    const dow  = date.toLocaleDateString('en-US',{weekday:'long'});
    return `
      <div class="rest-day-view anim-fade-up">
        <div class="rd-emoji">💤</div>
        <div class="rd-title">REST DAY</div>
        <div style="font-family:'DM Mono',monospace;font-size:11px;color:var(--muted);letter-spacing:1.5px;margin-top:8px">
          WEEK ${week} · ${dow.toUpperCase()}
        </div>
        <div class="rd-sub">Recovery is part of the program. Your muscles grow during rest, not during the workout.</div>
        <div class="rd-tips">
          <div class="rd-tip"><div class="rd-tip-icon">💧</div><div class="rd-tip-text">Hydrate well — at least 2L water today</div></div>
          <div class="rd-tip"><div class="rd-tip-icon">🥩</div><div class="rd-tip-text">High-protein meal to aid muscle repair</div></div>
          <div class="rd-tip"><div class="rd-tip-icon">🧘</div><div class="rd-tip-text">10 min light stretching or yoga</div></div>
          <div class="rd-tip"><div class="rd-tip-icon">😴</div><div class="rd-tip-text">Prioritise 7–9 hours of quality sleep</div></div>
        </div>
      </div>`;
  },

  /* ══════════════════════════════════════════
     SESSION FLOW ENGINE
  ══════════════════════════════════════════ */
  startSession(pd, info) {
    const date = new Date(this.startDate); date.setDate(date.getDate()+pd);
    const key  = Store.dateToKey(date);

    if (!this.sessionState) {
      // Build step sequence
      const steps = this.buildSteps(info.dayData, key);
      this.sessionState = { pd, info, key, steps, stepIdx: 0, startTime: Date.now() };
    }

    document.getElementById('wo-overview').style.display = 'none';
    const flowEl = document.getElementById('wo-flow');
    flowEl.classList.add('active');
    this.renderStep();
  },

  buildSteps(dayData, key) {
    const steps = [];
    const exercises = dayData.exercises.filter(e => !e.type);

    // WARMUP
    steps.push({ type:'warmup' });

    // Each exercise + rest after (except last)
    exercises.forEach((ex, idx) => {
      steps.push({ type:'exercise', ex, key });
      if (idx < exercises.length - 1) {
        steps.push({ type:'rest', restSecs: ex.restSecs, nextEx: exercises[idx+1] });
      }
    });

    // COOLDOWN
    steps.push({ type:'cooldown' });

    // DONE
    steps.push({ type:'done' });

    return steps;
  },

  renderStep() {
    const { steps, stepIdx } = this.sessionState;
    const step = steps[stepIdx];
    const flowEl = document.getElementById('wo-flow');

    // Progress bar
    const pct = Math.round((stepIdx / (steps.length - 1)) * 100);

    flowEl.innerHTML = `
      <div class="session-progress-bar">
        <div class="session-progress-fill" style="width:${pct}%"></div>
      </div>
      <div class="step-header">
        <span class="step-phase-badge ${step.type}">${this.phaseLabel(step)}</span>
        <span class="step-counter">${stepIdx+1} / ${steps.length}</span>
      </div>
      <div id="step-body"></div>
    `;

    const body = document.getElementById('step-body');

    if (step.type === 'warmup')   this.renderWarmupStep(body, false);
    if (step.type === 'cooldown') this.renderWarmupStep(body, true);
    if (step.type === 'exercise') this.renderExerciseStep(body, step);
    if (step.type === 'rest')     this.renderRestStep(body, step);
    if (step.type === 'done')     this.renderDoneStep(body);
  },

  phaseLabel(step) {
    if (step.type === 'warmup')   return 'WARM-UP';
    if (step.type === 'cooldown') return 'COOL-DOWN';
    if (step.type === 'rest')     return 'REST';
    if (step.type === 'done')     return 'SESSION COMPLETE';
    if (step.type === 'exercise') return `EXERCISE ${step.ex.id}`;
    return step.type.toUpperCase();
  },

  /* ── WARMUP / COOLDOWN STEP ── */
  renderWarmupStep(body, isCooldown) {
    const moves = isCooldown ? COOLDOWN_STEPS : WARMUP_STEPS;
    const color  = isCooldown ? 'var(--m3)' : 'var(--m1)';
    const title  = isCooldown ? 'COOL-DOWN' : 'WARM-UP';

    let moveIdx = 0;
    let timerInt = null;
    let remaining = moves[0].duration;
    let isRunning = false;

    const build = () => {
      const move = moves[moveIdx];
      body.innerHTML = `
        <div class="wc-step-card">
          <div class="wc-head">
            <div class="wc-move-name" style="color:${color}">${move.name}</div>
            <div class="wc-tip">${move.tip}</div>
          </div>
          <div class="wc-timer-body">
            <div style="font-family:'Bebas Neue',cursive;font-size:72px;letter-spacing:3px;color:${color}" id="wc-timer">${remaining}</div>
            <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);margin-bottom:16px">SECONDS</div>
            <button class="tsr-btn tsr-btn-start" id="wc-start-btn" style="background:${color};color:#0a0a0a;max-width:220px">
              ${isRunning ? 'PAUSE' : 'START'}
            </button>
          </div>
          <div class="wc-steps-list">
            ${moves.map((m,i) => {
              const cls = i < moveIdx ? 'done' : i === moveIdx ? `active${isCooldown?' cool':''}` : '';
              return `<div class="wc-step-item ${cls}">
                <div class="wc-step-dot"></div>
                <span class="wc-step-name">${m.name}</span>
                <span class="wc-step-dur">${m.duration}s</span>
              </div>`;
            }).join('')}
          </div>
        </div>
        <div class="step-nav" style="max-width:600px;margin:16px auto 0">
          <button class="step-nav-btn step-nav-exit" id="wc-exit-btn">EXIT SESSION</button>
          ${moveIdx > 0 ? `<button class="step-nav-btn step-nav-prev" id="wc-skip-back">← BACK</button>` : ''}
          <button class="step-nav-btn step-nav-next" id="wc-skip-btn">${moveIdx < moves.length-1 ? 'SKIP →' : 'DONE ✓'}</button>
        </div>`;

      document.getElementById('wc-start-btn').addEventListener('click', () => {
        if (isRunning) {
          clearInterval(timerInt); isRunning = false;
          document.getElementById('wc-start-btn').textContent = 'RESUME';
        } else {
          isRunning = true;
          document.getElementById('wc-start-btn').textContent = 'PAUSE';
          timerInt = setInterval(() => {
            remaining--;
            const td = document.getElementById('wc-timer');
            if (td) td.textContent = remaining;
            if (remaining <= 0) {
              clearInterval(timerInt); isRunning = false;
              this.beep();
              if (moveIdx < moves.length - 1) {
                moveIdx++; remaining = moves[moveIdx].duration; build();
              } else {
                this.advance();
              }
            }
          }, 1000);
        }
      });

      document.getElementById('wc-skip-btn').addEventListener('click', () => {
        clearInterval(timerInt);
        if (moveIdx < moves.length - 1) { moveIdx++; remaining = moves[moveIdx].duration; build(); }
        else this.advance();
      });

      const backBtn = document.getElementById('wc-skip-back');
      if (backBtn) {
        backBtn.addEventListener('click', () => {
          clearInterval(timerInt);
          moveIdx--; remaining = moves[moveIdx].duration; build();
        });
      }

      document.getElementById('wc-exit-btn').addEventListener('click', () => {
        clearInterval(timerInt); this.exitSession();
      });
    };

    build();
  },

  /* ── EXERCISE STEP ── */
  renderExerciseStep(body, step) {
    const { ex, key } = step;
    const checks = Store.getChecksForDate(key);
    const isTimed = !!ex.isTimed;

    body.innerHTML = `
      <div class="step-card">
        <div class="step-main">
          <div class="step-main-head">
            <div class="step-ex-name">${ex.name}</div>
            <div class="step-muscle">${ex.muscle || ''}</div>
          </div>
          <div class="step-tip-box"><span>💡 Tip:</span> ${ex.tip || 'Focus on quality reps.'}</div>
          <div class="step-cues">
            ${(ex.cues||[]).map((c,i) => `
              <div class="cue-item">
                <span class="cue-num">${i+1}</span>
                <span class="cue-text">${c}</span>
              </div>`).join('')}
          </div>
        </div>
        <div class="step-side" id="step-side">
          ${isTimed ? this.buildTimedSide(ex, key, checks) : this.buildSetTrackerSide(ex, key, checks)}
        </div>
      </div>
      <div class="step-nav">
        <button class="step-nav-btn step-nav-exit" id="ex-exit-btn">EXIT</button>
        <button class="step-nav-btn step-nav-prev" id="ex-prev-btn">← BACK</button>
        <button class="step-nav-btn step-nav-next" id="ex-next-btn">NEXT →</button>
      </div>`;

    if (isTimed) this.bindTimedEvents(ex, key);
    else this.bindSetTrackerEvents(ex, key);

    document.getElementById('ex-next-btn').addEventListener('click', () => this.advance());
    document.getElementById('ex-prev-btn').addEventListener('click', () => this.goBack());
    document.getElementById('ex-exit-btn').addEventListener('click', () => this.exitSession());
  },

  buildSetTrackerSide(ex, key, checks) {
    const rows = Array.from({length: ex.sets}, (_,i) => {
      const done = !!checks[`${ex.id}_set_${i}`];
      return `<div class="set-row">
        <span class="set-label">SET ${i+1}</span>
        <span class="set-reps-txt">${ex.reps}</span>
        <button class="set-tick ${done?'ticked':''}" data-set="${i}">${done?'✓':''}</button>
      </div>`;
    }).join('');

    const allDone = Array.from({length: ex.sets}, (_,i) => checks[`${ex.id}_set_${i}`]).every(Boolean);

    return `
      <div class="set-tracker-card">
        <div class="stc-head">
          SETS
          <span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)">${ex.sets} × ${ex.reps}</span>
        </div>
        <div class="stc-body" id="stc-body">${rows}</div>
      </div>
      <div class="ov-stat-card" style="padding:12px 14px">
        <div class="ov-stat-label">REST BETWEEN SETS</div>
        <div style="font-family:'Bebas Neue',cursive;font-size:28px;color:var(--m3)">${ex.restSecs}s</div>
        <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)">Quick timer below ↓</div>
      </div>
      <div id="mini-rest-wrap"></div>`;
  },

  buildTimedSide(ex, key, checks) {
    const dots = Array.from({length: ex.sets}, (_,i) => {
      const done = !!checks[`${ex.id}_set_${i}`];
      return `<div class="tsr-dot ${done?'done':''}" id="tsrdot-${i}"></div>`;
    }).join('');

    return `
      <div class="timed-set-card">
        <div class="stc-head">TIMED HOLD <span style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)">${ex.sets} SETS</span></div>
        <div class="timed-set-ring">
          <div class="tsr-set-num" id="tsr-setlabel">SET 1 OF ${ex.sets}</div>
          <div class="tsr-display" id="tsr-disp">${ex.defaultSecs}</div>
          <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted)">SECONDS</div>
          <div class="tsr-done-row" style="margin-top:14px;width:100%">${dots}</div>
          <button class="tsr-btn tsr-btn-start" id="tsr-start">START SET 1</button>
          <button class="tsr-btn tsr-btn-stop" id="tsr-stop" style="display:none">STOP</button>
        </div>
      </div>`;
  },

  bindSetTrackerEvents(ex, key) {
    let miniTimerInt = null;
    let currentSet   = null;

    const rebuildMini = (secs) => {
      let r = secs;
      const wrap = document.getElementById('mini-rest-wrap');
      if (!wrap) return;
      const C = 2*Math.PI*30;
      wrap.innerHTML = `
        <div style="background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:14px 16px;text-align:center">
          <div style="font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);margin-bottom:8px">MINI REST TIMER</div>
          <div style="position:relative;display:inline-block">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="30" fill="none" stroke="var(--surface2)" stroke-width="5"/>
              <circle id="mrt-ring" cx="40" cy="40" r="30" fill="none" stroke="var(--m3)" stroke-width="5"
                stroke-linecap="round" transform="rotate(-90 40 40)"
                stroke-dasharray="${C}" stroke-dashoffset="${C*(1-r/secs)}"/>
            </svg>
            <div id="mrt-num" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',cursive;font-size:22px;color:var(--text)">${r}</div>
          </div>
          <button id="mrt-btn" style="width:100%;margin-top:8px;padding:8px;border-radius:8px;border:1px solid var(--border2);background:var(--m3);color:#0a0a0a;font-family:'DM Mono',monospace;font-size:11px;cursor:pointer">START REST</button>
        </div>`;

      const update = () => {
        const ring = document.getElementById('mrt-ring');
        const num  = document.getElementById('mrt-num');
        if (!ring || !num) return;
        ring.setAttribute('stroke-dashoffset', C*(1-r/secs));
        num.textContent = r;
        if (r <= 0) {
          clearInterval(miniTimerInt); this.beep();
          num.textContent = '✓'; ring.style.stroke = 'var(--green)';
        }
      };

      document.getElementById('mrt-btn').addEventListener('click', () => {
        if (miniTimerInt) { clearInterval(miniTimerInt); miniTimerInt = null; document.getElementById('mrt-btn').textContent = 'RESUME'; return; }
        miniTimerInt = setInterval(() => { r--; update(); }, 1000);
        document.getElementById('mrt-btn').textContent = 'PAUSE';
      });
    };

    document.querySelectorAll('.set-tick').forEach(tick => {
      tick.addEventListener('click', () => {
        const i = parseInt(tick.dataset.set);
        const k = `${ex.id}_set_${i}`;
        const curr = !!Store.getChecksForDate(key)[k];
        Store.setCheckForDate(key, k, !curr);
        tick.classList.toggle('ticked', !curr);
        tick.textContent = !curr ? '✓' : '';

        if (!curr && i !== ex.sets - 1) {
          // just completed a set — show mini rest timer
          if (miniTimerInt) clearInterval(miniTimerInt);
          miniTimerInt = null;
          rebuildMini(ex.restSecs);
        }

        // Check if all sets done — auto mark session exercise done
        this.checkAutoComplete(ex, key);
      });
    });
  },

  bindTimedEvents(ex, key) {
    let currentSet = 0;
    let timerInt   = null;
    let remaining  = ex.defaultSecs;
    let running    = false;

    const checks = Store.getChecksForDate(key);
    // Find first incomplete set
    for (let i=0; i<ex.sets; i++) {
      if (!checks[`${ex.id}_set_${i}`]) { currentSet = i; break; }
    }
    remaining = ex.defaultSecs;

    const updateUI = () => {
      const disp = document.getElementById('tsr-disp');
      const lbl  = document.getElementById('tsr-setlabel');
      if (disp) {
        disp.textContent = remaining;
        disp.className = 'tsr-display' + (remaining <= 5 ? ' warning' : remaining === 0 ? ' done' : '');
      }
      if (lbl) lbl.textContent = `SET ${currentSet+1} OF ${ex.sets}`;
    };

    document.getElementById('tsr-start').addEventListener('click', () => {
      if (running) return;
      running = true;
      document.getElementById('tsr-start').style.display = 'none';
      document.getElementById('tsr-stop').style.display  = 'block';
      timerInt = setInterval(() => {
        remaining--;
        updateUI();
        if (remaining <= 0) {
          clearInterval(timerInt); running = false;
          this.beep();
          Store.setCheckForDate(key, `${ex.id}_set_${currentSet}`, true);
          const dot = document.getElementById(`tsrdot-${currentSet}`);
          if (dot) dot.classList.add('done');
          if (currentSet < ex.sets - 1) {
            currentSet++;
            remaining = ex.defaultSecs;
            document.getElementById('tsr-start').style.display = 'block';
            document.getElementById('tsr-stop').style.display  = 'none';
            document.getElementById('tsr-start').textContent = `START SET ${currentSet+1}`;
            updateUI();
          } else {
            document.getElementById('tsr-start').style.display = 'none';
            document.getElementById('tsr-stop').style.display  = 'none';
            const disp = document.getElementById('tsr-disp');
            if (disp) { disp.textContent = '✓'; disp.className = 'tsr-display done'; }
          }
          this.checkAutoComplete(ex, key);
        }
      }, 1000);
    });

    document.getElementById('tsr-stop').addEventListener('click', () => {
      clearInterval(timerInt); running = false;
      Store.setCheckForDate(key, `${ex.id}_set_${currentSet}`, true);
      const dot = document.getElementById(`tsrdot-${currentSet}`);
      if (dot) dot.classList.add('done');
      if (currentSet < ex.sets - 1) {
        currentSet++; remaining = ex.defaultSecs;
        document.getElementById('tsr-start').style.display = 'block';
        document.getElementById('tsr-stop').style.display  = 'none';
        document.getElementById('tsr-start').textContent = `START SET ${currentSet+1}`;
        updateUI();
      } else {
        document.getElementById('tsr-start').style.display = 'none';
        document.getElementById('tsr-stop').style.display  = 'none';
        const disp = document.getElementById('tsr-disp');
        if (disp) { disp.textContent = '✓'; disp.className = 'tsr-display done'; }
      }
      this.checkAutoComplete(ex, key);
    });
  },

  checkAutoComplete(ex, key) {
    const checks = Store.getChecksForDate(key);
    let all = true;
    for (let i=0; i<ex.sets; i++) if (!checks[`${ex.id}_set_${i}`]) { all = false; break; }
    if (all) {
      // Refresh overview's ex list item
      const item = document.querySelector(`.ov-ex-item[data-id="${ex.id}"]`);
      if (item) item.querySelector('.ov-ex-pending')?.classList.replace('ov-ex-pending','ov-ex-done');
    }
  },

  /* ── REST STEP ── */
  renderRestStep(body, step) {
    const { restSecs, nextEx } = step;
    const C = 2*Math.PI*90;
    let remaining = restSecs;
    let running   = false;
    let timerInt  = null;

    const build = () => {
      const offset = C * (1 - remaining/restSecs);
      body.innerHTML = `
        <div class="rest-step-card anim-fade-up">
          <div class="rst-label">REST — NEXT UP</div>
          <div class="rst-next-ex">${nextEx.name}</div>
          <div class="rst-ring-wrap">
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle class="rst-ring-bg"   cx="100" cy="100" r="90"/>
              <circle class="rst-ring-fill ${remaining<=10?'warning':''}" id="rst-ring" cx="100" cy="100" r="90"
                stroke-dasharray="${C}" stroke-dashoffset="${offset}"/>
            </svg>
            <div class="rst-display ${remaining<=10?'warning':remaining===0?'done':''}" id="rst-num">${remaining}</div>
          </div>
          <button class="tsr-btn tsr-btn-start btn-full" id="rst-start-btn" style="max-width:260px;margin:0 auto">
            ${running ? 'PAUSE' : 'START REST'}
          </button>
          <button class="rst-skip-btn" id="rst-skip-btn" style="max-width:260px;margin:8px auto 0">SKIP REST →</button>
        </div>
        <div class="step-nav" style="max-width:480px;margin:16px auto 0">
          <button class="step-nav-btn step-nav-exit" id="rest-exit">EXIT</button>
          <button class="step-nav-btn step-nav-prev" id="rest-back">← BACK</button>
        </div>`;

      const update = () => {
        const ring = document.getElementById('rst-ring');
        const num  = document.getElementById('rst-num');
        if (!ring || !num) return;
        ring.setAttribute('stroke-dashoffset', C*(1-remaining/restSecs));
        num.textContent = remaining;
        num.className   = `rst-display ${remaining<=10?'warning':remaining<=0?'done':''}`;
        ring.className  = `rst-ring-fill ${remaining<=10?'warning':''}`;
      };

      document.getElementById('rst-start-btn').addEventListener('click', () => {
        if (running) {
          clearInterval(timerInt); running = false;
          document.getElementById('rst-start-btn').textContent = 'RESUME';
        } else {
          running = true;
          document.getElementById('rst-start-btn').textContent = 'PAUSE';
          timerInt = setInterval(() => {
            remaining--;
            update();
            if (remaining <= 0) {
              clearInterval(timerInt); running = false;
              this.beep();
              this.advance();
            }
          }, 1000);
        }
      });
      document.getElementById('rst-skip-btn').addEventListener('click', () => { clearInterval(timerInt); this.advance(); });
      document.getElementById('rest-exit').addEventListener('click', () => { clearInterval(timerInt); this.exitSession(); });
      document.getElementById('rest-back').addEventListener('click', () => { clearInterval(timerInt); this.goBack(); });
    };

    build();
    // auto-start
    setTimeout(() => {
      const btn = document.getElementById('rst-start-btn');
      if (btn) btn.click();
    }, 400);
  },

  /* ── DONE SCREEN ── */
  renderDoneStep(body) {
    const { pd, key, startTime, info, steps } = this.sessionState;
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    const exCount = steps.filter(s => s.type === 'exercise').length;

    // Mark session done
    this.trackData[key] = 'done';
    Store.saveTrack(this.trackData);
    HomePage.updateHeroStats();
    const globalStats = Stats.compute(this.trackData, this.startDate);

    body.innerHTML = `
      <div class="session-done-screen anim-fade-up">
        <div class="done-trophy">🏆</div>
        <div class="done-title">SESSION DONE!</div>
        <div class="done-sub">
          ${info.label} complete.<br>
          Week ${Math.floor(pd/7)+1} · Day ${pd+1} of 84
        </div>
        <div class="done-stats">
          <div class="done-stat">
            <div class="done-stat-num color-m${info.month}">${exCount}</div>
            <div class="done-stat-lbl">EXERCISES</div>
          </div>
          <div class="done-stat">
            <div class="done-stat-num" style="color:var(--accent)">${elapsed}</div>
            <div class="done-stat-lbl">MINUTES</div>
          </div>
          <div class="done-stat">
            <div class="done-stat-num color-green">${globalStats.streak}</div>
            <div class="done-stat-lbl">DAY STREAK</div>
          </div>
        </div>
        <div style="margin-bottom:20px">
          <div style="display:flex;justify-content:space-between;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);margin-bottom:6px">
            <span>OVERALL PROGRESS</span><span>${globalStats.done}/84 SESSIONS</span>
          </div>
          <div class="prog-track" style="height:8px">
            <div class="prog-fill" style="background:var(--accent);width:${globalStats.pct}%"></div>
          </div>
        </div>
        <button class="start-session-btn" id="done-back-btn">← BACK TO OVERVIEW</button>
      </div>`;

    document.getElementById('done-back-btn').addEventListener('click', () => {
      this.sessionState = null;
      this.hideFlow();
      this.renderOverview();
      this.renderDayPicker();
    });
  },

  /* ── NAVIGATION HELPERS ── */
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
  },

  hideFlow() {
    const flowEl = document.getElementById('wo-flow');
    if (flowEl) { flowEl.classList.remove('active'); flowEl.innerHTML = ''; }
    const ov = document.getElementById('wo-overview');
    if (ov) ov.style.display = '';
  },

  /* ── AUDIO ── */
  beep() {
    try {
      const ctx = new (window.AudioContext||window.webkitAudioContext)();
      [0, 0.18, 0.36].forEach(t => {
        const osc = ctx.createOscillator();
        const g   = ctx.createGain();
        osc.connect(g); g.connect(ctx.destination);
        osc.frequency.value = 880;
        g.gain.setValueAtTime(0.35, ctx.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+0.14);
        osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+0.15);
      });
    } catch(e) {}
  }
};
