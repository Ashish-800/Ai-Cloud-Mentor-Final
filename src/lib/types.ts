export interface ArchitectureSummary {
  compute_model: string;
  compute_count: number;
  scaling_type: string;
  database_type: string;
  database_multi_az: boolean;
  database_replicas: number;
  caching_layer: string;
  load_balancer: string;
  cdn: string;
  vpc: boolean;
  private_subnets: boolean;
  waf: boolean;
  encryption: boolean;
  ssl_tls: boolean;
  iam_configured: boolean;
  security_groups: boolean;
  monitoring: string;
  ci_cd: boolean;
  container_orchestration: string;
  serverless_components: number;
  multi_region: boolean;
  backup_strategy: boolean;
  spot_instances: boolean;
  reserved_instances: boolean;
  api_gateway: boolean;
  microservices: boolean;
  estimated_users: number;
}

export interface CategoryScore {
  score: number;
  max: number;
  explanation: string[];
  violated_principles: string[];
}

export interface Risk {
  type: string;
  component: string;
  impact: string;
  severity: "critical" | "high" | "medium" | "low";
}

export interface CostCategory {
  category: string;
  current: number;
  optimized: number;
}

export interface ImprovementPhase {
  phase: number;
  title: string;
  actions: string[];
  impact: string;
}

export interface AnalysisResult {
  architecture_summary: ArchitectureSummary;
  scores: {
    overall: number;
    scalability: CategoryScore;
    reliability: CategoryScore;
    security: CategoryScore;
    cost_efficiency: CategoryScore;
  };
  risk_analysis: {
    risk_level: "Critical" | "High" | "Medium" | "Low";
    risks: Risk[];
  };
  cost_analysis: {
    total_current: number;
    total_optimized: number;
    monthly_savings: number;
    breakdown: CostCategory[];
  };
  improvement_plan: ImprovementPhase[];
  ai_explanation: string;
  confidence_score: number;
  maturity_level: "Prototype" | "Early Stage" | "Production Ready" | "Enterprise Grade";
  timestamp: string;
}

export interface SimulationParams {
  traffic_multiplier: number;
  add_regions: number;
  cost_target: number;
}
