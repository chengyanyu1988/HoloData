import React, { useState, useEffect } from 'react';
import { AlarmItem, AlarmRule } from '../../types';
import { AlertTriangle, Bell, Clock, Shield, Sliders, Check, Activity, BarChart2, Filter } from 'lucide-react';
import { ActiveAlarmsView } from '../alarm/ActiveAlarmsView';
import { AlarmHistoryView } from '../alarm/AlarmHistoryView';
import { AlarmPolicyView } from '../alarm/AlarmPolicyView';

interface Props {
  alarms: AlarmItem[];
  rules: AlarmRule[];
  initialSubTab?: 'info' | 'rules' | 'active' | 'history' | 'policy';
  onOpenAlarmAction: (alarm: AlarmItem) => void;
  onBatchAcknowledgeAll: () => void;
  onToggleRule: (ruleId: string) => void;
}

export const CentralizedAlarmMonitorView: React.FC<Props> = ({
  alarms,
  rules,
  initialSubTab = 'info',
  onOpenAlarmAction,
  onBatchAcknowledgeAll,
  onToggleRule,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'info' | 'rules' | 'active' | 'history' | 'policy'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const activeAlarmsCount = alarms.filter(a => a.status === 'active').length;
  const criticalCount = alarms.filter(a => a.status === 'active' && a.severity === 'critical').length;

  return (
    <div className="space-y-5">
      {/* Top Banner & Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Bell className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                告警管理
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                  ALARM & FILTER RULES SUITE
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                集中管理告警信息事件流、多指标告警过滤规则、降噪与工单闭环处置
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-slate-400">致命告警:</span>
              <span className="text-rose-400 font-bold">{criticalCount} 条</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">活动告警:</span>
              <span className="text-amber-300 font-bold">{activeAlarmsCount} 条</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">过滤规则:</span>
              <span className="text-emerald-400 font-bold">{rules.filter(r => r.enabled).length} 条生效</span>
            </div>
          </div>
        </div>
      </div>

      {/* Render selected view */}
      {(activeSubTab === 'info' || activeSubTab === 'active') && (
        <ActiveAlarmsView
          alarms={alarms}
          onOpenAlarmAction={onOpenAlarmAction}
          onBatchAcknowledgeAll={onBatchAcknowledgeAll}
        />
      )}

      {(activeSubTab === 'rules' || activeSubTab === 'policy') && (
        <AlarmPolicyView
          rules={rules}
          onToggleRule={onToggleRule}
        />
      )}

      {activeSubTab === 'history' && (
        <AlarmHistoryView />
      )}
    </div>
  );
};
