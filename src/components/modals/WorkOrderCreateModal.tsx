import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { WorkOrder } from '../../types';

interface WorkOrderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newOrder: Partial<WorkOrder>) => void;
  defaultTarget?: string;
}

export const WorkOrderCreateModal: React.FC<WorkOrderCreateModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  defaultTarget = '',
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<WorkOrder['type']>('硬件故障报修');
  const [priority, setPriority] = useState<WorkOrder['priority']>('P2-高');
  const [targetObject, setTargetObject] = useState(defaultTarget);
  const [description, setDescription] = useState('');
  const [applicant] = useState('程总工 (Chief Architect)');
  const [applicantDept] = useState('全息数据基础设施技术部');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetObject.trim() || !description.trim()) {
      alert('请完整填写工单标题、目标对象与详情描述');
      return;
    }

    onCreate({
      title,
      type,
      priority,
      targetObject,
      description,
      applicant,
      applicantDept,
      assignee: '待系统调度或值班组接单',
      status: 'pending',
      dueTime: '2026-11-06 18:00:00 (SLA: 24小时)',
      timeline: [
        {
          time: new Date().toISOString().replace('T', ' ').slice(0, 19),
          operator: applicant,
          action: '自主提报工单',
          comment: '由全息管理控制台在线创建工单。',
        },
      ],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">提报大数据运维与技术协同工单</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">工单标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="简要概括工单核心诉求，例如：更换 A-03 节点高转速风扇"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">工单类型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as WorkOrder['type'])}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="硬件故障报修">硬件故障报修</option>
                <option value="资源扩容审批">资源扩容审批</option>
                <option value="组件版本升级">组件版本升级</option>
                <option value="安全权限申请">安全权限申请</option>
                <option value="性能调优工单">性能调优工单</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">优先级响应等级</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as WorkOrder['priority'])}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="P1-紧急">P1-紧急 (15分钟内响应)</option>
                <option value="P2-高">P2-高 (1小时内响应)</option>
                <option value="P3-中">P3-中 (4小时内响应)</option>
                <option value="P4-低">P4-低 (日常例行排班)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">目标受影响实体 / 节点 / 组件</label>
            <input
              type="text"
              value={targetObject}
              onChange={(e) => setTargetObject(e.target.value)}
              placeholder="例如：hologram-compute-02 或 Kafka Topic 或 YARN Queue"
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">故障现象或变更需求详述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细描述具体的故障现场、异常表现、申请原因、预期达成目标等..."
              rows={3}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-900/30 font-semibold"
            >
              确认提交工单
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
