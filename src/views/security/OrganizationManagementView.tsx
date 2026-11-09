import React, { useState, useMemo } from 'react';
import { Building2, Plus, Search, ChevronRight, ChevronLeft, Folder, Users, FolderOpen, AlertTriangle, ShieldCheck, Mail, Phone } from 'lucide-react';

export interface OrgUserItem {
  id: string;
  number: number;
  fullName: string;
  username: string;
  passwordMasked: string;
  gender: '男' | '女';
  systemRole: string;
  department: string;
  subOrg: string;
  phone: string;
  email: string;
  remarks: string;
  joinDate: string;
}

const INITIAL_ORG_USERS: OrgUserItem[] = [
  {
    id: 'ORGUSR-01',
    number: 1,
    fullName: '程总工',
    username: 'chengyu',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '超级管理员',
    department: '集团总公司 / 基础设施总部',
    subOrg: '基础设施总部',
    phone: '138-1029-8801',
    email: 'chengyanyu@hologram.cn',
    remarks: '基础设施总架构与核心策略审批',
    joinDate: '2026-11-01',
  },
  {
    id: 'ORGUSR-02',
    number: 2,
    fullName: '李健',
    username: 'lijian',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '系统管理员',
    department: '硬件运维中心 / 算力保障科',
    subOrg: '硬件运维中心',
    phone: '139-0123-4567',
    email: 'lijian@hologram.cn',
    remarks: '负责服务器机架巡检与带外 BMC 维护',
    joinDate: '2026-11-02',
  },
  {
    id: 'ORGUSR-03',
    number: 3,
    fullName: '张伟',
    username: 'zhangwei',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '安全审计员',
    department: '网络安全部 / 等保合规室',
    subOrg: '网络安全部',
    phone: '137-8899-1122',
    email: 'zhangwei@hologram.cn',
    remarks: '等保合规检测与全链路审计日志存证',
    joinDate: '2026-11-02',
  },
  {
    id: 'ORGUSR-04',
    number: 4,
    fullName: '王芳',
    username: 'wangfang',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '高级运维员',
    department: '数据库与存储组 / 数据湖架构室',
    subOrg: '数据库与存储组',
    phone: '136-5544-3322',
    email: 'wangfang@hologram.cn',
    remarks: 'ClickHouse 数据湖集群冷热分层架构调优',
    joinDate: '2026-11-03',
  },
  {
    id: 'ORGUSR-05',
    number: 5,
    fullName: '陈明',
    username: 'chenming',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '运维工程师',
    department: '硬件运维中心 / 算力保障科',
    subOrg: '硬件运维中心',
    phone: '135-2233-4455',
    email: 'chenming@hologram.cn',
    remarks: 'GPU 算力集群 H800 NVLink 互联保障',
    joinDate: '2026-11-03',
  },
  {
    id: 'ORGUSR-06',
    number: 6,
    fullName: '赵敏',
    username: 'zhaomin',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '系统管理员',
    department: '数据库与存储组 / 数据湖架构室',
    subOrg: '数据库与存储组',
    phone: '138-7766-5544',
    email: 'zhaomin@hologram.cn',
    remarks: 'Kubernetes 容器云原生集群与 Cilium CNI 巡检',
    joinDate: '2026-11-04',
  },
  {
    id: 'ORGUSR-07',
    number: 7,
    fullName: '孙杰',
    username: 'sunjie',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '普通运维员',
    department: '硬件运维中心 / 算力保障科',
    subOrg: '硬件运维中心',
    phone: '139-4455-6677',
    email: 'sunjie@hologram.cn',
    remarks: '工业 RFID 读写器天线驻波比高频校准',
    joinDate: '2026-11-04',
  },
  {
    id: 'ORGUSR-08',
    number: 8,
    fullName: '周涛',
    username: 'zhoutao',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '安全审计员',
    department: '网络安全部 / 等保合规室',
    subOrg: '网络安全部',
    phone: '137-1122-3344',
    email: 'zhoutao@hologram.cn',
    remarks: '防火墙访问控制列表 (ACL) 合规检查',
    joinDate: '2026-11-05',
  },
  {
    id: 'ORGUSR-09',
    number: 9,
    fullName: '吴强',
    username: 'wuqiang',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '普通运维员',
    department: '数据库与存储组 / 存储阵列科',
    subOrg: '数据库与存储组',
    phone: '136-9988-7766',
    email: 'wuqiang@hologram.cn',
    remarks: 'NVMe-oF 存储卷 SMART 状态监控与巡检',
    joinDate: '2026-11-05',
  },
  {
    id: 'ORGUSR-10',
    number: 10,
    fullName: '郑秀',
    username: 'zhengxiu',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '数据库管理员',
    department: '数据库与存储组 / 存储阵列科',
    subOrg: '数据库与存储组',
    phone: '135-8877-6655',
    email: 'zhengxiu@hologram.cn',
    remarks: 'PostgreSQL 16 事务日志与主备复制监控',
    joinDate: '2026-11-05',
  },
  {
    id: 'ORGUSR-11',
    number: 11,
    fullName: '刘磊',
    username: 'liulei',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '运维工程师',
    department: '硬件运维中心 / 算力保障科',
    subOrg: '硬件运维中心',
    phone: '138-6655-4433',
    email: 'liulei@hologram.cn',
    remarks: 'AI 训练作业算力配额限额与抢占调度',
    joinDate: '2026-11-06',
  },
  {
    id: 'ORGUSR-12',
    number: 12,
    fullName: '黄蓉',
    username: 'huangrong',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '高级运维员',
    department: '网络安全部 / 等保合规室',
    subOrg: '网络安全部',
    phone: '139-2211-0099',
    email: 'huangrong@hologram.cn',
    remarks: 'DevOps 流水线发布审核与证书到期管理',
    joinDate: '2026-11-06',
  },
];

export const OrganizationManagementView: React.FC = () => {
  const [orgUsers, setOrgUsers] = useState<OrgUserItem[]>(INITIAL_ORG_USERS);
  const [selectedNode, setSelectedNode] = useState<string>('ALL');
  const [treeExpanded, setTreeExpanded] = useState(true);
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Organization tree nodes state
  const [orgNodes, setOrgNodes] = useState<string[]>([
    '基础设施总部',
    '硬件运维中心',
    '网络安全部',
    '数据库与存储组',
  ]);
  const [isOrgAddOpen, setIsOrgAddOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgCode, setNewOrgCode] = useState('');
  const [newOrgLeader, setNewOrgLeader] = useState('');
  const [newOrgPhone, setNewOrgPhone] = useState('');
  const [newOrgRemarks, setNewOrgRemarks] = useState('');

  // Search & Filters matching screenshot
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('全部部门');
  const [roleFilter, setRoleFilter] = useState('全部角色');

  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 10;

  // Modals
  const [viewingUser, setViewingUser] = useState<OrgUserItem | null>(null);
  const [editingUser, setEditingUser] = useState<OrgUserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<OrgUserItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editGender, setEditGender] = useState<'男' | '女'>('男');
  const [editRole, setEditRole] = useState('');
  const [editSubOrg, setEditSubOrg] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  // New user form state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newGender, setNewGender] = useState<'男' | '女'>('男');
  const [newRole, setNewRole] = useState('系统管理员');
  const [newSubOrg, setNewSubOrg] = useState('硬件运维中心');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  const departments = Array.from(new Set(orgUsers.map((u) => u.department)));
  const roles = Array.from(new Set(orgUsers.map((u) => u.systemRole)));

  // Tree category counts for 100% precision
  const treeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: orgUsers.length };
    ['集团总公司', ...orgNodes].forEach((node) => {
      counts[node] = orgUsers.filter((u) => u.subOrg === node || (node === '集团总公司')).length;
    });
    return counts;
  }, [orgUsers, orgNodes]);

  const filteredUsers = useMemo(() => {
    return orgUsers.filter((item) => {
      // Tree node check
      const matchTree =
        selectedNode === 'ALL' ||
        item.subOrg === selectedNode ||
        (selectedNode === '集团总公司');

      const matchSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = deptFilter === '全部部门' || item.department === deptFilter;
      const matchRole = roleFilter === '全部角色' || item.systemRole === roleFilter;

      return matchTree && matchSearch && matchDept && matchRole;
    });
  }, [orgUsers, selectedNode, searchTerm, deptFilter, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const currentData = filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
    setJumpPage('');
  };

  const handleOrgCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) {
      alert('请填写组织机构名称');
      return;
    }
    if (orgNodes.includes(newOrgName)) {
      alert('该组织名称已存在');
      return;
    }
    setOrgNodes((prev) => [...prev, newOrgName]);
    alert(`成功新增组织机构节点: ${newOrgName}`);
    setIsOrgAddOpen(false);
    setNewOrgName('');
    setNewOrgCode('');
    setNewOrgLeader('');
    setNewOrgPhone('');
    setNewOrgRemarks('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) {
      alert('请填写姓名与用户名');
      return;
    }

    const newItem: OrgUserItem = {
      id: `ORGUSR-${Math.floor(100 + Math.random() * 900)}`,
      number: orgUsers.length + 1,
      fullName: newName,
      username: newUsername,
      passwordMasked: '••••••••',
      gender: newGender,
      systemRole: newRole,
      department: `${newSubOrg} / 运维保障组`,
      subOrg: newSubOrg,
      phone: newPhone || '139-8888-9999',
      email: newEmail || `${newUsername}@hologram.cn`,
      remarks: newRemarks || '新归入组织架构人员',
      joinDate: '2026-11-06',
    };

    setOrgUsers((prev) => [newItem, ...prev]);
    alert(`成功向 [${newSubOrg}] 添加人员: ${newName}`);
    setIsAddOpen(false);
    setNewName('');
    setNewUsername('');
    setNewPhone('');
    setNewEmail('');
    setNewRemarks('');
  };

  const openEditModal = (user: OrgUserItem) => {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditUsername(user.username);
    setEditGender(user.gender);
    setEditRole(user.systemRole);
    setEditSubOrg(user.subOrg);
    setEditPhone(user.phone);
    setEditEmail(user.email);
    setEditRemarks(user.remarks);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setOrgUsers((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              fullName: editName,
              username: editUsername,
              gender: editGender,
              systemRole: editRole,
              subOrg: editSubOrg,
              department: `${editSubOrg} / 运维保障科`,
              phone: editPhone,
              email: editEmail,
              remarks: editRemarks,
            }
          : u
      )
    );
    alert(`成功修改人员信息: ${editName}`);
    setEditingUser(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans text-xs">
      {/* Left Column: Organization Tree with realistic enterprise names */}
      <div className="w-full lg:w-64 shrink-0 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>组织列表</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsOrgAddOpen(true)}
              title="添加子组织"
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
            placeholder="请输入名称..."
            className="w-full pl-8 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-[11px]"
          />
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
        </div>

        {/* Tree View */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[70vh]">
          {/* Root: 集团总公司 */}
          <div className="space-y-0.5">
            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                setSelectedNode('集团总公司');
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                selectedNode === '集团总公司'
                  ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/60 font-medium'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => { e.stopPropagation(); setTreeExpanded(!treeExpanded); }}
                  className="cursor-pointer inline-flex items-center p-0.5 rounded hover:bg-slate-800"
                >
                  {treeExpanded ? <FolderOpen className="w-3.5 h-3.5 text-cyan-400" /> : <Folder className="w-3.5 h-3.5 text-slate-400" />}
                </span>
                <span>集团总公司</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400">
                {treeCounts['集团总公司'] || orgUsers.length}
              </span>
            </div>

            {/* Children: orgNodes */}
            {treeExpanded && (
              <div className="pl-6 space-y-1 border-l border-slate-800 ml-3 pt-1">
                {orgNodes.map((nodeName) => {
                  const isSelected = selectedNode === nodeName;
                  const count = treeCounts[nodeName] || 0;

                  return (
                    <button
                      key={nodeName}
                      onClick={() => {
                        setSelectedNode(nodeName);
                        setCurrentPage(1);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate">{nodeName}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-500">
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* All nodes option */}
          <button
            onClick={() => {
              setSelectedNode('ALL');
              setCurrentPage(1);
            }}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs mt-2 transition-colors cursor-pointer ${
              selectedNode === 'ALL'
                ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>全部组织节点</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-500">
              {orgUsers.length}
            </span>
          </button>
        </div>
      </div>

      {/* Right Column: Search Toolbar & Table */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Top Search Toolbar matching screenshot */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[320px]">
            {/* 请输入账户名或姓名 */}
            <div className="relative w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="请输入账户名或姓名"
                className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            </div>

            {/* 全部部门 Select */}
            <select
              value={deptFilter}
              onChange={(e) => {
                setDeptFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="全部部门">全部部门</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* 全部角色 Select */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="全部角色">全部角色</option>
              {roles.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* 搜索 Button */}
            <button
              onClick={() => setCurrentPage(1)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-900/30 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              搜索
            </button>
          </div>

          {/* Top Right Buttons: 新增人员, 移除人员 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-950/50 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              新增人员
            </button>
            <button
              onClick={() => alert('请勾选需要从当前组织移除的人员记录')}
              className="px-4 py-1.5 bg-rose-900/80 hover:bg-rose-800 text-white rounded-lg font-semibold transition-colors shadow-sm cursor-pointer border border-rose-700"
            >
              移除人员
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
                  <th className="py-3 px-3 min-w-[100px] border-r border-slate-800/80">姓名</th>
                  <th className="py-3 px-3 min-w-[110px] border-r border-slate-800/80 font-mono">用户名</th>
                  <th className="py-3 px-3 min-w-[100px] border-r border-slate-800/80 font-mono">登录密码</th>
                  <th className="py-3 px-3 w-16 text-center border-r border-slate-800/80">性别</th>
                  <th className="py-3 px-3 min-w-[120px] border-r border-slate-800/80">系统角色</th>
                  <th className="py-3 px-4 min-w-[160px] border-r border-slate-800/80">所属部门</th>
                  <th className="py-3 px-4 min-w-[130px] border-r border-slate-800/80 font-mono">手机号</th>
                  <th className="py-3 px-4 min-w-[180px] border-r border-slate-800/80 font-mono">email</th>
                  <th className="py-3 px-4 min-w-[180px] border-r border-slate-800/80">备注信息</th>
                  <th className="py-3 px-4 text-center min-w-[150px] sticky right-0 bg-slate-950 border-l border-slate-800 shadow-l">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-500 font-medium">
                      当前组织节点下暂无人员记录
                    </td>
                  </tr>
                ) : (
                  currentData.map((user, idx) => (
                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors group">
                      <td className="py-3 px-3 text-center font-mono text-cyan-400 font-semibold border-r border-slate-800/60">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-100 border-r border-slate-800/60 group-hover:text-cyan-300 transition-colors">
                        {user.fullName}
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-300 border-r border-slate-800/60">
                        {user.username}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 border-r border-slate-800/60">
                        {user.passwordMasked}
                      </td>
                      <td className="py-3 px-3 text-center border-r border-slate-800/60 text-slate-300">
                        {user.gender}
                      </td>
                      <td className="py-3 px-3 border-r border-slate-800/60">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                          {user.systemRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-200">
                        {user.department}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 border-r border-slate-800/60">
                        {user.phone}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400 border-r border-slate-800/60 truncate max-w-[180px]" title={user.email}>
                        {user.email}
                      </td>
                      <td className="py-3 px-4 text-slate-400 border-r border-slate-800/60 truncate max-w-[180px]" title={user.remarks}>
                        {user.remarks || '--'}
                      </td>
                      <td className="py-3 px-4 text-center sticky right-0 bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 shadow-l whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => openEditModal(user)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            修改
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setViewingUser(user)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            查看
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setDeletingUser(user)}
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
                共 <strong className="text-cyan-400 font-bold">{filteredUsers.length}</strong> 条记录
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
      {viewingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">组织人员详情 - {viewingUser.fullName}</h3>
              <button onClick={() => setViewingUser(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-[#001d33] border border-cyan-900/80">
                <div><span className="text-slate-400 block">姓名:</span><strong className="text-slate-100">{viewingUser.fullName}</strong></div>
                <div><span className="text-slate-400 block">用户名:</span><strong className="text-cyan-300 font-mono">{viewingUser.username}</strong></div>
                <div><span className="text-slate-400 block">性别:</span><strong className="text-slate-200">{viewingUser.gender}</strong></div>
                <div><span className="text-slate-400 block">系统角色:</span><strong className="text-cyan-400">{viewingUser.systemRole}</strong></div>
                <div><span className="text-slate-400 block">所属部门:</span><strong className="text-slate-200">{viewingUser.department}</strong></div>
                <div><span className="text-slate-400 block">手机号:</span><strong className="text-slate-200 font-mono">{viewingUser.phone}</strong></div>
                <div className="col-span-2"><span className="text-slate-400 block">电子邮箱 (email):</span><strong className="text-slate-200 font-mono">{viewingUser.email}</strong></div>
              </div>
              <div className="p-3.5 rounded bg-[#001d33] border border-cyan-900/80 space-y-1">
                <span className="text-slate-400 block font-semibold">备注信息:</span>
                <p className="text-slate-200 leading-relaxed">{viewingUser.remarks || '--'}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end">
              <button onClick={() => setViewingUser(null)} className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">修改组织人员信息 - {editingUser.fullName}</h3>
              <button onClick={() => setEditingUser(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>姓名:
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>用户名:
                  </label>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">性别:</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as '男' | '女')}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">系统角色:</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">归属子组织:</label>
                  <select
                    value={editSubOrg}
                    onChange={(e) => setEditSubOrg(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {orgNodes.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">手机号:</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">email:</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">备注信息:</label>
                <textarea
                  value={editRemarks}
                  onChange={(e) => setEditRemarks(e.target.value)}
                  rows={3}
                  className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded p-2.5 text-cyan-100 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/60">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
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
      {deletingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#002b49] border border-rose-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>确认从组织中移除人员</span>
              </div>
              <button onClick={() => setDeletingUser(null)} className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要将人员 <strong className="text-cyan-300 font-semibold">{deletingUser.fullName} ({deletingUser.username})</strong> 从当前组织节点中移除吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">所属组织:</span> {deletingUser.department}</div>
                <div><span className="text-slate-500">系统角色:</span> {deletingUser.systemRole}</div>
                <div><span className="text-slate-500">手机号:</span> {deletingUser.phone}</div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button onClick={() => setDeletingUser(null)} className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                取消
              </button>
              <button
                onClick={() => {
                  setOrgUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
                  alert(`已成功将 ${deletingUser.fullName} 从组织中移除`);
                  setDeletingUser(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                确定移除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">向组织节点添加新人员</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>姓名:
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="请输入真实姓名"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>用户名:
                  </label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="请输入登录用户名"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">性别:</label>
                  <select
                    value={newGender}
                    onChange={(e) => setNewGender(e.target.value as '男' | '女')}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">系统角色:</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">归属子组织:</label>
                  <select
                    value={newSubOrg}
                    onChange={(e) => setNewSubOrg(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {orgNodes.map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">手机号:</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">email:</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="请输入电子邮箱"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">备注信息:</label>
                <textarea
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="请输入备注信息..."
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

      {/* Add Organization Modal */}
      {isOrgAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">新增下级组织机构</h3>
              <button onClick={() => setIsOrgAddOpen(false)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleOrgCreateSubmit} className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>上级组织:
                  </label>
                  <input
                    type="text"
                    value="集团总公司"
                    disabled
                    className="flex-1 bg-[#001d33]/60 border border-cyan-900 rounded px-3 py-2 text-slate-400 font-mono cursor-not-allowed"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>组织名称:
                  </label>
                  <input
                    type="text"
                    value={newOrgName}
                    onChange={(e) => setNewOrgName(e.target.value)}
                    placeholder="请输入新组织/部门名称"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">组织编码:</label>
                  <input
                    type="text"
                    value={newOrgCode}
                    onChange={(e) => setNewOrgCode(e.target.value)}
                    placeholder="如: ORG-DEPT-05"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">负责人:</label>
                  <input
                    type="text"
                    value={newOrgLeader}
                    onChange={(e) => setNewOrgLeader(e.target.value)}
                    placeholder="请输入负责人姓名"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">联系电话:</label>
                  <input
                    type="text"
                    value={newOrgPhone}
                    onChange={(e) => setNewOrgPhone(e.target.value)}
                    placeholder="请输入联系电话"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">组织职责:</label>
                <textarea
                  value={newOrgRemarks}
                  onChange={(e) => setNewOrgRemarks(e.target.value)}
                  placeholder="请输入该组织职责或说明..."
                  rows={3}
                  className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded p-2.5 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/60">
                <button
                  type="button"
                  onClick={() => setIsOrgAddOpen(false)}
                  className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#0082c8] hover:bg-[#0092e0] text-white font-semibold shadow-md shadow-cyan-950/50 transition-colors cursor-pointer"
                >
                  确定新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
