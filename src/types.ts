export interface Point {
  x: number;
  y: number;
}

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface PlayerPositions {
  you: Point;
  partner: Point;
  opponentA: Point;
  opponentB: Point;
}

export interface ShotOption {
  id: string;
  strokeType: "Smash" | "Drop" | "Clear" | "Drive" | "Net";
  targetZoneName: string;
  label: string;
  description: string;
  grade: "S" | "A" | "B" | "C";
  pointsScored: number;
  trajectory: Point[]; // Trajectory points for visualization
}

export interface Scenario {
  id: string;
  title: string;
  tagline: string;
  description: string;
  difficulty: DifficultyLevel;
  duration: number; // Video length in seconds
  decisionTime: number; // Time point in seconds to freeze the visual
  tacticalSetup: {
    players: PlayerPositions;
    shuttleInitial: Point;
    shuttleImpactPoint: Point;
    opponentsStanceDescription: string;
    partnerStanceDescription: string;
  };
  options: ShotOption[];
  educationalTip: string;
}

export interface UserDecision {
  scenarioId: string;
  selectedOptionId: string;
  clickTimeMs: number; // For cognitive speed evaluation
}

export interface AnalysisResponse {
  scenarioId: string;
  selectedOptionId: string;
  success: boolean;
  score: number;
  feedback: string;
  tacticalVerdict: string;
  alternativeSuggestion: string;
  proPlayerStrategy: string;
}
