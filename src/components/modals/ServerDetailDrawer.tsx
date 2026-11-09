import React, { useState } from 'react';
import { X, Cpu, HardDrive, Network, Zap, Thermometer, Fan, ShieldAlert, Activity, CheckCircle, Terminal } from 'lucide-react';
import { ServerNode } from '../../types';

interface ServerDetailDrawerProps {
  server: ServerNode | null;
  onClose: () => void;
  onSimulateAction?: (action: string) => void;
}

export const ServerDetailDrawer: React.FC<ServerDetailDrawerProps> = ({
  server,
  onClose,
  onSimulateAction,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'hardware' | 'network' | 'ipmi'>('overview');
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  if (!server) return null;

  const handleTestPing = () => {
    setIsPinging(true);
    setPingStatus(null);
    setTimeout(() => {
      setIsPinging(false);
      setPingStatus(`Ping ${server.ip}: 64 bytes, seq=1 ttl=64 time=0.184 ms (0% packet loss)`);
    }, 600);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-start justify-between bg-slate-900/95">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-cyan-400 font-semibold">{server.id}</span>
              <h2 className="text-xl font-bold text-slate-100">{server.hostname}</h2>
              <span className={`text-xs px-2.5 py-0.5 rounded border font-medium ${getStatusColor(server.status)}`}>
                {server.status === 'normal' ? '健康运行' : server.status === 'warning' ? '负载预警' : '故障临界'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span>IP: {server.ip}</span>
              <span>·</span>
              <span>BMC: {server.bmcIp}</span>
              <span>·</span>
              <span>机架: {server.rack} ({server.rackUnit})</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800 bg-slate-900/50">
          {(['overview', 'hardware', 'network', 'ipmi'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-400 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'overview' && '综合概况'}
              {tab === 'hardware' && '主板与元器件传感器'}
              {tab === 'network' && '网卡与 RoCE 端口'}
              {tab === 'ipmi' && 'IPMI / 带外管控'}
            </button>
          ))}
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Primary Metric Strip */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>CPU 使用率</span>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                    {server.cpuUsage.toFixed(1)}%
                  </div>
                  <div className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        server.cpuUsage > 85 ? 'bg-rose-500' : server.cpuUsage > 70 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${server.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>内存占用</span>
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                    {((server.memUsedGB / server.memTotalGB) * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-slate-400 font-mono tabular-nums">
                    {server.memUsedGB}G / {server.memTotalGB}GB
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>CPU 核心温度</span>
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                    {server.cpuTemp.toFixed(1)}°C
                  </div>
                  <div className="text-xs text-slate-400">
                    安全阈值: &lt; 75.0°C
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-slate-800/40 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 flex items-center justify-between">
                    <span>散热风扇转速</span>
                    <Fan className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100 tabular-nums">
                    {server.fanSpeedRpm}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    RPM · {server.powerWatts}W 实时功耗
                  </div>
                </div>
              </div>

              {/* Hardware Specification Card */}
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">服务器硬件规格档案</h3>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">物理整机型号</span>
                    <span className="text-slate-200 font-medium">{server.model}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">集群工作角色</span>
                    <span className="text-slate-200 font-medium">{server.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">处理器型号</span>
                    <span className="text-slate-200 font-medium">{server.cpuModel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">物理与逻辑核心数</span>
                    <span className="text-slate-200 font-mono font-medium">{server.cpuCores} vCores / 128 Threads</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">操作系统环境</span>
                    <span className="text-slate-200 font-medium">{server.os}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">系统内核版本</span>
                    <span className="text-slate-200 font-mono font-medium">{server.kernel}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">连续稳定运行时间</span>
                    <span className="text-slate-200 font-medium">{server.uptimeDays} 天 (自上次例行维护)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">本地 NVMe 高速缓存</span>
                    <span className="text-slate-200 font-mono font-medium">{server.diskUsedTB}TB / {server.diskTotalTB}TB</span>
                  </div>
                </div>
              </div>

              {/* GPU Info (If Present) */}
              {server.gpuInfo && (
                <div className="p-4 rounded-lg bg-slate-800/40 border border-indigo-500/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      智算加速卡 (AI Acceleration Engine)
                    </h3>
                    <span className="text-xs text-indigo-400 font-mono">{server.gpuInfo.count}x SXM5 NVLink 4.0</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 block">显存与卡型</span>
                      <span className="text-slate-200 font-medium">{server.gpuInfo.model}</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 block">TensorCore 负载</span>
                      <span className="text-indigo-400 font-mono font-bold text-sm">{server.gpuInfo.usage}%</span>
                    </div>
                    <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800">
                      <span className="text-slate-400 block">GPU 核心温度</span>
                      <span className="text-amber-400 font-mono font-bold text-sm">{server.gpuInfo.temp}°C</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="p-4 rounded-lg bg-slate-800/20 border border-slate-800 space-y-3">
                <h3 className="text-xs font-semibold text-slate-300">快速运维诊断指令</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleTestPing}
                    disabled={isPinging}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors flex items-center gap-1.5"
                  >
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    {isPinging ? '正在测试 ICMP 延迟...' : '测试网络链路连通性 (Ping)'}
                  </button>
                  <button
                    onClick={() => onSimulateAction && onSimulateAction(`查看 ${server.hostname} 系统采集日志`)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                  >
                    调取实时 dmesg 日志
                  </button>
                  <button
                    onClick={() => onSimulateAction && onSimulateAction(`对 ${server.hostname} 触发一键健康巡检`)}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                  >
                    生成硬件健康体检单
                  </button>
                </div>
                {pingStatus && (
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400">
                    {pingStatus}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'hardware' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300">物理槽位与主板传感器实时矩阵</h3>

              {/* Memory Slots DIMM */}
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-200">16 槽位 DDR5 ECC 内存阵列</span>
                  <span className="text-xs text-emerald-400 font-mono">16/16 插满 · 4800 MT/s</span>
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-slate-900 border border-emerald-500/30 text-center hover:border-emerald-400 transition-colors"
                    >
                      <div className="text-[10px] text-slate-400 font-mono">DIMM{i + 1}</div>
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        {Math.round(server.memTotalGB / 16)}G
                      </div>
                      <div className="text-[9px] text-slate-500">32°C</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Redundant Power Supply (PSU) */}
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-3">
                <span className="text-xs font-medium text-slate-200 block">双路铂金冗余电源 (1+1 Redundant PSU)</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded bg-slate-900 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">PSU 1 (AC A路进线)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono">输入: 224V · 输出功率: {Math.round(server.powerWatts * 0.52)}W</div>
                    <div className="text-[11px] text-emerald-400 font-mono">效率: 94.2% · 温度: 36.1°C</div>
                  </div>
                  <div className="p-3 rounded bg-slate-900 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">PSU 2 (AC B路进线)</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-xs text-slate-400 font-mono">输入: 223V · 输出功率: {Math.round(server.powerWatts * 0.48)}W</div>
                    <div className="text-[11px] text-emerald-400 font-mono">效率: 93.9% · 温度: 35.8°C</div>
                  </div>
                </div>
              </div>

              {/* Cooling Fans */}
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-3">
                <span className="text-xs font-medium text-slate-200 block">高风压热插拔散热风扇矩阵 (Fan Modules)</span>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-center">
                      <Fan className="w-4 h-4 mx-auto text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="text-[11px] font-mono text-slate-300 mt-1">FAN-{i + 1}</div>
                      <div className="text-xs font-mono font-bold text-cyan-400">
                        {server.fanSpeedRpm - (i * 80)} RPM
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'network' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300">网络物理接口与链路聚合</h3>
              <div className="space-y-3">
                {server.nics.map((nic) => (
                  <div key={nic.name} className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Network className="w-4 h-4 text-cyan-400" />
                        <span className="font-mono text-sm font-semibold text-slate-200">{nic.name}</span>
                        <span className="text-[11px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                          {nic.speed}
                        </span>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        LINK UP
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[11px]">实时接收带宽 (RX)</span>
                        <span className="text-slate-200 font-bold">{(nic.rxMbps / 1000).toFixed(2)} Gbps</span>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <span className="text-slate-500 block text-[11px]">实时发送带宽 (TX)</span>
                        <span className="text-slate-200 font-bold">{(nic.txMbps / 1000).toFixed(2)} Gbps</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ipmi' && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-300">BMC / IPMI 2.0 带外管理通道</h3>
              <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-800 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-500 block">BMC 管理 IP</span>
                    <span className="text-cyan-400 font-mono font-medium">{server.bmcIp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">MAC 物理地址</span>
                    <span className="text-slate-300 font-mono">52:54:00:8A:3E:12</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">固件版本 (Firmware)</span>
                    <span className="text-slate-300 font-mono">iDRAC9 Enterprise v7.00.00</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">远程控制协议</span>
                    <span className="text-slate-300 font-mono">Redfish / IPMI v2.0 / HTTPS</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-3">
                  <span className="text-xs font-medium text-slate-300 block mb-2">安全带外控制指令</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onSimulateAction && onSimulateAction(`连接 ${server.hostname} 的虚拟 KVM`)}
                      className="px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
                    >
                      打开远程虚拟 KVM 控制台
                    </button>
                    <button
                      onClick={() => onSimulateAction && onSimulateAction(`请求重置 ${server.hostname} BMC 密码`)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    >
                      重置 BMC 控制器
                    </button>
                    <button
                      onClick={() => onSimulateAction && onSimulateAction(`定位物理指示灯闪烁 (Blink LED)`)}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    >
                      点亮物理机箱 UID 指示灯
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">数据全息遥测探针: Hologram-Probe v4.2</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            关闭抽屉
          </button>
        </div>
      </div>
    </div>
  );
};
