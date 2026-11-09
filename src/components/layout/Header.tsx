import React, { useState } from 'react';
import {
  Search,
  Bell,
  RefreshCw,
  Sun,
  Moon,
  ChevronRight,
  Shield,
  Activity,
  User,
  Sliders,
  CheckCircle,
  LogOut,
} from 'lucide-react';
import { MenuKey, AlarmItem } from '../../types';
import { NAVIGATION_GROUPS } from '../../data/navigation';

interface HeaderProps {
  currentMenu: MenuKey;
  onNavigate: (key: MenuKey) => void;
  onOpenSearch: () => void;
  alarms: AlarmItem[];
  onOpenAlarmAction: (alarm: AlarmItem) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMenu,
  onNavigate,
  onOpenSearch,
  alarms,
  onOpenAlarmAction,
  isDark,
  onToggleTheme,
  onRefresh,
  isRefreshing,
  onLogout,
}) => {
  const [showAlarmDropdown, setShowAlarmDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [timeRange, setTimeRange] = useState<'5m' | '1h' | '24h' | '7d'>('5m');

  // Find current group and item (including nested children)
  let currentGroupLabel = '集中监控';
  let currentItemLabel = 'IT设备监控';
  let subItemLabel = '';

  for (const group of NAVIGATION_GROUPS) {
    for (const child of group.children) {
      if (child.key === currentMenu) {
        currentGroupLabel = group.label;
        currentItemLabel = child.label;
        break;
      }
      if (child.children) {
        const sub = child.children.find((s) => s.key === currentMenu);
        if (sub) {
          currentGroupLabel = group.label;
          currentItemLabel = child.label;
          subItemLabel = sub.label;
          break;
        }
      }
    }
  }

  const activeAlarms = alarms.filter((a) => a.status === 'active');

  return (
    <header className="h-16 px-6 bg-slate-900/90 dark:bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between gap-6 backdrop-blur-md sticky top-0 z-30 select-none">
      {/* Left: Breadcrumbs & Telemetry Status */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
          <span className="text-cyan-400 font-semibold">数据全息管理系统</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">{currentGroupLabel}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className={subItemLabel ? 'text-slate-400' : 'text-slate-100 font-semibold'}>{currentItemLabel}</span>
          {subItemLabel && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-slate-100 font-semibold">{subItemLabel}</span>
            </>
          )}
        </div>

        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>全息遥测流已连接 (2.0s 周期)</span>
        </div>
      </div>

      {/* Center: Spotlight Search Launcher */}
      <div className="flex-1 max-w-md hidden md:block">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-slate-950/60 hover:bg-slate-950/90 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300" />
            <span>检索主机、物理机柜、Flink 作业、Kafka 或工单...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-400 rounded border border-slate-700 font-mono">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right Action Zone */}
      <div className="flex items-center gap-3 shrink-0">


        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          title="立即同步最新全息遥测数据"
          className="p-2 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* Alarm Bell with Quick Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlarmDropdown(!showAlarmDropdown)}
            title="实时告警中心"
            className="p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {activeAlarms.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-slate-900" />
            )}
          </button>

          {showAlarmDropdown && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 space-y-2 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200">
                  即时未恢复告警 ({activeAlarms.length})
                </span>
                <button
                  onClick={() => {
                    onNavigate('alarm_active');
                    setShowAlarmDropdown(false);
                  }}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  查看全部 &gt;
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {activeAlarms.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500">
                    当前集群无任何严重或阻断性告警
                  </div>
                ) : (
                  activeAlarms.map((alm) => (
                    <div
                      key={alm.id}
                      onClick={() => {
                        onOpenAlarmAction(alm);
                        setShowAlarmDropdown(false);
                      }}
                      className="p-2 rounded bg-slate-950 hover:bg-slate-800/80 border border-slate-800 cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-rose-400 font-bold font-mono">
                          {alm.severity.toUpperCase()}
                        </span>
                        <span className="text-slate-500 font-mono text-[10px]">
                          {alm.firstTriggeredAt.slice(11)}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200 truncate">
                        {alm.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate font-mono">
                        {alm.sourceEntity}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDark ? '切换至明亮主题' : '切换至暗色科技主题'}
          className="p-2 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-slate-800" />

        {/* User Profile Pill */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1 pl-1.5 pr-2.5 rounded-lg hover:bg-slate-800 transition-colors text-left"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 ring-1 ring-cyan-500/40 relative">
              <img
                src="/src/assets/images/avatar_admin_user_1793932083987.jpg"
                alt="程总工"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image load fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="w-full h-full flex items-center justify-center bg-cyan-900 text-cyan-200 text-xs font-bold">
                程
              </div>
            </div>
            <div className="hidden xl:block">
              <div className="text-xs font-semibold text-slate-200 leading-none">程总工</div>
              <div className="text-[10px] text-cyan-400 font-mono mt-0.5">超级管理员</div>
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1">
              <div className="p-2 border-b border-slate-800">
                <div className="font-semibold text-slate-100">程总工 (Chief Architect)</div>
                <div className="text-[11px] text-slate-400 truncate">chengyanyu1988@gmail.com</div>
              </div>
              <button
                onClick={() => {
                  onNavigate('sec_users');
                  setShowUserDropdown(false);
                }}
                className="w-full px-2.5 py-1.5 text-left text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-cyan-400" />
                个人账户与安全密钥 (MFA)
              </button>
              <button
                onClick={() => {
                  onNavigate('sec_audit');
                  setShowUserDropdown(false);
                }}
                className="w-full px-2.5 py-1.5 text-left text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                我的操作合规审计日志
              </button>
              <button
                onClick={() => {
                  onNavigate('cfg_params');
                  setShowUserDropdown(false);
                }}
                className="w-full px-2.5 py-1.5 text-left text-slate-300 hover:bg-slate-800 rounded flex items-center gap-2"
              >
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                全息集群控制台参数设置
              </button>
              {onLogout && (
                <div className="pt-1 mt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onLogout();
                    }}
                    className="w-full px-2.5 py-1.5 text-left text-rose-400 hover:bg-rose-500/10 rounded flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
