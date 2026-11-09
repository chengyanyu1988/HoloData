import React, { useState } from 'react';
import { Boxes, Server, Cpu, HardDrive, CheckCircle2, AlertTriangle, RefreshCw, Sliders, ArrowUpRight } from 'lucide-react';
import { SoftwareComponent } from '../../types';

interface BigDataCoreViewProps {
  components: SoftwareComponent[];
  onOpenActionModal: (component: SoftwareComponent) => void;
}

export const BigDataCoreView: React.FC<BigDataCoreViewProps> = ({
  components,
  onOpenActionModal,
}) => {
  const bigDataComponents = components.filter((c) => c.category === 'bigdata');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>大数据基础组件监控与管理</span>
            <span className="text-xs font-normal text-slate-400">· HDFS / YARN / ZooKeeper / HBase</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控分布式主从架构、Master/Slave 存活状态、JVM 堆内存与 GC 停顿周期
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            基础组件高可用率 (HA): <strong className="text-emerald-400">100.0%</strong>
          </span>
        </div>
      </div>

      {/* Component Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bigDataComponents.map((comp) => (
          <div
            key={comp.id}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
          >
            {/* Component Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">{comp.name}</h3>
                  <span className="font-mono text-xs text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/20">
                    {comp.version}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  架构: {comp.role} · 连续运行: {comp.uptimeHours} 小时
                </div>
              </div>

              <span className="text-xs px-2.5 py-0.5 rounded border font-medium text-emerald-400 bg-emerald-500/10 border-emerald-500/20">
                健康运行中
              </span>
            </div>

            {/* Leader / Master & Node Survival */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">主控节点 (Active Leader):</span>
                <span className="font-mono text-slate-200 font-semibold">{comp.leaderNode}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">集群节点存活率:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {comp.activeNodes} / {comp.totalNodes} Nodes (100% 在线)
                </span>
              </div>
            </div>

            {/* JVM Heap & GC Pause */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">JVM 堆内存占用</span>
                <span className="text-slate-200">
                  {comp.jvmHeapUsedGB.toFixed(1)} GB / {comp.jvmHeapMaxGB} GB (
                  {Math.round((comp.jvmHeapUsedGB / comp.jvmHeapMaxGB) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(comp.jvmHeapUsedGB / comp.jvmHeapMaxGB) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>GC 平均停顿: {comp.gcPauseMs} ms</span>
                <span>当前 QPS: {comp.qps.toLocaleString()} 次/秒</span>
              </div>
            </div>

            {/* Health Metrics Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              {comp.healthMetrics.map((hm, idx) => (
                <div key={idx} className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">{hm.label}</span>
                  <span className="text-slate-200 font-bold">{hm.value}</span>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                探针: JMX Exporter v0.20
              </span>
              <button
                onClick={() => onOpenActionModal(comp)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-600 hover:text-white text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                下发运维控制指令
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
