import { motion } from "framer-motion";
import { Server, Database, Shield, Globe, Cpu, Layers, Radio, GitBranch } from "lucide-react";
import type { ArchitectureSummary } from "@/lib/types";

interface ExtractedArchitectureProps {
  summary: ArchitectureSummary;
}

const ExtractedArchitecture = ({ summary }: ExtractedArchitectureProps) => {
  const items = [
    { icon: Cpu, label: "Compute", value: `${summary.compute_model.toUpperCase()} ×${summary.compute_count}`, active: summary.compute_model !== "none" },
    { icon: Layers, label: "Scaling", value: summary.scaling_type.replace("_", " "), active: summary.scaling_type !== "none" },
    { icon: Database, label: "Database", value: `${summary.database_type.toUpperCase()}${summary.database_multi_az ? " (Multi-AZ)" : ""}`, active: summary.database_type !== "none" },
    { icon: Radio, label: "Caching", value: summary.caching_layer, active: summary.caching_layer !== "none" },
    { icon: Server, label: "Load Balancer", value: summary.load_balancer.toUpperCase(), active: summary.load_balancer !== "none" },
    { icon: Globe, label: "CDN", value: summary.cdn, active: summary.cdn !== "none" },
    { icon: Shield, label: "Security", value: [summary.waf && "WAF", summary.encryption && "Enc", summary.vpc && "VPC", summary.iam_configured && "IAM"].filter(Boolean).join(" · ") || "None", active: summary.waf || summary.encryption || summary.vpc },
    { icon: GitBranch, label: "CI/CD", value: summary.ci_cd ? "Configured" : "None", active: summary.ci_cd },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
        <Layers className="h-4 w-4 text-primary" />
        Extracted Architecture
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className={`rounded-lg border p-3 text-center transition-colors ${
              item.active
                ? "border-primary/30 bg-primary/5"
                : "border-border/50 bg-muted/20 opacity-50"
            }`}
          >
            <item.icon className={`h-4 w-4 mx-auto mb-1.5 ${item.active ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
            <p className={`text-xs font-mono font-medium mt-0.5 ${item.active ? "text-foreground" : "text-muted-foreground"}`}>
              {item.value}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExtractedArchitecture;
