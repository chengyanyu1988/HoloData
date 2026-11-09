import React from 'react';
import { Activity, Clock, ShieldCheck, Download, BarChart2, TrendingUp } from 'lucide-react';

export const AlarmHistoryView: React.FC = () => {
  const handleExport = () => {
    alert('正在生成 2026 年度大数据基础设施运维告警与 SLA 归档报告 (PDF/CSV)...');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>历史告警趋势与 SLA 归档分析</span>
            <span className="text-xs font-normal text-slate-400">· 根因归纳与 MTTA / MTTR</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            对历史异常事件进行生命周期闭环追溯，评估告警收敛比、平均响应时间与根因类型分布
          </p>
        </div>

        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          导出 SLA 追溯台账
        </button>
      </div>

      {/* KPI SLA Strips */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">平均告警响应时间 (MTTA)</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">1.4 <span className="text-xs font-normal text-slate-400">分钟</span></div>
          <span className="text-slate-500 text-[11px]">SLA 达标率 99.8% (目标 &lt; 5m)</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">平均故障恢复时间 (MTTR)</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono">18.2 <span className="text-xs font-normal text-slate-400">分钟</span></div>
          <span className="text-slate-500 text-[11px]">较上月提速 24.5%</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">告警智能收敛抑制比</span>
          <div className="text-2xl font-bold text-indigo-400 font-mono">92.4%</div>
          <span className="text-slate-500 text-[11px]">有效过滤风暴级连续同源事件</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 block">年度告警闭环率</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">100.0%</div>
          <span className="text-slate-500 text-[11px]">所有致命事件 100% 沉淀工单</span>
        </div>
      </div>

      {/* Root Cause Distribution Bars */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <span>历史故障根因分类分布 (近 30 天统计)</span>
        </h3>

        <div className="space-y-3">
          {[
            { label: '硬件散热与高负载温度尖刺 (Thermal / Fans)', pct: 32, count: 18, color: 'bg-rose-500' },
            { label: '存储介质坏块与磁盘阵列冗余校验 (Bad Sector / RAID)', pct: 24, count: 14, color: 'bg-amber-500' },
            { label: '分布式 OLAP 慢查询及大表扫描 (Slow Query / Memory Peak)', pct: 20, count: 11, color: 'bg-purple-500' },
            { label: '实时消息队列消费组处理堆积 (Consumer Lag Spikes)', pct: 14, count: 8, color: 'bg-cyan-500' },
            { label: '网络微突发流量与 RoCE 拥塞 (Microburst Drops)', pct: 10, count: 6, color: 'bg-indigo-500' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-1 text-xs">
              <div className="flex justify-between font-mono">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className="text-slate-400">
                  {item.pct}% ({item.count} 次事件)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${item.color}`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
