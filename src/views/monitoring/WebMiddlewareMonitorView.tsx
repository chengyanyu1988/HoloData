import React, { useState } from 'react';
import {
  Globe, Server, RefreshCw, Search, CheckCircle2, AlertTriangle,
  Zap, HardDrive, Cpu, ShieldCheck, Activity, Terminal, ChevronRight,
  Layers, Gauge, ArrowDownLeft, ArrowUpRight, Users, Clock
} from 'lucide-react';

interface Props {
  onRefresh?: () => void;
}

interface WebTomcatInstance {
  id: string;
  name: string;
  version: string;
  uptime: string;
  startTime: string;
  ip: string;
  port: number;
  heapTotalGB: number;
  heapUsedGB: number;
  heapFreeGB: number;
  nonHeapTotalGB: number;
  nonHeapUsedGB: number;
  nonHeapFreeGB: number;
  totalThreads: number; // 11
  activeThreads: number; // 8
  peakThreads: number; // 123
  daemonThreads: number; // 123
  bytesRecvPerSec: number; // 123,123
  bytesSentPerSec: number; // 123,123
  errorBytesPerSec: number; // 0
  requestProcessTimeSec: number; // 0.02
  requestsPerSec: number; // 4,520
  maxActiveSessionsHistory: number; // 12,500
  rejectedSessions: number; // 0
  currentActiveSessions: number; // 3,420
  maxAllowedSessions: number; // 50,000
  createdSessionsPerSec: number; // 28
  cpuLoadHistory: number[]; // 14 points histogram
}

const TOMCAT_TREE_INSTANCES: WebTomcatInstance[] = [
  {
    id: 'tc-01',
    name: 'hologram-core-tomcat-01',
    version: 'Apache Tomcat/10.1.20 (Java 21 LTS)',
    uptime: '42天 18小时 30分',
    startTime: '2026-09-24 06:00:00',
    ip: '10.120.30.15',
    port: 8080,
    heapTotalGB: 36,
    heapUsedGB: 8,
    heapFreeGB: 28,
    nonHeapTotalGB: 36,
    nonHeapUsedGB: 6,
    nonHeapFreeGB: 30,
    totalThreads: 11,
    activeThreads: 8,
    peakThreads: 123,
    daemonThreads: 123,
    bytesRecvPerSec: 123123,
    bytesSentPerSec: 123123,
    errorBytesPerSec: 0,
    requestProcessTimeSec: 0.02,
    requestsPerSec: 4520,
    maxActiveSessionsHistory: 12500,
    rejectedSessions: 0,
    currentActiveSessions: 3420,
    maxAllowedSessions: 50000,
    createdSessionsPerSec: 28,
    cpuLoadHistory: [18, 35, 28, 48, 62, 65, 72, 58, 82, 88, 92, 85, 90, 95],
  },
  {
    id: 'tc-02',
    name: 'hologram-auth-tomcat-02',
    version: 'Apache Tomcat/10.1.20 (Java 21 LTS)',
    uptime: '28天 12小时 45分',
    startTime: '2026-10-08 11:30:00',
    ip: '10.120.30.16',
    port: 8080,
    heapTotalGB: 36,
    heapUsedGB: 12,
    heapFreeGB: 24,
    nonHeapTotalGB: 36,
    nonHeapUsedGB: 8,
    nonHeapFreeGB: 28,
    totalThreads: 16,
    activeThreads: 10,
    peakThreads: 145,
    daemonThreads: 145,
    bytesRecvPerSec: 184500,
    bytesSentPerSec: 192800,
    errorBytesPerSec: 0,
    requestProcessTimeSec: 0.015,
    requestsPerSec: 6200,
    maxActiveSessionsHistory: 18000,
    rejectedSessions: 0,
    currentActiveSessions: 5200,
    maxAllowedSessions: 50000,
    createdSessionsPerSec: 42,
    cpuLoadHistory: [25, 40, 52, 60, 58, 70, 75, 80, 85, 78, 88, 90, 84, 89],
  },
  {
    id: 'tc-03',
    name: 'hologram-bill-tomcat-03',
    version: 'Apache Tomcat/10.1.18 (Java 17 LTS)',
    uptime: '65天 04小时 10分',
    startTime: '2026-09-01 18:20:00',
    ip: '10.120.30.17',
    port: 8080,
    heapTotalGB: 36,
    heapUsedGB: 16,
    heapFreeGB: 20,
    nonHeapTotalGB: 36,
    nonHeapUsedGB: 10,
    nonHeapFreeGB: 26,
    totalThreads: 22,
    activeThreads: 14,
    peakThreads: 180,
    daemonThreads: 180,
    bytesRecvPerSec: 96400,
    bytesSentPerSec: 105200,
    errorBytesPerSec: 12,
    requestProcessTimeSec: 0.035,
    requestsPerSec: 2800,
    maxActiveSessionsHistory: 8900,
    rejectedSessions: 0,
    currentActiveSessions: 2100,
    maxAllowedSessions: 50000,
    createdSessionsPerSec: 18,
    cpuLoadHistory: [15, 28, 32, 45, 50, 42, 60, 68, 72, 65, 75, 82, 80, 85],
  },
];

export const WebMiddlewareMonitorView: React.FC<Props> = ({ onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>('tc-01');

  const selectedTomcat = TOMCAT_TREE_INSTANCES.find(t => t.id === selectedId) || TOMCAT_TREE_INSTANCES[0];

  const filteredInstances = TOMCAT_TREE_INSTANCES.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ip.includes(searchTerm)
  );

  const heapUsedPercent = ((selectedTomcat.heapUsedGB / selectedTomcat.heapTotalGB) * 100).toFixed(1);
  const nonHeapUsedPercent = ((selectedTomcat.nonHeapUsedGB / selectedTomcat.nonHeapTotalGB) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="w-4 h-4" />
          </span>
          <span className="text-cyan-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">中间件监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">WEB中间件监控</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            采样时间: 2026-11-05 (近期实时)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`已针对 Tomcat 节点 [${selectedTomcat.name}] 发起 JMX 堆Dump快照捕获`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            JMX 线程快照
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新遥测"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Workspace: Left Tomcat列表 + Right Telemetry Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ========================================================================= */}
        {/* Left Column: Tomcat列表 Search & Tree Navigation */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-cyan-400" />
              Tomcat列表
            </span>
            <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {TOMCAT_TREE_INSTANCES.length} 节点
            </span>
          </div>

          {/* Search Box matching screenshot header */}
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
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Tomcat (WEB应用)</span>
            </div>

            <div className="pl-3 space-y-1">
              {filteredInstances.map((item) => (
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
            <span>JVM: Java 21 LTS</span>
            <span className="text-emerald-400">JMX 遥测正常</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column: Tomcat基础信息 + 改良版堆/非堆/线程/请求/会话/CPU负载版块 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-9 space-y-4">

          {/* Card 1: Tomcat基础信息 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                Tomcat基础信息
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                HTTP/1.1 · NIO2 线程池正常
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Tomcat版本:</span>
                <span className="text-slate-100 font-semibold">{selectedTomcat.version}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                <span className="text-slate-400 font-sans">运行时长:</span>
                <span className="text-emerald-400 font-bold">{selectedTomcat.uptime}</span>
              </div>
            </div>
          </div>

          {/* Row 2: 堆内存监控 (LED Gauge), 非堆内存监控 (Arc Ring Meter), 线程监控 (4 Metric Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* 堆内存监控 (Replaced Donut Chart with 20-Segment LED Horizontal Meter Gauge) */}
            <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <HardDrive className="w-3.5 h-3.5 text-cyan-400" />
                  堆内存监控
                </span>
                <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  使用率: {heapUsedPercent}%
                </span>
              </div>

              <div className="py-2 space-y-3">
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="text-slate-400">JVM Heap 堆内存</span>
                  <span className="text-lg font-black text-cyan-300">{selectedTomcat.heapUsedGB}G / {selectedTomcat.heapTotalGB}G</span>
                </div>

                {/* 20-segment LED horizontal bar graph gauge */}
                <div className="grid grid-cols-20 gap-1 bg-slate-950 p-2 rounded-lg border border-slate-800">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const filledCount = Math.round((selectedTomcat.heapUsedGB / selectedTomcat.heapTotalGB) * 20);
                    const isFilled = i < filledCount;
                    return (
                      <div
                        key={i}
                        className={`h-6 rounded-xs transition-all duration-300 ${
                          isFilled
                            ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                            : 'bg-slate-800/60'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>内存:{selectedTomcat.heapTotalGB}G</span>
                  <span>使用内存:{selectedTomcat.heapUsedGB}G</span>
                  <span>空闲内存:{selectedTomcat.heapFreeGB}G</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                <span>G1GC 垃圾回收时延: 8.2ms</span>
                <span className="text-emerald-400">零频繁 Full GC</span>
              </div>
            </div>

            {/* 非堆内存监控 (Replaced Donut Chart with Concentric Dual-Ring Arc Gauge) */}
            <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-400" />
                  非堆内存监控
                </span>
                <span className="text-[10px] font-mono text-blue-300 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  Metaspace
                </span>
              </div>

              <div className="py-2 flex items-center justify-around">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="38" fill="transparent"
                      stroke="#3b82f6" strokeWidth="10"
                      strokeDasharray="238.76"
                      strokeDashoffset={`${238.76 * (1 - selectedTomcat.nonHeapUsedGB / selectedTomcat.nonHeapTotalGB)}`}
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute text-center select-none">
                    <span className="text-xl font-black font-mono text-blue-300">{selectedTomcat.nonHeapUsedGB}G</span>
                    <span className="text-[9px] text-slate-400 block font-mono">已用非堆</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">内存:</span>
                    <span className="text-slate-100 font-bold">{selectedTomcat.nonHeapTotalGB}G</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 space-y-0.5">
                    <span className="text-[10px] text-slate-500 block">使用内存 / 空闲:</span>
                    <span className="text-blue-300 font-bold">{selectedTomcat.nonHeapUsedGB}G / {selectedTomcat.nonHeapFreeGB}G</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                <span>元空间加载类: 14,820</span>
                <span className="text-emerald-400">Class 结构稳定</span>
              </div>
            </div>

            {/* 线程监控 (4 Distinct Telemetry Big-Number Cards) */}
            <div className="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  线程监控
                </span>
                <span className="text-[10px] font-mono text-purple-300 px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                  NIO Worker
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center font-mono py-1">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">总开启线程数(个)</span>
                  <span className="text-2xl font-black text-cyan-300 mt-1 block">{selectedTomcat.totalThreads}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">活动线程数(个)</span>
                  <span className="text-2xl font-black text-emerald-400 mt-1 block">{selectedTomcat.activeThreads}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">线程峰值总数(个)</span>
                  <span className="text-2xl font-black text-blue-300 mt-1 block">{selectedTomcat.peakThreads}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-sans">守护线程数(个)</span>
                  <span className="text-2xl font-black text-purple-300 mt-1 block">{selectedTomcat.daemonThreads}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/60 flex justify-between">
                <span>最大线程数: 200</span>
                <span className="text-emerald-400">无死锁预警</span>
              </div>
            </div>

          </div>

          {/* Row 3: 请求 (HTTP Request Metrics) & 会话 (HTTP Session Metrics) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* 请求 */}
            <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <ArrowDownLeft className="w-3.5 h-3.5 text-cyan-400" />
                  请求 (HTTP Traffic Metrics)
                </span>
                <span className="text-[10px] font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  {selectedTomcat.requestsPerSec.toLocaleString()} req/s
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono py-1">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">每秒接收字节(Byte):</span>
                  <span className="text-lg font-bold text-cyan-300 mt-1 block">{selectedTomcat.bytesRecvPerSec.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">每秒发送字节(Byte):</span>
                  <span className="text-lg font-bold text-emerald-400 mt-1 block">{selectedTomcat.bytesSentPerSec.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">每秒错误数(Byte):</span>
                  <span className="text-lg font-bold text-slate-300 mt-1 block">{selectedTomcat.errorBytesPerSec}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">请求处理时间(S):</span>
                  <span className="text-lg font-bold text-amber-300 mt-1 block">{selectedTomcat.requestProcessTimeSec} s</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono flex justify-between items-center">
                <span className="text-slate-400 font-sans">每秒请求数:</span>
                <span className="text-cyan-300 font-bold text-base">{selectedTomcat.requestsPerSec.toLocaleString()} req/s</span>
              </div>
            </div>

            {/* 会话 */}
            <div className="md:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  会话 (HTTP Session Manager)
                </span>
                <span className="text-[10px] font-mono text-blue-300 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  StandardManager
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono py-1">
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">历史最大活动会话数:</span>
                  <span className="text-lg font-bold text-blue-300 mt-1 block">{selectedTomcat.maxActiveSessionsHistory.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">被拒绝的会话数:</span>
                  <span className="text-lg font-bold text-emerald-400 mt-1 block">{selectedTomcat.rejectedSessions}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">当前活动会话数:</span>
                  <span className="text-lg font-bold text-cyan-300 mt-1 block">{selectedTomcat.currentActiveSessions.toLocaleString()}</span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-sans">最大允许的会话数量:</span>
                  <span className="text-lg font-bold text-purple-300 mt-1 block">{selectedTomcat.maxAllowedSessions.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono flex justify-between items-center">
                <span className="text-slate-400 font-sans">每秒创建会话数:</span>
                <span className="text-blue-300 font-bold text-base">{selectedTomcat.createdSessionsPerSec} session/s</span>
              </div>
            </div>

          </div>

          {/* Row 4: 进程CPU负载 (Replaced Line Graph with 14-Bar Vertical Column Spectrum Histogram) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                进程CPU负载 (Process CPU Load Column Spectrum)
              </span>
              <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                实时峰值: {Math.max(...selectedTomcat.cpuLoadHistory)}%
              </span>
            </div>

            {/* Vertical Multi-Column Histogram Spectrum Chart replacing line chart */}
            <div className="h-36 w-full bg-slate-950 rounded-lg p-3 border border-slate-800 relative flex items-end justify-between gap-2">
              {/* Background Grid Lines (0% to 100%) */}
              <div className="absolute inset-x-3 top-3 bottom-6 flex flex-col justify-between pointer-events-none opacity-25">
                <div className="border-b border-slate-700 border-dashed w-full" />
                <div className="border-b border-slate-700 border-dashed w-full" />
                <div className="border-b border-slate-700 border-dashed w-full" />
                <div className="border-b border-slate-700 border-dashed w-full" />
              </div>

              {selectedTomcat.cpuLoadHistory.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                  <span className="text-[9px] font-mono text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity mb-0.5">
                    {val}%
                  </span>
                  <div
                    style={{ height: `${val}%` }}
                    className="w-full bg-gradient-to-t from-amber-600/80 via-amber-500 to-yellow-400 rounded-t-sm transition-all duration-300 relative group-hover:brightness-125"
                  >
                    <div className="w-full h-1 bg-amber-200 rounded-t-sm shadow-sm shadow-amber-200/80" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 mt-1">{i}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
              <span>时间序列: 0 到 13 采样点</span>
              <span className="text-amber-400">cgroup CPU 配额充沛</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
