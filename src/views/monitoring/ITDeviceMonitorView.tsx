import React, { useState, useEffect } from 'react';
import { ServerMonitorView } from '../hardware/ServerMonitorView';
import { ModernServerTelemetryView } from '../hardware/ModernServerTelemetryView';
import { StorageMonitorView } from '../hardware/StorageMonitorView';
import { NetworkMonitorView } from '../hardware/NetworkMonitorView';
import { PrototypeNetworkMonitorView } from '../hardware/PrototypeNetworkMonitorView';
import { DatacenterRackView } from '../hardware/DatacenterRackView';
import { ITMonitorStatsView } from './ITMonitorStatsView';
import { ServerNode, StorageDevice, NetworkDevice, DatacenterRack } from '../../types';
import { Server, HardDrive, Network, Layers, BarChart3 } from 'lucide-react';

interface Props {
  servers: ServerNode[];
  storages: StorageDevice[];
  networks: NetworkDevice[];
  racks: DatacenterRack[];
  initialSubTab?: 'server' | 'network' | 'stats';
  onSelectServer: (server: ServerNode) => void;
  onCreateWorkOrderForServer: (server: ServerNode) => void;
  onRefresh: () => void;
}

export const ITDeviceMonitorView: React.FC<Props> = ({
  servers,
  storages,
  networks,
  racks,
  initialSubTab = 'server',
  onSelectServer,
  onCreateWorkOrderForServer,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'server' | 'network' | 'stats'>(initialSubTab || 'server');

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  // Overall IT hardware stats
  const totalServers = servers.length;
  const normalServers = servers.filter((s) => s.status === 'normal').length;
  const warningServers = servers.filter((s) => s.status === 'warning' || s.status === 'critical').length;
  const totalStorageTB = storages.reduce((acc, s) => acc + s.capacityTB, 0);
  const usedStorageTB = storages.reduce((acc, s) => acc + s.usedTB, 0);
  const totalSwitches = networks.length;

  return (
    <div className="space-y-5">
      {/* Top Banner with Sub-Navigation */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Server className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  IT设备监控
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    IT INFRASTRUCTURE
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  集中监控物理服务器硬件状态、400G骨干网络设备、IT监控统计报表与全闪存微模块机架全景
                </p>
              </div>
            </div>
          </div>

          {/* Quick IT Overview metrics */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">服务器在线:</span>
              <span className="text-emerald-400 font-bold">{normalServers}/{totalServers}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Network className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">网络交换:</span>
              <span className="text-cyan-300 font-bold">{totalSwitches} 台交换机</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">总存储:</span>
              <span className="text-blue-300 font-bold">{usedStorageTB}T / {totalStorageTB}T</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Panels */}
      {activeSubTab === 'network' && (
        <PrototypeNetworkMonitorView onRefresh={onRefresh} />
      )}

      {activeSubTab === 'server' && (
        <ModernServerTelemetryView
          servers={servers}
          onSelectServer={onSelectServer}
          onCreateWorkOrderForServer={onCreateWorkOrderForServer}
          onRefresh={onRefresh}
        />
      )}

      {activeSubTab === 'stats' && (
        <ITMonitorStatsView
          servers={servers}
          networks={networks}
          storages={storages}
          onRefresh={onRefresh}
        />
      )}
    </div>
  );
};
