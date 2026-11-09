import React, { useState } from 'react';
import { Cpu, Play, Pause, RefreshCw, Activity, ArrowRight, Layers, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ComputeJob } from '../../types';

interface ComputeEngineViewProps {
  jobs: ComputeJob[];
  onTriggerJobAction?: (jobId: string, action: string) => void;
}

export const ComputeEngineView: React.FC<ComputeEngineViewProps> = ({
  jobs,
  onTriggerJobAction,
}) => {
  const [engineFilter, setEngineFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredJobs = jobs.filter((j) => {
    const matchesEngine = engineFilter === 'all' || j.engine.includes(engineFilter);
    const matchesType = typeFilter === 'all' || j.type === typeFilter;
    return matchesEngine && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>计算引擎与实时流批作业监控</span>
            <span className="text-xs font-normal text-slate-400">· Apache Flink 1.19 / Spark 3.5 / Ray 2.10</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控实时有状态计算流 (Streaming Pipeline)、分布式算力槽位分配、反压异常与 RocksDB 检查点
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            活跃流计算作业: <strong className="text-cyan-400">38 Jobs</strong>
          </span>
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            吞吐处理峰值: <strong className="text-emerald-400">1,420,000 rec/s</strong>
          </span>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">计算引擎:</span>
            <select
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">全部引擎</option>
              <option value="Flink">Apache Flink</option>
              <option value="Spark">Apache Spark</option>
              <option value="Ray">Ray 分布式</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">作业形态:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">全部形态</option>
              <option value="Streaming">流计算 (Streaming)</option>
              <option value="Batch">离线批处理 (Batch)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">作业标识 / 名称</th>
                <th className="py-3 px-4">引擎架构</th>
                <th className="py-3 px-4">作业模式</th>
                <th className="py-3 px-4">并发算力配额</th>
                <th className="py-3 px-4">处理速率</th>
                <th className="py-3 px-4">检查点 (CP)</th>
                <th className="py-3 px-4">反压状态</th>
                <th className="py-3 px-4">持续运行时长</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{job.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{job.id}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                      {job.engine}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{job.type}</td>
                  <td className="py-3 px-4 font-mono text-slate-300 tabular-nums">
                    {job.parallelism} 并行度 · {job.allocatedCores} Cores / {job.allocatedMemoryGB}GB
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-400 tabular-nums font-bold">
                    {job.recordsPerSec > 0 ? `${job.recordsPerSec.toLocaleString()} 条/秒` : '离线批模式'}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 tabular-nums">
                    {job.checkpointLatencyMs ? `${job.checkpointLatencyMs} ms` : '-'}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${
                        job.backpressure === 'NONE'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : job.backpressure === 'LOW'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      }`}
                    >
                      {job.backpressure}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {job.duration}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <span className="text-emerald-400 font-semibold">{job.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() =>
                        onTriggerJobAction && onTriggerJobAction(job.id, 'savepoint')
                      }
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                    >
                      触发 Savepoint
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
