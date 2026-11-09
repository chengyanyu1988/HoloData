import React, { useState } from 'react';
import {
  Layers, BarChart3, ChevronRight, DownloadCloud, RefreshCw,
  CheckCircle2, AlertTriangle, Zap, Server, ShieldCheck,
  TrendingUp, Activity, MessageSquare, Database, Globe, Cpu,
  HardDrive, Sliders, ArrowUpRight, Radio, Bell
} from 'lucide-react';

interface Props {
  onRefresh?: () => void;
}

type TimeRangeKey = '1h' | '6h' | '24h' | '7d';

interface MiddlewareCategoryData {
  id: string;
  name: string;
  enTag: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  borderHover: string;
  stackText: string;
  baseParams: {
    clusterScale: string;
    protocol: string;
    deployment: string;
    extraNote: string;
  };
  deviceConfig: {
    cpuRam: string;
    storageMem: string;
    highAvailability: string;
    extraPolicy: string;
  };
  baseNormal: number;
  baseAbnormal: number;
  baseAlarmL1: number; // 一级 (P0 Critical)
  baseAlarmL2: number; // 二级 (P1 Warning)
  baseAlarmL3: number; // 三级 (P2 Info)
  avgQps: number;
  slaPercent: number;
}

const MW_CATEGORIES: MiddlewareCategoryData[] = [
  {
    id: 'web_mw',
    name: 'WEB中间件',
    enTag: 'WEB GATEWAY & APPLICATION SERVER',
    icon: Globe,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-cyan-500/40',
    stackText: 'Nginx 1.26 + K8s Ingress + Tomcat 10.1',
    baseParams: {
      clusterScale: '12 个 Pod/VM 节点',
      protocol: 'HTTP/2, HTTP/3 (QUIC), WebSocket',
      deployment: 'Kubernetes Ingress + AutoScaler',
      extraNote: 'SSL 证书硬件加密解密路由',
    },
    deviceConfig: {
      cpuRam: '8核 CPU / 16GB RAM 每节点',
      storageMem: 'JVM Heap 36GB / Metaspace 2GB',
      highAvailability: 'Nginx Keepalived 双主高可用',
      extraPolicy: '连接池 10,000 / 动态心跳监测',
    },
    baseNormal: 12,
    baseAbnormal: 0,
    baseAlarmL1: 0,
    baseAlarmL2: 1,
    baseAlarmL3: 4,
    avgQps: 24800,
    slaPercent: 99.99,
  },
  {
    id: 'msg_mw',
    name: '消息中间件',
    enTag: 'DISTRIBUTED MESSAGE QUEUE & EVENT STREAMING',
    icon: MessageSquare,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-blue-500/40',
    stackText: 'Apache Kafka 3.7.0 + RocketMQ 5.2.0',
    baseParams: {
      clusterScale: '8 个 Broker 节点 (3 Controller)',
      protocol: 'Kafka Binary Protocol / gRPC API',
      deployment: 'KRaft 无 ZooKeeper 依赖架构',
      extraNote: '48 个 Active Topics / 256 分区',
    },
    deviceConfig: {
      cpuRam: '16核 CPU / 64GB RAM 每节点',
      storageMem: '3.2TB NVMe SSD 高速落盘存储',
      highAvailability: 'ISR 副本因子 = 3, min.insync=2',
      extraPolicy: 'ACK=all (-1) 零丢失级别刷盘',
    },
    baseNormal: 8,
    baseAbnormal: 0,
    baseAlarmL1: 0,
    baseAlarmL2: 2,
    baseAlarmL3: 6,
    avgQps: 185000,
    slaPercent: 99.98,
  },
  {
    id: 'cache_mw',
    name: '缓存中间件',
    enTag: 'DISTRIBUTED MEMORY CACHE & DATA GRID',
    icon: Zap,
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/10 via-slate-900 to-slate-950',
    borderHover: 'hover:border-purple-500/40',
    stackText: 'Redis 7.2.4 Cluster (3 Master + 3 Slave)',
    baseParams: {
      clusterScale: '6 个分片节点 (16384 哈希槽)',
      protocol: 'RESP3 高效二进制序列化协议',
      deployment: 'Redis Cluster 自动故障转移',
      extraNote: '8,450,000 总 Key / 命中率 99.85%',
    },
    deviceConfig: {
      cpuRam: '16核 CPU / 36GB 专属内存每节点',
      storageMem: 'MAXMEMORY 36GB (volatile-lru)',
      highAvailability: 'Sentinel 哨兵自动主从仲裁切换',
      extraPolicy: 'RDB 快照 + AOF everysec 双持久化',
    },
    baseNormal: 6,
    baseAbnormal: 0,
    baseAlarmL1: 0,
    baseAlarmL2: 0,
    baseAlarmL3: 3,
    avgQps: 142000,
    slaPercent: 100.0,
  },
];

export const MiddlewareMonitorStatsView: React.FC<Props> = ({ onRefresh }) => {
  const [timeRange, setTimeRange] = useState<TimeRangeKey>('24h');

  // Multiplier mapping for dynamic recalculation
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

  // Compute total nodes across all 3 middleware categories
  const totalNodes = MW_CATEGORIES.reduce((acc, cat) => acc + cat.baseNormal + cat.baseAbnormal, 0);
  const totalNormalNodes = MW_CATEGORIES.reduce((acc, cat) => acc + cat.baseNormal, 0);
  const totalQps = MW_CATEGORIES.reduce((acc, cat) => acc + Math.round(cat.avgQps * (0.9 + multiplier * 0.05)), 0);

  return (
    <div className="space-y-5">
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-5 py-3.5 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-2.5 text-xs font-medium text-slate-300">
          <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <BarChart3 className="w-4.5 h-4.5" />
          </span>
          <span className="text-indigo-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">中间件监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">监控统计</span>
          <span className="ml-2 text-[11px] font-mono px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {dateStr} ({rangeLabel})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-mono">
            {(['1h', '6h', '24h', '7d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3.5 py-1 rounded-md transition-all ${
                  timeRange === r
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '1h' ? '1小时' : r === '6h' ? '6小时' : r === '24h' ? '24小时' : '近7天'}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('已生成中间件监控统计 SLA、状态分布与告警收敛报表并导出！')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors border border-slate-700/60"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-indigo-400" />
            导出报表
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
              title="刷新统计数据"
            >
              <RefreshCw className="w-4 h-4 text-indigo-400" />
            </button>
          )}
        </div>
      </div>

      {/* Top Overview Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">中间件集群节点数</span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1 flex items-baseline gap-1">
              {totalNodes} <span className="text-xs font-normal text-slate-400">节点在线</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">
              100% 健康正常运行 ({totalNormalNodes}/{totalNodes})
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">集群实时吞吐 QPS</span>
            <div className="text-2xl font-black font-mono text-blue-400 mt-1 flex items-baseline gap-1">
              {(totalQps / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-400">req/s</span>
            </div>
            <span className="text-[11px] text-indigo-300 font-mono mt-0.5 block">
              Kafka 与 Redis 承载 93% 流量
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">中间件服务 SLA 可用度</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1 flex items-baseline gap-1">
              99.99% <span className="text-xs font-normal text-slate-400">高可用</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              全链路主从 HA + 无单点故障
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">统计周期内告警总数</span>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1 flex items-baseline gap-1">
              {Math.round(17 * multiplier)} <span className="text-xs font-normal text-slate-400">条事件</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              P0重大告警 0 条 (全量收敛)
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main 3 Component Cards (WEB中间件, 消息中间件, 缓存中间件) */}
      <div className="space-y-6">
        {MW_CATEGORIES.map((cat) => {
          const IconComp = cat.icon;
          const normalCount = cat.baseNormal;
          const abnormalCount = cat.baseAbnormal;
          const totalCatNodes = normalCount + abnormalCount;
          const normalPct = Math.round((normalCount / totalCatNodes) * 100);
          const abnormalPct = 100 - normalPct;

          // Scaled alarm counts based on time range
          const l1Count = Math.round(cat.baseAlarmL1 * multiplier);
          const l2Count = Math.round(cat.baseAlarmL2 * multiplier);
          const l3Count = Math.round(cat.baseAlarmL3 * multiplier);
          const catTotalAlarms = l1Count + l2Count + l3Count;

          // Alarm max bar scale
          const maxAlarmVal = Math.max(l1Count, l2Count, l3Count, 1);

          return (
            <div
              key={cat.id}
              className={`bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-md transition-all duration-300 ${cat.borderHover} relative overflow-hidden`}
            >
              {/* Card Header Tag */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.bgGradient} border border-slate-700/60 flex items-center justify-center shadow-inner`}>
                    <IconComp className={`w-6 h-6 ${cat.color}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-100">{cat.name}</h3>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 ${cat.color}`}>
                        {cat.enTag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      技术栈: <span className="text-slate-200 font-sans">{cat.stackText}</span>
                    </p>
                  </div>
                </div>

                {/* Sub-Header Metrics Pills */}
                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">平均 QPS: </span>
                    <span className={`font-bold ${cat.color}`}>
                      {Math.round(cat.avgQps * (0.9 + multiplier * 0.05)).toLocaleString()} /s
                    </span>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400">SLA 可用度: </span>
                    <span className="font-bold text-emerald-400">{cat.slaPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Card Body - 3-Column Layout: [1]系统基础参数 & 设备配置 [2] 正常/异常 (新图表) [3] 告警级别统计 (新图表) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-5 items-stretch">
                
                {/* Column 1 (lg:col-span-4): 保留并美化的「系统基础参数」与「设备配置」 */}
                <div className="lg:col-span-4 space-y-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  {/* 系统基础参数 Section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80 text-cyan-400 text-xs font-bold">
                      <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                      <span>系统基础参数</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">集群规模:</span>
                        <span className="font-mono text-slate-200">{cat.baseParams.clusterScale}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">通信协议:</span>
                        <span className="font-mono text-slate-200">{cat.baseParams.protocol}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">部署架构:</span>
                        <span className="font-mono text-indigo-300">{cat.baseParams.deployment}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">特性说明:</span>
                        <span className="font-mono text-slate-400 text-[11px]">{cat.baseParams.extraNote}</span>
                      </div>
                    </div>
                  </div>

                  {/* 设备配置 Section */}
                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center gap-2 pb-1.5 border-b border-slate-800/80 text-indigo-400 text-xs font-bold">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                      <span>设备配置</span>
                    </div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">硬件资源:</span>
                        <span className="font-mono text-slate-200">{cat.deviceConfig.cpuRam}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">内存/存储:</span>
                        <span className="font-mono text-slate-200">{cat.deviceConfig.storageMem}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">高可用 HA:</span>
                        <span className="font-mono text-emerald-400">{cat.deviceConfig.highAvailability}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span className="text-slate-400">策略参数:</span>
                        <span className="font-mono text-slate-400 text-[11px]">{cat.deviceConfig.extraPolicy}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 (lg:col-span-4): 新状态统计图表 (替换原平淡横向柱状图) - 20-Segment LED 音量柱 + 环形百分比 */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Activity className="w-3.5 h-3.5 text-emerald-400" />
                      <span>状态统计 (集群节点健康度)</span>
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
                    <span>总监测节点: {totalCatNodes}</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      运行良好
                    </span>
                  </div>
                </div>

                {/* Column 3 (lg:col-span-4): 新告警级别统计图表 (替换原平淡横向柱状图) - 3阶发光频谱直方图 (一级/二级/三级) */}
                <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80 text-xs font-bold">
                    <div className="flex items-center gap-2 text-slate-200">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      <span>告警级别统计 (告警分级分布)</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                      告警总数 {catTotalAlarms} 条
                    </span>
                  </div>

                  {/* Vertical Segmented Alarm Spectrum Bars for 一级, 二级, 三级 */}
                  <div className="my-auto py-2 space-y-3">
                    {/* 一级 (P0 Critical) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-rose-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-xs bg-rose-500" />
                          一级 (P0 重大)
                        </span>
                        <span className={`font-bold ${l1Count > 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                          {l1Count} 次
                        </span>
                      </div>
                      <div className="h-3.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-rose-600 via-rose-500 to-red-400 shadow-[0_0_10px_rgba(244,63,94,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((l1Count / maxAlarmVal) * 100, l1Count > 0 ? 8 : 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* 二级 (P1 Warning) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-xs bg-amber-500" />
                          二级 (P1 警告)
                        </span>
                        <span className={`font-bold ${l2Count > 0 ? 'text-amber-300' : 'text-slate-500'}`}>
                          {l2Count} 次
                        </span>
                      </div>
                      <div className="h-3.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((l2Count / maxAlarmVal) * 100, l2Count > 0 ? 12 : 0)}%` }}
                        />
                      </div>
                    </div>

                    {/* 三级 (P2 Info) */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-cyan-400 font-bold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-xs bg-cyan-500" />
                          三级 (P2 提示)
                        </span>
                        <span className={`font-bold ${l3Count > 0 ? 'text-cyan-300' : 'text-slate-500'}`}>
                          {l3Count} 次
                        </span>
                      </div>
                      <div className="h-3.5 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex">
                        <div
                          className="h-full rounded-xs bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-400 shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all duration-500"
                          style={{ width: `${Math.max((l3Count / maxAlarmVal) * 100, l3Count > 0 ? 15 : 0)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer note for Alarm Level */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>收敛级别: 自动过滤重复扰动</span>
                    <span className="text-slate-300">告警源: Prometheus / Exporter</span>
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
