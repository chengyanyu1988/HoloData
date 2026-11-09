import React, { useState } from 'react';
import { OperatingSystemMetric } from '../../types';
import {
  Server, RefreshCw, Terminal, Search, Activity,
  ShieldCheck, HardDrive, Cpu, Wifi, Users, Layers,
  ChevronRight, ArrowUpRight, ArrowDownLeft, Clock,
  PieChart, Gauge, Database, Monitor, Disc, Network, Zap
} from 'lucide-react';

interface Props {
  osMetrics: OperatingSystemMetric[];
  onOpenTerminal: (name: string, ip: string) => void;
  onRefresh: () => void;
}

interface TreeSystemItem {
  id: string;
  hostname: string;
  ip: string;
  osCategory: 'Linux' | 'Windows';
  osFullName: string;
  uptime: string;
  bootTime: string;
  status: 'online' | 'warning';
  cpuUsage: number;
  memTotalGB: number;
  memUsedGB: number;
  swapTotalGB: number;
  swapUsedGB: number;
  netInMbps: number;
  netOutMbps: number;
  totalProcesses: number;
  runningProcesses: number;
  loginUsers: number;
  mounts: {
    name: string;
    mountPoint: string;
    totalGB: number;
    usedGB: number;
    fsType: string;
  }[];
  diskSpace: {
    totalGB: number;
    usedGB: number;
    freeGB: number;
  };
  diskIoRates: number[]; // 60s history in MB/s
}

const SYSTEM_TREE_DATA: TreeSystemItem[] = [
  {
    id: 'SYS-01',
    hostname: 'hologram-master-01',
    ip: '10.120.10.11',
    osCategory: 'Linux',
    osFullName: 'openEuler 24.03 LTS (Innovative SP1) x86_64',
    uptime: '198天 14小时 22分钟',
    bootTime: '2026-04-21 06:15:00',
    status: 'online',
    cpuUsage: 35.8,
    memTotalGB: 2048,
    memUsedGB: 1120,
    swapTotalGB: 64,
    swapUsedGB: 0,
    netInMbps: 50.6,
    netOutMbps: 50.6,
    totalProcesses: 428,
    runningProcesses: 8,
    loginUsers: 3,
    mounts: [
      { name: '目录磁盘空间', mountPoint: '/data/hologram', totalGB: 14000, usedGB: 8900, fsType: 'xfs' },
      { name: '根目录', mountPoint: '/', totalGB: 500, usedGB: 84, fsType: 'ext4' },
      { name: 'boot分区', mountPoint: '/boot', totalGB: 2, usedGB: 0.4, fsType: 'ext4' },
      { name: 'home分区', mountPoint: '/home', totalGB: 200, usedGB: 42, fsType: 'xfs' },
    ],
    diskSpace: {
      totalGB: 240,
      usedGB: 120,
      freeGB: 120,
    },
    diskIoRates: [12, 28, 45, 38, 52, 68, 72, 60, 85, 92, 98, 100],
  },
  {
    id: 'SYS-02',
    hostname: 'hologram-ai-gpu-01',
    ip: '10.120.20.01',
    osCategory: 'Linux',
    osFullName: 'Ubuntu 24.04 LTS (NVIDIA DGX-Optimized) x86_64',
    uptime: '142天 08小时 10分钟',
    bootTime: '2026-06-16 12:30:00',
    status: 'online',
    cpuUsage: 68.4,
    memTotalGB: 1536,
    memUsedGB: 1390,
    swapTotalGB: 128,
    swapUsedGB: 4.2,
    netInMbps: 128.4,
    netOutMbps: 145.2,
    totalProcesses: 680,
    runningProcesses: 24,
    loginUsers: 5,
    mounts: [
      { name: '目录磁盘空间', mountPoint: '/mnt/nvme-pool', totalGB: 60000, usedGB: 41200, fsType: 'ext4' },
      { name: '根目录', mountPoint: '/', totalGB: 1000, usedGB: 240, fsType: 'ext4' },
      { name: 'boot分区', mountPoint: '/boot', totalGB: 4, usedGB: 1.2, fsType: 'ext4' },
      { name: 'home分区', mountPoint: '/home', totalGB: 500, usedGB: 180, fsType: 'xfs' },
    ],
    diskSpace: {
      totalGB: 480,
      usedGB: 320,
      freeGB: 160,
    },
    diskIoRates: [24, 42, 60, 75, 80, 65, 88, 95, 110, 130, 145, 160],
  },
  {
    id: 'SYS-03',
    hostname: 'hologram-compute-02',
    ip: '10.120.30.02',
    osCategory: 'Linux',
    osFullName: 'openEuler 24.03 LTS (Linux 6.6.21-hologram-rt)',
    uptime: '88天 21小时 05分钟',
    bootTime: '2026-08-09 00:00:00',
    status: 'warning',
    cpuUsage: 84.2,
    memTotalGB: 512,
    memUsedGB: 498,
    swapTotalGB: 32,
    swapUsedGB: 8.4,
    netInMbps: 92.0,
    netOutMbps: 88.5,
    totalProcesses: 390,
    runningProcesses: 16,
    loginUsers: 2,
    mounts: [
      { name: '目录磁盘空间', mountPoint: '/data', totalGB: 15500, usedGB: 14800, fsType: 'xfs' },
      { name: '根目录', mountPoint: '/', totalGB: 500, usedGB: 410, fsType: 'ext4' },
      { name: 'boot分区', mountPoint: '/boot', totalGB: 2, usedGB: 0.8, fsType: 'ext4' },
      { name: 'home分区', mountPoint: '/home', totalGB: 200, usedGB: 95, fsType: 'xfs' },
    ],
    diskSpace: {
      totalGB: 240,
      usedGB: 210,
      freeGB: 30,
    },
    diskIoRates: [45, 62, 88, 95, 105, 120, 135, 150, 165, 180, 195, 210],
  },
  {
    id: 'SYS-04',
    hostname: 'win-scada-gateway-01',
    ip: '10.120.60.05',
    osCategory: 'Windows',
    osFullName: 'Windows Server 2022 Datacenter Edition (64-bit)',
    uptime: '312天 04小时 50分钟',
    bootTime: '2026-01-01 18:00:00',
    status: 'online',
    cpuUsage: 22.5,
    memTotalGB: 256,
    memUsedGB: 98,
    swapTotalGB: 32,
    swapUsedGB: 0,
    netInMbps: 18.4,
    netOutMbps: 19.2,
    totalProcesses: 210,
    runningProcesses: 6,
    loginUsers: 1,
    mounts: [
      { name: '目录磁盘空间', mountPoint: 'D:\\SCADA_Data', totalGB: 4000, usedGB: 1800, fsType: 'NTFS' },
      { name: '根目录', mountPoint: 'C:\\', totalGB: 500, usedGB: 160, fsType: 'NTFS' },
      { name: 'boot分区', mountPoint: 'C:\\EFI', totalGB: 1, usedGB: 0.1, fsType: 'FAT32' },
      { name: 'home分区', mountPoint: 'C:\\Users', totalGB: 100, usedGB: 28, fsType: 'NTFS' },
    ],
    diskSpace: {
      totalGB: 240,
      usedGB: 95,
      freeGB: 145,
    },
    diskIoRates: [8, 14, 22, 18, 25, 30, 28, 35, 40, 38, 42, 45],
  },
];

export const PrototypeOSSystemMonitorView: React.FC<Props> = ({
  onOpenTerminal,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<TreeSystemItem>(SYSTEM_TREE_DATA[0]);

  // Group systems by OS category
  const filteredSystems = SYSTEM_TREE_DATA.filter(
    (sys) =>
      sys.hostname.toLowerCase().includes(search.toLowerCase()) ||
      sys.ip.includes(search) ||
      sys.osFullName.toLowerCase().includes(search.toLowerCase())
  );

  const linuxSystems = filteredSystems.filter((s) => s.osCategory === 'Linux');
  const windowsSystems = filteredSystems.filter((s) => s.osCategory === 'Windows');

  const cpuIdlePercent = (100 - selectedSystem.cpuUsage).toFixed(1);
  const memUsedPercent = ((selectedSystem.memUsedGB / selectedSystem.memTotalGB) * 100).toFixed(1);
  const memIdlePercent = (100 - parseFloat(memUsedPercent)).toFixed(1);
  const swapUsedPercent = selectedSystem.swapTotalGB > 0
    ? ((selectedSystem.swapUsedGB / selectedSystem.swapTotalGB) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="space-y-4">
      {/* Search & Top Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-3 shadow-xs backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Monitor className="w-4 h-4" />
          </span>
          <span className="text-blue-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">操作系统监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">系统监控</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            遥测刷新: 2026-11-05 (近期实时)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenTerminal(selectedSystem.hostname, selectedSystem.ip)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>开启终端 (SSH)</span>
          </button>

          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>刷新遥测</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Tree Selector + Right Telemetry Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* ========================================================================= */}
        {/* Left Column: 系统列表 (System Selector Tree) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              系统列表 (System Tree)
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
              {filteredSystems.length} 台
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入名称/IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Tree Groups */}
          <div className="space-y-3 pt-1 text-xs">
            {/* Linux Category */}
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold px-1 text-[11px] uppercase tracking-wider">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Linux ({linuxSystems.length})</span>
              </div>
              <div className="pl-2 space-y-0.5 border-l border-slate-800/80 ml-2">
                {linuxSystems.map((sys) => {
                  const isSelected = selectedSystem.id === sys.id;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => setSelectedSystem(sys)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate font-mono">{sys.hostname}</div>
                        <div className={`text-[10px] font-mono ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                          {sys.ip}
                        </div>
                      </div>
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          sys.status === 'online' ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'
                        }`}
                        title={sys.status === 'online' ? '在线' : '预警'}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Windows Category */}
            <div className="space-y-1 pt-1">
              <div className="flex items-center gap-1.5 text-slate-400 font-bold px-1 text-[11px] uppercase tracking-wider">
                <Monitor className="w-3.5 h-3.5 text-blue-400" />
                <span>Windows ({windowsSystems.length})</span>
              </div>
              <div className="pl-2 space-y-0.5 border-l border-slate-800/80 ml-2">
                {windowsSystems.map((sys) => {
                  const isSelected = selectedSystem.id === sys.id;
                  return (
                    <button
                      key={sys.id}
                      onClick={() => setSelectedSystem(sys)}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100'
                      }`}
                    >
                      <div className="truncate">
                        <div className="truncate font-mono">{sys.hostname}</div>
                        <div className={`text-[10px] font-mono ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                          {sys.ip}
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column: 操作系统全息监控仪表盘 (Main Telemetry Panel) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-9 space-y-4">
          {/* Card 1: 基础信息 (Basic System Info Header) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  基础信息 (System Overview)
                </h3>
              </div>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                系统运行正常 (eBPF Telemetry)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">主机名 (Hostname)</span>
                <span className="text-cyan-300 font-bold text-sm block mt-0.5 truncate">
                  {selectedSystem.hostname}
                </span>
                <span className="text-[10px] text-slate-500">IP: {selectedSystem.ip}</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">系统基本信息</span>
                <span className="text-slate-200 font-semibold block mt-0.5 truncate" title={selectedSystem.osFullName}>
                  {selectedSystem.osFullName}
                </span>
                <span className="text-[10px] text-emerald-400">内核层零抖动调度</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">系统开启持续时间</span>
                <span className="text-emerald-400 font-bold mt-0.5 block">
                  {selectedSystem.uptime}
                </span>
                <span className="text-[10px] text-slate-500">连续健康无异常</span>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">系统启动时间</span>
                <span className="text-slate-200 font-semibold block mt-0.5">
                  {selectedSystem.bootTime}
                </span>
                <span className="text-[10px] text-blue-400">上次冷启动巡检基线</span>
              </div>
            </div>
          </div>

          {/* Card 2 & Card 3: CPU 使用率 + 内存 (System Memory & Swap) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* CPU 使用率 (Semi-radial Dial Gauge) */}
            <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  CPU 使用率 (CPU Utilization)
                </span>
                <span className="text-[11px] font-mono text-cyan-300">
                  使用率: {selectedSystem.cpuUsage}% · 空闲率: {cpuIdlePercent}%
                </span>
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
                      stroke={selectedSystem.cpuUsage > 80 ? '#f43f5e' : '#06b6d4'}
                      strokeWidth="10"
                      strokeDasharray="119.38"
                      strokeDashoffset={`${119.38 - (selectedSystem.cpuUsage / 100) * 119.38}`}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <div className="text-center mb-1 z-10 select-none">
                    <div className="text-2xl font-black font-mono text-cyan-300">
                      {selectedSystem.cpuUsage}%
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tracking-wider">
                      CPU USAGE
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full mt-2 font-mono text-xs text-center">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">使用率 (Used)</span>
                    <span className="text-cyan-300 font-bold">{selectedSystem.cpuUsage}%</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">空闲率 (Idle)</span>
                    <span className="text-emerald-400 font-bold">{cpuIdlePercent}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 内存 (System Memory & Swap) */}
            <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <HardDrive className="w-4 h-4 text-purple-400" />
                  内存 (System Memory & Swap)
                </span>
                <span className="text-[11px] font-mono text-purple-300">
                  物理内存: {selectedSystem.memTotalGB}GB
                </span>
              </div>

              <div className="space-y-4 py-1">
                {/* 系统内存量 */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium">系统内存量</span>
                    <span className="text-purple-300 font-bold">
                      存储: {selectedSystem.memTotalGB}G · 已使用: {selectedSystem.memUsedGB}G ({memUsedPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-950 rounded-lg border border-slate-800 p-0.5 flex overflow-hidden">
                    <div
                      className="bg-purple-500 h-full rounded-xs transition-all duration-500"
                      style={{ width: `${memUsedPercent}%` }}
                      title={`已使用: ${selectedSystem.memUsedGB}G`}
                    />
                    <div
                      className="bg-cyan-500/60 h-full rounded-xs transition-all duration-500"
                      style={{ width: `${(680 / selectedSystem.memTotalGB) * 100}%` }}
                      title="Buffers/Cached: 680G"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>空闲率: {memIdlePercent}%</span>
                    <span>使用率: {memUsedPercent}%</span>
                  </div>
                </div>

                {/* Swap 空间 */}
                <div className="space-y-1.5 pt-1 border-t border-slate-800/60">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 font-medium">swap空间</span>
                    <span className="text-blue-300 font-bold">
                      存储: {selectedSystem.swapTotalGB}G · 剩余: {selectedSystem.swapTotalGB - selectedSystem.swapUsedGB}G
                    </span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-950 rounded-lg border border-slate-800 p-0.5 flex overflow-hidden">
                    <div
                      className="bg-blue-500 h-full rounded-xs transition-all duration-500"
                      style={{ width: `${swapUsedPercent}%` }}
                      title={`Swap 已用: ${selectedSystem.swapUsedGB}G`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>空闲率: {(100 - parseFloat(swapUsedPercent)).toFixed(1)}%</span>
                    <span>使用率: {swapUsedPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 & Card 5: 【网络接口】 与 【负载】 专属大版块 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* 网络接口 (Network Interfaces) */}
            <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Network className="w-4 h-4 text-emerald-400" />
                  网络接口 (Network Interfaces)
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  双万兆 RoCE 光纤网卡
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 py-2">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">网络进接口流量 (MBPS)</span>
                    <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-black font-mono text-emerald-400">
                      {selectedSystem.netInMbps}
                    </span>
                    <span className="text-xs text-slate-500 font-mono ml-1">MB/s</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">网络出接口流量 (MBPS)</span>
                    <ArrowUpRight className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="mt-2">
                    <span className="text-3xl font-black font-mono text-cyan-300">
                      {selectedSystem.netOutMbps}
                    </span>
                    <span className="text-xs text-slate-500 font-mono ml-1">MB/s</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '42%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 负载 (Load & Processes) */}
            <div className="md:col-span-6 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-purple-400" />
                  负载 (System Load & Processes)
                </span>
                <span className="text-[11px] font-mono text-purple-300">
                  LoadAvg (1m): 3.42
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-2 text-center">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium block">当前进程数 (个)</span>
                  <div className="mt-1">
                    <span className="text-3xl font-black font-mono text-purple-300">
                      {selectedSystem.totalProcesses}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono block mt-1">3,120 线程</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium block">运行进程数量 (个)</span>
                  <div className="mt-1">
                    <span className="text-3xl font-black font-mono text-amber-300">
                      {selectedSystem.runningProcesses}
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-400 font-mono block mt-1">无锁调度</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col justify-between">
                  <span className="text-xs text-slate-400 font-medium block">登录用户数 (个)</span>
                  <div className="mt-1">
                    <span className="text-3xl font-black font-mono text-blue-300">
                      {selectedSystem.loginUsers}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono block mt-1">Active TTY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: 文件系统 (File Systems 4 Partition Dials) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Database className="w-4 h-4 text-emerald-400" />
                文件系统 (File Systems Dials)
              </span>
              <span className="text-[11px] font-mono text-emerald-400">
                4 个核心挂载点
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-1">
              {selectedSystem.mounts.map((mnt) => {
                const usedPercent = Math.min(100, Math.round((mnt.usedGB / mnt.totalGB) * 100));
                const idlePercent = 100 - usedPercent;

                return (
                  <div
                    key={mnt.mountPoint}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col items-center justify-between text-center space-y-2 hover:border-slate-700 transition-all"
                  >
                    <span className="text-xs font-bold text-slate-200 truncate w-full">
                      {mnt.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ({mnt.mountPoint}) · {mnt.fsType}
                    </span>

                    {/* Ring Donut */}
                    <div className="relative w-24 h-24 flex items-center justify-center py-1">
                      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                        <circle
                          cx="50" cy="50" r="38" fill="transparent"
                          stroke={usedPercent > 80 ? '#f43f5e' : '#10b981'}
                          strokeWidth="10"
                          strokeDasharray="238.76"
                          strokeDashoffset={`${238.76 * (1 - usedPercent / 100)}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                        <span className="text-xs font-black font-mono text-slate-100">
                          {usedPercent}%
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono">已用</span>
                      </div>
                    </div>

                    <div className="w-full text-center font-mono text-[11px]">
                      <div className="text-emerald-400 font-bold">
                        存储: {mnt.totalGB >= 1000 ? `${(mnt.totalGB / 1000).toFixed(1)}TB` : `${mnt.totalGB}G`}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        已使用: {mnt.usedGB >= 1000 ? `${(mnt.usedGB / 1000).toFixed(1)}TB` : `${mnt.usedGB}G`}
                      </div>
                    </div>

                    <div className="w-full pt-1.5 border-t border-slate-800/60 flex justify-between text-[10px] font-mono text-slate-500">
                      <span>空闲率: {idlePercent}%</span>
                      <span>使用率: {usedPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 7: 磁盘 (Disk Space & Disk I/O Rate Waveform) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Disc className="w-4 h-4 text-amber-400" />
                磁盘 (Disk Space & I/O Telemetry)
              </span>
              <span className="text-[11px] font-mono text-amber-400">
                NVMe 高速 I/O 矩阵
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              {/* Left: 目录磁盘空间 多阶容量分段仪表盘 (Volume Capacity Segment Gauge - 替代原饼图) */}
              <div className="md:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    目录磁盘空间 (Volume Capacity)
                  </span>
                  <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    全部: {selectedSystem.diskSpace.totalGB} GB
                  </span>
                </div>

                {/* Horizontal Segmented Volume Meter & Allocation Breakdown */}
                <div className="space-y-2 py-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-300 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                      已用空间: {selectedSystem.diskSpace.usedGB} GB
                    </span>
                    <span className="text-slate-400 font-bold">
                      {Math.round((selectedSystem.diskSpace.usedGB / selectedSystem.diskSpace.totalGB) * 100)}%
                    </span>
                  </div>

                  {/* Multi-Segmented LED Track Bar */}
                  <div className="w-full h-4 bg-slate-900 rounded-md overflow-hidden p-0.5 border border-slate-800 flex gap-0.5">
                    {Array.from({ length: 20 }).map((_, idx) => {
                      const usedPercent = (selectedSystem.diskSpace.usedGB / selectedSystem.diskSpace.totalGB) * 100;
                      const isUsed = (idx + 1) * 5 <= usedPercent;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 h-full rounded-sm transition-all duration-300 ${
                            isUsed
                              ? idx > 15
                                ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                                : 'bg-amber-400 shadow-sm shadow-amber-400/40'
                              : 'bg-slate-800/60'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-xs font-mono pt-0.5">
                    <span className="text-cyan-400 font-medium">
                      可用余量: {selectedSystem.diskSpace.freeGB} GB
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {Math.round((selectedSystem.diskSpace.freeGB / selectedSystem.diskSpace.totalGB) * 100)}% 剩余
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                  <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800/70 flex justify-between">
                    <span className="text-slate-400">RAID 架构:</span>
                    <span className="text-slate-200 font-bold">RAID-10</span>
                  </div>
                  <div className="bg-slate-900/90 p-1.5 rounded border border-slate-800/70 flex justify-between">
                    <span className="text-slate-400">I/O 调度:</span>
                    <span className="text-amber-400 font-bold">mq-deadline</span>
                  </div>
                </div>
              </div>

              {/* Right: 磁盘 I/O 速率 60s 动态柱状图 (Column Histogram Bar Chart - 替代原折线趋势图) */}
              <div className="md:col-span-7 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    磁盘 I/O 速率 (Disk I/O Column Spectrum 60s)
                  </span>
                  <span className="text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
                    实时峰值: {Math.max(...selectedSystem.diskIoRates)} MB/s
                  </span>
                </div>

                {/* Column Spectrum Bar Chart */}
                <div className="h-32 w-full bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 relative flex items-end justify-between gap-1.5">
                  {/* Background Grid Lines */}
                  <div className="absolute inset-x-2 top-3 bottom-6 flex flex-col justify-between pointer-events-none opacity-30">
                    <div className="border-b border-slate-700 border-dashed w-full" />
                    <div className="border-b border-slate-700 border-dashed w-full" />
                    <div className="border-b border-slate-700 border-dashed w-full" />
                  </div>

                  {selectedSystem.diskIoRates.map((rate, i) => {
                    const maxRate = 220;
                    const heightPercent = Math.min(100, Math.max(8, (rate / maxRate) * 100));
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group z-10">
                        {/* Bar value tooltip on top */}
                        <span className="text-[9px] font-mono text-amber-300 opacity-80 group-hover:opacity-100 transition-opacity mb-0.5">
                          {rate}
                        </span>

                        {/* Column Bar with Gradient & Glowing Cap */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full bg-gradient-to-t from-amber-600/80 via-amber-500 to-yellow-400 rounded-t-sm transition-all duration-300 relative group-hover:brightness-125"
                        >
                          <div className="w-full h-1 bg-amber-200 rounded-t-sm shadow-sm shadow-amber-200/80" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>60秒前</span>
                  <span>45秒前</span>
                  <span>30秒前</span>
                  <span>15秒前</span>
                  <span className="text-amber-400 font-bold">实时 (0秒)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
