import React from "react";
import { Scenario, Point } from "../types";
import { soundEngine } from "./SoundEngine";

interface CourtVisualizerProps {
  scenario: Scenario;
  currentTime: number;
  selectedOptionId: string | null;
  showResultTrajectory: boolean;
  highlightedZone: string | null;
  onSelectZone?: (optionId: string) => void;
}

export const CourtVisualizer: React.FC<CourtVisualizerProps> = ({
  scenario,
  currentTime,
  selectedOptionId,
  showResultTrajectory,
  highlightedZone,
  onSelectZone,
}) => {
  const { players, shuttleInitial, shuttleImpactPoint } = scenario.tacticalSetup;
  const decisionTime = scenario.decisionTime;

  // Calculate shuttlecock position during the rally path
  const isFrozen = currentTime >= decisionTime;
  const ratio = Math.min(1, currentTime / decisionTime);

  // Parabolic projection for flight height (Z axis)
  const zHeight = Math.sin(ratio * Math.PI) * 45; // Height arc

  const shuttleX = shuttleInitial.x + (shuttleImpactPoint.x - shuttleInitial.x) * ratio;
  const shuttleY = shuttleInitial.y + (shuttleImpactPoint.y - shuttleInitial.y) * ratio;

  // Find selected option to draw trajectory
  const selectedOption = scenario.options.find((opt) => opt.id === (selectedOptionId || highlightedZone));

  // Visual Coordinates multiplier
  // Court size is 100 x 100 on grid, let's map it into an SVG viewBox 0 0 400 680
  const scaleX = (x: number) => 30 + x * 3.4; // 30px offset, 3.4px scale for grid to SVG padding
  const scaleY = (y: number) => 40 + y * 6.0; // 40px offset, 6.0px scale

  return (
    <div className="relative w-full aspect-[400/680] max-w-[420px] mx-auto bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl shadow-blue-950/20 overflow-hidden select-none">
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-950/10 via-slate-950/5 to-slate-950 pointer-events-none" />

      {/* SVG Container */}
      <svg
        viewBox="0 0 400 680"
        className="w-full h-full"
        id="badminton-svg-court"
        role="img"
        aria-label="Interactive Tactical Court Visualizer"
      >
        {/* Court Boundary Lines (Standard Doubles dimensions mapped inside) */}
        {/* Outer Court Border */}
        <rect
          x={scaleX(10)}
          y={scaleY(5)}
          width={scaleX(90) - scaleX(10)}
          height={scaleY(95) - scaleY(5)}
          fill="rgba(15, 23, 42, 0.4)"
          stroke="#38bdf8"
          strokeWidth="3.5"
          strokeLinejoin="miter"
        />

        {/* Singles Boundary lines (Inner alleys) */}
        <line
          x1={scaleX(16)}
          y1={scaleY(5)}
          x2={scaleX(16)}
          y2={scaleY(95)}
          stroke="#0284c7"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />
        <line
          x1={scaleX(84)}
          y1={scaleY(5)}
          x2={scaleX(84)}
          y2={scaleY(95)}
          stroke="#0284c7"
          strokeWidth="1.5"
          strokeDasharray="4 2"
        />

        {/* Short Service Lines (Left / Right) */}
        <line
          x1={scaleX(10)}
          y1={scaleY(35)}
          x2={scaleX(90)}
          y2={scaleY(35)}
          stroke="#7dd3fc"
          strokeWidth="2"
        />
        <line
          x1={scaleX(10)}
          y1={scaleY(65)}
          x2={scaleX(90)}
          y2={scaleY(65)}
          stroke="#7dd3fc"
          strokeWidth="2"
        />

        {/* Long Service Lines for Doubles (Inner baseline backcourts) */}
        <line
          x1={scaleX(10)}
          y1={scaleY(15)}
          x2={scaleX(90)}
          y2={scaleY(15)}
          stroke="#0284c7"
          strokeWidth="1.5"
        />
        <line
          x1={scaleX(10)}
          y1={scaleY(85)}
          x2={scaleX(90)}
          y2={scaleY(85)}
          stroke="#0284c7"
          strokeWidth="1.5"
        />

        {/* Court Center Lines (Front & Back Service Courts) */}
        <line
          x1={scaleX(50)}
          y1={scaleY(5)}
          x2={scaleX(50)}
          y2={scaleY(35)}
          stroke="#7dd3fc"
          strokeWidth="2"
        />
        <line
          x1={scaleX(50)}
          y1={scaleY(65)}
          x2={scaleX(50)}
          y2={scaleY(95)}
          stroke="#7dd3fc"
          strokeWidth="2"
        />

        {/* Interactive Target Zones Overlays (When frozen, player can tap zones dynamically) */}
        {isFrozen &&
          onSelectZone &&
          scenario.options.map((opt) => {
            const targetPoint = opt.trajectory[opt.trajectory.length - 1];
            const isSelected = selectedOptionId === opt.id;
            const isHovered = highlightedZone === opt.id;

            return (
              <g
                key={opt.id}
                className="cursor-pointer group"
                onClick={() => {
                  soundEngine.playTrigger();
                  onSelectZone(opt.id);
                }}
              >
                {/* Visual Target Area Radar Ripple */}
                <circle
                  cx={scaleX(targetPoint.x)}
                  cy={scaleY(targetPoint.y)}
                  r={isSelected ? 28 : isHovered ? 24 : 16}
                  fill={isSelected ? "rgba(14, 165, 233, 0.25)" : "rgba(56, 189, 248, 0.08)"}
                  stroke={isSelected ? "#0ea5e9" : isHovered ? "#38bdf8" : "rgba(56, 189, 248, 0.4)"}
                  strokeWidth={isSelected ? "3.5" : "1.5"}
                  className="transition-all duration-300 animate-pulse"
                />
                
                {/* Center Core dot */}
                <circle
                  cx={scaleX(targetPoint.x)}
                  cy={scaleY(targetPoint.y)}
                  r="6"
                  fill={isSelected ? "#0ea5e9" : isHovered ? "#38bdf8" : "rgba(56, 189, 248, 0.8)"}
                  className="transition-transform duration-300 group-hover:scale-150"
                />

                {/* Grade Marker text in the visual center of target zone (Only after selection to keep screen neat) */}
                <text
                  x={scaleX(targetPoint.x)}
                  y={scaleY(targetPoint.y) + 4}
                  textAnchor="middle"
                  className={`text-[8px] font-bold fill-sky-200 pointer-events-none select-none transition-opacity duration-300 ${
                    isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {opt.strokeType}
                </text>
              </g>
            );
          })}

        {/* The Shuttlecock Trajectory Line (Flight Path before decision freeze) */}
        <polyline
          points={`${scaleX(shuttleInitial.x)},${scaleY(shuttleInitial.y)} ${scaleX(shuttleX)},${scaleY(shuttleY)}`}
          stroke="rgba(244, 63, 94, 0.45)"
          strokeWidth="2.5"
          fill="none"
          strokeDasharray="4 4"
        />

        {/* Selected or Hovered Target Trajectory Path */}
        {selectedOption && (isFrozen || showResultTrajectory) && (
          <g>
            {/* Smooth trajectory line pointing towards landing zone */}
            <path
              d={`M ${scaleX(shuttleImpactPoint.x)} ${scaleY(shuttleImpactPoint.y)} Q ${
                (scaleX(shuttleImpactPoint.x) + scaleX(selectedOption.trajectory[selectedOption.trajectory.length - 1].x)) / 2
              } ${
                (scaleY(shuttleImpactPoint.y) + scaleY(selectedOption.trajectory[selectedOption.trajectory.length - 1].y)) / 2 - 60
              } ${scaleX(selectedOption.trajectory[selectedOption.trajectory.length - 1].x)} ${scaleY(
                selectedOption.trajectory[selectedOption.trajectory.length - 1].y
              )}`}
              fill="none"
              stroke={selectedOptionId === selectedOption.id ? "#0ea5e9" : "rgba(56, 189, 248, 0.55)"}
              strokeWidth="3"
              strokeDasharray={showResultTrajectory ? "0" : "5 5"}
              strokeLinecap="round"
              className={showResultTrajectory ? "animate-[dash_2s_linear_infinite]" : ""}
            />
            {/* Trajectory Landing Splash */}
            <circle
              cx={scaleX(selectedOption.trajectory[selectedOption.trajectory.length - 1].x)}
              cy={scaleY(selectedOption.trajectory[selectedOption.trajectory.length - 1].y)}
              r="18"
              fill="none"
              stroke={selectedOptionId === selectedOption.id ? "#0ea5e9" : "#38bdf8"}
              strokeWidth="1.5"
              className="animate-ping"
            />
          </g>
        )}

        {/* Dynamic Net and Posts */}
        <g id="court-net-system">
          {/* Left Net Post */}
          <line
            x1={scaleX(8)}
            y1={scaleY(50)}
            x2={scaleX(10)}
            y2={scaleY(50)}
            stroke="#f8fafc"
            strokeWidth="4.5"
          />
          {/* Right Net Post */}
          <line
            x1={scaleX(90)}
            y1={scaleY(50)}
            x2={scaleX(92)}
            y2={scaleY(50)}
            stroke="#f8fafc"
            strokeWidth="4.5"
          />
          {/* Center Net Mesh line */}
          <line
            x1={scaleX(10)}
            y1={scaleY(50)}
            x2={scaleX(90)}
            y2={scaleY(50)}
            stroke="#facc15"
            strokeWidth="3.5"
            opacity="0.95"
          />
          {/* Net grid representation underlay */}
          <rect
            x={scaleX(10)}
            y={scaleY(50) - 1.5}
            width={scaleX(90) - scaleX(10)}
            height="3.5"
            fill="repeating-linear-gradient(90deg, transparent, transparent 4px, rgba(255, 255, 255, 0.45) 4px, rgba(255, 255, 255, 0.45) 6px)"
          />
        </g>

        {/* Players (Drawn as athletic tactical tags with orientation indicators) */}
        {/* Opponent A */}
        <g className="transition-all duration-300">
          <circle
            cx={scaleX(players.opponentA.x)}
            cy={scaleY(players.opponentA.y)}
            r="12"
            fill="#ef4444"
            className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          />
          <text
            x={scaleX(players.opponentA.x)}
            y={scaleY(players.opponentA.y) + 3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#ffffff"
          >
            A
          </text>
          <text
            x={scaleX(players.opponentA.x)}
            y={scaleY(players.opponentA.y) - 16}
            textAnchor="middle"
            fontSize="8"
            fill="#fecaca"
            fontWeight="bold"
          >
            Opponent A
          </text>
        </g>

        {/* Opponent B */}
        <g className="transition-all duration-300">
          <circle
            cx={scaleX(players.opponentB.x)}
            cy={scaleY(players.opponentB.y)}
            r="12"
            fill="#ef4444"
            className="filter drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
          />
          <text
            x={scaleX(players.opponentB.x)}
            y={scaleY(players.opponentB.y) + 3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#ffffff"
          >
            B
          </text>
          <text
            x={scaleX(players.opponentB.x)}
            y={scaleY(players.opponentB.y) - 16}
            textAnchor="middle"
            fontSize="8"
            fill="#fecaca"
            fontWeight="bold"
          >
            Opponent B
          </text>
        </g>

        {/* Partner */}
        <g className="transition-all duration-300">
          <circle
            cx={scaleX(players.partner.x)}
            cy={scaleY(players.partner.y)}
            r="12"
            fill="#10b981"
            className="filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
          />
          <text
            x={scaleX(players.partner.x)}
            y={scaleY(players.partner.y) + 3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#ffffff"
          >
            P
          </text>
          <text
            x={scaleX(players.partner.x)}
            y={scaleY(players.partner.y) + 22}
            textAnchor="middle"
            fontSize="8"
            fill="#d1fae5"
            fontWeight="bold"
          >
            Partner
          </text>
        </g>

        {/* Active Player (You) */}
        <g className="transition-all duration-300">
          {/* Reaction radius circle indicator if frozen */}
          {isFrozen && !selectedOptionId && (
            <circle
              cx={scaleX(players.you.x)}
              cy={scaleY(players.you.y)}
              r="34"
              fill="rgba(56, 189, 248, 0.05)"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              className="animate-[spin_40s_linear_infinite]"
            />
          )}

          <circle
            cx={scaleX(players.you.x)}
            cy={scaleY(players.you.y)}
            r={isFrozen ? 14 : 12}
            fill="#0284c7"
            stroke="#e0f2fe"
            strokeWidth={isFrozen ? "2.5" : "0"}
            className="filter drop-shadow-[0_0_12px_rgba(14,165,233,0.75)] animate-pulse"
          />
          <text
            x={scaleX(players.you.x)}
            y={scaleY(players.you.y) + 3}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#ffffff"
          >
            YOU
          </text>
          <text
            x={scaleX(players.you.x)}
            y={scaleY(players.you.y) + 24}
            textAnchor="middle"
            fontSize="9"
            fill="#e0f2fe"
            fontWeight="bold"
          >
            Decision Maker
          </text>
        </g>

        {/* Shuttlecock Visual representation */}
        {!showResultTrajectory && (
          <g>
            {/* Shuttlecock shadow projection underlay */}
            <ellipse
              cx={scaleX(shuttleX)}
              cy={scaleY(shuttleY) + zHeight * 0.3}
              rx={4 + zHeight * 0.08}
              ry={2 + zHeight * 0.04}
              fill="rgba(0,0,0,0.55)"
              className="transition-all duration-75"
            />

            {/* Glowing impact shockwave circle if exact decision time reached */}
            {isFrozen && (
              <circle
                cx={scaleX(shuttleX)}
                cy={scaleY(shuttleY) - zHeight}
                r="18"
                fill="none"
                stroke="#fda4af"
                strokeWidth="2.5"
                className="animate-ping"
              />
            )}

            {/* Shuttlecock Body representation */}
            <g transform={`translate(${scaleX(shuttleX)}, ${scaleY(shuttleY) - zHeight})`}>
              {/* Feathers cap (Skirts) */}
              <path
                d="M -5 -6 L 0 -18 L 5 -6 Z"
                fill="#ffffff"
                stroke="#64748b"
                strokeWidth="1"
              />
              {/* Cork base */}
              <circle cx="0" cy="-4" r="5" fill="#e11d48" />
              <circle cx="0" cy="-4" r="3" fill="#ffffff" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
