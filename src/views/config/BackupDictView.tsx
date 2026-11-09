import React, { useState } from 'react';
import { Database, Download, RefreshCw, CheckCircle2, ShieldCheck, Clock, FileText } from 'lucide-react';

export const BackupDictView: React.FC = () => {
  const [isSnapshotting, setIsSnapshotting] = useState(false);
  const [snapshotMsg, setSnapshotMsg] = useState<string | null>(null);

  const handleInstantSnapshot = () => {
    setIsSnapshotting(true);
    setSnapshotMsg('正在生成 HDFS fsimage 与 ZooKeeper 全域元数据快照...');
    setTimeout(() => {
      setIsSnapshotting(false);
      setSnapshotMsg('全域元数据快照打包完成 (Hash: sha256:7f8a9e...), 已加密归档至冷存 SAN 介质！');
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>数据字典编目与自动化备份容灾</span>
            <span className="text-xs font-normal text-slate-400">· 全域元数据血缘与快照策略</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            编目全域 14,280 张数仓逻辑表结构、Schema 演化记录及自动化元数据快照归档任务
          </p>
        </div>

        <button
          onClick={handleInstantSnapshot}
          disabled={isSnapshotting}
          className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-900/30"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSnapshotting ? 'animate-spin' : ''}`} />
          {isSnapshotting ? '快照生成中...' : '立即执行元数据全局快照'}
        </button>
      </div>

      {snapshotMsg && (
        <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{snapshotMsg}</span>
        </div>
      )}

      {/* Backup Schedules List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-200">HDFS NameNode 镜像快照 (FSImage)</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 font-mono">
            每天 02:00 (自动增量滚动)
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            留存策略: 保留最近 90 天快照 · 容灾目的地: STO-03 灾备池
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-200">ZooKeeper 事务日志与全量快照</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 font-mono">
            每 6 小时自动增量导出
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            高频 Quorum 恢复点目标 (RPO): &lt; 5 分钟
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-200">Hive / Doris 统一元数据库 (Metastore)</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 font-mono">
            每 12 小时异地多副本备份
          </div>
          <div className="text-slate-400 font-mono text-[11px]">
            端到端恢复时间目标 (RTO): &lt; 15 分钟
          </div>
        </div>
      </div>

      {/* Dictionary Catalog Preview */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-100">核心全息数据目录编目资产 (Sample Schemas)</h3>
        <div className="space-y-2">
          {[
            { name: 'dw_realtime.user_behavior_wide_dws', desc: '全域用户行为实时 DWS 宽表', engine: 'ClickHouse / Doris', fields: 184, rows: '2,840,000,000' },
            { name: 'dw_lakehouse.order_detail_full_fact', desc: '核心交易订单全链路增量事实表', engine: 'Apache Iceberg / HDFS', fields: 92, rows: '1,420,000,000' },
            { name: 'dw_ai.vector_embedding_index_768d', desc: '大模型微调 768 维特征向量索引表', engine: 'ClickHouse Vector', fields: 12, rows: '38,000,000' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
            >
              <div>
                <span className="text-cyan-400 font-bold">{item.name}</span>
                <div className="text-slate-400 text-[11px] font-sans mt-0.5">{item.desc}</div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400">{item.engine}</span>
                <span>{item.fields} 字段</span>
                <span className="text-slate-100 font-bold">{item.rows} 行</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
