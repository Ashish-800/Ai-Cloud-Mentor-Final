import { useState } from "react";
import { motion } from "framer-motion";
import { Sliders, Play, Loader2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { SimulationParams, ArchitectureSummary, AnalysisResult } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SimulationPanelProps {
  architectureSummary: ArchitectureSummary;
  onSimulationResult: (result: AnalysisResult) => void;
}

const SimulationPanel = ({ architectureSummary, onSimulationResult }: SimulationPanelProps) => {
  const [params, setParams] = useState<SimulationParams>({
    traffic_multiplier: 1,
    add_regions: 0,
    cost_target: 0,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-architecture", {
        body: { architecture_summary: architectureSummary, simulation: params },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      onSimulationResult(data as AnalysisResult);
      toast.success("Simulation complete");
    } catch (err: any) {
      toast.error(err.message || "Simulation failed");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="glass-panel rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-5 flex items-center gap-2">
        <Sliders className="h-4 w-4 text-primary" />
        Architecture Evolution Simulator
      </h3>

      <div className="space-y-5">
        {/* Traffic Multiplier */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Traffic Multiplier</span>
            <span className="text-xs font-mono font-semibold text-foreground">{params.traffic_multiplier}×</span>
          </div>
          <Slider
            value={[params.traffic_multiplier]}
            onValueChange={([v]) => setParams((p) => ({ ...p, traffic_multiplier: v }))}
            min={1}
            max={20}
            step={1}
          />
        </div>

        {/* Add Regions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Additional Regions</span>
            <span className="text-xs font-mono font-semibold text-foreground">+{params.add_regions}</span>
          </div>
          <Slider
            value={[params.add_regions]}
            onValueChange={([v]) => setParams((p) => ({ ...p, add_regions: v }))}
            min={0}
            max={5}
            step={1}
          />
        </div>

        {/* Cost Target */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground">Monthly Cost Target</span>
            <span className="text-xs font-mono font-semibold text-foreground">
              {params.cost_target === 0 ? "No limit" : `$${params.cost_target}`}
            </span>
          </div>
          <Slider
            value={[params.cost_target]}
            onValueChange={([v]) => setParams((p) => ({ ...p, cost_target: v }))}
            min={0}
            max={5000}
            step={100}
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm transition-all hover:shadow-[0_0_20px_hsl(var(--neon-cyan)/0.3)] hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100"
        >
          {isSimulating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Simulating...
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Run Simulation
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default SimulationPanel;
