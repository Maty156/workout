/* ════════════════════════════════════════════
   NAV.JS — Page routing
   ════════════════════════════════════════════ */

window.Nav = {
  currentPage: 'home',

  init() {
    document.querySelectorAll('.nav-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        this.go(page);
      });
    });
  },

  go(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));

    document.getElementById('page-' + page).classList.add('active');
    document.querySelector(`.nav-link[data-page="${page}"]`).classList.add('active');

    this.currentPage = page;

    // Notify pages
    if (page === 'calendar') window.CalendarPage && CalendarPage.refresh();
    if (page === 'workout')  window.WorkoutPage  && WorkoutPage.refresh();
    if (page === 'timer')    window.TimerPage    && TimerPage.refresh();
  }
};
