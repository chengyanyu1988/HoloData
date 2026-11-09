import React, { useState } from 'react';
import { Server, Zap, Thermometer, Layers, ChevronRight, Activity, AlertTriangle } from 'lucide-react';
import { DatacenterRack, ServerNode } from '../../types';

interface DatacenterRackViewProps {
  racks: DatacenterRack[];
  servers: ServerNode[];
  onSelectServer: (server: ServerNode) => void;
}

export const DatacenterRackView: React.FC<DatacenterRackViewProps> = ({
  racks,
  servers,
  onSelectServer,
}) => {
  const [selectedRackId, setSelectedRackId] = useState<string>(racks[0]?.id || 'RACK-A01');

  const activeRack = racks.find((r) => r.id === selectedRackId) || racks[0];

  const handleUnitClick = (nodeId?: string) => {
    if (!nodeId) return;
    const target = servers.find((s) => s.id === nodeId);
    if (target) {
      onSelectServer(target);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>机房机架与物理拓扑视图 (42U Racks)</span>
            <span className="text-xs font-normal text-slate-400">· 动力环境与微模块空间</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            可视化展示 DC-ZONE-A 机房 42U 标准冷热通道机柜、PDU 供电负荷、进出风口温度与刀片排布
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            机柜空间平均占用: <strong className="text-cyan-400">88.5%</strong>
          </span>
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            冷通道平均送风: <strong className="text-emerald-400">21.4°C</strong>
          </span>
        </div>
      </div>

      {/* Rack Selector Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {racks.map((rack) => (
          <button
            key={rack.id}
            onClick={() => setSelectedRackId(rack.id)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedRackId === rack.id
                ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-950/30'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-cyan-400 font-bold">{rack.id}</span>
              <span className="text-[11px] text-slate-400 font-mono">
                {rack.occupiedU}/{rack.totalU} U 已占用
              </span>
            </div>
            <div className="font-bold text-xs text-slate-200 truncate">{rack.name}</div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2">
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                {rack.powerLoadKW} kW
              </span>
              <span className="flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-cyan-400" />
                {rack.inletTempC}°C
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Active Rack Elevation Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: 42U Rack Elevation Graphic */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>{activeRack.name} 物理立面图 (42U Elevation)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              冷通道入风: {activeRack.inletTempC}°C · 热通道排风: {activeRack.exhaustTempC}°C
            </span>
          </div>

          {/* 42U Cabinet Container */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-inner max-w-xl mx-auto space-y-1">
            <div className="h-6 border-b border-slate-800 flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
              <span>机柜顶置理线架 / 顶部出线</span>
              <span>42U STANDARD RACK</span>
            </div>

            {/* Units list */}
            <div className="space-y-1 py-1">
              {activeRack.units.map((unit) => {
                const isOccupied = unit.status === 'occupied';
                const hasNodeId = Boolean(unit.nodeId);

                return (
                  <div
                    key={unit.uSlot}
                    onClick={() => hasNodeId && handleUnitClick(unit.nodeId)}
                    className={`h-9 px-3 rounded flex items-center justify-between text-xs font-mono transition-all ${
                      hasNodeId
                        ? 'cursor-pointer hover:border-cyan-400 hover:bg-slate-800'
                        : ''
                    } ${
                      unit.nodeStatus === 'critical'
                        ? 'bg-rose-950/40 border border-rose-500/50 text-rose-200'
                        : unit.nodeStatus === 'warning'
                        ? 'bg-amber-950/40 border border-amber-500/50 text-amber-200'
                        : isOccupied
                        ? 'bg-slate-900 border border-slate-800 text-slate-200'
                        : 'bg-slate-950/60 border border-dashed border-slate-800/60 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-500 w-6">
                        U{unit.uSlot}
                      </span>
                      {isOccupied ? (
                        <div className="flex items-center gap-2">
                          <Server className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="font-semibold text-slate-200">
                            {unit.hostname}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ({unit.role})
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-600 italic">空闲槽位 (Empty)</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {unit.nodeStatus === 'critical' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">
                          故障告警
                        </span>
                      )}
                      {unit.nodeStatus === 'warning' && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">
                          预警
                        </span>
                      )}
                      {hasNodeId && (
                        <span className="text-[10px] text-cyan-400 hover:underline">
                          点击检查 &gt;
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="h-6 border-t border-slate-800 flex items-center justify-between px-2 text-[10px] font-mono text-slate-500">
              <span>机柜底部重载防静电脚轮 / 底部强电 PDU</span>
              <span>10.0 kW 配电容量</span>
            </div>
          </div>
        </div>

        {/* Right: Environmental & Power Telemetry */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>机柜动力配电 (PDU Power)</span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">当前实时负荷</span>
                <span className="text-amber-400 font-bold">
                  {activeRack.powerLoadKW} kW / {activeRack.maxPowerKW} kW (
                  {((activeRack.powerLoadKW / activeRack.maxPowerKW) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${(activeRack.powerLoadKW / activeRack.maxPowerKW) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-slate-950 border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">A路进线电压</span>
                <span className="text-slate-200">224.2 V (15.2 A)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">B路进线电压</span>
                <span className="text-slate-200">223.8 V (15.1 A)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">功率因数 (PF)</span>
                <span className="text-emerald-400">0.998</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PUE 能耗指标</span>
                <span className="text-emerald-400">1.18 (绿色智算)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <span>微模块温湿度梯度场</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/30 text-center space-y-1">
                <span className="text-slate-500 text-[10px] block">冷通道送风温度</span>
                <span className="text-xl font-bold text-cyan-400">{activeRack.inletTempC}°C</span>
                <span className="text-emerald-400 text-[10px] block">ASHRAE A1 合规</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 text-center space-y-1">
                <span className="text-slate-500 text-[10px] block">热通道排风温度</span>
                <span className="text-xl font-bold text-amber-400">{activeRack.exhaustTempC}°C</span>
                <span className="text-slate-400 text-[10px] block">温差 ΔT = {(activeRack.exhaustTempC - activeRack.inletTempC).toFixed(1)}°C</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-800/30 border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              提示：机柜采用密封冷通道设计，支持按需风量自动调节与精密列间空调双回路备份。
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
