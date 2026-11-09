import React, { useState, useMemo } from 'react';
import { ShieldCheck, Lock, Key, Globe, Search, Plus, ChevronLeft, ChevronRight, UserCheck, AlertTriangle } from 'lucide-react';

export interface HostAccountItem {
  id: string;
  number: number;
  hostName: string;
  managementIp: string;
  osType: 'Linux' | 'Windows' | 'BMC/IPMI' | 'Kubernetes';
  accountName: string;
  createdAt: string;
  updater: string;
  updatedAt: string;
  description: string;
}

const INITIAL_HOST_ACCOUNTS: HostAccountItem[] = [
  {
    id: 'ACC-001',
    number: 1,
    hostName: 'gpu-cluster-node-01',
    managementIp: '10.120.99.15',
    osType: 'Linux',
    accountName: 'admin',
    createdAt: '2026-11-01 09:00:00',
    updater: '程总工',
    updatedAt: '2026-11-06 12:12:20',
    description: 'H800 算力节点 root 运维管理账号',
  },
  {
    id: 'ACC-002',
    number: 2,
    hostName: 'storage-nas-02',
    managementIp: '10.120.98.22',
    osType: 'Windows',
    accountName: 'administrator',
    createdAt: '2026-11-02 10:15:00',
    updater: '李健',
    updatedAt: '2026-11-06 11:30:15',
    description: 'Windows 存储网关域控管理员账户',
  },
  {
    id: 'ACC-003',
    number: 3,
    hostName: 'k8s-master-01',
    managementIp: '10.120.99.10',
    osType: 'Linux',
    accountName: 'root',
    createdAt: '2026-11-02 14:20:00',
    updater: '赵敏',
    updatedAt: '2026-11-05 16:40:10',
    description: 'Kubernetes 控制平面集群主节点超级账号',
  },
  {
    id: 'ACC-004',
    number: 4,
    hostName: 'db-pg-replica-03',
    managementIp: '10.120.99.40',
    osType: 'Linux',
    accountName: 'postgres',
    createdAt: '2026-11-03 08:30:00',
    updater: '郑秀',
    updatedAt: '2026-11-05 09:20:00',
    description: 'PostgreSQL 16 数据库实例管理账号',
  },
  {
    id: 'ACC-005',
    number: 5,
    hostName: 'switch-spine-01',
    managementIp: '10.120.254.1',
    osType: 'BMC/IPMI',
    accountName: 'sysop',
    createdAt: '2026-11-03 11:00:00',
    updater: '吴刚',
    updatedAt: '2026-11-04 15:10:00',
    description: '400G Spine 核心交换机带外网管账号',
  },
  {
    id: 'ACC-006',
    number: 6,
    hostName: 'clickhouse-lake-01',
    managementIp: '10.120.98.55',
    osType: 'Linux',
    accountName: 'default',
    createdAt: '2026-11-04 13:40:00',
    updater: '王芳',
    updatedAt: '2026-11-04 18:20:00',
    description: 'ClickHouse 数据湖分布式分析管理员账号',
  },
  {
    id: 'ACC-007',
    number: 7,
    hostName: 'gateway-nginx-01',
    managementIp: '10.120.99.88',
    osType: 'Linux',
    accountName: 'admin',
    createdAt: '2026-11-04 16:00:00',
    updater: '黄蓉',
    updatedAt: '2026-11-03 14:00:00',
    description: 'API 网关反向代理控制台管理员账号',
  },
  {
    id: 'ACC-008',
    number: 8,
    hostName: 'server-dell-r760',
    managementIp: '10.120.99.100',
    osType: 'BMC/IPMI',
    accountName: 'root',
    createdAt: '2026-11-05 09:10:00',
    updater: '李健',
    updatedAt: '2026-11-03 10:00:00',
    description: 'Dell iDRAC 带外控制器管理账号',
  },
];

export const AccountManagementView: React.FC = () => {
  const [accountsList, setAccountsList] = useState<HostAccountItem[]>(INITIAL_HOST_ACCOUNTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jumpPage, setJumpPage] = useState('');
  const pageSize = 10;

  // Modals
  const [viewingAcc, setViewingAcc] = useState<HostAccountItem | null>(null);
  const [editingAcc, setEditingAcc] = useState<HostAccountItem | null>(null);
  const [deletingAcc, setDeletingAcc] = useState<HostAccountItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New account form state
  const [newHostName, setNewHostName] = useState('');
  const [newManagementIp, setNewManagementIp] = useState('');
  const [newOsType, setNewOsType] = useState<'Linux' | 'Windows' | 'BMC/IPMI' | 'Kubernetes'>('Linux');
  const [newAccountName, setNewAccountName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Edit account form state
  const [editHostName, setEditHostName] = useState('');
  const [editManagementIp, setEditManagementIp] = useState('');
  const [editOsType, setEditOsType] = useState<'Linux' | 'Windows' | 'BMC/IPMI' | 'Kubernetes'>('Linux');
  const [editAccountName, setEditAccountName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const filteredAccounts = useMemo(() => {
    return accountsList.filter(
      (a) =>
        a.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.managementIp.includes(searchTerm)
    );
  }, [accountsList, searchTerm]);

  const totalPages = Math.ceil(filteredAccounts.length / pageSize) || 1;
  const currentData = filteredAccounts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
    if (!newHostName.trim() || !newAccountName.trim()) {
      alert('请填写主机名与账户名');
      return;
    }

    const newItem: HostAccountItem = {
      id: `ACC-${Math.floor(100 + Math.random() * 900)}`,
      number: accountsList.length + 1,
      hostName: newHostName,
      managementIp: newManagementIp || '10.120.99.128',
      osType: newOsType,
      accountName: newAccountName,
      createdAt: '2026-11-06 16:30:00',
      updater: '程总工',
      updatedAt: '2026-11-06 16:30:00',
      description: newDescription || '新增主机运维管理凭据账号',
    };

    setAccountsList((prev) => [newItem, ...prev]);
    alert(`成功新增主机账户: ${newAccountName} (${newHostName})`);
    setIsAddOpen(false);
    setNewHostName('');
    setNewManagementIp('');
    setNewAccountName('');
    setNewDescription('');
  };

  const openEditModal = (acc: HostAccountItem) => {
    setEditingAcc(acc);
    setEditHostName(acc.hostName);
    setEditManagementIp(acc.managementIp);
    setEditOsType(acc.osType);
    setEditAccountName(acc.accountName);
    setEditDescription(acc.description);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAcc) return;
    setAccountsList((prev) =>
      prev.map((a) =>
        a.id === editingAcc.id
          ? {
              ...a,
              hostName: editHostName,
              managementIp: editManagementIp,
              osType: editOsType,
              accountName: editAccountName,
              description: editDescription,
              updater: '程总工',
              updatedAt: '2026-11-06 16:45:00',
            }
          : a
      )
    );
    alert(`成功修改主机账户: ${editAccountName}`);
    setEditingAcc(null);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Header & Filter Toolbar matching screenshot image_fd219f19.png */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[320px]">
          {/* 请输入账户名称 */}
          <div className="relative w-64">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="请输入账户名称"
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

        {/* 新增 Button Top Right */}
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-950/50 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          新增
        </button>
      </div>

      {/* Data Table matching screenshot columns: 编号, 主机名, 管理IP, 类型, 账户名, 产生时间, 更新人, 更新时间, 操作 */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                <th className="py-3 px-3 w-16 text-center border-r border-slate-800/80 font-mono">编号</th>
                <th className="py-3 px-4 min-w-[160px] border-r border-slate-800/80">主机名</th>
                <th className="py-3 px-4 min-w-[140px] border-r border-slate-800/80 font-mono">管理IP</th>
                <th className="py-3 px-3 min-w-[100px] border-r border-slate-800/80 text-center">类型</th>
                <th className="py-3 px-4 min-w-[130px] border-r border-slate-800/80 font-mono">账户名</th>
                <th className="py-3 px-4 min-w-[170px] border-r border-slate-800/80 font-mono">产生时间</th>
                <th className="py-3 px-4 min-w-[110px] border-r border-slate-800/80">更新人</th>
                <th className="py-3 px-4 min-w-[170px] border-r border-slate-800/80 font-mono">更新时间</th>
                <th className="py-3 px-4 text-center min-w-[150px] sticky right-0 bg-slate-950 border-l border-slate-800 shadow-l">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                    没有找到匹配的账户凭据记录
                  </td>
                </tr>
              ) : (
                currentData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-800/50 transition-colors group">
                    <td className="py-3 px-3 text-center font-mono text-cyan-400 font-semibold border-r border-slate-800/60">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100 border-r border-slate-800/60 group-hover:text-cyan-300 transition-colors font-mono">
                      {item.hostName}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-300 border-r border-slate-800/60">
                      {item.managementIp}
                    </td>
                    <td className="py-3 px-3 text-center border-r border-slate-800/60">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                        {item.osType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-100 border-r border-slate-800/60">
                      {item.accountName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 border-r border-slate-800/60">
                      {item.createdAt}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200 border-r border-slate-800/60">
                      {item.updater}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 border-r border-slate-800/60">
                      {item.updatedAt}
                    </td>
                    <td className="py-3 px-4 text-center sticky right-0 bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 shadow-l whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2 font-medium">
                        <button
                          onClick={() => openEditModal(item)}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                        >
                          修改
                        </button>
                        <span className="text-slate-700">|</span>
                        <button
                          onClick={() => setViewingAcc(item)}
                          className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                        >
                          查看
                        </button>
                        <span className="text-slate-700">|</span>
                        <button
                          onClick={() => setDeletingAcc(item)}
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
              共 <strong className="text-cyan-400 font-bold">{filteredAccounts.length}</strong> 条记录
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
      {viewingAcc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">主机账户凭据详情 - {viewingAcc.hostName}</h3>
              <button onClick={() => setViewingAcc(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded bg-[#001d33] border border-cyan-900/80">
                <div><span className="text-slate-400 block">主机名:</span><strong className="text-slate-100 font-mono">{viewingAcc.hostName}</strong></div>
                <div><span className="text-slate-400 block">管理 IP:</span><strong className="text-cyan-300 font-mono">{viewingAcc.managementIp}</strong></div>
                <div><span className="text-slate-400 block">操作系统类型:</span><strong className="text-cyan-400">{viewingAcc.osType}</strong></div>
                <div><span className="text-slate-400 block">账户名:</span><strong className="text-slate-200 font-mono">{viewingAcc.accountName}</strong></div>
                <div><span className="text-slate-400 block">产生时间:</span><strong className="text-slate-300 font-mono">{viewingAcc.createdAt}</strong></div>
                <div><span className="text-slate-400 block">更新人:</span><strong className="text-slate-200">{viewingAcc.updater}</strong></div>
                <div className="col-span-2"><span className="text-slate-400 block">更新时间:</span><strong className="text-slate-300 font-mono">{viewingAcc.updatedAt}</strong></div>
              </div>
              <div className="p-3.5 rounded bg-[#001d33] border border-cyan-900/80 space-y-1">
                <span className="text-slate-400 block font-semibold">凭据说明:</span>
                <p className="text-slate-200 leading-relaxed">{viewingAcc.description || '--'}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end">
              <button onClick={() => setViewingAcc(null)} className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {editingAcc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">修改主机账户凭据 - {editingAcc.hostName}</h3>
              <button onClick={() => setEditingAcc(null)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>主机名:
                  </label>
                  <input
                    type="text"
                    value={editHostName}
                    onChange={(e) => setEditHostName(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">管理 IP:</label>
                  <input
                    type="text"
                    value={editManagementIp}
                    onChange={(e) => setEditManagementIp(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">操作系统类型:</label>
                  <select
                    value={editOsType}
                    onChange={(e) => setEditOsType(e.target.value as any)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Linux">Linux</option>
                    <option value="Windows">Windows</option>
                    <option value="BMC/IPMI">BMC/IPMI</option>
                    <option value="Kubernetes">Kubernetes</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>账户名:
                  </label>
                  <input
                    type="text"
                    value={editAccountName}
                    onChange={(e) => setEditAccountName(e.target.value)}
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">凭据说明:</label>
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
                  onClick={() => setEditingAcc(null)}
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
      {deletingAcc && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#002b49] border border-rose-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>确认删除主机账户凭据</span>
              </div>
              <button onClick={() => setDeletingAcc(null)} className="text-slate-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要删除主机 <strong className="text-cyan-300 font-semibold">{deletingAcc.hostName} ({deletingAcc.accountName})</strong> 的凭据记录吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">管理 IP:</span> {deletingAcc.managementIp}</div>
                <div><span className="text-slate-500">操作系统:</span> {deletingAcc.osType}</div>
                <div><span className="text-slate-500">更新人:</span> {deletingAcc.updater}</div>
              </div>
            </div>

            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button onClick={() => setDeletingAcc(null)} className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 cursor-pointer">
                取消
              </button>
              <button
                onClick={() => {
                  setAccountsList((prev) => prev.filter((a) => a.id !== deletingAcc.id));
                  alert(`已成功删除主机账户凭据: ${deletingAcc.accountName} (${deletingAcc.hostName})`);
                  setDeletingAcc(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 cursor-pointer"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm">新增主机运维账户凭据</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-cyan-400 hover:text-white font-bold p-1 cursor-pointer">
                X
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>主机名:
                  </label>
                  <input
                    type="text"
                    value={newHostName}
                    onChange={(e) => setNewHostName(e.target.value)}
                    placeholder="请输入主机名"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">管理 IP:</label>
                  <input
                    type="text"
                    value={newManagementIp}
                    onChange={(e) => setNewManagementIp(e.target.value)}
                    placeholder="如: 10.120.99.15"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">操作系统类型:</label>
                  <select
                    value={newOsType}
                    onChange={(e) => setNewOsType(e.target.value as any)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Linux">Linux</option>
                    <option value="Windows">Windows</option>
                    <option value="BMC/IPMI">BMC/IPMI</option>
                    <option value="Kubernetes">Kubernetes</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>账户名:
                  </label>
                  <input
                    type="text"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                    placeholder="如: root / admin"
                    required
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">凭据说明:</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="请输入该主机账户的权限说明..."
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
