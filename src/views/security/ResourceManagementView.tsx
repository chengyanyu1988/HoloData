import React, { useState, useMemo } from 'react';
import { Layers, Plus, Search, Code2, Link, ChevronLeft, ChevronRight, Lock, FolderOpen, Folder, AlertTriangle, ShieldCheck } from 'lucide-react';

export interface ResourceItem {
  id: string;
  number: number;
  menuCode: string;
  menuName: string;
  createdAt: string;
  creatorUser: string;
  permissionScope: string;
  category: string;
  description: string;
}

const INITIAL_RESOURCES: ResourceItem[] = [
  {
    id: 'RES-001',
    number: 1,
    menuCode: 'MENU_MON_IT',
    menuName: 'IT 设备监控中心',
    createdAt: '2026/11/06 12:12:23',
    creatorUser: 'admin',
    permissionScope: '高级管理员 职员',
    category: '集中监控中心',
    description: '服务器、交换机与硬件带外 BMC 实时遥测拓扑监控',
  },
  {
    id: 'RES-002',
    number: 2,
    menuCode: 'MENU_MON_OS',
    menuName: '操作系统核心指标',
    createdAt: '2026/11/06 11:30:15',
    creatorUser: 'lijian',
    permissionScope: '系统管理员 运维',
    category: '集中监控中心',
    description: 'Linux 内核 CPU、内存、IOPS 与网络吞吐监控',
  },
  {
    id: 'RES-003',
    number: 3,
    menuCode: 'MENU_EVENT_TODO',
    menuName: '待办告警事件中心',
    createdAt: '2026/11/05 16:45:10',
    creatorUser: 'zhangwei',
    permissionScope: '安全审计员 高管',
    category: '事件与告警中心',
    description: '全域故障告警、P1/P2 故障上报与闭环处置',
  },
  {
    id: 'RES-004',
    number: 4,
    menuCode: 'MENU_WO_MGR',
    menuName: '智能运维工单流转',
    createdAt: '2026/11/05 09:20:00',
    creatorUser: 'wangfang',
    permissionScope: '高级运维员 审批人',
    category: '工单流转系统',
    description: '变更工单审批、巡检工单派发与自动化脚本编排',
  },
  {
    id: 'RES-005',
    number: 5,
    menuCode: 'MENU_KB_LIST',
    menuName: '知识库与 SOP 运维手册',
    createdAt: '2026/11/04 14:10:55',
    creatorUser: 'chenming',
    permissionScope: '全体员工',
    category: '知识库管理',
    description: '标准作业程序 (SOP)、故障排查指南与架构白皮书',
  },
  {
    id: 'RES-006',
    number: 6,
    menuCode: 'MENU_CFG_ITEMS',
    menuName: 'CMDB 配置项数据中心',
    createdAt: '2026/11/04 10:05:30',
    creatorUser: 'zhaomin',
    permissionScope: 'CMDB 管理员 架构师',
    category: '配置与CMDB',
    description: '资产配置项关联拓扑、硬件参数与维保到期台账',
  },
  {
    id: 'RES-007',
    number: 7,
    menuCode: 'MENU_SEC_PERSONNEL',
    menuName: '平台人员与账号档案',
    createdAt: '2026/11/03 15:40:20',
    creatorUser: 'chengyu',
    permissionScope: '超级管理员',
    category: '系统与安全管理',
    description: '平台运维人员档案、MFA 绑定与密码策略管控',
  },
  {
    id: 'RES-008',
    number: 8,
    menuCode: 'MENU_SEC_ORG',
    menuName: '组织架构与部门维护',
    createdAt: '2026-11-03 11:15:00',
    creatorUser: 'admin',
    permissionScope: '超级管理员 系统管理员',
    category: '系统与安全管理',
    description: '集团总公司及各下属处室、科室组织树维护',
  },
  {
    id: 'RES-009',
    number: 9,
    menuCode: 'MENU_SEC_ROLES',
    menuName: 'RBAC 岗位角色权限',
    createdAt: '2026-11-02 09:50:12',
    creatorUser: 'zhangwei',
    permissionScope: '超级管理员',
    category: '系统与安全管理',
    description: '岗位角色授权点数、数据权限范围矩阵配置',
  },
  {
    id: 'RES-010',
    number: 10,
    menuCode: 'MENU_SEC_LOGS',
    menuName: '全链路审计日志存证',
    createdAt: '2026-11-01 16:30:00',
    creatorUser: 'zhoutao',
    permissionScope: '安全审计员',
    category: '系统与安全管理',
    description: '用户登录、操作指令、配置 Diff 与安全事件防篡改日志',
  },
  {
    id: 'RES-011',
    number: 11,
    menuCode: 'MENU_SYS_PARAMS',
    menuName: '系统运行参数维护',
    createdAt: '2026-10-30 14:00:00',
    creatorUser: 'admin',
    permissionScope: '超级管理员',
    category: '系统与安全管理',
    description: '全局超时时间、心跳上报间隔、通知网关参数配置',
  },
];

export const ResourceManagementView: React.FC = () => {
  const [resourcesList, setResourcesList] = useState<ResourceItem[]>(INITIAL_RESOURCES);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 10;

  // Modals
  const [viewingRes, setViewingRes] = useState<ResourceItem | null>(null);
  const [editingRes, setEditingRes] = useState<ResourceItem | null>(null);
  const [deletingRes, setDeletingRes] = useState<ResourceItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New resource form state
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuCode, setNewMenuCode] = useState('');
  const [newCategory, setNewCategory] = useState('集中监控中心');
  const [newPermissionScope, setNewPermissionScope] = useState('高级管理员 职员');
  const [newDescription, setNewDescription] = useState('');

  // Edit resource form state
  const [editMenuName, setEditMenuName] = useState('');
  const [editMenuCode, setEditMenuCode] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editPermissionScope, setEditPermissionScope] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const categories = useMemo(() => {
    return Array.from(new Set(resourcesList.map((r) => r.category)));
  }, [resourcesList]);

  // Tree category counts for 100% precision
  const treeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: resourcesList.length };
    categories.forEach((cat) => {
      counts[cat] = resourcesList.filter((r) => r.category === cat).length;
    });
    return counts;
  }, [resourcesList, categories]);

  const filteredResources = useMemo(() => {
    return resourcesList.filter((item) => {
      const matchTree =
        selectedCategory === 'ALL' || item.category === selectedCategory;

      const matchSearch =
        item.menuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.menuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.creatorUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchTree && matchSearch;
    });
  }, [resourcesList, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredResources.length / pageSize) || 1;
  const currentData = filteredResources.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
    setJumpPage('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim() || !newMenuCode.trim()) {
      alert('请填写菜单名称与编码');
      return;
    }

    const newItem: ResourceItem = {
      id: `RES-${Math.floor(100 + Math.random() * 900)}`,
      number: resourcesList.length + 1,
      menuCode: newMenuCode,
      menuName: newMenuName,
      createdAt: '2026/11/06 16:00:00',
      creatorUser: 'admin',
      permissionScope: newPermissionScope,
      category: newCategory,
      description: newDescription || '新建系统菜单路由与权限范围',
    };

    setResourcesList((prev) => [newItem, ...prev]);
    alert(`成功注册新菜单资源: ${newMenuName}`);
    setIsAddOpen(false);
    setNewMenuName('');
    setNewMenuCode('');
    setNewDescription('');
  };

  const openEditModal = (res: ResourceItem) => {
    setEditingRes(res);
    setEditMenuName(res.menuName);
    setEditMenuCode(res.menuCode);
    setEditCategory(res.category);
    setEditPermissionScope(res.permissionScope);
    setEditDescription(res.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRes) return;
    setResourcesList((prev) =>
      prev.map((r) =>
        r.id === editingRes.id
          ? {
              ...r,
              menuName: editMenuName,
              menuCode: editMenuCode,
              category: editCategory,
              permissionScope: editPermissionScope,
              description: editDescription,
              createdAt: '2026/11/06 16:15:00',
            }
          : r
      )
    );
    alert(`成功修改菜单资源: ${editMenuName}`);
    setEditingRes(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans text-xs">
      {/* Left Column: Menu List Tree matching screenshot image_5d203811.png */}
      <div className="w-full lg:w-64 shrink-0 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>菜单列表</span>
          </div>
          <div className="flex items-center gap-1"></div>
        </div>

        {/* Tree Search */}
        <div className="relative">
          <input
            type="text"
            value={treeSearchTerm}
            onChange={(e) => setTreeSearchTerm(e.target.value)}
            placeholder="请输入菜单名称"
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
                setSelectedCategory('ALL');
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>全部菜单列表</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                {resourcesList.length}
              </span>
            </button>

            {/* Category subnodes */}
            <div className="pl-4 space-y-1 border-l border-slate-800 ml-3 pt-1">
              {categories
                .filter((cat) => !treeSearchTerm || cat.toLowerCase().includes(treeSearchTerm.toLowerCase()))
                .map((catName) => {
                  const isSelected = selectedCategory === catName;
                  const count = treeCounts[catName] || 0;

                  return (
                    <button
                      key={catName}
                      onClick={() => {
                        setSelectedCategory(catName);
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

        {/* Add Menu Button at bottom left */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          新增菜单
        </button>
      </div>

      {/* Right Column: Search Toolbar & Table matching screenshot columns: 菜单创建时间, 创建用户名, 权限范围, 功能 */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Top Search Toolbar */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[320px]">
            <div className="relative w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="请输入菜单名称或编码"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            </div>

            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-900/30 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              搜索
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-950/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>
          </div>
        </div>

        {/* Data Table matching screenshot columns */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                  <th className="py-3 px-4 min-w-[180px] border-r border-slate-800/80 font-mono">菜单创建时间</th>
                  <th className="py-3 px-4 min-w-[150px] border-r border-slate-800/80">创建用户名</th>
                  <th className="py-3 px-4 min-w-[220px] border-r border-slate-800/80">权限范围</th>
                  <th className="py-3 px-4 text-center min-w-[180px] bg-slate-950 border-l border-slate-800">功能</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500 font-medium">
                      当前分类下暂无菜单记录
                    </td>
                  </tr>
                ) : (
                  currentData.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-3 px-4 font-mono text-cyan-300 font-semibold border-r border-slate-800/60">
                        {item.createdAt}
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-slate-100 border-r border-slate-800/60 group-hover:text-cyan-300 transition-colors">
                        {item.creatorUser}
                      </td>
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-200">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-cyan-300 font-medium">
                          {item.permissionScope}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => setIsAddOpen(true)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            新增
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setDeletingRes(item)}
                            className="text-rose-400 hover:text-rose-300 hover:underline transition-colors cursor-pointer"
                          >
                            删除
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => openEditModal(item)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            修改
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setViewingRes(item)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            查看
                          </button>
                        </div>
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
                共 <strong className="text-cyan-400 font-bold">{filteredResources.length}</strong> 条记录
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

      {/* View Detail Modal */}
      {viewingRes && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">菜单资源详情 - {viewingRes.menuName}</h3>
              <button onClick={() => setViewingRes(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-[#001d33] border border-cyan-900/80">
                <div><span className="text-slate-400 block">菜单名称:</span><strong className="text-slate-100">{viewingRes.menuName}</strong></div>
                <div><span className="text-slate-400 block">菜单编码:</span><strong className="text-cyan-300 font-mono">{viewingRes.menuCode}</strong></div>
                <div><span className="text-slate-400 block">创建时间:</span><strong className="text-slate-200 font-mono">{viewingRes.createdAt}</strong></div>
                <div><span className="text-slate-400 block">创建用户名:</span><strong className="text-cyan-400 font-mono">{viewingRes.creatorUser}</strong></div>
                <div className="col-span-2"><span className="text-slate-400 block">权限范围:</span><strong className="text-emerald-400">{viewingRes.permissionScope}</strong></div>
              </div>
              <div className="p-3.5 rounded bg-[#001d33] border border-cyan-900/80 space-y-1">
                <span className="text-slate-400 block font-semibold">菜单描述:</span>
                <p className="text-slate-200 leading-relaxed">{viewingRes.description || '--'}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end">
              <button onClick={() => setViewingRes(null)} className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {editingRes && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">修改菜单资源 - {editingRes.menuName}</h3>
              <button onClick={() => setEditingRes(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>菜单名称:
                  </label>
                  <input
                    type="text"
                    value={editMenuName}
                    onChange={(e) => setEditMenuName(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>菜单编码:
                  </label>
                  <input
                    type="text"
                    value={editMenuCode}
                    onChange={(e) => setEditMenuCode(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">所属分类:</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">权限范围:</label>
                  <input
                    type="text"
                    value={editPermissionScope}
                    onChange={(e) => setEditPermissionScope(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">菜单描述:</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows={3}
                  className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded p-2.5 text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/60">
                <button
                  type="button"
                  onClick={() => setEditingRes(null)}
                  className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#0082c8] hover:bg-[#0092e0] text-white font-semibold shadow-md shadow-cyan-950/50 transition-colors cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRes && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#002b49] border border-rose-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>确认删除菜单资源</span>
              </div>
              <button onClick={() => setDeletingRes(null)} className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要删除菜单资源 <strong className="text-cyan-300 font-semibold">{deletingRes.menuName} ({deletingRes.menuCode})</strong> 吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">创建时间:</span> {deletingRes.createdAt}</div>
                <div><span className="text-slate-500">创建用户:</span> {deletingRes.creatorUser}</div>
                <div><span className="text-slate-500">权限范围:</span> {deletingRes.permissionScope}</div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button onClick={() => setDeletingRes(null)} className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                取消
              </button>
              <button
                onClick={() => {
                  setResourcesList((prev) => prev.filter((r) => r.id !== deletingRes.id));
                  alert(`已成功删除菜单资源: ${deletingRes.menuName}`);
                  setDeletingRes(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">新增系统菜单资源</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>菜单名称:
                  </label>
                  <input
                    type="text"
                    value={newMenuName}
                    onChange={(e) => setNewMenuName(e.target.value)}
                    placeholder="请输入菜单名称"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>菜单编码:
                  </label>
                  <input
                    type="text"
                    value={newMenuCode}
                    onChange={(e) => setNewMenuCode(e.target.value)}
                    placeholder="如: MENU_CUSTOM_01"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">所属分类:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">权限范围:</label>
                  <input
                    type="text"
                    value={newPermissionScope}
                    onChange={(e) => setNewPermissionScope(e.target.value)}
                    placeholder="如: 高级管理员 职员"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">菜单描述:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="请输入该菜单资源的职责说明..."
                  rows={3}
                  className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded p-2.5 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/60">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#0082c8] hover:bg-[#0092e0] text-white font-semibold shadow-md shadow-cyan-950/50 transition-colors cursor-pointer"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
