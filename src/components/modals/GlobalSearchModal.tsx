import React, { useState, useMemo } from 'react';
import { X, Search, Server, HardDrive, Network, Boxes, AlertTriangle, ClipboardList, ArrowRight, BookOpen } from 'lucide-react';
import { ServerNode, StorageDevice, SoftwareComponent, AlarmItem, WorkOrder, MenuKey, KnowledgeArticle } from '../../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (menuKey: MenuKey) => void;
  servers: ServerNode[];
  storages: StorageDevice[];
  components: SoftwareComponent[];
  alarms: AlarmItem[];
  workOrders: WorkOrder[];
  articles?: KnowledgeArticle[];
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  servers,
  storages,
  components,
  alarms,
  workOrders,
  articles = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const results: {
      type: 'server' | 'storage' | 'component' | 'alarm' | 'workorder' | 'knowledge';
      title: string;
      sub: string;
      menuKey: MenuKey;
      icon: any;
    }[] = [];

    // Servers
    servers.forEach((s) => {
      if (s.hostname.toLowerCase().includes(term) || s.ip.includes(term) || s.id.toLowerCase().includes(term)) {
        results.push({
          type: 'server',
          title: `${s.hostname} (${s.ip})`,
          sub: `物理机节点 · 机架 ${s.rack} · 角色: ${s.role}`,
          menuKey: 'hw_servers',
          icon: Server,
        });
      }
    });

    // Storage
    storages.forEach((st) => {
      if (st.name.toLowerCase().includes(term) || st.vendor.toLowerCase().includes(term)) {
        results.push({
          type: 'storage',
          title: st.name,
          sub: `${st.type} · 容量: ${st.capacityTB}TB · IOPS: ${st.iops.toLocaleString()}`,
          menuKey: 'hw_storage',
          icon: HardDrive,
        });
      }
    });

    // Components
    components.forEach((c) => {
      if (c.name.toLowerCase().includes(term) || c.version.toLowerCase().includes(term)) {
        results.push({
          type: 'component',
          title: `${c.name} ${c.version}`,
          sub: `基础软件 · 主控: ${c.leaderNode} · 在线: ${c.activeNodes}/${c.totalNodes}`,
          menuKey: 'sw_bigdata',
          icon: Boxes,
        });
      }
    });

    // Alarms
    alarms.forEach((a) => {
      if (a.title.toLowerCase().includes(term) || a.sourceEntity.toLowerCase().includes(term) || a.id.toLowerCase().includes(term)) {
        results.push({
          type: 'alarm',
          title: a.title,
          sub: `告警 ${a.id} · 级别: ${a.severity} · 实体: ${a.sourceEntity}`,
          menuKey: 'alarm_active',
          icon: AlertTriangle,
        });
      }
    });

    // Work Orders
    workOrders.forEach((wo) => {
      if (wo.title.toLowerCase().includes(term) || wo.id.toLowerCase().includes(term) || wo.assignee.includes(term)) {
        results.push({
          type: 'workorder',
          title: wo.title,
          sub: `工单 ${wo.id} · ${wo.priority} · 处理人: ${wo.assignee}`,
          menuKey: 'wo_my',
          icon: ClipboardList,
        });
      }
    });

    // Knowledge Articles
    articles.forEach((art) => {
      if (art.title.toLowerCase().includes(term) || art.summary.toLowerCase().includes(term) || art.tags.some((t) => t.toLowerCase().includes(term))) {
        results.push({
          type: 'knowledge',
          title: art.title,
          sub: `知识库 · ${art.category} · ${art.author}`,
          menuKey: 'kb_troubleshooting',
          icon: BookOpen,
        });
      }
    });

    return results.slice(0, 8);
  }, [searchTerm, servers, storages, components, alarms, workOrders, articles]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="全局快速检索服务器 IP、组件名称、告警、工单号 (如 master, 10.120, kafka)..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              {searchTerm ? '未找到匹配的数据实体或资源，请尝试其他关键词' : '输入关键词即可快速跨模块穿梭定位'}
            </div>
          ) : (
            searchResults.map((res, idx) => {
              const Icon = res.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onNavigate(res.menuKey);
                    onClose();
                  }}
                  className="w-full p-2.5 rounded-lg text-left hover:bg-slate-800/60 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-slate-800 text-cyan-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{res.sub}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>提示：支持模糊匹配 IP、主机名、Kafka Topic 与工单序列号</span>
          <span className="font-mono">ESC 退出</span>
        </div>
      </div>
    </div>
  );
};
