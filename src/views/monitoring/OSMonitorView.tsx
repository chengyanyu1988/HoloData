import React, { useState, useEffect } from 'react';
import { OperatingSystemMetric } from '../../types';
import { 
  Server, Activity, ShieldCheck, BarChart3
} from 'lucide-react';
import { OSMonitorStatsView } from './OSMonitorStatsView';
import { PrototypeOSSystemMonitorView } from './PrototypeOSSystemMonitorView';

interface Props {
  osMetrics: OperatingSystemMetric[];
  initialSubTab?: 'system' | 'stats';
  onOpenTerminal: (name: string, ip: string) => void;
  onRefresh: () => void;
}

export const OSMonitorView: React.FC<Props> = ({
  osMetrics,
  initialSubTab = 'system',
  onOpenTerminal,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'system' | 'stats'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const totalHosts = osMetrics.length;
  const avgLoad1m = (osMetrics.reduce((acc, m) => acc + m.loadAvg1m, 0) / (totalHosts || 1)).toFixed(2);

  return (
    <div className="space-y-5">
      {/* Top Banner with Sub-Navigation */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Server className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  操作系统监控
                  <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono">
                    OS TELEMETRY
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  集中监控 openEuler 24.03、银河麒麟 V10、Ubuntu DGX 等主机操作系统内核指标、进程与统计分析
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">操作系统在线:</span>
              <span className="text-emerald-400 font-bold">{totalHosts} 台 (100%)</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">平均负载:</span>
              <span className="text-cyan-300 font-bold">{avgLoad1m}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">微内核探针:</span>
              <span className="text-purple-300 font-bold">eBPF 零侵入</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Content: Stats View */}
      {activeSubTab === 'stats' && (
        <OSMonitorStatsView osMetrics={osMetrics} onRefresh={onRefresh} />
      )}

      {/* Subtab Content: System View */}
      {activeSubTab === 'system' && (
        <PrototypeOSSystemMonitorView
          osMetrics={osMetrics}
          onOpenTerminal={onOpenTerminal}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
