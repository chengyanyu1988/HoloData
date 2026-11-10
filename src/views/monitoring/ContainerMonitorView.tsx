import React, { useState, useEffect } from 'react';
import { ContainerWorkload } from '../../types';
import {
  Boxes, Box, Search, RefreshCw, ChevronRight, Activity, Cpu,
  HardDrive, Network, Terminal, RotateCw, CheckCircle2, ShieldCheck,
  Zap, BarChart3, Layers, Sliders, ArrowUpRight, ArrowDownLeft, SlidersHorizontal, UserCheck
} from 'lucide-react';
import { ContainerMonitorStatsView } from './ContainerMonitorStatsView';

interface Props {
  containers?: ContainerWorkload[];
  initialSubTab?: 'data' | 'stats';
  onOpenTerminal?: (name: string, ip: string) => void;
  onRefresh?: () => void;
}

interface ContainerDetailItem {
  id: string;
  name: string;
  containerId: string;
  startTime: string;
  uptime: string;
  namespace: string;
  ip: string;
  image: string;
  cpuUsage: number; // e.g. 35
  cpuIdle: number; // e.g. 65
  memTotal: number; // e.g. 36
  memUsed: number; // e.g. 8
  memIdle: number; // e.g. 28
  netIn: number; // e.g. 50.6
  netOut: number; // e.g. 50.6
  diskUsed: number; // e.g. 120
  diskFree: number; // e.g. 120
  diskTotal: number; // e.g. 240
  processes: number; // e.g. 11
  runningProc: number; // e.g. 8
  users: number; // e.g. 123
}

const CONTAINER_MONITOR_DATA: ContainerDetailItem[] = [
  {
    id: 'cnt-01',
    name: 'hologram-k8s-pod-01',
    containerId: 'cnt-20261109-8842',
    startTime: '2026-11-06 08:30:00',
    uptime: '3天 08小时 40分',
    namespace: 'hologram-prod',
    ip: '10.244.1.42',
    image: 'registry.hologram.io/core/gateway:v2.4.1',
    cpuUsage: 35,
    cpuIdle: 65,
    memTotal: 36,
    memUsed: 8,
    memIdle: 28,
    netIn: 50.6,
    netOut: 50.6,
    diskUsed: 120,
    diskFree: 120,
    diskTotal: 240,
    processes: 11,
    runningProc: 8,
    users: 123,
  },
  {
    id: 'cnt-02',
    name: 'hologram-etl-spark-01',
    containerId: 'cnt-20261109-9912',
    startTime: '2026-11-07 14:15:00',
    uptime: '2天 02小时 55分',
    namespace: 'hologram-ai',
    ip: '10.244.2.18',
    image: 'registry.hologram.io/ai/spark-master:3.5.0',
    cpuUsage: 48,
    cpuIdle: 52,
    memTotal: 64,
    memUsed: 24,
    memIdle: 40,
    netIn: 128.4,
    netOut: 96.2,
    diskUsed: 310,
    diskFree: 190,
    diskTotal: 500,
    processes: 24,
    runningProc: 18,
    users: 85,
  },
  {
    id: 'cnt-03',
    name: 'clickhouse-shard-01-replica-0',
    containerId: 'cnt-20261109-3304',
    startTime: '2026-11-08 10:00:00',
    uptime: '1天 07小时 10分',
    namespace: 'hologram-middleware',
    ip: '10.244.3.92',
    image: 'registry.hologram.io/db/clickhouse:24.3-lts',
    cpuUsage: 62,
    cpuIdle: 38,
    memTotal: 128,
    memUsed: 72,
    memIdle: 56,
    netIn: 210.8,
    netOut: 184.5,
    diskUsed: 1200,
    diskFree: 800,
    diskTotal: 2000,
    processes: 36,
    runningProc: 30,
    users: 210,
  },
];

export const ContainerMonitorView: React.FC<Props> = ({
  containers,
  initialSubTab = 'data',
  onOpenTerminal,
  onRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'data' | 'stats'>(initialSubTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>('cnt-01');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const selectedItem = CONTAINER_MONITOR_DATA.find(c => c.id === selectedId) || CONTAINER_MONITOR_DATA[0];

  const filteredItems = CONTAINER_MONITOR_DATA.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.containerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Boxes className="w-4 h-4" />
          </span>
          <span className="text-cyan-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">容器监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">
            {activeSubTab === 'stats' ? '监控统计' : '监控数据'}
          </span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            近期采样时间: 2026-11-09 (近期实时)
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新容器遥测"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {activeSubTab === 'stats' ? (
        <ContainerMonitorStatsView containers={containers} onRefresh={onRefresh} />
      ) : (
        /* Main Workspace: Left 容器列表 + Right Modern Telemetry Panels */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

          {/* ========================================================================= */}
          {/* Left Column: 容器列表 Search & Tree Navigation */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Box className="w-4 h-4 text-cyan-400" />
                容器列表
              </span>
              <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                {CONTAINER_MONITOR_DATA.length} 实例
              </span>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="请输入名称"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Tree Nodes List */}
            <div className="space-y-1 font-mono text-xs pt-1">
              <div className="text-[11px] text-slate-400 px-2 py-1 font-semibold flex items-center gap-1.5">
                <Boxes className="w-3.5 h-3.5 text-blue-400" />
                <span>容器集群 (K8s)</span>
              </div>

              <div className="pl-3 space-y-1">
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                      selectedId === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                        : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`w-2 h-2 rounded-full ${selectedId === item.id ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span className="truncate">{item.name}</span>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${selectedId === item.id ? 'text-cyan-300' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/80 flex justify-between">
              <span>状态: 全量在线</span>
              <span className="text-emerald-400">cgroup v2 纳管</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Right Column: 基础信息 + 改良版非饼图现代高科技指标矩阵 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-9 space-y-4">

            {/* 1. 基础信息 Top Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-100">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>基础信息</span>
                </div>
                {onOpenTerminal && (
                  <button
                    onClick={() => onOpenTerminal(`kubectl exec -it ${selectedItem.name}`, selectedItem.ip)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>Exec Shell</span>
                  </button>
                )}
              </div>

              {/* Exact fields matching screenshot title & layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block font-sans">容器名称:</span>
                  <span className="font-bold text-slate-100 mt-1 block truncate" title={selectedItem.name}>
                    {selectedItem.name}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block font-sans">容器id:</span>
                  <span className="font-bold text-cyan-300 mt-1 block">
                    {selectedItem.containerId}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block font-sans">启动时间:</span>
                  <span className="font-semibold text-slate-200 mt-1 block">
                    {selectedItem.startTime}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80">
                  <span className="text-slate-400 text-[11px] block font-sans">持续运行时间:</span>
                  <span className="font-bold text-emerald-400 mt-1 block">
                    {selectedItem.uptime}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Three Metric Cards: CPU使用率 (LED Gauge), 内存利用率 (Ring Gauge), 网络接口 (Pulse Speedometer) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Card 1: CPU 使用率 (Replaced Pie Chart -> 24-Segment LED Horizontal Volume Progress Bar Gauge) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    CPU使用率
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                    使用率: {selectedItem.cpuUsage}% | 空闲率: {selectedItem.cpuIdle}%
                  </span>
                </div>

                {/* Modern 20-segment LED horizontal bar graph gauge */}
                <div className="py-2 space-y-3">
                  <div className="flex justify-between items-baseline font-mono text-xs">
                    <span className="text-slate-400">计算核心负载</span>
                    <span className="text-xl font-black text-cyan-300">{selectedItem.cpuUsage}%</span>
                  </div>

                  <div className="grid grid-cols-20 gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const filledCount = Math.round((selectedItem.cpuUsage / 100) * 20);
                      const isFilled = i < filledCount;
                      return (
                        <div
                          key={i}
                          className={`h-7 rounded-xs transition-all duration-300 ${
                            isFilled
                              ? i > 15 ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                              : 'bg-slate-800/60'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      使用率: {selectedItem.cpuUsage}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                      空闲率: {selectedItem.cpuIdle}%
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                  <span>限额: 8 核心</span>
                  <span className="text-cyan-400">无 CPU Throttling</span>
                </div>
              </div>

              {/* Card 2: 内存利用率 (Replaced Donut Chart -> Concentric Dual-Ring Arc Gauge) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    内存利用率
                  </span>
                  <span className="text-[10px] font-mono text-blue-300 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    内存:{selectedItem.memTotal}G | 已使用:{selectedItem.memUsed}G
                  </span>
                </div>

                {/* Dual Ring Arc Gauge replacing standard donut */}
                <div className="py-2 flex items-center justify-around">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                      {/* Active memory ring */}
                      <circle
                        cx="50" cy="50" r="38" fill="transparent"
                        stroke="#3b82f6" strokeWidth="10"
                        strokeDasharray="238.76"
                        strokeDashoffset={`${238.76 * (1 - selectedItem.memUsed / selectedItem.memTotal)}`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute text-center select-none">
                      <span className="text-xl font-black font-mono text-blue-300">{selectedItem.memUsed}G</span>
                      <span className="text-[9px] text-slate-400 block font-mono">已用内存</span>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">内存总量:</span>
                      <span className="text-slate-100 font-bold">{selectedItem.memTotal}G</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">已使用 / 剩余:</span>
                      <span className="text-blue-300 font-bold">{selectedItem.memUsed}G / {selectedItem.memIdle}G</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                  <span>空闲率: {selectedItem.cpuIdle}%</span>
                  <span className="text-emerald-400">OOM 风险低</span>
                </div>
              </div>

              {/* Card 3: 网络接口 (Replaced Plain Numbers -> Dual Pulse Speedometer Cards) */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Network className="w-3.5 h-3.5 text-emerald-400" />
                    网络接口
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                    Cilium eBPF
                  </span>
                </div>

                <div className="space-y-2.5 py-1">
                  {/* Inbound Flow Card */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block flex items-center gap-1 font-sans">
                        <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                        网络进程口流量 (MBPS)
                      </span>
                      <span className="text-2xl font-black font-mono text-emerald-400 mt-0.5 block">
                        {selectedItem.netIn}
                      </span>
                    </div>
                    <div className="w-16 h-8 flex items-center justify-center">
                      <svg className="w-full h-full text-emerald-500/40" viewBox="0 0 50 20">
                        <path d="M0,15 L10,12 L20,18 L30,5 L40,10 L50,2" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>

                  {/* Outbound Flow Card */}
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block flex items-center gap-1 font-sans">
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                        网络出口流量 (MBPS)
                      </span>
                      <span className="text-2xl font-black font-mono text-amber-400 mt-0.5 block">
                        {selectedItem.netOut}
                      </span>
                    </div>
                    <div className="w-16 h-8 flex items-center justify-center">
                      <svg className="w-full h-full text-amber-500/40" viewBox="0 0 50 20">
                        <path d="M0,8 L10,15 L20,5 L30,12 L40,4 L50,14" fill="none" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                  <span>网卡双工: 10 Gbps</span>
                  <span className="text-emerald-400">零丢包/零延迟</span>
                </div>
              </div>

            </div>

            {/* 3. Lower Row: 磁盘 (Disk Storage & IO Spectrum) & 负载 (Process Load) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

              {/* 磁盘 (Storage & IO) */}
              <div className="md:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-purple-400" />
                    磁盘 (目录磁盘空间 & 磁盘 I/O 速率)
                  </span>
                  <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                    已用:{selectedItem.diskUsed}G | 可用:{selectedItem.diskFree}G | 全部:{selectedItem.diskTotal}G
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-1 items-center">
                  {/* Left: Storage Bar Capacity Spectrum */}
                  <div className="sm:col-span-5 space-y-2">
                    <span className="text-xs text-slate-400 font-mono block">目录磁盘空间分布</span>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-400">使用率</span>
                        <span className="text-purple-300 font-bold">{((selectedItem.diskUsed / selectedItem.diskTotal) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${(selectedItem.diskUsed / selectedItem.diskTotal) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono text-slate-400">
                        <span>已用: {selectedItem.diskUsed}G</span>
                        <span>全部: {selectedItem.diskTotal}G</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Vertical 12-bar I/O Spectrum Column Chart */}
                  <div className="sm:col-span-7 space-y-1">
                    <span className="text-xs text-slate-400 font-mono block">磁盘 I/O 速率 (MB/s 实时频谱)</span>
                    <div className="h-20 bg-slate-950 rounded-lg border border-slate-800 p-2 flex items-end justify-between gap-1.5">
                      {[24, 45, 30, 68, 52, 85, 40, 72, 95, 60, 38, 50].map((v, i) => (
                        <div key={i} className="flex-1 bg-slate-900 h-full rounded-t flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t transition-all duration-300 hover:brightness-125"
                            style={{ height: `${v}%` }}
                            title={`时刻 ${i * 5}s: ${v} MB/s`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 负载 (Process & Session Load) */}
              <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    负载
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                    系统进程
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center font-mono py-1">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">当前进程数</span>
                    <span className="text-xl font-black text-cyan-300 mt-1 block">{selectedItem.processes}</span>
                    <span className="text-[9px] text-slate-500 block">(个)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">运行进程数</span>
                    <span className="text-xl font-black text-emerald-400 mt-1 block">{selectedItem.runningProc}</span>
                    <span className="text-[9px] text-slate-500 block">(个)</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-sans">登录用户数</span>
                    <span className="text-xl font-black text-blue-300 mt-1 block">{selectedItem.users}</span>
                    <span className="text-[9px] text-slate-500 block">(个)</span>
                  </div>
                </div>

                <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                  <span>线程并发: 1,420</span>
                  <span className="text-emerald-400">运行无阻塞</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};
