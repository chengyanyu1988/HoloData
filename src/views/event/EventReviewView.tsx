import React, { useState } from 'react';
import { 
  History, Search, Filter, BookOpen, Clock, Eye, 
  CheckCircle2, AlertTriangle, ShieldCheck, X, ChevronLeft, ChevronRight, PlayCircle, GitCommit
} from 'lucide-react';

export interface EventReviewItem {
  id: string;              // e.g. REV-2026-99101
  title: string;           // 标题
  type: string;            // 事件类型
  occurTime: string;       // 发生时间
  severity: '重大' | '严重' | '一般' | '轻微' | '消息'; // 级别
  status: '已复盘' | '已生成SOP' | '专家复盘' | '待追责'; // 状态
  systemName: string;      // 所属系统
  sourceIp: string;        // 来源IP
  assignee: string;        // 负责人
  handler: string;         // 处理人
  count: number;           // 发生次数
  rootCause: string;       // 根因分析
  takeaway: string;        // 改进建议与复盘沉淀
  timelineTrace: { time: string; stage: string; note: string }[];
}

const INITIAL_REVIEW_EVENTS: EventReviewItem[] = [
  {
    id: 'REV-2026-99101',
    title: '天津西区 04 号读写天线驻波比损耗复盘',
    type: '硬件故障',
    occurTime: '2026/11/05 16:20:00',
    severity: '严重',
    status: '已复盘',
    systemName: '电子标识感知集中监控系统',
    sourceIp: '10.120.45.21',
    assignee: '张建国',
    handler: '李明远',
    count: 2,
    rootCause: '户外同轴射频缆线接口密封防潮胶带老化渗水，导致馈线阻抗增加，引发驻波比(VSWR)升至 2.15。',
    takeaway: '全面排查西区 24 处卡口天线接头，升级为 IP68 军工级双层防防潮防水热缩套管。',
    timelineTrace: [
      { time: '2026/11/05 16:20:00', stage: '告警触发', note: 'VSWR 指标突破阈值 1.5，系统自动生成严重告警' },
      { time: '2026/11/05 16:22:15', stage: '响应派单', note: '值班员响应并把工单指派给硬件工程师李明远' },
      { time: '2026/11/05 16:35:00', stage: '现场定位', note: '现场示波器检测发现 4 号通道馈线反射功率偏大' },
      { time: '2026/11/05 16:50:00', stage: '故障排除', note: '更换新封装同轴缆线及避雷适配器，驻波比恢复至 1.12' },
      { time: '2026/11/05 17:10:00', stage: '复盘归档', note: '完成复盘报告并更新户外天线防潮保养规范文档' },
    ],
  },
  {
    id: 'REV-2026-99102',
    title: 'MySQL 高可用数据库主从复制心跳超时复盘',
    type: '软件异常',
    occurTime: '2026/11/05 11:10:00',
    severity: '重大',
    status: '已生成SOP',
    systemName: '全息资产高可用数据库集群',
    sourceIp: '10.120.12.04',
    assignee: '赵振华',
    handler: '赵振华',
    count: 1,
    rootCause: '全量快照备份任务在高峰期执行，触发磁盘 IO 吞吐满载，致使 Binlog dump 线程微延迟。',
    takeaway: '将全量物理备份任务调整至凌晨 03:00~05:00 业务低峰期，并启用 cgroups 限制备份进程 IO 限速。',
    timelineTrace: [
      { time: '2026/11/05 11:10:00', stage: '告警触发', note: 'Slave 延迟超过 10s 判定阈值' },
      { time: '2026/11/05 11:11:30', stage: 'DBA 接入', note: '赵振华介入定位到与 xtrabackup 进程抢占 IO 资源' },
      { time: '2026/11/05 11:15:00', stage: '应急处置', note: '临时暂停全量备份进程，优先保障主从同步' },
      { time: '2026/11/05 11:18:00', stage: '恢复确认', note: '复制延迟降低至 0ms，主从数据全量一致' },
    ],
  },
  {
    id: 'REV-2026-99103',
    title: '高新区双基识读车道 03 号 AI 视觉响应超时复盘',
    type: '接口超时',
    occurTime: '2026/11/04 19:45:00',
    severity: '一般',
    status: '已复盘',
    systemName: '双基识读融合推断分析系统',
    sourceIp: '10.120.34.60',
    assignee: '王海峰',
    handler: '王海峰',
    count: 3,
    rootCause: '夜间雨雪天气导致车牌反射杂光，AI 模型置信度较低触发昂贵的多次反向修正计算。',
    takeaway: '引入前端补光灯亮度自动适应策略，优化 TensorRT 模型的算子批处理大小（Batch Size=8）。',
    timelineTrace: [
      { time: '2026/11/04 19:45:00', stage: '告警触发', note: 'Restful 接口耗时达到 3,250ms' },
      { time: '2026/11/04 19:48:00', stage: '降级生效', note: '系统自动开启快速过滤降级，优先保证 RFID 识读数据' },
      { time: '2026/11/04 20:05:00', stage: '参数热更新', note: '调整显存池大小与推理线程数，响应降至 120ms' },
    ],
  },
  {
    id: 'REV-2026-99104',
    title: '海河卡口边缘控制器 PoE 网口丢包复盘分析',
    type: '网络抖动',
    occurTime: '2026/11/04 14:15:00',
    severity: '轻微',
    status: '已生成SOP',
    systemName: '智慧交通RFID数据采集网关系统',
    sourceIp: '10.120.99.15',
    assignee: '李明远',
    handler: '李明远',
    count: 4,
    rootCause: 'PoE 交换机芯片温度升高引发以太网物理层自协商双工模式误切换。',
    takeaway: '在网关控制器上固化 1000Mbps Full-Duplex 强制全双工参数，禁止自动重协商降级。',
    timelineTrace: [
      { time: '2026/11/04 14:15:00', stage: '告警触发', note: '物理丢包率突破 0.5% 指标线' },
      { time: '2026/11/04 14:22:00', stage: '远程调优', note: '下发命令锁定网口双工速率，丢包率瞬间归零' },
    ],
  },
  {
    id: 'REV-2026-99105',
    title: 'Redis 缓存集群大 Key 穿透打爆后端存储复盘',
    type: '软件异常',
    occurTime: '2026/11/03 22:30:00',
    severity: '严重',
    status: '专家复盘',
    systemName: '高速缓存调度与分布式锁中心',
    sourceIp: '10.120.88.04',
    assignee: '顾亚军',
    handler: '顾亚军',
    count: 2,
    rootCause: '热门全息标签配置全局 Hash Key 未设置随机过期时间，多节点集中在整点失效。',
    takeaway: '引入 Cache Expire Jitter（随机打散 300s~600s 过期窗口）与布隆过滤器（BloomFilter）。',
    timelineTrace: [
      { time: '2026/11/03 22:30:00', stage: '告警触发', note: 'Redis 命中率降至 72%，DB 查询并发骤增' },
      { time: '2026/11/03 22:33:00', stage: '热加载', note: '手动热刷新分布式二级缓存，隔离数据库穿透流量' },
    ],
  },
  {
    id: 'REV-2026-99106',
    title: '核心网关防火墙长连接会话表容量爆表事件回顾',
    type: '网络抖动',
    occurTime: '2026/11/03 15:10:00',
    severity: '重大',
    status: '待追责',
    systemName: '边界网络安全防护防火墙',
    sourceIp: '10.120.01.01',
    assignee: '程总工',
    handler: '程总工',
    count: 5,
    rootCause: '第三方外部压力测试工具未正常发送 FIN/RST 报文，导致数百万长连接僵死保持。',
    takeaway: '对压测网段实施独立沙箱隔离，防火墙上线 Keep-Alive 超时强制释放规则（120s）。',
    timelineTrace: [
      { time: '2026/11/03 15:10:00', stage: '告警触发', note: '防火墙并发 TCP 会话突破 170 万' },
      { time: '2026/11/03 15:18:00', stage: '命令清理', note: '执行 CLI 命令 `clear session all inactive` 释放连接' },
    ],
  },
  {
    id: 'REV-2026-99107',
    title: '机房防爆电磁波瞬态噪声引起传感抖动复盘',
    type: '传感器失效',
    occurTime: '2026/11/02 10:20:00',
    severity: '轻微',
    status: '已复盘',
    systemName: '动环物联网硬件检测系统',
    sourceIp: '10.120.78.12',
    assignee: '孙立伟',
    handler: '孙立伟',
    count: 1,
    rootCause: '机房新装大功率空调配电箱启动瞬间产生脉冲尖峰干扰。',
    takeaway: '为传感采集总线加装屏蔽磁环与防浪涌压敏电阻。',
    timelineTrace: [
      { time: '2026/11/02 10:20:00', stage: '告警触发', note: '温湿度离群尖峰抖动' },
      { time: '2026/11/02 10:35:00', stage: '加装屏蔽', note: '现场硬件加固后恢复正常' },
    ],
  },
];

export const EventReviewView: React.FC = () => {
  const [eventsList] = useState<EventReviewItem[]>(INITIAL_REVIEW_EVENTS);

  // Search & Filter state variables matching screenshot image_acb853ea.png:
  // 请输入告警内容, 所有事件, 全部事件级别, 全部状态, 搜索
  const [titleSearch, setTitleSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states (Per user prompt: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive Modal State for Retrospective Timeline Replay Modal (查看详情 / 复盘回顾)
  const [viewingReviewEvent, setViewingReviewEvent] = useState<EventReviewItem | null>(null);

  // Filter Logic
  const filteredEvents = eventsList.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(titleSearch.toLowerCase()) || 
                         item.id.toLowerCase().includes(titleSearch.toLowerCase()) ||
                         item.systemName.toLowerCase().includes(titleSearch.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesTitle && matchesType && matchesSeverity && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / pageSize));
  const currentPageItems = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
    setJumpPageInput(String(validPage));
  };

  const getSeverityBadgeClass = (sev: EventReviewItem['severity']) => {
    switch (sev) {
      case '重大':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30 font-bold';
      case '严重':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30 font-bold';
      case '一般':
        return 'text-amber-400 bg-amber-500/15 border-amber-500/30';
      case '轻微':
        return 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30';
      case '消息':
        return 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30';
    }
  };

  const getStatusBadgeClass = (st: EventReviewItem['status']) => {
    switch (st) {
      case '已复盘':
        return 'text-cyan-400 font-bold';
      case '已生成SOP':
        return 'text-emerald-400 font-bold';
      case '专家复盘':
        return 'text-purple-400 font-bold';
      case '待追责':
        return 'text-rose-400 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Redesigned DataOps Retrospective Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">已完成复盘事件</span>
            <div className="text-2xl font-black text-cyan-300 mt-1">
              {eventsList.length} <span className="text-xs font-normal text-slate-400">件</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <History className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">沉淀运维 SOP 规范</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {eventsList.filter((e) => e.status === '已生成SOP').length + 5} <span className="text-xs font-normal text-slate-400">篇</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">根因分析 SLA 达标率</span>
            <div className="text-2xl font-black text-purple-300 mt-1">
              96.2%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">同类故障再次复发率</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              0.00%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card: 事件中心 · 事件回顾 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <History className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">事件复盘回顾档案库</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              事件中心 · 每页 10 条数据
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            复盘归因审计标准: IEEE 730
          </span>
        </div>

        {/* Filter Toolbar matching exact inputs from image_acb853ea.png:
            请输入告警内容, 所有事件, 全部事件级别, 全部状态, 搜索 */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Input 1: 请输入告警内容 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入告警内容 / 标题 / ID"
              value={titleSearch}
              onChange={(e) => {
                setTitleSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52 font-sans"
            />
          </div>

          {/* Dropdown 1: 所有事件 (事件类型) */}
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">所有事件 (类型)</option>
            <option value="硬件故障">硬件故障</option>
            <option value="网络抖动">网络抖动</option>
            <option value="软件异常">软件异常</option>
            <option value="传感器失效">传感器失效</option>
            <option value="接口超时">接口超时</option>
          </select>

          {/* Dropdown 2: 全部事件级别 */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部事件级别</option>
            <option value="重大">重大</option>
            <option value="严重">严重</option>
            <option value="一般">一般</option>
            <option value="轻微">轻微</option>
            <option value="消息">消息</option>
          </select>

          {/* Dropdown 3: 全部状态 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部状态</option>
            <option value="已复盘">已复盘</option>
            <option value="已生成SOP">已生成SOP</option>
            <option value="专家复盘">专家复盘</option>
            <option value="待追责">待追责</option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table matching exact columns & layout from image_acb853ea.png:
            编号, ID, 标题, 事件类型, 发生时间, 级别, 状态, 所属系统, 来源IP, 负责人, 处理人, 发生次数, 操作 (查看详情) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3 text-center w-12">编号</th>
                <th className="py-3 px-3">ID</th>
                <th className="py-3 px-3">标题</th>
                <th className="py-3 px-3">事件类型</th>
                <th className="py-3 px-3">发生时间</th>
                <th className="py-3 px-3 text-center">级别</th>
                <th className="py-3 px-3 text-center">状态</th>
                <th className="py-3 px-3">所属系统</th>
                <th className="py-3 px-3">来源IP</th>
                <th className="py-3 px-3 font-sans">负责人</th>
                <th className="py-3 px-3 font-sans">处理人</th>
                <th className="py-3 px-3 text-center">发生次数</th>
                <th className="py-3 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentPageItems.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-500 font-sans">
                    暂无符合条件的事件回顾记录
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                      onClick={() => setViewingReviewEvent(item)}
                    >
                      {/* 1. 编号 */}
                      <td className="py-3 px-3 text-center text-slate-500 font-mono">
                        {globalIdx}
                      </td>

                      {/* 2. ID */}
                      <td className="py-3 px-3 text-cyan-400 font-mono font-bold">
                        {item.id}
                      </td>

                      {/* 3. 标题 */}
                      <td className="py-3 px-3 font-semibold text-slate-200 font-sans max-w-[200px]">
                        <div className="truncate" title={item.title}>
                          {item.title}
                        </div>
                      </td>

                      {/* 4. 事件类型 */}
                      <td className="py-3 px-3 text-slate-300 font-sans">
                        {item.type}
                      </td>

                      {/* 5. 发生时间 */}
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {item.occurTime}
                      </td>

                      {/* 6. 级别 */}
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-sans border inline-block ${getSeverityBadgeClass(item.severity)}`}>
                          {item.severity}
                        </span>
                      </td>

                      {/* 7. 状态 */}
                      <td className="py-3 px-3 text-center font-sans">
                        <span className={`text-[11px] inline-block ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* 8. 所属系统 */}
                      <td className="py-3 px-3 text-slate-300 font-sans max-w-[150px]">
                        <div className="truncate" title={item.systemName}>
                          {item.systemName}
                        </div>
                      </td>

                      {/* 9. 来源IP */}
                      <td className="py-3 px-3 text-slate-400 font-mono">
                        {item.sourceIp}
                      </td>

                      {/* 10. 负责人 */}
                      <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                        {item.assignee}
                      </td>

                      {/* 11. 处理人 */}
                      <td className="py-3 px-3 text-slate-300 font-sans">
                        {item.handler}
                      </td>

                      {/* 12. 发生次数 */}
                      <td className="py-3 px-3 text-center font-bold text-cyan-300">
                        {item.count}
                      </td>

                      {/* 13. 操作: 查看详情 (Matching screenshot image_acb853ea.png) */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingReviewEvent(item);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium font-sans hover:underline"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Matching prompt discipline: 每页显示10条数据) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredEvents.length)} 条，共 {filteredEvents.length} 条回顾档案
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-40"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-2.5 py-1 rounded font-bold ${
                    currentPage === p
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-40"
              >
                &gt;
              </button>
            </div>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none font-sans"
            >
              <option value="10">10条/页</option>
              <option value="20">20条/页</option>
              <option value="50">50条/页</option>
            </select>

            {/* Jump Page */}
            <div className="flex items-center gap-1.5 font-sans">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const parsed = parseInt(jumpPageInput, 10);
                    if (!isNaN(parsed)) handlePageChange(parsed);
                  }
                }}
                className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center text-slate-200 font-mono"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modal: Retrospective Timeline Replay Modal (查看详情 / 事件回顾) */}
      {viewingReviewEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  事件全生命周期复盘重放档案 ({viewingReviewEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setViewingReviewEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              {/* Event Header info */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block font-sans">事件标题:</span>
                  <span className="text-slate-100 font-bold font-sans text-sm block">{viewingReviewEvent.title}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-400 block font-sans">所属系统:</span>
                    <span className="text-cyan-300 font-bold font-sans">{viewingReviewEvent.systemName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">事故责任人/处理人:</span>
                    <span className="text-emerald-400 font-bold font-sans">{viewingReviewEvent.assignee} / {viewingReviewEvent.handler}</span>
                  </div>
                </div>
              </div>

              {/* Root Cause & Takeaways */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                  <span className="text-rose-400 font-bold text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> 事故根本原因 (Root Cause)
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">{viewingReviewEvent.rootCause}</p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> 复盘建议与 SOP 规范沉淀
                  </span>
                  <p className="text-slate-300 text-xs leading-relaxed">{viewingReviewEvent.takeaway}</p>
                </div>
              </div>

              {/* Retrospective Timeline Replay Trace */}
              <div className="space-y-2 pt-2">
                <span className="text-slate-300 font-bold font-sans flex items-center gap-2 text-xs">
                  <PlayCircle className="w-4 h-4 text-cyan-400" />
                  时间轴诊断轨迹复盘重放 (Timeline Replay Trace)
                </span>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  {viewingReviewEvent.timelineTrace.map((step, sIdx) => (
                    <div key={sIdx} className="flex gap-3 relative">
                      {sIdx < viewingReviewEvent.timelineTrace.length - 1 && (
                        <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-800" />
                      )}
                      <div className="w-5 h-5 rounded-full bg-slate-900 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 z-10 text-[10px]">
                        <GitCommit className="w-3 h-3" />
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="text-cyan-400 font-bold">{step.stage}</span>
                          <span className="text-slate-500">{step.time}</span>
                        </div>
                        <div className="text-slate-300 font-sans text-xs">{step.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewingReviewEvent(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors"
              >
                关闭档案
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
