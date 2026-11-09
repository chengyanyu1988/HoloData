import React, { useState } from 'react';
import { 
  Sliders, Plus, Check, Bell, Shield, Filter, Search, 
  Edit3, Eye, Trash2, X, ChevronLeft, ChevronRight, CheckCircle2, Zap, AlertTriangle
} from 'lucide-react';
import { AlarmRule } from '../../types';

export interface AlarmFilterRuleItem {
  id: string;
  ruleCode: string;
  contentPattern: string;  // 告警内容匹配 (e.g. 服务器内存溢出告警过滤)
  sourcePattern: string;   // 告警源 (e.g. web-server-*.tj.node)
  severity: '重大' | '严重' | '一般' | '轻微' | '消息';
  status: '已启用' | '已停用';
  addTime: string;         // 添加时间 (2026)
  filterAction: string;    // 过滤策略 (静音 / 抑制 / 延迟合并)
  suppressedCount: number; // 累计静音告警数
}

const INITIAL_FILTER_RULES_LIST: AlarmFilterRuleItem[] = [
  {
    id: 'RULE-2026-001',
    ruleCode: 'FLT-001',
    contentPattern: '服务器内存溢出告警',
    sourcePattern: 'web-server-*.tj.node',
    severity: '严重',
    status: '已启用',
    addTime: '2026/10/15 09:30:00',
    filterAction: '分钟级阈值抑制',
    suppressedCount: 1240,
  },
  {
    id: 'RULE-2026-002',
    ruleCode: 'FLT-002',
    contentPattern: '设备告警',
    sourcePattern: 'rfid-reader-gate-*',
    severity: '重大',
    status: '已启用',
    addTime: '2026/10/18 14:20:00',
    filterAction: '30秒闪断静音',
    suppressedCount: 3850,
  },
  {
    id: 'RULE-2026-003',
    ruleCode: 'FLT-003',
    contentPattern: '服务器内存溢出告警',
    sourcePattern: 'rfid-antenna-array-*',
    severity: '消息',
    status: '已启用',
    addTime: '2026/10/22 11:15:00',
    filterAction: '平滑滤波抑制',
    suppressedCount: 680,
  },
  {
    id: 'RULE-2026-004',
    ruleCode: 'FLT-004',
    contentPattern: '设备告警',
    sourcePattern: 'db-cluster-master-*',
    severity: '严重',
    status: '已启用',
    addTime: '2026/10/25 16:40:00',
    filterAction: '5秒内自动静音',
    suppressedCount: 920,
  },
  {
    id: 'RULE-2026-005',
    ruleCode: 'FLT-005',
    contentPattern: 'PoE网口物理链路丢包',
    sourcePattern: 'edge-controller-master-*',
    severity: '轻微',
    status: '已启用',
    addTime: '2026/10/28 10:05:00',
    filterAction: '告警合并汇总',
    suppressedCount: 2150,
  },
  {
    id: 'RULE-2026-006',
    ruleCode: 'FLT-006',
    contentPattern: 'Kafka 消息积压量过高',
    sourcePattern: 'kafka-broker-*.tj.cluster',
    severity: '一般',
    status: '已启用',
    addTime: '2026/10/30 08:50:00',
    filterAction: '重平衡窗口抑制',
    suppressedCount: 1480,
  },
  {
    id: 'RULE-2026-007',
    ruleCode: 'FLT-007',
    contentPattern: '设备芯片温度过高告警',
    sourcePattern: 'rv-coder-allinone-*',
    severity: '消息',
    status: '已启用',
    addTime: '2026/11/01 15:12:00',
    filterAction: '低于60°C静音',
    suppressedCount: 410,
  },
  {
    id: 'RULE-2026-008',
    ruleCode: 'FLT-008',
    contentPattern: 'Redis 缓存命中率异常下降',
    sourcePattern: 'redis-cluster-node-*',
    severity: '轻微',
    status: '已停用',
    addTime: '2026/11/02 17:30:00',
    filterAction: '启动窗口过滤',
    suppressedCount: 0,
  },
  {
    id: 'RULE-2026-009',
    ruleCode: 'FLT-009',
    contentPattern: '服务器 CPU 利用率持续 > 95%',
    sourcePattern: 'k8s-node-worker-*',
    severity: '严重',
    status: '已启用',
    addTime: '2026/11/03 12:00:00',
    filterAction: 'Crontab 窗口静音',
    suppressedCount: 890,
  },
  {
    id: 'RULE-2026-010',
    ruleCode: 'FLT-010',
    contentPattern: '光纤交换机端口链路闪断',
    sourcePattern: 'sw-san-cisco-*',
    severity: '重大',
    status: '已启用',
    addTime: '2026/11/04 09:10:00',
    filterAction: '双路备份抑制',
    suppressedCount: 320,
  },
  {
    id: 'RULE-2026-011',
    ruleCode: 'FLT-011',
    contentPattern: '存储阵列坏道 ECC 纠错告警',
    sourcePattern: 'san-storage-pool-*',
    severity: '一般',
    status: '已启用',
    addTime: '2026/11/04 14:00:00',
    filterAction: '维护期静音',
    suppressedCount: 510,
  },
  {
    id: 'RULE-2026-012',
    ruleCode: 'FLT-012',
    contentPattern: 'API 接口响应延迟超 2000ms',
    sourcePattern: 'gateway-nginx-*',
    severity: '轻微',
    status: '已启用',
    addTime: '2026/11/04 18:25:00',
    filterAction: '限流队列抑制',
    suppressedCount: 4200,
  },
  {
    id: 'RULE-2026-013',
    ruleCode: 'FLT-013',
    contentPattern: '服务器磁盘空间不足告警 (>90%)',
    sourcePattern: 'log-analytics-node-*',
    severity: '严重',
    status: '已启用',
    addTime: '2026/11/05 08:30:00',
    filterAction: '自动轮转抑制',
    suppressedCount: 740,
  },
  {
    id: 'RULE-2026-014',
    ruleCode: 'FLT-014',
    contentPattern: 'RFID 标签高频重复读取去重',
    sourcePattern: 'rfid-reader-gate-08',
    severity: '消息',
    status: '已启用',
    addTime: '2026/11/05 10:15:00',
    filterAction: '毫秒级去重',
    suppressedCount: 15600,
  },
  {
    id: 'RULE-2026-015',
    ruleCode: 'FLT-015',
    contentPattern: '核心路由器 UPS 电压微幅抖动',
    sourcePattern: 'router-core-huawei-*',
    severity: '重大',
    status: '已停用',
    addTime: '2026/11/05 11:50:00',
    filterAction: '稳压静音',
    suppressedCount: 0,
  },
  {
    id: 'RULE-2026-016',
    ruleCode: 'FLT-016',
    contentPattern: 'MySQL 慢查询批处理时段告警',
    sourcePattern: 'db-cluster-slave-*',
    severity: '一般',
    status: '已启用',
    addTime: '2026/11/05 13:40:00',
    filterAction: '夜间批处理静音',
    suppressedCount: 1120,
  },
  {
    id: 'RULE-2026-017',
    ruleCode: 'FLT-017',
    contentPattern: '机房防爆电磁波瞬态噪声过滤',
    sourcePattern: 'cabinet-sensor-rack-*',
    severity: '轻微',
    status: '已启用',
    addTime: '2026/11/05 15:20:00',
    filterAction: '带通滤波降噪',
    suppressedCount: 2340,
  },
  {
    id: 'RULE-2026-018',
    ruleCode: 'FLT-018',
    contentPattern: 'Eureka 心跳续约微延迟规则',
    sourcePattern: 'eureka-server-cluster',
    severity: '严重',
    status: '已启用',
    addTime: '2026/11/05 16:05:00',
    filterAction: '续约窗口抑制',
    suppressedCount: 810,
  },
  {
    id: 'RULE-2026-019',
    ruleCode: 'FLT-019',
    contentPattern: 'AI 视觉镜头掉帧瞬时恢复规则',
    sourcePattern: 'ai-vision-camera-*',
    severity: '消息',
    status: '已启用',
    addTime: '2026/11/05 17:30:00',
    filterAction: '补帧恢复静音',
    suppressedCount: 3100,
  },
  {
    id: 'RULE-2026-020',
    ruleCode: 'FLT-020',
    contentPattern: '防火墙长连接会话超时释放过滤',
    sourcePattern: 'firewall-paloalto-*',
    severity: '重大',
    status: '已启用',
    addTime: '2026/11/05 19:10:00',
    filterAction: '超时会话抑制',
    suppressedCount: 650,
  },
];

interface AlarmPolicyViewProps {
  rules?: AlarmRule[];
  onToggleRule?: (ruleId: string) => void;
}

export const AlarmPolicyView: React.FC<AlarmPolicyViewProps> = ({
  rules: externalRules,
  onToggleRule,
}) => {
  // Master Rules List State
  const [rulesList, setRulesList] = useState<AlarmFilterRuleItem[]>(INITIAL_FILTER_RULES_LIST);

  // Search & Filter state variables matching screenshot image_7f8bd387.png
  const [alarmContentSearch, setAlarmContentSearch] = useState('');
  const [alarmSourceSearch, setAlarmSourceSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | '重大' | '严重' | '一般' | '轻微' | '消息'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | '已启用' | '已停用'>('all');

  // Pagination states (Per user prompt: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Modals state: Add/Edit/View/Delete Rule
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingRuleDetail, setViewingRuleDetail] = useState<AlarmFilterRuleItem | null>(null);
  const [editingRuleDetail, setEditingRuleDetail] = useState<AlarmFilterRuleItem | null>(null);
  const [deletingRuleDetail, setDeletingRuleDetail] = useState<AlarmFilterRuleItem | null>(null);

  // Form State for Adding new rule
  const [newRuleContent, setNewRuleContent] = useState('');
  const [newRuleSource, setNewRuleSource] = useState('');
  const [newRuleSeverity, setNewRuleSeverity] = useState<AlarmFilterRuleItem['severity']>('严重');
  const [newRuleAction, setNewRuleAction] = useState('分钟级阈值抑制');

  // Filter Logic
  const filteredRules = rulesList.filter((item) => {
    const matchesContent = item.contentPattern.toLowerCase().includes(alarmContentSearch.toLowerCase());
    const matchesSource = item.sourcePattern.toLowerCase().includes(alarmSourceSearch.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesContent && matchesSource && matchesSeverity && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / pageSize));
  const currentPageItems = filteredRules.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
    setJumpPageInput(String(validPage));
  };

  const confirmDeleteRule = () => {
    if (deletingRuleDetail) {
      setRulesList((prev) => prev.filter((r) => r.id !== deletingRuleDetail.id));
      setDeletingRuleDetail(null);
    }
  };

  const handleCreateRule = () => {
    if (!newRuleContent || !newRuleSource) {
      alert('请填写完整的告警内容匹配与告警源表达式！');
      return;
    }

    const newId = `RULE-2026-${String(rulesList.length + 1).padStart(3, '0')}`;
    const newRule: AlarmFilterRuleItem = {
      id: newId,
      ruleCode: `FLT-${String(rulesList.length + 1).padStart(3, '0')}`,
      contentPattern: newRuleContent,
      sourcePattern: newRuleSource,
      severity: newRuleSeverity,
      status: '已启用',
      addTime: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/'),
      filterAction: newRuleAction,
      suppressedCount: 0,
    };

    setRulesList((prev) => [newRule, ...prev]);
    setIsAddModalOpen(false);
    setNewRuleContent('');
    setNewRuleSource('');
    alert(`告警过滤规则 ${newId} 已成功创建并启动过滤引擎！`);
  };

  const getSeverityBadgeClass = (sev: AlarmFilterRuleItem['severity']) => {
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

  return (
    <div className="space-y-6">
      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">生效过滤规则数</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {rulesList.filter((r) => r.status === '已启用').length} <span className="text-xs font-normal text-slate-400">条</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Filter className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">今日抑制无效告警</span>
            <div className="text-2xl font-black text-cyan-300 mt-1">
              40,780 <span className="text-xs font-normal text-slate-400">次</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">告警风暴降噪率</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              84.5%
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Sliders className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">平均去重耗时</span>
            <div className="text-2xl font-black text-purple-300 mt-1">
              0.42 <span className="text-xs font-normal text-slate-400">ms</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Zap className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Section Card: 告警列表 (告警过滤规则) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Header with top right action button "+ 添加" matching image_7f8bd387.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Filter className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">告警列表</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              告警过滤规则配置 · 每页 10 条
            </span>
          </div>

          {/* Top Right Action Button: 添加 (+ 添加过滤规则) */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>添加</span>
          </button>
        </div>

        {/* Filter Toolbar matching screenshot image_7f8bd387.png: 请输入告警内容, 请输入告警源, 请选择告警级别, 全部状态, 搜索 */}
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

          {/* Dropdown 1: 请选择告警级别 */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">请选择告警级别 (全部)</option>
            <option value="重大">重大</option>
            <option value="严重">严重</option>
            <option value="一般">一般</option>
            <option value="轻微">轻微</option>
            <option value="消息">消息</option>
          </select>

          {/* Dropdown 2: 全部状态 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as any);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部状态</option>
            <option value="已启用">已启用</option>
            <option value="已停用">已停用</option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table matching exact columns from image_7f8bd387.png: 告警内容, 告警源, 告警级别, 添加时间, 操作 (修改, 查看, 删除) */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-4">告警内容</th>
                <th className="py-3 px-4">告警源</th>
                <th className="py-3 px-4 text-center">告警级别</th>
                <th className="py-3 px-4">添加时间</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentPageItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-sans">
                    暂无符合条件的告警过滤规则
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                    onClick={() => setViewingRuleDetail(item)}
                  >
                    {/* 告警内容 */}
                    <td className="py-3 px-4 font-semibold text-slate-200 font-sans max-w-xs">
                      <div className="truncate" title={item.contentPattern}>
                        {item.contentPattern}
                      </div>
                    </td>

                    {/* 告警源 */}
                    <td className="py-3 px-4 text-cyan-300 font-mono">
                      {item.sourcePattern}
                    </td>

                    {/* 告警级别 */}
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-sans border font-bold inline-block ${getSeverityBadgeClass(item.severity)}`}>
                        {item.severity}
                      </span>
                    </td>

                    {/* 添加时间 (2026) */}
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {item.addTime}
                    </td>

                    {/* 操作: 修改, 查看, 删除 (Exact matching image_7f8bd387.png) */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2 font-sans">
                        {/* 修改 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingRuleDetail(item);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-bold border border-slate-700 transition-colors"
                        >
                          修改
                        </button>

                        {/* 查看 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingRuleDetail(item);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-bold border border-slate-700 transition-colors"
                        >
                          查看
                        </button>

                        {/* 删除 */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeletingRuleDetail(item);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 text-[11px] font-bold border border-slate-700 transition-colors"
                        >
                          删除
                        </button>
                      </div>
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
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredRules.length)} 条，共 {filteredRules.length} 条规则
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

      {/* Modal 1: Add New Rule Modal (+ 添加) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  添加告警过滤规则
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">告警内容匹配 (规则主题):</label>
                <input
                  type="text"
                  placeholder="例如: 服务器内存溢出告警过滤"
                  value={newRuleContent}
                  onChange={(e) => setNewRuleContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">告警源正则/通配表达式:</label>
                <input
                  type="text"
                  placeholder="例如: web-server-*.tj.node 或 rfid-reader-gate-*"
                  value={newRuleSource}
                  onChange={(e) => setNewRuleSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">目标告警级别:</label>
                  <select
                    value={newRuleSeverity}
                    onChange={(e) => setNewRuleSeverity(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="重大">重大</option>
                    <option value="严重">严重</option>
                    <option value="一般">一般</option>
                    <option value="轻微">轻微</option>
                    <option value="消息">消息</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">过滤处理策略:</label>
                  <select
                    value={newRuleAction}
                    onChange={(e) => setNewRuleAction(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="分钟级阈值抑制">分钟级阈值抑制</option>
                    <option value="30秒闪断静音">30秒闪断静音</option>
                    <option value="平滑滤波抑制">平滑滤波抑制</option>
                    <option value="告警合并汇总">告警合并汇总</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateRule}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
              >
                保存规则
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: View Rule Details (查看) */}
      {viewingRuleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  查看告警过滤规则详情 ({viewingRuleDetail.id})
                </h3>
              </div>
              <button
                onClick={() => setViewingRuleDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block font-sans">告警内容匹配:</span>
                  <span className="text-slate-100 font-bold font-sans text-sm block">{viewingRuleDetail.contentPattern}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">告警源通配符表达式:</span>
                  <span className="text-cyan-300 font-bold block">{viewingRuleDetail.sourcePattern}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">告警级别</span>
                  <span className="text-rose-400 font-black text-sm block mt-1">{viewingRuleDetail.severity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">规则状态</span>
                  <span className="text-emerald-400 font-bold text-xs block mt-1">{viewingRuleDetail.status}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">已降噪过滤告警</span>
                  <span className="text-cyan-300 font-black text-sm block mt-1">{viewingRuleDetail.suppressedCount} 次</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">添加时间:</span>
                  <span>{viewingRuleDetail.addTime}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span className="text-slate-400 font-sans">过滤动作策略:</span>
                  <span className="text-amber-300 font-bold">{viewingRuleDetail.filterAction}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewingRuleDetail(null)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-sans transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Edit Rule (修改) */}
      {editingRuleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  修改告警过滤规则 ({editingRuleDetail.id})
                </h3>
              </div>
              <button
                onClick={() => setEditingRuleDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">告警内容匹配:</label>
                <input
                  type="text"
                  value={editingRuleDetail.contentPattern}
                  onChange={(e) => setEditingRuleDetail({ ...editingRuleDetail, contentPattern: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-bold block">告警源通配表达式:</label>
                <input
                  type="text"
                  value={editingRuleDetail.sourcePattern}
                  onChange={(e) => setEditingRuleDetail({ ...editingRuleDetail, sourcePattern: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">规则状态:</label>
                  <select
                    value={editingRuleDetail.status}
                    onChange={(e) => setEditingRuleDetail({ ...editingRuleDetail, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="已启用">已启用</option>
                    <option value="已停用">已停用</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-bold block">告警级别:</label>
                  <select
                    value={editingRuleDetail.severity}
                    onChange={(e) => setEditingRuleDetail({ ...editingRuleDetail, severity: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="重大">重大</option>
                    <option value="严重">严重</option>
                    <option value="一般">一般</option>
                    <option value="轻微">轻微</option>
                    <option value="消息">消息</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingRuleDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setRulesList((prev) => prev.map((r) => (r.id === editingRuleDetail.id ? editingRuleDetail : r)));
                  setEditingRuleDetail(null);
                  alert(`已保存对规则 ${editingRuleDetail.id} 的修改！`);
                }}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors"
              >
                更新保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: Delete Rule Confirmation Modal (删除确认弹窗) */}
      {deletingRuleDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  确认删除告警过滤规则
                </h3>
              </div>
              <button
                onClick={() => setDeletingRuleDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <p className="text-slate-300">
                您确定要彻底删除以下告警过滤规则吗？删除后相关过滤降噪策略将立即失效：
              </p>
              
              <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/20 font-mono space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">规则编号:</span>
                  <span className="text-cyan-400 font-bold">{deletingRuleDetail.id} ({deletingRuleDetail.ruleCode})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">告警内容:</span>
                  <span className="text-slate-200 font-bold font-sans truncate max-w-[200px]">{deletingRuleDetail.contentPattern}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">告警源通配符:</span>
                  <span className="text-slate-300 font-mono">{deletingRuleDetail.sourcePattern}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">已抑制告警数:</span>
                  <span className="text-rose-400 font-bold">{deletingRuleDetail.suppressedCount} 次</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                ⚠️ 注意：删除此过滤规则后，符合该条件的离线或闪断告警将直接触发实时告警通知，可能导致短时间内告警数量大幅上升。
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeletingRuleDetail(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteRule}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors font-sans flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
