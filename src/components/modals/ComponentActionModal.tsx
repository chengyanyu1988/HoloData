import React, { useState } from 'react';
import { X, RefreshCw, AlertTriangle, Shield, CheckCircle, Terminal } from 'lucide-react';
import { SoftwareComponent } from '../../types';

interface ComponentActionModalProps {
  component: SoftwareComponent | null;
  onClose: () => void;
  onExecuteAction: (componentId: string, actionName: string) => void;
}

export const ComponentActionModal: React.FC<ComponentActionModalProps> = ({
  component,
  onClose,
  onExecuteAction,
}) => {
  const [selectedAction, setSelectedAction] = useState<string>('rolling_restart');
  const [inSafeMode, setInSafeMode] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [logOutput, setLogOutput] = useState<string[]>([]);

  if (!component) return null;

  const handleRun = () => {
    setIsExecuting(true);
    setLogOutput([`[${new Date().toLocaleTimeString()}] 准备下发指令: ${selectedAction} -> ${component.name}...`]);

    setTimeout(() => {
      setLogOutput((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 正在检查 Quorum 仲裁与集群存活节点状态 (OK)...`,
      ]);
    }, 400);

    setTimeout(() => {
      setLogOutput((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] 成功对 ${component.activeNodes} 个节点应用热更新操作配置！`,
      ]);
      setIsExecuting(false);
      onExecuteAction(component.id, selectedAction);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-semibold">{component.id}</span>
              <span className="text-xs text-slate-400">· {component.version}</span>
            </div>
            <h2 className="text-base font-bold text-slate-100">{component.name} 运维与控制指令</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">主控节点 (Leader)</span>
              <span className="font-mono text-slate-200">{component.leaderNode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">在线健康节点</span>
              <span className="font-mono text-emerald-400 font-bold">
                {component.activeNodes} / {component.totalNodes} Nodes 在线
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">JVM 堆内存使用</span>
              <span className="font-mono text-cyan-400">
                {component.jvmHeapUsedGB}G / {component.jvmHeapMaxGB}GB
              </span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-2">选择要执行的管理控制动作</label>
            <div className="space-y-2">
              {[
                { id: 'rolling_restart', label: '滚动式灰度平滑重启 (Rolling Restart)', desc: '按节点批次逐一优雅重启，零丢包无业务中断' },
                { id: 'reload_config', label: '动态重载组件配置文件 (Reload Conf)', desc: '无需重启 JVM，即时热加载 core-site.xml / hdfs-site.xml' },
                { id: 'dump_jstack', label: '收集各节点 JStack 线程栈与 GC 分析', desc: '用于排查 CPU 尖刺或慢查询停顿' },
                { id: 'toggle_safemode', label: '进入/退出只读维护模式 (Safe Mode)', desc: '限制外部写流量，仅允许只读及数据校验' },
              ].map((act) => (
                <label
                  key={act.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAction === act.id
                      ? 'border-cyan-500 bg-cyan-950/20 text-slate-200'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="component_act"
                    checked={selectedAction === act.id}
                    onChange={() => setSelectedAction(act.id)}
                    className="mt-0.5 text-cyan-500"
                  />
                  <div className="space-y-0.5">
                    <span className="font-semibold text-slate-200 block">{act.label}</span>
                    <span className="text-[11px] text-slate-400 block">{act.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {logOutput.length > 0 && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[11px] text-emerald-400 space-y-1">
              {logOutput.map((l, idx) => (
                <div key={idx}>{l}</div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            关闭
          </button>
          <button
            onClick={handleRun}
            disabled={isExecuting}
            className="px-4 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-900/20"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
            {isExecuting ? '指令正在执行中...' : '确认执行控制动作'}
          </button>
        </div>
      </div>
    </div>
  );
};
