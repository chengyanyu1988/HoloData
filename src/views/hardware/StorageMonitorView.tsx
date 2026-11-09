import React, { useState } from 'react';
import { HardDrive, Activity, AlertTriangle, CheckCircle, RefreshCw, Layers, ShieldCheck, Database } from 'lucide-react';
import { StorageDevice } from '../../types';

interface StorageMonitorViewProps {
  storages: StorageDevice[];
  onTriggerScan?: (storageId: string) => void;
}

export const StorageMonitorView: React.FC<StorageMonitorViewProps> = ({
  storages,
  onTriggerScan,
}) => {
  const [scanningId, setScanningId] = useState<string | null>(null);

  const handleScan = (id: string) => {
    setScanningId(id);
    setTimeout(() => {
      setScanningId(null);
      if (onTriggerScan) onTriggerScan(id);
    }, 1200);
  };

  const totalCap = storages.reduce((acc, s) => acc + s.capacityTB, 0);
  const totalUsed = storages.reduce((acc, s) => acc + s.usedTB, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>存储设备与全闪资源池监控</span>
            <span className="text-xs font-normal text-slate-400">· 全息分布式存储矩阵</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控 NVMe-oF 极速全闪池、Ceph 分布式对象/块存储、企业级 SAN 阵列与 IOPS 读写时延
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            存储总可用容量: <strong className="text-cyan-400">{(totalCap / 1024).toFixed(1)} PB</strong>
          </span>
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            全网平均 IOPS: <strong className="text-emerald-400">1,035,000</strong>
          </span>
        </div>
      </div>

      {/* Storage Overview KPI Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>全域已占用存储</span>
            <HardDrive className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {(totalUsed / 1024).toFixed(2)} <span className="text-xs text-slate-400 font-normal">PB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full"
              style={{ width: `${(totalUsed / totalCap) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>总容量: {(totalCap / 1024).toFixed(1)} PB</span>
            <span>占用: {((totalUsed / totalCap) * 100).toFixed(1)}%</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>NVMe-oF 4K 随机读时延</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            0.18 <span className="text-xs text-slate-400 font-normal">毫秒</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            写时延: 0.24ms · 协议: RDMA RoCE
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>磁盘阵列健康评级</span>
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-400">
            96.8 <span className="text-xs text-slate-400 font-normal">/ 100 分</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            4套主存储阵列 · 1套热重建中
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>冗余纠删码机制 (EC)</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            8 + 4 <span className="text-xs text-slate-400 font-normal">纠删码</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            容忍任意 4 个 OSD 故障无丢失
          </div>
        </div>
      </div>

      {/* Storage Pools List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {storages.map((device) => (
          <div
            key={device.id}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-colors space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-semibold">{device.id}</span>
                  <h3 className="text-sm font-bold text-slate-100">{device.name}</h3>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {device.type} · {device.vendor}
                </div>
              </div>

              <span
                className={`text-[11px] px-2 py-0.5 rounded border font-medium ${
                  device.status === 'normal'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}
              >
                {device.status === 'normal' ? '健康在线' : '热备重建中'}
              </span>
            </div>

            {/* Capacity Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">容量占用水位</span>
                <span className="text-slate-200">
                  {device.usedTB} TB / {device.capacityTB} TB (
                  {((device.usedTB / device.capacityTB) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-cyan-500 h-full rounded-full"
                  style={{ width: `${(device.usedTB / device.capacityTB) * 100}%` }}
                />
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">峰值 IOPS</span>
                <span className="text-cyan-400 font-bold">{device.iops.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">读写延迟</span>
                <span className="text-slate-200">
                  {device.readLatencyMs} / {device.writeLatencyMs} ms
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RAID 保护架构</span>
                <span className="text-slate-300 truncate block">{device.raidType}</span>
              </div>
            </div>

            {/* Rebuild State if Any */}
            {device.rebuildProgress && (
              <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs text-amber-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    热备盘自动校验重建中 (Rebuilding)
                  </span>
                  <span className="font-mono font-bold">{device.rebuildProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all"
                    style={{ width: `${device.rebuildProgress}%` }}
                  />
                </div>
                <div className="text-[11px] text-amber-400/80">
                  热备盘槽位 Slot 14 正在全速同步数据块，预计还需 42 分钟完成验收。
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500 font-mono">
                传感器温度: {device.temperature}°C
              </span>
              <button
                onClick={() => handleScan(device.id)}
                disabled={scanningId === device.id}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-cyan-400 ${
                    scanningId === device.id ? 'animate-spin' : ''
                  }`}
                />
                {scanningId === device.id ? '正在扫描坏块...' : '触发 SMART 巡检'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
