import React, { useState, useEffect } from 'react';
import { SoftwareComponent, ComputeJob, MessageQueueTopic, AnalyticalQuery } from '../../types';
import { Layers, MessageSquare, Zap, Globe, BarChart3, Server } from 'lucide-react';
import { WebMiddlewareMonitorView } from './WebMiddlewareMonitorView';
import { MessageQueueView } from '../software/MessageQueueView';
import { CacheMiddlewareMonitorView } from './CacheMiddlewareMonitorView';
import { MiddlewareMonitorStatsView } from './MiddlewareMonitorStatsView';

interface Props {
  components: SoftwareComponent[];
  computeJobs: ComputeJob[];
  topics: MessageQueueTopic[];
  queries: AnalyticalQuery[];
  initialSubTab?: 'web' | 'msg' | 'cache' | 'stats';
  onOpenActionModal: (component: SoftwareComponent) => void;
  onKillQuery: (queryId: string) => void;
  onRefresh: () => void;
}

export const MiddlewareMonitorView: React.FC<Props> = ({
  components,
  computeJobs,
  topics,
  queries,
  initialSubTab = 'web',
  onOpenActionModal,
  onKillQuery,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'web' | 'msg' | 'cache' | 'stats'>(initialSubTab);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  return (
    <div className="space-y-5">
      {/* Top Banner with Sub-Navigation */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Layers className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  中间件监控
                  <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
                    MIDDLEWARE SUITE
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  集中监控 WEB 应用网关 (Nginx/Tomcat)、分布式消息中间件 (Kafka/RocketMQ)、内存缓存 (Redis) 与中间件全息统计
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">中间件集群:</span>
              <span className="text-emerald-400 font-bold">31 个节点在线</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">消息主题:</span>
              <span className="text-blue-300 font-bold">{topics.length} 个 Topics</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">缓存命中:</span>
              <span className="text-purple-300 font-bold">99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'web' && <WebMiddlewareMonitorView onRefresh={onRefresh} />}
      {activeSubTab === 'msg' && <MessageQueueView topics={topics} />}
      {activeSubTab === 'cache' && <CacheMiddlewareMonitorView onRefresh={onRefresh} />}
      {activeSubTab === 'stats' && <MiddlewareMonitorStatsView onRefresh={onRefresh} />}
    </div>
  );
};
