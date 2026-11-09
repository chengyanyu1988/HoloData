import React, { useState } from 'react';
import { Sliders, RefreshCw, CheckCircle2, RotateCcw, Edit2, AlertCircle } from 'lucide-react';
import { ClusterConfigParam } from '../../types';

interface ClusterConfigViewProps {
  params: ClusterConfigParam[];
  onUpdateParam: (id: string, newVal: string) => void;
}

export const ClusterConfigView: React.FC<ClusterConfigViewProps> = ({
  params,
  onUpdateParam,
}) => {
  const [editingParam, setEditingParam] = useState<ClusterConfigParam | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (param: ClusterConfigParam) => {
    setEditingParam(param);
    setEditValue(param.currentValue);
  };

  const handleSave = () => {
    if (!editingParam) return;
    onUpdateParam(editingParam.id, editValue);
    setEditingParam(null);
  };

  const handleRollback = (param: ClusterConfigParam) => {
    onUpdateParam(param.id, param.defaultValue);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>集群全局参数与内核热调优</span>
            <span className="text-xs font-normal text-slate-400">· 动态下发与版本回滚</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            统一维护 HDFS 副本策略、YARN 资源配比、Flink 状态托管与 ClickHouse 并发池，支持秒级热生效
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
          配置中心动态同步服务: 在线监听中 (Consul / ZK)
        </span>
      </div>

      {/* Params Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">组件归属</th>
                <th className="py-3 px-4">配置参数键名 (Key)</th>
                <th className="py-3 px-4">当前生效实测值</th>
                <th className="py-3 px-4">系统默认出厂值</th>
                <th className="py-3 px-4">生效机制</th>
                <th className="py-3 px-4">最近修改人</th>
                <th className="py-3 px-4">参数功能语义说明</th>
                <th className="py-3 px-4 text-right">调优操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {params.map((param) => {
                const isModified = param.currentValue !== param.defaultValue;
                return (
                  <tr key={param.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-300">
                      {param.component}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {param.paramKey}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-100 font-bold tabular-nums">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                        {param.currentValue} {param.unit || ''}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                      {param.defaultValue} {param.unit || ''}
                    </td>
                    <td className="py-3 px-4">
                      {param.dynamicApply ? (
                        <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          动态热生效 (无需重启)
                        </span>
                      ) : (
                        <span className="text-amber-400 font-mono text-[11px]">
                          需平滑滚动重启生效
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      <div>{param.lastModifiedBy}</div>
                      <div className="text-slate-500">{param.lastModifiedTime.slice(0, 10)}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-xs">
                      {param.description}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(param)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-200 font-medium transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          修改
                        </button>
                        {isModified && (
                          <button
                            onClick={() => handleRollback(param)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
                            title="恢复出厂默认值"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingParam && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100">修改配置参数</h3>
              <button
                onClick={() => setEditingParam(null)}
                className="text-slate-400 hover:text-slate-100"
              >
                取消
              </button>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <span className="text-slate-500 block text-[11px]">参数键名 (Key)</span>
                <span className="text-cyan-400 font-bold block">{editingParam.paramKey}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">说明</span>
                <span className="text-slate-300 font-sans block">{editingParam.description}</span>
              </div>
              <div>
                <label className="text-slate-400 block text-[11px] mb-1 font-sans font-semibold">
                  输入新数值:
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingParam(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-sm"
              >
                保存并热生效
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
