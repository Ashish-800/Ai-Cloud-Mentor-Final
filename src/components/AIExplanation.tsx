import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

interface AIExplanationProps {
  explanation: string;
  confidenceScore: number;
  maturityLevel: string;
}

const maturityColors: Record<string, string> = {
  "Prototype": "text-score-poor border-score-poor/30 bg-score-poor/10",
  "Early Stage": "text-score-fair border-score-fair/30 bg-score-fair/10",
  "Production Ready": "text-score-good border-score-good/30 bg-score-good/10",
  "Enterprise Grade": "text-score-excellent border-score-excellent/30 bg-score-excellent/10",
};

const AIExplanation = ({ explanation, confidenceScore, maturityLevel }: AIExplanationProps) => {
  const confidencePercent = Math.round(confidenceScore * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="glass-panel rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Brain className="h-4 w-4 text-primary" />
          AI Architecture Mentor
        </h3>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${maturityColors[maturityLevel] || "text-muted-foreground border-border"}`}>
            {maturityLevel}
          </span>
        </div>
      </div>

      {/* Confidence Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Input Confidence</span>
          <span className="text-xs font-mono font-semibold text-foreground">{confidencePercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-primary progress-glow"
          />
        </div>
      </div>

      {/* Transparency Note */}
      <div className="flex items-start gap-2 mb-3 p-2.5 rounded-lg bg-primary/5 border border-primary/10">
        <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
        <p className="text-[10px] text-muted-foreground leading-relaxed">
          <span className="text-primary font-semibold">Scores are deterministic</span> — computed from engineering principles (AWS Well-Architected, CAP Theorem, SRE). AI provides explanation only, not scoring.
        </p>
      </div>

      {/* AI Explanation */}
      {explanation && (
        <div className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
          {explanation}
        </div>
      )}
    </motion.div>
  );
};

export default AIExplanation;
