/* ════════════════════════════════════════════
   DATA.JS — Full program data with guided session support
   Each exercise has: sets, reps, restSecs, tip, cues[], muscle
   Warmup/cooldown have steps[] for guided flow
   ════════════════════════════════════════════ */

window.WARMUP_STEPS = [
  { name: 'Jumping Jacks',    duration: 60, tip: 'Full range of motion — arms fully overhead, feet wide.' },
  { name: 'High Knees',       duration: 45, tip: 'Drive knees to hip height. Stay light on your feet.' },
  { name: 'Arm Circles',      duration: 30, tip: 'Big circles, both directions. Loosen the shoulder joints.' },
  { name: 'Hip Circles',      duration: 30, tip: 'Hands on hips, big slow circles each way.' },
  { name: 'Bodyweight Squats',duration: 30, tip: 'Slow and controlled. Warm up those knees and hips.' },
  { name: 'Inchworms',        duration: 30, tip: 'Walk hands out to plank, pause, walk back. Feel the stretch.' },
];

window.COOLDOWN_STEPS = [
  { name: 'Child\'s Pose',     duration: 45, tip: 'Breathe deep. Let gravity open your hips and lower back.' },
  { name: 'Hip Flexor Stretch',duration: 45, tip: 'Front foot flat, back knee down. Tuck pelvis slightly.' },
  { name: 'Chest Opener',      duration: 40, tip: 'Clasp hands behind back, squeeze shoulder blades, lift chest.' },
  { name: 'Seated Hamstring',  duration: 45, tip: 'Sit tall, reach for toes. Exhale into the stretch.' },
  { name: 'Thread the Needle', duration: 40, tip: 'On all fours, thread one arm under — great for thoracic rotation.' },
  { name: 'Cat-Cow',           duration: 30, tip: 'Slow and deliberate. Match movement to your breath.' },
  { name: 'Deep Breathing',    duration: 60, tip: '4 counts in, hold 2, 6 counts out. Your heart rate will drop.' },
];

window.PROGRAM = {

  /* ──────────────────────────────────────────
     MONTH 1: Full body 3×/week — Weeks 1–4
  ────────────────────────────────────────── */
  month1: {
    label: 'Building Foundation', weeks: '1–4', freq: '3×/WEEK',
    color: 'var(--m1)', badge: 'm-badge-1',
    schedule: { 1:'full', 3:'full', 5:'full' },
    totalSessions: 12,
    days: {
      full: {
        label: 'Full Body', tag: 'tag-full', days: 'MON · WED · FRI',
        goal: 'Build the base. Master movement patterns. Increase volume gradually over 4 weeks.',
        exercises: [
          {
            id:'01', name:'Push-ups',
            sets: 3, reps:'8–12', restSecs: 60,
            muscle: 'CHEST · TRICEPS · SHOULDERS',
            tip: 'If 12 reps feels easy, slow the descent to 3 seconds.',
            cues: [
              'Hands shoulder-width apart, fingers forward',
              'Body forms a straight line — no sagging hips',
              'Lower until chest nearly touches the floor',
              'Press up explosively, elbows ~45° from body',
            ]
          },
          {
            id:'02', name:'Pull-ups / Inverted Rows',
            sets: 3, reps:'5–8', restSecs: 90,
            muscle: 'BACK · BICEPS',
            tip: 'Use a resistance band looped over the bar if pull-ups are too hard.',
            cues: [
              'Dead hang start — fully extended arms',
              'Engage core, pull shoulder blades down and back',
              'Drive elbows toward hips until chin clears bar',
              'Lower slowly — 2–3 seconds down',
            ]
          },
          {
            id:'03', name:'Dips',
            sets: 3, reps:'8–12', restSecs: 60,
            muscle: 'TRICEPS · CHEST · FRONT DELTS',
            tip: 'Use a bench if no bars. Keep torso slightly forward for more chest activation.',
            cues: [
              'Grip bars, arms locked, body upright',
              'Lower until upper arms are parallel to floor',
              'Keep elbows close to body — don\'t flare them out',
              'Press back up fully, squeeze triceps at top',
            ]
          },
          {
            id:'04', name:'Squats',
            sets: 3, reps:'15–20', restSecs: 60,
            muscle: 'QUADS · GLUTES · HAMSTRINGS',
            tip: 'Focus on depth and control now — heavier load comes later.',
            cues: [
              'Feet shoulder-width, toes slightly out',
              'Brace core, chest tall — don\'t round forward',
              'Break at hips and knees simultaneously',
              'Thighs parallel or below — drive through heels to stand',
            ]
          },
          {
            id:'05', name:'Lunges',
            sets: 3, reps:'10–15 per leg', restSecs: 60,
            muscle: 'QUADS · GLUTES · BALANCE',
            tip: 'Keep your front shin vertical. A common error is letting the knee drift over toes.',
            cues: [
              'Step forward — long enough that shin stays vertical',
              'Lower back knee toward floor with control',
              'Front knee tracks over 2nd toe, not caving in',
              'Push off front heel to return to start',
            ]
          },
          {
            id:'06', name:'Plank',
            sets: 3, reps:'30–60 sec', restSecs: 45, isTimed: true,
            defaultSecs: 45,
            muscle: 'CORE · SHOULDERS · GLUTES',
            tip: 'Squeeze everything — glutes, quads, abs. Breathing should be controlled, not held.',
            cues: [
              'Elbows under shoulders, forearms flat',
              'Squeeze glutes and brace abs hard',
              'No hips sagging or piking up',
              'Eyes to floor, neck neutral',
            ]
          },
        ]
      }
    },
    tips: [
      { label:'REST', val:'48h between sessions min.' },
      { label:'PROTEIN', val:'~1.6g / kg bodyweight' },
      { label:'SLEEP', val:'7–9 hours for recovery' },
    ],
    info: {
      goal: 'Build a solid foundation. Master basic movement patterns and develop the strength base for months 2 and 3.',
      rest: 'Tue · Thu · Sat · Sun',
      tip: 'Use a resistance band for pull-ups if needed. Focus on clean form over rep count.',
      highlight: '3 sessions × 4 weeks = 12 total workouts'
    }
  },

  /* ──────────────────────────────────────────
     MONTH 2: Split 4×/week — Weeks 5–8
  ────────────────────────────────────────── */
  month2: {
    label: 'Increasing Intensity', weeks: '5–8', freq: '4×/WEEK',
    color: 'var(--m2)', badge: 'm-badge-2',
    schedule: { 1:'upper', 2:'lower', 4:'lower', 5:'upper' },
    totalSessions: 32,
    days: {
      upper: {
        label: 'Upper Body', tag: 'tag-upper', days: 'MON & FRI',
        goal: 'Increase pushing and pulling volume. Introduce overhead work via pike push-ups.',
        exercises: [
          {
            id:'01', name:'Push-ups',
            sets: 4, reps:'10–15', restSecs: 60,
            muscle: 'CHEST · TRICEPS · SHOULDERS',
            tip: 'Add a pause at the bottom (1 sec) to increase time under tension.',
            cues: [
              'Hands shoulder-width, full body tension',
              'Lower with control — 2 count down',
              'Pause briefly at the bottom',
              'Explode up, lock out without flaring elbows',
            ]
          },
          {
            id:'02', name:'Pull-ups / Inverted Rows',
            sets: 4, reps:'6–10', restSecs: 90,
            muscle: 'BACK · BICEPS · REAR DELTS',
            tip: 'If you got 8 last week at bodyweight, try a slower negative this week.',
            cues: [
              'Full dead hang at bottom',
              'Initiate by depressing scapula first',
              'Pull elbows to hips — not just chin over bar',
              '3 second negative on the way down',
            ]
          },
          {
            id:'03', name:'Dips',
            sets: 4, reps:'10–15', restSecs: 60,
            muscle: 'TRICEPS · CHEST · FRONT DELTS',
            tip: 'Add a slight forward lean to shift more work onto the chest.',
            cues: [
              'Controlled descent — 2 counts down',
              'Elbows track backward, not flaring wide',
              'Full extension at top without locking out violently',
              'Breathe in on the way down, out on the push',
            ]
          },
          {
            id:'04', name:'Pike Push-ups',
            sets: 3, reps:'8–12', restSecs: 75,
            muscle: 'SHOULDERS · TRICEPS · UPPER CHEST',
            tip: 'The higher your hips, the more shoulder work. Work toward a fully vertical torso.',
            cues: [
              'Form an inverted V — hips high, arms and legs straight',
              'Hands slightly wider than shoulder-width',
              'Lower the crown of your head toward the floor',
              'Press back up to full arm extension',
            ]
          },
          {
            id:'05', name:'Plank to Push-up',
            sets: 3, reps:'10–15', restSecs: 60,
            muscle: 'CORE · TRICEPS · SHOULDERS',
            tip: 'Keep hips level throughout — don\'t rotate. Slow wins here.',
            cues: [
              'Start in forearm plank position',
              'Press up one hand at a time to full push-up position',
              'Lower back down one arm at a time',
              'Alternate which hand leads each rep',
            ]
          },
        ]
      },
      lower: {
        label: 'Lower Body & Core', tag: 'tag-lower', days: 'TUE & THU',
        goal: 'Higher volume leg work. Introduce hanging core and rotational ab exercises.',
        exercises: [
          {
            id:'01', name:'Squats',
            sets: 4, reps:'20–25', restSecs: 75,
            muscle: 'QUADS · GLUTES · HAMSTRINGS',
            tip: 'Volume week. Keep rest short and focused. Form over speed.',
            cues: [
              'Feet shoulder-width, toes slightly out',
              'Break at hips and knees together',
              'Keep chest tall and brace hard',
              'Full depth — thighs parallel or below',
            ]
          },
          {
            id:'02', name:'Lunges',
            sets: 4, reps:'15–20 per leg', restSecs: 75,
            muscle: 'QUADS · GLUTES · BALANCE',
            tip: 'Walking lunges are allowed — they add a balance challenge.',
            cues: [
              'Long step — shin stays vertical',
              'Back knee approaches floor without touching',
              'Push off front heel, drive through glute',
              'Core tight, torso upright throughout',
            ]
          },
          {
            id:'03', name:'Glute Bridges',
            sets: 3, reps:'20–25', restSecs: 45,
            muscle: 'GLUTES · HAMSTRINGS · LOWER BACK',
            tip: 'Squeeze and hold at the top for a full second on each rep.',
            cues: [
              'Feet flat, knees bent, arms at sides',
              'Drive through heels, squeeze glutes to lift hips',
              'Body forms a straight line from knees to shoulders',
              'Hold the peak contraction 1 second, then lower',
            ]
          },
          {
            id:'04', name:'Calf Raises',
            sets: 3, reps:'20–25', restSecs: 45,
            muscle: 'CALVES · ACHILLES',
            tip: 'Do these on a step edge for full range of motion — stretch at bottom, squeeze at top.',
            cues: [
              'Stand tall, feet hip-width',
              'Rise onto balls of feet as high as possible',
              'Pause and squeeze at the top',
              'Lower fully — get a stretch at the bottom',
            ]
          },
          {
            id:'05', name:'Hanging Leg Raises',
            sets: 3, reps:'8–12', restSecs: 75,
            muscle: 'ABS · HIP FLEXORS · GRIP',
            tip: 'If straight leg is too hard, bend knees and bring them to chest first.',
            cues: [
              'Dead hang — core engaged before moving',
              'Tuck pelvis — don\'t swing',
              'Raise legs to hip height (or higher)',
              'Lower with control — don\'t drop',
            ]
          },
          {
            id:'06', name:'Russian Twists',
            sets: 3, reps:'20 per side', restSecs: 45,
            muscle: 'OBLIQUES · CORE',
            tip: 'Elevate feet off the floor for more challenge. Control the rotation — no whipping.',
            cues: [
              'Sit at ~45°, feet lifted or flat',
              'Clasp hands together, arms slightly bent',
              'Rotate from the torso — not just the arms',
              'Touch hands to floor each side, controlled',
            ]
          },
        ]
      },
      skill: {
        label: 'Skill Training', tag: 'tag-skill', days: 'AFTER WORKOUT · 2–3×/WEEK',
        goal: 'Begin skill foundations. Consistency here pays off massively in month 3.',
        exercises: [
          {
            id:'S1', name:'Handstand Practice (wall-assisted)',
            sets: 3, reps:'20–30 sec', restSecs: 60, isTimed: true, defaultSecs: 25,
            muscle: 'SHOULDERS · CORE · BALANCE',
            tip: 'Wrist warm-up first. 3 sets. Don\'t grind — stop before form breaks.',
            cues: [
              'Kick up with hands ~6 inches from wall',
              'Stack wrists, shoulders, hips in one line',
              'Hollow body — don\'t arch the lower back',
              'Spread fingers, press through fingertips for balance',
            ]
          },
          {
            id:'S2', name:'L-Sit Progressions (tuck sits)',
            sets: 3, reps:'10–15 sec', restSecs: 60, isTimed: true, defaultSecs: 12,
            muscle: 'ABS · HIP FLEXORS · TRICEPS',
            tip: 'Start with feet barely off the floor. That\'s completely fine. Duration beats height.',
            cues: [
              'Parallel bars or floor (on fists)',
              'Depress scapula hard — push shoulders down',
              'Lean forward slightly',
              'Tuck knees to chest, hold as long as possible',
            ]
          },
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
      highlight: '4 sessions × 4 weeks = ~32 total workouts'
    }
  },

  /* ──────────────────────────────────────────
     MONTH 3: Advanced 4–5×/week — Weeks 9–12
  ────────────────────────────────────────── */
  month3: {
    label: 'Skill Mastery', weeks: '9–12', freq: '4–5×/WEEK',
    color: 'var(--m3)', badge: 'm-badge-3',
    schedule: { 1:'upper', 2:'lower', 3:'lower', 4:'upper', 5:'full' },
    totalSessions: 40,
    days: {
      upper: {
        label: 'Upper Body — Advanced', tag: 'tag-upper', days: 'MON & THU',
        goal: 'Decline and archer push-ups for chest depth. Unilateral strength emphasis.',
        exercises: [
          {
            id:'01', name:'Decline Push-ups',
            sets: 4, reps:'10–15', restSecs: 60,
            muscle: 'UPPER CHEST · SHOULDERS · TRICEPS',
            tip: 'Feet on a chair or box. The steeper the angle, the more upper chest and shoulder work.',
            cues: [
              'Feet elevated 30–45 cm, hands shoulder-width',
              'Body perfectly straight from feet to head',
              'Lower until chest almost touches floor',
              'Press back up with control — don\'t lock elbows violently',
            ]
          },
          {
            id:'02', name:'Pull-ups',
            sets: 4, reps:'8–12', restSecs: 90,
            muscle: 'LATS · BICEPS · REAR DELTS',
            tip: 'Aim for strict reps only. Zero kipping. Add a 4-second negative if you run out of gas.',
            cues: [
              'Overhand grip, hands just wider than shoulders',
              'Full dead hang between reps',
              'Pull shoulder blades down and back first',
              'Drive elbows to hips — don\'t just pull with arms',
            ]
          },
          {
            id:'03', name:'Dips',
            sets: 4, reps:'10–15', restSecs: 60,
            muscle: 'TRICEPS · CHEST · FRONT DELTS',
            tip: 'By now this should feel relatively comfortable. Focus on a slow 3-second descent.',
            cues: [
              '3-second controlled descent',
              'Elbows track backward — no flaring',
              'Full lockout at the top',
              'Keep core tight and avoid swinging',
            ]
          },
          {
            id:'04', name:'Archer Push-ups',
            sets: 3, reps:'6–10 per side', restSecs: 75,
            muscle: 'CHEST · SHOULDERS · TRICEPS (UNILATERAL)',
            tip: 'This is a one-arm push-up progression. The supporting arm assists — let it.',
            cues: [
              'Wide hand placement — much wider than standard',
              'Shift weight toward one arm as you lower',
              'The other arm stays extended and assists only slightly',
              'Alternate sides each rep',
            ]
          },
          {
            id:'05', name:'Plank to Push-up',
            sets: 3, reps:'15–20', restSecs: 60,
            muscle: 'CORE · TRICEPS · TOTAL BODY',
            tip: 'This is a volume exercise now. Speed up slightly vs Month 2 — controlled but brisk.',
            cues: [
              'Start in forearm plank — body rigid',
              'Press up hand by hand to full push-up',
              'Lower back down hand by hand',
              'Alternate lead hand every rep',
            ]
          },
        ]
      },
      lower: {
        label: 'Lower Body & Core — Advanced', tag: 'tag-lower', days: 'TUE & WED',
        goal: 'Unilateral leg work corrects strength imbalances. Advanced core with windshield wipers.',
        exercises: [
          {
            id:'01', name:'Pistol Squats (assisted)',
            sets: 4, reps:'6–10 per leg', restSecs: 90,
            muscle: 'QUADS · GLUTES · BALANCE',
            tip: 'Hold a door frame or TRX for balance. The goal is full depth — the support is fine.',
            cues: [
              'Stand on one leg, other leg extended forward',
              'Sit back and down — hinge at hip and knee',
              'Reach full depth, chest tall, knee tracking over toes',
              'Drive through heel to stand — squeeze glute at top',
            ]
          },
          {
            id:'02', name:'Bulgarian Split Squats',
            sets: 4, reps:'10–15 per leg', restSecs: 75,
            muscle: 'QUADS · GLUTES · HAMSTRINGS',
            tip: 'Back foot elevated on a bench or chair. Front foot far enough forward that shin stays vertical.',
            cues: [
              'Front foot placed far forward, back foot on bench',
              'Lower straight down — not forward',
              'Front shin vertical, knee tracking toe',
              'Drive through front heel to return',
            ]
          },
          {
            id:'03', name:'Single-Leg Glute Bridges',
            sets: 3, reps:'15–20 per leg', restSecs: 45,
            muscle: 'GLUTES · HAMSTRINGS · LOWER BACK',
            tip: 'Extend one leg straight. Hold the peak for 1 full second. Feel the glute working.',
            cues: [
              'One foot flat on floor, other leg straight',
              'Drive through working heel to lift hips',
              'Squeeze glute hard at the top for 1 second',
              'Lower with control — don\'t just drop',
            ]
          },
          {
            id:'04', name:'Calf Raises',
            sets: 3, reps:'25–30', restSecs: 45,
            muscle: 'CALVES · ACHILLES',
            tip: 'Use a step for full range. Slow down to 2 seconds up, 2 seconds down.',
            cues: [
              'Full stretch at the bottom, full squeeze at top',
              '2-second up, pause, 2-second down',
              'Keep weight even across the foot',
              'Don\'t let ankles roll out',
            ]
          },
          {
            id:'05', name:'Hanging Leg Raises',
            sets: 3, reps:'10–15', restSecs: 75,
            muscle: 'ABS · HIP FLEXORS · GRIP',
            tip: 'Try to touch your toes to the bar. Full ROM = more ab recruitment.',
            cues: [
              'Start with a tight dead hang — zero swing',
              'Raise legs straight, toes toward bar',
              'Pause at the top — feel the abs contract',
              'Lower with control — resist gravity on the way down',
            ]
          },
          {
            id:'06', name:'Windshield Wipers',
            sets: 3, reps:'10–15 per side', restSecs: 75,
            muscle: 'OBLIQUES · CORE · GRIP',
            tip: 'One of the most demanding core moves. If the full version is too hard, bend your knees.',
            cues: [
              'Hang from bar, raise legs to 90°',
              'Rotate legs side to side like a wiper',
              'Control comes from the obliques — not momentum',
              'Touch one side, come back to center, touch the other',
            ]
          },
        ]
      },
      full: {
        label: 'Full Body Finisher', tag: 'tag-full', days: 'FRI',
        goal: 'End-of-week full body. Lighter than earlier months — focus on quality and skill integration.',
        exercises: [
          {
            id:'01', name:'Push-ups (variant of choice)',
            sets: 3, reps:'15–20', restSecs: 60,
            muscle: 'CHEST · TRICEPS',
            tip: 'Pick your best push-up variant. Standard, decline, or archer — all count.',
            cues: ['Full range of motion','Controlled descent','Squeeze chest at top','Pick a variant that challenges you at 15–20 reps']
          },
          {
            id:'02', name:'Pull-ups',
            sets: 3, reps:'8–12', restSecs: 75,
            muscle: 'BACK · BICEPS',
            tip: 'Strict reps only. This is the finisher — not a strength day.',
            cues: ['Dead hang start','Initiate with scapula','Drive elbows to hips','Control the negative']
          },
          {
            id:'03', name:'Squats',
            sets: 3, reps:'20', restSecs: 60,
            muscle: 'QUADS · GLUTES',
            tip: 'Full depth. These should feel manageable by week 9+.',
            cues: ['Chest tall, brace core','Break at hip and knee together','Full depth — below parallel','Drive through heels']
          },
          {
            id:'04', name:'Dips',
            sets: 3, reps:'12–15', restSecs: 60,
            muscle: 'TRICEPS · CHEST',
            tip: 'Moderate pace. Full ROM. Control every rep.',
            cues: ['Controlled descent','No forward lean unless intentional','Full lockout at top','Breathe steadily']
          },
          {
            id:'05', name:'Plank',
            sets: 3, reps:'45–60 sec', restSecs: 45, isTimed: true, defaultSecs: 50,
            muscle: 'CORE · TOTAL BODY',
            tip: 'You\'ve been planking for 12 weeks — this should feel solid. Squeeze everything.',
            cues: ['Elbows under shoulders','Glutes, quads, abs all tight','Neutral spine — no sag','Breathe steadily through the hold']
          },
        ]
      },
      skill: {
        label: 'Skill Training', tag: 'tag-skill', days: 'AFTER WORKOUT · 3–4×/WEEK',
        goal: 'Progress toward free-standing handstand, full L-sit, and first muscle-up.',
        exercises: [
          {
            id:'S1', name:'Handstand (free-standing attempts)',
            sets: 3, reps:'20–30 sec', restSecs: 75, isTimed: true, defaultSecs: 25,
            muscle: 'SHOULDERS · CORE · BALANCE',
            tip: 'Move away from the wall. Kick up and find balance. Falling is progress.',
            cues: [
              'Kick up confidently — hesitation kills the balance',
              'Stack wrists under shoulders, hollow body',
              'Spread fingers, press through index finger to balance',
              'Look slightly past your hands',
            ]
          },
          {
            id:'S2', name:'L-Sit Hold',
            sets: 3, reps:'10–20 sec', restSecs: 60, isTimed: true, defaultSecs: 15,
            muscle: 'ABS · HIP FLEXORS · TRICEPS',
            tip: 'Extend one leg at a time if full L-sit is still hard. Eventually get both straight.',
            cues: [
              'Full scapular depression — push shoulders to ears, then press down hard',
              'Lean forward slightly from the wrist',
              'Both legs extended forward, toes pointed',
              'Hold position — breathe shallowly',
            ]
          },
          {
            id:'S3', name:'Muscle-Up Progressions',
            sets: 3, reps:'3–5', restSecs: 120,
            muscle: 'BACK · CHEST · TRICEPS · CORE',
            tip: 'Jumping muscle-ups from a low bar first. Focus on the transition — pulling elbows past the bar.',
            cues: [
              'Explosive pull — get chin way above bar',
              'Lean forward and punch wrists over the bar',
              'Push down as your torso rises above the bar',
              'Lock out at the top with straight arms',
            ]
          },
        ],
        notes: [
          { label:'HANDSTAND', text:'Kick up and find balance away from wall. Target: 5+ seconds unsupported.' },
          { label:'MUSCLE-UP', text:'Explosive pull + transition phase. Jumping muscle-ups from low bar are safest entry.' },
          { label:'L-SIT',     text:'Aim for full leg extension. 10s clean hold is elite for a 12-week program.' },
        ]
      }
    },
    tips: [
      { label:'INTENSITY', val:'Highest phase — manage fatigue' },
      { label:'SKILLS', val:'3–4× per week minimum' },
      { label:'DELOAD', val:'Reduce volume after week 11' },
    ],
    info: {
      goal: 'Peak intensity phase. Advanced movements and consistent skill practice bring together everything from months 1 and 2.',
      rest: 'Sat · Sun (strict)',
      tip: 'Archer push-ups are demanding. If form breaks, revert to standard push-ups and add reps.',
      highlight: '5 sessions × 4 weeks = ~40 total workouts'
    }
  }
};

/* ─── WEEK STRIP DEFINITIONS ─── */
window.WEEK_STRIPS = {
  month1: [
    { day:'MON', type:'FULL',  active:true  },
    { day:'TUE', type:'REST',  active:false },
    { day:'WED', type:'FULL',  active:true  },
    { day:'THU', type:'REST',  active:false },
    { day:'FRI', type:'FULL',  active:true  },
    { day:'SAT', type:'REST',  active:false },
    { day:'SUN', type:'REST',  active:false },
  ],
  month2: [
    { day:'MON', type:'UPPER', active:true  },
    { day:'TUE', type:'LOWER', active:true  },
    { day:'WED', type:'REST',  active:false },
    { day:'THU', type:'LOWER', active:true  },
    { day:'FRI', type:'UPPER', active:true  },
    { day:'SAT', type:'REST',  active:false },
    { day:'SUN', type:'REST',  active:false },
  ],
  month3: [
    { day:'MON', type:'UPPER', active:true  },
    { day:'TUE', type:'LOWER', active:true  },
    { day:'WED', type:'LOWER', active:true  },
    { day:'THU', type:'UPPER', active:true  },
    { day:'FRI', type:'FULL',  active:true  },
    { day:'SAT', type:'REST',  active:false },
    { day:'SUN', type:'REST',  active:false },
  ],
};

/* ─── SCHEDULE LOGIC ─── */
window.getDayInfo = function(programDay) {
  if (programDay < 0 || programDay >= 84) return null;
  const week = Math.floor(programDay / 7);
  const dow  = programDay % 7;
  let mData, mNum;
  if (week < 4)       { mData = PROGRAM.month1; mNum = 1; }
  else if (week < 8)  { mData = PROGRAM.month2; mNum = 2; }
  else                { mData = PROGRAM.month3; mNum = 3; }
  const type = mData.schedule[dow];
  if (!type || type === 'skill') return null;
  return {
    type, month: mNum, color: mData.color,
    label: mData.days[type].label,
    dayData: mData.days[type],
    monthData: mData,
    week: week + 1,
  };
};

window.MONTH_NAMES = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
                      'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
