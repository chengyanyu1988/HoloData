import React, { useState, useMemo } from 'react';
import { ShieldAlert, Search, Download, FileText, ChevronLeft, ChevronRight, Eye, RefreshCw, FolderOpen, Folder, Calendar } from 'lucide-react';

export interface LogEntryItem {
  id: string;
  number: number;
  moduleName: string;
  operator: string;
  timestamp: string;
  systemCategory: string;
  actionDetail: string;
}

const INITIAL_LOG_ITEMS: LogEntryItem[] = [
  {
    id: 'LOG-001',
    number: 1,
    moduleName: '控制平面组件',
    operator: '程总工',
    timestamp: '2026-11-06 14:20:15',
    systemCategory: '容器集群系统',
    actionDetail: 'Kubernetes v1.30 控制平面 etcd 数据库全量快照备份',
  },
  {
    id: 'LOG-002',
    number: 2,
    moduleName: '算力调度引擎',
    operator: '李健',
    timestamp: '2026-11-06 13:10:42',
    systemCategory: 'AI算力调度系统',
    actionDetail: 'H800 GPU 智算集群算力配额限额策略调整',
  },
  {
    id: 'LOG-003',
    number: 3,
    moduleName: '存储阵列网关',
    operator: '张伟',
    timestamp: '2026-11-06 11:05:30',
    systemCategory: '存储与数据湖系统',
    actionDetail: 'NVMe-oF 存储卷冷热分层策略与 SMART 状态巡检',
  },
  {
    id: 'LOG-004',
    number: 4,
    moduleName: '等保合规审计',
    operator: '王芳',
    timestamp: '2026-11-05 16:50:22',
    systemCategory: '网络与安全防护系统',
    actionDetail: '防火墙访问控制列表 (ACL) 合规检测与安全扫描',
  },
  {
    id: 'LOG-005',
    number: 5,
    moduleName: 'CMDB 配置中心',
    operator: '陈明',
    timestamp: '2026-11-05 10:15:00',
    systemCategory: 'CMDB配置系统',
    actionDetail: '400G 无损以太网 Spine-Leaf 资产拓扑自动发现',
  },
  {
    id: 'LOG-006',
    number: 6,
    moduleName: '控制平面组件',
    operator: '赵敏',
    timestamp: '2026-11-04 15:40:11',
    systemCategory: '容器集群系统',
    actionDetail: 'Cilium eBPF CNI 网络策略下发与路由表同步',
  },
  {
    id: 'LOG-007',
    number: 7,
    moduleName: '算力调度引擎',
    operator: '孙杰',
    timestamp: '2026-11-04 09:25:00',
    systemCategory: 'AI算力调度系统',
    actionDetail: '工业 RFID 读写器天线驻波比校准指令下发',
  },
  {
    id: 'LOG-008',
    number: 8,
    moduleName: '存储阵列网关',
    operator: '周涛',
    timestamp: '2026-11-03 17:00:55',
    systemCategory: '存储与数据湖系统',
    actionDetail: 'ClickHouse 数据湖集群冷热数据归档任务触发',
  },
  {
    id: 'LOG-009',
    number: 9,
    moduleName: '等保合规审计',
    operator: '吴强',
    timestamp: '2026-11-03 11:30:20',
    systemCategory: '网络与安全防护系统',
    actionDetail: 'MFA 多因子认证策略配置更新与凭据吊销',
  },
  {
    id: 'LOG-010',
    number: 10,
    moduleName: 'CMDB 配置中心',
    operator: '郑秀',
    timestamp: '2026-11-02 14:10:00',
    systemCategory: 'CMDB配置系统',
    actionDetail: 'PostgreSQL 16 主备复制集群故障转移演练',
  },
  {
    id: 'LOG-011',
    number: 11,
    moduleName: '控制平面组件',
    operator: '刘磊',
    timestamp: '2026-11-01 10:00:00',
    systemCategory: '容器集群系统',
    actionDetail: '集群节点证书到期自动轮换与安全校验',
  },
];

export const LogManagementView: React.FC = () => {
  const [logsList, setLogsList] = useState<LogEntryItem[]>(INITIAL_LOG_ITEMS);
  const [selectedSystemCategory, setSelectedSystemCategory] = useState<string>('ALL');
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Search & Filters matching screenshot: 模块名称, 操作人员, 时间范围
  const [moduleSearch, setModuleSearch] = useState('');
  const [operatorFilter, setOperatorFilter] = useState('全部操作人员');
  const [dateRange, setDateRange] = useState('2026-11-01 至 2026-11-06');

  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 10;

  // Detail Modal
  const [selectedLog, setSelectedLog] = useState<LogEntryItem | null>(null);

  const systemCategories = useMemo(() => {
    return Array.from(new Set(logsList.map((l) => l.systemCategory)));
  }, [logsList]);

  const operators = useMemo(() => {
    return Array.from(new Set(logsList.map((l) => l.operator)));
  }, [logsList]);

  // Tree category counts for 100% precision
  const treeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: logsList.length };
    systemCategories.forEach((cat) => {
      counts[cat] = logsList.filter((l) => l.systemCategory === cat).length;
    });
    return counts;
  }, [logsList, systemCategories]);

  const filteredLogs = useMemo(() => {
    return logsList.filter((item) => {
      const matchTree =
        selectedSystemCategory === 'ALL' || item.systemCategory === selectedSystemCategory;

      const matchModule =
        item.moduleName.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        item.actionDetail.toLowerCase().includes(moduleSearch.toLowerCase());

      const matchOperator =
        operatorFilter === '全部操作人员' || item.operator === operatorFilter;

      return matchTree && matchModule && matchOperator;
    });
  }, [logsList, selectedSystemCategory, moduleSearch, operatorFilter]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 1;
  const currentData = filteredLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
    setJumpPage('');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans text-xs">
      {/* Left Column: System List Tree matching screenshot image_621ccbfb.png */}
      <div className="w-full lg:w-64 shrink-0 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span>系统列表</span>
          </div>
        </div>

        {/* Tree Search */}
        <div className="relative">
          <input
            type="text"
            value={treeSearchTerm}
            onChange={(e) => setTreeSearchTerm(e.target.value)}
            placeholder="请输入名称..."
            className="w-full pl-8 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-[11px]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[70vh]">
          {/* Root / Category nodes */}
          <div className="space-y-0.5">
            <button
              onClick={() => {
                setSelectedSystemCategory('ALL');
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedSystemCategory === 'ALL'
                  ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>全部系统分类</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                {logsList.length}
              </span>
            </button>

            {/* System category subnodes matching user screenshot (容器, 系统1...) */}
            <div className="pl-4 space-y-1 border-l border-slate-800 ml-3 pt-1">
              {systemCategories
                .filter((cat) => !treeSearchTerm || cat.toLowerCase().includes(treeSearchTerm.toLowerCase()))
                .map((catName) => {
                  const isSelected = selectedSystemCategory === catName;
                  const count = treeCounts[catName] || 0;

                  return (
                    <button
                      key={catName}
                      onClick={() => {
                        setSelectedSystemCategory(catName);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{catName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Search Toolbar & Table matching screenshot columns: 编号, 模块, 操作人员, 时间范围 */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Top Search Toolbar matching screenshot */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[320px]">
            {/* 请输入模块名称 */}
            <div className="relative w-52">
              <input
                type="text"
                value={moduleSearch}
                onChange={(e) => {
                  setModuleSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="请输入模块名称"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            </div>

            {/* 全部操作人员 Select */}
            <select
              value={operatorFilter}
              onChange={(e) => {
                setOperatorFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="全部操作人员">全部操作人员</option>
              {operators.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            {/* Date Range Select / Input */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-transparent border-none text-slate-200 focus:outline-none w-44 font-mono text-[11px]"
              />
            </div>

            {/* 搜索 Button */}
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-900/30 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              搜索
            </button>
          </div>
        </div>

        {/* Data Table matching screenshot columns: 编号, 模块, 操作人员, 时间范围 */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                  <th className="py-3 px-4 w-20 text-center border-r border-slate-800/80 font-mono">编号</th>
                  <th className="py-3 px-4 min-w-[200px] border-r border-slate-800/80">模块</th>
                  <th className="py-3 px-4 min-w-[150px] border-r border-slate-800/80">操作人员</th>
                  <th className="py-3 px-4 min-w-[220px] border-r border-slate-800/80 font-mono">时间范围</th>
                  <th className="py-3 px-4 text-center min-w-[120px] bg-slate-950 border-l border-slate-800">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                      当前筛选条件下暂无日志记录
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-3 px-4 text-center font-mono text-cyan-400 font-semibold border-r border-slate-800/60">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-100 border-r border-slate-800/60 group-hover:text-cyan-300 transition-colors">
                        {item.moduleName}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-200 border-r border-slate-800/60">
                        {item.operator}
                      </td>
                      <td className="py-3 px-4 font-mono text-cyan-300 border-r border-slate-800/60">
                        {item.timestamp}
                      </td>
                      <td className="py-3 px-4 text-center bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedLog(item)}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors font-medium cursor-pointer"
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

          {/* Pagination Toolbar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>
                共 <strong className="text-cyan-400 font-bold">{filteredLogs.length}</strong> 条记录
              </span>
              <span className="text-slate-600">|</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
                每页 10 条
              </span>
              <span className="text-slate-600">|</span>
              <span>
                第 <strong className="text-slate-200">{currentPage}</strong> / {totalPages} 页
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded font-mono font-semibold transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/50'
                        : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Jump to page */}
              <form onSubmit={handleJumpToPage} className="flex items-center gap-1.5">
                <span className="text-slate-500">跳至</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  placeholder={String(currentPage)}
                  className="w-12 px-1.5 py-1 bg-slate-900 border border-slate-800 rounded text-center text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
                <span className="text-slate-500">页</span>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">系统操作日志详情 - {selectedLog.id}</h3>
              <button onClick={() => setSelectedLog(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-[#001d33] border border-cyan-900/80">
                <div><span className="text-slate-400 block">日志编号:</span><strong className="text-cyan-300 font-mono">{selectedLog.id}</strong></div>
                <div><span className="text-slate-400 block">系统分类:</span><strong className="text-slate-100">{selectedLog.systemCategory}</strong></div>
                <div><span className="text-slate-400 block">模块名称:</span><strong className="text-slate-200">{selectedLog.moduleName}</strong></div>
                <div><span className="text-slate-400 block">操作人员:</span><strong className="text-cyan-400">{selectedLog.operator}</strong></div>
                <div className="col-span-2"><span className="text-slate-400 block">时间范围 (时间戳):</span><strong className="text-slate-200 font-mono">{selectedLog.timestamp}</strong></div>
              </div>
              <div className="p-3.5 rounded bg-[#001d33] border border-cyan-900/80 space-y-1">
                <span className="text-slate-400 block font-semibold">详细操作行为摘要:</span>
                <p className="text-slate-200 leading-relaxed font-mono">{selectedLog.actionDetail || '--'}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end">
              <button onClick={() => setSelectedLog(null)} className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
