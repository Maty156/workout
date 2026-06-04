/* ════════════════════════════════════════════
   STATS.JS — Compute streaks, completion, etc.
   ════════════════════════════════════════════ */

window.Stats = {

  compute(trackData, startDate) {
    let done=0, missed=0, m1done=0, m2done=0, m3done=0;
    const TOTAL = 84;
    for (let i=0; i<TOTAL; i++) {
      const info = getDayInfo(i);
      if (!info) continue;
      const date = new Date(startDate); date.setDate(date.getDate()+i);
      const key = Store.dateToKey(date);
      const s = trackData[key];
      if (s==='done') {
        done++;
        if (info.month===1) m1done++;
        else if (info.month===2) m2done++;
        else m3done++;
      } else if (s==='missed') { missed++; }
    }
    let streak=0;
    const today=new Date(); today.setHours(0,0,0,0);
    let check=new Date(today), steps=0;
    while (steps<200) {
      const k=Store.dateToKey(check), pd=Store.getProgramDay(check,startDate), inf=getDayInfo(pd);
      if (inf) { if (trackData[k]==='done') streak++; else break; }
      check.setDate(check.getDate()-1); steps++;
      if (pd<0) break;
    }
    const pct=Math.round(done/TOTAL*100);
    return { done, missed, streak, m1done, m2done, m3done, pct, total:TOTAL };
  },

  updateNav(stats) {
    const el=id=>document.getElementById(id);
    if(el('nav-streak'))       el('nav-streak').textContent     = stats.streak+' STREAK';
    if(el('nav-progress-txt')) el('nav-progress-txt').textContent = stats.done+'/84';
    if(el('nav-progress-bar')) el('nav-progress-bar').style.width = stats.pct+'%';
  }
};
