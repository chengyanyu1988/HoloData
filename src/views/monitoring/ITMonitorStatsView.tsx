import React, { useState } from 'react';
import { ServerNode, NetworkDevice, StorageDevice } from '../../types';
import { 
  BarChart3, Server, Network, Shield, AlertTriangle, 
  CheckCircle2, Clock, DownloadCloud, RefreshCw, FileText,
  Sliders, ChevronRight, Activity, ArrowUpRight, ArrowDownLeft,
  PieChart, Gauge, Zap, TrendingUp, Layers
} from 'lucide-react';

interface DeviceCategoryStat {
  type: '交换机' | '防火墙' | '服务器';
  count: number;
  normalCount: number;
  abnormalCount: number;
  deviceParamsSummary: string;
  deviceConfigSummary: string;
  alarms: {
    critical: number; // 重大
    severe: number;   // 严重
    normal: number;   // 一般
    minor: number;    // 轻微
    info: number;     // 消息
  };
}

export const IT_STATISTICS_DATA: DeviceCategoryStat[] = [
  {
    type: '交换机',
    count: 48,
    normalCount: 44,
    abnormalCount: 4,
    deviceParamsSummary: '400GE/100GE RoCE 无损 Fabric 全双工，总吞吐 1.6 Tbps，微秒级时延',
    deviceConfigSummary: 'BGP EVPN / VXLAN 分布式网关，LACP 8x100G MLAG 双活，PFC流控使能',
    alarms: {
      critical: 2,
      severe: 5,
      normal: 14,
      minor: 12,
      info: 28,
    },
  },
  {
    type: '防火墙',
    count: 18,
    normalCount: 16,
    abnormalCount: 2,
    deviceParamsSummary: '万兆下一代安全网关，活跃策略 1,420 条，并发连接会话 19.8 万',
    deviceConfigSummary: '入侵防御 (IPS) 实时阻断使能，白名单工业隔离网闸，反勒索感知在线',
    alarms: {
      critical: 4,
      severe: 8,
      normal: 19,
      minor: 15,
      info: 34,
    },
  },
  {
    type: '服务器',
    count: 86,
    normalCount: 79,
    abnormalCount: 7,
    deviceParamsSummary: '四路至强 Platinum 8592+ / 鲲鹏 920 信创 / NVIDIA DGX H100 液冷超算',
    deviceConfigSummary: 'CRPS 白金双电源 12V 冗余，DDR5 独立 PMIC，IPMI 2.0 带外纳管，巨页内存使能',
    alarms: {
      critical: 7,
      severe: 12,
      normal: 31,
      minor: 22,
      info: 45,
    },
  },
];

interface Props {
  servers?: ServerNode[];
  networks?: NetworkDevice[];
  storages?: StorageDevice[];
  onRefresh?: () => void;
}

export const ITMonitorStatsView: React.FC<Props> = ({
  onRefresh,
}) => {
  const [selectedType, setSelectedType] = useState<'全部' | '交换机' | '防火墙' | '服务器'>('全部');
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [modalParamDevice, setModalParamDevice] = useState<DeviceCategoryStat | null>(null);

  // Time range multiplier for dynamic alarm & health calculations
  const timeFactorMap = {
    '1h': 0.35,
    '6h': 0.65,
    '24h': 1.0,
    '7d': 2.6,
  };
  const factor = timeFactorMap[timeRange];

  // Helper to dynamically calculate stats based on selected time window
  const getScaledStat = (item: DeviceCategoryStat) => {
    const abnormal = Math.max(1, Math.round(item.abnormalCount * (0.6 + factor * 0.4)));
    const normal = Math.max(1, item.count - abnormal);
    const alarms = {
      critical: Math.max(0, Math.round(item.alarms.critical * factor)),
      severe: Math.max(1, Math.round(item.alarms.severe * factor)),
      normal: Math.max(2, Math.round(item.alarms.normal * factor)),
      minor: Math.max(2, Math.round(item.alarms.minor * factor)),
      info: Math.max(5, Math.round(item.alarms.info * factor)),
    };
    return { ...item, normalCount: normal, abnormalCount: abnormal, alarms };
  };

  const scaledDataList = IT_STATISTICS_DATA.map(getScaledStat);

  const displayList = selectedType === '全部' 
    ? scaledDataList 
    : scaledDataList.filter(d => d.type === selectedType);

  const totalCount = scaledDataList.reduce((acc, d) => acc + d.count, 0);
  const totalNormal = scaledDataList.reduce((acc, d) => acc + d.normalCount, 0);
  const totalAbnormal = scaledDataList.reduce((acc, d) => acc + d.abnormalCount, 0);
  const totalCritical = scaledDataList.reduce((acc, d) => acc + d.alarms.critical, 0);

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
          <span className="text-slate-400">IT设备监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">监控统计</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            统计周期: 2026-11-05 (近期实时)
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
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {r === '1h' ? '1小时' : r === '6h' ? '6小时' : r === '24h' ? '24小时' : '近7天'}
              </button>
            ))}
          </div>

          <button
            onClick={() => alert('已生成 IT 设备监控统计与设备配置全景报表并导出！')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-cyan-400" />
            导出报表
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新统计"
            >
              <RefreshCw className="w-4 h-4 text-cyan-400" />
            </button>
          )}
        </div>
      </div>

      {/* Top Level Summary Cards (KPI Header) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">IT 纳管设备总数</span>
            <div className="text-2xl font-black font-mono text-cyan-300 mt-1">
              {totalCount} <span className="text-xs font-normal text-slate-400">台</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">交换机48 + 防火墙18 + 服务器86</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Server className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">正常运行健康设备</span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              {totalNormal} <span className="text-xs font-normal text-slate-400">台</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">全网健康率 {((totalNormal / totalCount) * 100).toFixed(1)}% (优)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">异常/关注状态设备</span>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1">
              {totalAbnormal} <span className="text-xs font-normal text-slate-400">台</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">占比仅 {((totalAbnormal / totalCount) * 100).toFixed(1)}% (受控)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">累计重大告警 (Critical)</span>
            <div className="text-2xl font-black font-mono text-rose-400 mt-1">
              {totalCritical} <span className="text-xs font-normal text-slate-400">条</span>
            </div>
            <span className="text-[11px] text-rose-400 font-mono">闭环工单已处理 100%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 w-fit">
        {(['全部', '交换机', '防火墙', '服务器'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedType(cat)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedType === cat
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {cat} {cat === '交换机' ? '(48台)' : cat === '防火墙' ? '(18台)' : cat === '服务器' ? '(86台)' : `(${totalCount}台)`}
          </button>
        ))}
      </div>

      {/* Main Content Area: 3 Distinct Visualizations for Each Device Category */}
      <div className="space-y-5">
        {/* ========================================================================= */}
        {/* 1. 交换机监控统计：半环形双轨仪表盘 (Radial Gauge) + 垂直多柱高耸频谱直方图 */}
        {/* ========================================================================= */}
        {(selectedType === '全部' || selectedType === '交换机') && (() => {
          const sw = scaledDataList[0];
          const swHealthRate = ((sw.normalCount / sw.count) * 100).toFixed(1);
          const maxAlarm = Math.max(...Object.values(sw.alarms));

          return (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Network className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        交换机监控统计
                      </h3>
                      <span className="text-lg font-black font-mono text-cyan-300">
                        {sw.count} <span className="text-xs font-normal text-slate-400">台</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        400G 无损 Fabric
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {sw.deviceParamsSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalParamDevice(sw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/15 hover:bg-cyan-600/25 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    设备参数
                  </button>
                  <button
                    onClick={() => setModalParamDevice(sw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-mono transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    设备配置
                  </button>
                </div>
              </div>

              {/* Unique Visual Layout for Switch: Gauge + Vertical Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                {/* Left: 双轨半圆健康仪表盘 */}
                <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                      在线健康率与端口连通度 (Port Fabric Gauge)
                    </span>
                    <span className="font-mono text-cyan-400 text-[11px]">44 正常 / 4 告警</span>
                  </div>

                  <div className="py-2 flex flex-col items-center justify-center relative">
                    <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
                      <svg className="w-48 h-48 absolute top-0" viewBox="0 0 100 100">
                        <path
                          d="M 12 50 A 38 38 0 0 1 88 50"
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 12 50 A 38 38 0 0 1 88 50"
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="10"
                          strokeDasharray="119.38"
                          strokeDashoffset={`${119.38 - (parseFloat(swHealthRate) / 100) * 119.38}`}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                        />
                      </svg>
                      <div className="text-center mb-1 z-10 select-none">
                        <div className="text-2xl font-black font-mono text-cyan-300">
                          {swHealthRate}%
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                          FABRIC ONLINE
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 w-full mt-2 font-mono text-xs text-center">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">正常运行</span>
                        <span className="text-emerald-400 font-bold">{sw.normalCount} 台 (91.7%)</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-500 block">异常告警</span>
                        <span className="text-rose-400 font-bold">{sw.abnormalCount} 台 (8.3%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60">
                    <span>丢包率: 0.0001% (零丢包)</span>
                    <span className="text-cyan-400">RoCE v2 拥塞通知有效</span>
                  </div>
                </div>

                {/* Right: 垂直多柱直方柱群 (Vertical Column Bars) */}
                <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                      交换网告警等级多维立柱频谱 (Spectrum Columns)
                    </span>
                    <span className="font-mono text-cyan-400 text-[11px]">
                      共 {Object.values(sw.alarms).reduce((a, b) => a + b, 0)} 条
                    </span>
                  </div>

                  {/* Vertical Column Chart */}
                  <div className="h-40 flex items-end justify-between gap-4 px-4 pt-4">
                    {[
                      { label: '重大', val: sw.alarms.critical, color: 'bg-rose-500', text: 'text-rose-400' },
                      { label: '严重', val: sw.alarms.severe, color: 'bg-amber-500', text: 'text-amber-400' },
                      { label: '一般', val: sw.alarms.normal, color: 'bg-cyan-500', text: 'text-cyan-400' },
                      { label: '轻微', val: sw.alarms.minor, color: 'bg-blue-500', text: 'text-blue-400' },
                      { label: '消息', val: sw.alarms.info, color: 'bg-slate-500', text: 'text-slate-400' },
                    ].map((col) => {
                      const heightPercent = Math.max(12, Math.round((col.val / maxAlarm) * 100));
                      return (
                        <div key={col.label} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                          <span className={`text-xs font-mono font-bold ${col.text}`}>{col.val}</span>
                          <div className="w-full bg-slate-900 rounded-t-md p-0.5 border border-slate-800/80 flex items-end justify-center" style={{ height: '70%' }}>
                            <div
                              className={`w-full ${col.color} rounded-t-sm transition-all duration-500 group-hover:brightness-125`}
                              style={{ height: `${heightPercent}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">{col.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60">
                    <span>收敛压制比: 96.2%</span>
                    <span>告警工单分派率: 100%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* 2. 防火墙监控统计：多层嵌套甜甜圈环形图 (Donut Ring) + 纵向漏斗防护阶段条 */}
        {/* ========================================================================= */}
        {(selectedType === '全部' || selectedType === '防火墙') && (() => {
          const fw = scaledDataList[1];
          const totalAlarms = Object.values(fw.alarms).reduce((a, b) => a + b, 0);

          return (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        防火墙监控统计
                      </h3>
                      <span className="text-lg font-black font-mono text-indigo-300">
                        {fw.count} <span className="text-xs font-normal text-slate-400">台</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        下一代安全网关
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {fw.deviceParamsSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalParamDevice(fw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    设备参数
                  </button>
                  <button
                    onClick={() => setModalParamDevice(fw)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-mono transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    设备配置
                  </button>
                </div>
              </div>

              {/* Unique Visual Layout for Firewall: Donut Ring + Threat Funnel */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                {/* Left: 环形多段健康圆环图 (Donut Ring Chart) */}
                <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <PieChart className="w-3.5 h-3.5 text-indigo-400" />
                      网关合规与在线度 (Security Donut)
                    </span>
                    <span className="font-mono text-indigo-400 text-[11px]">88.9% 达标</span>
                  </div>

                  <div className="py-2 flex items-center justify-center relative">
                    <svg className="w-40 h-40 -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#1e293b"
                        strokeWidth="14"
                      />
                      {/* Normal Slice: 16/18 = 88.9% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#6366f1"
                        strokeWidth="14"
                        strokeDasharray="238.76"
                        strokeDashoffset={`${238.76 * (1 - 16 / 18)}`}
                        strokeLinecap="round"
                      />
                      {/* Abnormal Slice: 2/18 = 11.1% */}
                      <circle
                        cx="50"
                        cy="50"
                        r="38"
                        fill="transparent"
                        stroke="#f43f5e"
                        strokeWidth="14"
                        strokeDasharray="238.76"
                        strokeDashoffset={`${238.76 * (1 - 2 / 18)}`}
                        transform="rotate(320 50 50)"
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                      <span className="text-xl font-black font-mono text-slate-100">16 / 18</span>
                      <span className="text-[10px] text-indigo-400 font-mono">SECURE</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between px-3">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        防御正常:
                      </span>
                      <span className="text-indigo-300 font-bold">{fw.normalCount}台</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between px-3">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        规则告警:
                      </span>
                      <span className="text-rose-400 font-bold">{fw.abnormalCount}台</span>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60 mt-1">
                    <span>拦截数据包: 28.4万个</span>
                    <span className="text-emerald-400">威胁阻断率: 99.98%</span>
                  </div>
                </div>

                {/* Right: 防火墙阶梯级联防护漏斗 (Security Cascade Funnel) */}
                <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      威胁事件五级阶梯收敛金字塔 (Threat Cascade Funnel)
                    </span>
                    <span className="font-mono text-indigo-400 text-[11px]">共 {totalAlarms} 事件</span>
                  </div>

                  {/* Funnel Cascade Cards */}
                  <div className="space-y-1.5 py-1">
                    {[
                      { label: '重大威胁 (Critical)', count: fw.alarms.critical, bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40', bar: 'bg-rose-500', width: '30%' },
                      { label: '严重渗透 (Severe)', count: fw.alarms.severe, bg: 'bg-amber-500/20 text-amber-300 border-amber-500/40', bar: 'bg-amber-500', width: '48%' },
                      { label: '一般扫描 (Normal)', count: fw.alarms.normal, bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', bar: 'bg-indigo-500', width: '65%' },
                      { label: '轻微误报 (Minor)', count: fw.alarms.minor, bg: 'bg-blue-500/20 text-blue-300 border-blue-500/40', bar: 'bg-blue-500', width: '80%' },
                      { label: '放行会话 (Info)', count: fw.alarms.info, bg: 'bg-slate-800/60 text-slate-300 border-slate-700', bar: 'bg-slate-500', width: '100%' },
                    ].map((step) => (
                      <div key={step.label} className="p-2 rounded-lg bg-slate-900/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${step.bar}`} />
                          <span className="text-slate-300 font-medium">{step.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-28 bg-slate-950 h-2 rounded-full overflow-hidden">
                            <div className={`h-full ${step.bar}`} style={{ width: step.width }} />
                          </div>
                          <span className="w-8 text-right font-bold text-slate-100">{step.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60">
                    <span>规则更新: 2026-11-05 02:00</span>
                    <span className="text-indigo-400">威胁知识库同步完成</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ========================================================================= */}
        {/* 3. 服务器监控统计：雷达/网格矩阵卡片 (Grid Matrix) + 堆叠多段能力条 (Stacked Bar) */}
        {/* ========================================================================= */}
        {(selectedType === '全部' || selectedType === '服务器') && (() => {
          const srv = scaledDataList[2];
          const srvTotalAlarms = Object.values(srv.alarms).reduce((a, b) => a + b, 0);

          return (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm hover:border-slate-700 transition-all space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                        服务器监控统计
                      </h3>
                      <span className="text-lg font-black font-mono text-emerald-400">
                        {srv.count} <span className="text-xs font-normal text-slate-400">台</span>
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        四路至强 / 鲲鹏 / DGX H100
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {srv.deviceParamsSummary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalParamDevice(srv)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/25 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    设备参数
                  </button>
                  <button
                    onClick={() => setModalParamDevice(srv)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-mono transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    设备配置
                  </button>
                </div>
              </div>

              {/* Unique Visual Layout for Servers: Node Status Matrix Grid + Stacked Progress Bar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
                {/* Left: 节点微模块矩阵分布 (86 Nodes Visual Grid) */}
                <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-emerald-400" />
                      物理节点拓扑矩阵 (86 Nodes Matrix)
                    </span>
                    <span className="font-mono text-emerald-400 text-[11px]">79 运行 / 7 检修</span>
                  </div>

                  {/* Micro Grid Matrix dots */}
                  <div className="py-2 space-y-2">
                    <div className="grid grid-cols-10 gap-1.5 p-3 rounded-lg bg-slate-900/90 border border-slate-800">
                      {Array.from({ length: 86 }).map((_, i) => {
                        const isAbnormal = i === 12 || i === 25 || i === 38 || i === 54 || i === 67 || i === 71 || i === 82;
                        return (
                          <div
                            key={i}
                            className={`h-4 rounded-xs flex items-center justify-center text-[9px] font-mono transition-transform hover:scale-125 cursor-pointer ${
                              isAbnormal 
                                ? 'bg-amber-500 text-slate-950 font-bold' 
                                : 'bg-emerald-500/80 text-emerald-950'
                            }`}
                            title={`节点 SRV-${String(i + 1).padStart(2, '0')}: ${isAbnormal ? '温度告警' : '运行正常'}`}
                          >
                            {i + 1}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                        <span>正常主机 (79台 · 91.9%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                        <span>预警维护 (7台 · 8.1%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[11px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60">
                    <span>平均 CPU 负荷: 46.2%</span>
                    <span className="text-cyan-400">IPMI 遥测正常</span>
                  </div>
                </div>

                {/* Right: 连续多段堆叠百分比条 + 分布卡片 (Stacked Multi-Color Range) */}
                <div className="lg:col-span-7 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                      服务器告警等级连续多段堆叠条 (Stacked Multi-Segments)
                    </span>
                    <span className="font-mono text-emerald-400 text-[11px]">共 {srvTotalAlarms} 条</span>
                  </div>

                  <div className="py-2 space-y-4">
                    {/* Continuous Multi-Color Stacked Bar */}
                    <div className="space-y-1.5">
                      <div className="w-full h-5 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex p-0.5 gap-0.5">
                        <div className="bg-rose-500 rounded-xs transition-all duration-500" style={{ width: `${(srv.alarms.critical / srvTotalAlarms) * 100}%` }} title={`重大: ${srv.alarms.critical}`} />
                        <div className="bg-amber-500 rounded-xs transition-all duration-500" style={{ width: `${(srv.alarms.severe / srvTotalAlarms) * 100}%` }} title={`严重: ${srv.alarms.severe}`} />
                        <div className="bg-emerald-500 rounded-xs transition-all duration-500" style={{ width: `${(srv.alarms.normal / srvTotalAlarms) * 100}%` }} title={`一般: ${srv.alarms.normal}`} />
                        <div className="bg-cyan-500 rounded-xs transition-all duration-500" style={{ width: `${(srv.alarms.minor / srvTotalAlarms) * 100}%` }} title={`轻微: ${srv.alarms.minor}`} />
                        <div className="bg-slate-600 rounded-xs transition-all duration-500" style={{ width: `${(srv.alarms.info / srvTotalAlarms) * 100}%` }} title={`消息: ${srv.alarms.info}`} />
                      </div>

                      <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
                        <span>0%</span>
                        <span>累计百分比堆叠占比</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {/* 5 Distinct Alarm Badges Cards */}
                    <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20">
                        <span className="text-[10px] text-rose-400 block">重大</span>
                        <span className="text-base font-bold text-rose-300">{srv.alarms.critical}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <span className="text-[10px] text-amber-400 block">严重</span>
                        <span className="text-base font-bold text-amber-300">{srv.alarms.severe}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[10px] text-emerald-400 block">一般</span>
                        <span className="text-base font-bold text-emerald-300">{srv.alarms.normal}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                        <span className="text-[10px] text-cyan-400 block">轻微</span>
                        <span className="text-base font-bold text-cyan-300">{srv.alarms.minor}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-800/60 border border-slate-700">
                        <span className="text-[10px] text-slate-400 block">消息</span>
                        <span className="text-base font-bold text-slate-300">{srv.alarms.info}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-800/60">
                    <span>平均故障恢复时间 (MTTR): 14.2分</span>
                    <span className="text-emerald-400">SLA 履约: 99.99%</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Interactive Modal for "设备参数" & "设备配置" */}
      {modalParamDevice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100">
                  {modalParamDevice.type} - 设备参数与配置全景
                </h3>
              </div>
              <button
                onClick={() => setModalParamDevice(null)}
                className="text-slate-400 hover:text-slate-200 text-sm font-mono"
              >
                ✕ 关闭
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-cyan-400 font-bold block flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  设备硬件参数 (Device Parameters)
                </span>
                <p className="text-slate-200 font-mono leading-relaxed">
                  {modalParamDevice.deviceParamsSummary}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <span className="text-blue-400 font-bold block flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  系统配置与策略参数 (Configuration Spec)
                </span>
                <p className="text-slate-200 font-mono leading-relaxed">
                  {modalParamDevice.deviceConfigSummary}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/50 border border-slate-800/80 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>总装机量:</span>
                  <span className="text-slate-200">{modalParamDevice.count} 台全双工集群</span>
                </div>
                <div className="flex justify-between">
                  <span>正常比例:</span>
                  <span className="text-emerald-400">{modalParamDevice.normalCount} 台 (正常在线)</span>
                </div>
                <div className="flex justify-between">
                  <span>故障率监测:</span>
                  <span className="text-orange-400">{modalParamDevice.abnormalCount} 台 (待现场工单处理)</span>
                </div>
                <div className="flex justify-between">
                  <span>最后巡检基线:</span>
                  <span className="text-cyan-300">2026-11-05 20:38:00 (自动巡检完成)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setModalParamDevice(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors"
              >
                确定并返回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
