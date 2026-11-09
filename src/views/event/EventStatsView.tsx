import React, { useState } from 'react';
import { 
  PieChart, BarChart2, TrendingUp, Clock, ShieldCheck, 
  CheckCircle2, AlertTriangle, Layers, Calendar, RefreshCw, Award, Filter
} from 'lucide-react';

export const EventStatsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'realtime' | '1h' | '24h' | '7d' | '30d'>('7d');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');

  // Interactive time range update simulation
  const getTrendData = () => {
    switch (timeRange) {
      case 'realtime':
        return [
          { time: '09:00', count: 2, resolved: 2 },
          { time: '09:10', count: 5, resolved: 4 },
          { time: '09:20', count: 3, resolved: 3 },
          { time: '09:30', count: 8, resolved: 6 },
          { time: '09:40', count: 4, resolved: 4 },
          { time: '09:50', count: 6, resolved: 5 },
        ];
      case '1h':
        return [
          { time: '08:50', count: 12, resolved: 10 },
          { time: '09:00', count: 18, resolved: 15 },
          { time: '09:10', count: 14, resolved: 14 },
          { time: '09:20', count: 22, resolved: 19 },
          { time: '09:30', count: 16, resolved: 16 },
          { time: '09:40', count: 10, resolved: 9 },
        ];
      case '24h':
        return [
          { time: '00:00', count: 15, resolved: 14 },
          { time: '04:00', count: 8, resolved: 8 },
          { time: '08:00', count: 45, resolved: 40 },
          { time: '12:00', count: 32, resolved: 30 },
          { time: '16:00', count: 28, resolved: 26 },
          { time: '20:00', count: 18, resolved: 17 },
        ];
      case '7d':
      default:
        return [
          { time: '10/31', count: 120, resolved: 118 },
          { time: '11/01', count: 145, resolved: 140 },
          { time: '11/02', count: 98, resolved: 98 },
          { time: '11/03', count: 162, resolved: 155 },
          { time: '11/04', count: 110, resolved: 108 },
          { time: '11/05', count: 138, resolved: 132 },
          { time: '11/06', count: 86, resolved: 80 },
        ];
      case '30d':
        return [
          { time: '第1周', count: 850, resolved: 840 },
          { time: '第2周', count: 920, resolved: 910 },
          { time: '第3周', count: 780, resolved: 775 },
          { time: '第4周', count: 640, resolved: 635 },
        ];
    }
  };

  const trendData = getTrendData();
  const maxTrendCount = Math.max(...trendData.map((d) => d.count), 1);

  // Event Type Distribution
  const typeDistribution = [
    { type: '硬件故障', count: 284, pct: 32.5, color: 'bg-cyan-500 text-cyan-400 border-cyan-500/30' },
    { type: '软件异常', count: 245, pct: 28.0, color: 'bg-blue-500 text-blue-400 border-blue-500/30' },
    { type: '网络抖动', count: 175, pct: 20.0, color: 'bg-purple-500 text-purple-400 border-purple-500/30' },
    { type: '接口超时', count: 105, pct: 12.0, color: 'bg-amber-500 text-amber-400 border-amber-500/30' },
    { type: '传感器失效', count: 65, pct: 7.5, color: 'bg-emerald-500 text-emerald-400 border-emerald-500/30' },
  ];

  // System Ranking Top 5
  const systemRanking = [
    { rank: 1, name: '电子标识感知集中监控系统', count: 320, mttr: '18.5分', rate: '99.2%' },
    { rank: 2, name: '双基识读融合推断分析系统', count: 210, mttr: '14.2分', rate: '98.8%' },
    { rank: 3, name: '智慧交通RFID数据采集网关', count: 165, mttr: '22.0分', rate: '97.5%' },
    { rank: 4, name: '全息资产高可用数据库集群', count: 115, mttr: '12.8分', rate: '100.0%' },
    { rank: 5, name: '实时流式计算处理平台', count: 64, mttr: '15.6分', rate: '99.0%' },
  ];

  // Engineer MTTR & Performance Ranking
  const engineerRanking = [
    { name: '李明远', title: '硬件高级工程师', count: 142, responseTime: '1.2分钟', mttr: '16.4分钟', score: 99.5 },
    { name: '程总工', title: '全栈基础设施专家', count: 118, responseTime: '0.8分钟', mttr: '10.2分钟', score: 99.8 },
    { name: '赵振华', title: '数据库 DBA 专家', count: 96, responseTime: '1.5分钟', mttr: '12.0分钟', score: 98.9 },
    { name: '张建国', title: '感应识别架构师', count: 88, responseTime: '2.1分钟', mttr: '21.5分钟', score: 97.8 },
    { name: '王海峰', title: 'AI 视觉开发组长', count: 76, responseTime: '1.8分钟', mttr: '18.0分钟', score: 98.2 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100 font-sans flex items-center gap-2">
              事件中心 · 统计分析大屏
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              全息数据基础设施事件多维统计与 MTTR 效能分析 · 2026
            </p>
          </div>
        </div>

        {/* Time range interactive selector: 实时5分, 1小时, 24小时, 7天, 30天 */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-slate-400 text-[11px] font-sans mr-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> 时间粒度:
          </span>
          {[
            { id: 'realtime', label: '实时5分' },
            { id: '1h', label: '1小时' },
            { id: '24h', label: '24小时' },
            { id: '7d', label: '7天' },
            { id: '30d', label: '30天' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTimeRange(t.id as any)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                timeRange === t.id
                  ? 'bg-cyan-500/15 border-cyan-400 text-cyan-300 shadow-xs'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 4 KPI Statistical Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">周期累计事件总数</span>
            <div className="text-2xl font-black text-slate-100 mt-1">
              874 <span className="text-xs font-normal text-slate-400">件</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-sans mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> 较上周期下降 14.2%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">全网平均 MTTR 修复时长</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              16.8 <span className="text-xs font-normal text-slate-400">分钟</span>
            </div>
            <div className="text-[11px] text-emerald-400 font-sans mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 提速 4.2 分钟
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">自动化告警降噪/抑制率</span>
            <div className="text-2xl font-black text-purple-300 mt-1">
              88.5%
            </div>
            <div className="text-[11px] text-purple-300 font-sans mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 已自动拦截 14.2万 频繁抖动
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">事件闭环解决率</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              99.4%
            </div>
            <div className="text-[11px] text-amber-400 font-sans mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> SLA 复盘归档通过
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Charts & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Event Trend Chart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100 font-sans">
                事件发生与闭环消除柱状趋势图 ({timeRange})
              </h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block" />
                <span className="text-slate-300 font-sans">发生事件数</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                <span className="text-slate-300 font-sans">闭环解决数</span>
              </div>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-slate-800 font-mono">
            {trendData.map((d, idx) => {
              const occurrencesHeight = Math.max(12, Math.round((d.count / maxTrendCount) * 100));
              const resolvedHeight = Math.max(10, Math.round((d.resolved / maxTrendCount) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.count}/{d.resolved}
                  </div>
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Occurrence bar */}
                    <div
                      style={{ height: `${occurrencesHeight}%` }}
                      className="w-1/2 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-500 group-hover:brightness-125"
                      title={`发生事件数: ${d.count}`}
                    />
                    {/* Resolved bar */}
                    <div
                      style={{ height: `${resolvedHeight}%` }}
                      className="w-1/2 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all duration-500 group-hover:brightness-125"
                      title={`闭环解决数: ${d.resolved}`}
                    />
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-1">{d.time}</span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>分析结论: 08:00~10:00 属于全网感知设备数据回传高峰，事件拦截主要由自动消警规则承担。</span>
            <span className="text-emerald-400 font-bold font-sans">运行正常</span>
          </div>
        </div>

        {/* Right Column (1 Col): Event Type Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <PieChart className="w-4.5 h-4.5 text-purple-400" />
              <h3 className="text-base font-bold text-slate-100 font-sans">
                事件类型占比分布
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">共 5 大类</span>
          </div>

          <div className="space-y-3 font-sans pt-2">
            {typeDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${item.color.split(' ')[0]}`} />
                    <span className="text-slate-200 font-bold">{item.type}</span>
                  </div>
                  <div className="font-mono text-slate-400">
                    <span className="text-slate-100 font-bold">{item.count}</span> 件 ({item.pct}%)
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    style={{ width: `${item.pct}%` }}
                    className={`h-full rounded-full ${item.color.split(' ')[0]}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Subsystem Event Rankings & Engineer MTTR Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subsystem Ranking Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4.5 h-4.5 text-cyan-400" />
              <h3 className="text-base font-bold text-slate-100 font-sans">
                所属系统事件发生次数 Top 5 榜单
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">实时归因</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 text-center w-10">排名</th>
                  <th className="py-2.5 px-3 font-sans">所属系统名称</th>
                  <th className="py-2.5 px-3 text-center">事件数</th>
                  <th className="py-2.5 px-3 text-center">平均 MTTR</th>
                  <th className="py-2.5 px-3 text-right">闭环率</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {systemRanking.map((sys) => (
                  <tr key={sys.rank} className="hover:bg-slate-950/80 transition-colors">
                    <td className="py-3 px-3 text-center font-bold">
                      <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] ${
                        sys.rank === 1 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        sys.rank === 2 ? 'bg-slate-700 text-slate-200' :
                        sys.rank === 3 ? 'bg-amber-800/30 text-amber-500' : 'text-slate-500'
                      }`}>
                        {sys.rank}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-sans text-slate-200 font-medium">
                      {sys.name}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-cyan-300">
                      {sys.count}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">
                      {sys.mttr}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-400">
                      {sys.rate}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engineer MTTR & Performance Ranking */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4.5 h-4.5 text-amber-400" />
              <h3 className="text-base font-bold text-slate-100 font-sans">
                运维工程师事件响应与 MTTR 效能榜
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400">专家组绩效</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2.5 px-3 font-sans">工程师姓名</th>
                  <th className="py-2.5 px-3 text-center font-sans">事件处理数</th>
                  <th className="py-2.5 px-3 text-center">平均响应</th>
                  <th className="py-2.5 px-3 text-center">平均 MTTR</th>
                  <th className="py-2.5 px-3 text-right">效能得分</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {engineerRanking.map((eng, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-200 font-sans">{eng.name}</div>
                      <div className="text-[10px] text-slate-500 font-sans">{eng.title}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-cyan-300">
                      {eng.count} 件
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300">
                      {eng.responseTime}
                    </td>
                    <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                      {eng.mttr}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-amber-400">
                      {eng.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
