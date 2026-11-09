import React, { useState } from 'react';
import {
  LayoutDashboard,
  Server,
  Boxes,
  AlertTriangle,
  ClipboardList,
  ShieldCheck,
  Sliders,
  ChevronDown,
  Layers,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  Activity,
  Cpu,
  Database,
  BookOpen,
} from 'lucide-react';
import { MenuKey, MenuGroup } from '../../types';
import { NAVIGATION_GROUPS } from '../../data/navigation';

interface SidebarProps {
  currentMenu: MenuKey;
  onNavigate: (key: MenuKey) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeAlarmsCount: number;
  pendingWorkOrdersCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  activeAlarmsCount,
  pendingWorkOrdersCount,
}) => {
  // Map group icon names to Lucide icons
  const getGroupIcon = (name: string) => {
    switch (name) {
      case 'Activity':
        return Activity;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'ClipboardList':
        return ClipboardList;
      case 'BookOpen':
        return BookOpen;
      case 'Sliders':
        return Sliders;
      case 'ShieldCheck':
        return ShieldCheck;
      default:
        return Layers;
    }
  };

  // Find which group contains the active menu item (including nested children)
  const currentGroupKey =
    NAVIGATION_GROUPS.find((g) =>
      g.children.some(
        (c) => c.key === currentMenu || c.children?.some((sub) => sub.key === currentMenu)
      )
    )?.key || 'monitoring';

  // Open groups state
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    [currentGroupKey]: true,
    monitoring: true,
    event: true,
  });

  // Open nested submenus state
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    mon_it: true,
    mon_os: true,
    mon_container: true,
    mon_middleware: true,
    mon_database: true,
    mon_rfid: true,
    wo_mgr: true,
    wo_change_review: true,
    sec_settings: true,
  });

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleSubMenu = (key: string) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <aside
      className={`h-screen bg-slate-950 border-r border-slate-800/80 flex flex-col transition-all duration-300 z-40 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-950">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-slate-100 tracking-tight whitespace-nowrap">
                数据全息管理系统
              </h1>
              <div className="text-[10px] text-cyan-400 font-mono tracking-wider uppercase">
                Hologram DataOps
              </div>
            </div>
          </div>
        )}

        {isCollapsed && (
          <div className="w-8 h-8 mx-auto rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Layers className="w-4 h-4 text-white" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors ${
            isCollapsed ? 'mx-auto mt-2 hidden' : ''
          }`}
          title={isCollapsed ? '展开导航栏' : '收起导航栏'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-1.5">
        {NAVIGATION_GROUPS.map((group) => {
          const IconComponent = getGroupIcon(group.iconName);
          const isOpen = openGroups[group.key] ?? false;
          const isGroupActive = group.children.some((c) => c.key === currentMenu);

          const badgeCount =
            group.key === 'event'
              ? activeAlarmsCount
              : group.key === 'workorder'
              ? pendingWorkOrdersCount
              : undefined;

          if (isCollapsed) {
            return (
              <div key={group.key} className="relative group/tooltip flex justify-center py-1">
                <button
                  onClick={() => {
                    onNavigate(group.children[0].key);
                  }}
                  className={`p-2.5 rounded-lg transition-colors relative ${
                    isGroupActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={group.label}
                >
                  <IconComponent className="w-5 h-5" />
                </button>
              </div>
            );
          }

          return (
            <div key={group.key} className="space-y-0.5">
              {/* Group Header Button */}
              <button
                onClick={() => toggleGroup(group.key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isGroupActive
                    ? 'text-cyan-400 bg-cyan-950/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{group.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Submenu Items */}
              {isOpen && (
                <div className="pl-6 space-y-0.5 pt-0.5 border-l border-slate-800/80 ml-4">
                  {group.children.map((child) => {
                    const hasSubChildren = child.children && child.children.length > 0;
                    const isSubOpen = openSubMenus[child.key] ?? true;
                    const isChildSelected =
                      currentMenu === child.key ||
                      (hasSubChildren && child.children?.some((sub) => sub.key === currentMenu));

                    return (
                      <div key={child.key} className="space-y-0.5">
                        <button
                          onClick={() => {
                            if (hasSubChildren) {
                              toggleSubMenu(child.key);
                              onNavigate(child.children![0].key);
                            } else {
                              onNavigate(child.key);
                            }
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between group ${
                            isChildSelected
                              ? 'text-cyan-300 font-semibold bg-cyan-500/10 border-l-2 border-cyan-400'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                          }`}
                        >
                          <span className="truncate">{child.label}</span>
                          <div className="flex items-center gap-1">
                            {hasSubChildren ? (
                              <ChevronDown
                                className={`w-3 h-3 text-slate-500 transition-transform ${
                                  isSubOpen ? 'rotate-180' : ''
                                }`}
                              />
                            ) : (
                              currentMenu === child.key && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              )
                            )}
                          </div>
                        </button>

                        {/* Level 3 items if present */}
                        {hasSubChildren && isSubOpen && (
                          <div className="pl-3.5 space-y-0.5 pt-0.5 border-l border-slate-800 ml-2">
                            {child.children?.map((subChild) => {
                              const isSubSelected = currentMenu === subChild.key;
                              return (
                                <button
                                  key={subChild.key}
                                  onClick={() => onNavigate(subChild.key)}
                                  className={`w-full text-left px-2.5 py-1 rounded text-[11px] transition-colors flex items-center justify-between ${
                                    isSubSelected
                                      ? 'text-cyan-300 font-medium bg-cyan-500/15 text-cyan-200'
                                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                                  }`}
                                >
                                  <span className="truncate">{subChild.label}</span>
                                  {isSubSelected && (
                                    <span className="w-1 h-1 rounded-full bg-cyan-400" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Cluster Health Card */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">全息集群健康指数</span>
              <span className="text-emerald-400 font-mono font-bold">98.4 / 100</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full w-[98.4%]" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>物理节点: 256 节点</span>
              <span>8.4 PB 存储</span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
