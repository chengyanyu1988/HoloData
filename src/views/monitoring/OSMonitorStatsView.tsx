import React, { useState } from 'react';
import { OperatingSystemMetric } from '../../types';
import {
  BarChart3, ChevronRight, DownloadCloud, RefreshCw,
  Server, ShieldCheck, AlertTriangle, CheckCircle2, Clock,
  Cpu, HardDrive, Terminal, Sliders, FileText, Activity, Layers, Check, AlertCircle
} from 'lucide-react';

interface Props {
  osMetrics?: OperatingSystemMetric[];
  onRefresh?: () => void;
}

interface OSNodeDetail {
  id: string;
  name: string;
  sysId: string;
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
  kernel: string;
  ip: string;
  arch: string;
}

const OS_STATS_NODES: OSNodeDetail[] = [
  {
    id: 'os-01',
    name: 'openEuler 24.03 LTS 信创主节点',
    sysId: 'sys-euler-20261105-01',
    startTime: '2026-11-01 08:30:00',
    uptime: '4天 14小时 06分',
    statusNormal: 58,
    statusAbnormal: 6,
    alarms: {
      critical: 8,
      severe: 16,
      normal: 24,
      minor: 15,
      info: 20,
    },
    kernel: 'Linux 6.6.21-hologram-rt',
    ip: '10.120.30.01',
    arch: 'x86_64 & aarch64 鲲鹏',
  },
  {
    id: 'os-02',
    name: '银河麒麟 Kylin V10 SP3 安全节点',
    sysId: 'sys-kylin-20261105-02',
    startTime: '2026-10-28 14:15:00',
    uptime: '8天 08小时 21分',
    statusNormal: 42,
    statusAbnormal: 3,
    alarms: {
      critical: 4,
      severe: 10,
      normal: 18,
      minor: 12,
      info: 15,
    },
    kernel: 'Linux 5.10.0-kylin-server',
    ip: '10.120.50.15',
    arch: 'x86_64 & aarch64 飞腾',
  },
  {
    id: 'os-03',
    name: 'Ubuntu 24.04 LTS DGX 算力集群',
    sysId: 'sys-ubt-20261105-03',
    startTime: '2026-11-03 10:00:00',
    uptime: '2天 12小时 36分',
    statusNormal: 64,
    statusAbnormal: 8,
    alarms: {
      critical: 12,
      severe: 22,
      normal: 30,
      minor: 18,
      info: 25,
    },
    kernel: 'Linux 6.8.0-nvidia-lowlatency',
    ip: '10.120.20.01',
    arch: 'x86_64 DGX H100',
  },
  {
    id: 'os-04',
    name: 'Windows Server 2022 工业中继网关',
    sysId: 'sys-win-20261105-04',
    startTime: '2026-11-02 09:20:00',
    uptime: '3天 13小时 16分',
    statusNormal: 36,
    statusAbnormal: 2,
    alarms: {
      critical: 2,
      severe: 6,
      normal: 12,
      minor: 8,
      info: 10,
    },
    kernel: 'NT 10.0.20348 (WSL2-Ready)',
    ip: '10.120.60.08',
    arch: 'x86_64 SCADA Interconnect',
  },
];

export const OSMonitorStatsView: React.FC<Props> = ({
  onRefresh,
}) => {
  const [timeRange, setTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('os-01');

  const selectedNode = OS_STATS_NODES.find(n => n.id === selectedNodeId) || OS_STATS_NODES[0];

  // Dynamically calculate metrics based on time range (1h, 6h, 24h, 7d)
  const getMetrics = (node: OSNodeDetail) => {
    const factorMap = {
      '1h': 0.35,
      '6h': 0.65,
      '24h': 1.0,
      '7d': 2.4,
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

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BarChart3 className="w-4 h-4" />
          </span>
          <span className="text-blue-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">操作系统监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">监控统计</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            统计周期: {timeRange === '1h' ? '近1小时' : timeRange === '6h' ? '近6小时' : timeRange === '24h' ? '近24小时' : '近7天'} (2026-11-05)
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
            onClick={() => alert(`已导出操作系统近${timeRange}监控统计数据与状态告警报表！`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-blue-400" />
            导出统计报表
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </button>
          )}
        </div>
      </div>

      {/* OS Node Fast Switch Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-semibold text-slate-400 shrink-0 mr-1">选择操作系统节点:</span>
        {OS_STATS_NODES.map((node) => (
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
            <span>{node.name.split(' ')[0]} ({node.ip})</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* Screenshot Layout Matching Panel: 设备参数 | 状态统计 | 告警级别统计 */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

          {/* Left Block: 设备参数 (Exact matching titles from screenshot) */}
          <div className="lg:col-span-3 bg-cyan-950/40 border border-cyan-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="text-cyan-300 font-bold text-sm mb-3 border-b border-cyan-500/20 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-cyan-400" />
                  <span>设备参数</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                  {timeRange === '1h' ? '1小时窗口' : timeRange === '6h' ? '6小时窗口' : timeRange === '24h' ? '24小时窗口' : '7天窗口'}
                </span>
              </div>

              {/* High visibility blue display badge */}
              <div className="bg-cyan-500/15 border border-cyan-500/30 rounded-lg p-3 text-center mb-4">
                <div className="text-cyan-300 font-black text-lg tracking-wide font-mono">
                  {selectedNode.name.split(' ')[0]}
                </div>
                <div className="text-slate-400 text-xs mt-1 font-mono">
                  操作系统名称
                </div>
              </div>

              {/* Details Key-Value List */}
              <div className="space-y-2.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">操作系统名称:</span>
                  <span className="text-slate-100 font-semibold truncate max-w-[140px]" title={selectedNode.name}>
                    {selectedNode.name.split(' ')[0]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-sans">操作系统id:</span>
                  <span className="text-cyan-300 font-semibold">{selectedNode.sysId}</span>
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
              <span className="text-cyan-300">{selectedNode.arch}</span>
            </div>
          </div>

          {/* Middle Block: 状态统计 Horizontal Bar Chart (正常 / 异常) */}
          <div className="lg:col-span-4 bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative">
            <div className="text-slate-200 font-bold text-xs mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                状态统计 ({timeRange === '1h' ? '1h' : timeRange === '6h' ? '6h' : timeRange === '24h' ? '24h' : '7d'})
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                总计: {currentMetrics.statusNormal + currentMetrics.statusAbnormal} 项
              </span>
            </div>

            {/* Horizontal Bar Area with Grid lines */}
            <div className="py-4 space-y-6 relative">
              {/* Dashed Grid Lines (0 .. 120 max limit) */}
              <div className="absolute inset-0 top-2 bottom-8 left-12 right-2 flex justify-between pointer-events-none">
                {[0, 20, 40, 60, 80, 100, 120].map((tick) => (
                  <div key={tick} className="border-r border-dashed border-slate-800/80 h-full relative">
                    <span className="absolute -bottom-6 -translate-x-1/2 text-[10px] font-mono text-slate-500">
                      {tick}
                    </span>
                  </div>
                ))}
              </div>

              {/* 正常 Horizontal Bar */}
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-xs font-bold text-slate-300 w-10 text-right font-sans">正常</span>
                <div className="flex-1 bg-slate-900/90 h-6 rounded-r-md border border-slate-800 p-0.5 relative overflow-hidden">
                  <div
                    className="h-full bg-lime-500 rounded-r-sm transition-all duration-500 shadow-sm shadow-lime-500/50"
                    style={{ width: `${Math.min(100, (currentMetrics.statusNormal / 120) * 100)}%` }}
                  />
                  <span className="absolute right-2 top-0.5 text-xs font-mono font-bold text-slate-900">
                    {currentMetrics.statusNormal}
                  </span>
                </div>
              </div>

              {/* 异常 Horizontal Bar */}
              <div className="flex items-center gap-3 relative z-10">
                <span className="text-xs font-bold text-slate-300 w-10 text-right font-sans">异常</span>
                <div className="flex-1 bg-slate-900/90 h-6 rounded-r-md border border-slate-800 p-0.5 relative overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-r-sm transition-all duration-500 shadow-sm shadow-orange-500/50"
                    style={{ width: `${Math.min(100, (currentMetrics.statusAbnormal / 120) * 100)}%` }}
                  />
                  <span className="absolute left-2 top-0.5 text-xs font-mono font-bold text-slate-100">
                    {currentMetrics.statusAbnormal}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-800/60">
              <span>正常比例: {((currentMetrics.statusNormal / (currentMetrics.statusNormal + currentMetrics.statusAbnormal)) * 100).toFixed(1)}%</span>
              <span className="text-lime-400">运行无阻碍</span>
            </div>
          </div>

          {/* Right Block: 告警级别统计 Horizontal Bar Chart (重大, 严重, 一般, 轻微, 消息) */}
          <div className="lg:col-span-5 bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative">
            <div className="text-slate-200 font-bold text-xs mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                告警级别统计 ({timeRange === '1h' ? '1h' : timeRange === '6h' ? '6h' : timeRange === '24h' ? '24h' : '7d'})
              </span>
              <span className="text-[11px] font-mono text-cyan-400">
                共 {Object.values(currentMetrics.alarms).reduce((a, b) => a + b, 0)} 条告警
              </span>
            </div>

            {/* Horizontal Bar Area with Grid lines (0 .. 100) */}
            <div className="py-2 space-y-2.5 relative">
              {/* Dashed Grid Lines (0 .. 100) */}
              <div className="absolute inset-0 top-1 bottom-6 left-12 right-2 flex justify-between pointer-events-none">
                {[0, 20, 40, 60, 80, 100].map((tick) => (
                  <div key={tick} className="border-r border-dashed border-slate-800/80 h-full relative">
                    <span className="absolute -bottom-5 -translate-x-1/2 text-[10px] font-mono text-slate-500">
                      {tick}
                    </span>
                  </div>
                ))}
              </div>

              {[
                { level: '重大', count: currentMetrics.alarms.critical },
                { level: '严重', count: currentMetrics.alarms.severe },
                { level: '一般', count: currentMetrics.alarms.normal },
                { level: '轻微', count: currentMetrics.alarms.minor },
                { level: '消息', count: currentMetrics.alarms.info },
              ].map((item) => (
                <div key={item.level} className="flex items-center gap-3 relative z-10">
                  <span className="text-xs font-bold text-slate-300 w-10 text-right font-sans">{item.level}</span>
                  <div className="flex-1 bg-slate-900/90 h-5 rounded-r-md border border-slate-800 p-0.5 relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-r-sm transition-all duration-500 shadow-sm shadow-cyan-500/30"
                      style={{ width: `${Math.min(100, (item.count / 100) * 100)}%` }}
                    />
                    <span className="absolute right-2 top-0 text-[11px] font-mono font-bold text-cyan-200">
                      {item.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 text-[11px] font-mono text-slate-500 flex justify-between pt-2 border-t border-slate-800/60">
              <span>探针告警收敛率: 99.4%</span>
              <span className="text-cyan-300">工单实时响应中</span>
            </div>
          </div>

        </div>
      </div>

      {/* OS Cluster Detail List Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-slate-100">
              操作系统纳管节点监控列表 (OS Nodes Overview)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            全部 {OS_STATS_NODES.length} 台服务器节点 | 2026-11-05 {timeRange}窗口
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-2.5 px-3">节点ID / 名称</th>
                <th className="py-2.5 px-3">IP地址</th>
                <th className="py-2.5 px-3">内核版本</th>
                <th className="py-2.5 px-3">启动时间</th>
                <th className="py-2.5 px-3">持续运行时间</th>
                <th className="py-2.5 px-3">正常/异常</th>
                <th className="py-2.5 px-3">告警数 (重大/严重)</th>
                <th className="py-2.5 px-3 text-right">切换查看</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {OS_STATS_NODES.map((node) => {
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
                      <span className="text-[10px] text-cyan-400">{node.sysId}</span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">
                      {node.ip}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {node.kernel}
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
