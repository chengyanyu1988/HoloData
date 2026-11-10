import React, { useState } from 'react';
import { ContainerWorkload } from '../../types';
import {
  Boxes, BarChart3, ChevronRight, DownloadCloud, RefreshCw,
  Server, ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  Cpu, HardDrive, Terminal, Sliders, FileText, Activity, Gauge,
  TrendingUp, Layers, CheckCircle, AlertCircle, Info, Sparkles, Filter
} from 'lucide-react';

interface Props {
  containers?: ContainerWorkload[];
  onRefresh?: () => void;
}

export interface ContainerNodeDetail {
  id: string;
  name: string;
  shortName: string;
  containerId: string;
  startTime: string;
  uptime: string;
  namespace: string;
  ip: string;
  image: string;
  hostNode: string;
  cpuLimit: string;
  memLimit: string;
  statusNormal: number; // e.g. 40
  statusAbnormal: number; // e.g. 24
  alarms: {
    critical: number; // 重大 (e.g. 10)
    severe: number;   // 严重 (e.g. 18)
    normal: number;   // 一般 (e.g. 25)
    minor: number;    // 轻微 (e.g. 18)
    info: number;     // 消息 (e.g. 22)
  };
}

const CONTAINER_STATS_NODES: ContainerNodeDetail[] = [
  {
    id: 'cnt-01',
    name: 'k8s-ingress-controller-v1.10',
    shortName: 'API网关',
    containerId: 'cri-o://d9f8a3c4e1b27f6a9e3d8c4b',
    startTime: '2026-11-06 08:30:00',
    uptime: '3天 08小时 40分',
    namespace: 'hologram-prod',
    ip: '10.244.1.42',
    image: 'registry.hologram.io/core/ingress-nginx:v1.10.2',
    hostNode: 'k8s-worker-node-04 (10.120.99.14)',
    cpuLimit: '4 Cores',
    memLimit: '8.0 GB',
    statusNormal: 40,
    statusAbnormal: 24,
    alarms: {
      critical: 10,
      severe: 18,
      normal: 25,
      minor: 18,
      info: 22,
    },
  },
  {
    id: 'cnt-02',
    name: 'clickhouse-shard-01-replica-0',
    shortName: 'ClickHouse',
    containerId: 'cri-o://c8e7d6f5a4b39e2d1c0b8f7a',
    startTime: '2026-11-07 14:15:00',
    uptime: '2天 02小时 55分',
    namespace: 'hologram-middleware',
    ip: '10.244.3.92',
    image: 'registry.hologram.io/db/clickhouse:24.3-lts',
    hostNode: 'k8s-worker-node-08 (10.120.99.18)',
    cpuLimit: '16 Cores',
    memLimit: '64.0 GB',
    statusNormal: 58,
    statusAbnormal: 12,
    alarms: {
      critical: 4,
      severe: 12,
      normal: 32,
      minor: 18,
      info: 24,
    },
  },
  {
    id: 'cnt-03',
    name: 'kafka-broker-cluster-node-02',
    shortName: 'Kafka队列',
    containerId: 'containerd://a1b2c3d4e5f67a8b9c0d1e2f',
    startTime: '2026-11-08 10:00:00',
    uptime: '1天 07小时 10分',
    namespace: 'hologram-infra',
    ip: '10.244.2.18',
    image: 'registry.hologram.io/msg/kafka:3.7.0',
    hostNode: 'k8s-worker-node-02 (10.120.99.12)',
    cpuLimit: '8 Cores',
    memLimit: '32.0 GB',
    statusNormal: 64,
    statusAbnormal: 6,
    alarms: {
      critical: 2,
      severe: 8,
      normal: 28,
      minor: 20,
      info: 30,
    },
  },
  {
    id: 'cnt-04',
    name: 'spark-executor-ai-job-99',
    shortName: 'Spark引擎',
    containerId: 'docker://e9f8a7b6c5d43e2f1a0b9c8d',
    startTime: '2026-11-09 01:20:00',
    uptime: '16小时 50分',
    namespace: 'hologram-ai',
    ip: '10.244.4.105',
    image: 'registry.hologram.io/ai/spark-executor:3.5.1',
    hostNode: 'gpu-cluster-node-01 (10.120.99.15)',
    cpuLimit: '32 Cores',
    memLimit: '128.0 GB',
    statusNormal: 50,
    statusAbnormal: 16,
    alarms: {
      critical: 6,
      severe: 15,
      normal: 22,
      minor: 14,
      info: 19,
    },
  },
  {
    id: 'cnt-05',
    name: 'redis-cache-cluster-master-01',
    shortName: 'Redis缓存',
    containerId: 'cri-o://f5e4d3c2b1a09f8e7d6c5b4a',
    startTime: '2026-11-09 06:45:00',
    uptime: '10小时 25分',
    namespace: 'hologram-cache',
    ip: '10.244.5.66',
    image: 'registry.hologram.io/cache/redis:7.2-alpine',
    hostNode: 'k8s-worker-node-06 (10.120.99.16)',
    cpuLimit: '4 Cores',
    memLimit: '16.0 GB',
    statusNormal: 70,
    statusAbnormal: 4,
    alarms: {
      critical: 1,
      severe: 5,
      normal: 16,
      minor: 22,
      info: 34,
    },
  },
];

export const ContainerMonitorStatsView: React.FC<Props> = ({ onRefresh }) => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('cnt-01');

  const selectedNode =
    CONTAINER_STATS_NODES.find((n) => n.id === selectedNodeId) || CONTAINER_STATS_NODES[0];

  // Calculate dynamic metrics based on time window factors
  const getMetrics = (node: ContainerNodeDetail) => {
    const factorMap = {
      '1h': 0.35,
      '6h': 0.65,
      '24h': 1.0,
      '7d': 2.4,
    };
    const factor = factorMap[timeRange];

    const statusNormal = Math.max(10, Math.round(node.statusNormal * (0.7 + factor * 0.3)));
    const statusAbnormal = Math.max(1, Math.round(node.statusAbnormal * (0.6 + factor * 0.4)));

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
  const totalAlarms = Object.values(currentMetrics.alarms).reduce((a, b) => a + b, 0);

  // Scales for charts
  const statusScaleTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80];
  const maxStatusScale = 80;

  const alarmScaleTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
  const maxAlarmScale = 90;

  return (
    <div className="space-y-5 font-sans">
      {/* Top Breadcrumb & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <BarChart3 className="w-4 h-4" />
          </span>
          <span className="text-cyan-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">容器监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">监控统计</span>
          <span className="ml-2 text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            采样时间: 2026-11-09 (近期数据)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Window Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                  timeRange === r
                    ? 'bg-cyan-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '1h' ? '1小时' : r === '6h' ? '6小时' : r === '24h' ? '24小时' : '近7天'}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert(`已导出容器【${selectedNode.name}】监控统计分析报表！`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors cursor-pointer"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
            导出报表
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="刷新数据"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Container Node Workload Selection Tabs */}
      <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center gap-3 overflow-x-auto shadow-xs">
        <span className="text-xs font-bold text-slate-300 shrink-0 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          切换监控容器:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto">
          {CONTAINER_STATS_NODES.map((node) => {
            const isSelected = selectedNodeId === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold shadow-xs'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                <span>{node.name}</span>
                <span className="text-[10px] text-slate-500">({node.namespace})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ============================================================================================== */}
      {/* MAIN BLOCK: Exactly matching the layout structure in screenshot /public/assets/aistudio/image_cdbeace2.png */}
      {/* Combined Horizontal Container Card split into: Left (设备参数), Middle (正常/异常柱状图), Right (告警级别柱状图) */}
      {/* ============================================================================================== */}
      <div className="bg-[#021b2d] border border-[#005580] rounded-xl p-5 shadow-2xl space-y-4 text-slate-100 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">

          {/* -------------------------------------------------------------------------------- */}
          {/* Part 1: 设备参数 (Left Box - Large square tile badge + Key-Value Parameter List) */}
          {/* -------------------------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#002b49] border border-[#004f7a] rounded-lg p-3 flex flex-col md:flex-row items-stretch gap-3">
            {/* Far Left: Large Hero Square Tile with Container Title */}
            <div className="w-full md:w-32 shrink-0 bg-[#00385e] border border-cyan-500/40 rounded flex flex-col items-center justify-center p-3 text-center shadow-md">
              <div className="text-xl md:text-2xl font-black text-cyan-300 tracking-wider font-sans leading-tight">
                {selectedNode.shortName}
              </div>
              <div className="text-[11px] text-cyan-400 font-mono mt-2 truncate w-full" title={selectedNode.name}>
                {selectedNode.name.length > 16 ? selectedNode.name.slice(0, 15) + '...' : selectedNode.name}
              </div>
            </div>

            {/* Right side of Part 1: 设备参数 Title & Key-Value list */}
            <div className="flex-1 flex flex-col justify-between py-1 text-xs">
              <div>
                <h4 className="text-cyan-300 font-bold text-sm mb-2.5 pb-1 border-b border-cyan-800/80 flex items-center justify-between">
                  <span>设备参数</span>
                  <span className="text-[10px] text-slate-400 font-mono">cgroup v2</span>
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium shrink-0">容器名称:</span>
                    <span className="text-slate-100 font-mono font-semibold truncate" title={selectedNode.name}>
                      {selectedNode.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium shrink-0">容器id:</span>
                    <span className="text-cyan-300 font-mono text-[11px] truncate" title={selectedNode.containerId}>
                      {selectedNode.containerId}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium shrink-0">启动时间:</span>
                    <span className="text-slate-200 font-mono text-[11px]">
                      {selectedNode.startTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-300 font-medium shrink-0">持续运行时间:</span>
                    <span className="text-emerald-400 font-mono font-bold">
                      {selectedNode.uptime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------------------- */}
          {/* Part 2: 状态统计 (Middle Box - 正常/异常 水平柱状图 + 0..80 网格刻度)          */}
          {/* -------------------------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#002b49] border border-[#004f7a] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center pb-1.5 mb-2 border-b border-cyan-800/60 text-xs">
              <span className="text-slate-200 font-bold">状态统计 (0~80)</span>
              <span className="text-slate-400 font-mono text-[11px]">
                健康率: <span className="text-lime-400 font-bold">{normalRate}%</span>
              </span>
            </div>

            {/* Chart Canvas with Grid Lines */}
            <div className="flex-1 flex flex-col justify-between py-2 relative min-h-[140px]">
              {/* Vertical Grid Background Lines */}
              <div className="absolute inset-0 left-12 right-2 top-2 bottom-6 flex justify-between pointer-events-none">
                {statusScaleTicks.map((tick) => (
                  <div key={tick} className="h-full border-r border-cyan-800/40 border-dashed" />
                ))}
              </div>

              {/* Rows: 正常 & 异常 */}
              <div className="space-y-4 relative z-10 pl-1 pr-2">
                {/* 正常 Bar */}
                <div className="flex items-center gap-3">
                  <span className="w-10 text-right text-xs font-semibold text-slate-200 shrink-0">正常</span>
                  <div className="flex-1 bg-slate-900/60 h-6 rounded-xs overflow-hidden p-0.5 border border-cyan-900/60 flex items-center">
                    <div
                      className="h-full bg-gradient-to-r from-lime-500 to-lime-400 rounded-xs transition-all duration-500 flex items-center justify-end pr-2 text-[11px] font-mono font-bold text-slate-950 shadow-sm"
                      style={{ width: `${Math.min(100, (currentMetrics.statusNormal / maxStatusScale) * 100)}%` }}
                    >
                      {currentMetrics.statusNormal}
                    </div>
                  </div>
                </div>

                {/* 异常 Bar */}
                <div className="flex items-center gap-3">
                  <span className="w-10 text-right text-xs font-semibold text-slate-200 shrink-0">异常</span>
                  <div className="flex-1 bg-slate-900/60 h-6 rounded-xs overflow-hidden p-0.5 border border-cyan-900/60 flex items-center">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-xs transition-all duration-500 flex items-center justify-end pr-2 text-[11px] font-mono font-bold text-slate-950 shadow-sm"
                      style={{ width: `${Math.min(100, (currentMetrics.statusAbnormal / maxStatusScale) * 100)}%` }}
                    >
                      {currentMetrics.statusAbnormal}
                    </div>
                  </div>
                </div>
              </div>

              {/* X-Axis Numbers Scale: 0, 10, 20, 30, 40, 50, 60, 70, 80 */}
              <div className="flex justify-between pl-12 pr-2 pt-2 text-[10px] font-mono text-cyan-400 border-t border-cyan-800/60 z-10">
                {statusScaleTicks.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------------------------------------- */}
          {/* Part 3: 告警级别统计 (Right Box - 重大/严重/一般/轻微/消息 水平柱状图 + 0..90 网格刻度) */}
          {/* -------------------------------------------------------------------------------- */}
          <div className="lg:col-span-4 bg-[#002b49] border border-[#004f7a] rounded-lg p-3 flex flex-col justify-between relative overflow-hidden">
            <div className="flex justify-between items-center pb-1.5 mb-2 border-b border-cyan-800/60 text-xs">
              <span className="text-slate-200 font-bold">告警级别统计 (0~90)</span>
              <span className="text-cyan-400 font-mono text-[11px]">
                总告警: <span className="text-rose-400 font-bold">{totalAlarms}</span> 条
              </span>
            </div>

            {/* Chart Canvas with Grid Lines */}
            <div className="flex-1 flex flex-col justify-between py-1 relative min-h-[140px]">
              {/* Vertical Grid Background Lines */}
              <div className="absolute inset-0 left-12 right-2 top-2 bottom-6 flex justify-between pointer-events-none">
                {alarmScaleTicks.map((tick) => (
                  <div key={tick} className="h-full border-r border-cyan-800/40 border-dashed" />
                ))}
              </div>

              {/* Rows: 重大, 严重, 一般, 轻微, 消息 */}
              <div className="space-y-2 relative z-10 pl-1 pr-2 text-xs">
                {[
                  { label: '重大', val: currentMetrics.alarms.critical, color: 'from-cyan-600 to-cyan-400' },
                  { label: '严重', val: currentMetrics.alarms.severe, color: 'from-cyan-500 to-cyan-300' },
                  { label: '一般', val: currentMetrics.alarms.normal, color: 'from-cyan-500 to-cyan-300' },
                  { label: '轻微', val: currentMetrics.alarms.minor, color: 'from-cyan-600 to-cyan-400' },
                  { label: '消息', val: currentMetrics.alarms.info, color: 'from-cyan-600 to-cyan-400' },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-2">
                    <span className="w-10 text-right text-[11px] font-semibold text-slate-200 shrink-0">{row.label}</span>
                    <div className="flex-1 bg-slate-900/60 h-4 rounded-xs overflow-hidden p-0.5 border border-cyan-900/60 flex items-center">
                      <div
                        className={`h-full bg-gradient-to-r ${row.color} rounded-xs transition-all duration-500 flex items-center justify-end pr-1 text-[10px] font-mono font-bold text-slate-950 shadow-sm`}
                        style={{ width: `${Math.max(4, Math.min(100, (row.val / maxAlarmScale) * 100))}%` }}
                      >
                        {row.val > 0 ? row.val : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* X-Axis Numbers Scale: 0, 10, 20, 30, 40, 50, 60, 70, 80, 90 */}
              <div className="flex justify-between pl-12 pr-2 pt-2 text-[10px] font-mono text-cyan-400 border-t border-cyan-800/60 z-10">
                {alarmScaleTicks.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================================================== */}
      {/* Bottom Workload Detail Table: Real Container Telemetry Metrics List                           */}
      {/* ============================================================================================== */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Boxes className="w-4 h-4 text-cyan-400" />
              <span>全域容器工作负载监控统计数据台账</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              容器 Pod 真实状态、运行时长与 5 级告警分类明细（采样时间: 2026-11-09）
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded border border-cyan-500/20">
            全量已集成 Cilium eBPF 探针
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] bg-slate-950/60">
                <th className="py-3 px-4">容器名称 / ID</th>
                <th className="py-3 px-4">命名空间</th>
                <th className="py-3 px-4">IP / 宿主节点</th>
                <th className="py-3 px-4">镜像版本</th>
                <th className="py-3 px-4">启动时间</th>
                <th className="py-3 px-4">持续运行时间</th>
                <th className="py-3 px-4">正常 / 异常</th>
                <th className="py-3 px-4">告警数 (重大/严重/一般/轻微/消息)</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-mono">
              {CONTAINER_STATS_NODES.map((node) => {
                const nodeMetrics = getMetrics(node);
                const isSelected = selectedNodeId === node.id;
                return (
                  <tr
                    key={node.id}
                    className={`hover:bg-slate-950/80 transition-colors ${
                      isSelected ? 'bg-cyan-950/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-100 block font-sans">{node.name}</span>
                      <span className="text-[10px] text-cyan-400">{node.containerId}</span>
                    </td>
                    <td className="py-3 px-4 text-cyan-300 font-medium">
                      {node.namespace}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{node.ip}</div>
                      <div className="text-[10px] text-slate-500">{node.hostNode.split(' ')[0]}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[150px]" title={node.image}>
                      {node.image}
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {node.startTime}
                    </td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">
                      {node.uptime}
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-lime-400 font-bold">{nodeMetrics.statusNormal}</span> / <span className="text-orange-400 font-bold">{nodeMetrics.statusAbnormal}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-cyan-300 font-bold">
                        {nodeMetrics.alarms.critical} / {nodeMetrics.alarms.severe} / {nodeMetrics.alarms.normal} / {nodeMetrics.alarms.minor} / {nodeMetrics.alarms.info}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`px-3 py-1 rounded text-xs font-sans font-semibold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        }`}
                      >
                        {isSelected ? '已选中' : '查看图表'}
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
