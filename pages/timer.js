/* ════════════════════════════════════════════
   PAGES/TIMER.JS — Rest timer + stopwatch
   ════════════════════════════════════════════ */

window.TimerPage = {

  // Rest timer state
  totalSecs: 60,
  remainSecs: 60,
  isRunning: false,
  intervalId: null,
  presets: [30, 45, 60, 90, 120, 180],

  // Stopwatch state
  swRunning: false,
  swStart: 0,
  swElapsed: 0,
  swIntervalId: null,
  laps: [],

  init() {
    this.render();
  },

  refresh() {},   // nothing to reload

  render() {
    const el = document.getElementById('page-timer');
    el.innerHTML = `
      <div class="timer-page anim-fade-in">

        <div class="section-head" style="margin-bottom:32px">
          <span class="section-title font-bebas">REST TIMER</span>
          <div class="section-line"></div>
          <span class="section-sub">BETWEEN SETS</span>
        </div>

        <!-- Ring -->
        <div class="timer-ring-wrap">
          <div style="position:relative;width:240px;height:240px">
            <svg class="timer-ring-svg" width="240" height="240" viewBox="0 0 240 240">
              <circle class="t-ring-bg" cx="120" cy="120" r="108"/>
              <circle class="t-ring-fill" id="t-ring" cx="120" cy="120" r="108"
                stroke-dasharray="678.6" stroke-dashoffset="0"/>
            </svg>
            <div class="timer-center">
              <div class="timer-display" id="t-display">1:00</div>
              <div class="timer-phase"  id="t-phase">READY</div>
            </div>
          </div>
        </div>

        <!-- Presets -->
        <div class="timer-presets" id="t-presets">
          ${this.presets.map(s => `
            <button class="preset-btn ${s===this.totalSecs?'active':''}" data-secs="${s}">${this.fmtPreset(s)}</button>
          `).join('')}
        </div>

        <!-- Custom -->
        <div class="custom-timer-wrap">
          <input type="number" class="t-input" id="t-min-inp" value="1" min="0" max="59" placeholder="0">
          <span class="t-sep">:</span>
          <input type="number" class="t-input" id="t-sec-inp" value="00" min="0" max="59" placeholder="0">
          <button class="t-set-btn" id="t-set-btn">SET</button>
        </div>

        <!-- Controls -->
        <div class="timer-controls">
          <button class="t-btn t-btn-main" id="t-start-btn">START</button>
          <button class="t-btn t-btn-reset" id="t-reset-btn">RESET</button>
        </div>

        <!-- Stopwatch -->
        <div class="stopwatch-wrap">
          <div class="sw-head">⏱ STOPWATCH</div>
          <div class="sw-display" id="sw-display">0:00.0</div>
          <div class="sw-controls">
            <button class="sw-btn sw-btn-start" id="sw-start">START</button>
            <button class="sw-btn sw-btn-lap"   id="sw-lap">LAP</button>
            <button class="sw-btn sw-btn-reset" id="sw-reset">RESET</button>
          </div>
          <div class="laps-list" id="laps-list"></div>
        </div>

        <!-- Notification note -->
        <div style="text-align:center;margin-top:16px;font-family:'DM Mono',monospace;font-size:10px;color:var(--muted);letter-spacing:1px">
          KEEP THIS TAB OPEN FOR AUDIO ALERTS
        </div>
      </div>`;

    this.bindEvents(el);
    this.updateRing();
  },

  fmtPreset(secs) {
    if (secs < 60) return secs + 's';
    const m = Math.floor(secs/60), s = secs%60;
    return s === 0 ? m+'m' : m+'m'+s+'s';
  },

  fmtTime(secs) {
    const m = Math.floor(secs/60);
    const s = secs % 60;
    return m + ':' + String(s).padStart(2,'0');
  },

  fmtMs(ms) {
    const total = Math.floor(ms/100);
    const tenths = total % 10;
    const secs   = Math.floor(total/10) % 60;
    const mins   = Math.floor(total/600);
    return mins + ':' + String(secs).padStart(2,'0') + '.' + tenths;
  },

  updateRing() {
    const ring = document.getElementById('t-ring');
    const disp = document.getElementById('t-display');
    const phase = document.getElementById('t-phase');
    if (!ring) return;

    const C = 2 * Math.PI * 108; // ~678.6
    const pct = this.remainSecs / this.totalSecs;
    const offset = C * (1 - pct);
    ring.style.strokeDashoffset = offset;

    disp.textContent = this.fmtTime(this.remainSecs);

    const isWarning = this.remainSecs <= 10 && this.remainSecs > 0;
    ring.classList.toggle('warning', isWarning);
    disp.className = 'timer-display' + (isWarning ? ' warning' : this.remainSecs===0 ? ' done' : '');

    if (this.remainSecs === 0) {
      phase.textContent = 'DONE!';
      disp.classList.add('done');
    } else if (this.isRunning) {
      phase.textContent = 'RESTING';
    } else {
      phase.textContent = 'READY';
    }
  },

  setTimer(secs) {
    this.stop();
    this.totalSecs  = secs;
    this.remainSecs = secs;
    // update preset buttons
    document.querySelectorAll('.preset-btn').forEach(b => {
      b.classList.toggle('active', parseInt(b.dataset.secs) === secs);
    });
    // update inputs
    const mi = document.getElementById('t-min-inp');
    const si = document.getElementById('t-sec-inp');
    if (mi) mi.value = Math.floor(secs/60);
    if (si) si.value = String(secs%60).padStart(2,'0');
    this.updateRing();
  },

  start() {
    if (this.remainSecs === 0) this.remainSecs = this.totalSecs;
    this.isRunning = true;
    document.getElementById('t-start-btn').textContent = 'PAUSE';
    document.getElementById('t-start-btn').classList.add('running');
    this.intervalId = setInterval(() => {
      if (this.remainSecs > 0) {
        this.remainSecs--;
        this.updateRing();
      }
      if (this.remainSecs === 0) {
        this.beep();
        this.stop(false);
      }
    }, 1000);
  },

  pause() {
    this.isRunning = false;
    clearInterval(this.intervalId);
    document.getElementById('t-start-btn').textContent = 'RESUME';
    document.getElementById('t-start-btn').classList.remove('running');
    this.updateRing();
  },

  stop(resetPhase = true) {
    this.isRunning = false;
    clearInterval(this.intervalId);
    const btn = document.getElementById('t-start-btn');
    if (btn) { btn.textContent = 'START'; btn.classList.remove('running'); }
    if (resetPhase) {
      this.remainSecs = this.totalSecs;
      this.updateRing();
    }
  },

  beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.15, 0.3].forEach(t => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 880;
        gain.gain.setValueAtTime(0.4, ctx.currentTime + t);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.12);
        osc.start(ctx.currentTime + t);
        osc.stop(ctx.currentTime + t + 0.13);
      });
    } catch(e) {}
  },

  // ─── STOPWATCH ───
  swToggle() {
    if (this.swRunning) {
      this.swElapsed += Date.now() - this.swStart;
      this.swRunning = false;
      clearInterval(this.swIntervalId);
      document.getElementById('sw-start').textContent = 'RESUME';
      document.getElementById('sw-start').className   = 'sw-btn sw-btn-stop';
    } else {
      this.swStart   = Date.now();
      this.swRunning = true;
      this.swIntervalId = setInterval(() => this.swUpdate(), 100);
      document.getElementById('sw-start').textContent = 'STOP';
      document.getElementById('sw-start').className   = 'sw-btn sw-btn-stop';
    }
  },

  swUpdate() {
    const elapsed = this.swElapsed + (this.swRunning ? Date.now() - this.swStart : 0);
    const disp = document.getElementById('sw-display');
    if (disp) disp.textContent = this.fmtMs(elapsed);
  },

  swLap() {
    if (!this.swRunning) return;
    const elapsed = this.swElapsed + (Date.now() - this.swStart);
    const prev    = this.laps.length > 0 ? this.laps.reduce((s,l)=>s+l.raw,0) : 0;
    const split   = elapsed - prev;
    this.laps.push({ raw: split, total: elapsed });
    this.renderLaps();
  },

  swReset() {
    clearInterval(this.swIntervalId);
    this.swRunning = false;
    this.swElapsed = 0;
    this.laps = [];
    const disp = document.getElementById('sw-display');
    if (disp) disp.textContent = '0:00.0';
    const btn = document.getElementById('sw-start');
    if (btn) { btn.textContent = 'START'; btn.className = 'sw-btn sw-btn-start'; }
    this.renderLaps();
  },

  renderLaps() {
    const list = document.getElementById('laps-list');
    if (!list) return;
    list.innerHTML = this.laps.slice().reverse().map((l, ri) => {
      const i = this.laps.length - ri;
      return `
        <div class="lap-row">
          <span class="lap-num">LAP ${i}</span>
          <span class="lap-time">${this.fmtMs(l.raw)}</span>
          <span class="lap-split">${this.fmtMs(l.total)}</span>
        </div>`;
    }).join('');
  },

  bindEvents(el) {
    // Preset buttons
    el.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => this.setTimer(parseInt(btn.dataset.secs)));
    });

    // Custom set
    el.querySelector('#t-set-btn').addEventListener('click', () => {
      const m = parseInt(el.querySelector('#t-min-inp').value) || 0;
      const s = parseInt(el.querySelector('#t-sec-inp').value) || 0;
      const total = m*60 + s;
      if (total > 0) this.setTimer(total);
    });

    // Start/pause
    el.querySelector('#t-start-btn').addEventListener('click', () => {
      if (this.isRunning) this.pause(); else this.start();
    });

    // Reset
    el.querySelector('#t-reset-btn').addEventListener('click', () => this.stop());

    // Stopwatch
    el.querySelector('#sw-start').addEventListener('click', () => this.swToggle());
    el.querySelector('#sw-lap').addEventListener('click',   () => this.swLap());
    el.querySelector('#sw-reset').addEventListener('click', () => this.swReset());
  }
};
