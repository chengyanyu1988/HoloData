import React, { useState } from 'react';
import { ShieldCheck, Plus, Check, X, Lock } from 'lucide-react';
import { RolePermission } from '../../types';

interface RolePermissionViewProps {
  roles: RolePermission[];
}

export const RolePermissionView: React.FC<RolePermissionViewProps> = ({ roles }) => {
  const [selectedRoleId, setSelectedRoleId] = useState<string>(roles[0]?.id || 'ROLE-01');

  const activeRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>角色与权限矩阵授权 (RBAC)</span>
            <span className="text-xs font-normal text-slate-400">· 细粒度资源操作管控</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            采用最小特权原则，对硬件设施、大数据计算作业、安全审计与全局内核参数进行四维权限隔离
          </p>
        </div>

        <button
          onClick={() => alert('已开启新建自定义角色模板')}
          className="px-3 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          创建新角色
        </button>
      </div>

      {/* Role Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {roles.map((r) => (
          <button
            key={r.id}
            onClick={() => setSelectedRoleId(r.id)}
            className={`p-3.5 rounded-xl border text-left transition-all ${
              selectedRoleId === r.id
                ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-950/20'
                : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-cyan-400 font-semibold">{r.id}</span>
              <span className="text-[11px] text-slate-400 font-mono">{r.userCount} 位成员</span>
            </div>
            <div className="font-bold text-xs text-slate-200">{r.name}</div>
          </button>
        ))}
      </div>

      {/* Permissions Matrix Table */}
      <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">{activeRole.name} 权限分配详情</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeRole.description}</p>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
            已分配 {activeRole.userCount} 名用户
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">系统功能与资源分类</th>
                <th className="py-3 px-4 text-center">查看与遥测读权限 (Read)</th>
                <th className="py-3 px-4 text-center">配置与参数写权限 (Write)</th>
                <th className="py-3 px-4 text-center">指令下发与重启 (Execute)</th>
                <th className="py-3 px-4 text-center">实例销毁与删除 (Delete)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {activeRole.permissions.map((perm, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {perm.category}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.read ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.write ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.execute ? (
                      <span className="inline-flex p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {perm.delete ? (
                      <span className="inline-flex p-1 rounded-full bg-rose-500/10 text-rose-400">
                        <Check className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="inline-flex p-1 rounded-full bg-slate-800 text-slate-600">
                        <X className="w-4 h-4" />
                      </span>
                    )}
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
