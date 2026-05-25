import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!ai) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== "MY_GEMINI_API_KEY" && key.trim() !== "") {
      try {
        ai = new GoogleGenAI({
          apiKey: key,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            },
          },
        });
        console.log("Gemini client successfully initialized.");
      } catch (err) {
        console.error("Failed to initialize Gemini client:", err);
      }
    }
  }
  return ai;
}

// Off-line local sport-science database fallback for clean experience if API key is not configured
const LOCAL_FEEDBACK_DB: Record<string, Record<string, any>> = {
  smash_defense: {
    s1_cross_drop: {
      success: true,
      score: 100,
      feedback: "Spectacular reaction! Redirecting the heavy down-the-line smash cross-court completely neutralizes Opponent B, who was closing in for a straight net kill. By absorbing the force of the smash, you force their offensive pair to scramble horizontally, putting your own team instantly in command.",
      tacticalVerdict: "S-Tier Masterstroke. Perfect application of doubles neutralisation theory.",
      alternativeSuggestion: "A straight flat push represents a strong alternative, but is higher risk as Opponent B can reach it with an active lunge.",
      proPlayerStrategy: "This mirrors the defensive style of Indonesian master Hendra Setiawan, who soft-blocks heavy smashes cross-court to force immediate defensive-offensive transitions."
    },
    s1_line_push: {
      success: true,
      score: 80,
      feedback: "Strong drive! Pushing flat down the right line is extremely smart. Because Opponent A is recovering from their jump smash action, they are out of athletic stance, so hitting deep to their rear right makes them play a late, awkward backhand drop.",
      tacticalVerdict: "A-Tier Drive. A high-efficiency option targeting recovery times.",
      alternativeSuggestion: "If you want supreme deception, a cross block (S-Grade) requires even faster wrist absorption but completely disables both opponents.",
      proPlayerStrategy: "Reminiscent of Yuta Watanabe’s high-speed flat counter-attacks where he redirects heavy smash momentum flat down the flank."
    },
    s1_high_lift: {
      success: true,
      score: 60,
      feedback: "Extremely safe play, but passive. A deep defensive lift reset relieves initial pressure and buys time for your partner to stand side-by-side with you. However, you are back under attack; the opponents retain their aggressive overhead shape.",
      tacticalVerdict: "B-Tier Reset. High-safeness but high-passiveness.",
      alternativeSuggestion: "Try to drop or block flat to force the opponent to lift, allowing your team to seize the attack instead.",
      proPlayerStrategy: "Similar to the traditional safe play by defensive stalwarts like Aaron Chia & Soh Wooi Yik, returning to defense to test their smash endurance."
    },
    s1_wild_smash: {
      success: false,
      score: 20,
      feedback: "Unsound biomechanics. Smashing back from a low, squatted smash-reception posture is highly dangerous. You have almost no height leverage; the shuttlecock is highly likely to crash into the net or float lazily into the center for Opponent B to net-brush.",
      tacticalVerdict: "C-Tier Error. Unrealistic shot execution from an off-balance position.",
      alternativeSuggestion: "Focus on softening your grip and tilting your racket face. Let the racquet absorb the speed instead of trying to generate speed.",
      proPlayerStrategy: "Elite pairs almost never counter-smash from their hips unless they are extremely tall and have already stepped backward to take the bird high."
    }
  },
  flick_serve_reaction: {
    s2_cross_drop: {
      success: true,
      score: 100,
      feedback: "An outstanding choice! Since both opponents are anticipating a straight smash response from your deep corner, slicing the bird cross-court exploits the vacated short right-net pocket. Opponent B (already backing up) is forced to halt momentum and lunge vertically.",
      tacticalVerdict: "S-Tier Excellence. Magnificent deceptive touch under heavy balance constraint.",
      alternativeSuggestion: "A heavy body smash is great, but requires outstanding jump power to avoid a block.",
      proPlayerStrategy: "An absolute hallmark of Tai Tzu-ying and Kevin Sanjaya Sukamuljo, who frequently slice cross-court drop shots from baseline corners to exhaust their opponents' lateral agility."
    },
    s2_heavy_smash: {
      success: true,
      score: 85,
      feedback: "Strong, assertive power play. A heavy smash down the center-midcourt targets Opponent B right as they are moving back-right, forcing an awkward chest-level block. This maintains your attacking flow and forces a weak lift.",
      tacticalVerdict: "A-Tier Power Attack. Excellent weaponization of pace.",
      alternativeSuggestion: "If they have quick reflexes, they can get their racquet under. A cross drop (S-Grade) utilizes maximum empty space.",
      proPlayerStrategy: "This aligns with the heavy backcourt bombardment of Fu Haifeng, who consistently answers high clears and flicks with direct, high-trajectory smashes to shatter defensive stances."
    },
    s2_punch_drive: {
      success: true,
      score: 65,
      feedback: "A quick, flat drive that targets the center channel. While it minimizes the opponents' time to respond, if they have active racquets, Opponent A can block this down your open line. High-risk, medium-reward.",
      tacticalVerdict: "B-Tier Aggressive Wedge. High speed, moderate tactical risk.",
      alternativeSuggestion: "Slicing drop or high clears provide more control and structure from deep backhand court.",
      proPlayerStrategy: "Popularized by rapid-drive specialists like Li Junhui, who trade fine control for straight, high-speed flat exchanges."
    },
    s2_safe_clear: {
      success: false,
      score: 40,
      feedback: "High safety but poor tactical outcome. Hitting a safe, deep defensive clear back to their baseline gives them an optimal overhead setup. For a high-velocity doubles match, a clear from a flick serve completely hands over the rally control.",
      tacticalVerdict: "C-Tier Deficit. Wastes an offensive reception opportunity.",
      alternativeSuggestion: "Even a soft straight drop shot is better. Attempt to keep the shuttlecock traveling downwards.",
      proPlayerStrategy: "Very rare in professional doubles today; elite players will do anything to slice or push downwards to avoid giving away the attack."
    }
  },
  net_kill_opportunity: {
    s3_net_tap_center: {
      success: true,
      score: 100,
      feedback: "Absolutely lethal! A precise, short wrist-snap (net-tap) directed through the central seam is the standard 'Point Ender'. The defenders are pinned deep left and right, making the center dead-zone completely unreachable.",
      tacticalVerdict: "S-Tier Masterclass. Clinical, high-efficiency finish.",
      alternativeSuggestion: "Targeting Opponent A's hip is also smart, but the center line has 0% chance of interception.",
      proPlayerStrategy: "Perfect showcase of Kevin Sanjaya Sukamuljo’s notorious net blitzes, where he snaps his wrist downward mid-air to terminate weak lifts instantly."
    },
    s3_cross_tap: {
      success: true,
      score: 85,
      feedback: "Exceedingly aggressive! Slashing the net kill cross-court straight down to Opponent A's forehand hip is extremely fast and likely to force a block error. However, crosscourt angles carry a slightly higher risk of hitting the net tape.",
      tacticalVerdict: "A-Tier Aggression. Excellent pressure-point attack.",
      alternativeSuggestion: "A straight wrist-tap (S-Grade) down the middle has a wider margin of error and requires less horizontal body shift.",
      proPlayerStrategy: "Matches the style of Lee Yong-dae, who would drive weak returns directly into the closest opponent's chest to extract weak block errors."
    },
    s3_spin_hairpin: {
      success: true,
      score: 70,
      feedback: "Extremely beautiful, but technically redundant. Playing a slow hairpin roll when the bird is floating high gives the opponents time to gather their footing. While a great drop of technique, it lets a winning opportunity prolong into another rally.",
      tacticalVerdict: "B-Tier Aesthetic. Sub-optimal choice where a direct kill was available.",
      alternativeSuggestion: "Push downward! In doubles, the net must be dominated with quick downward wrist-taps.",
      proPlayerStrategy: "This resembles a playful, showboating style, but under high-pressure competitive setups, players always choose the downward kill."
    },
    s3_rear_lift: {
      success: false,
      score: 30,
      feedback: "Huge tactical mistake! Lifting a weak, floating net bird all the way back to their baseline is a massive waste of tactical leverage. You had the net dominated and chose to return the game back to equal or defensive standing.",
      tacticalVerdict: "C-Tier Wasted Chance. Severe tactical regression.",
      alternativeSuggestion: "Keep your racquet head high, step forward, and use a short push. Never lift when the bird is above the net tape!",
      proPlayerStrategy: "This would receive an immediate visual facepalm from any professional doubles coach. Always kill the floating net-error."
    }
  }
};

// API Route for Decision Analysis
app.post("/api/analyze-decision", async (req, res) => {
  const { scenarioId, selectedOptionId, clickTimeMs, label, strokeType, targetZoneName, description } = req.body;

  if (!scenarioId || !selectedOptionId) {
    return res.status(400).json({ error: "Missing required parameters." });
  }

  // Get local base feedback
  const localGroup = LOCAL_FEEDBACK_DB[scenarioId] || {};
  const fallbackData = localGroup[selectedOptionId] || {
    success: false,
    score: 50,
    feedback: "You made a tactical decision. Keep practicing your court positioning!",
    tacticalVerdict: "B-Tier choice.",
    alternativeSuggestion: "Try to target areas that pull the opponents out of balance.",
    proPlayerStrategy: "Professional players emphasize keeping the shuttlecock trajectory downwards in doubles."
  };

  const client = getGeminiClient();

  if (!client) {
    // If no Gemini API key, return local expert sports-science feedback immediately
    console.log("No Gemini API Key found. Serving highly professional local data fallback.");
    return res.json({
      scenarioId,
      selectedOptionId,
      ...fallbackData,
      reactionSpeedCommentary: `Reaction time: ${(clickTimeMs / 1000).toFixed(2)}s. ${
        clickTimeMs < 1500
          ? "Excellent elite-level cognitive reflex!"
          : clickTimeMs < 3000
          ? "Good reaction speed, matching competitive standard."
          : "Slightly slow reaction. Train your anticipatory reflexes."
      }`
    });
  }

  // If Gemini client is active, construct a deep analysis prompt to make the app incredibly smart!
  try {
    const reactionSec = (clickTimeMs / 1000).toFixed(2);
    
    // Detailed prompt to construct custom sporty response
    const prompt = `
      You are a world-class Elite Badminton Doubles Coach and Sports Science Researcher.
      Analyze the player's decision in the following tactical sports-science scenario:
      
      [SCENARIO]
      Scenario ID: ${scenarioId}
      User's Choice Option ID: ${selectedOptionId}
      Chosen Shot: ${label || strokeType}
      Target Zone: ${targetZoneName}
      User's Reaction Speed: ${reactionSec} seconds
      Description of Choice: ${description || ""}
      
      [REFERENCE LOCAL FEEDBACK]
      Base Verdict: ${fallbackData.tacticalVerdict}
      Base Score: ${fallbackData.score}/100
      Base Feedback: ${fallbackData.feedback}
      
      Please write a highly customized, hyper-professional, and engaging sports science critique.
      Incorporate:
      - Biomechanical impact: Analyze the impact of their reaction speed (${reactionSec}s).
      - Tactical soundess check: Assess if this helps them transition from defending to attacking.
      - A comprehensive Pro Match Analogy: Connect their choice to recent tactical choices of world-class doubles pairs (e.g. Hendra Setiawan, Kevin Sanjaya Sukamuljo, Fu Haifeng, Lee Yong-dae, Aaron Chia, Wang Chi-Lin, etc.).
      - Clear educational instructions.
      
      Provide your response in strict JSON matching the requested schema. Return empty values ONLY if you cannot formulate a response, but you should always formulate a fantastic coaching critique!
    `;

    console.log(`Querying Gemini with model 'gemini-3.5-flash' for scenario: ${scenarioId}...`);

    const result = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            score: { type: Type.NUMBER },
            feedback: { type: Type.STRING, description: "A detailed 3-4 sentence professional sports-science feedback explaining the tactical result." },
            tacticalVerdict: { type: Type.STRING, description: "A short, snappy rating e.g., 'S-Tier Elite Block' or 'C-Tier Technical Waste'." },
            alternativeSuggestion: { type: Type.STRING, description: "Suggest a better alternative shot or key court positioning tweak." },
            proPlayerStrategy: { type: Type.STRING, description: "An exciting connection to standard professional doubles strategies or famous players." }
          },
          required: ["success", "score", "feedback", "tacticalVerdict", "alternativeSuggestion", "proPlayerStrategy"]
        }
      }
    });

    const responseText = result.text;
    if (responseText) {
      const parsed = JSON.parse(responseText.trim());
      return res.json({
        scenarioId,
        selectedOptionId,
        success: parsed.success ?? fallbackData.success,
        score: parsed.score ?? fallbackData.score,
        feedback: parsed.feedback ?? fallbackData.feedback,
        tacticalVerdict: parsed.tacticalVerdict ?? fallbackData.tacticalVerdict,
        alternativeSuggestion: parsed.alternativeSuggestion ?? fallbackData.alternativeSuggestion,
        proPlayerStrategy: parsed.proPlayerStrategy ?? fallbackData.proPlayerStrategy,
        reactionSpeedCommentary: `Reaction time: ${reactionSec}s. ${
          clickTimeMs < 1500
            ? "Outstanding elite reaction rate!"
            : clickTimeMs < 3000
            ? "Solid competitive reaction speed."
            : "Reflex delay. Work on your visual grip cues."
        }`
      });
    } else {
      throw new Error("Empty text response from Gemini");
    }
  } catch (err) {
    console.error("Gemini intelligence query failed, falling back to local database:", err);
    return res.json({
      scenarioId,
      selectedOptionId,
      ...fallbackData,
      reactionSpeedCommentary: `Reaction time: ${(clickTimeMs / 1000).toFixed(2)}s (Fallback). ${
        clickTimeMs < 1500 ? "Elite tier speed!" : "Standard response speed."
      }`
    });
  }
});

// Setup Vite Dev Server / Static Assets
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite integration...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode with compiled assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
