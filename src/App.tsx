import React, { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { motion, AnimatePresence } from "motion/react";
import {
  BrainCircuit,
  RotateCcw,
  Settings,
  CheckCircle,
  Video,
  X,
  Youtube,
  Play
} from "lucide-react";
import { soundEngine } from "./components/SoundEngine";

export default function App() {
  const [stage, setStage] = useState<"welcome" | "video" | "decision" | "completed">("welcome");
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);
  const [selectedChoiceName, setSelectedChoiceName] = useState<string | null>(null);
  const [selectedChoiceDescription, setSelectedChoiceDescription] = useState<string | null>(null);
  
  // YouTube video state - persisted in localStorage so researchers can configure they own videos
  const [youtubeVideoId, setYoutubeVideoId] = useState<string>(() => {
    const saved = localStorage.getItem("badminton_study_youtube_id");
    // Default to a high quality badminton doubles strategy/tactics rally clip
    return saved || "P-A3Jp0Yp_4"; 
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempVideoInput, setTempVideoInput] = useState("");

  useEffect(() => {
    setTempVideoInput(youtubeVideoId);
  }, [youtubeVideoId]);

  const handleSaveSettings = () => {
    let extractedId = tempVideoInput.trim();
    
    // Support pasting full YouTube URLs
    if (extractedId.includes("youtube.com") || extractedId.includes("youtu.be")) {
      try {
        const urlObj = new URL(extractedId);
        if (extractedId.includes("youtu.be")) {
          extractedId = urlObj.pathname.substring(1);
        } else if (urlObj.searchParams.has("v")) {
          extractedId = urlObj.searchParams.get("v") || "";
        } else if (extractedId.includes("/embed/")) {
          const parts = extractedId.split("/embed/");
          if (parts[1]) {
            extractedId = parts[1].split("?")[0];
          }
        }
      } catch (e) {
        console.warn("Invalid URL entered, trying fallback fallback parser", e);
      }
    }
    
    if (extractedId) {
      setYoutubeVideoId(extractedId);
      localStorage.setItem("badminton_study_youtube_id", extractedId);
      setIsSettingsOpen(false);
      soundEngine.playSuccess();
    }
  };

  const handleResetSettings = () => {
    const defaultId = "P-A3Jp0Yp_4";
    setYoutubeVideoId(defaultId);
    setTempVideoInput(defaultId);
    localStorage.removeItem("badminton_study_youtube_id");
    setIsSettingsOpen(false);
    soundEngine.playTrigger();
  };

  const startVideoStage = () => {
    setStage("video");
  };

  const goToDecisionStage = () => {
    setStage("decision");
  };

  const handleSelectChoice = (name: string, description: string) => {
    setSelectedChoiceName(name);
    setSelectedChoiceDescription(description);
    soundEngine.playSuccess();
    setStage("completed");
  };

  const restartStudy = () => {
    setSelectedChoiceName(null);
    setSelectedChoiceDescription(null);
    setHoveredChoice(null);
    setStage("welcome");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      
      {/* Subtle Settings Gear trigger in absolute layout (accessible to researcher on all pages) */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => {
            soundEngine.playTrigger();
            setIsSettingsOpen(true);
          }}
          className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-full cursor-pointer text-slate-400 hover:text-white transition-all shadow-md backdrop-blur-md"
          title="Researcher Settings (Change YouTube Video)"
          id="btn-settings"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {stage === "welcome" && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <WelcomeScreen onStart={startVideoStage} />
          </motion.div>
        )}

        {stage === "video" && (
          <motion.div
            key="video"
            className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Ambient background matching court visual overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="/src/assets/images/Court Background.png"
                alt="Background Court"
                className="w-full h-full object-cover opacity-15 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
            </div>

            {/* Video Player Core Frame - Centered vertically on screen */}
            <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 flex items-center justify-center">
              <div className="w-full aspect-video bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800/80 group">
                <iframe
                  className="w-full h-full pointer-events-auto"
                  src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&mute=0&rel=0&modestbranding=1&autohide=1`}
                  title="Badminton Scenario Playback"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </main>

            {/* Action Bottom Section */}
            <footer className="relative z-10 pb-12 pt-4 px-6 max-w-4xl mx-auto w-full flex flex-col items-center justify-center gap-4">
              <p className="text-slate-400 text-sm sm:text-base font-light tracking-wide select-none text-center max-w-md">
                You may replay the video before making your decision.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={goToDecisionStage}
                id="btn-continue-study"
                className="px-16 py-4 bg-white text-slate-950 hover:bg-slate-100 active:bg-slate-200 text-lg md:text-xl font-normal tracking-wide shadow-2xl transition-all cursor-pointer min-w-[190px] border border-transparent select-none text-center uppercase"
              >
                <span>Continue</span>
              </motion.button>
            </footer>
          </motion.div>
        )}

        {stage === "decision" && (
          <motion.div
            key="decision"
            className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden selection-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Ambient background matching court visual overlay */}
            <div className="absolute inset-0 z-0">
              <img
                src="/src/assets/images/Court Background.png"
                alt="Background Court"
                className="w-full h-full object-cover opacity-15 blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950" />
            </div>

            {/* Content pane containing header text and decision nodes */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 sm:px-16 md:px-24 lg:px-32 max-w-6xl w-full mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-8 text-white font-sans w-full"
              >
                <div className="space-y-4 md:space-y-5">
                  <p className="text-xl sm:text-2xl md:text-[28px] font-medium text-slate-100 leading-normal max-w-4xl select-none">
                    The conflict has just taken place. What would you do?
                  </p>
                  <p className="text-lg sm:text-xl md:text-[22px] font-light text-slate-300 leading-relaxed max-w-4xl">
                    Please choose one of the following responses:
                  </p>
                </div>

                {/* Response Blue/White buttons selection grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2 max-w-4xl">
                  {/* Choice 1: Explain */}
                  <div className="flex flex-col items-center space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectChoice("Explain", "Calmly explain your perspective")}
                      id="btn-choice-explain"
                      className="w-full px-6 py-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-xl transition-all border border-blue-500/30 cursor-pointer text-center flex items-center justify-center min-h-[75px]"
                    >
                      Explain
                    </motion.button>
                    <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed text-center px-2 select-none">
                      “Calmly explain your perspective”
                    </p>
                  </div>

                  {/* Choice 2: Counter-blame */}
                  <div className="flex flex-col items-center space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectChoice("Counter-blame", "Point out her mistakes as well")}
                      id="btn-choice-counter-blame"
                      className="w-full px-6 py-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-xl transition-all border border-blue-500/30 cursor-pointer text-center flex items-center justify-center min-h-[75px]"
                    >
                      Counter-blame
                    </motion.button>
                    <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed text-center px-2 select-none">
                      “Point out her mistakes as well”
                    </p>
                  </div>

                  {/* Choice 3: Stay Silent */}
                  <div className="flex flex-col items-center space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectChoice("Stay Silent", "Say nothing and walk away.")}
                      id="btn-choice-silent"
                      className="w-full px-6 py-5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-medium text-lg rounded-xl shadow-xl transition-all border border-blue-500/30 cursor-pointer text-center flex items-center justify-center min-h-[75px]"
                    >
                      Stay Silent
                    </motion.button>
                    <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed text-center px-2 select-none">
                      “Say nothing and walk away.”
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Footer gap placeholder */}
            <div className="pb-12" />
          </motion.div>
        )}

        {stage === "completed" && (
          <motion.div
            key="completed"
            className="relative w-full h-screen min-h-[600px] bg-slate-950 overflow-hidden flex flex-col justify-between selection-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Upper text content: Perfectly aligned to match the design weight of the user's screenshot and style */}
            <div className="relative z-20 flex-1 flex flex-col justify-start pt-24 md:pt-32 px-10 sm:px-16 md:px-24 lg:px-32 max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="space-y-4 md:space-y-5 text-white font-sans max-w-5xl"
              >
                <p className="text-xl sm:text-2xl md:text-[28px] font-normal text-slate-100 leading-relaxed max-w-4xl select-none">
                  Thank you for your response.
                </p>
                <p className="text-xl sm:text-2xl md:text-[28px] font-light text-slate-300 leading-relaxed max-w-4xl">
                  Please inform the researcher to proceed to the next step.
                </p>
              </motion.div>
            </div>

            {/* Centered Restart Button overlaying the lower third of the layout exactly as on the intro page */}
            <div className="relative z-20 pb-20 md:pb-28 flex items-center justify-center">
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={restartStudy}
                id="btn-restart-experience"
                className="px-16 py-4 bg-white text-slate-950 hover:bg-slate-100 active:bg-slate-200 text-lg md:text-xl font-normal tracking-wide shadow-2xl transition-all cursor-pointer min-w-[190px] border border-transparent select-none text-center"
              >
                Restart
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Researcher YouTube Settings Modal Overlay */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none selection-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-6 text-left"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Modal Top header banner */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Youtube className="w-5 h-5 text-rose-500" />
                  <h3 className="text-white font-bold text-lg">Change Scenario Video</h3>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Instructions and Input fields formulation */}
              <div className="space-y-4 text-sm text-slate-300">
                <p>
                  You can specify any public/unlisted YouTube Video ID or absolute Link below to use as the doubles scenario.
                </p>

                <div className="space-y-2">
                  <label htmlFor="youtube-input" className="text-xs uppercase font-extrabold tracking-wider text-slate-400 block">
                    YouTube Link or Video ID
                  </label>
                  <input
                    id="youtube-input"
                    type="text"
                    value={tempVideoInput}
                    onChange={(e) => setTempVideoInput(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/watch?v=P-A3Jp0Yp_4"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-500 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-850 space-y-1.5">
                  <span className="text-xs uppercase font-bold text-slate-400 block">Current Loaded Preview Parameters</span>
                  <div className="flex items-center gap-2.5 text-xs text-sky-400 font-mono">
                    <Video className="w-4 h-4 text-sky-500" />
                    <span>Video ID: <strong>{youtubeVideoId}</strong></span>
                  </div>
                </div>
              </div>

              {/* Submit triggers */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleResetSettings}
                  className="py-3 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-white text-xs font-bold uppercase rounded-xl border border-slate-800 transition-colors cursor-pointer"
                >
                  Reset Default
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="py-3 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 text-xs font-bold uppercase rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  Save & Apply Video
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
