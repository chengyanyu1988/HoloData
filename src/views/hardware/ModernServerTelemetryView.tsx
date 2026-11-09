import React, { useState } from 'react';
import { 
  Server, Search, Activity, Cpu, Zap, Thermometer, 
  Layers, HardDrive, Terminal, RefreshCw, ShieldCheck, 
  ChevronRight, ChevronDown, Folder, FileText, CheckCircle2,
  Gauge, AlertTriangle, Fan, Box, Sliders
} from 'lucide-react';
import { ServerNode } from '../../types';

export interface HardwareTelemetryServer {
  id: string;
  name: string;
  hostname: string;
  category: '主控节点' | '计算节点' | '存储节点' | '智算GPU节点';
  location: string;
  description: string;
  contact: string;
  oid: string;
  uptime: string;
  model: string;
  ip: string;
  bmcIp: string;
  // Voltage telemetries
  powerVoltage: number; // 3.3V or 12.0V
  memoryVoltage: number; // 1.2V or 3.3V
  // Multi-CPU Temperatures
  cpuTemperatures: { label: string; tempC: number; usage: number }[];
  // Other thermal metrics
  systemTempC: number;
  motherboardTempC: number;
  frontPanelTempC: number;
  vrmTempC: number; // CPU电压调节模组温度 (VRM)
  // Fans with RPM
  fans: { name: string; rpm: number; status: 'normal' | 'warning' }[];
  status: 'normal' | 'warning' | 'critical';
}

export const SERVERS_HARDWARE_DATA: HardwareTelemetryServer[] = [
  {
    id: 'SRV-HOLO-01',
    name: '浪潮 NF8480M6 四路核心主控服务器-01',
    hostname: 'hologram-master-01',
    category: '主控节点',
    location: 'DC-ZONE-A 机房 A-01 列机柜 U38-U40',
    description: '全息大数据治理与分布式集群元数据调度主控机',
    contact: '程总工 (13800108821) / 基础架构部',
    oid: '1.3.6.1.4.1.2011.2.8480.1',
    uptime: '142天 06小时 28分 (启动于 2026-06-16 14:00)',
    model: 'Inspur NF8480M6 4U Quad-Socket Platinum',
    ip: '10.120.10.11',
    bmcIp: '10.120.100.11',
    powerVoltage: 12.08,
    memoryVoltage: 1.21,
    cpuTemperatures: [
      { label: 'CPU 1 (Platinum 8592+)', tempC: 44.5, usage: 48 },
      { label: 'CPU 2 (Platinum 8592+)', tempC: 43.8, usage: 45 },
      { label: 'CPU 3 (Platinum 8592+)', tempC: 46.2, usage: 52 },
      { label: 'CPU 4 (Platinum 8592+)', tempC: 42.9, usage: 46 },
    ],
    systemTempC: 38.2,
    motherboardTempC: 39.5,
    frontPanelTempC: 22.8,
    vrmTempC: 48.6,
    fans: [
      { name: '风扇组 1 (前置主压区)', rpm: 5400, status: 'normal' },
      { name: '风扇组 2 (核心CPU区)', rpm: 5600, status: 'normal' },
      { name: '风扇组 3 (内存走线区)', rpm: 5350, status: 'normal' },
      { name: '风扇组 4 (后置抽风区)', rpm: 5500, status: 'normal' },
    ],
    status: 'normal',
  },
  {
    id: 'SRV-HOLO-02',
    name: '浪潮 NF8480M6 四路核心主控服务器-02',
    hostname: 'hologram-master-02',
    category: '主控节点',
    location: 'DC-ZONE-A 机房 A-01 列机柜 U34-U37',
    description: '全息元数据多活备节点与高可用 ZooKeeper 仲裁机',
    contact: '程总工 (13800108821) / 基础架构部',
    oid: '1.3.6.1.4.1.2011.2.8480.2',
    uptime: '142天 06小时 25分 (启动于 2026-06-16 14:03)',
    model: 'Inspur NF8480M6 4U Quad-Socket Platinum',
    ip: '10.120.10.12',
    bmcIp: '10.120.100.12',
    powerVoltage: 12.04,
    memoryVoltage: 1.20,
    cpuTemperatures: [
      { label: 'CPU 1 (Platinum 8592+)', tempC: 42.0, usage: 36 },
      { label: 'CPU 2 (Platinum 8592+)', tempC: 41.5, usage: 34 },
      { label: 'CPU 3 (Platinum 8592+)', tempC: 43.1, usage: 38 },
      { label: 'CPU 4 (Platinum 8592+)', tempC: 40.8, usage: 32 },
    ],
    systemTempC: 36.8,
    motherboardTempC: 38.0,
    frontPanelTempC: 22.4,
    vrmTempC: 45.2,
    fans: [
      { name: '风扇组 1 (前置主压区)', rpm: 5100, status: 'normal' },
      { name: '风扇组 2 (核心CPU区)', rpm: 5200, status: 'normal' },
      { name: '风扇组 3 (内存走线区)', rpm: 5050, status: 'normal' },
      { name: '风扇组 4 (后置抽风区)', rpm: 5150, status: 'normal' },
    ],
    status: 'normal',
  },
  {
    id: 'SRV-HOLO-03',
    name: '超聚变 FusionServer 2288H V7 高密计算节点',
    hostname: 'hologram-compute-01',
    category: '计算节点',
    location: 'DC-ZONE-A 机房 B-02 列机柜 U18-U19',
    description: 'Flink 实时流式计算与湖仓混合分析专用高密执行节点',
    contact: '王工 (13700192831) / 实时流计算组',
    oid: '1.3.6.1.4.1.2011.2.2288.7',
    uptime: '98天 18小时 40分 (启动于 2026-07-30 01:45)',
    model: 'xFusion FusionServer 2288H V7 2U Dual Xeon',
    ip: '10.120.30.01',
    bmcIp: '10.120.100.31',
    powerVoltage: 12.12,
    memoryVoltage: 1.21,
    cpuTemperatures: [
      { label: 'CPU 1 (Xeon Gold 6548Y+)', tempC: 56.8, usage: 78 },
      { label: 'CPU 2 (Xeon Gold 6548Y+)', tempC: 54.2, usage: 74 },
    ],
    systemTempC: 44.2,
    motherboardTempC: 46.5,
    frontPanelTempC: 23.5,
    vrmTempC: 55.4,
    fans: [
      { name: '风扇 1 (进风主泵)', rpm: 6800, status: 'normal' },
      { name: '风扇 2 (CPU1 风道)', rpm: 7100, status: 'normal' },
      { name: '风扇 3 (CPU2 风道)', rpm: 6950, status: 'normal' },
      { name: '风扇 4 (尾部出风口)', rpm: 7200, status: 'normal' },
    ],
    status: 'normal',
  },
  {
    id: 'SRV-HOLO-04',
    name: '华为泰山 Taishan 200 ARM 大数据原生节点',
    hostname: 'hologram-compute-02',
    category: '计算节点',
    location: 'DC-ZONE-A 机房 B-03 列机柜 U20-U21',
    description: '鲲鹏 920 算力底座，承载大数据 ClickHouse 多维特征计算',
    contact: '赵工 (13600129984) / 信创研发专班',
    oid: '1.3.6.1.4.1.2011.2.200.2280',
    uptime: '115天 10小时 15分 (启动于 2026-07-13 10:10)',
    model: 'Huawei TaiShan 200 2280 (Kunpeng 920 2x64 Cores)',
    ip: '10.120.30.02',
    bmcIp: '10.120.100.32',
    powerVoltage: 12.06,
    memoryVoltage: 1.20,
    cpuTemperatures: [
      { label: 'CPU 1 (Kunpeng 920-64C)', tempC: 51.4, usage: 65 },
      { label: 'CPU 2 (Kunpeng 920-64C)', tempC: 49.8, usage: 62 },
    ],
    systemTempC: 41.0,
    motherboardTempC: 42.8,
    frontPanelTempC: 23.0,
    vrmTempC: 52.0,
    fans: [
      { name: '风扇 1 (低噪变频)', rpm: 5800, status: 'normal' },
      { name: '风扇 2 (低噪变频)', rpm: 5900, status: 'normal' },
      { name: '风扇 3 (低噪变频)', rpm: 5750, status: 'normal' },
      { name: '风扇 4 (低噪变频)', rpm: 5850, status: 'normal' },
    ],
    status: 'normal',
  },
  {
    id: 'SRV-HOLO-05',
    name: 'NVIDIA DGX H100 8-GPU 智算超级节点',
    hostname: 'hologram-ai-gpu-01',
    category: '智算GPU节点',
    location: 'DC-ZONE-A 机房 C-01 列高密液冷机架 U22-U29',
    description: '全息工业大模型知识库特征检索与视觉多模态微调工作站',
    contact: 'AI系统架构部 (010-88291012)',
    oid: '1.3.6.1.4.1.8072.3.2.10',
    uptime: '68天 14小时 05分 (启动于 2026-08-29 06:20)',
    model: 'NVIDIA DGX H100 8x SXM5 80GB (液冷强化型)',
    ip: '10.120.20.01',
    bmcIp: '10.120.100.21',
    powerVoltage: 12.18,
    memoryVoltage: 1.22,
    cpuTemperatures: [
      { label: 'CPU 1 (Xeon Platinum 8480C)', tempC: 48.5, usage: 55 },
      { label: 'CPU 2 (Xeon Platinum 8480C)', tempC: 47.9, usage: 53 },
    ],
    systemTempC: 39.5,
    motherboardTempC: 41.2,
    frontPanelTempC: 21.0,
    vrmTempC: 51.8,
    fans: [
      { name: '液冷循环主泵 A', rpm: 4200, status: 'normal' },
      { name: '液冷循环主泵 B', rpm: 4250, status: 'normal' },
      { name: '冷排辅助轴流扇 1', rpm: 3600, status: 'normal' },
      { name: '冷排辅助轴流扇 2', rpm: 3650, status: 'normal' },
    ],
    status: 'normal',
  },
];

interface Props {
  servers?: ServerNode[];
  onSelectServer?: (server: ServerNode) => void;
  onCreateWorkOrderForServer?: (server: ServerNode) => void;
  onRefresh?: () => void;
}

export const ModernServerTelemetryView: React.FC<Props> = ({
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(SERVERS_HARDWARE_DATA[0].id);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    主控节点: true,
    计算节点: true,
    智算GPU节点: true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const selectedServer = SERVERS_HARDWARE_DATA.find(s => s.id === selectedId) || SERVERS_HARDWARE_DATA[0];

  const categories = Array.from(new Set(SERVERS_HARDWARE_DATA.map(s => s.category)));

  return (
    <div className="space-y-4">
      {/* Top Banner Navigation Breadcrumb */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-4 h-4" />
          </span>
          <span className="text-cyan-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">IT设备监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">服务器监控</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {selectedServer.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>IPMI 带外传感器已同步</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              刷新遥测
            </button>
          )}
        </div>
      </div>

      {/* Modern Dashboard Layout: Re-architected beyond screenshot's simple 8-box grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 服务器列表 (3 cols) */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col h-[780px] shadow-sm">
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-emerald-400 rounded-full" />
              <span>服务器列表</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">
              {SERVERS_HARDWARE_DATA.length} 物理机
            </span>
          </div>

          {/* Search */}
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="请输入名称、IP或节点名..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
          </div>

          {/* Tree Navigation */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 text-xs select-none">
            {categories.map((cat) => {
              const list = SERVERS_HARDWARE_DATA.filter(
                s => s.category === cat && (s.name.includes(search) || s.ip.includes(search) || s.hostname.includes(search))
              );
              if (list.length === 0) return null;
              const isOpen = expandedCategories[cat] ?? true;

              return (
                <div key={cat} className="space-y-1">
                  <button
                    onClick={() => toggleCategory(cat)}
                    className="w-full flex items-center gap-1.5 text-slate-200 font-bold px-2 py-1.5 rounded-md hover:bg-slate-800/60 transition-colors"
                  >
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <Folder className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{cat} ({list.length})</span>
                  </button>

                  {isOpen && (
                    <div className="pl-5 space-y-1 border-l border-slate-800/80 ml-3">
                      {list.map((srv) => {
                        const isSelected = selectedId === srv.id;
                        return (
                          <button
                            key={srv.id}
                            onClick={() => setSelectedId(srv.id)}
                            className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-start gap-2 ${
                              isSelected
                                ? 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400 shadow-xs'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                            }`}
                          >
                            <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                            <div className="truncate">
                              <div className="font-medium truncate">{srv.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">{srv.ip} · {srv.hostname}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Modern Re-Architected Layout (9 cols) */}
        <div className="lg:col-span-9 space-y-4">
          {/* 1. 基础信息卡片 (Header Card) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
            <div className="pb-3 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-emerald-400 rounded-full" />
                <h4 className="text-sm font-bold text-slate-100">{selectedServer.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {selectedServer.model}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-slate-400">BMC IP: <strong className="text-cyan-400">{selectedServer.bmcIp}</strong></span>
                <span className="text-slate-400">业务 IP: <strong className="text-emerald-400">{selectedServer.ip}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2.5 gap-x-6 mt-3 text-xs">
              <div className="flex">
                <span className="text-slate-400 w-20 shrink-0 font-medium">设备位置:</span>
                <span className="text-slate-200 break-all">{selectedServer.location}</span>
              </div>

              <div className="flex">
                <span className="text-slate-400 w-20 shrink-0 font-medium">描述信息:</span>
                <span className="text-slate-300 break-all">{selectedServer.description}</span>
              </div>

              <div className="flex">
                <span className="text-slate-400 w-20 shrink-0 font-medium">联系方式:</span>
                <span className="text-cyan-300 font-mono break-all">{selectedServer.contact}</span>
              </div>

              <div className="flex">
                <span className="text-slate-400 w-20 shrink-0 font-medium">设备OID:</span>
                <span className="text-slate-300 font-mono text-[11px] break-all">{selectedServer.oid}</span>
              </div>

              <div className="flex md:col-span-2">
                <span className="text-slate-400 w-20 shrink-0 font-medium">运行时长:</span>
                <span className="text-emerald-400 font-mono text-[11px] break-all">{selectedServer.uptime}</span>
              </div>
            </div>
          </div>

          {/* 2. 电压与供电安全指标 (Power & Voltage Instrumentation) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 主电源电压 (12V 主总线) */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">主电源母线电压 (Power Rail)</span>
                  <div className="text-2xl font-black font-mono text-blue-400 mt-0.5">
                    {selectedServer.powerVoltage.toFixed(2)} V
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">标称 12.00V ±3% (供电稳定)</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  CRPS 白金冗余
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-1">瞬态纹波: 18mV</div>
              </div>
            </div>

            {/* 内存总线电压 (DDR5 VDD) */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">内存通道供电电压 (Memory VDD)</span>
                  <div className="text-2xl font-black font-mono text-cyan-300 mt-0.5">
                    {selectedServer.memoryVoltage.toFixed(2)} V
                  </div>
                  <span className="text-[11px] text-slate-500 font-mono">DDR5 PMIC 板载独立调压</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  SPD Hub OK
                </span>
                <div className="text-[11px] text-slate-400 font-mono mt-1">通道温控: 34.2°C</div>
              </div>
            </div>
          </div>

          {/* 3. 核心 CPU 独立温控阵列与负荷 (CPU Multi-Socket Thermals) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>CPU 处理器独立温度与负载矩阵 (CPU Thermals)</span>
              </h4>
              <span className="text-xs font-mono text-slate-400">
                阈值上限: <strong className="text-amber-400">85.0°C</strong>
              </span>
            </div>

            <div className={`grid grid-cols-1 ${selectedServer.cpuTemperatures.length > 2 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'} gap-3`}>
              {selectedServer.cpuTemperatures.map((cpu, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-300 font-semibold">{cpu.label}</span>
                    <span className={`font-mono font-bold ${cpu.tempC > 70 ? 'text-rose-400' : cpu.tempC > 55 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {cpu.tempC}°C
                    </span>
                  </div>

                  {/* Temperature scale bar */}
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cpu.tempC > 70 ? 'bg-rose-500' : cpu.tempC > 55 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, (cpu.tempC / 85) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>当前负荷: {cpu.usage}%</span>
                    <span>TDP: 350W</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 服务器各区域温度遥测 (Zonal Board Temperatures) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* 系统环境温度 (System Temp) */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>系统环境温度</span>
                <Thermometer className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {selectedServer.systemTempC}°C
              </div>
              <div className="text-[11px] text-slate-500 font-mono">机箱内风道均温 (正常)</div>
            </div>

            {/* 基板温度 (Motherboard Temp) */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>主板基板温度</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {selectedServer.motherboardTempC}°C
              </div>
              <div className="text-[11px] text-slate-500 font-mono">PCH 南桥温度探针</div>
            </div>

            {/* 前面板进风温度 (Front Panel Temp) */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>前面板进风温度</span>
                <Box className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl font-bold font-mono text-blue-300">
                {selectedServer.frontPanelTempC}°C
              </div>
              <div className="text-[11px] text-slate-500 font-mono">机房冷通道送风点</div>
            </div>

            {/* CPU电压调节模组温度 (VRM Temp) */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>CPU供电VRM温度</span>
                <Sliders className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold font-mono text-amber-300">
                {selectedServer.vrmTempC}°C
              </div>
              <div className="text-[11px] text-slate-500 font-mono">DrMOS 供电散热模组</div>
            </div>
          </div>

          {/* 5. 散热风扇转速与风道压力监控 (Fan RPM Telemetry) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Fan className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>风扇转速与对流风道监控 (Cooling Fans RPM)</span>
              </h4>
              <span className="text-xs font-mono text-emerald-400">
                智能 PID 动态控速开启
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {selectedServer.fans.map((fan, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs text-slate-300 font-medium block truncate max-w-[140px]" title={fan.name}>
                      {fan.name}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">PWM 62% 占空比</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-sm font-bold text-cyan-300">{fan.rpm} RPM</div>
                    <span className="text-[10px] text-emerald-400 font-sans">正常</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
