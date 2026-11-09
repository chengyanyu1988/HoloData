import React, { useState } from 'react';
import { 
  CheckCircle2, Search, Filter, ShieldCheck, Clock, Eye, 
  Award, RefreshCw, X, ChevronLeft, ChevronRight, FileCheck
} from 'lucide-react';

export interface EventDoneItem {
  id: string;              // e.g. EVT-2026-102901
  title: string;           // 标题
  type: string;            // 事件类型
  occurTime: string;       // 发生时间
  finishTime: string;      // 闭环时间
  severity: '重大' | '严重' | '一般' | '轻微' | '消息'; // 级别
  status: '已闭环' | '已恢复' | '已归档' | '自动消警';   // 状态
  systemName: string;      // 所属系统
  sourceIp: string;        // 来源IP
  assignee: string;        // 负责人
  handler: string;         // 处理人
  count: number;           // 发生次数
  resolutionNote: string;  // 解决结论
  mttr: string;            // 修复时长
}

const INITIAL_DONE_EVENTS: EventDoneItem[] = [
  {
    id: 'EVT-2026-102901',
    title: '天津港 01 号集装箱码头 RFID 读写器功率异常衰减',
    type: '硬件故障',
    occurTime: '2026/11/05 14:20:10',
    finishTime: '2026/11/05 14:45:30',
    severity: '严重',
    status: '已闭环',
    systemName: '电子标识感知集中监控系统',
    sourceIp: '10.120.45.18',
    assignee: '张建国',
    handler: '李明远',
    count: 2,
    resolutionNote: '更换老化同轴射频缆线及防爆接头后射频功率恢复至标准的 30dBm。',
    mttr: '25分钟',
  },
  {
    id: 'EVT-2026-102902',
    title: '核心数据节点 MySQL 主从复制 Heartbeat 续约延迟',
    type: '软件异常',
    occurTime: '2026/11/05 11:15:00',
    finishTime: '2026/11/05 11:22:15',
    severity: '重大',
    status: '已恢复',
    systemName: '全息资产高可用数据库集群',
    sourceIp: '10.120.12.04',
    assignee: '赵振华',
    handler: '赵振华',
    count: 1,
    resolutionNote: '通过慢查询 Kill 与 Binlog 线程线程池调优，备库落后复制延迟降为 0ms。',
    mttr: '7分钟',
  },
  {
    id: 'EVT-2026-102903',
    title: '高新区双基识读车道 03 号 AI 视觉算法卡顿掉帧',
    type: '接口超时',
    occurTime: '2026/11/05 09:30:22',
    finishTime: '2026/11/05 09:48:10',
    severity: '一般',
    status: '已归档',
    systemName: '双基识读融合推断分析系统',
    sourceIp: '10.120.34.60',
    assignee: '王海峰',
    handler: '王海峰',
    count: 4,
    resolutionNote: '更新 TensorRT 硬件加速显存调度配置，车牌识别帧率稳定于 60 FPS。',
    mttr: '18分钟',
  },
  {
    id: 'EVT-2026-102904',
    title: '卡口边缘控制器千兆 PoE 网口物理层错误帧递增',
    type: '网络抖动',
    occurTime: '2026/11/04 22:10:00',
    finishTime: '2026/11/04 22:35:00',
    severity: '轻微',
    status: '自动消警',
    systemName: '智慧交通RFID数据采集网关系统',
    sourceIp: '10.120.99.15',
    assignee: '李明远',
    handler: '自动自愈引擎',
    count: 5,
    resolutionNote: 'PoE 链路自协商协议自动重置物理双工模式，链路误码率自愈归零。',
    mttr: '25分钟',
  },
  {
    id: 'EVT-2026-102905',
    title: '微服务注册中心 Eureka 租约续约微短断告警',
    type: '软件异常',
    occurTime: '2026/11/04 18:40:15',
    finishTime: '2026/11/04 18:46:00',
    severity: '消息',
    status: '自动消警',
    systemName: 'K8s 容器云微服务平台',
    sourceIp: '10.120.66.08',
    assignee: '程总工',
    handler: '自动消警规则',
    count: 1,
    resolutionNote: '在 GC 垃圾回收暂停结束后心跳自动恢复，符合 30s 自动降噪静音规则。',
    mttr: '6分钟',
  },
  {
    id: 'EVT-2026-102906',
    title: '机房 05 号机柜环境温度探测器高频波动警报',
    type: '传感器失效',
    occurTime: '2026/11/04 15:10:00',
    finishTime: '2026/11/04 15:55:00',
    severity: '一般',
    status: '已闭环',
    systemName: '动环物联网硬件检测系统',
    sourceIp: '10.120.78.12',
    assignee: '孙立伟',
    handler: '顾亚军',
    count: 3,
    resolutionNote: '更换损坏的 Modbus 485 温湿度传感器芯片，复测数据与精密仪表一致。',
    mttr: '45分钟',
  },
  {
    id: 'EVT-2026-102907',
    title: 'Redis 缓存集群 04 节点大 Key 倾斜导致响应变慢',
    type: '软件异常',
    occurTime: '2026/11/04 11:25:30',
    finishTime: '2026/11/04 11:40:12',
    severity: '严重',
    status: '已归档',
    systemName: '高速缓存调度与分布式锁中心',
    sourceIp: '10.120.88.04',
    assignee: '顾亚军',
    handler: '顾亚军',
    count: 2,
    resolutionNote: '对超大 Hash 数据结构进行分片拆解（BigKey Split），集群耗时下探至 0.8ms。',
    mttr: '15分钟',
  },
  {
    id: 'EVT-2026-102908',
    title: '核心网关 Palo Alto 防火墙并发会话突破阈值警告',
    type: '网络抖动',
    occurTime: '2026/11/03 20:05:00',
    finishTime: '2026/11/03 20:20:00',
    severity: '重大',
    status: '已闭环',
    systemName: '边界网络安全防护防火墙',
    sourceIp: '10.120.01.01',
    assignee: '程总工',
    handler: '程总工',
    count: 8,
    resolutionNote: '清除残余僵尸 TCP FIN_WAIT2 连接，会话表释放 45 万连接，使用率下降至 52%。',
    mttr: '15分钟',
  },
  {
    id: 'EVT-2026-102909',
    title: '光纤交换机 02 端口 SAN 存储网络 FC 传输抖动',
    type: '硬件故障',
    occurTime: '2026/11/03 16:30:00',
    finishTime: '2026/11/03 17:10:00',
    severity: '一般',
    status: '已归档',
    systemName: 'SAN 光纤存储网络架构',
    sourceIp: '10.120.05.02',
    assignee: '赵振华',
    handler: '李明远',
    count: 1,
    resolutionNote: '重新擦拭插拔 SFP+ 光纤接口端面，光功率恢复至正常 -3.5 dBm。',
    mttr: '40分钟',
  },
  {
    id: 'EVT-2026-102910',
    title: '流式计算 Kafka Broker 节点物理磁盘 Space 快满',
    type: '软件异常',
    occurTime: '2026/11/03 10:12:00',
    finishTime: '2026/11/03 10:42:00',
    severity: '严重',
    status: '已闭环',
    systemName: '实时流式计算处理平台',
    sourceIp: '10.120.21.03',
    assignee: '张帆',
    handler: '张帆',
    count: 3,
    resolutionNote: '调整 Topic 日志保留策略为 72 小时并触发冷数据自动归档至 OSS。',
    mttr: '30分钟',
  },
  {
    id: 'EVT-2026-102911',
    title: 'RFID 过车标签重复解析去重引擎微延迟',
    type: '接口超时',
    occurTime: '2026/11/02 23:15:00',
    finishTime: '2026/11/02 23:25:00',
    severity: '消息',
    status: '自动消警',
    systemName: '电子标识感知集中监控系统',
    sourceIp: '10.120.45.99',
    assignee: '张建国',
    handler: '自动消警规则',
    count: 2,
    resolutionNote: '去重缓存刷新完毕后耗时恢复至 0.2ms，系统恢复绿灯正常。',
    mttr: '10分钟',
  },
  {
    id: 'EVT-2026-102912',
    title: '核心数据中心 UPS 电源模块冗余微抖动告警',
    type: '硬件故障',
    occurTime: '2026/11/02 14:05:00',
    finishTime: '2026/11/02 14:35:00',
    severity: '轻微',
    status: '已恢复',
    systemName: '机房动力环境监控系统',
    sourceIp: '10.120.80.01',
    assignee: '孙立伟',
    handler: '孙立伟',
    count: 1,
    resolutionNote: '市电滤波稳压模块自动完成无缝整流切换，市电供电恢复极高品质。',
    mttr: '30分钟',
  },
];

export const EventDoneView: React.FC = () => {
  const [eventsList] = useState<EventDoneItem[]>(INITIAL_DONE_EVENTS);

  // Search & Filter state variables matching screenshot image_18000704.png
  const [titleSearch, setTitleSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states (Per user prompt: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive Modal State
  const [viewingDoneEvent, setViewingDoneEvent] = useState<EventDoneItem | null>(null);

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

  const getSeverityBadgeClass = (sev: EventDoneItem['severity']) => {
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

  const getStatusBadgeClass = (st: EventDoneItem['status']) => {
    switch (st) {
      case '已闭环':
        return 'text-emerald-400 font-bold';
      case '已恢复':
        return 'text-cyan-400 font-semibold';
      case '已归档':
        return 'text-slate-300 font-semibold';
      case '自动消警':
        return 'text-purple-400 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Redesigned DataOps Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">已结案闭环事件</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {eventsList.length} <span className="text-xs font-normal text-slate-400">件</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">自动消警规则降噪率</span>
            <div className="text-2xl font-black text-purple-300 mt-1">
              33.3%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <RefreshCw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">平均修复时长 (MTTR)</span>
            <div className="text-2xl font-black text-cyan-300 mt-1">
              21.8 <span className="text-xs font-normal text-slate-400">分钟</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">事件闭环达成率</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              100.0%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Container Card: 事件中心 · 已办事件 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4.5 h-4.5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">已办事件历史列表</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              事件中心 · 每页 10 条数据
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            归档完整度: 100% 已验证
          </span>
        </div>

        {/* Filter Toolbar matching exact inputs from image_18000704.png:
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
            <option value="已闭环">已闭环</option>
            <option value="已恢复">已恢复</option>
            <option value="已归档">已归档</option>
            <option value="自动消警">自动消警</option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table matching exact columns from image_18000704.png:
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
                    暂无符合条件的已办事件记录
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                      onClick={() => setViewingDoneEvent(item)}
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

                      {/* 13. 操作: 查看详情 (Matching image_18000704.png) */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingDoneEvent(item);
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

        {/* Pagination Bar (Per prompt discipline: 每页显示10条数据) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredEvents.length)} 条，共 {filteredEvents.length} 条已办记录
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

      {/* Modal: 已办事件全息详情 Modal (查看详情) */}
      {viewingDoneEvent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  已办事件归档归因详情 ({viewingDoneEvent.id})
                </h3>
              </div>
              <button
                onClick={() => setViewingDoneEvent(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block font-sans">事件标题:</span>
                  <span className="text-slate-100 font-bold font-sans text-sm block">{viewingDoneEvent.title}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">处置结论与修复记录:</span>
                  <span className="text-emerald-300 font-sans leading-relaxed block text-xs font-medium">{viewingDoneEvent.resolutionNote}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">事件级别</span>
                  <span className="text-rose-400 font-black text-sm block mt-1">{viewingDoneEvent.severity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">归档状态</span>
                  <span className="text-emerald-400 font-bold text-xs block mt-1">{viewingDoneEvent.status}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">修复时长</span>
                  <span className="text-cyan-300 font-black text-sm block mt-1">{viewingDoneEvent.mttr}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">来源 IP</span>
                  <span className="text-slate-300 font-mono text-xs block mt-1">{viewingDoneEvent.sourceIp}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">发生时间:</span>
                  <span>{viewingDoneEvent.occurTime}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">完结闭环时间:</span>
                  <span className="text-emerald-400 font-bold">{viewingDoneEvent.finishTime}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">所属系统:</span>
                  <span className="text-cyan-300 font-bold">{viewingDoneEvent.systemName}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span className="text-slate-400 font-sans">负责人 / 实操处理人:</span>
                  <span className="text-slate-200 font-bold">{viewingDoneEvent.assignee} / {viewingDoneEvent.handler}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewingDoneEvent(null)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-sans transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
