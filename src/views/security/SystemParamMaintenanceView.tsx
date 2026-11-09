import React, { useState } from 'react';
import { Sliders, Search, Plus, RefreshCw, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, X, Edit3, ShieldAlert, Cpu } from 'lucide-react';

export interface SystemParamItem {
  id: string;
  paramKey: string;
  paramName: string;
  currentValue: string;
  defaultValue: string;
  valType: 'NUMBER' | 'BOOLEAN' | 'STRING' | 'JSON';
  dynamicApply: boolean;
  module: string;
  updatedBy: string;
  updatedAt: string;
  description: string;
}

const INITIAL_PARAMS: SystemParamItem[] = [
  { id: 'PARAM-001', paramKey: 'telemetry.sampling.interval.ms', paramName: '全域物理设备遥测采样周期', currentValue: '1000', defaultValue: '3000', valType: 'NUMBER', dynamicApply: true, module: '集中监控', updatedBy: '程总工', updatedAt: '2026-11-06 09:15:00', description: '控制 400G 无损交换机与 BMC 带外遥测高频采样间隔 (毫秒)' },
  { id: 'PARAM-002', paramKey: 'alarm.suppression.window.sec', paramName: '告警事件收敛降噪窗口', currentValue: '180', defaultValue: '300', valType: 'NUMBER', dynamicApply: true, module: '告警管理', updatedBy: '李健', updatedAt: '2026-11-06 08:30:00', description: '相同 Metric 告警风暴防刷降噪收敛时间窗口 (秒)' },
  { id: 'PARAM-003', paramKey: 'log.audit.retention.days', paramName: '安全审计日志归档保留天数', currentValue: '365', defaultValue: '180', valType: 'NUMBER', dynamicApply: false, module: '系统管理', updatedBy: '张伟', updatedAt: '2026-11-05 16:45:00', description: '符合国家等保三级要求的全链路敏感操作存证保留天数' },
  { id: 'PARAM-004', paramKey: 'k8s.pod.auto_reschedule.enabled', paramName: 'K8s 故障节点 Pod 自动迁移使能', currentValue: 'true', defaultValue: 'true', valType: 'BOOLEAN', dynamicApply: true, module: '云平台', updatedBy: '赵敏', updatedAt: '2026-11-05 14:20:00', description: '当物理 Worker 节点心跳超时 30 秒时自动驱逐工作负载' },
  { id: 'PARAM-005', paramKey: 'storage.ceph.scrub.schedule.cron', paramName: 'Ceph 分布式存储卷深度巡检 Cron', currentValue: '0 2 * * 0', defaultValue: '0 2 * * 0', valType: 'STRING', dynamicApply: true, module: '存储管理', updatedBy: '吴强', updatedAt: '2026-11-05 11:10:00', description: '每周日凌晨 02:00 自动触发 NVMe-oF 阵列深层扇区校验' },
  { id: 'PARAM-006', paramKey: 'clickhouse.max_memory_usage.ratio', paramName: 'ClickHouse OLAP 内存配额比例', currentValue: '0.85', defaultValue: '0.80', valType: 'NUMBER', dynamicApply: true, module: '数据库', updatedBy: '郑秀', updatedAt: '2026-11-04 18:45:00', description: '占单节点物理 RAM 的最高查询缓冲区占比，超限强行杀 SQL' },
  { id: 'PARAM-007', paramKey: 'kafka.consumer.auto_commit.enabled', paramName: 'Kafka 消费位点同步提交使能', currentValue: 'false', defaultValue: 'false', valType: 'BOOLEAN', dynamicApply: false, module: '中间件', updatedBy: '陈明', updatedAt: '2026-11-04 15:30:00', description: '强制使用 At-Least-Once 手动 Ack 确保高并发消息不丢失' },
  { id: 'PARAM-008', paramKey: 'rfid.reader.power.dbm', paramName: '工业 RFID 工业读写器发送发射功率', currentValue: '28', defaultValue: '30', valType: 'NUMBER', dynamicApply: true, module: '电子标识', updatedBy: '孙杰', updatedAt: '2026-11-04 10:20:00', description: '高频/超高频双基识读器无线射频场强功率配置' },
  { id: 'PARAM-009', paramKey: 'system.global.notice.banner', paramName: '平台顶部维保通知公告 JSON', currentValue: '{"show": true, "msg": "近期割接"}', defaultValue: '{"show": false}', valType: 'JSON', dynamicApply: true, module: '系统管理', updatedBy: '程总工', updatedAt: '2026-11-03 17:00:00', description: '全域登录用户顶部即时通知高亮弹窗 JSON 模板' },
  { id: 'PARAM-010', paramKey: 'workorder.sla.p1.response.min', paramName: 'P1 级紧急工单首响 SLA 期限', currentValue: '5', defaultValue: '10', valType: 'NUMBER', dynamicApply: true, module: '工单管理', updatedBy: '王芳', updatedAt: '2026-11-03 14:00:00', description: 'P1-紧急类工单派发至接收响应的最大容许分钟数' },
  { id: 'PARAM-011', paramKey: 'mfa.enforce.roles.list', paramName: '强制绑定 MFA 硬件 Key 的角色', currentValue: '["SUPER_ADMIN", "SYS_ADMIN"]', defaultValue: '["SUPER_ADMIN"]', valType: 'JSON', dynamicApply: true, module: '系统管理', updatedBy: '周涛', updatedAt: '2026-11-02 16:30:00', description: '未绑定硬件密钥时禁止登入管控后台的高风险角色清单' },
  { id: 'PARAM-012', paramKey: 'legacy.v1.proxy.timeout.ms', paramName: '遗留系统 HTTP 代理超时时间', currentValue: '5000', defaultValue: '5000', valType: 'NUMBER', dynamicApply: false, module: '系统管理', updatedBy: '程总工', updatedAt: '2026-11-02 09:20:00', description: '兼容老旧硬件监控网关的回连 HTTP 超时上限' },
];

const MODULE_OPTIONS = [
  '集中监控',
  '告警管理',
  '系统管理',
  '工单管理',
  '存储管理',
  '中间件',
  '数据库',
  '云平台',
  '电子标识',
];

export const SystemParamMaintenanceView: React.FC = () => {
  const [params, setParams] = useState<SystemParamItem[]>(INITIAL_PARAMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleFilter, setModuleFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const pageSize = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingParam, setEditingParam] = useState<SystemParamItem | null>(null);

  // Form State for Add
  const [addForm, setAddForm] = useState({
    paramKey: '',
    paramName: '',
    currentValue: '',
    defaultValue: '',
    valType: 'STRING' as SystemParamItem['valType'],
    dynamicApply: true,
    module: '集中监控',
    description: '',
  });
  const [addFormError, setAddFormError] = useState('');

  // Form State for Edit
  const [editForm, setEditForm] = useState({
    paramKey: '',
    paramName: '',
    currentValue: '',
    defaultValue: '',
    valType: 'STRING' as SystemParamItem['valType'],
    dynamicApply: true,
    module: '集中监控',
    description: '',
  });
  const [editFormError, setEditFormError] = useState('');

  // Trigger notification toast
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Open Edit Modal with selected param data
  const handleOpenEditModal = (param: SystemParamItem) => {
    setEditingParam(param);
    setEditForm({
      paramKey: param.paramKey,
      paramName: param.paramName,
      currentValue: param.currentValue,
      defaultValue: param.defaultValue,
      valType: param.valType,
      dynamicApply: param.dynamicApply,
      module: param.module,
      description: param.description,
    });
    setEditFormError('');
  };

  // Submit Add Form
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError('');

    if (!addForm.paramKey.trim()) {
      setAddFormError('请填写参数唯一键 (Key)');
      return;
    }
    if (!addForm.paramName.trim()) {
      setAddFormError('请填写参数中文名称');
      return;
    }
    if (!addForm.currentValue.trim()) {
      setAddFormError('请设定当前生效值');
      return;
    }

    // Check duplicate key
    if (params.some((p) => p.paramKey.toLowerCase() === addForm.paramKey.trim().toLowerCase())) {
      setAddFormError('已存在相同的参数 Key，请重新命名');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newId = `PARAM-${String(params.length + 1).padStart(3, '0')}`;

    const newParam: SystemParamItem = {
      id: newId,
      paramKey: addForm.paramKey.trim(),
      paramName: addForm.paramName.trim(),
      currentValue: addForm.currentValue.trim(),
      defaultValue: addForm.defaultValue.trim() || addForm.currentValue.trim(),
      valType: addForm.valType,
      dynamicApply: addForm.dynamicApply,
      module: addForm.module,
      updatedBy: '程总工 (admin)',
      updatedAt: now,
      description: addForm.description.trim() || '新建系统运行参数配置',
    };

    setParams((prev) => [newParam, ...prev]);
    setIsAddModalOpen(false);
    setCurrentPage(1);
    showToast(`成功创建系统参数「${newParam.paramName}」并注入配置中心！`);

    // Reset add form
    setAddForm({
      paramKey: '',
      paramName: '',
      currentValue: '',
      defaultValue: '',
      valType: 'STRING',
      dynamicApply: true,
      module: '集中监控',
      description: '',
    });
  };

  // Submit Edit Form
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError('');

    if (!editingParam) return;

    if (!editForm.paramName.trim()) {
      setEditFormError('参数中文名称不能为空');
      return;
    }
    if (!editForm.currentValue.trim()) {
      setEditFormError('当前生效值不能为空');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setParams((prev) =>
      prev.map((item) =>
        item.id === editingParam.id
          ? {
              ...item,
              paramKey: editForm.paramKey.trim() || item.paramKey,
              paramName: editForm.paramName.trim(),
              currentValue: editForm.currentValue.trim(),
              defaultValue: editForm.defaultValue.trim() || item.defaultValue,
              valType: editForm.valType,
              dynamicApply: editForm.dynamicApply,
              module: editForm.module,
              description: editForm.description.trim(),
              updatedBy: '程总工 (admin)',
              updatedAt: now,
            }
          : item
      )
    );

    showToast(`参数「${editForm.paramName}」已更新，热生效链路已同步！`);
    setEditingParam(null);
  };

  const filtered = params.filter((p) => {
    const matchSearch =
      p.paramKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paramName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchModule = moduleFilter === 'ALL' || p.module === moduleFilter;
    return matchSearch && matchModule;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const modules = Array.from(new Set(params.map((p) => p.module)));

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 text-xs shadow-2xl animate-fade-in backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>系统参数维护</span>
            <span className="text-xs font-normal text-slate-400">· 核心运行参数、遥测周期与全局阈值热加载</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            在线调整大数据全息平台全局运行参数、告警降噪窗口、日志保留天数与高频遥测采样粒度
          </p>
        </div>

        <button
          onClick={() => {
            setAddFormError('');
            setIsAddModalOpen(true);
          }}
          className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-600/30 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          新增系统参数
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="搜索参数 Key、参数名称或描述..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="ALL">全部所属模块</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="text-slate-400 font-mono">
          共有 <span className="text-cyan-400 font-bold">{filtered.length}</span> 个可配参数
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-medium">
              <tr>
                <th className="py-3 px-4">参数 Key / ID</th>
                <th className="py-3 px-4">参数名称</th>
                <th className="py-3 px-4">当前生效值</th>
                <th className="py-3 px-4">默认初始值</th>
                <th className="py-3 px-4">值类型</th>
                <th className="py-3 px-4">生效方式</th>
                <th className="py-3 px-4">所属模块</th>
                <th className="py-3 px-4">说明描述</th>
                <th className="py-3 px-4">最后修改人/时间</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {currentData.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                    <div>{item.paramKey}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{item.id}</div>
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-100">{item.paramName}</td>
                  <td className="py-3 px-4 font-mono font-bold text-amber-300">
                    <span className="bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/30 inline-block">
                      {item.currentValue}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{item.defaultValue}</td>
                  <td className="py-3 px-4 font-mono">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                      {item.valType}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {item.dynamicApply ? (
                      <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded text-[11px] font-mono inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        即时热生效
                      </span>
                    ) : (
                      <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-mono inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        需重启组件
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-medium">{item.module}</td>
                  <td className="py-3 px-4 text-slate-400 max-w-xs truncate" title={item.description}>
                    {item.description}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    <div className="text-slate-300">{item.updatedBy}</div>
                    <div className="text-[10px] text-slate-500">{item.updatedAt}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="hover:underline text-[11px] text-cyan-400 font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3" />
                      编辑修改
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Standard 10 Items/Page Pagination */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 font-mono">
            共 <span className="text-slate-200 font-semibold">{filtered.length}</span> 条数据
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-3 py-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 font-mono font-bold">
              {currentPage}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <div className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 font-mono">
              10条/页
            </div>

            <div className="flex items-center gap-1 ml-2">
              <span className="text-slate-400">跳至</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const p = parseInt(e.target.value);
                  if (p >= 1 && p <= totalPages) setCurrentPage(p);
                }}
                className="w-12 px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded text-center text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <span className="text-slate-400">页</span>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. 新增系统参数 独立页面/弹窗 (Add System Parameter Modal) */}
      {/* ======================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">新增系统运行参数</h3>
                  <p className="text-[11px] text-slate-400">向全息数据平台配置中心注入新的全局控制参数</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Notification */}
            {addFormError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addFormError}</span>
              </div>
            )}

            {/* Add Form */}
            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* paramKey */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>参数 Key (全局唯一键):
                  </label>
                  <input
                    type="text"
                    value={addForm.paramKey}
                    onChange={(e) => setAddForm({ ...addForm, paramKey: e.target.value })}
                    placeholder="例: telemetry.flow.threshold.mbps"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">建议使用小写字母与句点分隔</span>
                </div>

                {/* paramName */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>参数中文名称:
                  </label>
                  <input
                    type="text"
                    value={addForm.paramName}
                    onChange={(e) => setAddForm({ ...addForm, paramName: e.target.value })}
                    placeholder="例: 400G 网络端口突发丢包告警阈值"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* currentValue */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>当前生效值:
                  </label>
                  <input
                    type="text"
                    value={addForm.currentValue}
                    onChange={(e) => setAddForm({ ...addForm, currentValue: e.target.value })}
                    placeholder="请输入当前生效值"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* defaultValue */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">默认初始值:</label>
                  <input
                    type="text"
                    value={addForm.defaultValue}
                    onChange={(e) => setAddForm({ ...addForm, defaultValue: e.target.value })}
                    placeholder="系统出厂默认值 (留空则同当前值)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* valType */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">参数值类型:</label>
                  <select
                    value={addForm.valType}
                    onChange={(e) => setAddForm({ ...addForm, valType: e.target.value as SystemParamItem['valType'] })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                  >
                    <option value="NUMBER">NUMBER (数字类型)</option>
                    <option value="STRING">STRING (字符串类型)</option>
                    <option value="BOOLEAN">BOOLEAN (布尔开关: true / false)</option>
                    <option value="JSON">JSON (结构化对象/数组)</option>
                  </select>
                </div>

                {/* module */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">所属业务模块:</label>
                  <select
                    value={addForm.module}
                    onChange={(e) => setAddForm({ ...addForm, module: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {MODULE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* dynamicApply */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">生效机制:</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setAddForm({ ...addForm, dynamicApply: true })}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      addForm.dynamicApply
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="add_dynamicApply"
                      checked={addForm.dynamicApply}
                      onChange={() => setAddForm({ ...addForm, dynamicApply: true })}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center">
                      {addForm.dynamicApply && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs">即时热生效</div>
                      <div className="text-[10px] text-slate-500">修改后实时推送各节点内存，无需重启应用</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setAddForm({ ...addForm, dynamicApply: false })}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      !addForm.dynamicApply
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="add_dynamicApply"
                      checked={!addForm.dynamicApply}
                      onChange={() => setAddForm({ ...addForm, dynamicApply: false })}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border border-amber-500 flex items-center justify-center">
                      {!addForm.dynamicApply && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs">需重启组件</div>
                      <div className="text-[10px] text-slate-500">静态配置项，待下次维保割接或服务重启生效</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* description */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">参数说明与技术描述:</label>
                <textarea
                  rows={3}
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                  placeholder="详细描述该运行参数的业务背景、取值范围以及对集群负载、吞吐量的影响..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  确认创建参数
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 编辑系统参数 独立页面/弹窗 (Edit System Parameter Modal) */}
      {/* ======================================================== */}
      {editingParam && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    编辑系统运行参数 · <span className="text-cyan-400 font-mono">{editingParam.id}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">更新全息平台配置参数值及生效策略</p>
                </div>
              </div>
              <button
                onClick={() => setEditingParam(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Notification */}
            {editFormError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editFormError}</span>
              </div>
            )}

            {/* Edit Form */}
            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* paramKey (editable or display) */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">参数 Key (系统键名):</label>
                  <input
                    type="text"
                    value={editForm.paramKey}
                    onChange={(e) => setEditForm({ ...editForm, paramKey: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">集群底层服务引用的参数键名</span>
                </div>

                {/* paramName */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>参数中文名称:
                  </label>
                  <input
                    type="text"
                    value={editForm.paramName}
                    onChange={(e) => setEditForm({ ...editForm, paramName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* currentValue */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>当前生效值:
                  </label>
                  <input
                    type="text"
                    value={editForm.currentValue}
                    onChange={(e) => setEditForm({ ...editForm, currentValue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-cyan-500/50 rounded-lg text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[10px] text-cyan-400 mt-0.5 block">修改此值将直接影响对应组件运行状态</span>
                </div>

                {/* defaultValue */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">默认初始值:</label>
                  <input
                    type="text"
                    value={editForm.defaultValue}
                    onChange={(e) => setEditForm({ ...editForm, defaultValue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* valType */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">参数值类型:</label>
                  <select
                    value={editForm.valType}
                    onChange={(e) => setEditForm({ ...editForm, valType: e.target.value as SystemParamItem['valType'] })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono cursor-pointer"
                  >
                    <option value="NUMBER">NUMBER (数字类型)</option>
                    <option value="STRING">STRING (字符串类型)</option>
                    <option value="BOOLEAN">BOOLEAN (布尔开关: true / false)</option>
                    <option value="JSON">JSON (结构化对象/数组)</option>
                  </select>
                </div>

                {/* module */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">所属业务模块:</label>
                  <select
                    value={editForm.module}
                    onChange={(e) => setEditForm({ ...editForm, module: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {MODULE_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* dynamicApply */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">生效机制:</label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    onClick={() => setEditForm({ ...editForm, dynamicApply: true })}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      editForm.dynamicApply
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="edit_dynamicApply"
                      checked={editForm.dynamicApply}
                      onChange={() => setEditForm({ ...editForm, dynamicApply: true })}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border border-emerald-500 flex items-center justify-center">
                      {editForm.dynamicApply && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs">即时热生效</div>
                      <div className="text-[10px] text-slate-500">修改后实时推送各节点内存，无需重启应用</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setEditForm({ ...editForm, dynamicApply: false })}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition-colors ${
                      !editForm.dynamicApply
                        ? 'border-amber-500/50 bg-amber-500/10 text-amber-300'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="edit_dynamicApply"
                      checked={!editForm.dynamicApply}
                      onChange={() => setEditForm({ ...editForm, dynamicApply: false })}
                      className="sr-only"
                    />
                    <div className="w-3.5 h-3.5 rounded-full border border-amber-500 flex items-center justify-center">
                      {!editForm.dynamicApply && <div className="w-2 h-2 rounded-full bg-amber-400" />}
                    </div>
                    <div>
                      <div className="font-semibold text-xs">需重启组件</div>
                      <div className="text-[10px] text-slate-500">静态配置项，待下次维保割接或服务重启生效</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* description */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">参数说明与技术描述:</label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="详细描述该运行参数的业务背景与技术规范..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Audit trace note */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>原修改人: {editingParam.updatedBy}</span>
                <span>原更新时间: {editingParam.updatedAt}</span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingParam(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  保存修改并热同步
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
