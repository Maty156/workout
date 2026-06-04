/* ════════════════════════════════════════════
   STORE.JS — localStorage persistence layer v3
   Added: profile, rep logs, personal records
   ════════════════════════════════════════════ */

const STORE_KEY    = 'calix_track_v3';
const START_KEY    = 'calix_start_v3';
const EXCK_KEY     = 'calix_exchecks_v3';
const REPS_KEY     = 'calix_reps_v3';
const PROFILE_KEY  = 'calix_profile_v1';
const PR_KEY       = 'calix_pr_v1';
const THEME_KEY    = 'calix_theme_v1';

window.Store = {

  /* ─── THEME ─── */
  getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; },
  setTheme(t) { localStorage.setItem(THEME_KEY, t); },

  /* ─── PROFILE ─── */
  getProfile() {
    try { return JSON.parse(localStorage.getItem(PROFILE_KEY)) || null; }
    catch { return null; }
  },
  saveProfile(p) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); },

  /* ─── PROGRAM START DATE ─── */
  getStartDate() {
    const s = localStorage.getItem(START_KEY);
    if (s) return new Date(s + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const dow = today.getDay();
    const diff = dow === 0 ? -6 : 1 - dow;
    const monday = new Date(today);
    monday.setDate(today.getDate() + diff);
    const key = monday.toISOString().split('T')[0];
    localStorage.setItem(START_KEY, key);
    return monday;
  },
  setStartDate(dateStr) { localStorage.setItem(START_KEY, dateStr); },

  /* ─── SESSION TRACKING ─── */
  loadTrack() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; }
    catch { return {}; }
  },
  saveTrack(data) { localStorage.setItem(STORE_KEY, JSON.stringify(data)); },

  /* ─── EXERCISE CHECKS (set completion) ─── */
  loadExChecks() {
    try { return JSON.parse(localStorage.getItem(EXCK_KEY)) || {}; }
    catch { return {}; }
  },
  saveExChecks(data) { localStorage.setItem(EXCK_KEY, JSON.stringify(data)); },
  getChecksForDate(dateKey) { return this.loadExChecks()[dateKey] || {}; },
  setCheckForDate(dateKey, exId, checked) {
    const all = this.loadExChecks();
    if (!all[dateKey]) all[dateKey] = {};
    if (checked) all[dateKey][exId] = true;
    else delete all[dateKey][exId];
    this.saveExChecks(all);
  },

  /* ─── REP LOGS: { 'YYYY-MM-DD': { 'exId_set_0': {reps, weight} } } ─── */
  loadReps() {
    try { return JSON.parse(localStorage.getItem(REPS_KEY)) || {}; }
    catch { return {}; }
  },
  saveReps(data) { localStorage.setItem(REPS_KEY, JSON.stringify(data)); },
  getRepsForDate(dateKey) { return this.loadReps()[dateKey] || {}; },
  setRepForDate(dateKey, key, val) {
    const all = this.loadReps();
    if (!all[dateKey]) all[dateKey] = {};
    all[dateKey][key] = val;
    this.saveReps(all);
    // update PR
    if (val.reps) this._checkPR(key.split('_')[0], val);
  },

  /* ─── PERSONAL RECORDS ─── */
  loadPRs() {
    try { return JSON.parse(localStorage.getItem(PR_KEY)) || {}; }
    catch { return {}; }
  },
  _checkPR(exId, val) {
    const prs = this.loadPRs();
    const key = exId;
    if (!prs[key] || val.reps > (prs[key].reps||0)) {
      prs[key] = { ...val, date: new Date().toISOString().split('T')[0] };
      localStorage.setItem(PR_KEY, JSON.stringify(prs));
    }
  },
  getPR(exId) { return this.loadPRs()[exId] || null; },

  /* ─── HELPERS ─── */
  dateToKey(d) { return d.toISOString().split('T')[0]; },
  keyToDate(k) { const [y,m,d] = k.split('-').map(Number); return new Date(y,m-1,d); },
  getProgramDay(date, startDate) {
    const d = new Date(date); d.setHours(0,0,0,0);
    const s = new Date(startDate); s.setHours(0,0,0,0);
    return Math.round((d - s) / 86400000);
  },

  reset() {
    [STORE_KEY, EXCK_KEY, REPS_KEY, PR_KEY].forEach(k => localStorage.removeItem(k));
  },

  resetAll() {
    [STORE_KEY, EXCK_KEY, REPS_KEY, PR_KEY, START_KEY, PROFILE_KEY, THEME_KEY].forEach(k => localStorage.removeItem(k));
  },

  /* ─── EXPORT / IMPORT ─── */
  exportData() {
    const data = {
      version: '3.0', timestamp: new Date().toISOString(),
      startDate: localStorage.getItem(START_KEY),
      track: this.loadTrack(), exChecks: this.loadExChecks(),
      reps: this.loadReps(), prs: this.loadPRs(),
      profile: this.getProfile()
    };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `calix_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
  },

  async importData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.startDate) localStorage.setItem(START_KEY, data.startDate);
          if (data.track)     this.saveTrack(data.track);
          if (data.exChecks)  this.saveExChecks(data.exChecks);
          if (data.reps)      this.saveReps(data.reps);
          if (data.prs)       localStorage.setItem(PR_KEY, JSON.stringify(data.prs));
          if (data.profile)   this.saveProfile(data.profile);
          resolve(true);
        } catch (err) { reject('Invalid backup file'); }
      };
      reader.onerror = () => reject('Failed to read file');
      reader.readAsText(file);
    });
  }
};
