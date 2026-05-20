/* ════════════════════════════════════════════
   DATA.JS — All workout program data
   ════════════════════════════════════════════ */

window.PROGRAM = {

  /* ─── MONTH 1: Full body, 3×/week ─── */
  month1: {
    label: 'Building Foundation',
    weeks: '1–4',
    freq: '3×/WEEK',
    color: 'var(--m1)',
    badge: 'm-badge-1',
    schedule: { 1:'full', 3:'full', 5:'full' }, // Mon, Wed, Fri (0=Sun)
    totalSessions: 12,
    days: {
      full: {
        label: 'Full Body',
        tag: 'tag-full',
        days: 'MON · WED · FRI',
        goal: 'Build the base. Master movement patterns. Increase volume gradually over 4 weeks.',
        exercises: [
          { id:'w', type:'warmup', text:'Warm-up: 5–10 min light cardio (jumping jacks, high knees)' },
          { id:'01', name:'Push-ups',                           sets:'3 sets', reps:'8–12 reps' },
          { id:'02', name:'Pull-ups or Inverted Rows',          sets:'3 sets', reps:'5–8 reps', note:'Use resistance band if needed' },
          { id:'03', name:'Dips',                               sets:'3 sets', reps:'8–12 reps', note:'Parallel bars or bench' },
          { id:'04', name:'Squats',                             sets:'3 sets', reps:'15–20 reps' },
          { id:'05', name:'Lunges',                             sets:'3 sets', reps:'10–15 reps', note:'Per leg' },
          { id:'06', name:'Plank',                              sets:'3 sets', reps:'30–60 sec' },
          { id:'c', type:'cooldown', text:'Cool-down: 5–10 min full-body stretching' },
        ]
      }
    },
    tips: [
      { label:'REST', val:'48h between sessions min.' },
      { label:'PROTEIN', val:'~1.6g / kg bodyweight' },
      { label:'SLEEP', val:'7–9 hours for recovery' },
    ],
    info: {
      goal: 'Build a solid foundation. Master basic movement patterns and develop the strength base needed for months 2 and 3.',
      rest: 'Tue · Thu · Sat · Sun',
      tip: 'Use a resistance band for pull-ups if needed. Focus on clean form over rep count.',
      highlight: '3 sessions × 4 weeks = 12 total workouts'
    }
  },

  /* ─── MONTH 2: Split, 4×/week ─── */
  month2: {
    label: 'Increasing Intensity',
    weeks: '5–8',
    freq: '4×/WEEK',
    color: 'var(--m2)',
    badge: 'm-badge-2',
    schedule: { 1:'upper', 2:'lower', 4:'lower', 5:'upper' }, // Mon,Tue,Thu,Fri
    totalSessions: 32,
    days: {
      upper: {
        label: 'Upper Body',
        tag: 'tag-upper',
        days: 'MON & FRI',
        goal: 'Increase pushing and pulling volume. Introduce shoulder work via pike push-ups.',
        exercises: [
          { id:'w', type:'warmup', text:'Warm-up: 5–10 min light cardio' },
          { id:'01', name:'Push-ups',                           sets:'4 sets', reps:'10–15 reps' },
          { id:'02', name:'Pull-ups or Inverted Rows',          sets:'4 sets', reps:'6–10 reps' },
          { id:'03', name:'Dips',                               sets:'4 sets', reps:'10–15 reps' },
          { id:'04', name:'Pike Push-ups',                      sets:'3 sets', reps:'8–12 reps' },
          { id:'05', name:'Plank to Push-up',                   sets:'3 sets', reps:'10–15 reps' },
          { id:'c', type:'cooldown', text:'Cool-down: 5–10 min stretching' },
        ]
      },
      lower: {
        label: 'Lower Body & Core',
        tag: 'tag-lower',
        days: 'TUE & THU',
        goal: 'Higher volume squats and lunges. Add glute bridges and hanging core work.',
        exercises: [
          { id:'w', type:'warmup', text:'Warm-up: 5–10 min light cardio' },
          { id:'01', name:'Squats',                             sets:'4 sets', reps:'20–25 reps' },
          { id:'02', name:'Lunges',                             sets:'4 sets', reps:'15–20 reps', note:'Per leg' },
          { id:'03', name:'Glute Bridges',                      sets:'3 sets', reps:'20–25 reps' },
          { id:'04', name:'Calf Raises',                        sets:'3 sets', reps:'20–25 reps' },
          { id:'05', name:'Hanging Leg Raises',                 sets:'3 sets', reps:'8–12 reps' },
          { id:'06', name:'Russian Twists',                     sets:'3 sets', reps:'20 reps', note:'Per side' },
          { id:'c', type:'cooldown', text:'Cool-down: 5–10 min stretching' },
        ]
      },
      skill: {
        label: 'Skill Training',
        tag: 'tag-skill',
        days: 'AFTER MAIN — 2–3×/WEEK',
        goal: 'Begin skill foundations. Consistency here pays off massively in month 3.',
        exercises: [
          { id:'S1', name:'Handstand Practice (wall-assisted)',  sets:'3 sets', reps:'20–30 sec' },
          { id:'S2', name:'L-Sit Progressions (tuck sits)',      sets:'3 sets', reps:'10–15 sec' },
        ],
        notes: [
          { label:'HANDSTAND', text:'Wall kick-ups. Wrist alignment. Hollow body tension. Hold time > style.' },
          { label:'L-SIT',     text:'Start tuck. Depress scapula, lean forward, push hard into the floor.' },
        ]
      }
    },
    tips: [
      { label:'SPLIT', val:'Upper/Lower twice each' },
      { label:'SKILL', val:'Add after main workout' },
      { label:'VOLUME', val:'Increase if sets feel easy' },
    ],
    info: {
      goal: 'Transition to a 4-day split. Increase intensity and volume. Introduce skill training 2–3× per week after main sessions.',
      rest: 'Wed · Sat · Sun',
      tip: 'The pike push-up is your first overhead work. Control the descent — 3 seconds down.',
      highlight: '4 sessions × 4 weeks = 16 weeks, ~32 total workouts'
    }
  },

  /* ─── MONTH 3: Advanced, 4–5×/week ─── */
  month3: {
    label: 'Skill Mastery',
    weeks: '9–12',
    freq: '4–5×/WEEK',
    color: 'var(--m3)',
    badge: 'm-badge-3',
    schedule: { 1:'upper', 2:'lower', 3:'lower', 4:'upper', 5:'full' }, // Mon–Fri
    totalSessions: 40,
    days: {
      upper: {
        label: 'Upper Body — Advanced',
        tag: 'tag-upper',
        days: 'MON & THU',
        goal: 'Decline and archer push-ups for chest depth. Unilateral strength emphasis.',
        exercises: [
          { id:'w', type:'warmup', text:'Warm-up: 5–10 min light cardio' },
          { id:'01', name:'Decline Push-ups',                   sets:'4 sets', reps:'10–15 reps' },
          { id:'02', name:'Pull-ups',                           sets:'4 sets', reps:'8–12 reps' },
          { id:'03', name:'Dips',                               sets:'4 sets', reps:'10–15 reps' },
          { id:'04', name:'Archer Push-ups',                    sets:'3 sets', reps:'6–10 reps', note:'Per side' },
          { id:'05', name:'Plank to Push-up',                   sets:'3 sets', reps:'15–20 reps' },
          { id:'c', type:'cooldown', text:'Cool-down: 5–10 min stretching' },
        ]
      },
      lower: {
        label: 'Lower Body & Core — Advanced',
        tag: 'tag-lower',
        days: 'TUE & WED',
        goal: 'Unilateral leg work for strength imbalances. Advanced core with windshield wipers.',
        exercises: [
          { id:'w', type:'warmup', text:'Warm-up: 5–10 min light cardio' },
          { id:'01', name:'Pistol Squats (assisted)',            sets:'4 sets', reps:'6–10 reps', note:'Per leg' },
          { id:'02', name:'Bulgarian Split Squats',              sets:'4 sets', reps:'10–15 reps', note:'Per leg' },
          { id:'03', name:'Single-Leg Glute Bridges',           sets:'3 sets', reps:'15–20 reps', note:'Per leg' },
          { id:'04', name:'Calf Raises',                        sets:'3 sets', reps:'25–30 reps' },
          { id:'05', name:'Hanging Leg Raises',                 sets:'3 sets', reps:'10–15 reps' },
          { id:'06', name:'Windshield Wipers',                  sets:'3 sets', reps:'10–15 reps', note:'Per side' },
          { id:'c', type:'cooldown', text:'Cool-down: 5–10 min stretching' },
        ]
      },
      full: {
        label: 'Full Body Finisher',
        tag: 'tag-full',
        days: 'FRI',
        goal: 'End-of-week full body. Lighter than earlier months — focus on quality and skill work.',
        exercises: [
          { id:'w', type:'warmup', text:'Warm-up: 5–10 min light cardio' },
          { id:'01', name:'Push-ups (variant of choice)',        sets:'3 sets', reps:'15–20 reps' },
          { id:'02', name:'Pull-ups',                           sets:'3 sets', reps:'8–12 reps' },
          { id:'03', name:'Squats',                             sets:'3 sets', reps:'20 reps' },
          { id:'04', name:'Dips',                               sets:'3 sets', reps:'12–15 reps' },
          { id:'05', name:'Plank',                              sets:'3 sets', reps:'45–60 sec' },
          { id:'c', type:'cooldown', text:'Cool-down: 5–10 min stretching' },
        ]
      },
      skill: {
        label: 'Skill Training',
        tag: 'tag-skill',
        days: 'AFTER WORKOUT — 3–4×/WEEK',
        goal: 'Progress toward free-standing handstand, full L-sit, and first muscle-up.',
        exercises: [
          { id:'S1', name:'Handstand Practice (free-standing)', sets:'3 sets', reps:'20–30 sec' },
          { id:'S2', name:'L-Sit Hold',                         sets:'3 sets', reps:'10–20 sec' },
          { id:'S3', name:'Muscle-Up Progressions',             sets:'3 sets', reps:'3–5 reps', note:'Jumping or band-assisted' },
        ],
        notes: [
          { label:'HANDSTAND', text:'Kick up and find balance away from wall. Target: 5+ seconds unsupported.' },
          { label:'MUSCLE-UP', text:'Explosive pull + transition phase. Jumping muscle-ups from low bar are safest.' },
          { label:'L-SIT',     text:'Aim for full leg extension. 10s clean hold is elite for beginners.' },
        ]
      }
    },
    tips: [
      { label:'INTENSITY', val:'Highest phase — manage fatigue' },
      { label:'SKILLS', val:'3–4× per week minimum' },
      { label:'DELOAD', val:'Reduce volume after week 11' },
    ],
    info: {
      goal: 'Peak intensity phase. Advanced movement patterns and consistent skill practice bring together everything from months 1 and 2.',
      rest: 'Sat · Sun (strict)',
      tip: 'Archer push-ups are demanding. If form breaks, switch to standard and add reps.',
      highlight: '5 sessions × 4 weeks = 20 weeks, ~40 total workouts'
    }
  }
};

/* ─── WEEK STRIP DEFINITIONS ─── */
window.WEEK_STRIPS = {
  month1: [
    { day:'MON', type:'FULL', active:true },
    { day:'TUE', type:'REST', active:false },
    { day:'WED', type:'FULL', active:true },
    { day:'THU', type:'REST', active:false },
    { day:'FRI', type:'FULL', active:true },
    { day:'SAT', type:'REST', active:false },
    { day:'SUN', type:'REST', active:false },
  ],
  month2: [
    { day:'MON', type:'UPPER', active:true },
    { day:'TUE', type:'LOWER', active:true },
    { day:'WED', type:'REST',  active:false },
    { day:'THU', type:'LOWER', active:true },
    { day:'FRI', type:'UPPER', active:true },
    { day:'SAT', type:'REST',  active:false },
    { day:'SUN', type:'REST',  active:false },
  ],
  month3: [
    { day:'MON', type:'UPPER', active:true },
    { day:'TUE', type:'LOWER', active:true },
    { day:'WED', type:'LOWER', active:true },
    { day:'THU', type:'UPPER', active:true },
    { day:'FRI', type:'FULL',  active:true },
    { day:'SAT', type:'REST',  active:false },
    { day:'SUN', type:'REST',  active:false },
  ],
};

/* ─── PROGRAM DAY SCHEDULE LOGIC ─── */
// Returns info object or null for a given program day (0-based from start)
window.getDayInfo = function(programDay) {
  if (programDay < 0 || programDay >= 84) return null;
  const week = Math.floor(programDay / 7);
  const dow  = programDay % 7; // 0=Sun,1=Mon,...

  if (week < 4) {
    // Month 1
    const s = PROGRAM.month1.schedule;
    if (s[dow] !== undefined) return { type: s[dow], month: 1, label: PROGRAM.month1.days[s[dow]].label, color: 'var(--m1)' };
    return null;
  } else if (week < 8) {
    // Month 2
    const s = PROGRAM.month2.schedule;
    if (s[dow] !== undefined && s[dow] !== 'skill') return { type: s[dow], month: 2, label: PROGRAM.month2.days[s[dow]].label, color: 'var(--m2)' };
    return null;
  } else if (week < 12) {
    // Month 3
    const s = PROGRAM.month3.schedule;
    if (s[dow] !== undefined && s[dow] !== 'skill') return { type: s[dow], month: 3, label: PROGRAM.month3.days[s[dow]].label, color: 'var(--m3)' };
    return null;
  }
  return null;
};

window.getMonthForWeek = function(week) {
  if (week < 4) return 1;
  if (week < 8) return 2;
  return 3;
};

window.MONTH_NAMES = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
