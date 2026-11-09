import React, { useState, useMemo } from 'react';
import { BookOpen, Plus, Search, Folder, ChevronLeft, ChevronRight, Tag, X, Edit3, CheckCircle2, AlertCircle, Palette } from 'lucide-react';

export interface DictValueItem {
  id: string;
  dictCode: string;
  dictType: string;
  dictLabel: string;
  dictValue: string;
  cssStyle: string;
  sortOrder: number;
  status: '正常' | '停用';
  updatedAt: string;
  remarks?: string;
}

const INITIAL_DICTS: DictValueItem[] = [
  { id: 'DICT-101', dictCode: 'SYS_DEV_01', dictType: '设备类型定义', dictLabel: '核心 Spine 交换机', dictValue: 'SPINE_SWITCH', cssStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-06 09:00:00', remarks: '400G 无损以太网核心层 Fabric 设备' },
  { id: 'DICT-102', dictCode: 'SYS_DEV_02', dictType: '设备类型定义', dictLabel: 'Leaf 接入交换机', dictValue: 'LEAF_SWITCH', cssStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', sortOrder: 2, status: '正常', updatedAt: '2026-11-06 09:00:00', remarks: '服务器机柜 ToR 高密接入交换机' },
  { id: 'DICT-103', dictCode: 'SYS_DEV_03', dictType: '设备类型定义', dictLabel: 'GPU 智算服务器', dictValue: 'GPU_SERVER', cssStyle: 'text-purple-400 bg-purple-500/10 border-purple-500/20', sortOrder: 3, status: '正常', updatedAt: '2026-11-05 16:30:00', remarks: '搭载 NVLink 的高密 AI 训练推理整机' },
  { id: 'DICT-104', dictCode: 'SYS_ALARM_01', dictType: '告警级别分类', dictLabel: '致命 (Critical)', dictValue: 'CRITICAL', cssStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-05 11:20:00', remarks: '导致业务核心瘫痪或数据阻断的极端故障' },
  { id: 'DICT-105', dictCode: 'SYS_ALARM_02', dictType: '告警级别分类', dictLabel: '严重 (Major)', dictValue: 'MAJOR', cssStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/20', sortOrder: 2, status: '正常', updatedAt: '2026-11-05 11:20:00', remarks: '影响关键性能或冗余失效的重要异常' },
  { id: 'DICT-106', dictCode: 'SYS_ALARM_03', dictType: '告警级别分类', dictLabel: '警告 (Warning)', dictValue: 'WARNING', cssStyle: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20', sortOrder: 3, status: '正常', updatedAt: '2026-11-04 15:40:00', remarks: '超出阈值预警范围但尚未恶化的指标' },
  { id: 'DICT-107', dictCode: 'SYS_WO_01', dictType: '工单优先级', dictLabel: 'P1-紧急', dictValue: 'P1_CRITICAL', cssStyle: 'text-rose-400 bg-rose-500/10 border-rose-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-04 10:15:00', remarks: '需 5 分钟内响应并成立攻坚小组' },
  { id: 'DICT-108', dictCode: 'SYS_WO_02', dictType: '工单优先级', dictLabel: 'P2-高', dictValue: 'P2_HIGH', cssStyle: 'text-amber-400 bg-amber-500/10 border-amber-500/20', sortOrder: 2, status: '正常', updatedAt: '2026-11-03 14:30:00', remarks: '需 30 分钟内完成派单排障' },
  { id: 'DICT-109', dictCode: 'SYS_STG_01', dictType: '存储协议规范', dictLabel: 'NVMe-oF 阵列', dictValue: 'NVME_OF', cssStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-03 09:20:00', remarks: '超低时延基于 RoCEv2 远程直接内存访问' },
  { id: 'DICT-110', dictCode: 'SYS_STG_02', dictType: '存储协议规范', dictLabel: 'Ceph 分布式池', dictValue: 'CEPH_DIST', cssStyle: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', sortOrder: 2, status: '正常', updatedAt: '2026-11-02 16:00:00', remarks: '高弹性统一对象/块/文件分布式存储集群' },
  { id: 'DICT-111', dictCode: 'SYS_OS_01', dictType: '操作系统类型', dictLabel: 'openEuler 22.03 LTS', dictValue: 'OPENEULER_2203', cssStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-02 11:30:00', remarks: '国产高可靠企业级 Linux 基础操作系统' },
  { id: 'DICT-112', dictCode: 'SYS_NET_01', dictType: '网络接口速率', dictLabel: '400 Gbps 无损端口', dictValue: '400G_PORT', cssStyle: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-01 17:00:00', remarks: '数据中心无损太网主干高速聚合端口' },
  { id: 'DICT-113', dictCode: 'SYS_MW_01', dictType: '中间件架构类型', dictLabel: 'ClickHouse OLAP 集群', dictValue: 'CLICKHOUSE_OLAP', cssStyle: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20', sortOrder: 1, status: '正常', updatedAt: '2026-11-01 12:00:00', remarks: 'PB 级数据全息实时多维分析引擎' },
];

const PRESET_STYLES = [
  { label: '青色高亮 (Cyan)', value: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
  { label: '翡翠绿 (Emerald)', value: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  { label: '琥珀黄 (Amber)', value: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  { label: '玫瑰红 (Rose)', value: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  { label: '紫罗兰 (Purple)', value: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { label: '科技蓝 (Indigo)', value: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  { label: '钛金灰 (Slate)', value: 'text-slate-300 bg-slate-800 border-slate-700' },
];

export const DataDictionaryMaintenanceView: React.FC = () => {
  const [dicts, setDicts] = useState<DictValueItem[]>(INITIAL_DICTS);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const pageSize = 10;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDict, setEditingDict] = useState<DictValueItem | null>(null);

  // Form State for Add
  const [addForm, setAddForm] = useState({
    dictType: '设备类型定义',
    customType: '',
    dictCode: '',
    dictLabel: '',
    dictValue: '',
    cssStyle: PRESET_STYLES[0].value,
    sortOrder: 1,
    status: '正常' as '正常' | '停用',
    remarks: '',
  });
  const [addFormError, setAddFormError] = useState('');

  // Form State for Edit
  const [editForm, setEditForm] = useState({
    dictType: '',
    dictCode: '',
    dictLabel: '',
    dictValue: '',
    cssStyle: '',
    sortOrder: 1,
    status: '正常' as '正常' | '停用',
    remarks: '',
  });
  const [editFormError, setEditFormError] = useState('');

  // Toast feedback
  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  // Dynamically derive distinct categories from dicts
  const availableCategories = useMemo(() => {
    const set = new Set(dicts.map((d) => d.dictType));
    return Array.from(set);
  }, [dicts]);

  const dictCategories = useMemo(() => {
    const list = [{ key: 'ALL', label: '全部数据字典类型' }];
    availableCategories.forEach((cat) => {
      list.push({ key: cat, label: cat });
    });
    return list;
  }, [availableCategories]);

  // Tree counts dynamically derived from dataset
  const treeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: dicts.length };
    dictCategories.forEach((cat) => {
      if (cat.key !== 'ALL') {
        counts[cat.key] = dicts.filter((d) => d.dictType === cat.key).length;
      }
    });
    return counts;
  }, [dicts, dictCategories]);

  // Filtered rows
  const filtered = useMemo(() => {
    return dicts.filter((item) => {
      const matchSearch =
        item.dictLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dictValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dictCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.remarks && item.remarks.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchCategory = selectedType === 'ALL' || item.dictType === selectedType;

      return matchSearch && matchCategory;
    });
  }, [dicts, selectedType, searchTerm]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const currentData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Open Edit Modal
  const handleOpenEditModal = (item: DictValueItem) => {
    setEditingDict(item);
    setEditForm({
      dictType: item.dictType,
      dictCode: item.dictCode,
      dictLabel: item.dictLabel,
      dictValue: item.dictValue,
      cssStyle: item.cssStyle,
      sortOrder: item.sortOrder,
      status: item.status,
      remarks: item.remarks || '',
    });
    setEditFormError('');
  };

  // Submit Add
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddFormError('');

    const targetType = addForm.dictType === '__CUSTOM__' ? addForm.customType.trim() : addForm.dictType;
    if (!targetType) {
      setAddFormError('请选择或输入字典所属类型');
      return;
    }
    if (!addForm.dictCode.trim()) {
      setAddFormError('请填写字典编码 (如 SYS_DEV_04)');
      return;
    }
    if (!addForm.dictLabel.trim()) {
      setAddFormError('请填写字典标签 (Label 中文显示名称)');
      return;
    }
    if (!addForm.dictValue.trim()) {
      setAddFormError('请填写字典键值 (Value 存储值/枚举值)');
      return;
    }

    // Check duplicate code
    if (dicts.some((d) => d.dictCode.toLowerCase() === addForm.dictCode.trim().toLowerCase())) {
      setAddFormError('已存在相同的字典编码，请更换');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newId = `DICT-${Math.floor(100 + Math.random() * 900)}`;

    const newItem: DictValueItem = {
      id: newId,
      dictCode: addForm.dictCode.trim().toUpperCase(),
      dictType: targetType,
      dictLabel: addForm.dictLabel.trim(),
      dictValue: addForm.dictValue.trim(),
      cssStyle: addForm.cssStyle,
      sortOrder: Number(addForm.sortOrder) || 1,
      status: addForm.status,
      updatedAt: now,
      remarks: addForm.remarks.trim(),
    };

    setDicts((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    showToast(`成功新增字典键值项「${newItem.dictLabel}」！`);

    // Reset add form
    setAddForm({
      dictType: availableCategories[0] || '设备类型定义',
      customType: '',
      dictCode: '',
      dictLabel: '',
      dictValue: '',
      cssStyle: PRESET_STYLES[0].value,
      sortOrder: 1,
      status: '正常',
      remarks: '',
    });
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditFormError('');

    if (!editingDict) return;

    if (!editForm.dictLabel.trim()) {
      setEditFormError('字典标签不能为空');
      return;
    }
    if (!editForm.dictValue.trim()) {
      setEditFormError('字典键值不能为空');
      return;
    }

    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setDicts((prev) =>
      prev.map((item) =>
        item.id === editingDict.id
          ? {
              ...item,
              dictType: editForm.dictType,
              dictCode: editForm.dictCode.trim() || item.dictCode,
              dictLabel: editForm.dictLabel.trim(),
              dictValue: editForm.dictValue.trim(),
              cssStyle: editForm.cssStyle,
              sortOrder: Number(editForm.sortOrder) || 1,
              status: editForm.status,
              remarks: editForm.remarks.trim(),
              updatedAt: now,
            }
          : item
      )
    );

    showToast(`字典键值「${editForm.dictLabel}」已成功更新保存！`);
    setEditingDict(null);
  };

  return (
    <div className="space-y-5">
      {/* Toast Feedback */}
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
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>数据字典维护</span>
            <span className="text-xs font-normal text-slate-400">· 基础字典分类、状态映射与下拉选项统一定义</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            全系统统一收口设备类型、告警级别、存储协议、网络速率与工单状态字典常量集
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
          新增字典键值
        </button>
      </div>

      {/* Grid: Left Tree (25%) + Right Data Table (75%) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Tree */}
        <div className="lg:col-span-1 rounded-xl border border-slate-800 bg-slate-900/90 p-4 space-y-3">
          <div className="text-xs font-bold text-slate-200 pb-2 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span>字典分类类型树</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">共 {dictCategories.length - 1} 类</span>
          </div>

          <div className="space-y-1">
            {dictCategories.map((cat) => {
              const isSelected = selectedType === cat.key;
              const count = treeCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedType(cat.key);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isSelected
                        ? 'bg-cyan-500/30 text-cyan-200'
                        : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Table */}
        <div className="lg:col-span-3 space-y-3">
          {/* Top Filter Bar */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="relative w-72">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="搜索字典标签、键值或编码..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="text-slate-400 font-mono">
              当前分类下共有 <span className="text-cyan-400 font-bold">{filtered.length}</span> 条字典键值
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/90 border-b border-slate-800 text-slate-400 font-medium">
                  <tr>
                    <th className="py-3 px-4">字典编码</th>
                    <th className="py-3 px-4">所属字典类型</th>
                    <th className="py-3 px-4">字典标签 (Label)</th>
                    <th className="py-3 px-4">字典键值 (Value)</th>
                    <th className="py-3 px-4">UI 渲染样式</th>
                    <th className="py-3 px-4">排序号</th>
                    <th className="py-3 px-4">状态</th>
                    <th className="py-3 px-4">更新时间</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {currentData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono font-semibold text-cyan-400">
                        <div>{item.dictCode}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{item.id}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{item.dictType}</td>
                      <td className="py-3 px-4 font-bold text-slate-100">{item.dictLabel}</td>
                      <td className="py-3 px-4 font-mono text-amber-300 font-semibold">{item.dictValue}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border inline-block ${item.cssStyle}`}>
                          {item.dictLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">{item.sortOrder}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border inline-flex items-center gap-1 ${
                            item.status === '正常'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                              : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${item.status === '正常' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">{item.updatedAt}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="hover:underline text-[11px] text-cyan-400 font-medium inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3 h-3" />
                          修改
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
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. 新增字典键值项 独立页面/弹窗 (Add Data Dict Modal)   */}
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
                  <h3 className="text-sm font-bold text-slate-100">新增数据字典键值项</h3>
                  <p className="text-[11px] text-slate-400">向全平台统一定义新的设备、协议、告警或状态字典项</p>
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
                {/* dictType */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>所属字典类型:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={addForm.dictType}
                      onChange={(e) => setAddForm({ ...addForm, dictType: e.target.value })}
                      className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      {availableCategories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="__CUSTOM__">+ 新增自定义字典类型...</option>
                    </select>

                    {addForm.dictType === '__CUSTOM__' && (
                      <input
                        type="text"
                        value={addForm.customType}
                        onChange={(e) => setAddForm({ ...addForm, customType: e.target.value })}
                        placeholder="输入新字典分类名称 (如: 智能算力卡类型)"
                        className="px-3 py-2 bg-slate-950 border border-cyan-500/50 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400"
                      />
                    )}
                  </div>
                </div>

                {/* dictCode */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>字典编码 (Unique Code):
                  </label>
                  <input
                    type="text"
                    value={addForm.dictCode}
                    onChange={(e) => setAddForm({ ...addForm, dictCode: e.target.value })}
                    placeholder="例: SYS_DEV_04"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 uppercase"
                  />
                </div>

                {/* sortOrder */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">显示排序号:</label>
                  <input
                    type="number"
                    min={1}
                    value={addForm.sortOrder}
                    onChange={(e) => setAddForm({ ...addForm, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* dictLabel */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>字典标签 (中文展示名):
                  </label>
                  <input
                    type="text"
                    value={addForm.dictLabel}
                    onChange={(e) => setAddForm({ ...addForm, dictLabel: e.target.value })}
                    placeholder="例: 边缘智能计算节点"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* dictValue */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>字典键值 (后端枚举存储值):
                  </label>
                  <input
                    type="text"
                    value={addForm.dictValue}
                    onChange={(e) => setAddForm({ ...addForm, dictValue: e.target.value })}
                    placeholder="例: EDGE_AI_NODE"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* cssStyle with Visual Preset Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                    <span>UI 徽标色彩样式:</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      即时效果预览:
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${addForm.cssStyle}`}>
                        {addForm.dictLabel || '字典标签预览'}
                      </span>
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_STYLES.map((style) => (
                      <button
                        type="button"
                        key={style.label}
                        onClick={() => setAddForm({ ...addForm, cssStyle: style.value })}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          addForm.cssStyle === style.value
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate text-[11px]">{style.label.split(' ')[0]}</span>
                        <span className={`w-3 h-3 rounded-full border ${style.value.split(' ')[2] || 'border-slate-600'} ${style.value.split(' ')[1] || 'bg-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* status */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">字典状态:</label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="add_status"
                        checked={addForm.status === '正常'}
                        onChange={() => setAddForm({ ...addForm, status: '正常' })}
                        className="text-cyan-500 focus:ring-0"
                      />
                      <span className="text-emerald-400 font-medium">正常启用</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="add_status"
                        checked={addForm.status === '停用'}
                        onChange={() => setAddForm({ ...addForm, status: '停用' })}
                        className="text-cyan-500 focus:ring-0"
                      />
                      <span className="text-rose-400 font-medium">暂停使用</span>
                    </label>
                  </div>
                </div>

                {/* remarks */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">备注说明:</label>
                  <textarea
                    rows={2}
                    value={addForm.remarks}
                    onChange={(e) => setAddForm({ ...addForm, remarks: e.target.value })}
                    placeholder="输入该字典常量在系统各业务模块中的约束与使用规范..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
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
                  确认创建字典项
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. 编辑字典键值项 独立页面/弹窗 (Edit Data Dict Modal)  */}
      {/* ======================================================== */}
      {editingDict && (
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
                    编辑数据字典键值项 · <span className="text-cyan-400 font-mono">{editingDict.dictCode}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">修改字典标签、枚举映射值与前台渲染颜色样式</p>
                </div>
              </div>
              <button
                onClick={() => setEditingDict(null)}
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
                {/* dictType */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">所属字典类型:</label>
                  <select
                    value={editForm.dictType}
                    onChange={(e) => setEditForm({ ...editForm, dictType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* dictCode */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">字典编码 (Code):</label>
                  <input
                    type="text"
                    value={editForm.dictCode}
                    onChange={(e) => setEditForm({ ...editForm, dictCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* dictLabel */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>字典标签 (Label 中文展示名):
                  </label>
                  <input
                    type="text"
                    value={editForm.dictLabel}
                    onChange={(e) => setEditForm({ ...editForm, dictLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* dictValue */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">
                    <span className="text-rose-400 mr-1">*</span>字典键值 (Value 存储值):
                  </label>
                  <input
                    type="text"
                    value={editForm.dictValue}
                    onChange={(e) => setEditForm({ ...editForm, dictValue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* sortOrder */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1">显示排序号:</label>
                  <input
                    type="number"
                    min={1}
                    value={editForm.sortOrder}
                    onChange={(e) => setEditForm({ ...editForm, sortOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* status */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">字典状态:</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit_status"
                        checked={editForm.status === '正常'}
                        onChange={() => setEditForm({ ...editForm, status: '正常' })}
                        className="text-cyan-500 focus:ring-0"
                      />
                      <span className="text-emerald-400 font-medium">正常启用</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="edit_status"
                        checked={editForm.status === '停用'}
                        onChange={() => setEditForm({ ...editForm, status: '停用' })}
                        className="text-cyan-500 focus:ring-0"
                      />
                      <span className="text-rose-400 font-medium">暂停使用</span>
                    </label>
                  </div>
                </div>

                {/* cssStyle with Visual Preset Selection */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1.5 flex items-center justify-between">
                    <span>UI 徽标色彩样式:</span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      即时效果预览:
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${editForm.cssStyle}`}>
                        {editForm.dictLabel || '字典标签预览'}
                      </span>
                    </span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {PRESET_STYLES.map((style) => (
                      <button
                        type="button"
                        key={style.label}
                        onClick={() => setEditForm({ ...editForm, cssStyle: style.value })}
                        className={`p-2 rounded-lg border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          editForm.cssStyle === style.value
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="truncate text-[11px]">{style.label.split(' ')[0]}</span>
                        <span className={`w-3 h-3 rounded-full border ${style.value.split(' ')[2] || 'border-slate-600'} ${style.value.split(' ')[1] || 'bg-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* remarks */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">备注说明:</label>
                  <textarea
                    rows={2}
                    value={editForm.remarks}
                    onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                    placeholder="输入该字典常量在系统各业务模块中的约束与使用规范..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                  />
                </div>
              </div>

              {/* Audit trace note */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>字典条目 ID: {editingDict.id}</span>
                <span>上次更新时间: {editingDict.updatedAt}</span>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingDict(null)}
                  className="px-4 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-950/40 cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  保存字典修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
