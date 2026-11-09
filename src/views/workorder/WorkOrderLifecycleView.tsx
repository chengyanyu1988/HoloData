import React, { useState } from 'react';
import { Activity, Clock, CheckCircle2, User, ChevronRight, FileText } from 'lucide-react';
import { WorkOrder } from '../../types';

interface WorkOrderLifecycleViewProps {
  workOrders: WorkOrder[];
  onOpenOrderDetail: (order: WorkOrder) => void;
}

export const WorkOrderLifecycleView: React.FC<WorkOrderLifecycleViewProps> = ({
  workOrders,
  onOpenOrderDetail,
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(workOrders[0]?.id || '');

  const activeOrder = workOrders.find((w) => w.id === selectedOrderId) || workOrders[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>工单流转与处置追踪</span>
            <span className="text-xs font-normal text-slate-400">· 全流程节点履约穿透</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            可视化审查工单提报、初审评估、现场排障、专家复核与最终验证闭环全链条
          </p>
        </div>
      </div>

      {/* Main Split: Order Selector & Flow Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Order Cards List */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 block">选择需要追踪的工单实体:</span>
          {workOrders.map((wo) => (
            <div
              key={wo.id}
              onClick={() => setSelectedOrderId(wo.id)}
              className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                selectedOrderId === wo.id
                  ? 'bg-cyan-950/20 border-cyan-500 shadow-md shadow-cyan-950/20'
                  : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono text-xs text-cyan-400 font-semibold">{wo.id}</span>
                <span className="text-[11px] text-slate-400 font-mono">{wo.priority}</span>
              </div>
              <div className="font-bold text-xs text-slate-200 line-clamp-1">{wo.title}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex justify-between">
                <span>处理人: {wo.assignee}</span>
                <span className="text-cyan-400">{wo.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Col: Timeline & Detail */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-5">
          {activeOrder && (
            <>
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-cyan-400 font-semibold">{activeOrder.id}</span>
                    <span className="text-xs text-slate-400">· {activeOrder.type}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-1">{activeOrder.title}</h3>
                </div>
                <button
                  onClick={() => onOpenOrderDetail(activeOrder)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 transition-colors"
                >
                  处理/追加批注
                </button>
              </div>

              {/* Timeline Sequence */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-slate-300 block">处置流程节点全息脉络</span>
                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {activeOrder.timeline.map((item, idx) => (
                    <div key={idx} className="relative space-y-1">
                      <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-cyan-400 ring-4 ring-slate-900" />
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-slate-200">{item.action}</span>
                        <span className="text-slate-500 font-mono">{item.time}</span>
                        <span className="text-cyan-400 font-medium">· 由 {item.operator} 完成</span>
                      </div>
                      <div className="text-xs text-slate-400 p-3 rounded-lg bg-slate-950 border border-slate-800/80">
                        {item.comment}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
