import React, { useState } from 'react';
import { Activity, ShieldAlert, Search, Filter, Terminal, CheckCircle2, XCircle } from 'lucide-react';
import { AuditLog } from '../../types';

interface AuditLogViewProps {
  logs: AuditLog[];
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesType = typeFilter === 'all' || log.actionType === typeFilter;
    const matchesSearch =
      log.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.operatorIp.includes(searchTerm);
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>操作与安全合规审计日志</span>
            <span className="text-xs font-normal text-slate-400">· 防篡改全链路审计追踪</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            记录集群内部所有权限变更、敏感配置下发、远程主机登录与执行指令操作流水
          </p>
        </div>

        <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400">
          审计流水存证校验: 签名合法 (WORM 写入一次防篡改)
        </span>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索操作人、目标资源或源 IP 地址..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">动作指令分类:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">全部类型</option>
            <option value="LOGIN">LOGIN 登录接入</option>
            <option value="CONFIG_CHANGE">CONFIG_CHANGE 配置热更新</option>
            <option value="PERM_GRANT">PERM_GRANT 授权审批</option>
            <option value="WORK_ORDER">WORK_ORDER 工单处置</option>
            <option value="RESTART">RESTART 滚动重启</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">审计流水编号</th>
                <th className="py-3 px-4">执行时间戳</th>
                <th className="py-3 px-4">操作人身份</th>
                <th className="py-3 px-4">客户端源 IP</th>
                <th className="py-3 px-4">操作类型</th>
                <th className="py-3 px-4">目标受控资源</th>
                <th className="py-3 px-4">操作结果</th>
                <th className="py-3 px-4">行为详情</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                    {log.id}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-200">{log.operator}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{log.operatorIp}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                      {log.actionType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-200">{log.targetResource}</td>
                  <td className="py-3 px-4 font-mono">
                    {log.status === 'SUCCESS' ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        SUCCESS
                      </span>
                    ) : log.status === 'DENIED' ? (
                      <span className="text-rose-400 font-bold flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        DENIED
                      </span>
                    ) : (
                      <span className="text-amber-400 font-semibold">FAILED</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                    {log.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diff Inspector Modal if Selected */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-400 font-semibold">{selectedLog.id}</span>
                <span className="font-bold text-slate-100">审计明细快照</span>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                关闭
              </button>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">执行人:</span>
                <span className="text-slate-200">{selectedLog.operator} ({selectedLog.operatorIp})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">发生时间:</span>
                <span className="text-slate-200">{selectedLog.timestamp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">资源目标:</span>
                <span className="text-cyan-400">{selectedLog.targetResource}</span>
              </div>
              <div className="p-3 rounded bg-slate-950 border border-slate-800 text-slate-300">
                {selectedLog.detail}
              </div>

              {selectedLog.diffJson && (
                <div className="space-y-1">
                  <span className="text-slate-400 block font-sans font-semibold">配置变更前后差异 (Diff JSON):</span>
                  <pre className="p-3 rounded bg-slate-950 border border-slate-800 text-emerald-400 overflow-x-auto text-[11px]">
                    {selectedLog.diffJson}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
