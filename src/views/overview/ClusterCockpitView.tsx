import React, { useState } from 'react';
import {
  Server,
  Cpu,
  HardDrive,
  Activity,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ArrowUpRight,
  RefreshCw,
  Layers,
  ChevronRight,
  TrendingUp,
  FileSpreadsheet,
  CheckCircle,
} from 'lucide-react';
import { ServerNode, StorageDevice, SoftwareComponent, AlarmItem, WorkOrder, MenuKey } from '../../types';

interface ClusterCockpitViewProps {
  servers: ServerNode[];
  storages: StorageDevice[];
  components: SoftwareComponent[];
  alarms: AlarmItem[];
  workOrders: WorkOrder[];
  onSelectServer: (server: ServerNode) => void;
  onNavigate: (key: MenuKey) => void;
  onOpenAlarmAction: (alarm: AlarmItem) => void;
  onCreateWorkOrder: () => void;
}

export const ClusterCockpitView: React.FC<ClusterCockpitViewProps> = ({
  servers,
  storages,
  components,
  alarms,
  workOrders,
  onSelectServer,
  onNavigate,
  onOpenAlarmAction,
  onCreateWorkOrder,
}) => {
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<'all' | 'compute' | 'storage' | 'ai'>('all');

  const activeAlarms = alarms.filter((a) => a.status === 'active');
  const criticalAlarms = activeAlarms.filter((a) => a.severity === 'critical');
  const healthyNodes = servers.filter((s) => s.status === 'normal').length;
  const warningNodes = servers.filter((s) => s.status === 'warning').length;
  const criticalNodes = servers.filter((s) => s.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* View Header with Action Tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>集群全息态势驾驶舱</span>
            <span className="text-xs font-normal text-slate-400">· 2026 企业级高密算力基础设施监控</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            实时汇聚 256 台物理节点、8.4PB 分布式全闪存储、RoCE 400G 无损 Fabric 与全域大数据流转指标
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onCreateWorkOrder}
            className="px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-900/30"
          >
            <Activity className="w-3.5 h-3.5" />
            快速提报工单
          </button>
          <button
            onClick={() => onNavigate('alarm_active')}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            待处理告警 ({activeAlarms.length})
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* KPI 1 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>物理服务器节点</span>
            <Server className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">256</span>
            <span className="text-xs text-slate-400">物理机</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-mono font-semibold">254 在线</span>
            <span>·</span>
            <span className="text-amber-400 font-mono">1 预警</span>
            <span>·</span>
            <span className="text-rose-400 font-mono">1 临界</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>全域算力分配水位</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">76.1%</span>
            <span className="text-xs text-slate-400 font-mono">12,480 Cores</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full w-[76.1%]" />
          </div>
        </div>

        {/* KPI 3 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>分布式内存占用</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">71.2%</span>
            <span className="text-xs text-slate-400 font-mono">91.2 TB / 128T</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full w-[71.2%]" />
          </div>
        </div>

        {/* KPI 4 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>全闪 NVMe 存储水位</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">6.1 PB</span>
            <span className="text-xs text-slate-400 font-mono">/ 8.4 PB</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>IOPS: 580K</span>
            <span>延迟: 0.21ms</span>
          </div>
        </div>

        {/* KPI 5 */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>实时数据流吞吐</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">2.84 GB/s</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            1,420,000 记录/秒 · 0 丢失
          </div>
        </div>
      </div>

      {/* Main Grid: Topology & Health + Active Alarms & Work Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Holographic Architecture & Cluster Node Density Map */}
        <div className="lg:col-span-2 space-y-6">
          {/* Holographic Infrastructure Health Flow */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">集群全息分层拓扑与健康度评估</h3>
                <p className="text-xs text-slate-400">各层级当前实时运行健康指数及负载传导链路</p>
              </div>
              <span className="text-xs font-mono font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                综合评分: 98.4 A+
              </span>
            </div>

            {/* Architecture Flow Strips */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div
                onClick={() => onNavigate('hw_network')}
                className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">01. 网络 Fabric</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div className="font-bold text-sm text-slate-200">400G RoCE 无损网</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  丢包率: 0.0001% · 5台骨干交换机
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <CheckCircle className="w-3 h-3" />
                  <span>健康运行 100%</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('hw_servers')}
                className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">02. 物理算力层</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div className="font-bold text-sm text-slate-200">256台高密刀片</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  EPYC 9654 / H100 智算
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-[11px]">
                  <AlertTriangle className="w-3 h-3" />
                  <span>1 节点高温告警</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('hw_storage')}
                className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">03. 全闪存储池</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div className="font-bold text-sm text-slate-200">NVMe-oF & Ceph</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  8.4 PB · 0.21ms 读写延迟
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <CheckCircle className="w-3 h-3" />
                  <span>可用性 99.999%</span>
                </div>
              </div>

              <div
                onClick={() => onNavigate('sw_bigdata')}
                className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">04. 大数据引擎</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400" />
                </div>
                <div className="font-bold text-sm text-slate-200">Hadoop/Flink/Kafka</div>
                <div className="text-[11px] text-slate-400 font-mono">
                  38 个流批处理作业
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
                  <CheckCircle className="w-3 h-3" />
                  <span>调度引擎正常</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Cluster Node Grid Visualizer */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100">集群节点全息微观矩阵 (64 代表性节点采样)</h3>
                <p className="text-xs text-slate-400">点击任意节点即可展开物理硬件、双路 CPU 传感器与 IPMI 控制抽屉</p>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg text-xs">
                {(['all', 'compute', 'storage', 'ai'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setSelectedClusterFilter(filter)}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      selectedClusterFilter === filter
                        ? 'bg-slate-800 text-cyan-300 font-semibold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {filter === 'all' && '全部'}
                    {filter === 'compute' && '计算节点'}
                    {filter === 'storage' && '存储节点'}
                    {filter === 'ai' && 'AI 智算'}
                  </button>
                ))}
              </div>
            </div>

            {/* 64 Micro Node Blocks */}
            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
              {Array.from({ length: 64 }).map((_, idx) => {
                const srv = servers[idx % servers.length];
                const isCritical = idx === 5; // hologram-compute-02
                const isWarning = idx === 2; // hologram-ai-gpu-01
                const statusColor = isCritical
                  ? 'bg-rose-500 hover:bg-rose-400 ring-2 ring-rose-500/50 animate-pulse'
                  : isWarning
                  ? 'bg-amber-500 hover:bg-amber-400'
                  : 'bg-emerald-500/80 hover:bg-emerald-400';

                return (
                  <button
                    key={idx}
                    onClick={() => onSelectServer(srv)}
                    className={`h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold text-slate-950 transition-all transform hover:scale-110 cursor-pointer ${statusColor}`}
                    title={`节点 #${idx + 1}: ${srv.hostname} (${srv.ip})\n状态: ${
                      isCritical ? '临界高温' : isWarning ? '高负载' : '健康正常'
                    }\nCPU使用率: ${srv.cpuUsage}%\n温度: ${srv.cpuTemp}°C`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500" />
                  <span>正常运行 ({healthyNodes})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-amber-500" />
                  <span>负载预警 ({warningNodes})</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500" />
                  <span>临界高温故障 ({criticalNodes})</span>
                </span>
              </div>
              <button
                onClick={() => onNavigate('hw_servers')}
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                查看全部 256 物理节点列表 &gt;
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Active Alerts & Work Orders Panel */}
        <div className="space-y-6">
          {/* Active Alarms Card */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100">实时待办告警</h3>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
                {activeAlarms.length} 条待处理
              </span>
            </div>

            <div className="space-y-2">
              {activeAlarms.slice(0, 3).map((alarm) => (
                <div
                  key={alarm.id}
                  onClick={() => onOpenAlarmAction(alarm)}
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border font-mono font-bold ${
                        alarm.severity === 'critical'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      }`}
                    >
                      {alarm.severity === 'critical' ? 'CRITICAL' : 'WARNING'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {alarm.firstTriggeredAt.slice(11)}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {alarm.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">
                    实测: <span className="text-rose-400 font-bold">{alarm.triggerValue}</span> · {alarm.sourceEntity}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('alarm_active')}
              className="w-full py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors text-center block"
            >
              进入告警中心集中处理 &gt;
            </button>
          </div>

          {/* Pending Work Orders Card */}
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">工单流转与处置追踪</h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                {workOrders.length} 条工单
              </span>
            </div>

            <div className="space-y-2">
              {workOrders.slice(0, 3).map((wo) => (
                <div
                  key={wo.id}
                  onClick={() => onNavigate('wo_my')}
                  className="p-3 rounded-lg bg-slate-950 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-cyan-400 font-semibold">{wo.id}</span>
                    <span className="text-slate-400">{wo.status === 'in_progress' ? '处理中' : wo.status === 'pending' ? '待审批' : '已归档'}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {wo.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>处理人: {wo.assignee}</span>
                    <span className="font-mono text-rose-400">{wo.priority}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('wo_my')}
              className="w-full py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors text-center block"
            >
              查看我的工单流转 &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
