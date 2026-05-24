/* ════════════════════════════════════════════
   MAIN.JS — App bootstrap
   Runs after all scripts are loaded.
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  function init() {
    // Inject Nav Icons
    injectNavIcons();

    // Init nav router
    Nav.init();

    // Init all pages
    HomePage.init();
    CalendarPage.init();
    WorkoutPage.init();
    TimerPage.init();

    // Show home by default & update nav stats
    const s = Stats.compute(Store.loadTrack(), Store.getStartDate());
    Stats.updateNav(s);
  }

  function injectNavIcons() {
    const navItems = {
      'btn-nav-home':     'dumbbell',
      'btn-nav-calendar': 'calendar',
      'btn-nav-workout':  'activity',
      'btn-nav-timer':    'timer'
    };

    for (const [id, icon] of Object.entries(navItems)) {
      const btn = document.getElementById(id);
      if (btn) {
        const wrap = btn.querySelector('.nav-icon-wrap');
        if (wrap) wrap.innerHTML = Icons.get(icon, { size: 18 });
      }
    }

    const streakIcon = document.getElementById('nav-streak-icon');
    if (streakIcon) streakIcon.innerHTML = Icons.get('flame', { size: 16, color: 'var(--accent2)' });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
