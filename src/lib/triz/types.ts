export type ProjectStatus =
  | "draft"
  | "diagnosed"
  | "contradiction_confirmed"
  | "principles_recommended"
  | "principle_selected"
  | "ifr_generated"
  | "action_plan_created"
  | "validated"
  | "exported";

export type ProjectType = "image" | "series" | "video" | "installation" | "branding" | "other";

export type CreativeParameter =
  | "atmosphere"
  | "detail"
  | "iteration_speed"
  | "readability"
  | "uniqueness"
  | "ai_control"
  | "series_unity"
  | "emotional_power"
  | "technical_stability"
  | "conceptual_depth";

export type ProblemType =
  | "technical_contradiction"
  | "physical_contradiction"
  | "weak_ifr"
  | "weak_system"
  | "missing_field"
  | "selection_chaos";

export interface DiagnosisResult {
  diagnosedProblem: string;
  problemType: ProblemType;
  probableImprovingParameters: CreativeParameter[];
  probableWorseningParameters: CreativeParameter[];
  reasoningSummary: string;
  userClarifyingQuestion?: string;
}

export interface ContradictionResult {
  shortName: string;
  formula: string;
  improvingParameter: CreativeParameter;
  worseningParameter: CreativeParameter;
  technicalContradiction: string;
  physicalContradiction?: string;
}

export interface Principle {
  id: number;
  title: string;
  shortDefinition: string;
  whenToUse: string[];
  digitalArtApplication: string;
  aiWorkflowApplication: string;
  miniExercise: string;
}

export interface PrincipleRecommendation {
  principleId: number;
  title: string;
  reason: string;
  projectApplication: string;
  miniAction: string;
}

export interface IFRResult {
  primary: string;
  alternatives: string[];
  internalResources: string[];
  removedDependency: string;
}

export interface Resource {
  id: string;
  label: string;
  type: "visual" | "temporal" | "spatial" | "semantic" | "technical" | "negative" | "audience" | "data";
  selected: boolean;
}

export interface ActionStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ActionPlan {
  summary: string;
  steps: ActionStep[];
  promptDirection?: string;
  testCriteria: string[];
  antiActions: string[];
}

export interface ValidationResult {
  score: number;
  contradictionResolved: boolean;
  compromiseDetected: boolean;
  strengths: string[];
  weaknesses: string[];
  nextMove: string;
}

export interface ProjectMap {
  title: string;
  rawProblem: string;
  diagnosis: string;
  contradiction: string;
  selectedPrinciple: string;
  ifr: string;
  actionPlan: string[];
  validationSummary: string;
  createdAt: string;
}

export interface ProjectSession {
  id: string;
  title: string;
  status: ProjectStatus;
  projectType?: ProjectType;
  rawProblem: string;
  diagnosis?: DiagnosisResult;
  diagnosedProblem?: string;
  problemType?: ProblemType;
  improvingParameter?: CreativeParameter;
  worseningParameter?: CreativeParameter;
  contradiction?: ContradictionResult;
  contradictionFormula?: string;
  recommendedPrinciples?: PrincipleRecommendation[];
  selectedPrincipleId?: number;
  selectedPrinciple?: PrincipleRecommendation;
  ifr?: IFRResult;
  resources?: Resource[];
  actionPlan?: ActionPlan;
  validation?: ValidationResult;
  exportMap?: ProjectMap;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectEvent {
  id: string;
  projectId: string;
  eventType:
    | "project_created"
    | "diagnosis_generated"
    | "contradiction_confirmed"
    | "principles_recommended"
    | "principle_selected"
    | "ifr_generated"
    | "action_plan_created"
    | "solution_validated"
    | "project_exported";
  payload: unknown;
  createdAt: string;
}

export type ValidationChecklist = {
  usesExistingResource: boolean;
  improvesTarget: boolean;
  protectsWorseningParameter: boolean;
  repeatable: boolean;
  avoidsChaoticIteration: boolean;
  createsNewProblem: boolean;
};
