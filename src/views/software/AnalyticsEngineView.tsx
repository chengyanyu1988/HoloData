import React, { useState } from 'react';
import { Database, Search, Activity, AlertTriangle, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react';
import { AnalyticalQuery } from '../../types';

interface AnalyticsEngineViewProps {
  queries: AnalyticalQuery[];
  onKillQuery?: (queryId: string) => void;
}

export const AnalyticsEngineView: React.FC<AnalyticsEngineViewProps> = ({
  queries,
  onKillQuery,
}) => {
  const [engineFilter, setEngineFilter] = useState<string>('all');

  const filteredQueries = queries.filter(
    (q) => engineFilter === 'all' || q.engine === engineFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>分析与数据服务引擎监控</span>
            <span className="text-xs font-normal text-slate-400">· ClickHouse 24.3 / Apache Doris 2.1 / Hive on Tez</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控高性能交互式 OLAP 引擎、向量化执行管道、P95 响应延迟、高并发慢查询与内存熔断保护
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            ClickHouse P95 延迟: <strong className="text-emerald-400">18.4 ms</strong>
          </span>
          <span className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-300">
            Doris 并发连接: <strong className="text-cyan-400">42 / 100</strong>
          </span>
        </div>
      </div>

      {/* Engine Metrics Strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">ClickHouse 算力节点</span>
          <div className="text-2xl font-bold text-slate-100 font-mono">16 / 16</div>
          <span className="text-emerald-400 text-[11px]">分布式表分片均匀度 100%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">Apache Doris FE/BE 存活</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">3 FE / 21 BE</div>
          <span className="text-slate-500 text-[11px]">RoutineLoad 接入时延 &lt; 2.1s</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">数据压缩比率 (ZSTD)</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono">4.8 : 1</div>
          <span className="text-slate-500 text-[11px]">节约全闪存储空间 78.4%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">缓存命中率 (Cache)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">98.8%</div>
          <span className="text-slate-500 text-[11px]">PageCache / MarkCache 稳定</span>
        </div>
      </div>

      {/* Queries Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm space-y-2">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <h3 className="font-bold text-slate-100">实时执行查询与慢查询监控台账</h3>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">引擎筛选:</span>
            <select
              value={engineFilter}
              onChange={(e) => setEngineFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">全部引擎</option>
              <option value="ClickHouse">ClickHouse</option>
              <option value="Apache Doris">Apache Doris</option>
              <option value="Hive on Tez">Hive on Tez</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">查询 ID</th>
                <th className="py-3 px-4">执行引擎</th>
                <th className="py-3 px-4">提交用户</th>
                <th className="py-3 px-4">目标数据库</th>
                <th className="py-3 px-4">执行时延</th>
                <th className="py-3 px-4">扫描数据行数</th>
                <th className="py-3 px-4">读取吞吐</th>
                <th className="py-3 px-4">内存峰值</th>
                <th className="py-3 px-4">运行状态</th>
                <th className="py-3 px-4 text-right">紧急熔断</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredQueries.map((query) => (
                <tr key={query.queryId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                    {query.queryId}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px]">
                      {query.engine}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{query.user}</td>
                  <td className="py-3 px-4 font-mono text-slate-300">{query.database}</td>
                  <td className="py-3 px-4 font-mono tabular-nums">
                    <span
                      className={
                        query.durationMs > 10000
                          ? 'text-rose-400 font-bold'
                          : query.durationMs > 1000
                          ? 'text-amber-400 font-semibold'
                          : 'text-emerald-400 font-bold'
                      }
                    >
                      {query.durationMs > 1000
                        ? `${(query.durationMs / 1000).toFixed(1)} 秒`
                        : `${query.durationMs} ms`}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200 tabular-nums">
                    {query.scannedRows} 行
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200 tabular-nums">
                    {query.scannedBytesMB.toFixed(1)} MB
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-300 tabular-nums">
                    {query.memoryPeakMB} MB
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded border font-mono font-medium ${
                        query.status === 'SUCCESS'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : query.status === 'EXECUTING'
                          ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20 animate-pulse'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20 font-bold'
                      }`}
                    >
                      {query.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {query.status === 'SLOW' || query.status === 'EXECUTING' ? (
                      <button
                        onClick={() => onKillQuery && onKillQuery(query.queryId)}
                        className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900 border border-rose-500/30 text-rose-300 font-medium transition-colors"
                      >
                        强制 Kill
                      </button>
                    ) : (
                      <span className="text-slate-600 font-mono text-[11px]">-</span>
                    )}
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
