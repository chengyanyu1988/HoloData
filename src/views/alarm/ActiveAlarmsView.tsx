import React, { useState } from 'react';
import { 
  AlertTriangle, Filter, Search, CheckCircle2, ShieldAlert, 
  Check, Bell, Clock, Zap, Info, X, ChevronLeft, ChevronRight, DownloadCloud
} from 'lucide-react';
import { AlarmItem } from '../../types';

export interface AlarmInfoItem {
  id: string;
  content: string;         // 告警内容 (e.g. 服务器内存溢出告警)
  source: string;          // 告警源 (e.g. web-server-01.tj.node)
  severity: '重大' | '严重' | '一般' | '轻微' | '消息';
  status: '未确认' | '处置中' | '已恢复' | '已关单';
  alarmTime: string;       // 告警时间 (2026)
  recoveryTime: string;    // 恢复时间 (2026 或 未恢复)
  metric: string;          // 监控指标
  triggerValue: string;    // 触发实测值
  threshold: string;       // 判定阈值
}

const INITIAL_ALARM_INFO_LIST: AlarmInfoItem[] = [
  {
    id: 'ALM-2026-101',
    content: '服务器内存溢出告警',
    source: 'web-server-01.tj.node',
    severity: '严重',
    status: '未确认',
    alarmTime: '2026/11/06 08:52:10',
    recoveryTime: '未恢复',
    metric: 'JVM Heap Usage',
    triggerValue: '98.5%',
    threshold: '> 90.0%',
  },
  {
    id: 'ALM-2026-102',
    content: '设备网络中断告警',
    source: 'rfid-reader-gate-04',
    severity: '重大',
    status: '处置中',
    alarmTime: '2026/11/06 08:45:00',
    recoveryTime: '未恢复',
    metric: 'Ping Latency',
    triggerValue: 'Timeout (100% Loss)',
    threshold: '< 50ms',
  },
  {
    id: 'ALM-2026-103',
    content: '天线驻波比阻抗失配告警',
    source: 'rfid-antenna-array-01',
    severity: '一般',
    status: '已恢复',
    alarmTime: '2026/11/06 08:30:15',
    recoveryTime: '2026/11/06 08:42:10',
    metric: 'Antenna VSWR',
    triggerValue: '1.85',
    threshold: '< 1.50',
  },
  {
    id: 'ALM-2026-104',
    content: '数据库主从复制延迟超限',
    source: 'db-cluster-master-02',
    severity: '严重',
    status: '未确认',
    alarmTime: '2026/11/06 08:15:20',
    recoveryTime: '未恢复',
    metric: 'Replication Delay',
    triggerValue: '145s',
    threshold: '< 10s',
  },
  {
    id: 'ALM-2026-105',
    content: 'PoE网口物理链路丢包',
    source: 'edge-controller-master-123',
    severity: '轻微',
    status: '已恢复',
    alarmTime: '2026/11/06 07:50:00',
    recoveryTime: '2026/11/06 08:05:12',
    metric: 'Packet Loss Rate',
    triggerValue: '3.2%',
    threshold: '< 0.5%',
  },
  {
    id: 'ALM-2026-106',
    content: 'Kafka 消息积压量过高',
    source: 'kafka-broker-03.tj.cluster',
    severity: '一般',
    status: '处置中',
    alarmTime: '2026/11/06 07:35:10',
    recoveryTime: '未恢复',
    metric: 'Consumer Lag',
    triggerValue: '450,200 msg',
    threshold: '< 50,000 msg',
  },
  {
    id: 'ALM-2026-107',
    content: '设备芯片温度过高告警',
    source: 'rv-coder-allinone-01',
    severity: '消息',
    status: '已恢复',
    alarmTime: '2026/11/06 07:10:45',
    recoveryTime: '2026/11/06 07:28:00',
    metric: 'SOC Temperature',
    triggerValue: '58.4°C',
    threshold: '< 55.0°C',
  },
  {
    id: 'ALM-2026-108',
    content: 'Redis 缓存命中率异常下降',
    source: 'redis-cluster-node-05',
    severity: '轻微',
    status: '已恢复',
    alarmTime: '2026/11/06 06:40:00',
    recoveryTime: '2026/11/06 07:00:15',
    metric: 'Cache Hit Ratio',
    triggerValue: '72.1%',
    threshold: '> 90.0%',
  },
  {
    id: 'ALM-2026-109',
    content: '服务器 CPU 利用率持续 > 95%',
    source: 'k8s-node-worker-08',
    severity: '严重',
    status: '未确认',
    alarmTime: '2026/11/06 06:15:30',
    recoveryTime: '未恢复',
    metric: 'CPU Load',
    triggerValue: '96.8%',
    threshold: '< 85.0%',
  },
  {
    id: 'ALM-2026-110',
    content: '光纤交换机端口链路闪断',
    source: 'sw-san-cisco-9710',
    severity: '重大',
    status: '处置中',
    alarmTime: '2026/11/06 05:50:00',
    recoveryTime: '未恢复',
    metric: 'Port Link Flap',
    triggerValue: '12 次/min',
    threshold: '0 次',
  },
  {
    id: 'ALM-2026-111',
    content: '存储阵列坏道 ECC 纠错告警',
    source: 'san-storage-pool-A',
    severity: '一般',
    status: '已恢复',
    alarmTime: '2026/11/05 23:20:00',
    recoveryTime: '2026/11/05 23:45:10',
    metric: 'ECC Error Rate',
    triggerValue: '14 Sector/h',
    threshold: '< 2 Sector/h',
  },
  {
    id: 'ALM-2026-112',
    content: 'API 接口响应延迟超 2000ms',
    source: 'gateway-nginx-01',
    severity: '轻微',
    status: '已恢复',
    alarmTime: '2026/11/05 22:10:15',
    recoveryTime: '2026/11/05 22:25:30',
    metric: 'P99 Latency',
    triggerValue: '2,450ms',
    threshold: '< 500ms',
  },
  {
    id: 'ALM-2026-113',
    content: '服务器磁盘空间不足告警 (>90%)',
    source: 'log-analytics-node-03',
    severity: '严重',
    status: '处置中',
    alarmTime: '2026/11/05 21:05:00',
    recoveryTime: '未恢复',
    metric: 'Disk Usage /var/log',
    triggerValue: '92.4%',
    threshold: '< 85.0%',
  },
  {
    id: 'ALM-2026-114',
    content: 'RFID 过车标签重复解析抖动',
    source: 'rfid-reader-gate-08',
    severity: '消息',
    status: '已恢复',
    alarmTime: '2026/11/05 19:40:00',
    recoveryTime: '2026/11/05 19:55:00',
    metric: 'Duplicate Rate',
    triggerValue: '8.5%',
    threshold: '< 2.0%',
  },
  {
    id: 'ALM-2026-115',
    content: '核心路由器双电源冗余失效',
    source: 'router-core-huawei-8800',
    severity: '重大',
    status: '未确认',
    alarmTime: '2026/11/05 18:15:10',
    recoveryTime: '未恢复',
    metric: 'Power Module Status',
    triggerValue: 'PSU-2 Offline',
    threshold: 'Dual Normal',
  },
  {
    id: 'ALM-2026-116',
    content: '数据库慢查询线程数超标',
    source: 'db-cluster-slave-01',
    severity: '一般',
    status: '已恢复',
    alarmTime: '2026/11/05 16:50:20',
    recoveryTime: '2026/11/05 17:10:45',
    metric: 'Slow Query Thread',
    triggerValue: '28 Threads',
    threshold: '< 5 Threads',
  },
  {
    id: 'ALM-2026-117',
    content: '机房防爆电磁干扰抖动',
    source: 'cabinet-sensor-rack-12',
    severity: '轻微',
    status: '已恢复',
    alarmTime: '2026/11/05 15:30:00',
    recoveryTime: '2026/11/05 15:42:00',
    metric: 'EMI Noise Floor',
    triggerValue: '-65 dBm',
    threshold: '< -80 dBm',
  },
  {
    id: 'ALM-2026-118',
    content: '微服务注册中心 Eureka 租约超时',
    source: 'eureka-server-cluster',
    severity: '严重',
    status: '已恢复',
    alarmTime: '2026/11/05 14:10:00',
    recoveryTime: '2026/11/05 14:30:15',
    metric: 'Lease Expiration Rate',
    triggerValue: '5.2%',
    threshold: '< 0.1%',
  },
  {
    id: 'ALM-2026-119',
    content: '视频系统 AI 视觉识读帧率掉帧',
    source: 'ai-vision-camera-02',
    severity: '消息',
    status: '已恢复',
    alarmTime: '2026/11/05 12:45:00',
    recoveryTime: '2026/11/05 13:00:00',
    metric: 'FPS Rate',
    triggerValue: '18 FPS',
    threshold: '>= 30 FPS',
  },
  {
    id: 'ALM-2026-120',
    content: '网络防火墙会话表连接溢出',
    source: 'firewall-paloalto-7050',
    severity: '重大',
    status: '未确认',
    alarmTime: '2026/11/05 11:20:00',
    recoveryTime: '未恢复',
    metric: 'Session Count',
    triggerValue: '1,980,000 Session',
    threshold: '< 1,500,000',
  },
];

interface ActiveAlarmsViewProps {
  alarms?: AlarmItem[];
  onOpenAlarmAction?: (alarm: AlarmItem) => void;
  onBatchAcknowledgeAll?: () => void;
}

export const ActiveAlarmsView: React.FC<ActiveAlarmsViewProps> = ({
  alarms,
  onOpenAlarmAction,
  onBatchAcknowledgeAll,
}) => {
  // Search & Filter state variables matching screenshot image_b39c18e0.png
  const [alarmContentSearch, setAlarmContentSearch] = useState('');
  const [alarmSourceSearch, setAlarmSourceSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '未确认' | '处置中' | '已恢复' | '已关单'>('all');
  const [severityFilter, setSeverityFilter] = useState<'all' | '重大' | '严重' | '一般' | '轻微' | '消息'>('all');
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>('all');

  // Pagination states (Per user prompt: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive detail modal state
  const [selectedAlarmDetail, setSelectedAlarmDetail] = useState<AlarmInfoItem | null>(null);

  // Filter logic
  const filteredAlarms = INITIAL_ALARM_INFO_LIST.filter((item) => {
    const matchesContent = item.content.toLowerCase().includes(alarmContentSearch.toLowerCase());
    const matchesSource = item.source.toLowerCase().includes(alarmSourceSearch.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    return matchesContent && matchesSource && matchesStatus && matchesSeverity;
  });

  const totalPages = Math.max(1, Math.ceil(filteredAlarms.length / pageSize));
  const currentPageItems = filteredAlarms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
    setJumpPageInput(String(validPage));
  };

  const getSeverityBadgeClass = (sev: AlarmInfoItem['severity']) => {
    switch (sev) {
      case '重大':
        return 'text-rose-400 bg-rose-500/15 border-rose-500/30';
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

  return (
    <div className="space-y-6">
      {/* Top Overview KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">告警总记录数</span>
            <div className="text-2xl font-black text-slate-100 mt-1">
              {INITIAL_ALARM_INFO_LIST.length} <span className="text-xs font-normal text-slate-400">条</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Bell className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">未确认 / 处置中告警</span>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {INITIAL_ALARM_INFO_LIST.filter(a => a.status === '未确认' || a.status === '处置中').length} <span className="text-xs font-normal text-slate-400">条</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">重大与严重告警</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {INITIAL_ALARM_INFO_LIST.filter(a => a.severity === '重大' || a.severity === '严重').length} <span className="text-xs font-normal text-slate-400">条</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">自动闭环恢复率</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              60.0%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Section Card: 告警列表 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">告警列表</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              共 {filteredAlarms.length} 条记录 · 每页 10 条
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                if (onBatchAcknowledgeAll) onBatchAcknowledgeAll();
                alert('已成功批量确认当前过滤页面的所有活动告警！');
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              一键批量确认
            </button>
          </div>
        </div>

        {/* Filter Toolbar (Preserved exact inputs matching image_b39c18e0.png) */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Input 1: 请输入告警内容 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入告警内容"
              value={alarmContentSearch}
              onChange={(e) => {
                setAlarmContentSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 font-sans"
            />
          </div>

          {/* Input 2: 请输入告警源 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入告警源"
              value={alarmSourceSearch}
              onChange={(e) => {
                setAlarmSourceSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 font-sans"
            />
          </div>

          {/* Dropdown 1: 全部状态 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部状态</option>
            <option value="未确认">未确认</option>
            <option value="处置中">处置中</option>
            <option value="已恢复">已恢复</option>
            <option value="已关单">已关单</option>
          </select>

          {/* Dropdown 2: 全部告警级别 */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部告警级别</option>
            <option value="重大">重大</option>
            <option value="严重">严重</option>
            <option value="一般">一般</option>
            <option value="轻微">轻微</option>
            <option value="消息">消息</option>
          </select>

          {/* Date Picker Selector: 选择时间 */}
          <select
            value={timeRangeFilter}
            onChange={(e) => {
              setTimeRangeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">选择时间 (全部)</option>
            <option value="today">今天 (2026-11-06)</option>
            <option value="3d">近3天</option>
            <option value="7d">近7天</option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table Preserving exact columns from image_b39c18e0.png: 告警内容, 告警源, 告警级别, 告警状态, 告警时间, 恢复时间 */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">告警内容</th>
                <th className="py-3 px-4">告警源</th>
                <th className="py-3 px-4 text-center">告警级别</th>
                <th className="py-3 px-4 text-center">告警状态</th>
                <th className="py-3 px-4">告警时间</th>
                <th className="py-3 px-4">恢复时间</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentPageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    暂无符合条件的告警记录
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-950/80 transition-colors cursor-pointer group"
                    onClick={() => setSelectedAlarmDetail(item)}
                  >
                    {/* 告警内容 */}
                    <td className="py-3 px-4 font-semibold text-slate-200 font-sans max-w-xs">
                      <div className="truncate" title={item.content}>
                        {item.content}
                      </div>
                    </td>

                    {/* 告警源 */}
                    <td className="py-3 px-4 text-cyan-300 font-mono">
                      {item.source}
                    </td>

                    {/* 告警级别 */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-sans border font-bold inline-block ${getSeverityBadgeClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>

                    {/* 告警状态 */}
                    <td className="py-3 px-4 text-center font-sans">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold inline-block ${
                        item.status === '未确认' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono' :
                        item.status === '处置中' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono' :
                        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* 告警时间 (2026) */}
                    <td className="py-3 px-4 text-slate-300 font-mono">
                      {item.alarmTime}
                    </td>

                    {/* 恢复时间 (2026) */}
                    <td className="py-3 px-4 font-mono">
                      {item.recoveryTime === '未恢复' ? (
                        <span className="text-rose-400 font-bold">{item.recoveryTime}</span>
                      ) : (
                        <span className="text-emerald-400">{item.recoveryTime}</span>
                      )}
                    </td>

                    {/* 操作 */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAlarmDetail(item);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-sans font-bold text-[11px] border border-slate-700 transition-colors"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls Bar (Exact matching screenshot: < 1 2 > , 10条/页, 跳至 [ ] 页) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredAlarms.length)} 条，共 {filteredAlarms.length} 条记录
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

            {/* Page Size Select (Fixed default to 10条/页 per prompt) */}
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

      {/* Alarm Detail Interactive Popover Modal */}
      {selectedAlarmDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  告警明细详情 ({selectedAlarmDetail.id})
                </h3>
              </div>
              <button
                onClick={() => setSelectedAlarmDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block font-sans">告警内容:</span>
                  <span className="text-slate-100 font-bold font-sans text-sm block">{selectedAlarmDetail.content}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">告警源实体:</span>
                  <span className="text-cyan-300 font-bold font-mono block">{selectedAlarmDetail.source}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">告警级别</span>
                  <span className="text-rose-400 font-black text-sm block mt-1">{selectedAlarmDetail.severity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">告警状态</span>
                  <span className="text-amber-400 font-bold text-xs block mt-1">{selectedAlarmDetail.status}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">实测触发值</span>
                  <span className="text-rose-400 font-black text-xs block mt-1">{selectedAlarmDetail.triggerValue}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">判定阈值</span>
                  <span className="text-slate-300 font-mono text-xs block mt-1">{selectedAlarmDetail.threshold}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">告警发生时间:</span>
                  <span>{selectedAlarmDetail.alarmTime}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span className="text-slate-400 font-sans">恢复时间:</span>
                  <span className={selectedAlarmDetail.recoveryTime === '未恢复' ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {selectedAlarmDetail.recoveryTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  alert(`已成功将告警 ${selectedAlarmDetail.id} 转换为运维处理工单！`);
                  setSelectedAlarmDetail(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-sans transition-colors"
              >
                转运维工单
              </button>
              <button
                onClick={() => {
                  alert(`已成功确认已知告警 ${selectedAlarmDetail.id}！`);
                  setSelectedAlarmDetail(null);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors"
              >
                确认已知
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
