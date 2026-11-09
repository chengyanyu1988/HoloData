import React, { useState, useEffect } from 'react';
import { Activity, Play, Pause, RefreshCw, Cpu, HardDrive, Network, Zap, CheckCircle2 } from 'lucide-react';
import { ServerNode } from '../../types';

interface RealtimeMetricsViewProps {
  servers: ServerNode[];
  onSelectServer: (server: ServerNode) => void;
}

export const RealtimeMetricsView: React.FC<RealtimeMetricsViewProps> = ({
  servers,
  onSelectServer,
}) => {
  const [isLive, setIsLive] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string>(servers[0]?.id || 'SRV-001');
  const [metricPoints, setMetricPoints] = useState<number[]>([42, 45, 48, 51, 49, 47, 53, 56, 52, 58, 62, 59, 64, 61, 65, 63, 68, 65, 72, 69, 74, 71, 76, 73]);

  // Live wave simulation
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      setMetricPoints((prev) => {
        const nextVal = Math.min(95, Math.max(30, prev[prev.length - 1] + (Math.random() * 8 - 4)));
        return [...prev.slice(1), Math.round(nextVal)];
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isLive]);

  const activeServer = servers.find((s) => s.id === selectedNode) || servers[0];

  // SVG wave calculation
  const maxVal = 100;
  const width = 600;
  const height = 140;
  const pointsString = metricPoints
    .map((pt, i) => {
      const x = (i / (metricPoints.length - 1)) * width;
      const y = height - (pt / maxVal) * height;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>实时指标全息遥测流</span>
            <span className="text-xs font-normal text-slate-400">· 毫秒级多维度性能震荡图谱</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            连续采样集群各节点底层内核态 CPU 调度、NVMe 队列吞吐、RoCE 网络延迟与实时作业反压
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              isLive
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-amber-600/20 text-amber-400 border border-amber-500/30'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isLive ? '正在实时接收 (2.0s 周期)' : '已暂停采集遥测'}
          </button>
        </div>
      </div>

      {/* Node Switcher Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 shrink-0 font-medium">目标遥测节点:</span>
        {servers.map((srv) => (
          <button
            key={srv.id}
            onClick={() => setSelectedNode(srv.id)}
            className={`px-3 py-1.5 rounded-lg border font-mono transition-colors whitespace-nowrap shrink-0 ${
              selectedNode === srv.id
                ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {srv.hostname} ({srv.ip})
          </button>
        ))}
      </div>

      {/* Main Metric Visualizer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic CPU Waveform */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  {activeServer.hostname} 处理器核心负载波形 (vCore Utilization)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  当前实时值: <strong className="text-cyan-400">{metricPoints[metricPoints.length - 1]}%</strong> · 峰值: 78.4%
                </span>
              </div>
            </div>
            <button
              onClick={() => onSelectServer(activeServer)}
              className="text-xs text-cyan-400 hover:underline"
            >
              检查传感器 &gt;
            </button>
          </div>

          {/* SVG Wave Graph */}
          <div className="h-36 w-full rounded-lg bg-slate-950 p-2 border border-slate-800 relative overflow-hidden flex flex-col justify-end">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="cyanGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <polygon
                points={`0,${height} ${pointsString} ${width},${height}`}
                fill="url(#cyanGradient)"
              />
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1 pt-1 border-t border-slate-800">
              <span>-60秒前</span>
              <span>-40秒前</span>
              <span>-20秒前</span>
              <span className="text-cyan-400">最新遥测点</span>
            </div>
          </div>
        </div>

        {/* Network & RoCE Bandwidth Waveform */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-indigo-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">
                  RoCE 400G 无损 Fabric 实时吞吐震荡
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  RX: 78.4 Gbps · TX: 84.2 Gbps · 丢包率: 0.0000%
                </span>
              </div>
            </div>
          </div>

          {/* Dual Bar Oscillograph */}
          <div className="h-36 w-full rounded-lg bg-slate-950 p-3 border border-slate-800 flex items-end gap-1.5 justify-between">
            {metricPoints.map((pt, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-0.5 h-full justify-end">
                <div
                  className="w-full bg-indigo-500/80 rounded-t-xs hover:bg-indigo-400 transition-all"
                  style={{ height: `${pt * 0.9}%` }}
                  title={`点 #${idx + 1}: ${pt * 1.2} Gbps`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>采样跨度: 48秒实时滑窗</span>
            <span className="text-indigo-400 font-bold">自适应拥塞控制: DCQCN 已开启</span>
          </div>
        </div>
      </div>

      {/* Storage & Queue Telemetry Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-200">NVMe-oF 阵列 IOPS</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            580,240 <span className="text-xs text-slate-400 font-normal">IOPS</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            4K 随机读写延迟: 0.18ms / 0.24ms
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-200">Kafka 实时消息堆积时延 (Lag)</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            1,280 <span className="text-xs text-slate-400 font-normal">条堆积</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            端到端消费时延: &lt; 45ms (安全低位)
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-200">Flink 1.19 检查点耗时 (CP)</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-100">
            340 <span className="text-xs text-slate-400 font-normal">毫秒</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            RocksDB 增量快照完成率: 100%
          </div>
        </div>
      </div>
    </div>
  );
};
