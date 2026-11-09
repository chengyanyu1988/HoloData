import React, { useState } from 'react';
import { User, Plus, Search, ShieldCheck, Key, Lock, Unlock } from 'lucide-react';
import { UserAccount } from '../../types';

interface UserManagementViewProps {
  users: UserAccount[];
  onToggleUserStatus: (userId: string) => void;
  onResetMfa: (userId: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  onToggleUserStatus,
  onResetMfa,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((u) => {
    return (
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>用户账号与统一身份管理</span>
            <span className="text-xs font-normal text-slate-400">· 企业级 SSO 与多因子认证</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            管控大数据平台运维工程师、架构师与审计员账号生命周期、MFA 硬件密钥绑定与会话状态
          </p>
        </div>

        <button
          onClick={() => alert('已打开添加新用户向导')}
          className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          新增用户账号
        </button>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索用户名、姓名、部门或邮箱..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">用户名 / 账号 ID</th>
                <th className="py-3 px-4">真实姓名</th>
                <th className="py-3 px-4">所属部门</th>
                <th className="py-3 px-4">绑定平台角色</th>
                <th className="py-3 px-4">多因子认证 (MFA)</th>
                <th className="py-3 px-4">最近活跃登录</th>
                <th className="py-3 px-4">账号状态</th>
                <th className="py-3 px-4 text-right">安全控制</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-slate-200">
                    <div>{user.username}</div>
                    <div className="text-[10px] text-slate-500">{user.id}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-100">{user.fullName}</td>
                  <td className="py-3 px-4 text-slate-300">{user.department}</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">{user.role}</td>
                  <td className="py-3 px-4">
                    {user.mfaEnabled ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-mono text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        已使能 (FIDO2)
                      </span>
                    ) : (
                      <span className="text-amber-400 font-mono text-[11px]">未开启</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {user.lastLogin}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded border font-medium ${
                        user.status === 'active'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                      }`}
                    >
                      {user.status === 'active' ? '正常激活' : '已锁定'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onResetMfa(user.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
                        title="重置多因子认证令牌"
                      >
                        重置 MFA
                      </button>
                      <button
                        onClick={() => onToggleUserStatus(user.id)}
                        className={`p-1 rounded transition-colors ${
                          user.status === 'active'
                            ? 'bg-slate-800 text-slate-400 hover:text-rose-400'
                            : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                        }`}
                        title={user.status === 'active' ? '锁定账号' : '解除锁定'}
                      >
                        {user.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
