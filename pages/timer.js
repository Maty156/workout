/* ════════════════════════════════════════════
   PAGES/TIMER.JS — Rest timer & Stopwatch
   Premium Edition
   ════════════════════════════════════════════ */

window.TimerPage = {

  timerInt: null,
  timerRemaining: 60,
  timerRunning: false,
  timerOriginal: 60,

  swInt: null,
  swTime: 0,
  swRunning: false,
  laps: [],

  init() {
    this.render();
  },

  render() {
    const el = document.getElementById('page-timer');
    el.innerHTML = `
      <div class="timer-page-layout anim-fade-in">
        <div class="grid-2">
          
          <!-- REST TIMER -->
          <div class="timer-card glass">
            <div class="tc-head">
              <div class="tc-title font-bebas">${Icons.get('timer', { size: 18 })} REST TIMER</div>
              <div class="tc-sub font-mono">COUNTDOWN</div>
            </div>
            
            <div class="tc-body">
              <div class="display-wrap">
                <svg class="timer-svg" viewBox="0 0 100 100">
                  <circle class="timer-bg" cx="50" cy="50" r="45"/>
                  <circle id="timer-ring" class="timer-fill" cx="50" cy="50" r="45" transform="rotate(-90 50 50)"/>
                </svg>
                <div class="timer-display font-bebas" id="timer-disp">01:00</div>
              </div>

              <div class="timer-presets">
                <button class="preset-btn" data-s="30">30s</button>
                <button class="preset-btn" data-s="60">60s</button>
                <button class="preset-btn" data-s="90">90s</button>
                <button class="preset-btn" data-s="120">2m</button>
                <button class="preset-btn" data-s="180">3m</button>
              </div>

              <div class="timer-controls">
                <button class="btn btn-secondary" id="timer-reset">${Icons.get('rotate', { size: 18 })}</button>
                <button class="btn btn-primary" id="timer-toggle" style="flex:1">
                  ${Icons.get('play', { size: 18 })} START
                </button>
                <button class="btn btn-secondary" id="timer-edit">${Icons.get('settings', { size: 18 })}</button>
              </div>
            </div>
          </div>

          <!-- STOPWATCH -->
          <div class="timer-card glass">
            <div class="tc-head">
              <div class="tc-title font-bebas">${Icons.get('clock', { size: 18 })} STOPWATCH</div>
              <div class="tc-sub font-mono">ELAPSED TIME</div>
            </div>

            <div class="tc-body">
              <div class="sw-display font-bebas" id="sw-disp">00:00.00</div>
              
              <div class="timer-controls">
                <button class="btn btn-secondary" id="sw-lap" disabled>LAP</button>
                <button class="btn btn-primary" id="sw-toggle" style="flex:1">START</button>
                <button class="btn btn-secondary" id="sw-reset">RESET</button>
              </div>

              <div class="lap-list glass" id="sw-laps">
                <div class="lap-empty">No laps recorded</div>
              </div>
            </div>
          </div>

        </div>
      </div>`;

    this.bindEvents(el);
    this.updateTimerUI();
  },

  bindEvents(el) {
    // Timer
    el.querySelector('#timer-toggle').addEventListener('click', () => this.toggleTimer());
    el.querySelector('#timer-reset').addEventListener('click', () => this.resetTimer());
    el.querySelectorAll('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const s = parseInt(btn.dataset.s);
        this.timerOriginal = this.timerRemaining = s;
        if (this.timerRunning) this.toggleTimer();
        this.updateTimerUI();
      });
    });

    // Stopwatch
    el.querySelector('#sw-toggle').addEventListener('click', () => this.toggleSW());
    el.querySelector('#sw-reset').addEventListener('click', () => this.resetSW());
    el.querySelector('#sw-lap').addEventListener('click', () => this.recordLap());
  },

  /* ─── TIMER LOGIC ─── */
  toggleTimer() {
    const btn = document.getElementById('timer-toggle');
    if (this.timerRunning) {
      clearInterval(this.timerInt);
      this.timerRunning = false;
      btn.innerHTML = `${Icons.get('play', { size: 18 })} START`;
      btn.classList.replace('btn-secondary', 'btn-primary');
    } else {
      if (this.timerRemaining <= 0) this.resetTimer();
      this.timerRunning = true;
      btn.innerHTML = `${Icons.get('pause', { size: 18 })} PAUSE`;
      btn.classList.replace('btn-primary', 'btn-secondary');
      this.timerInt = setInterval(() => {
        this.timerRemaining--;
        this.updateTimerUI();
        if (this.timerRemaining <= 0) {
          clearInterval(this.timerInt);
          this.timerRunning = false;
          WorkoutPage.beep();
          btn.innerHTML = `${Icons.get('play', { size: 18 })} START`;
          btn.classList.replace('btn-secondary', 'btn-primary');
        }
      }, 1000);
    }
  },

  resetTimer() {
    clearInterval(this.timerInt);
    this.timerRunning = false;
    this.timerRemaining = this.timerOriginal;
    const btn = document.getElementById('timer-toggle');
    btn.innerHTML = `${Icons.get('play', { size: 18 })} START`;
    btn.classList.replace('btn-secondary', 'btn-primary');
    this.updateTimerUI();
  },

  updateTimerUI() {
    const disp = document.getElementById('timer-disp');
    const ring = document.getElementById('timer-ring');
    if (!disp || !ring) return;

    const m = Math.floor(this.timerRemaining / 60);
    const s = this.timerRemaining % 60;
    disp.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;

    const pct = this.timerRemaining / this.timerOriginal;
    const C = 2 * Math.PI * 45;
    ring.style.strokeDasharray = C;
    ring.style.strokeDashoffset = C * (1 - pct);
    
    if (this.timerRemaining <= 10) ring.style.stroke = 'var(--red)';
    else ring.style.stroke = 'var(--accent)';
  },

  /* ─── STOPWATCH LOGIC ─── */
  toggleSW() {
    const btn = document.getElementById('sw-toggle');
    const lapBtn = document.getElementById('sw-lap');
    if (this.swRunning) {
      clearInterval(this.swInt);
      this.swRunning = false;
      btn.textContent = 'START';
      btn.classList.replace('btn-secondary', 'btn-primary');
      lapBtn.disabled = true;
    } else {
      this.swRunning = true;
      btn.textContent = 'STOP';
      btn.classList.replace('btn-primary', 'btn-secondary');
      lapBtn.disabled = false;
      const start = Date.now() - this.swTime;
      this.swInt = setInterval(() => {
        this.swTime = Date.now() - start;
        this.updateSWUI();
      }, 10);
    }
  },

  resetSW() {
    clearInterval(this.swInt);
    this.swTime = 0;
    this.swRunning = false;
    this.laps = [];
    document.getElementById('sw-toggle').textContent = 'START';
    document.getElementById('sw-toggle').classList.replace('btn-secondary', 'btn-primary');
    document.getElementById('sw-lap').disabled = true;
    this.updateSWUI();
    document.getElementById('sw-laps').innerHTML = '<div class="lap-empty">No laps recorded</div>';
  },

  recordLap() {
    this.laps.unshift(this.swTime);
    const wrap = document.getElementById('sw-laps');
    wrap.innerHTML = this.laps.map((t, i) => `
      <div class="lap-item">
        <span class="lap-num">LAP ${this.laps.length - i}</span>
        <span class="lap-time font-mono">${this.formatSW(t)}</span>
      </div>
    `).join('');
  },

  updateSWUI() {
    const disp = document.getElementById('sw-disp');
    if (disp) disp.textContent = this.formatSW(this.swTime);
  },

  formatSW(ms) {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const h = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(h).padStart(2,'0')}`;
  }
};
