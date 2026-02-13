import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle } from "lucide-react";
import type { CategoryScore } from "@/lib/types";

interface ScoreBreakdownProps {
  scores: {
    overall: number;
    scalability: CategoryScore;
    reliability: CategoryScore;
    security: CategoryScore;
    cost_efficiency: CategoryScore;
  };
}

const categories = [
  { key: "scalability" as const, label: "Scalability", icon: "📈", weight: "30%" },
  { key: "reliability" as const, label: "Reliability", icon: "🛡️", weight: "25%" },
  { key: "security" as const, label: "Security", icon: "🔐", weight: "25%" },
  { key: "cost_efficiency" as const, label: "Cost Efficiency", icon: "💰", weight: "20%" },
];

const getBarColor = (score: number) => {
  if (score >= 75) return "bg-score-excellent";
  if (score >= 50) return "bg-score-good";
  if (score >= 30) return "bg-score-fair";
  return "bg-score-poor";
};

const getTextColor = (score: number) => {
  if (score >= 75) return "text-score-excellent";
  if (score >= 50) return "text-score-good";
  if (score >= 30) return "text-score-fair";
  return "text-score-poor";
};

const ScoreBreakdown = ({ scores }: ScoreBreakdownProps) => {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">Explainable Score Breakdown</h3>
      <div className="space-y-3">
        {categories.map((cat, i) => {
          const data = scores[cat.key];
          const isOpen = expanded === cat.key;
          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.08 }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : cat.key)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span>{cat.icon}</span> {cat.label}
                    <span className="text-[10px] text-muted-foreground/50">({cat.weight})</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-mono font-bold ${getTextColor(data.score)}`}>
                      {data.score}/{data.max}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(data.score / data.max) * 100}%` }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.8, ease: "easeOut" }}
                    className={`h-full rounded-full ${getBarColor(data.score)} progress-glow`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2.5 ml-1 space-y-2">
                      {/* Explanations */}
                      <div className="space-y-1">
                        {data.explanation.map((exp, j) => (
                          <p key={j} className="text-[11px] font-mono text-muted-foreground flex items-start gap-1.5">
                            <span className={exp.includes("+") ? "text-score-excellent" : "text-score-fair"}>→</span>
                            {exp}
                          </p>
                        ))}
                      </div>

                      {/* Violated Principles */}
                      {data.violated_principles.length > 0 && (
                        <div className="mt-2 p-2 rounded-lg bg-score-poor/5 border border-score-poor/20">
                          <p className="text-[10px] uppercase tracking-wider text-score-poor font-semibold mb-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Violated Principles
                          </p>
                          {data.violated_principles.map((vp, j) => (
                            <p key={j} className="text-[11px] text-score-poor/80 font-mono">• {vp}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ScoreBreakdown;
