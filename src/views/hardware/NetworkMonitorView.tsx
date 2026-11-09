import React, { useState } from 'react';
import { Network, Activity, ArrowUpRight, ArrowDownLeft, ShieldCheck, CheckCircle2, RefreshCw } from 'lucide-react';
import { NetworkDevice } from '../../types';

interface NetworkMonitorViewProps {
  networks: NetworkDevice[];
}

export const NetworkMonitorView: React.FC<NetworkMonitorViewProps> = ({ networks }) => {
  const [selectedDevice, setSelectedDevice] = useState<string>(networks[0]?.id || 'NET-01');

  const activeDevice = networks.find((n) => n.id === selectedDevice) || networks[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>网络设备与 400G RoCE Fabric 监控</span>
            <span className="text-xs font-normal text-slate-400">· 无损网络拓扑</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控核心脊交换机 (Spine)、计算区叶交换机 (Leaf)、带外管控网与 RDMA 流量饱和度
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            全网平均丢包率: <strong className="text-emerald-400">0.0001%</strong>
          </span>
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            总出口带宽: <strong className="text-cyan-400">1.6 Tbps</strong>
          </span>
        </div>
      </div>

      {/* Network Equipment Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {networks.map((net) => (
          <button
            key={net.id}
            onClick={() => setSelectedDevice(net.id)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedDevice === net.id
                ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-950/30'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-xs text-cyan-400 font-semibold">{net.id}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {net.activePorts}/{net.totalPorts}P
              </span>
            </div>
            <div className="font-bold text-xs text-slate-200 truncate">{net.name}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">{net.managementIp}</div>
          </button>
        ))}
      </div>

      {/* Detail Focus Panel */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-5 h-5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100">{activeDevice.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {activeDevice.role}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              设备型号: {activeDevice.model} · 上行汇聚速率: {activeDevice.uplinkSpeed} · 工作温度: {activeDevice.temperature}°C
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 text-[10px] flex items-center gap-1">
                <ArrowDownLeft className="w-3 h-3 text-cyan-400" />
                入向实时流速 (Inbound)
              </div>
              <div className="text-sm font-bold text-slate-200">{activeDevice.inboundGbps} Gbps</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-slate-500 text-[10px] flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                出向实时流速 (Outbound)
              </div>
              <div className="text-sm font-bold text-slate-200">{activeDevice.outboundGbps} Gbps</div>
            </div>
          </div>
        </div>

        {/* Visual Port Density Panel */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">
              高密物理端口状态分布面板 ({activeDevice.activePorts} 端口在线 / {activeDevice.totalPorts} 总端口)
            </span>
            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-emerald-400" />
                Link Up (连接正常)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-xs bg-slate-800" />
                Empty / Standby
              </span>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 grid grid-cols-8 sm:grid-cols-16 md:grid-cols-24 gap-1.5">
            {Array.from({ length: activeDevice.totalPorts }).map((_, idx) => {
              const isUp = idx < activeDevice.activePorts;
              return (
                <div
                  key={idx}
                  className={`h-7 rounded flex items-center justify-center text-[10px] font-mono font-bold transition-all ${
                    isUp
                      ? 'bg-emerald-500/80 text-slate-950 hover:bg-emerald-400 hover:scale-105'
                      : 'bg-slate-800/80 text-slate-600'
                  }`}
                  title={`端口 Eth1/${idx + 1}: ${isUp ? '100G/400G Connected' : 'Unplugged'}`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Routing & Protocol Health */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[11px]">BGP 活跃对等体 (Peers)</span>
            <span className="text-slate-200 font-bold text-sm">{activeDevice.bgpPeers} Established</span>
            <span className="text-emerald-400 block text-[10px]">EVPN / VXLAN 宣告正常</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[11px]">RoCE 拥塞通知包 (CNP)</span>
            <span className="text-slate-200 font-bold text-sm">0 Drops / sec</span>
            <span className="text-emerald-400 block text-[10px]">PFC 优先级流控使能</span>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[11px]">链路聚合 (LACP Bond)</span>
            <span className="text-slate-200 font-bold text-sm">8x 100G MLAG 双活</span>
            <span className="text-cyan-400 block text-[10px]">HA 冗余热切换延迟 &lt; 5ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
