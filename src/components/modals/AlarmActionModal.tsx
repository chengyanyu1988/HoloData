import React, { useState } from 'react';
import { X, AlertTriangle, ShieldCheck, Check, Send, ArrowRight } from 'lucide-react';
import { AlarmItem } from '../../types';

interface AlarmActionModalProps {
  alarm: AlarmItem | null;
  onClose: () => void;
  onAcknowledge: (id: string, note?: string) => void;
  onDispatchToWorkOrder: (alarm: AlarmItem) => void;
}

export const AlarmActionModal: React.FC<AlarmActionModalProps> = ({
  alarm,
  onClose,
  onAcknowledge,
  onDispatchToWorkOrder,
}) => {
  const [note, setNote] = useState('');

  if (!alarm) return null;

  const handleAcknowledge = () => {
    onAcknowledge(alarm.id, note || '已由值班工程师在线确认');
    onClose();
  };

  const handleDispatch = () => {
    onDispatchToWorkOrder(alarm);
    onClose();
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'major':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400 font-semibold">{alarm.id}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${getSeverityBadge(alarm.severity)}`}>
                {alarm.severity === 'critical' ? '致命 (P1)' : alarm.severity === 'major' ? '严重 (P2)' : '警告 (P3)'}
              </span>
              <span className="text-xs text-slate-400">· {alarm.sourceType}</span>
            </div>
            <h2 className="text-base font-bold text-slate-100">{alarm.title}</h2>
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
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">告警发生实体</span>
              <span className="font-mono text-slate-200 font-semibold">{alarm.sourceEntity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">触发监控指标</span>
              <span className="font-mono text-cyan-400">{alarm.metric}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">实时采样实测值</span>
              <span className="font-mono text-rose-400 font-bold">{alarm.triggerValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">告警判定规则阈值</span>
              <span className="font-mono text-slate-300">{alarm.threshold}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">首发触发时间</span>
              <span className="font-mono text-slate-400">{alarm.firstTriggeredAt}</span>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">处置确认备忘批注</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="可输入已通知现场值班、正在跟进或临时屏蔽原因..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Action Row */}
          <div className="p-3 rounded-lg bg-slate-800/40 border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-semibold block">需要现场物理或复杂协同处理？</span>
              <span className="text-slate-400 text-[11px]">可一键关联此告警生成现场故障流转工单</span>
            </div>
            <button
              onClick={handleDispatch}
              className="px-3 py-1.5 text-xs font-medium bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded transition-colors flex items-center gap-1.5 shrink-0"
            >
              一键转派工单
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleAcknowledge}
            className="px-4 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-semibold flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            确认已知晓 (Acknowledge)
          </button>
        </div>
      </div>
    </div>
  );
};
