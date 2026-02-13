import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from "lucide-react";
import type { Risk } from "@/lib/types";

interface RiskPanelProps {
  riskLevel: string;
  risks: Risk[];
}

const severityConfig = {
  critical: { color: "text-score-poor", bg: "bg-score-poor/10", border: "border-score-poor/30", icon: ShieldAlert },
  high: { color: "text-score-fair", bg: "bg-score-fair/10", border: "border-score-fair/30", icon: AlertTriangle },
  medium: { color: "text-neon-cyan", bg: "bg-primary/10", border: "border-primary/30", icon: AlertCircle },
  low: { color: "text-muted-foreground", bg: "bg-muted/30", border: "border-border", icon: Info },
};

const riskLevelColors: Record<string, string> = {
  Critical: "text-score-poor",
  High: "text-score-fair",
  Medium: "text-neon-cyan",
  Low: "text-score-excellent",
};

const RiskPanel = ({ riskLevel, risks }: RiskPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-panel rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-score-fair" />
          Risk Analysis
        </h3>
        <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${riskLevelColors[riskLevel] || "text-muted-foreground"} border-current/20 bg-current/5`}>
          {riskLevel} Risk
        </span>
      </div>

      <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
        {risks.map((risk, i) => {
          const config = severityConfig[risk.severity];
          const Icon = config.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className={`rounded-lg border ${config.border} ${config.bg} p-3`}
            >
              <div className="flex items-start gap-2.5">
                <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${config.color}`} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold ${config.color}`}>{risk.type}</span>
                    <span className="text-[10px] font-mono text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{risk.severity}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono">{risk.component}</p>
                  <p className="text-xs text-muted-foreground mt-1">{risk.impact}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RiskPanel;
