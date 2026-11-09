import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, CheckCircle, Clock, Star, Users, 
  Search, Calendar, Filter, PieChart, Activity, ShieldCheck, Zap
} from 'lucide-react';

interface DailyTrendPoint {
  date: string;       // e.g. 2026/11/1
  completed: number;  // 已完成
  pending: number;    // 未完成
  total: number;
}

const RECENT_ANALYTICS_DATA: DailyTrendPoint[] = [
  { date: '2026/11/1', completed: 16, pending: 42, total: 58 },
  { date: '2026/11/2', completed: 18, pending: 40, total: 58 },
  { date: '2026/11/3', completed: 22, pending: 15, total: 37 },
  { date: '2026/11/4', completed: 25, pending: 18, total: 43 },
  { date: '2026/11/5', completed: 32, pending: 12, total: 44 },
  { date: '2026/11/6', completed: 45, pending: 8, total: 53 },
];

export const WorkOrderAnalyticsView: React.FC = () => {
  // Filter Toolbar States matching image_89ab42e8.png
  const [orderTypeFilter, setOrderTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('2026/11/01');
  const [endDate, setEndDate] = useState('2026/11/06');

  // Chart Style Switcher State (User instruction: 柱状图帮我改成其他的图表样式展示)
  const [chartStyle, setChartStyle] = useState<'area' | 'donut' | 'radar'>('area');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(5);

  const handleSearch = () => {
    alert(`已按条件更新工单统计看板：时间范围 [${startDate} ~ ${endDate}]，类型 [${orderTypeFilter}]，状态 [${statusFilter}]`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>工单流转统计与 SLA 履约看板</span>
            <span className="text-xs font-normal text-slate-400">· 全流程图表分析</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            可视化测算工单响应时延、已完成/未完成趋势平滑曲线、类别分布与 SLA 闭环达成率
          </p>
        </div>

        {/* Chart View Style Switcher (Non-bar chart styles) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-sans">
          <button
            onClick={() => setChartStyle('area')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              chartStyle === 'area'
                ? 'bg-cyan-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>平滑趋势曲线面积图</span>
          </button>
          <button
            onClick={() => setChartStyle('donut')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              chartStyle === 'donut'
                ? 'bg-cyan-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieChart className="w-3.5 h-3.5" />
            <span>类型占比环形图</span>
          </button>
          <button
            onClick={() => setChartStyle('radar')}
            className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
              chartStyle === 'radar'
                ? 'bg-cyan-600 text-white shadow-xs font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>SLA 履约雷达视图</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar matching screenshot image_89ab42e8.png:
          全部工单类型 | 全部状态 | 2026/11/01 📅 - 2026/11/06 📅 | 搜索 */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
        {/* Dropdown 1: 全部工单类型 */}
        <select
          value={orderTypeFilter}
          onChange={(e) => setOrderTypeFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
        >
          <option value="all">全部工单类型</option>
          <option value="硬件故障报修">硬件故障报修</option>
          <option value="紧急变更单">紧急变更单</option>
          <option value="软件升级单">软件升级单</option>
          <option value="数据库调优单">数据库调优单</option>
          <option value="网络安全单">网络安全单</option>
        </select>

        {/* Dropdown 2: 全部状态 */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
        >
          <option value="all">全部状态</option>
          <option value="待分析">待分析</option>
          <option value="待审批">待审批</option>
          <option value="待实施">待实施</option>
          <option value="待验证">待验证</option>
          <option value="已完成">已完成</option>
        </select>

        {/* Date Range Picker */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 w-32 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
          </div>
          <span className="text-slate-500">-</span>
          <div className="relative">
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 w-32 focus:outline-none focus:border-cyan-500 font-mono"
            />
            <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
          </div>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3.5 h-3.5" />
          <span>搜索</span>
        </button>
      </div>

      {/* Main Interactive Chart Section (Replaced Column/Bar Chart with Area Curve / Donut / Radar) */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 shadow-md">
        {/* Chart Header Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 font-sans">
                {chartStyle === 'area' && '近期工单完成度平滑趋势曲线 (已完成 vs 未完成)'}
                {chartStyle === 'donut' && '工单类型及来源占比全景分布 (百分比)'}
                {chartStyle === 'radar' && 'SLA 响应与闭环履约质量多维雷达图'}
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {chartStyle === 'area' && '展现近期（2026/11/01 - 2026/11/06）工单处置结案与积压演进脉络'}
              {chartStyle === 'donut' && '分析不同业务组件及工单类型的分布权重，预防特定模块单点故障'}
              {chartStyle === 'radar' && '评估首响速度、解决效率、一次修复率及满意度 5 大维度'}
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 ring-2 ring-cyan-500/20" />
              <span className="text-slate-300 font-sans">已完成工单</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 ring-2 ring-rose-500/20" />
              <span className="text-slate-300 font-sans">未完成/处置中</span>
            </div>
          </div>
        </div>

        {/* CHART DISPLAY STYLE 1: Smooth Area Curve Chart */}
        {chartStyle === 'area' && (
          <div className="space-y-4">
            <div className="text-[11px] font-mono text-slate-500 flex justify-between">
              <span>单位: (条)</span>
              <span>时间节点: 2026/11/01 ~ 2026/11/06</span>
            </div>

            {/* SVG Area Chart Element */}
            <div className="relative h-72 w-full pt-4 pb-8 font-mono">
              {/* Y-Axis dashed grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none border-l border-slate-800 pl-8">
                {[80, 60, 40, 20, 0].map((val) => (
                  <div key={val} className="relative w-full border-b border-slate-800/80 text-[10px] text-slate-500">
                    <span className="absolute -left-7 -top-2 font-mono">{val}</span>
                  </div>
                ))}
              </div>

              {/* Area SVG */}
              <svg className="w-full h-full pl-8 overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="completedGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="pendingGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fb7185" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#fb7185" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Area - Pending */}
                <polygon
                  fill="url(#pendingGrad)"
                  points="0,200 0,95 120,100 240,162 360,155 480,170 600,180 600,200"
                />

                {/* Filled Area - Completed */}
                <polygon
                  fill="url(#completedGrad)"
                  points="0,200 0,160 120,155 240,145 360,137 480,120 600,87 600,200"
                />

                {/* Path Curve Line - Pending */}
                <path
                  d="M0,95 C60,98 60,100 120,100 C180,100 180,162 240,162 C300,162 300,155 360,155 C420,155 420,170 480,170 C540,170 540,180 600,180"
                  fill="none"
                  stroke="#fb7185"
                  strokeWidth="3"
                  strokeDasharray="4 2"
                />

                {/* Path Curve Line - Completed */}
                <path
                  d="M0,160 C60,158 60,155 120,155 C180,155 180,145 240,145 C300,145 300,137 360,137 C420,137 420,120 480,120 C540,120 540,87 600,87"
                  fill="none"
                  stroke="#22d3ee"
                  strokeWidth="3.5"
                />

                {/* Interactive Points */}
                {RECENT_ANALYTICS_DATA.map((pt, idx) => {
                  const x = idx * 120;
                  const compY = 200 - (pt.completed / 80) * 200;
                  const pendY = 200 - (pt.pending / 80) * 200;
                  const isHovered = hoveredPointIndex === idx;

                  return (
                    <g key={pt.date} onMouseEnter={() => setHoveredPointIndex(idx)} className="cursor-pointer">
                      {/* Vertical Hover Line */}
                      {isHovered && (
                        <line x1={x} y1="0" x2={x} y2="200" stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 2" />
                      )}

                      {/* Pending point dot */}
                      <circle cx={x} cy={pendY} r={isHovered ? "6" : "4"} fill="#fb7185" className="transition-all" />

                      {/* Completed point dot */}
                      <circle cx={x} cy={compY} r={isHovered ? "7" : "5"} fill="#22d3ee" stroke="#0284c7" strokeWidth="2" className="transition-all" />
                    </g>
                  );
                })}
              </svg>

              {/* X-Axis Labels */}
              <div className="flex justify-between pl-8 pt-3 text-[11px] text-slate-400 font-mono">
                {RECENT_ANALYTICS_DATA.map((pt) => (
                  <span key={pt.date}>{pt.date}</span>
                ))}
              </div>
            </div>

            {/* Hover Data Detail Card */}
            {hoveredPointIndex !== null && (
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono animate-in fade-in">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-200">
                    日期节点: {RECENT_ANALYTICS_DATA[hoveredPointIndex].date}
                  </span>
                </div>

                <div className="flex items-center gap-6 font-sans">
                  <div>
                    <span className="text-slate-500 text-[11px] block">已完成结案:</span>
                    <span className="text-cyan-400 font-bold font-mono text-sm">
                      {RECENT_ANALYTICS_DATA[hoveredPointIndex].completed} 单
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">待处理/未完成:</span>
                    <span className="text-rose-400 font-bold font-mono text-sm">
                      {RECENT_ANALYTICS_DATA[hoveredPointIndex].pending} 单
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">当日工单总量:</span>
                    <span className="text-slate-200 font-bold font-mono text-sm">
                      {RECENT_ANALYTICS_DATA[hoveredPointIndex].total} 单
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CHART DISPLAY STYLE 2: Donut Distribution Chart */}
        {chartStyle === 'donut' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4 font-sans text-xs">
            {/* Donut Graphic */}
            <div className="flex items-center justify-center relative">
              <div className="w-56 h-56 rounded-full border-8 border-cyan-500/80 border-t-emerald-400 border-r-indigo-500 border-b-rose-500 flex flex-col items-center justify-center shadow-xl shadow-cyan-950/20">
                <span className="text-slate-400 text-xs">全月工单总计</span>
                <span className="text-3xl font-black text-slate-100 font-mono mt-1">287</span>
                <span className="text-[11px] text-emerald-400 font-mono mt-0.5">SLA 达标率 99.4%</span>
              </div>
            </div>

            {/* Distribution Legend */}
            <div className="space-y-3 font-mono">
              {[
                { label: '硬件故障报修 (天线/板卡/硬盘换热)', pct: '35%', count: '101 单', color: 'bg-cyan-400' },
                { label: '软件升级与补丁缝补 (灰度滚动发布)', pct: '28%', count: '80 单', color: 'bg-emerald-400' },
                { label: '数据库与缓存调优 (Binlog/BigKey)', pct: '22%', count: '63 单', color: 'bg-indigo-400' },
                { label: '网络与安全策略调整 (防火墙/SFP+)', pct: '15%', count: '43 单', color: 'bg-rose-400' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${item.color}`} />
                    <span className="text-slate-200 font-sans text-xs">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono">
                    <span className="text-cyan-300 font-bold">{item.pct}</span>
                    <span className="text-slate-500 text-[11px]">({item.count})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHART DISPLAY STYLE 3: SLA Compliance Radar View */}
        {chartStyle === 'radar' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center py-4 font-sans text-xs">
            {/* Radar Simulated Pentagon Matrix */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center space-y-4">
              <div className="relative w-48 h-48 border border-cyan-500/30 rounded-full flex items-center justify-center">
                <div className="w-36 h-36 border border-cyan-500/40 rounded-full flex items-center justify-center">
                  <div className="w-24 h-24 border border-cyan-500/60 rounded-full flex items-center justify-center bg-cyan-500/10">
                    <Zap className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                </div>
              </div>
              <span className="text-xs text-cyan-300 font-mono font-bold">
                运维服务质量 SLA 综合考评: A+ 级
              </span>
            </div>

            {/* Radar Metrics Table */}
            <div className="space-y-3 font-mono">
              {[
                { metric: '平均首响响应耗时 (FRT)', target: '≤ 10分钟', actual: '6.2 分钟', status: '优异' },
                { metric: '平均故障解决时长 (MTTR)', target: '≤ 4.0小时', actual: '1.8 小时', status: '优异' },
                { metric: '工单一次性解决闭环率', target: '≥ 95.0%', actual: '98.5%', status: '达标' },
                { metric: '业务满意度星级评分', target: '≥ 4.80', actual: '4.95 / 5.0', status: '优异' },
              ].map((m, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-200 font-sans font-bold">{m.metric}</div>
                    <div className="text-[11px] text-slate-500">承诺指标: {m.target}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold font-mono text-sm">{m.actual}</div>
                    <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-sans">
                      {m.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard and Performance breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engineer Workload Leaderboard */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-sans">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>核心运维工程师闭环效能矩阵</span>
          </h3>

          <div className="space-y-3">
            {[
              { name: '张帆', role: '全息基础设施架构组', closed: 48, avgTime: '1.2h', rating: 4.98 },
              { name: '赵振华', role: 'DBA 数据库专家组', closed: 36, avgTime: '1.5h', rating: 4.95 },
              { name: '严亮', role: '中间件与高速缓存组', closed: 29, avgTime: '0.8h', rating: 4.92 },
              { name: '刘芳', role: '网络与安全保障组', closed: 22, avgTime: '2.1h', rating: 4.90 },
            ].map((eng, idx) => (
              <div
                key={eng.name}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400 text-[11px]">
                    {idx + 1}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-200 font-sans">{eng.name}</div>
                    <div className="text-[11px] text-slate-500 font-sans">{eng.role}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4 font-mono text-slate-300">
                  <span>办结: <strong className="text-emerald-400">{eng.closed}</strong> 单</span>
                  <span>均时: {eng.avgTime}</span>
                  <span className="text-amber-400 font-bold">★ {eng.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work Order Category Turnaround Times */}
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-sans">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>各类别工单平均流转闭环时长</span>
          </h3>

          <div className="space-y-3">
            {[
              { label: '硬件故障报修 (现场检修/更换原厂部件)', time: '1.8 小时', pct: 60, color: 'bg-rose-500' },
              { label: '资源扩容审批 (Flink / YARN 队列调配)', time: '0.6 小时', pct: 25, color: 'bg-cyan-500' },
              { label: '组件版本升级 (灰度平滑滚动发布)', time: '3.4 小时', pct: 90, color: 'bg-indigo-500' },
              { label: '安全权限申请 (堡垒机 / BMC 临时提权)', time: '0.3 小时', pct: 15, color: 'bg-emerald-500' },
              { label: '性能调优工单 (Binlog 复制/BigKey 拆解)', time: '2.2 小时', pct: 70, color: 'bg-amber-500' },
            ].map((cat, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-300 font-medium font-sans">{cat.label}</span>
                  <span className="text-slate-400">{cat.time}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${cat.color}`}
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
