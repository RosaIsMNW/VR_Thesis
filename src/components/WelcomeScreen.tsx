import React from "react";
import { motion } from "motion/react";
import { soundEngine } from "./SoundEngine";

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const handleStartClick = () => {
    onStart();
  };

  return (
    <div className="relative w-full h-screen min-h-[600px] bg-slate-950 overflow-hidden flex flex-col justify-between selection-none select-none">
      {/* Upper text content: Perfectly aligned to match the design weight of the user's screenshot */}
      <div className="relative z-20 flex-1 flex flex-col justify-start pt-24 md:pt-32 px-10 sm:px-16 md:px-24 lg:px-32 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4 md:space-y-5 text-white font-sans max-w-5xl"
        >
          {/* Welcome Header Statement - same size and weight as subsequent paragraphs */}
          <p className="text-xl sm:text-2xl md:text-[28px] font-light text-slate-100 leading-relaxed max-w-4xl select-none">
            Welcome to this study.
          </p>

          {/* Doubles scenario context block */}
          <p className="text-xl sm:text-2xl md:text-[28px] font-light text-slate-100 leading-relaxed max-w-4xl">
            You will be watching a short video scenario set in a badminton doubles context.
            Please imagine that you are the main character in the video — this is happening to you.
          </p>

          {/* Core instruction text block */}
          <p className="text-xl sm:text-2xl md:text-[28px] font-light text-slate-100 leading-relaxed max-w-4xl">
            Watch carefully, as you will be asked to make a decision afterward.
            Press [Start] when you are ready.
          </p>
        </motion.div>
      </div>

      {/* Centered Start Button overlaying the lower third of the layout exactly as in the screenshot */}
      <div className="relative z-20 pb-20 md:pb-28 flex items-center justify-center">
        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartClick}
          id="btn-start-study"
          className="px-16 py-4 bg-white text-slate-950 hover:bg-slate-100 active:bg-slate-200 text-lg md:text-xl font-normal tracking-wide shadow-2xl transition-all cursor-pointer min-w-[190px] border border-transparent select-none text-center"
        >
          Start
        </motion.button>
      </div>
    </div>
  );
};

