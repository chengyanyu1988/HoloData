import React, { useState } from 'react';
import { 
  AlertCircle, Search, Filter, ShieldAlert, CheckCircle2, UserCheck, 
  ArrowRightLeft, FileText, XCircle, Eye, Wrench, X, Clock, ChevronLeft, ChevronRight, UserPlus
} from 'lucide-react';

export interface EventTodoItem {
  id: string;              // e.g. EVT-2026-2910211
  title: string;           // 标题: e.g. 天津港RFID天线阵列阻抗衰减告警
  type: string;            // 事件类型: 硬件故障 / 网络抖动 / 软件异常 / 传感器失效 / 接口超时
  occurTime: string;       // 发生时间: 2026/11/06 09:42:15
  severity: '重大' | '严重' | '一般' | '轻微' | '消息'; // 级别
  status: '未处理' | '已指派' | '已转派' | '处理中';   // 状态
  systemName: string;      // 所属系统
  sourceIp: string;        // 来源IP
  assignee: string;        // 负责人
  handler: string;         // 处理人 ("-" 或 名字)
  count: number;           // 发生次数
  description?: string;
}

const INITIAL_TODO_EVENTS: EventTodoItem[] = [
  {
    id: 'EVT-2026-2910211',
    title: '天津西区04号读写天线驻波比回波损耗超限告警',
    type: '硬件故障',
    occurTime: '2026/11/06 09:42:15',
    severity: '严重',
    status: '未处理',
    systemName: '电子标识感知集中监控系统',
    sourceIp: '10.120.45.21',
    assignee: '张建国',
    handler: '—',
    count: 1,
    description: '读写天线4号通道驻波比(VSWR)达到 2.15，超出正常工作区间 [1.0, 1.5]，导致RFID标签感应识别距离衰减约40%。',
  },
  {
    id: 'EVT-2026-2910212',
    title: '海河卡口边缘控制器PoE网口物理链路丢包率升高',
    type: '网络抖动',
    occurTime: '2026/11/06 09:30:00',
    severity: '一般',
    status: '已指派',
    systemName: '智慧交通RFID数据采集网关系统',
    sourceIp: '10.120.99.15',
    assignee: '李明远',
    handler: '李明远',
    count: 2,
    description: '千兆PoE供电网口以太网物理层错误帧数递增，5分钟内累计丢包185帧，怀疑由于户外接线盒防潮胶垫老化所致。',
  },
  {
    id: 'EVT-2026-2910213',
    title: '集中监控引擎Kafka消费组Rebalance引起消息积压',
    type: '软件异常',
    occurTime: '2026/11/06 09:12:40',
    severity: '消息',
    status: '已转派',
    systemName: '实时流式计算处理平台',
    sourceIp: '10.120.21.88',
    assignee: '张帆',
    handler: '程总工',
    count: 3,
    description: 'Kafka 主题 `rfid-telemetry-events` 消费组在拓扑调整时触发重新平衡，产生 12,400 条临时推迟消费积压。',
  },
  {
    id: 'EVT-2026-2910214',
    title: '高新区双基识读车道视频系统AI算法服务响应超时',
    type: '接口超时',
    occurTime: '2026/11/06 08:55:10',
    severity: '严重',
    status: '处理中',
    systemName: '双基识读融合推断分析系统',
    sourceIp: '10.120.34.60',
    assignee: '王海峰',
    handler: '王海峰',
    count: 4,
    description: '视频流OCR车牌特征提取Restful接口响应时间达到 3,250ms，触发高时延超时降级机制。',
  },
  {
    id: 'EVT-2026-2910215',
    title: '核心数据节点MySQL主从复制Heartbeat续约微中断',
    type: '软件异常',
    occurTime: '2026/11/06 08:38:00',
    severity: '严重',
    status: '处理中',
    systemName: '全息资产高可用数据库集群',
    sourceIp: '10.120.12.04',
    assignee: '赵振华',
    handler: '赵振华',
    count: 5,
    description: '备库在拉取 Binary Log 时因为 IO 密集型快照备份导致 8 秒延迟，触发心跳报警。',
  },
  {
    id: 'EVT-2026-2910216',
    title: '东丽机房 02 号机柜环境温度探测传感器读数突变',
    type: '传感器失效',
    occurTime: '2026/11/06 08:15:30',
    severity: '一般',
    status: '未处理',
    systemName: '动环物联网硬件检测系统',
    sourceIp: '10.120.78.33',
    assignee: '孙立伟',
    handler: '—',
    count: 1,
    description: '温湿度感知节点报出 85.0°C 离群读数，但周围服务器板载温度传感器均处于 28°C 正常状态，疑似传感器漂移。',
  },
  {
    id: 'EVT-2026-2910217',
    title: '全栈分析引擎 Redis 内存缓存命中率急剧下探',
    type: '软件异常',
    occurTime: '2026/11/06 07:50:00',
    severity: '轻微',
    status: '已指派',
    systemName: '高速缓存调度与分布式锁中心',
    sourceIp: '10.120.88.19',
    assignee: '顾亚军',
    handler: '顾亚军',
    count: 2,
    description: '热点主键失效集中导致穿透请求直达后端存储，Redis 缓存命中率由 99.2% 降至 78.4%。',
  },
  {
    id: 'EVT-2026-2910218',
    title: '核心网关防火墙长连接会话表容量告警 (>88%)',
    type: '网络抖动',
    occurTime: '2026/11/06 07:22:10',
    severity: '重大',
    status: '未处理',
    systemName: '边界网络安全防护防火墙',
    sourceIp: '10.120.01.01',
    assignee: '程总工',
    handler: '—',
    count: 6,
    description: '防火墙并发 TCP 会话达到 1,760,000 条，接近 200 万会话表硬件上限，需清理僵尸 TCP 状态。',
  },
  {
    id: 'EVT-2026-2910219',
    title: 'RFID固定式读写器03号芯片物理过热降频预警',
    type: '硬件故障',
    occurTime: '2026/11/06 06:45:00',
    severity: '重大',
    status: '处理中',
    systemName: '电子标识感知集中监控系统',
    sourceIp: '10.120.45.89',
    assignee: '张建国',
    handler: '李明远',
    count: 8,
    description: '固化芯片温度升高至 68.5°C，主板温控机制已启动降频防护，功率由 30dBm 降至 22dBm。',
  },
  {
    id: 'EVT-2026-2910220',
    title: '边缘应用 Kubernetes 容器 Pod 频发 OOMKilled 报错',
    type: '软件异常',
    occurTime: '2026/11/06 06:10:30',
    severity: '严重',
    status: '已指派',
    systemName: 'K8s 容器云微服务平台',
    sourceIp: '10.120.66.12',
    assignee: '王海峰',
    handler: '王海峰',
    count: 3,
    description: '容器 `tag-decoder-worker-v2` 内存Limit配置为 2GiB，因未释放图谱缓存触发系统级 OOM 杀进程。',
  },
  {
    id: 'EVT-2026-2910221',
    title: '光纤交换机 08 端口 SAN 存储网络 FC 链路光功率衰减',
    type: '硬件故障',
    occurTime: '2026/11/05 23:40:00',
    severity: '一般',
    status: '未处理',
    systemName: 'SAN 光纤存储网络架构',
    sourceIp: '10.120.05.77',
    assignee: '赵振华',
    handler: '—',
    count: 1,
    description: 'SFP+ 光模块接收光功率下降至 -14.2 dBm，达到预设预警下限 -15.0 dBm。',
  },
  {
    id: 'EVT-2026-2910222',
    title: 'API 网关中心 HTTP 504 Gateway Timeout 突增异常',
    type: '接口超时',
    occurTime: '2026/11/05 21:15:00',
    severity: '轻微',
    status: '已转派',
    systemName: 'API 路由与服务网关系统',
    sourceIp: '10.120.90.11',
    assignee: '张帆',
    handler: '顾亚军',
    count: 7,
    description: '外部客户端轮询查询并发量在 21:00 突增 300%，网关上游连接池满载引发 504 响应。',
  },
];

export const EventTodoView: React.FC = () => {
  const [eventsList, setEventsList] = useState<EventTodoItem[]>(INITIAL_TODO_EVENTS);

  // Search & Filter state variables matching screenshot image_6dd02cf9.png
  const [titleSearch, setTitleSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states (Per user prompt: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive Modals State
  const [viewingEvent, setViewingEvent] = useState<EventTodoItem | null>(null);
  const [assigningEvent, setAssigningEvent] = useState<EventTodoItem | null>(null);
  const [transferringEvent, setTransferringEvent] = useState<EventTodoItem | null>(null);
  const [convertingWorkOrderEvent, setConvertingWorkOrderEvent] = useState<EventTodoItem | null>(null);
  const [closingEvent, setClosingEvent] = useState<EventTodoItem | null>(null);

  // Form input states for modals
  const [newAssigneeInput, setNewAssigneeInput] = useState('李明远');
  const [transferTargetInput, setTransferTargetInput] = useState('程总工');
  const [closeNoteInput, setCloseNoteInput] = useState('经现场核查设备无异常，系短时误报抖动，已人工闭环');

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

  // Action Handlers
  const handleRespondEvent = (item: EventTodoItem) => {
    setEventsList((prev) =>
      prev.map((e) =>
        e.id === item.id ? { ...e, status: '处理中', handler: e.handler === '—' ? '当前操作员' : e.handler } : e
      )
    );
    alert(`已快速响应事件 ${item.id}！当前状态更变为「处理中」。`);
  };

  const confirmAssign = () => {
    if (assigningEvent) {
      setEventsList((prev) =>
        prev.map((e) =>
          e.id === assigningEvent.id ? { ...e, status: '已指派', assignee: newAssigneeInput, handler: newAssigneeInput } : e
        )
      );
      setAssigningEvent(null);
      alert(`已成功将事件 ${assigningEvent.id} 指派给 ${newAssigneeInput}！`);
    }
  };

  const confirmTransfer = () => {
    if (transferringEvent) {
      setEventsList((prev) =>
        prev.map((e) =>
          e.id === transferringEvent.id ? { ...e, status: '已转派', handler: transferTargetInput } : e
        )
      );
      setTransferringEvent(null);
      alert(`已成功将事件 ${transferringEvent.id} 转派给 ${transferTargetInput}！`);
    }
  };

  const confirmCloseEvent = () => {
    if (closingEvent) {
      setEventsList((prev) => prev.filter((e) => e.id !== closingEvent.id));
      setClosingEvent(null);
      alert(`已成功闭环关闭事件 ${closingEvent.id}！`);
    }
  };

  const getSeverityBadgeClass = (sev: EventTodoItem['severity']) => {
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

  const getStatusBadgeClass = (st: EventTodoItem['status']) => {
    switch (st) {
      case '未处理':
        return 'text-rose-400 font-bold animate-pulse';
      case '已指派':
        return 'text-cyan-400 font-semibold';
      case '已转派':
        return 'text-blue-400 font-semibold';
      case '处理中':
        return 'text-amber-400 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Redesigned DataOps Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">待办事件总数</span>
            <div className="text-2xl font-black text-slate-100 mt-1">
              {eventsList.length} <span className="text-xs font-normal text-slate-400">件</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">未处理高危事件</span>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {eventsList.filter((e) => e.status === '未处理' && (e.severity === '重大' || e.severity === '严重')).length} <span className="text-xs font-normal text-slate-400">件</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">处置中工单关联事件</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {eventsList.filter((e) => e.status === '处理中').length} <span className="text-xs font-normal text-slate-400">件</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">平均响应处置时长</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              2.4 <span className="text-xs font-normal text-slate-400">分钟</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card: 事件中心 · 待办事件 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">待办事件列表</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              事件中心 · 每页 10 条数据
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            当前可派发工程师: 6人 在线
          </span>
        </div>

        {/* Search & Filter Bar matching exact elements from image_6dd02cf9.png */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Input 1: 请输入告警内容 / 标题 */}
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
            <option value="未处理">未处理</option>
            <option value="已指派">已指派</option>
            <option value="已转派">已转派</option>
            <option value="处理中">处理中</option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table matching exact 13 columns from image_6dd02cf9.png:
            编号, ID, 标题, 事件类型, 发生时间, 级别, 状态, 所属系统, 来源IP, 负责人, 处理人, 发生次数, 操作 */}
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
                    暂无符合条件的待办事件数据
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                      onClick={() => setViewingEvent(item)}
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

                      {/* 13. 操作: 指派, 转派, 响应, 查看详情, 转成工单, 关闭事件 */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-sans">
                          {/* 指派 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssigningEvent(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                            title="指派负责人"
                          >
                            指派
                          </button>

                          {/* 转派 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setTransferringEvent(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                            title="转派他人"
                          >
                            转派
                          </button>

                          {/* 响应 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRespondEvent(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                            title="响应确认"
                          >
                            响应
                          </button>

                          {/* 查看详情 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingEvent(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                            title="查看详情"
                          >
                            查看详情
                          </button>

                          {/* 转成工单 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConvertingWorkOrderEvent(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                            title="生成工单"
                          >
                            转成工单
                          </button>

                          {/* 关闭事件 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setClosingEvent(item);
                            }}
                            className="text-cyan-400 hover:text-rose-400 text-[11px] font-medium hover:underline"
                            title="关闭闭环"
                          >
                            关闭事件
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Matching screenshot & prompt constraint: 10条/页) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredEvents.length)} 条，共 {filteredEvents.length} 条数据
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

      {/* Modal 1: 指派 Modal */}
      {assigningEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  指派事件处理工程师 ({assigningEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setAssigningEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-300 font-bold">{assigningEvent.title}</div>
                <div className="text-slate-400 text-[11px] font-mono">所属系统: {assigningEvent.systemName}</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">选择目标负责人:</label>
                <select
                  value={newAssigneeInput}
                  onChange={(e) => setNewAssigneeInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="李明远">李明远 (硬件高级工程师)</option>
                  <option value="张建国">张建国 (感应识别架构师)</option>
                  <option value="程总工">程总工 (全栈基础设施专家)</option>
                  <option value="王海峰">王海峰 (AI 视觉开发组长)</option>
                  <option value="赵振华">赵振华 (数据库 DBA)</option>
                  <option value="顾亚军">顾亚军 (SRE 运维工程师)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setAssigningEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={confirmAssign}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors font-sans"
              >
                确认指派
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: 转派 Modal */}
      {transferringEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  转派事件至第三方团队 ({transferringEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setTransferringEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-300 font-bold">{transferringEvent.title}</div>
                <div className="text-slate-400 text-[11px]">原处理人: {transferringEvent.handler}</div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">转派接收工程师/专家:</label>
                <select
                  value={transferTargetInput}
                  onChange={(e) => setTransferTargetInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="程总工">程总工 (全栈基础设施专家)</option>
                  <option value="网络安全专家组">网络安全专家组 (外勤支援)</option>
                  <option value="RFID厂商售后">RFID 厂商售后服务团队</option>
                  <option value="赵振华">赵振华 (DBA 专家)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setTransferringEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={confirmTransfer}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors font-sans"
              >
                确认转派
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: 查看详情 Modal */}
      {viewingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  事件全息明细详情 ({viewingEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setViewingEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block font-sans">事件标题:</span>
                  <span className="text-slate-100 font-bold font-sans text-sm block">{viewingEvent.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">诊断追踪描述:</span>
                  <span className="text-slate-300 font-sans leading-relaxed block text-xs">{viewingEvent.description}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">事件级别</span>
                  <span className="text-rose-400 font-black text-sm block mt-1">{viewingEvent.severity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">事件状态</span>
                  <span className="text-cyan-400 font-bold text-xs block mt-1">{viewingEvent.status}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">发生次数</span>
                  <span className="text-cyan-300 font-black text-sm block mt-1">{viewingEvent.count} 次</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">来源 IP</span>
                  <span className="text-slate-300 font-mono text-xs block mt-1">{viewingEvent.sourceIp}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">发生时间:</span>
                  <span>{viewingEvent.occurTime}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">所属系统:</span>
                  <span className="text-cyan-300 font-bold">{viewingEvent.systemName}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span className="text-slate-400 font-sans">当前负责人 / 处理人:</span>
                  <span className="text-emerald-400 font-bold">{viewingEvent.assignee} / {viewingEvent.handler}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewingEvent(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: 转成工单 Modal */}
      {convertingWorkOrderEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  转换生成运维工单 ({convertingWorkOrderEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setConvertingWorkOrderEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-slate-200 font-bold">{convertingWorkOrderEvent.title}</div>
                <div className="text-slate-400 text-[11px] font-mono">所属系统: {convertingWorkOrderEvent.systemName}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                ℹ️ 确认转换后，该事件将被注入工单系统流程，自动通知相关责任专家介入现场抢修。
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setConvertingWorkOrderEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert(`已成功为事件 ${convertingWorkOrderEvent.id} 创建运维派发工单！`);
                  setConvertingWorkOrderEvent(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors font-sans"
              >
                确认转换派工
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: 关闭事件 Modal */}
      {closingEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  确认手动闭环关闭事件 ({closingEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setClosingEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">闭环处理总结与备注说明:</label>
                <textarea
                  rows={3}
                  value={closeNoteInput}
                  onChange={(e) => setCloseNoteInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs font-sans"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setClosingEvent(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={confirmCloseEvent}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors font-sans"
              >
                确认关闭事件
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
