import React from 'react';
import { Activity, RefreshCw, Server, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { TelemetryAgent } from '../../types';

interface AgentManagerViewProps {
  agents: TelemetryAgent[];
}

export const AgentManagerView: React.FC<AgentManagerViewProps> = ({ agents }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>全息监控探针与采集代理管控</span>
            <span className="text-xs font-normal text-slate-400">· eBPF / Node-Exporter / Hologram-Probe</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            管控集群 256 台物理节点部署的微内核轻量探针、日志采集 DaemonSet 及心跳同频状态
          </p>
        </div>

        <button
          onClick={() => alert('已触发全网探针心跳探活广播')}
          className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          广播心跳探活
        </button>
      </div>

      {/* Agents Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">探针编号</th>
                <th className="py-3 px-4">部署主机名 / 节点 IP</th>
                <th className="py-3 px-4">采集器类型</th>
                <th className="py-3 px-4">探针版本</th>
                <th className="py-3 px-4">遥测周期</th>
                <th className="py-3 px-4">CPU 资源消耗</th>
                <th className="py-3 px-4">内存驻留 (RSS)</th>
                <th className="py-3 px-4">最近心跳时间</th>
                <th className="py-3 px-4 text-right">探针状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                    {agent.id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{agent.hostname}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{agent.ip}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                      {agent.agentType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{agent.version}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    {agent.syncIntervalSec} 秒 / 次
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400 font-bold tabular-nums">
                    {agent.cpuUsage}% (极低侵入)
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 tabular-nums">
                    {agent.memMB} MB
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {agent.lastHeartbeat}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded border font-mono font-medium ${
                        agent.status === 'online'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}
                    >
                      {agent.status === 'online' ? '在线' : '响应稍缓'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
