import React, { useState } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, User, Calendar, FileText, Send } from 'lucide-react';
import { WorkOrder } from '../../types';

interface WorkOrderDetailModalProps {
  workOrder: WorkOrder | null;
  onClose: () => void;
  onUpdateStatus?: (id: string, newStatus: WorkOrder['status'], comment: string) => void;
}

export const WorkOrderDetailModal: React.FC<WorkOrderDetailModalProps> = ({
  workOrder,
  onClose,
  onUpdateStatus,
}) => {
  const [commentInput, setCommentInput] = useState('');

  if (!workOrder) return null;

  const handleAction = (status: WorkOrder['status']) => {
    if (!commentInput.trim() && status === 'resolved') {
      alert('请填写闭环处置说明');
      return;
    }
    if (onUpdateStatus) {
      onUpdateStatus(workOrder.id, status, commentInput || '状态更新处理');
      setCommentInput('');
      onClose();
    }
  };

  const getPriorityStyle = (priority: string) => {
    if (priority.startsWith('P1')) return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
    if (priority.startsWith('P2')) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-start justify-between bg-slate-900/90">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-400 font-semibold">{workOrder.id}</span>
              <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${getPriorityStyle(workOrder.priority)}`}>
                {workOrder.priority}
              </span>
              <span className="text-xs text-slate-400">· {workOrder.type}</span>
            </div>
            <h2 className="text-base font-bold text-slate-100">{workOrder.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-800">
            <div>
              <span className="text-slate-500 block">申请人员</span>
              <span className="text-slate-200 font-medium">{workOrder.applicant}</span>
            </div>
            <div>
              <span className="text-slate-500 block">所属部门</span>
              <span className="text-slate-200 font-medium">{workOrder.applicantDept}</span>
            </div>
            <div>
              <span className="text-slate-500 block">当前处理人</span>
              <span className="text-slate-200 font-medium">{workOrder.assignee}</span>
            </div>
            <div>
              <span className="text-slate-500 block">SLA 履约期限</span>
              <span className="text-rose-400 font-medium font-mono">{workOrder.dueTime}</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <span className="font-semibold text-slate-300 block">工单详情描述</span>
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed">
              {workOrder.description}
            </div>
          </div>

          {/* Target Resource */}
          <div className="flex items-center gap-2 p-2.5 rounded bg-cyan-950/20 border border-cyan-500/20 text-cyan-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-cyan-400" />
            <span>关联受影响目标资源: <strong className="font-mono text-cyan-200">{workOrder.targetObject}</strong></span>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <span className="font-semibold text-slate-300 block">处置跟踪流转全生命周期时间线</span>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {workOrder.timeline.map((item, index) => (
                <div key={index} className="relative">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-200">{item.action}</span>
                      <span className="text-slate-500 font-mono">{item.time}</span>
                      <span className="text-cyan-400 font-medium">· 由 {item.operator} 执行</span>
                    </div>
                    <div className="text-slate-400 p-2 rounded bg-slate-800/40 border border-slate-800/80">
                      {item.comment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Action Input */}
          <div className="p-3.5 rounded-lg bg-slate-800/30 border border-slate-800 space-y-3">
            <span className="font-semibold text-slate-300 block">追加运维处置记录 / 审批审核批注</span>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="请输入现场处置排查方案、测算分析结果或审批复核意见..."
              rows={2}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">处理记录将实时计入安全审计台账与运维知识库</span>
              <div className="flex gap-2">
                {workOrder.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction('in_progress')}
                      className="px-3 py-1.5 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded transition-colors"
                    >
                      通过审核并接单
                    </button>
                    <button
                      onClick={() => handleAction('closed')}
                      className="px-3 py-1.5 text-xs font-medium bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded transition-colors"
                    >
                      驳回工单
                    </button>
                  </>
                )}
                {workOrder.status === 'in_progress' && (
                  <button
                    onClick={() => handleAction('resolved')}
                    className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    完成处置并办结
                  </button>
                )}
                {workOrder.status === 'resolved' && (
                  <button
                    onClick={() => handleAction('closed')}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                  >
                    验收归档
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
          >
            关闭详情
          </button>
        </div>
      </div>
    </div>
  );
};
