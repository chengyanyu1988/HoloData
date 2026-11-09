import React, { useState, useMemo } from 'react';
import { ShieldCheck, Plus, Search, Users, Key, ChevronLeft, ChevronRight, Lock, CheckCircle2, AlertTriangle, FolderOpen, Folder } from 'lucide-react';

export interface RoleItem {
  id: string;
  number: number;
  roleCode: string;
  roleName: string;
  permissionCount: number;
  userCount: number;
  dataScope: '全局算力集群' | '本处室及下属科室' | '已授权设备组' | '仅限本人经办';
  status: '已启用' | '已停用';
  updatedAt: string;
  description: string;
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: 'ROLE-001',
    number: 1,
    roleCode: 'ROLE_SUPER_ADMIN',
    roleName: '超级管理员',
    permissionCount: 128,
    userCount: 2,
    dataScope: '全局算力集群',
    status: '已启用',
    updatedAt: '2026-11-06 14:20:00',
    description: '全域系统最高执行权限，包含基础设施配置、安全审计与敏感数据导出',
  },
  {
    id: 'ROLE-002',
    number: 2,
    roleCode: 'ROLE_SYS_ADMIN',
    roleName: '系统管理员',
    permissionCount: 96,
    userCount: 5,
    dataScope: '全局算力集群',
    status: '已启用',
    updatedAt: '2026-11-06 10:15:30',
    description: '负责服务器、网络、中间件与数据库系统运维与工单审批',
  },
  {
    id: 'ROLE-003',
    number: 3,
    roleCode: 'ROLE_SEC_AUDITOR',
    roleName: '安全审计员',
    permissionCount: 42,
    userCount: 3,
    dataScope: '全局算力集群',
    status: '已启用',
    updatedAt: '2026-11-05 16:45:12',
    description: '查阅全链路操作审计日志、配置 Diff、安全事件复盘与合规存证',
  },
  {
    id: 'ROLE-004',
    number: 4,
    roleCode: 'ROLE_SENIOR_OPS',
    roleName: '高级运维工程师',
    permissionCount: 75,
    userCount: 12,
    dataScope: '本处室及下属科室',
    status: '已启用',
    updatedAt: '2026-11-05 09:30:00',
    description: '执行设备巡检、容器调优、告警处置与变更工单提交',
  },
  {
    id: 'ROLE-005',
    number: 5,
    roleCode: 'ROLE_DBA_ADMIN',
    roleName: '数据库管理员 (DBA)',
    permissionCount: 68,
    userCount: 4,
    dataScope: '已授权设备组',
    status: '已启用',
    updatedAt: '2026-11-04 11:20:45',
    description: '负责 ClickHouse、Doris 与 PostgreSQL 实例运维、SQL 优化与慢日志分析',
  },
  {
    id: 'ROLE-006',
    number: 6,
    roleCode: 'ROLE_NET_ENGINEER',
    roleName: '网络运维工程师',
    permissionCount: 55,
    userCount: 6,
    dataScope: '已授权设备组',
    status: '已启用',
    updatedAt: '2026-11-04 15:10:00',
    description: '管控 Spine/Leaf 核心交换机、端口遥测与 400G 无损以太网 Fabric',
  },
  {
    id: 'ROLE-007',
    number: 7,
    roleCode: 'ROLE_JUNIOR_OPS',
    roleName: '普通运维员',
    permissionCount: 32,
    userCount: 18,
    dataScope: '仅限本人经办',
    status: '已启用',
    updatedAt: '2026-11-03 17:00:00',
    description: '日常设备状态巡视、基础告警响应与简单工单回复',
  },
  {
    id: 'ROLE-008',
    number: 8,
    roleCode: 'ROLE_GUEST_OBSERVER',
    roleName: '只读观察员',
    permissionCount: 15,
    userCount: 8,
    dataScope: '全局算力集群',
    status: '已启用',
    updatedAt: '2026-11-02 08:30:00',
    description: '看板全景可视化呈现，禁止任何写操作与配置修改',
  },
  {
    id: 'ROLE-009',
    number: 9,
    roleCode: 'ROLE_TEST_SANDBOX',
    roleName: '测试沙盒演练角色',
    permissionCount: 20,
    userCount: 0,
    dataScope: '仅限本人经办',
    status: '已停用',
    updatedAt: '2026-11-01 12:00:00',
    description: '演练环境临时角色，包含基础隔离算力单元调配权限',
  },
];

export const RoleManagementView: React.FC = () => {
  const [rolesList, setRolesList] = useState<RoleItem[]>(INITIAL_ROLES);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<string>('ALL');
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 10;

  // Modals
  const [viewingRole, setViewingRole] = useState<RoleItem | null>(null);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New role form state
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleCode, setNewRoleCode] = useState('');
  const [newPermissionCount, setNewPermissionCount] = useState('50');
  const [newDataScope, setNewDataScope] = useState<'全局算力集群' | '本处室及下属科室' | '已授权设备组' | '仅限本人经办'>('本处室及下属科室');
  const [newDescription, setNewDescription] = useState('');

  // Edit role form state
  const [editRoleName, setEditRoleName] = useState('');
  const [editRoleCode, setEditRoleCode] = useState('');
  const [editDataScope, setEditDataScope] = useState<'全局算力集群' | '本处室及下属科室' | '已授权设备组' | '仅限本人经办'>('本处室及下属科室');
  const [editStatus, setEditStatus] = useState<'已启用' | '已停用'>('已启用');
  const [editDescription, setEditDescription] = useState('');

  // Tree node list for left sidebar
  const roleCategories = useMemo(() => {
    return Array.from(new Set(rolesList.map((r) => r.roleName)));
  }, [rolesList]);

  // Tree category counts for 100% precision
  const treeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: rolesList.length };
    roleCategories.forEach((cat) => {
      counts[cat] = rolesList.filter((r) => r.roleName === cat).length;
    });
    return counts;
  }, [rolesList, roleCategories]);

  const filteredRoles = useMemo(() => {
    return rolesList.filter((item) => {
      const matchTree =
        selectedRoleCategory === 'ALL' || item.roleName === selectedRoleCategory;

      const matchSearch =
        item.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.roleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());

      return matchTree && matchSearch;
    });
  }, [rolesList, selectedRoleCategory, searchTerm]);

  const totalPages = Math.ceil(filteredRoles.length / pageSize) || 1;
  const currentData = filteredRoles.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    if (!newRoleName.trim() || !newRoleCode.trim()) {
      alert('请填写角色名称与角色编码');
      return;
    }

    const newRoleItem: RoleItem = {
      id: `ROLE-${Math.floor(100 + Math.random() * 900)}`,
      number: rolesList.length + 1,
      roleCode: newRoleCode,
      roleName: newRoleName,
      permissionCount: parseInt(newPermissionCount, 10) || 45,
      userCount: 0,
      dataScope: newDataScope,
      status: '已启用',
      updatedAt: '2026-11-06 15:30:00',
      description: newDescription || '新创建的平台岗位权限角色',
    };

    setRolesList((prev) => [newRoleItem, ...prev]);
    alert(`成功创建角色: ${newRoleName}`);
    setIsAddOpen(false);
    setNewRoleName('');
    setNewRoleCode('');
    setNewDescription('');
  };

  const openEditModal = (role: RoleItem) => {
    setEditingRole(role);
    setEditRoleName(role.roleName);
    setEditRoleCode(role.roleCode);
    setEditDataScope(role.dataScope);
    setEditStatus(role.status);
    setEditDescription(role.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRole) return;
    setRolesList((prev) =>
      prev.map((r) =>
        r.id === editingRole.id
          ? {
              ...r,
              roleName: editRoleName,
              roleCode: editRoleCode,
              dataScope: editDataScope,
              status: editStatus,
              description: editDescription,
              updatedAt: '2026-11-06 15:45:00',
            }
          : r
      )
    );
    alert(`成功更新角色: ${editRoleName}`);
    setEditingRole(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans text-xs">
      {/* Left Column: Role List Tree matching screenshot image_08bc3744.png */}
      <div className="w-full lg:w-64 shrink-0 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>角色列表</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsAddOpen(true)}
              title="添加角色"
              className="p-1 rounded hover:bg-slate-800 text-cyan-400 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tree Search */}
        <div className="relative">
          <input
            type="text"
            value={treeSearchTerm}
            onChange={(e) => setTreeSearchTerm(e.target.value)}
            placeholder="请输入角色名称..."
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
                setSelectedRoleCategory('ALL');
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedRoleCategory === 'ALL'
                  ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>全部岗位角色</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                {rolesList.length}
              </span>
            </button>

            {/* Role item subnodes */}
            <div className="pl-4 space-y-1 border-l border-slate-800 ml-3 pt-1">
              {roleCategories
                .filter((cat) => !treeSearchTerm || cat.toLowerCase().includes(treeSearchTerm.toLowerCase()))
                .map((catName) => {
                  const isSelected = selectedRoleCategory === catName;
                  const count = treeCounts[catName] || 0;

                  return (
                    <button
                      key={catName}
                      onClick={() => {
                        setSelectedRoleCategory(catName);
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

        {/* Add Role Button at bottom left matching screenshot */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          添加角色
        </button>
      </div>

      {/* Right Column: Search Toolbar & Table */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Top Search Toolbar matching screenshot */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[320px]">
            {/* 请输入角色名称或编码 */}
            <div className="relative w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="请输入角色名称或编码"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
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

          {/* Top Right Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-950/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              新增角色
            </button>
            <button
              onClick={() => alert('请勾选需要批量删除的角色记录')}
              className="px-4 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-white rounded-lg font-semibold transition-colors shadow-sm cursor-pointer border border-rose-700"
            >
              批量删除
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                  <th className="py-3 px-3 w-16 text-center border-r border-slate-800/80 font-mono">编号</th>
                  <th className="py-3 px-3 min-w-[130px] border-r border-slate-800/80">角色名称</th>
                  <th className="py-3 px-3 min-w-[150px] border-r border-slate-800/80 font-mono">角色编码</th>
                  <th className="py-3 px-3 min-w-[100px] border-r border-slate-800/80 text-center font-mono">授权点数</th>
                  <th className="py-3 px-3 min-w-[100px] border-r border-slate-800/80 text-center font-mono">关联人员</th>
                  <th className="py-3 px-4 min-w-[140px] border-r border-slate-800/80">数据权限范围</th>
                  <th className="py-3 px-4 min-w-[200px] border-r border-slate-800/80">角色描述</th>
                  <th className="py-3 px-4 min-w-[140px] border-r border-slate-800/80 font-mono">更新时间</th>
                  <th className="py-3 px-3 w-20 text-center border-r border-slate-800/80">状态</th>
                  <th className="py-3 px-4 text-center min-w-[150px] sticky right-0 bg-slate-950 border-l border-slate-800 shadow-l">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500 font-medium">
                      当前筛选条件下暂无角色记录
                    </td>
                  </tr>
                ) : (
                  currentData.map((role, idx) => (
                    <tr key={role.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-3 px-3 text-center font-mono text-cyan-400 font-semibold border-r border-slate-800/60">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-100 border-r border-slate-800/60 group-hover:text-cyan-300 transition-colors">
                        {role.roleName}
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300 border-r border-slate-800/60">
                        {role.roleCode}
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-cyan-200 border-r border-slate-800/60">
                        <span className="px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">
                          {role.permissionCount}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-300 border-r border-slate-800/60">
                        {role.userCount} 人
                      </td>
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-200 font-medium">
                        {role.dataScope}
                      </td>
                      <td className="py-3 px-4 text-slate-400 border-r border-slate-800/60 truncate max-w-[200px]" title={role.description}>
                        {role.description || '--'}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 border-r border-slate-800/60">
                        {role.updatedAt}
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-800/60">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            role.status === '已启用'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }`}
                        >
                          {role.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center sticky right-0 bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 shadow-l whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => openEditModal(role)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            修改
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setViewingRole(role)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            查看
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setDeletingRole(role)}
                            className="text-rose-400 hover:text-rose-300 hover:underline transition-colors cursor-pointer"
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

          {/* Pagination Toolbar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>
                共 <strong className="text-cyan-400 font-bold">{filteredRoles.length}</strong> 条记录
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
      {viewingRole && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">岗位角色详情 - {viewingRole.roleName}</h3>
              <button onClick={() => setViewingRole(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-[#001d33] border border-cyan-900/80">
                <div><span className="text-slate-400 block">角色名称:</span><strong className="text-slate-100">{viewingRole.roleName}</strong></div>
                <div><span className="text-slate-400 block">角色编码:</span><strong className="text-cyan-300 font-mono">{viewingRole.roleCode}</strong></div>
                <div><span className="text-slate-400 block">授权点数:</span><strong className="text-cyan-400 font-mono">{viewingRole.permissionCount} 个</strong></div>
                <div><span className="text-slate-400 block">关联人员:</span><strong className="text-slate-200 font-mono">{viewingRole.userCount} 人</strong></div>
                <div><span className="text-slate-400 block">数据权限范围:</span><strong className="text-cyan-200">{viewingRole.dataScope}</strong></div>
                <div><span className="text-slate-400 block">状态:</span><strong className="text-emerald-400">{viewingRole.status}</strong></div>
                <div className="col-span-2"><span className="text-slate-400 block">更新时间:</span><strong className="text-slate-300 font-mono">{viewingRole.updatedAt}</strong></div>
              </div>
              <div className="p-3.5 rounded bg-[#001d33] border border-cyan-900/80 space-y-1">
                <span className="text-slate-400 block font-semibold">角色描述:</span>
                <p className="text-slate-200 leading-relaxed">{viewingRole.description || '--'}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end">
              <button onClick={() => setViewingRole(null)} className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRole && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">修改岗位角色 - {editingRole.roleName}</h3>
              <button onClick={() => setEditingRole(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>角色名称:
                  </label>
                  <input
                    type="text"
                    value={editRoleName}
                    onChange={(e) => setEditRoleName(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>角色编码:
                  </label>
                  <input
                    type="text"
                    value={editRoleCode}
                    onChange={(e) => setEditRoleCode(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">数据权限范围:</label>
                  <select
                    value={editDataScope}
                    onChange={(e) => setEditDataScope(e.target.value as any)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="全局算力集群">全局算力集群</option>
                    <option value="本处室及下属科室">本处室及下属科室</option>
                    <option value="已授权设备组">已授权设备组</option>
                    <option value="仅限本人经办">仅限本人经办</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">状态:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="已启用">已启用</option>
                    <option value="已停用">已停用</option>
                  </select>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">角色描述:</label>
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
                  onClick={() => setEditingRole(null)}
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
      {deletingRole && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#002b49] border border-rose-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>确认删除岗位角色</span>
              </div>
              <button onClick={() => setDeletingRole(null)} className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要删除岗位角色 <strong className="text-cyan-300 font-semibold">{deletingRole.roleName} ({deletingRole.roleCode})</strong> 吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">关联人员:</span> {deletingRole.userCount} 人</div>
                <div><span className="text-slate-500">授权点数:</span> {deletingRole.permissionCount} 个</div>
                <div><span className="text-slate-500">数据范围:</span> {deletingRole.dataScope}</div>
              </div>
              <p className="text-rose-400/90 text-[11px] font-medium">
                ⚠️ 注意：删除角色将同时解除所有已关联人员的该岗位权限！
              </p>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button onClick={() => setDeletingRole(null)} className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                取消
              </button>
              <button
                onClick={() => {
                  setRolesList((prev) => prev.filter((r) => r.id !== deletingRole.id));
                  alert(`已成功删除岗位角色: ${deletingRole.roleName}`);
                  setDeletingRole(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">新增平台岗位角色</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>角色名称:
                  </label>
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="请输入角色名称"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>角色编码:
                  </label>
                  <input
                    type="text"
                    value={newRoleCode}
                    onChange={(e) => setNewRoleCode(e.target.value)}
                    placeholder="如: ROLE_CUSTOM_OPS"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">数据权限范围:</label>
                  <select
                    value={newDataScope}
                    onChange={(e) => setNewDataScope(e.target.value as any)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="全局算力集群">全局算力集群</option>
                    <option value="本处室及下属科室">本处室及下属科室</option>
                    <option value="已授权设备组">已授权设备组</option>
                    <option value="仅限本人经办">仅限本人经办</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">初始授权点数:</label>
                  <input
                    type="number"
                    value={newPermissionCount}
                    onChange={(e) => setNewPermissionCount(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">角色描述:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="请输入该角色的权限职能描述..."
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
