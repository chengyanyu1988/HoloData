import React, { useState } from 'react';
import { ContainerWorkload } from '../../types';
import {
  Boxes, BarChart3, ChevronRight, DownloadCloud, RefreshCw,
  Server, ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  Cpu, HardDrive, Terminal, Sliders, FileText, Activity, Gauge, PieChart, TrendingUp, Layers
} from 'lucide-react';

interface Props {
  containers?: ContainerWorkload[];
  onRefresh?: () => void;
}

interface ContainerNodeDetail {
  id: string;
  name: string;
  containerId: string;
  startTime: string;
  uptime: string;
  statusNormal: number;
  statusAbnormal: number;
  alarms: {
    critical: number; // 重大
    severe: number;   // 严重
    normal: number;   // 一般
    minor: number;    // 轻微
    info: number;     // 消息
  };
  namespace: string;
  ip: string;
  image: string;
}

const CONTAINER_STATS_NODES: ContainerNodeDetail[] = [
  {
    id: 'cnt-01',
    name: 'hologram-api-gateway-v2',
    containerId: 'cnt-docker-20261105-01',
    startTime: '2026-11-01 08:30:00',
    uptime: '4天 14小时 06分',
    statusNormal: 40,
    statusAbnormal: 24,
    alarms: {
      critical: 10,
      severe: 18,
      normal: 25,
      minor: 15,
      info: 20,
    },
    namespace: 'hologram-prod',
    ip: '10.244.1.42',
    image: 'registry.hologram.io/core/gateway:v2.4.1',
  },
  {
    id: 'cnt-02',
    name: 'hologram-etl-spark-master',
    containerId: 'cnt-docker-20261105-02',
    startTime: '2026-10-28 14:15:00',
    uptime: '8天 08小时 21分',
    statusNormal: 52,
    statusAbnormal: 12,
    alarms: {
      critical: 5,
      severe: 12,
      normal: 30,
      minor: 18,
      info: 22,
    },
    namespace: 'hologram-ai',
    ip: '10.244.2.18',
    image: 'registry.hologram.io/ai/spark-master:3.5.0',
  },
  {
    id: 'cnt-03',
    name: 'clickhouse-shard-01-replica-0',
    containerId: 'cnt-docker-20261105-03',
    startTime: '2026-11-03 10:00:00',
    uptime: '2天 12小时 36分',
    statusNormal: 68,
    statusAbnormal: 4,
    alarms: {
      critical: 2,
      severe: 8,
      normal: 35,
      minor: 20,
      info: 28,
    },
    namespace: 'hologram-middleware',
    ip: '10.244.3.92',
    image: 'registry.hologram.io/db/clickhouse:24.3-lts',
  },
];

export const ContainerMonitorStatsView: React.FC<Props> = ({
  onRefresh,
}) => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cnt-01');

  const selectedNode = CONTAINER_STATS_NODES.find(n => n.id === selectedNodeId) || CONTAINER_STATS_NODES[0];

  // Dynamically calculate metrics based on time range (1h, 6h, 24h, 7d)
  const getMetrics = (node: ContainerNodeDetail) => {
    const factorMap = {
      '1h': 0.35,
      '6h': 0.65,
      '24h': 1.0,
      '7d': 2.5,
    };
    const factor = factorMap[timeRange];

    const statusNormal = Math.max(10, Math.round(node.statusNormal * (0.6 + factor * 0.4)));
    const statusAbnormal = Math.max(1, Math.round(node.statusAbnormal * (0.5 + factor * 0.5)));

    const alarms = {
      critical: Math.max(0, Math.round(node.alarms.critical * factor)),
      severe: Math.max(1, Math.round(node.alarms.severe * factor)),
      normal: Math.max(2, Math.round(node.alarms.normal * factor)),
      minor: Math.max(2, Math.round(node.alarms.minor * factor)),
      info: Math.max(4, Math.round(node.alarms.info * factor)),
    };

    return { statusNormal, statusAbnormal, alarms };
  };

  const currentMetrics = getMetrics(selectedNode);
  const totalStatus = currentMetrics.statusNormal + currentMetrics.statusAbnormal;
  const normalRate = ((currentMetrics.statusNormal / totalStatus) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-4 h-4" />
          </span>
          <span className="text-cyan-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">容器监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">监控统计</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            统计时间窗口: {timeRange === '1h' ? '近1小时' : timeRange === '6h' ? '近6小时' : timeRange === '24h' ? '近24小时' : '近7天'} (2026-11-05)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded transition-colors ${
                  timeRange === r
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '1h' ? '1小时' : r === '6h' ? '6小时' : r === '24h' ? '24小时' : '近7天'}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert(`已导出容器近${timeRange}监控统计数据与状态告警报表！`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
            导出统计报表
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Container Node Fast Switch Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">选择容器工作负载:</span>
        {CONTAINER_STATS_NODES.map((node) => (
          <button
            key={node.id}
            onClick={() => setSelectedNodeId(node.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 flex items-center gap-2 ${
              selectedNodeId === node.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${selectedNodeId === node.id ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
            <span>{node.name} ({node.namespace})</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* Container Stats Dashboard: 设备参数 | 状态统计(半圆表盘) | 告警级别统计(立柱频谱) */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* Left Block: 设备参数 (Exact matching titles from screenshot) */}
          <div className="lg:col-span-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-cyan-300 font-bold text-sm mb-3 border-b border-cyan-500/20 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-cyan-400" />
                  <span>设备参数</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                  {timeRange}
                </span>
              </div>

              {/* High visibility display badge */}
              <div className="bg-cyan-500/15 border border-cyan-500/30 rounded-lg p-3 text-center mb-4">
                <div className="text-cyan-300 font-black text-lg tracking-wide font-mono truncate">
                  {selectedNode.name}
                </div>
                <div className="text-slate-400 text-xs mt-1 font-mono">
                  容器名称
                </div>
              </div>

              {/* Details Key-Value List */}
              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">容器名称:</span>
                  <span className="text-slate-100 font-semibold truncate max-w-[140px]" title={selectedNode.name}>
                    {selectedNode.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">容器id:</span>
                  <span className="text-cyan-300 font-semibold">{selectedNode.containerId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">启动时间:</span>
                  <span className="text-slate-200">{selectedNode.startTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">持续运行时间:</span>
                  <span className="text-emerald-400 font-bold">{selectedNode.uptime}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyan-500/20 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>IP: {selectedNode.ip}</span>
              <span className="text-cyan-300">{selectedNode.namespace}</span>
            </div>
          </div>

          {/* Middle Block: 状态统计 (Redesigned Non-Bar Chart: Dual-Track Radial Gauge Meter) */}
          <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative">
            <div className="text-slate-200 font-bold text-xs mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-emerald-400" />
                状态统计 (Radial Gauge Dial · {timeRange})
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                总计: {totalStatus} 项
              </span>
            </div>

            {/* Radial Semi-Circle Arc Gauge */}
            <div className="py-2 flex flex-col items-center justify-center relative">
              <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
                <svg className="w-48 h-48 absolute top-0" viewBox="0 0 100 100">
                  {/* Track background */}
                  <path
                    d="M 12 50 A 38 38 0 0 1 88 50"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="10"
                    strokeLinecap="round"
                  />
                  {/* Normal Arc (Lime Green) */}
                  <path
                    d="M 12 50 A 38 38 0 0 1 88 50"
                    fill="none"
                    stroke="#84cc16"
                    strokeWidth="10"
                    strokeDasharray="119.38"
                    strokeDashoffset={`${119.38 - (parseFloat(normalRate) / 100) * 119.38}`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                <div className="text-center mb-1 z-10 select-none">
                  <div className="text-2xl font-black font-mono text-lime-400">
                    {normalRate}%
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                    HEALTH RATE
                  </div>
                </div>
              </div>

              {/* Status Badges Cards */}
              <div className="grid grid-cols-2 gap-3 w-full mt-2 font-mono text-xs text-center">
                <div className="p-2.5 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-between px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-lime-400" />
                    <span className="text-slate-300 font-sans">正常运行</span>
                  </div>
                  <span className="text-lime-400 font-bold text-sm">{currentMetrics.statusNormal} 项</span>
                </div>

                <div className="p-2.5 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-between px-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                    <span className="text-slate-300 font-sans">异常关注</span>
                  </div>
                  <span className="text-orange-400 font-bold text-sm">{currentMetrics.statusAbnormal} 项</span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-800/60">
              <span>动态采样窗口: {timeRange}</span>
              <span className="text-lime-400">Pod 副本自动平稳伸缩</span>
            </div>
          </div>

          {/* Right Block: 告警级别统计 (Redesigned Non-Bar Chart: Vertical Column Spectrum Histogram Chart) */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative">
            <div className="text-slate-200 font-bold text-xs mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
                告警级别统计 (Column Spectrum · {timeRange})
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                共 {Object.values(currentMetrics.alarms).reduce((a, b) => a + b, 0)} 条告警
              </span>
            </div>

            {/* Vertical Multi-Column Histogram Spectrum Chart replacing horizontal bars */}
            <div className="h-44 flex items-end justify-between gap-3 px-3 pt-3">
              {[
                { label: '重大', val: currentMetrics.alarms.critical, color: 'bg-rose-500', text: 'text-rose-400', cap: 'bg-rose-300' },
                { label: '严重', val: currentMetrics.alarms.severe, color: 'bg-amber-500', text: 'text-amber-400', cap: 'bg-amber-300' },
                { label: '一般', val: currentMetrics.alarms.normal, color: 'bg-cyan-500', text: 'text-cyan-400', cap: 'bg-cyan-300' },
                { label: '轻微', val: currentMetrics.alarms.minor, color: 'bg-blue-500', text: 'text-blue-400', cap: 'bg-blue-300' },
                { label: '消息', val: currentMetrics.alarms.info, color: 'bg-slate-500', text: 'text-slate-400', cap: 'bg-slate-300' },
              ].map((col) => {
                const maxVal = Math.max(1, ...Object.values(currentMetrics.alarms));
                const heightPercent = Math.max(14, Math.round((col.val / maxVal) * 100));

                return (
                  <div key={col.label} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                    <span className={`text-xs font-mono font-bold ${col.text}`}>{col.val}</span>
                    <div className="w-full bg-slate-900 rounded-t-md p-1 border border-slate-800/80 flex items-end justify-center" style={{ height: '70%' }}>
                      <div
                        className={`w-full ${col.color} rounded-t-xs transition-all duration-500 group-hover:brightness-125 relative`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        <div className={`w-full h-1 ${col.cap} rounded-t-xs shadow-sm`} />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-300 font-semibold">{col.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-2 text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-800/60">
              <span>Cilium eBPF 实时捕获</span>
              <span className="text-cyan-300">告警自动收敛闭环</span>
            </div>
          </div>

        </div>
      </div>

      {/* Container List Table with Dynamic Time Window Numbers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Boxes className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              容器工作负载纳管节点列表 (Container Workloads Overview)
            </h3>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {timeRange === '1h' ? '1小时' : timeRange === '6h' ? '6小时' : timeRange === '24h' ? '24小时' : '近7天'} 采样窗口 | 2026-11-05
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">容器名称 / ID</th>
                <th className="py-2.5 px-3">命名空间</th>
                <th className="py-2.5 px-3">IP地址</th>
                <th className="py-2.5 px-3">镜像版本</th>
                <th className="py-2.5 px-3">启动时间</th>
                <th className="py-2.5 px-3">持续运行时间</th>
                <th className="py-2.5 px-3">正常/异常</th>
                <th className="py-2.5 px-3">告警数 (重大/严重)</th>
                <th className="py-2.5 px-3 text-right">切换查看</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {CONTAINER_STATS_NODES.map((node) => {
                const nodeMetrics = getMetrics(node);
                return (
                  <tr
                    key={node.id}
                    className={`hover:bg-slate-950/60 transition-colors ${
                      selectedNodeId === node.id ? 'bg-cyan-950/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <span className="font-semibold text-slate-200 block">{node.name}</span>
                      <span className="text-[10px] text-cyan-400">{node.containerId}</span>
                    </td>
                    <td className="py-2.5 px-3 text-cyan-300">
                      {node.namespace}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {node.ip}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px] truncate max-w-[160px]" title={node.image}>
                      {node.image}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {node.startTime}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">
                      {node.uptime}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-lime-400 font-bold">{nodeMetrics.statusNormal}</span> / <span className="text-orange-400 font-bold">{nodeMetrics.statusAbnormal}</span>
                    </td>
                    <td className="py-2.5 px-3 text-rose-400 font-bold">
                      {nodeMetrics.alarms.critical} / {nodeMetrics.alarms.severe}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-sans font-medium transition-colors ${
                          selectedNodeId === node.id
                            ? 'bg-cyan-500 text-slate-950 font-bold'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {selectedNodeId === node.id ? '当前查看' : '查看参数'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
