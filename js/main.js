/* ════════════════════════════════════════════
   MAIN.JS — App bootstrap
   Runs after all scripts are loaded.
   ════════════════════════════════════════════ */

(function () {
  'use strict';

  function init() {
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

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
