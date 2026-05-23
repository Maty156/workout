/* ════════════════════════════════════════════
   STORE.JS — localStorage persistence layer
   ════════════════════════════════════════════ */

const STORE_KEY  = 'calix_track_v2';
const START_KEY  = 'calix_start_v2';
const EXCK_KEY   = 'calix_exchecks_v2';

/* ─── Program start date ─── */
window.Store = {

  getStartDate() {
    const s = localStorage.getItem(START_KEY);
    if (s) return new Date(s + 'T00:00:00');
    // Default to nearest past Monday
    const today = new Date(); today.setHours(0,0,0,0);
    const dow = today.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    const key = monday.toISOString().split('T')[0];
    localStorage.setItem(START_KEY, key);
    return monday;
  },

  setStartDate(dateStr) {
    localStorage.setItem(START_KEY, dateStr);
  },

  /* ─── Session tracking: { 'YYYY-MM-DD': 'done'|'missed' } ─── */
  loadTrack() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return {}; }
  },

  saveTrack(data) {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  },

  /* ─── Exercise check state per date ─── */
  // stored as { 'YYYY-MM-DD': { 'exId': true } }
  loadExChecks() {
    try { return JSON.parse(localStorage.getItem(EXCK_KEY)) || {}; }
    catch { return {}; }
  },

  saveExChecks(data) {
    localStorage.setItem(EXCK_KEY, JSON.stringify(data));
  },

  getChecksForDate(dateKey) {
    const all = this.loadExChecks();
    return all[dateKey] || {};
  },

  setCheckForDate(dateKey, exId, checked) {
    const all = this.loadExChecks();
    if (!all[dateKey]) all[dateKey] = {};
    if (checked) all[dateKey][exId] = true;
    else delete all[dateKey][exId];
    this.saveExChecks(all);
  },

  /* ─── Helpers ─── */
  dateToKey(d) {
    return d.toISOString().split('T')[0];
  },

  keyToDate(k) {
    const [y,m,d] = k.split('-').map(Number);
    return new Date(y, m-1, d);
  },

  getProgramDay(date, startDate) {
    const d = new Date(date); d.setHours(0,0,0,0);
    const s = new Date(startDate); s.setHours(0,0,0,0);
    return Math.round((d - s) / 86400000);
  },

  reset() {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(EXCK_KEY);
  }
};
