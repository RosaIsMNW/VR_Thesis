import { Scenario } from "../types";

export const SCENARIOS: Scenario[] = [
  {
    id: "smash_defense",
    title: "Double Defense Core: Under Smash Pressure",
    tagline: "React, absorb, and select the optimal stroke to convert a defense into an attacking rally.",
    description: "The opponents are in full-throttle attack. Opponent A (rear left) jumps high and executes a blistering straight smash targeting your right flank. You are in a ready split-step. In the blink of an eye, the shuttlecock is flashing close to your hip.",
    difficulty: "Intermediate",
    duration: 5,
    decisionTime: 3.2,
    tacticalSetup: {
      players: {
        you: { x: 75, y: 80 },
        partner: { x: 30, y: 65 },
        opponentA: { x: 25, y: 15 },
        opponentB: { x: 70, y: 38 }
      },
      shuttleInitial: { x: 25, y: 15 },
      shuttleImpactPoint: { x: 73, y: 78 },
      opponentsStanceDescription: "Opponent A is in the back-left following through their heavy smash. Opponent B is lurking at the front-right alley net, ready to intercept a flat return.",
      partnerStanceDescription: "Your partner is crouched in the front-mid-left quadrant, waiting to cover the net if you pull off a soft crosscourt drop."
    },
    educationalTip: "In doubles defense, standard high lifts keep you on defensive back-foot. A cross-court soft block forces the net player to move horizontally, causing a stance breach, which creates counter-attacking opportunities.",
    options: [
      {
        id: "s1_cross_drop",
        strokeType: "Drop",
        targetZoneName: "Net Front-Left Area",
        label: "Deceptive Cross-Court Soft Block",
        description: "Absorb the smash momentum. Tilt your racquet face slightly outward and slide the shuttlecock cross-court, landing extremely tight in the far-left net zone.",
        grade: "S",
        pointsScored: 100,
        trajectory: [
          { x: 73, y: 78 },
          { x: 50, y: 60 },
          { x: 25, y: 52 }
        ]
      },
      {
        id: "s1_line_push",
        strokeType: "Drive",
        targetZoneName: "Deep Right Alley",
        label: "Line-Drive Flat Push",
        description: "Counter-hit flat and fast over the net tape, directing it down the right line to the unoccupied rear corners, bypassing the net player.",
        grade: "A",
        pointsScored: 80,
        trajectory: [
          { x: 73, y: 78 },
          { x: 74, y: 50 },
          { x: 75, y: 22 }
        ]
      },
      {
        id: "s1_high_lift",
        strokeType: "Clear",
        targetZoneName: "Deep Rear-Left court",
        label: "High Defensive High-Lift",
        description: "Under high strain, execute a robust wrist flick to send the shuttle high and deep to the opponents' baseline, allowing you to reset your defensive footprint.",
        grade: "B",
        pointsScored: 60,
        trajectory: [
          { x: 73, y: 78 },
          { x: 50, y: 40 },
          { x: 25, y: 10 }
        ]
      },
      {
        id: "s1_wild_smash",
        strokeType: "Smash",
        targetZoneName: "Direct Midcourt",
        label: "Attempt Counter-Smash",
        description: "Attempt a wild high-power return from a low defensive posture. High risk of hitting the net tape or creating a float easily killed at the net.",
        grade: "C",
        pointsScored: 20,
        trajectory: [
          { x: 73, y: 78 },
          { x: 71, y: 60 },
          { x: 70, y: 51 }
        ]
      }
    ]
  },
  {
    id: "flick_serve_reaction",
    title: "The Service Crisis: Quick Rear-Court Transition",
    tagline: "Anticipate the trajectory, sprint backward, and execute a tactical aerial counter-attack.",
    description: "You stand ready on the right service court. Opponent B (serving from the center) delivers a deceptive high flick serve targeting your deep backhand-left corner. You must rapidly trigger a diagonal backward sprint under full biomechanical tilt.",
    difficulty: "Advanced",
    duration: 5,
    decisionTime: 2.8,
    tacticalSetup: {
      players: {
        you: { x: 20, y: 82 }, // ran deep-left to handle flick
        partner: { x: 65, y: 62 },
        opponentA: { x: 75, y: 20 },
        opponentB: { x: 45, y: 40 }
      },
      shuttleInitial: { x: 45, y: 40 },
      shuttleImpactPoint: { x: 20, y: 82 },
      opponentsStanceDescription: "Opponent B is backing up to defensive positions after serving. Opponent A is active at high-left court awaiting a drive/smash.",
      partnerStanceDescription: "Your partner has shifted slightly right to cover the open space, ready for anything."
    },
    educationalTip: "When flick-served, returning with a high defensive clear often gives opponents a perfect chance to smash. A slice cross drop forces the server into unstable lateral sprints, shifting the pressure immediately.",
    options: [
      {
        id: "s2_cross_drop",
        strokeType: "Drop",
        targetZoneName: "Opponent Net Front-Right",
        label: "Slicing Deceptive Cross Drop",
        description: "Deceptively swing with a smash motion, but at the last millisecond slice the racket across, dropping the shuttle beautifully cross-court into the front-right net corner.",
        grade: "S",
        pointsScored: 100,
        trajectory: [
          { x: 20, y: 82 },
          { x: 50, y: 65 },
          { x: 80, y: 53 }
        ]
      },
      {
        id: "s2_heavy_smash",
        strokeType: "Smash",
        targetZoneName: "Opponent B Body Center",
        label: "Jump smash at the Server",
        description: "Engage your core. Leap backward, capture the high apex, and deliver a steep, heavy smash directly at Opponent B (the server) to break their backing-up motion.",
        grade: "A",
        pointsScored: 85,
        trajectory: [
          { x: 20, y: 82 },
          { x: 32, y: 60 },
          { x: 45, y: 40 }
        ]
      },
      {
        id: "s2_punch_drive",
        strokeType: "Drive",
        targetZoneName: "Deep Midcourt Gap",
        label: "Flat Deceptive Punch-Drive",
        description: "Strike a flat, fast drive directly between both opponents. Capitalize on their mid-court rotation coordination, trying to force a communication mistake.",
        grade: "B",
        pointsScored: 65,
        trajectory: [
          { x: 20, y: 82 },
          { x: 40, y: 55 },
          { x: 60, y: 30 }
        ]
      },
      {
        id: "s2_safe_clear",
        strokeType: "Clear",
        targetZoneName: "Baseline Deep Right",
        label: "Standard Deep Defensive Clear",
        description: "Ensure complete safety. Hit a high and deep defensive clear to the rear-right corner. Highly safe but completely surrenders your tactical attacking advantage.",
        grade: "C",
        pointsScored: 40,
        trajectory: [
          { x: 20, y: 82 },
          { x: 45, y: 40 },
          { x: 75, y: 12 }
        ]
      }
    ]
  },
  {
    id: "net_kill_opportunity",
    title: "Net Blitz: Smash the Weak Net Lift",
    tagline: "Capitalize on your partner's setup. Blitz forward and execute an instantly lethal net kill.",
    description: "Your partner delivers a lethal, tight spinning drop shot. Opponent B stretches to retrieve and plays a panicky, unstable net lift that floats high and slowly right above the center tape. You sprint forward like a tiger.",
    difficulty: "Beginner",
    duration: 4,
    decisionTime: 2.1,
    tacticalSetup: {
      players: {
        you: { x: 50, y: 53 }, // hitting right at the net tape!
        partner: { x: 35, y: 70 },
        opponentA: { x: 20, y: 22 },
        opponentB: { x: 80, y: 22 }
      },
      shuttleInitial: { x: 50, y: 45 },
      shuttleImpactPoint: { x: 50, y: 52 },
      opponentsStanceDescription: "Opponents A & B are pinned deep on opposite sides, caught flatfoot and desperately bracing for some massive stroke.",
      partnerStanceDescription: "Your partner is waiting at mid-rear court, completely tracking your quick offensive rush."
    },
    educationalTip: "At the net, when the shuttle is high, do not use big swings. A short, explosive wrist snap (net-tap/kill) downwards through the center is 100% unreturnable and is the standard way to secure points instantly.",
    options: [
      {
        id: "s3_net_tap_center",
        strokeType: "Net",
        targetZoneName: "Short Mid-Court Gap",
        label: "Explosive Wrist Tap to Center",
        description: "Avoid any huge arm swing. Snap your wrist sharply downwards, pushing the shuttle straight down through the gaping space right between both defenders.",
        grade: "S",
        pointsScored: 100,
        trajectory: [
          { x: 50, y: 52 },
          { x: 50, y: 45 },
          { x: 50, y: 35 }
        ]
      },
      {
        id: "s3_cross_tap",
        strokeType: "Net",
        targetZoneName: "Opponent A Forehand Hip",
        label: "Aggressive Angled Cross Tap",
        description: "Angled tap down towards Opponent A's feet. Extremely fast and threatening, though slightly higher risk of catching the side line or net tape.",
        grade: "A",
        pointsScored: 85,
        trajectory: [
          { x: 50, y: 52 },
          { x: 35, y: 42 },
          { x: 20, y: 32 }
        ]
      },
      {
        id: "s3_spin_hairpin",
        strokeType: "Drop",
        targetZoneName: "Front Net Right Tape",
        label: "Soft Spinning Net Hairpin Roll",
        description: "Deceptively play a drop hairpin roll directly over the tape. Highly elegant, though slightly passive since they were already ready to move forward.",
        grade: "B",
        pointsScored: 70,
        trajectory: [
          { x: 50, y: 52 },
          { x: 50, y: 49 },
          { x: 50, y: 46 }
        ]
      },
      {
        id: "s3_rear_lift",
        strokeType: "Clear",
        targetZoneName: "Opponent Rear Boundary",
        label: "Wasteful Safety Lift to Back",
        description: "Instead of finishing the point, you execute a high, deep defensive lift to the backline. Relieves all pressure and lets them reset their defense.",
        grade: "C",
        pointsScored: 30,
        trajectory: [
          { x: 50, y: 52 },
          { x: 50, y: 35 },
          { x: 50, y: 15 }
        ]
      }
    ]
  }
];
