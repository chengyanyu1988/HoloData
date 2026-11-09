import React, { useState } from 'react';
import {
  Database, BarChart3, ChevronRight, DownloadCloud, RefreshCw,
  CheckCircle2, AlertTriangle, Zap, HardDrive, Cpu, ShieldCheck,
  TrendingUp, Activity, Flame, Clock, Layers, Search, Calendar,
  Sliders, Bell, Check, Filter
} from 'lucide-react';

interface Props {
  onRefresh?: () => void;
}

type TimeRangeKey = '1h' | '6h' | '24h' | '7d';

interface DbClusterStatItem {
  id: string;
  name: string;
  engineTag: string; // 'MySQL' | 'ClickHouse' | 'PostgreSQL' | 'Redis'
  color: string;
  bgGradient: string;
  borderHover: string;
  dbInfo: {
    engineVersion: string;
    nodesCount: string;
    storageSize: string;
    haStatus: string;
  };
  testInfo: {
    hardwareSpec: string;
    replicationType: string;
    backupPolicy: string;
    extraNote: string;
  };
  // Scalable base counts
  baseNormal: number;
  baseAbnormal: number;
  // 5 Alarm Levels from Screenshot (重大, 严重, 一般, 轻微, 消息)
  baseAlarmCritical: number; // 重大 (P0)
  baseAlarmMajor: number;    // 严重 (P1)
  baseAlarmWarning: number;  // 一般 (P2)
  baseAlarmMinor: number;    // 轻微 (P3)
  baseAlarmInfo: number;     // 消息 (P4)
  avgQps: number;
  avgLatencyMs: number;
}

const DB_CLUSTER_STATS: DbClusterStatItem[] = [
  {
    id: 'db-mysql-prod',
    name: 'MySQL 核心业务交易库 (sys_orders_master)',
    engineTag: 'MySQL 8.0',
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-cyan-500/40',
    dbInfo: {
      engineVersion: 'MySQL 8.0.36-28 Enterprise (InnoDB)',
      nodesCount: '3 节点 (1主 2从)',
      storageSize: '3.2 TB SSD',
      haStatus: 'GTID 半同步复制 + Orchestrator 仲裁',
    },
    testInfo: {
      hardwareSpec: '16核 CPU / 64GB RAM 每节点',
      replicationType: 'Semi-Sync Replication (延迟 0ms)',
      backupPolicy: '每日 03:00 全量 XtraBackup + 实时 Binlog 归档',
      extraNote: 'Buffer Pool 48GB / 线程池并发 1024',
    },
    baseNormal: 3,
    baseAbnormal: 0,
    baseAlarmCritical: 0,
    baseAlarmMajor: 0,
    baseAlarmWarning: 1,
    baseAlarmMinor: 3,
    baseAlarmInfo: 18,
    avgQps: 14500,
    avgLatencyMs: 1.8,
  },
  {
    id: 'db-ck-analytics',
    name: 'ClickHouse 海量分析数仓 (ck_events_lakehouse)',
    engineTag: 'ClickHouse 24.3',
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-purple-500/40',
    dbInfo: {
      engineVersion: 'ClickHouse 24.3.2 LTS (ReplicatedMergeTree)',
      nodesCount: '4 分片 8 节点',
      storageSize: '18.4 TB ZSTD',
      haStatus: 'ZooKeeper Quorum 自动元数据同步',
    },
    testInfo: {
      hardwareSpec: '32核 CPU / 128GB RAM 每节点',
      replicationType: '分布式分片向量化并行查询引擎',
      backupPolicy: '每日增量 Part 变动快照至 S3/MinIO',
      extraNote: '列式高压缩比 4.2:1 / ZSTD 压缩',
    },
    baseNormal: 4,
    baseAbnormal: 0,
    baseAlarmCritical: 0,
    baseAlarmMajor: 1,
    baseAlarmWarning: 2,
    baseAlarmMinor: 4,
    baseAlarmInfo: 24,
    avgQps: 34500,
    avgLatencyMs: 4.2,
  },
  {
    id: 'db-pg-finance',
    name: 'PostgreSQL 财务与空间元数据库 (pg_billing_db)',
    engineTag: 'PostgreSQL 16',
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-blue-500/40',
    dbInfo: {
      engineVersion: 'PostgreSQL 16.2 + TimescaleDB 扩展',
      nodesCount: '2 节点 (Patroni HA)',
      storageSize: '4.6 TB SSD',
      haStatus: 'Patroni + Raft 自动主从无缝切换',
    },
    testInfo: {
      hardwareSpec: '16核 CPU / 32GB RAM 每节点',
      replicationType: '流复制 Streaming Replication',
      backupPolicy: 'pgBackRest 每日全量 + WAL 实时归档',
      extraNote: 'PostGIS 空间几何索引加速',
    },
    baseNormal: 2,
    baseAbnormal: 0,
    baseAlarmCritical: 0,
    baseAlarmMajor: 0,
    baseAlarmWarning: 1,
    baseAlarmMinor: 2,
    baseAlarmInfo: 12,
    avgQps: 12400,
    avgLatencyMs: 2.1,
  },
  {
    id: 'db-redis-cache',
    name: 'Redis 分布式高速缓存池 (redis_cluster_prod)',
    engineTag: 'Redis 7.2',
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-emerald-500/40',
    dbInfo: {
      engineVersion: 'Redis 7.2.4 Cluster (16384 Slots)',
      nodesCount: '6 节点 (3主 3从)',
      storageSize: '216 GB 内存',
      haStatus: 'Sentinel 自动故障转移与槽重分配',
    },
    testInfo: {
      hardwareSpec: '16核 CPU / 36GB 内存每节点',
      replicationType: '主从异步复制 + 内存日志落盘',
      backupPolicy: 'RDB 自动快照 + AOF everysec 双持久化',
      extraNote: 'MAXMEMORY 36GB (volatile-lru)',
    },
    baseNormal: 6,
    baseAbnormal: 0,
    baseAlarmCritical: 0,
    baseAlarmMajor: 0,
    baseAlarmWarning: 0,
    baseAlarmMinor: 1,
    baseAlarmInfo: 35,
    avgQps: 142000,
    avgLatencyMs: 0.4,
  },
];

export const DatabaseMonitorStatsView: React.FC<Props> = ({ onRefresh }) => {
  const [searchDbName, setSearchDbName] = useState('');
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('24h');

  const getTimeMultiplier = (range: TimeRangeKey) => {
    switch (range) {
      case '1h':
        return { multiplier: 1, label: '近 1 小时', dateStr: '2026-11-05 22:30 ~ 23:30' };
      case '6h':
        return { multiplier: 2.5, label: '近 6 小时', dateStr: '2026-11-05 17:30 ~ 23:30' };
      case '24h':
        return { multiplier: 6.8, label: '近 24 小时', dateStr: '2026-11-04 23:30 ~ 2026-11-05 23:30' };
      case '7d':
        return { multiplier: 28.5, label: '近 7 天', dateStr: '2026-10-30 ~ 2026-11-05' };
    }
  };

  const { multiplier, label: rangeLabel, dateStr } = getTimeMultiplier(timeRange);

  const filteredClusters = DB_CLUSTER_STATS.filter((item) =>
    item.name.toLowerCase().includes(searchDbName.toLowerCase()) ||
    item.engineTag.toLowerCase().includes(searchDbName.toLowerCase())
  );

  const totalInstances = DB_CLUSTER_STATS.reduce((acc, c) => acc + c.baseNormal + c.baseAbnormal, 0);
  const totalNormal = DB_CLUSTER_STATS.reduce((acc, c) => acc + c.baseNormal, 0);
  const totalAlarmsAll = DB_CLUSTER_STATS.reduce((acc, c) => 
    acc + Math.round((c.baseAlarmCritical + c.baseAlarmMajor + c.baseAlarmWarning + c.baseAlarmMinor + c.baseAlarmInfo) * multiplier), 0);

  return (
    <div className="space-y-5">
      {/* Top Header Filter Bar (Reconstructed from image_6b3ce60a.png: [数据库名称] [告警时间] [搜索]) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-5 py-3.5 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Field 1: 数据库名称 */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="数据库名称"
              value={searchDbName}
              onChange={(e) => setSearchDbName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Field 2: 告警时间 Picker */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>告警时间:</span>
            <span className="text-slate-100 font-semibold">{dateStr}</span>
          </div>

          {/* Button: 搜索 */}
          <button
            onClick={() => {}}
            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-xs font-bold text-white shadow-xs transition-all flex items-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            搜索
          </button>
        </div>

        {/* Right side: Time range selector & Export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3.5 py-1 rounded-md transition-all ${
                  timeRange === r
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '1h' ? '1小时' : r === '6h' ? '6小时' : r === '24h' ? '24小时' : '近7天'}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('已生成数据库引擎 SLA、状态分布与五级告警统计报表并导出！')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700/60"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-emerald-400" />
            导出统计报表
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
              title="刷新统计数据"
            >
              <RefreshCw className="w-4 h-4 text-emerald-400" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Top Telemetry Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">数据库实例总数</span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1 flex items-baseline gap-1">
              {totalInstances} <span className="text-xs font-normal text-slate-400">个实例节点</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">
              100% 正常运行中 ({totalNormal}/{totalInstances})
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Database className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">全库实时读写 QPS</span>
            <div className="text-2xl font-black font-mono text-blue-400 mt-1 flex items-baseline gap-1">
              203.4k <span className="text-xs font-normal text-slate-400">/s</span>
            </div>
            <span className="text-[11px] text-indigo-300 font-mono mt-0.5 block">
              平均查询耗时 1.8ms
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">集群可用度 SLA</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1 flex items-baseline gap-1">
              99.999% <span className="text-xs font-normal text-slate-400">五九可用</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              主从 GTID 0 事务延迟
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">告警事件收敛总数</span>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1 flex items-baseline gap-1">
              {totalAlarmsAll} <span className="text-xs font-normal text-slate-400">条</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              重大告警 0 条 (系统稳定)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Database Cluster Telemetry Cards (Reconstructed from image_6b3ce60a.png with new chart styles) */}
      <div className="space-y-6">
        {filteredClusters.map((cluster) => {
          const normalCount = cluster.baseNormal;
          const abnormalCount = cluster.baseAbnormal;
          const totalNodes = normalCount + abnormalCount;
          const normalPct = Math.round((normalCount / totalNodes) * 100);
          const abnormalPct = 100 - normalPct;

          // Scaled 5 Alarm Levels from screenshot (重大, 严重, 一般, 轻微, 消息)
          const alarmCritical = Math.round(cluster.baseAlarmCritical * multiplier);
          const alarmMajor = Math.round(cluster.baseAlarmMajor * multiplier);
          const alarmWarning = Math.round(cluster.baseAlarmWarning * multiplier);
          const alarmMinor = Math.round(cluster.baseAlarmMinor * multiplier);
          const alarmInfo = Math.round(cluster.baseAlarmInfo * multiplier);

          const totalClusterAlarms = alarmCritical + alarmMajor + alarmWarning + alarmMinor + alarmInfo;
          const maxAlarmLevelVal = Math.max(alarmCritical, alarmMajor, alarmWarning, alarmMinor, alarmInfo, 1);

          return (
            <div
              key={cluster.id}
              className={`bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md transition-all duration-300 ${cluster.borderHover} relative overflow-hidden`}
            >
              {/* Header Title & Tags */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cluster.bgGradient} border border-slate-700/60 flex items-center justify-center shadow-inner`}>
                    <Database className={`w-6 h-6 ${cluster.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-100">{cluster.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 ${cluster.color}`}>
                        {cluster.engineTag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      引擎版本: <span className="text-slate-200 font-sans">{cluster.dbInfo.engineVersion}</span>
                    </p>
                  </div>
                </div>

                {/* Sub-Header Metrics Pills */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">平均 QPS: </span>
                    <span className={`font-bold ${cluster.color}`}>
                      {Math.round(cluster.avgQps * (0.9 + multiplier * 0.05)).toLocaleString()} /s
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">平均时延: </span>
                    <span className="font-bold text-emerald-400">{cluster.avgLatencyMs} ms</span>
                  </div>
                </div>
              </div>

              {/* Body - 3-Column Grid: [1] 数据库信息 & 测试信息 [2] 正常/异常 (新图表) [3] 5级告警统计 (新图表) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-stretch">
                
                {/* Column 1 (lg:col-span-4): 保留并美化的「数据库信息」与「测试信息」 */}
                <div className="lg:col-span-4 space-y-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  {/* 数据库信息 Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80 text-cyan-400 text-xs font-bold">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>数据库信息</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">引擎版本:</span>
                        <span className="text-slate-200 truncate max-w-[190px]" title={cluster.dbInfo.engineVersion}>
                          {cluster.dbInfo.engineVersion}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">节点规模:</span>
                        <span className="text-slate-200">{cluster.dbInfo.nodesCount}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">存储容量:</span>
                        <span className="text-emerald-400">{cluster.dbInfo.storageSize}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">高可用架构:</span>
                        <span className="text-indigo-300 text-[11px] truncate max-w-[190px]" title={cluster.dbInfo.haStatus}>
                          {cluster.dbInfo.haStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 测试信息 Section (设备配置与运行策略) */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80 text-indigo-400 text-xs font-bold">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>测试信息 (硬件配置与备份策略)</span>
                    </div>
                    <div className="space-y-1.5 text-xs font-mono">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">硬件规格:</span>
                        <span className="text-slate-200">{cluster.testInfo.hardwareSpec}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">同步机制:</span>
                        <span className="text-slate-200 truncate max-w-[190px]" title={cluster.testInfo.replicationType}>
                          {cluster.testInfo.replicationType}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">备份策略:</span>
                        <span className="text-emerald-400 text-[11px] truncate max-w-[190px]" title={cluster.testInfo.backupPolicy}>
                          {cluster.testInfo.backupPolicy}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-sans">运行参数:</span>
                        <span className="text-slate-400 text-[11px]">{cluster.testInfo.extraNote}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 (lg:col-span-4): 新状态统计图表 (替换原平淡横向柱状图) - 20-Segment LED 音量柱 */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>状态统计 (正常 vs 异常)</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      健康率 {normalPct}%
                    </span>
                  </div>

                  {/* Chart Content: Dual 20-Segment LED Meters for 正常 vs 异常 */}
                  <div className="my-auto py-3 space-y-4">
                    {/* Normal Row */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          正常节点
                        </span>
                        <span className="text-emerald-300 font-bold">
                          {normalCount} 个 <span className="text-[11px] text-slate-400 font-normal">({normalPct}%)</span>
                        </span>
                      </div>
                      {/* 20-Segment LED Meter */}
                      <div className="grid grid-cols-20 gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const active = i < Math.round((normalPct / 100) * 20);
                          return (
                            <div
                              key={i}
                              className={`h-4 rounded-xs transition-all ${
                                active
                                  ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                                  : 'bg-slate-800/40'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Abnormal Row */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-rose-400 font-bold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          异常节点
                        </span>
                        <span className="text-rose-400 font-bold">
                          {abnormalCount} 个 <span className="text-[11px] text-slate-400 font-normal">({abnormalPct}%)</span>
                        </span>
                      </div>
                      {/* 20-Segment LED Meter */}
                      <div className="grid grid-cols-20 gap-1 bg-slate-900/90 p-1.5 rounded-lg border border-slate-800">
                        {Array.from({ length: 20 }).map((_, i) => {
                          const active = i < Math.round((abnormalPct / 100) * 20);
                          return (
                            <div
                              key={i}
                              className={`h-4 rounded-xs transition-all ${
                                active
                                  ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                                  : 'bg-slate-800/40'
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Meter Footer Note */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>实例节点数: {totalNodes}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      集群健康
                    </span>
                  </div>
                </div>

                {/* Column 3 (lg:col-span-4): 新告警级别统计图表 (替换原平淡横向柱状图) - 5阶发光频谱直方图 (重大, 严重, 一般, 轻微, 消息) */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>告警级别统计 (5级告警分布)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      告警总数 {totalClusterAlarms} 条
                    </span>
                  </div>

                  {/* 5-Tier Segmented Spectrum Gradient Bars for 重大, 严重, 一般, 轻微, 消息 */}
                  <div className="my-auto py-1.5 space-y-2">
                    {/* 1. 重大 (P0 Critical) */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-rose-400 font-bold flex items-center gap-1 text-[11px]">
                          <span className="w-2 h-2 rounded-xs bg-rose-500" />
                          重大 (P0)
                        </span>
                        <span className={`font-bold text-[11px] ${alarmCritical > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                          {alarmCritical} 次
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((alarmCritical / maxAlarmLevelVal) * 100, alarmCritical > 0 ? 8 : 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* 2. 严重 (P1 Major) */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                          <span className="w-2 h-2 rounded-xs bg-amber-500" />
                          严重 (P1)
                        </span>
                        <span className={`font-bold text-[11px] ${alarmMajor > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
                          {alarmMajor} 次
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-amber-600 to-yellow-400 shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((alarmMajor / maxAlarmLevelVal) * 100, alarmMajor > 0 ? 10 : 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* 3. 一般 (P2 Warning) */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-yellow-300 font-bold flex items-center gap-1 text-[11px]">
                          <span className="w-2 h-2 rounded-xs bg-yellow-400" />
                          一般 (P2)
                        </span>
                        <span className={`font-bold text-[11px] ${alarmWarning > 0 ? 'text-yellow-300' : 'text-slate-500'}`}>
                          {alarmWarning} 次
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-yellow-600 to-lime-400 shadow-[0_0_8px_rgba(234,179,8,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((alarmWarning / maxAlarmLevelVal) * 100, alarmWarning > 0 ? 12 : 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* 4. 轻微 (P3 Minor) */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-cyan-400 font-bold flex items-center gap-1 text-[11px]">
                          <span className="w-2 h-2 rounded-xs bg-cyan-500" />
                          轻微 (P3)
                        </span>
                        <span className={`font-bold text-[11px] ${alarmMinor > 0 ? 'text-cyan-300' : 'text-slate-500'}`}>
                          {alarmMinor} 次
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-cyan-600 to-blue-400 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((alarmMinor / maxAlarmLevelVal) * 100, alarmMinor > 0 ? 14 : 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* 5. 消息 (P4 Info) */}
                    <div className="space-y-0.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-slate-400 font-bold flex items-center gap-1 text-[11px]">
                          <span className="w-2 h-2 rounded-xs bg-slate-500" />
                          消息 (P4)
                        </span>
                        <span className="font-bold text-slate-300 text-[11px]">
                          {alarmInfo} 次
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-slate-600 to-slate-400 transition-all duration-500"
                          style={{ width: `${Math.max((alarmInfo / maxAlarmLevelVal) * 100, alarmInfo > 0 ? 16 : 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer note for Alarm Level */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>自动收敛算法: 开启</span>
                    <span className="text-slate-300">告警源: Prometheus DB Exporter</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
