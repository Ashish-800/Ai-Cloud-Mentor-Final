import { motion } from "framer-motion";
import { Map, ChevronRight } from "lucide-react";
import type { ImprovementPhase } from "@/lib/types";

interface ImprovementRoadmapProps {
  phases: ImprovementPhase[];
}

const ImprovementRoadmap = ({ phases }: ImprovementRoadmapProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.65 }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Map className="h-4 w-4 text-primary" />
        Improvement Roadmap
      </h3>
      <div className="space-y-3">
        {phases.map((phase, i) => (
          <motion.div
            key={phase.phase}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 + i * 0.08 }}
            className="rounded-lg border border-border/50 bg-muted/10 p-3"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                  Phase {phase.phase}
                </span>
                <span className="text-xs font-semibold text-foreground">{phase.title}</span>
              </div>
              <span className="text-[10px] font-mono text-score-excellent">{phase.impact}</span>
            </div>
            <ul className="space-y-1">
              {phase.actions.map((action, j) => (
                <li key={j} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
                  <ChevronRight className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                  {action}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ImprovementRoadmap;
