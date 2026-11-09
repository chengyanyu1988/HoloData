import React, { useState } from 'react';
import { 
  Network, Search, Server, Shield, ShieldAlert, Cpu, 
  Activity, ArrowDownLeft, ArrowUpRight, CheckCircle2, 
  Clock, AlertTriangle, Layers, Radio, ChevronRight, ChevronDown,
  Folder, FileText, RefreshCw, BarChart2
} from 'lucide-react';

export interface NetworkDeviceDetail {
  id: string;
  name: string;
  category: '交换机' | '防火墙';
  location: string;
  description: string;
  contact: string;
  oid: string;
  uptime: string;
  model: string;
  ip: string;
  portType: string;
  portOutSpeedMbps: number;
  portInSpeedMbps: number;
  packetRatePerSec: number;
  dropInPackets: number;
  dropOutPackets: number;
  errorInPackets: number;
  errorOutPackets: number;
  portStatus: 'UP (正常联通)' | 'DOWN (离线)' | 'DEGRADED (降级)';
  cpuUsage: number; // percentage
  memoryTotalGB: number;
  memoryUsedGB: number;
  firewallRulesCount?: number;
  firewallBlockedPackets?: number;
  firewallSessionsActive?: number;
}

export const NETWORK_DEVICES_DATA: NetworkDeviceDetail[] = [
  {
    id: 'SW-HOLO-01',
    name: '华为 CloudEngine 16800 核心骨干交换机-01',
    category: '交换机',
    location: 'DC-ZONE-A 机房 A-01 列机柜 U41-U44',
    description: '全息大数据中心 400G 无损以太网 RoCE 核心 Spine 脊交换机',
    contact: '程总工 (13800108821) / 网络二组',
    oid: '1.3.6.1.4.1.2011.2.240.16800.1',
    uptime: '184天 14小时 32分 (启动于 2026-05-05 06:00)',
    model: 'Huawei CloudEngine 16804 400GE/100GE',
    ip: '10.120.0.1',
    portType: '400GE QSFP-DD 光纤端口 (400Gbps 双全工)',
    portOutSpeedMbps: 184500,
    portInSpeedMbps: 219200,
    packetRatePerSec: 14200000,
    dropInPackets: 0,
    dropOutPackets: 0,
    errorInPackets: 0,
    errorOutPackets: 0,
    portStatus: 'UP (正常联通)',
    cpuUsage: 35,
    memoryTotalGB: 36,
    memoryUsedGB: 8,
  },
  {
    id: 'SW-HOLO-02',
    name: '华为 CloudEngine 16800 核心骨干交换机-02',
    category: '交换机',
    location: 'DC-ZONE-A 机房 A-02 列机柜 U41-U44',
    description: '全息大数据中心 400G 无损以太网 RoCE 备份 Spine 冗余节点',
    contact: '程总工 (13800108821) / 网络二组',
    oid: '1.3.6.1.4.1.2011.2.240.16800.2',
    uptime: '184天 14小时 30分 (启动于 2026-05-05 06:02)',
    model: 'Huawei CloudEngine 16804 400GE/100GE',
    ip: '10.120.0.2',
    portType: '400GE QSFP-DD 光纤端口 (400Gbps 双全工)',
    portOutSpeedMbps: 162000,
    portInSpeedMbps: 198000,
    packetRatePerSec: 12800000,
    dropInPackets: 0,
    dropOutPackets: 0,
    errorInPackets: 0,
    errorOutPackets: 0,
    portStatus: 'UP (正常联通)',
    cpuUsage: 28,
    memoryTotalGB: 36,
    memoryUsedGB: 7,
  },
  {
    id: 'SW-HOLO-03',
    name: '思科 Nexus 9336C-FX2 计算区TOR叶交换机',
    category: '交换机',
    location: 'DC-ZONE-A 机房 B-03 列机柜 U42',
    description: 'GPU AI 与实时分布式计算区 Leaf 叶交换机',
    contact: '李工 (13911029931) / 智算基础设施组',
    oid: '1.3.6.1.4.1.9.1.2588',
    uptime: '92天 08小时 14分 (启动于 2026-08-05 12:18)',
    model: 'Cisco Nexus 9336C-FX2 36-Port 100G',
    ip: '10.120.0.15',
    portType: '100GE QSFP28 光模块',
    portOutSpeedMbps: 68400,
    portInSpeedMbps: 84200,
    packetRatePerSec: 5400000,
    dropInPackets: 0,
    dropOutPackets: 0,
    errorInPackets: 0,
    errorOutPackets: 0,
    portStatus: 'UP (正常联通)',
    cpuUsage: 42,
    memoryTotalGB: 32,
    memoryUsedGB: 11,
  },
  {
    id: 'FW-HOLO-01',
    name: '山石网科下一代数据中心万兆防火墙-01',
    category: '防火墙',
    location: 'DC-ZONE-A 机房 边界网关机架 G-01 U38-U40',
    description: '数据全息平台外网边界入侵防御与安全策略强隔离中心',
    contact: '安全运维部 (010-88291008)',
    oid: '1.3.6.1.4.1.28533.2.1.8000',
    uptime: '150天 02小时 10分 (启动于 2026-06-08 18:22)',
    model: 'Hillstone K系列智能云数据中心防火墙',
    ip: '10.120.254.1',
    portType: '100GE SFP28 / 40GE 混合汇聚口',
    portOutSpeedMbps: 24500,
    portInSpeedMbps: 31200,
    packetRatePerSec: 2800000,
    dropInPackets: 12,
    dropOutPackets: 0,
    errorInPackets: 0,
    errorOutPackets: 0,
    portStatus: 'UP (正常联通)',
    cpuUsage: 31,
    memoryTotalGB: 64,
    memoryUsedGB: 18,
    firewallRulesCount: 1420,
    firewallBlockedPackets: 284100,
    firewallSessionsActive: 198000,
  },
  {
    id: 'FW-HOLO-02',
    name: '深信服云边界应用安全网关 AF-8000',
    category: '防火墙',
    location: 'DC-ZONE-A 机房 边界网关机架 G-02 U38-U40',
    description: '南北向 API 网关与电子标识外部递归解析访问防护网关',
    contact: '安全运维部 (010-88291008)',
    oid: '1.3.6.1.4.1.35047.1.8000',
    uptime: '110天 19小时 45分 (启动于 2026-07-18 00:48)',
    model: 'Sangfor AF-8000 NextGen Application Firewall',
    ip: '10.120.254.2',
    portType: '40GE 聚合防护口',
    portOutSpeedMbps: 19800,
    portInSpeedMbps: 24600,
    packetRatePerSec: 1950000,
    dropInPackets: 5,
    dropOutPackets: 0,
    errorInPackets: 0,
    errorOutPackets: 0,
    portStatus: 'UP (正常联通)',
    cpuUsage: 25,
    memoryTotalGB: 48,
    memoryUsedGB: 12,
    firewallRulesCount: 960,
    firewallBlockedPackets: 154200,
    firewallSessionsActive: 124000,
  },
  {
    id: 'FW-HOLO-03',
    name: '工业物联网电子标识隔离防火墙-03',
    category: '防火墙',
    location: '生产制造区 现场工业网关柜 E-01',
    description: '工业互联网标识解析产线端与核心数据中心安全隔离闸机',
    contact: '智能产线安全专班 (010-88291009)',
    oid: '1.3.6.1.4.1.28533.2.1.3000',
    uptime: '75天 11小时 20分 (启动于 2026-08-22 09:14)',
    model: 'InHand 工业安全网关与白名单工业防火墙',
    ip: '10.120.254.10',
    portType: '10GE 工业航空光纤插口',
    portOutSpeedMbps: 4200,
    portInSpeedMbps: 5800,
    packetRatePerSec: 420000,
    dropInPackets: 0,
    dropOutPackets: 0,
    errorInPackets: 0,
    errorOutPackets: 0,
    portStatus: 'UP (正常联通)',
    cpuUsage: 18,
    memoryTotalGB: 16,
    memoryUsedGB: 3,
    firewallRulesCount: 420,
    firewallBlockedPackets: 32400,
    firewallSessionsActive: 38000,
  },
];

interface Props {
  onRefresh?: () => void;
}

export const PrototypeNetworkMonitorView: React.FC<Props> = ({ onRefresh }) => {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string>(NETWORK_DEVICES_DATA[0].id);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    交换机: true,
    防火墙: true,
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const selectedDevice = NETWORK_DEVICES_DATA.find(d => d.id === selectedId) || NETWORK_DEVICES_DATA[0];

  const switchList = NETWORK_DEVICES_DATA.filter(
    d => d.category === '交换机' && (d.name.includes(search) || d.id.includes(search) || d.ip.includes(search))
  );

  const firewallList = NETWORK_DEVICES_DATA.filter(
    d => d.category === '防火墙' && (d.name.includes(search) || d.id.includes(search) || d.ip.includes(search))
  );

  // CPU Pie chart calculations
  const cpuUsed = selectedDevice.cpuUsage;
  const cpuFree = 100 - cpuUsed;

  // Memory Donut calculations
  const memUsedGB = selectedDevice.memoryUsedGB;
  const memTotalGB = selectedDevice.memoryTotalGB;
  const memUsedPercent = Math.round((memUsedGB / memTotalGB) * 100);
  const memFreePercent = 100 - memUsedPercent;

  return (
    <div className="space-y-4">
      {/* Top Banner Navigation / Location Breadcrumb Header matching prototype */}
      <div className="flex items-center justify-between bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Network className="w-4 h-4" />
          </span>
          <span className="text-cyan-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">IT设备监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">网络设备监控</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
            {selectedDevice.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>遥测状态: 全双工在线</span>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              刷新
            </button>
          )}
        </div>
      </div>

      {/* Main 2-Column Layout based on Axure prototype screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: 监控列表 (Tree View with Search) */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col h-[760px] shadow-sm">
          {/* Section Header */}
          <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-cyan-400 rounded-full" />
              <span>监控列表</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold">
              {switchList.length + firewallList.length} 台设备
            </span>
          </div>

          {/* Search Input */}
          <div className="mt-3 relative">
            <input
              type="text"
              placeholder="请输入名称、IP或编号..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
          </div>

          {/* Tree Navigation */}
          <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1 text-xs select-none">
            {/* 1. 交换机 Node */}
            <div className="space-y-1">
              <button
                onClick={() => toggleCategory('交换机')}
                className="w-full flex items-center gap-1.5 text-slate-200 font-bold px-2 py-1.5 rounded-md hover:bg-slate-800/60 transition-colors"
              >
                {expandedCategories['交换机'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                <Folder className="w-3.5 h-3.5 text-cyan-400" />
                <span>交换机 ({switchList.length})</span>
              </button>

              {expandedCategories['交换机'] && (
                <div className="pl-5 space-y-1 border-l border-slate-800/80 ml-3">
                  {switchList.map((sw) => {
                    const isSelected = selectedId === sw.id;
                    return (
                      <button
                        key={sw.id}
                        onClick={() => setSelectedId(sw.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-start gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 shadow-xs'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="truncate">
                          <div className="font-medium truncate">{sw.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{sw.ip}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. 防火墙 Node */}
            <div className="space-y-1 pt-2 border-t border-slate-800/60">
              <button
                onClick={() => toggleCategory('防火墙')}
                className="w-full flex items-center gap-1.5 text-slate-200 font-bold px-2 py-1.5 rounded-md hover:bg-slate-800/60 transition-colors"
              >
                {expandedCategories['防火墙'] ? (
                  <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                )}
                <Shield className="w-3.5 h-3.5 text-indigo-400" />
                <span>防火墙 ({firewallList.length})</span>
              </button>

              {expandedCategories['防火墙'] && (
                <div className="pl-5 space-y-1 border-l border-slate-800/80 ml-3">
                  {firewallList.map((fw) => {
                    const isSelected = selectedId === fw.id;
                    return (
                      <button
                        key={fw.id}
                        onClick={() => setSelectedId(fw.id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-start gap-2 ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 shadow-xs'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="truncate">
                          <div className="font-medium truncate">{fw.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{fw.ip}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Area: Detail Cards & Visualizations matching prototype layout */}
        <div className="lg:col-span-9 space-y-4">
          {/* Top Row: 基础信息 + 网络详情 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 基础信息 Panel (col-span-5) */}
            <div className="md:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
                  <span>基础信息</span>
                </h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedDevice.portStatus.split(' ')[0]}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">名称:</span>
                  <span className="text-slate-100 font-semibold break-all">{selectedDevice.name}</span>
                </div>

                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">设备位置:</span>
                  <span className="text-slate-200 break-all">{selectedDevice.location}</span>
                </div>

                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">描述信息:</span>
                  <span className="text-slate-300 break-all">{selectedDevice.description}</span>
                </div>

                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">联系方式:</span>
                  <span className="text-cyan-300 font-mono break-all">{selectedDevice.contact}</span>
                </div>

                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">设备OID:</span>
                  <span className="text-slate-300 font-mono text-[11px] break-all">{selectedDevice.oid}</span>
                </div>

                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">设备运行时长:</span>
                  <span className="text-emerald-400 font-mono text-[11px] break-all">{selectedDevice.uptime}</span>
                </div>

                <div className="flex">
                  <span className="text-slate-400 w-24 shrink-0 font-medium">硬件型号名称:</span>
                  <span className="text-slate-200 font-mono break-all">{selectedDevice.model}</span>
                </div>
              </div>
            </div>

            {/* 网络 Panel (col-span-7) */}
            <div className="md:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
                  <span>网络</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  IP: <strong className="text-cyan-300">{selectedDevice.ip}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">端口类型:</span>
                  <span className="text-slate-200 font-mono break-all">{selectedDevice.portType}</span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">错误入站包:</span>
                  <span className="text-slate-200 font-mono">{selectedDevice.errorInPackets} 个</span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">端口出速率:</span>
                  <span className="text-cyan-300 font-mono font-bold">
                    {(selectedDevice.portOutSpeedMbps / 1000).toFixed(1)} Gbps
                  </span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">错误出站包:</span>
                  <span className="text-slate-200 font-mono">{selectedDevice.errorOutPackets} 个</span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">端口入速率:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {(selectedDevice.portInSpeedMbps / 1000).toFixed(1)} Gbps
                  </span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">端口状态:</span>
                  <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {selectedDevice.portStatus}
                  </span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">端口包速:</span>
                  <span className="text-slate-200 font-mono">
                    {(selectedDevice.packetRatePerSec / 1000000).toFixed(2)} Mpps
                  </span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2">
                  <span className="text-slate-400 shrink-0 font-medium">丢弃入站包:</span>
                  <span className="text-slate-200 font-mono">{selectedDevice.dropInPackets} 个</span>
                </div>

                <div className="flex justify-between sm:justify-start sm:gap-2 sm:col-span-2">
                  <span className="text-slate-400 shrink-0 font-medium">丢弃出站包:</span>
                  <span className="text-slate-200 font-mono">{selectedDevice.dropOutPackets} 个 (无丢包)</span>
                </div>
              </div>

              {/* Live Flow Rate Mini-Bar */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 text-[10px] flex items-center gap-1">
                    <ArrowDownLeft className="w-3 h-3 text-emerald-400" />
                    入站实时流量 (Inbound)
                  </div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">
                    {selectedDevice.portInSpeedMbps.toLocaleString()} Mbps
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800">
                  <div className="text-slate-500 text-[10px] flex items-center gap-1">
                    <ArrowUpRight className="w-3 h-3 text-cyan-400" />
                    出站实时流量 (Outbound)
                  </div>
                  <div className="text-sm font-bold text-cyan-300 mt-1">
                    {selectedDevice.portOutSpeedMbps.toLocaleString()} Mbps
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: 3 Panels matching screenshot layout */}
          {/* 1. CPU使用率 (Pie) | 2. 内存利用率 (Donut) | 3. 防火墙 (Status or Standby Icon) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. CPU使用率 现代化工业仪表盘 + 历史趋势 / 多核状态 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[360px]">
              <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>CPU使用率与核心负荷</span>
                </h4>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                    cpuUsed > 80 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                    cpuUsed > 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}>
                    {cpuUsed}%
                  </span>
                </div>
              </div>

              {/* Modern Semi-Circular Radial Gauge */}
              <div className="flex-1 flex flex-col items-center justify-center relative py-1">
                <div className="relative w-48 h-28 flex items-end justify-center overflow-hidden">
                  <svg className="w-48 h-48 absolute top-0" viewBox="0 0 100 100">
                    {/* Background Arc: 180 degrees (from 180 to 0) */}
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke="#1e293b"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Tick markers */}
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke="#334155"
                      strokeWidth="10"
                      strokeDasharray="1.5 5.5"
                      strokeLinecap="butt"
                    />
                    {/* Active Gauge Arc */}
                    <path
                      d="M 12 50 A 38 38 0 0 1 88 50"
                      fill="none"
                      stroke="url(#cpuGradient)"
                      strokeWidth="10"
                      strokeDasharray="119.38"
                      strokeDashoffset={`${119.38 - (cpuUsed / 100) * 119.38}`}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                    <defs>
                      <linearGradient id="cpuGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="65%" stopColor="#3b82f6" />
                        <stop offset="90%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Center Value */}
                  <div className="text-center mb-1 z-10 select-none">
                    <div className="text-2xl font-black font-mono text-slate-100 tracking-tight">
                      {cpuUsed}<span className="text-sm font-normal text-cyan-400">%</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                      Load Index
                    </div>
                  </div>
                </div>

                {/* Multi-Core Micro Bars (Core 1 - Core 4) */}
                <div className="w-full mt-2 grid grid-cols-4 gap-1.5 px-2">
                  {[
                    { label: 'C1', val: Math.min(100, Math.max(10, cpuUsed + 6)) },
                    { label: 'C2', val: Math.min(100, Math.max(10, cpuUsed - 4)) },
                    { label: 'C3', val: Math.min(100, Math.max(10, cpuUsed + 2)) },
                    { label: 'C4', val: Math.min(100, Math.max(10, cpuUsed - 8)) },
                  ].map((c) => (
                    <div key={c.label} className="bg-slate-950/70 border border-slate-800 rounded p-1.5 text-center">
                      <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between">
                        <span>{c.label}</span>
                        <span className="text-slate-300 font-bold">{c.val}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 rounded-full"
                          style={{ width: `${c.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">系统空闲率: <strong className="text-emerald-400">{cpuFree}%</strong></span>
                <span className="text-slate-400">运行温度: <strong className="text-cyan-300">42.5°C</strong></span>
              </div>
            </div>

            {/* 2. 内存利用率 仪表盘多段堆叠进度 + 缓存/Buffer分解图表 */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[360px]">
              <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>内存空间分布与分配率</span>
                </h4>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {memUsedPercent}%
                  </span>
                </div>
              </div>

              {/* Segmented Stack & Memory Capacity Breakdown */}
              <div className="flex-1 flex flex-col justify-center px-1 space-y-3.5">
                {/* Big Overview Counter */}
                <div className="flex items-baseline justify-between px-1">
                  <div>
                    <span className="text-2xl font-black font-mono text-slate-100">{memUsedGB}</span>
                    <span className="text-xs text-slate-400 ml-1 font-mono">GB 已用</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-mono">总容量: </span>
                    <span className="text-sm font-bold font-mono text-cyan-300">{memTotalGB} GB</span>
                  </div>
                </div>

                {/* Multi-Segment Stacked Visual Bar */}
                <div className="space-y-1">
                  <div className="w-full h-4 bg-slate-950 rounded-lg p-0.5 border border-slate-800 flex overflow-hidden gap-0.5">
                    {/* Process Allocated Memory (Rose/Amber) */}
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xs transition-all duration-500"
                      style={{ width: `${memUsedPercent * 0.7}%` }}
                      title={`应用常驻内存: ${(memUsedGB * 0.7).toFixed(1)} GB`}
                    />
                    {/* Buffers / Page Cache (Indigo) */}
                    <div
                      className="h-full bg-indigo-500 rounded-xs transition-all duration-500"
                      style={{ width: `${memUsedPercent * 0.3}%` }}
                      title={`Buffer / PageCache: ${(memUsedGB * 0.3).toFixed(1)} GB`}
                    />
                    {/* Available / Free (Emerald/Slate) */}
                    <div
                      className="h-full bg-slate-800/70 rounded-xs transition-all duration-500 flex-1"
                      title={`空闲可用内存: ${memTotalGB - memUsedGB} GB`}
                    />
                  </div>

                  <div className="flex justify-between text-[10px] font-mono text-slate-500 px-0.5">
                    <span>0 GB</span>
                    <span>{(memTotalGB / 2).toFixed(0)} GB</span>
                    <span>{memTotalGB} GB</span>
                  </div>
                </div>

                {/* Detail Distribution Cards */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      应用常驻
                    </div>
                    <div className="text-slate-200 font-bold mt-0.5">{(memUsedGB * 0.7).toFixed(1)}G</div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      系统Cache
                    </div>
                    <div className="text-slate-200 font-bold mt-0.5">{(memUsedGB * 0.3).toFixed(1)}G</div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      完全空闲
                    </div>
                    <div className="text-emerald-400 font-bold mt-0.5">{memTotalGB - memUsedGB}G</div>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">内存分配策略: <strong className="text-cyan-300">HugePages 2M</strong></span>
                <span className="text-slate-400">Swap 分区: <strong className="text-emerald-400">0% (无溢出)</strong></span>
              </div>
            </div>

            {/* 3. 防火墙 (待增加 / 防火墙安全状态) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between h-[360px]">
              <div className="pb-2 border-b border-slate-800/80 flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-1.5 h-3.5 bg-cyan-400 rounded-full" />
                  <span>防火墙</span>
                </h4>
                {selectedDevice.category === '防火墙' ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    安全防护启用中
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    核心交换直连模式
                  </span>
                )}
              </div>

              {selectedDevice.category === '防火墙' ? (
                <div className="flex-1 flex flex-col justify-center space-y-3 p-2">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">活跃安全策略规则:</span>
                    <span className="text-cyan-300 font-bold">{selectedDevice.firewallRulesCount || 1420} 条</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">拦截恶意攻击数据包:</span>
                    <span className="text-rose-400 font-bold">{(selectedDevice.firewallBlockedPackets || 284100).toLocaleString()} 个</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">当前活跃连接会话:</span>
                    <span className="text-emerald-400 font-bold">{(selectedDevice.firewallSessionsActive || 198000).toLocaleString()}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center text-xs text-emerald-400 font-medium">
                    ✓ 联动入侵防御系统 (IPS) 实时阻断
                  </div>
                </div>
              ) : (
                /* Watermark / Hourglass placeholder matching prototype screenshot when switch has no dedicated firewall */
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
                  <div className="w-20 h-20 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center mb-3 text-cyan-400/40">
                    <ShieldAlert className="w-10 h-10" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    当前设备受主边界防火墙群集保护
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1 font-mono">
                    旁路镜像流量清洗与态势感知同步中
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>防勒索 / 漏洞扫描: 正常</span>
                <span className="text-cyan-400 cursor-pointer hover:underline">安全态势下钻 &gt;</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
