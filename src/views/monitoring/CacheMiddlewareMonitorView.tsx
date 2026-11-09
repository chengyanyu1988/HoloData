import React, { useState } from 'react';
import {
  Database, RefreshCw, Search, CheckCircle2, AlertTriangle,
  Zap, HardDrive, Cpu, ShieldCheck, Activity, Flame, Layers,
  ChevronRight, Server, Users, ArrowUpRight, ArrowDownLeft, Clock
} from 'lucide-react';

interface Props {
  onRefresh?: () => void;
}

interface RedisClusterInstance {
  id: string;
  name: string;
  version: string;
  mode: 'standalone' | 'cluster' | 'sentinel';
  eventMechanism: string;
  port: number;
  uptime: string;
  startTime: string;
  ip: string;
  connectedClients: number;
  maxInputClients: number;
  blockedClients: number;
  clientConnectionsTable: {
    id: number;
    client: string;
    ip: string;
    validTime: string;
  }[];
  memTotalGB: number; // 36
  memUsedGB: number; // 8
  memAllocatedGB: number; // 8
  peakMemHistory: number[]; // 12 points
  evictionPolicy: string; // 内存使用过高 删除旧数据! (volatile-lru)
  fragmentationPercent: number; // 30%
  // 10 General Statistics Metric Badges
  totalConnectionsSinceBoot: number; // 45
  totalCommandsSinceBoot: number; // 45
  opsPerSec: number; // 45
  rejectedConnections: number; // 45
  expiredKeysSinceBoot: number; // 45
  evictedKeysSinceBoot: number; // 45
  keyspaceHits: number; // 45
  keyspaceMisses: number; // 45
  netInputKps: number; // 45
  netOutputKps: number; // 45
}

const REDIS_TREE_INSTANCES: RedisClusterInstance[] = [
  {
    id: 'rds-01',
    name: 'redis-standalone-master-01',
    version: 'Redis 7.2.4 (x86_64)',
    mode: 'standalone',
    eventMechanism: 'epoll (Linux 6.6.21-hologram-rt)',
    port: 6379,
    uptime: '142天 08小时 30分',
    startTime: '2026-06-16 14:00:00',
    ip: '192.168.1.105',
    connectedClients: 50,
    maxInputClients: 50,
    blockedClients: 0,
    clientConnectionsTable: [
      { id: 1, client: 'admin', ip: '192.168.1.105', validTime: '01:59:01' },
      { id: 2, client: 'none', ip: '192.168.1.105', validTime: '01:59:01' },
      { id: 3, client: 'gxxzl', ip: '192.168.1.105', validTime: '01:59:01' },
    ],
    memTotalGB: 36,
    memUsedGB: 8,
    memAllocatedGB: 8,
    peakMemHistory: [14, 28, 42, 58, 62, 50, 75, 84, 90, 82, 88, 95],
    evictionPolicy: '内存使用过高 删除旧数据! (volatile-lru)',
    fragmentationPercent: 30,
    totalConnectionsSinceBoot: 45200,
    totalCommandsSinceBoot: 1280000,
    opsPerSec: 48500,
    rejectedConnections: 0,
    expiredKeysSinceBoot: 125000,
    evictedKeysSinceBoot: 3200,
    keyspaceHits: 2480000,
    keyspaceMisses: 3800,
    netInputKps: 128.4,
    netOutputKps: 192.6,
  },
  {
    id: 'rds-02',
    name: 'redis-cluster-shard-02',
    version: 'Redis 7.2.4 (Cluster Node)',
    mode: 'cluster',
    eventMechanism: 'epoll (Linux 6.6.21-hologram-rt)',
    port: 6380,
    uptime: '98天 14小时 20分',
    startTime: '2026-07-30 09:15:00',
    ip: '192.168.1.106',
    connectedClients: 85,
    maxInputClients: 85,
    blockedClients: 0,
    clientConnectionsTable: [
      { id: 1, client: 'hologram-etl', ip: '192.168.1.106', validTime: '03:12:45' },
      { id: 2, client: 'auth-service', ip: '192.168.1.106', validTime: '02:40:12' },
      { id: 3, client: 'gateway-node', ip: '192.168.1.106', validTime: '01:22:08' },
    ],
    memTotalGB: 36,
    memUsedGB: 14,
    memAllocatedGB: 14,
    peakMemHistory: [20, 35, 50, 65, 78, 85, 92, 88, 96, 90, 94, 98],
    evictionPolicy: '内存使用过高 删除旧数据! (allkeys-lru)',
    fragmentationPercent: 24,
    totalConnectionsSinceBoot: 62400,
    totalCommandsSinceBoot: 1850000,
    opsPerSec: 52100,
    rejectedConnections: 0,
    expiredKeysSinceBoot: 198000,
    evictedKeysSinceBoot: 4100,
    keyspaceHits: 3120000,
    keyspaceMisses: 4200,
    netInputKps: 184.2,
    netOutputKps: 245.8,
  },
  {
    id: 'rds-03',
    name: 'redis-sentinel-node-03',
    version: 'Redis 7.2.4 (Sentinel Sentinel)',
    mode: 'sentinel',
    eventMechanism: 'epoll (Linux 6.6.21-hologram-rt)',
    port: 26379,
    uptime: '210天 10小时 00分',
    startTime: '2026-04-09 13:00:00',
    ip: '192.168.1.107',
    connectedClients: 24,
    maxInputClients: 24,
    blockedClients: 0,
    clientConnectionsTable: [
      { id: 1, client: 'sentinel-mon-1', ip: '192.168.1.107', validTime: '12:00:00' },
      { id: 2, client: 'sentinel-mon-2', ip: '192.168.1.107', validTime: '12:00:00' },
      { id: 3, client: 'sentinel-mon-3', ip: '192.168.1.107', validTime: '12:00:00' },
    ],
    memTotalGB: 36,
    memUsedGB: 4,
    memAllocatedGB: 4,
    peakMemHistory: [10, 15, 18, 22, 25, 20, 28, 30, 32, 29, 31, 35],
    evictionPolicy: 'noeviction',
    fragmentationPercent: 12,
    totalConnectionsSinceBoot: 12800,
    totalCommandsSinceBoot: 340000,
    opsPerSec: 12400,
    rejectedConnections: 0,
    expiredKeysSinceBoot: 15000,
    evictedKeysSinceBoot: 0,
    keyspaceHits: 890000,
    keyspaceMisses: 120,
    netInputKps: 45.0,
    netOutputKps: 62.5,
  },
];

export const CacheMiddlewareMonitorView: React.FC<Props> = ({ onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>('rds-01');

  const selectedRedis = REDIS_TREE_INSTANCES.find(r => r.id === selectedId) || REDIS_TREE_INSTANCES[0];

  const filteredInstances = REDIS_TREE_INSTANCES.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ip.includes(searchTerm)
  );

  const memUsedPercent = ((selectedRedis.memUsedGB / selectedRedis.memTotalGB) * 100).toFixed(1);
  const memFreeGB = selectedRedis.memTotalGB - selectedRedis.memUsedGB;
  const memFreePercent = (100 - parseFloat(memUsedPercent)).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Zap className="w-4 h-4" />
          </span>
          <span className="text-purple-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">中间件监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">缓存中间件监控</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            采样时间: 2026-11-05 (近期实时)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`已对 Redis 节点 [${selectedRedis.name}] 执行内存清理与 Defrag 碎图片整理`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors font-mono"
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            内存 Purge
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-4 h-4 text-purple-400" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Workspace: Left 缓存监控列表 + Right Telemetry Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ========================================================================= */}
        {/* Left Column: 缓存监控列表 Search & Tree Navigation */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-400" />
              缓存监控列表
            </span>
            <span className="text-[10px] font-mono text-purple-400 px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
              {REDIS_TREE_INSTANCES.length} 节点
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
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
            />
          </div>

          {/* Tree Nodes List */}
          <div className="space-y-1 font-mono text-xs pt-1">
            <div className="text-[11px] text-slate-400 px-2 py-1 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>缓存监控 (Redis / Memcached)</span>
            </div>

            <div className="pl-3 space-y-1">
              {filteredInstances.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                    selectedId === item.id
                      ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-xs font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full ${selectedId === item.id ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${selectedId === item.id ? 'text-purple-300' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/80 flex justify-between">
            <span>碎片率: {selectedRedis.fragmentationPercent}%</span>
            <span className="text-emerald-400">内存无过热</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column: 基本信息 | 客户端连接 | 内存消耗信息 | 一般统计 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-9 space-y-4">

          {/* Row 1: 基本信息 & 客户端连接 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* 基本信息 */}
            <div className="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-purple-400" />
                  基本信息
                </span>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  运行模式: {selectedRedis.mode}
                </span>
              </div>

              {/* Key-Value details matching exact screenshot titles */}
              <div className="space-y-2 text-xs font-mono text-slate-300 py-1">
                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-sans">版本:</span>
                  <span className="text-slate-100 font-semibold">{selectedRedis.version}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-sans">运行模式:</span>
                  <span className="text-cyan-300 font-bold uppercase">{selectedRedis.mode}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-sans">redis所使用的事件处理机制:</span>
                  <span className="text-purple-300 font-semibold">{selectedRedis.eventMechanism}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-sans">redis服务监听端口:</span>
                  <span className="text-amber-300 font-bold">{selectedRedis.port}</span>
                </div>

                <div className="flex justify-between items-center p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 font-sans">redis服务运行时间:</span>
                  <span className="text-emerald-400 font-bold">{selectedRedis.uptime}</span>
                </div>
              </div>
            </div>

            {/* 客户端连接 */}
            <div className="md:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-cyan-400" />
                  客户端连接
                </span>
                <span className="text-[10px] font-mono text-cyan-300">
                  IP: {selectedRedis.ip}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400 flex items-center justify-center gap-1">
                    <span>{selectedRedis.connectedClients}个</span>
                    <span className="text-xs text-emerald-400">↑</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans mt-1 block">已连接客户端的数量</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-cyan-300">
                    {selectedRedis.maxInputClients}
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans mt-1 block">当前客户端连接的最大输入(个)</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-2xl font-black text-rose-400 flex items-center justify-center gap-1">
                    <span>{selectedRedis.blockedClients}</span>
                    <span className="text-xs text-rose-400">↑</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans mt-1 block">被阻塞的客户端 (个)</span>
                </div>
              </div>

              {/* Table matching screenshot: 当前客户端连接的最大输出列表 */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-400 font-mono block">当前客户端连接的最大输出列表</span>
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-xs text-left font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[11px] border-b border-slate-800">
                      <tr>
                        <th className="py-1.5 px-3">编号</th>
                        <th className="py-1.5 px-3">客户端</th>
                        <th className="py-1.5 px-3">IP地址</th>
                        <th className="py-1.5 px-3">有效时间</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
                      {selectedRedis.clientConnectionsTable.map((client) => (
                        <tr key={client.id} className="hover:bg-slate-900/60">
                          <td className="py-1.5 px-3 text-cyan-300">{client.id}</td>
                          <td className="py-1.5 px-3 text-slate-200 font-semibold">{client.client}</td>
                          <td className="py-1.5 px-3 text-slate-300">{client.ip}</td>
                          <td className="py-1.5 px-3 text-emerald-400">{client.validTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: 内存消耗信息 (Replaced Donut/Line Charts with LED Meter, Concentric Ring, & Histogram Spectrum) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-purple-400" />
                内存消耗信息
              </span>
              <span className="text-xs font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                内存碎片率: {selectedRedis.fragmentationPercent}%
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1">

              {/* Chart 1: 使用内存 (Replaced Donut Chart with 20-Segment LED Volume Gauge) */}
              <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">使用内存</span>
                  <span className="text-xs font-mono text-cyan-300">
                    空闲率: {memFreePercent}% · 使用率: {memUsedPercent}%
                  </span>
                </div>

                <div className="space-y-2 py-1 font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">内存:{selectedRedis.memTotalGB}G</span>
                    <span className="text-cyan-300 font-bold">已使用:{selectedRedis.memUsedGB}G</span>
                  </div>

                  {/* 20-segment LED horizontal bar graph gauge */}
                  <div className="grid grid-cols-20 gap-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const filledCount = Math.round((selectedRedis.memUsedGB / selectedRedis.memTotalGB) * 20);
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

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-slate-700" />
                      空闲率: {memFreePercent}%
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      使用率: {memUsedPercent}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Chart 2: 系统给redis分配的内存 (Replaced Donut Chart with Concentric Dual-Ring Arc Capacity Gauge) */}
              <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">系统给redis分配的内存</span>
                  <span className="text-xs font-mono text-purple-300">
                    {selectedRedis.memAllocatedGB}G 分配
                  </span>
                </div>

                <div className="flex items-center justify-around py-1 font-mono">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="38" fill="transparent"
                        stroke="#a855f7" strokeWidth="10"
                        strokeDasharray="238.76"
                        strokeDashoffset={`${238.76 * (1 - selectedRedis.memAllocatedGB / selectedRedis.memTotalGB)}`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute text-center select-none">
                      <span className="text-lg font-black text-purple-300">{selectedRedis.memAllocatedGB}G</span>
                      <span className="text-[9px] text-slate-400 block font-mono">redis分配内存</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">系统已分配:</span>
                      <span className="text-purple-300 font-bold">{selectedRedis.memAllocatedGB} GB</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-500 block">内存上限:</span>
                      <span className="text-slate-100 font-bold">{selectedRedis.memTotalGB} GB</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart 3: 内存使用的峰值 (Replaced Line Chart with 12-Bar Vertical Spectrum Histogram Chart) */}
              <div className="md:col-span-4 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">内存使用的峰值</span>
                  <span className="text-xs font-mono text-amber-300">
                    峰值: {Math.max(...selectedRedis.peakMemHistory)} MB/s
                  </span>
                </div>

                <div className="h-24 w-full bg-slate-900 rounded-lg p-2 border border-slate-800 relative flex items-end justify-between gap-1">
                  {selectedRedis.peakMemHistory.map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                      <div
                        style={{ height: `${val}%` }}
                        className="w-full bg-gradient-to-t from-amber-600/80 via-amber-500 to-yellow-400 rounded-t-sm transition-all duration-300 relative group-hover:brightness-125"
                      >
                        <div className="w-full h-1 bg-amber-200 rounded-t-sm shadow-sm" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>采样序列 1..12</span>
                  <span className="text-amber-400">峰值平稳</span>
                </div>
              </div>

            </div>

            {/* Sub Row: 达到最大内存配置值后的策略 & 内存碎片率 Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-800">
              {/* 达到最大内存配置值后的策略 */}
              <div className="md:col-span-6 p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-xs text-slate-400 font-sans">达到最大内存配置值后的策略:</span>
                <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20">
                  {selectedRedis.evictionPolicy}
                </span>
              </div>

              {/* 内存碎片率 Bar matching screenshot (30% 赤色高亮) */}
              <div className="md:col-span-6 p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between font-mono">
                <span className="text-xs text-slate-400 font-sans">内存碎片率:</span>
                <div className="flex items-center gap-3">
                  <div className="w-36 bg-slate-900 h-4 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                    <div className="bg-cyan-500 h-full" style={{ width: '70%' }} title="总内存量" />
                    <div className="bg-rose-500 h-full" style={{ width: '30%' }} title="碎片内存率" />
                  </div>
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/15 px-2 py-0.5 rounded border border-rose-500/30">
                    {selectedRedis.fragmentationPercent}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: 一般统计 (10 Big Telemetry Metric Cards matching exact screenshot titles) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                一般统计 (General Redis Performance Counters)
              </span>
              <span className="text-[10px] font-mono text-emerald-400">
                10 项核心遥测计数器
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-center">
              {/* Card 1 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.totalConnectionsSinceBoot.toLocaleString()}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  自启动起连接过的总数
                </span>
              </div>

              {/* Card 2 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{(selectedRedis.totalCommandsSinceBoot / 10000).toFixed(1)}万</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  自启动起运行命令的总数
                </span>
              </div>

              {/* Card 3 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.opsPerSec.toLocaleString()}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  每秒执行的命令个数
                </span>
              </div>

              {/* Card 4 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.rejectedConnections}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  被拒绝连接个数
                </span>
              </div>

              {/* Card 5 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{(selectedRedis.expiredKeysSinceBoot / 10000).toFixed(1)}万</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  自启动起过期的KEY的总数
                </span>
              </div>

              {/* Card 6 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.evictedKeysSinceBoot.toLocaleString()}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  因内存大小限制而被剔除的KEY数量
                </span>
              </div>

              {/* Card 7 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{(selectedRedis.keyspaceHits / 10000).toFixed(1)}万</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  在main dictionary (todo)中成功查到的key个数
                </span>
              </div>

              {/* Card 8 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.keyspaceMisses.toLocaleString()}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  在main dictionary (todo)中未查到的key个数
                </span>
              </div>

              {/* Card 9 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.netInputKps}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  redis网络入口kps
                </span>
              </div>

              {/* Card 10 */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300 flex items-center justify-center gap-1">
                  <span>{selectedRedis.netOutputKps}</span>
                  <span className="text-xs text-cyan-400">↑</span>
                </div>
                <span className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  redis网络出口kps
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
