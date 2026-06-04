/* ════════════════════════════════════════════
   MAIN.JS — App bootstrap v3
   + Onboarding, theme, profile
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  function init() {
    applyTheme();
    injectNavIcons();
    Nav.init();
    HomePage.init();
    CalendarPage.init();
    WorkoutPage.init();
    TimerPage.init();
    const s = Stats.compute(Store.loadTrack(), Store.getStartDate());
    Stats.updateNav(s);
    // Show onboarding if no profile set
    if (!Store.getProfile()) {
      setTimeout(() => showOnboarding(), 400);
    }
  }

  function applyTheme() {
    const theme = Store.getTheme();
    document.documentElement.setAttribute('data-theme', theme);
  }

  window.toggleTheme = function() {
    const cur = Store.getTheme();
    const next = cur === 'dark' ? 'light' : 'dark';
    Store.setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) btn.innerHTML = next === 'dark' ? Icons.get('moon', {size:18}) : Icons.get('sun', {size:18});
  };

  function injectNavIcons() {
    const navItems = {
      'btn-nav-home': 'dumbbell', 'btn-nav-calendar': 'calendar',
      'btn-nav-workout': 'activity', 'btn-nav-timer': 'timer'
    };
    for (const [id, icon] of Object.entries(navItems)) {
      const btn = document.getElementById(id);
      if (btn) { const wrap = btn.querySelector('.nav-icon-wrap'); if (wrap) wrap.innerHTML = Icons.get(icon, {size:18}); }
    }
    const si = document.getElementById('nav-streak-icon');
    if (si) si.innerHTML = Icons.get('flame', {size:16, color:'var(--accent2)'});
  }

  function showOnboarding() {
    const modal = document.createElement('div');
    modal.id = 'onboarding-modal';
    modal.className = 'skill-modal-overlay';
    modal.innerHTML = `
      <div class="skill-modal glass anim-fade-up" style="max-width:420px">
        <div class="sm-header">
          <div>
            <div class="sm-title font-bebas" style="font-size:2rem">WELCOME TO CALIX</div>
            <div class="sm-sub font-mono">SET UP YOUR PROFILE</div>
          </div>
        </div>
        <div class="sm-body" style="display:flex;flex-direction:column;gap:16px;padding-top:8px">
          <div class="profile-field">
            <label class="field-label font-mono">YOUR NAME</label>
            <input class="field-input" id="ob-name" type="text" placeholder="e.g. Maty" maxlength="30"/>
          </div>
          <div class="profile-field">
            <label class="field-label font-mono">BODY WEIGHT (kg)</label>
            <input class="field-input" id="ob-weight" type="number" placeholder="e.g. 70" min="30" max="300"/>
          </div>
          <div class="profile-field">
            <label class="field-label font-mono">HEIGHT (cm)</label>
            <input class="field-input" id="ob-height" type="number" placeholder="e.g. 175" min="100" max="250"/>
          </div>
          <div class="profile-field">
            <label class="field-label font-mono">PRIMARY GOAL</label>
            <div class="goal-options" id="ob-goal">
              <button class="goal-opt active" data-g="strength">💪 STRENGTH</button>
              <button class="goal-opt" data-g="endurance">🏃 ENDURANCE</button>
              <button class="goal-opt" data-g="skills">🤸 SKILLS</button>
              <button class="goal-opt" data-g="weight_loss">🔥 FAT LOSS</button>
            </div>
          </div>
          <button class="btn btn-primary btn-full" id="ob-save" style="height:52px;margin-top:8px;font-size:16px;">
            ${Icons.get('check',{size:18})} LET'S GO
          </button>
          <button class="btn btn-ghost btn-full" id="ob-skip" style="font-size:12px;color:var(--muted)">Skip for now</button>
        </div>
      </div>`;
    document.body.appendChild(modal);

    let selectedGoal = 'strength';
    modal.querySelectorAll('.goal-opt').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.goal-opt').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedGoal = btn.dataset.g;
      });
    });

    document.getElementById('ob-save').addEventListener('click', () => {
      const name = document.getElementById('ob-name').value.trim() || 'Athlete';
      const weight = parseFloat(document.getElementById('ob-weight').value) || null;
      const height = parseFloat(document.getElementById('ob-height').value) || null;
      Store.saveProfile({ name, weight, height, goal: selectedGoal });
      modal.remove();
      // Update nav greeting
      updateNavGreeting(name);
    });

    document.getElementById('ob-skip').addEventListener('click', () => {
      Store.saveProfile({ name: 'Athlete', goal: 'strength' });
      modal.remove();
    });
  }

  function updateNavGreeting(name) {
    const logo = document.querySelector('.nav-logo');
    if (logo) logo.setAttribute('title', `Welcome, ${name}!`);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Init theme toggle icon
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      const t = Store.getTheme();
      btn.innerHTML = t === 'dark' ? '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>' : '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
    }
  });
})();
