import React, { useState, useMemo } from 'react';
import { User, Plus, Search, ShieldCheck, Mail, Phone, Building2, Briefcase, ChevronLeft, ChevronRight, X, AlertTriangle, Key } from 'lucide-react';

export interface PersonnelUserItem {
  id: string;
  number: number;
  fullName: string;
  username: string;
  passwordMasked: string;
  gender: '男' | '女';
  systemRole: string;
  department: string;
  phone: string;
  email: string;
  remarks: string;
  joinDate: string;
}

const INITIAL_PERSONNEL_USERS: PersonnelUserItem[] = [
  {
    id: 'USR-01',
    number: 1,
    fullName: '程总工',
    username: 'chengyu',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '超级管理员',
    department: '全息数据基础设施处',
    phone: '138-1029-8801',
    email: 'chengyanyu@hologram.cn',
    remarks: '全域算力集群架构总负责，MFA 已双向绑定',
    joinDate: '2026-11-01',
  },
  {
    id: 'USR-02',
    number: 2,
    fullName: '李健',
    username: 'lijian',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '系统管理员',
    department: '运维工程处',
    phone: '139-0123-4567',
    email: 'lijian@hologram.cn',
    remarks: '负责硬件巡检、带外 BMC 及服务器固件热升级',
    joinDate: '2026-11-02',
  },
  {
    id: 'USR-03',
    number: 3,
    fullName: '张伟',
    username: 'zhangwei',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '安全审计员',
    department: '网络安全部',
    phone: '137-8899-1122',
    email: 'zhangwei@hologram.cn',
    remarks: '负责等保合规、全链路审计日志与入侵防护',
    joinDate: '2026-11-02',
  },
  {
    id: 'USR-04',
    number: 4,
    fullName: '王芳',
    username: 'wangfang',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '高级运维员',
    department: '架构设计部',
    phone: '136-5544-3322',
    email: 'wangfang@hologram.cn',
    remarks: '负责大数据 Lakehouse 与 ClickHouse 存储优化',
    joinDate: '2026-11-03',
  },
  {
    id: 'USR-05',
    number: 5,
    fullName: '陈明',
    username: 'chenming',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '运维工程师',
    department: '算力调度部',
    phone: '135-2233-4455',
    email: 'chenming@hologram.cn',
    remarks: '负责 AI H800 / A800 智算集群算力调度',
    joinDate: '2026-11-03',
  },
  {
    id: 'USR-06',
    number: 6,
    fullName: '赵敏',
    username: 'zhaomin',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '系统管理员',
    department: '云平台研发部',
    phone: '138-7766-5544',
    email: 'zhaomin@hologram.cn',
    remarks: '负责 Kubernetes v1.30 容器集群与 Cilium CNI 运维',
    joinDate: '2026-11-04',
  },
  {
    id: 'USR-07',
    number: 7,
    fullName: '孙杰',
    username: 'sunjie',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '普通运维员',
    department: '运维工程处',
    phone: '139-4455-6677',
    email: 'sunjie@hologram.cn',
    remarks: '负责工业 RFID 读写器驻波比校准与现场布线',
    joinDate: '2026-11-04',
  },
  {
    id: 'USR-08',
    number: 8,
    fullName: '周涛',
    username: 'zhoutao',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '安全审计员',
    department: '网络安全部',
    phone: '137-1122-3344',
    email: 'zhoutao@hologram.cn',
    remarks: '负责防火墙策略巡检与安全事件防范',
    joinDate: '2026-11-05',
  },
  {
    id: 'USR-09',
    number: 9,
    fullName: '吴强',
    username: 'wuqiang',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '普通运维员',
    department: '全息数据基础设施处',
    phone: '136-9988-7766',
    email: 'wuqiang@hologram.cn',
    remarks: '负责 NVMe-oF 存储阵列巡检与坏道监控',
    joinDate: '2026-11-05',
  },
  {
    id: 'USR-10',
    number: 10,
    fullName: '郑秀',
    username: 'zhengxiu',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '数据库管理员',
    department: '架构设计部',
    phone: '135-8877-6655',
    email: 'zhengxiu@hologram.cn',
    remarks: '负责 PostgreSQL 16 主备复制与慢 SQL 治理',
    joinDate: '2026-11-05',
  },
  {
    id: 'USR-11',
    number: 11,
    fullName: '刘磊',
    username: 'liulei',
    passwordMasked: '••••••••',
    gender: '男',
    systemRole: '运维工程师',
    department: '算力调度部',
    phone: '138-6655-4433',
    email: 'liulei@hologram.cn',
    remarks: '负责 GPU 节点 NVLink 拓扑连通性测试',
    joinDate: '2026-11-06',
  },
  {
    id: 'USR-12',
    number: 12,
    fullName: '黄蓉',
    username: 'huangrong',
    passwordMasked: '••••••••',
    gender: '女',
    systemRole: '高级运维员',
    department: '云平台研发部',
    phone: '139-2211-0099',
    email: 'huangrong@hologram.cn',
    remarks: '负责 CI/CD 自动化流水线发布与版本割接',
    joinDate: '2026-11-06',
  },
];

export const PersonnelManagementView: React.FC = () => {
  const [usersList, setUsersList] = useState<PersonnelUserItem[]>(INITIAL_PERSONNEL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('全部部门');
  const [roleFilter, setRoleFilter] = useState('全部角色');
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');

  // Modals
  const [viewingUser, setViewingUser] = useState<PersonnelUserItem | null>(null);
  const [editingUser, setEditingUser] = useState<PersonnelUserItem | null>(null);
  const [deletingUser, setDeletingUser] = useState<PersonnelUserItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editGender, setEditGender] = useState<'男' | '女'>('男');
  const [editRole, setEditRole] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRemarks, setEditRemarks] = useState('');

  // New user form state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newGender, setNewGender] = useState<'男' | '女'>('男');
  const [newRole, setNewRole] = useState('系统管理员');
  const [newDept, setNewDept] = useState('运维工程处');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRemarks, setNewRemarks] = useState('');

  const pageSize = 10;

  const departments = Array.from(new Set(usersList.map((u) => u.department)));
  const roles = Array.from(new Set(usersList.map((u) => u.systemRole)));

  const filtered = useMemo(() => {
    return usersList.filter((item) => {
      const matchSearch =
        item.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.phone.includes(searchTerm) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDept = deptFilter === '全部部门' || item.department === deptFilter;
      const matchRole = roleFilter === '全部角色' || item.systemRole === roleFilter;

      return matchSearch && matchDept && matchRole;
    });
  }, [usersList, searchTerm, deptFilter, roleFilter]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    if (!newName.trim() || !newUsername.trim()) {
      alert('请填写姓名与用户名');
      return;
    }

    const newItem: PersonnelUserItem = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      number: usersList.length + 1,
      fullName: newName,
      username: newUsername,
      passwordMasked: '••••••••',
      gender: newGender,
      systemRole: newRole,
      department: newDept,
      phone: newPhone || '138-0000-0000',
      email: newEmail || `${newUsername}@hologram.cn`,
      remarks: newRemarks || '新登记运维人员档案',
      joinDate: '2026-11-06',
    };

    setUsersList((prev) => [newItem, ...prev]);
    alert(`成功创建人员账号: ${newName} (${newUsername})`);
    setIsAddOpen(false);
    setNewName('');
    setNewUsername('');
    setNewPhone('');
    setNewEmail('');
    setNewRemarks('');
  };

  const openEditModal = (user: PersonnelUserItem) => {
    setEditingUser(user);
    setEditName(user.fullName);
    setEditUsername(user.username);
    setEditGender(user.gender);
    setEditRole(user.systemRole);
    setEditDept(user.department);
    setEditPhone(user.phone);
    setEditEmail(user.email);
    setEditRemarks(user.remarks);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === editingUser.id
          ? {
              ...u,
              fullName: editName,
              username: editUsername,
              gender: editGender,
              systemRole: editRole,
              department: editDept,
              phone: editPhone,
              email: editEmail,
              remarks: editRemarks,
            }
          : u
      )
    );
    alert(`成功修改人员档案: ${editName}`);
    setEditingUser(null);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header & Filter Toolbar matching user screenshot requirement */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[320px]">
          {/* Search Input: 请输入用户名或姓名 */}
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="请输入用户名或姓名"
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
              <option key={d} value={d}>
                {d}
              </option>
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
              <option key={r} value={r}>
                {r}
              </option>
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

        {/* 新增 Button Top Right */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-950/50 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          新增
        </button>
      </div>

      {/* Table matching screenshot columns: 编号, 姓名, 用户名, 登录密码, 性别, 系统角色, 所属部门, 手机号, email, 备注信息, 操作 */}
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
                    没有找到匹配的人员档案记录
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

        {/* Pagination matching screenshot and strict 10 items/page */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              共 <strong className="text-cyan-400 font-bold">{filtered.length}</strong> 条记录
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

      {/* View Detail Modal */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">人员档案详情 - {viewingUser.fullName}</h3>
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
              <h3 className="font-bold text-cyan-300 text-sm">修改运维人员档案 - {editingUser.fullName}</h3>
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
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">所属部门:</label>
                  <select
                    value={editDept}
                    onChange={(e) => setEditDept(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
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
                <span>确认删除人员档案</span>
              </div>
              <button onClick={() => setDeletingUser(null)} className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要彻底删除运维人员 <strong className="text-cyan-300 font-semibold">{deletingUser.fullName} ({deletingUser.username})</strong> 吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">所属部门:</span> {deletingUser.department}</div>
                <div><span className="text-slate-500">系统角色:</span> {deletingUser.systemRole}</div>
                <div><span className="text-slate-500">手机号:</span> {deletingUser.phone}</div>
              </div>
              <p className="text-rose-400/90 text-[11px] font-medium">
                ⚠️ 注意：此操作不可撤销，删除后该用户将失去系统登录权限！
              </p>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button onClick={() => setDeletingUser(null)} className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                取消
              </button>
              <button
                onClick={() => {
                  setUsersList((prev) => prev.filter((u) => u.id !== deletingUser.id));
                  alert(`已成功删除人员账号: ${deletingUser.fullName}`);
                  setDeletingUser(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                确定删除
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
              <h3 className="font-bold text-cyan-300 text-sm">新增运维人员档案</h3>
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
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">所属部门:</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>{d}</option>
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
    </div>
  );
};
