import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";
import { DollarSign, TrendingDown, ArrowDown } from "lucide-react";
import type { CostCategory } from "@/lib/types";

interface CostAnalysisProps {
  costAnalysis: {
    total_current: number;
    total_optimized: number;
    monthly_savings: number;
    breakdown: CostCategory[];
  };
}

const CostAnalysis = ({ costAnalysis }: CostAnalysisProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-primary" />
        Cost Projection Engine
      </h3>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Current</p>
          <AnimatedCounter
            value={costAnalysis.total_current}
            prefix="$"
            className="text-lg font-mono font-bold text-foreground"
          />
          <p className="text-[10px] text-muted-foreground">/month</p>
        </div>
        <div className="text-center space-y-1 flex flex-col items-center justify-center">
          <ArrowDown className="h-4 w-4 text-primary animate-pulse-glow" />
          <AnimatedCounter
            value={costAnalysis.monthly_savings}
            prefix="-$"
            className="text-sm font-mono font-bold text-primary"
          />
          <p className="text-[10px] text-primary">savings</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Optimized</p>
          <AnimatedCounter
            value={costAnalysis.total_optimized}
            prefix="$"
            className="text-lg font-mono font-bold text-score-excellent"
          />
          <p className="text-[10px] text-muted-foreground">/month</p>
        </div>
      </div>

      {/* Breakdown Table */}
      {costAnalysis.breakdown.length > 0 && (
        <div className="border-t border-border/30 pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Cost Breakdown</p>
          <div className="space-y-1.5">
            {costAnalysis.breakdown.map((item, i) => (
              <motion.div
                key={item.category}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.05 }}
                className="flex items-center justify-between text-[11px]"
              >
                <span className="text-muted-foreground">{item.category}</span>
                <div className="flex items-center gap-3 font-mono">
                  <span className="text-muted-foreground">${item.current}</span>
                  <span className="text-primary">→</span>
                  <span className="text-score-excellent">${item.optimized}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CostAnalysis;
