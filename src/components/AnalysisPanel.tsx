import React from "react";
import { motion } from "motion/react";
import { Award, Zap, ChevronRight, Activity, BookOpen, UserCheck, AlertTriangle } from "lucide-react";
import { ShotOption } from "../types";
import { soundEngine } from "./SoundEngine";

interface AnalysisPanelProps {
  scenarioTitle: string;
  selectedOption: ShotOption;
  reactionTimeMs: number;
  analysis: {
    success: boolean;
    score: number;
    feedback: string;
    tacticalVerdict: string;
    alternativeSuggestion: string;
    proPlayerStrategy: string;
    reactionSpeedCommentary?: string;
  } | null;
  isLoading: boolean;
  onNext: () => void;
  isLastScenario: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  scenarioTitle,
  selectedOption,
  reactionTimeMs,
  analysis,
  isLoading,
  onNext,
  isLastScenario,
}) => {
  React.useEffect(() => {
    if (analysis && !isLoading) {
      if (selectedOption.grade === "S" || selectedOption.grade === "A") {
        soundEngine.playSuccess();
      }
    }
  }, [analysis, isLoading, selectedOption.grade]);

  const getGradeColorClass = (grade: "S" | "A" | "B" | "C") => {
    switch (grade) {
      case "S":
        return {
          bg: "bg-amber-500/10 border-amber-500/40 text-amber-400",
          text: "text-amber-400",
          glow: "drop-shadow-[0_0_20px_rgba(245,158,11,0.55)]",
          border: "border-amber-500/30",
        };
      case "A":
        return {
          bg: "bg-sky-500/10 border-sky-500/40 text-sky-400",
          text: "text-sky-400",
          glow: "drop-shadow-[0_0_20px_rgba(14,165,233,0.55)]",
          border: "border-sky-500/30",
        };
      case "B":
        return {
          bg: "bg-emerald-500/10 border-emerald-500/40 text-emerald-400",
          text: "text-emerald-400",
          glow: "drop-shadow-[0_0_20px_rgba(16,185,129,0.55)]",
          border: "border-emerald-500/30",
        };
      case "C":
        return {
          bg: "bg-rose-500/10 border-rose-500/40 text-rose-400",
          text: "text-rose-400",
          glow: "drop-shadow-[0_0_20px_rgba(244,63,94,0.55)]",
          border: "border-rose-500/30",
        };
    }
  };

  const style = getGradeColorClass(selectedOption.grade);

  return (
    <div className="w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6 overflow-hidden">
      {/* Loading Overlay */}
      {isLoading ? (
        <div className="py-16 flex flex-col items-center justify-center space-y-5" id="coaching-loading-screen">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-t-sky-500 border-r-sky-500/30 border-b-sky-500/30 border-l-sky-500/30 animate-spin" />
            <Activity className="w-6 h-6 text-sky-400 animate-pulse" />
          </div>
          <div className="text-center space-y-1">
            <h4 className="text-white text-lg font-medium animate-pulse">Running Cognitive Trial AI Evaluation...</h4>
            <p className="text-slate-400 text-sm max-w-xs">Comparing your decision against biomechanical modeling and pro-level court coverage charts.</p>
          </div>
        </div>
      ) : analysis ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Main Scoring Header */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pb-5 border-b border-slate-800">
            {/* Massive Badge Grade */}
            <div className={`relative w-28 h-28 flex items-center justify-center rounded-full border-2 ${style.bg} ${style.glow}`}>
              <div className="absolute inset-2.5 rounded-full border border-current opacity-40 animate-pulse" />
              <div className="text-center leading-none">
                <span className="text-5xl font-extrabold tracking-tighter block">{selectedOption.grade}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest block mt-0.5">Grade</span>
              </div>
            </div>

            {/* Quick Metrics stats dashboard */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <span className={`text-xs uppercase font-extrabold tracking-widest ${style.text}`}>
                {analysis.tacticalVerdict || "Decision Registered"}
              </span>
              <h3 className="text-white text-xl md:text-2xl font-semibold leading-tight">
                {selectedOption.label}
              </h3>
              
              {/* Score & speed badges pills */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1.5">
                <div className="bg-slate-950 px-3 py-1 rounded-md border border-slate-800 flex items-center gap-1.5 text-xs text-sky-300">
                  <Award className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tactical Score: <strong className="text-white font-bold">{analysis.score || selectedOption.pointsScored} pts</strong></span>
                </div>
                <div className="bg-slate-950 px-3 py-1 rounded-md border border-slate-800 flex items-center gap-1.5 text-xs text-rose-300">
                  <Zap className="w-3.5 h-3.5 text-rose-400" />
                  <span>Reflex Delay: <strong className="text-white font-bold">{(reactionTimeMs / 1000).toFixed(2)}s</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Comments Bento Modules grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Section 1: Detailed Sports-Science review */}
            <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-sky-400">
                <BookOpen className="w-4 h-4" />
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Sport-Science Critique</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {analysis.feedback}
              </p>
            </div>

            {/* Section 2: Pro Strategy integration */}
            <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-400">
                <UserCheck className="w-4 h-4" />
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Pro-Level Playbook Analogy</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {analysis.proPlayerStrategy}
              </p>
            </div>

            {/* Section 3: Reaction Velocity evaluation panel */}
            <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-rose-400">
                <Zap className="w-4 h-4" />
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Cognitive Reflex Assessment</h4>
              </div>
              <p className="text-slate-300 text-sm">
                {analysis.reactionSpeedCommentary || `Your reaction of ${(reactionTimeMs / 1000).toFixed(2)}s indicates standard athletic anticipatory triggers. High-tier doubles requires making contact under 1.5 seconds from serve release.`}
              </p>
            </div>

            {/* Section 4: Alternative Options critique */}
            <div className="bg-slate-950/40 p-5 rounded-xl border border-slate-800 space-y-2 col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 text-amber-400">
                <AlertTriangle className="w-4 h-4" />
                <h4 className="text-xs uppercase font-bold tracking-wider text-slate-300">Coaching Alternative Recommendation</h4>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {analysis.alternativeSuggestion}
              </p>
            </div>
          </div>

          {/* Action Trigger button footer */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                soundEngine.playTrigger();
                onNext();
              }}
              id="btn-next-trial"
              className="flex items-center gap-1.5 px-6 py-3 bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-slate-950 font-semibold rounded-lg shadow-lg shadow-sky-500/10 cursor-pointer text-sm font-sans tracking-wide transition-colors"
            >
              <span>{isLastScenario ? "Complete Trial Study" : "Run Next Scenario"}</span>
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="py-8 text-center text-slate-500">
          Make a tactical choice on the court to trigger custom coaching feedback.
        </div>
      )}
    </div>
  );
};
