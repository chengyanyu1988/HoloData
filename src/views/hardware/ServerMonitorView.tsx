import React, { useState, useMemo } from 'react';
import {
  Server,
  Search,
  Filter,
  Cpu,
  Activity,
  Thermometer,
  Zap,
  Terminal,
  ArrowUpDown,
  LayoutGrid,
  List,
  Plus,
} from 'lucide-react';
import { ServerNode, HardwareStatus } from '../../types';

interface ServerMonitorViewProps {
  servers: ServerNode[];
  onSelectServer: (server: ServerNode) => void;
  onCreateWorkOrderForServer: (server: ServerNode) => void;
}

export const ServerMonitorView: React.FC<ServerMonitorViewProps> = ({
  servers,
  onSelectServer,
  onCreateWorkOrderForServer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortField, setSortField] = useState<'cpuUsage' | 'cpuTemp' | 'hostname'>('cpuUsage');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredServers = useMemo(() => {
    return servers
      .filter((s) => {
        const matchesSearch =
          s.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.ip.includes(searchTerm) ||
          s.rack.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || s.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [servers, searchTerm, roleFilter, statusFilter, sortField, sortOrder]);

  const getStatusBadge = (status: HardwareStatus) => {
    switch (status) {
      case 'normal':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'warning':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'critical':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>物理服务器硬件监控</span>
            <span className="text-xs font-normal text-slate-400">· 256 台高密算力节点硬件健康度</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            监控主板芯片组、双路 CPU 核心温度、内存条阵列、热插拔风扇转速与 IPMI 带外状态
          </p>
        </div>

        {/* View Toggle & Count */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="表格视图"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="卡片视图"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索主机名、物理机 IP (如 10.120)、机架号..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">角色类型:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">全部角色</option>
              <option value="Master">Master 主控</option>
              <option value="Compute-Worker">Compute 计算</option>
              <option value="Storage-Worker">Storage 存储</option>
              <option value="GPU-AI">GPU-AI 智算</option>
              <option value="Gateway">Gateway 网关</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400">硬件状态:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">全部状态</option>
              <option value="normal">健康正常</option>
              <option value="warning">负载预警</option>
              <option value="critical">故障临界</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content: Table or Grid */}
      {viewMode === 'table' ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-medium">
                <tr>
                  <th className="py-3 px-4">主机名 / ID</th>
                  <th className="py-3 px-4">业务 IP / BMC IP</th>
                  <th className="py-3 px-4">机柜位置</th>
                  <th className="py-3 px-4">节点角色</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-cyan-400"
                    onClick={() => {
                      if (sortField === 'cpuUsage') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else {
                        setSortField('cpuUsage');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>CPU 负载</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-cyan-400"
                    onClick={() => {
                      if (sortField === 'cpuTemp') setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                      else {
                        setSortField('cpuTemp');
                        setSortOrder('desc');
                      }
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <span>核心温度</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3 px-4">内存分配</th>
                  <th className="py-3 px-4">风扇 / 功耗</th>
                  <th className="py-3 px-4">状态</th>
                  <th className="py-3 px-4 text-right">快捷操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredServers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-8 text-center text-slate-500">
                      未检索到符合条件的物理服务器
                    </td>
                  </tr>
                ) : (
                  filteredServers.map((srv) => (
                    <tr
                      key={srv.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200 group-hover:text-cyan-300">
                          {srv.hostname}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">{srv.id}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="text-slate-200">{srv.ip}</div>
                        <div className="text-[11px] text-slate-500">BMC: {srv.bmcIp}</div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300">
                        {srv.rack} ({srv.rackUnit})
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-300">{srv.role}</span>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        <div className="flex items-center gap-2">
                          <span
                            className={
                              srv.cpuUsage > 85
                                ? 'text-rose-400 font-bold'
                                : srv.cpuUsage > 70
                                ? 'text-amber-400 font-medium'
                                : 'text-slate-200'
                            }
                          >
                            {srv.cpuUsage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-16 bg-slate-800 rounded-full h-1 mt-1 overflow-hidden">
                          <div
                            className={`h-full ${
                              srv.cpuUsage > 85 ? 'bg-rose-500' : srv.cpuUsage > 70 ? 'bg-amber-500' : 'bg-cyan-500'
                            }`}
                            style={{ width: `${srv.cpuUsage}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums">
                        <span
                          className={
                            srv.cpuTemp > 75
                              ? 'text-rose-400 font-bold'
                              : srv.cpuTemp > 60
                              ? 'text-amber-400'
                              : 'text-slate-300'
                          }
                        >
                          {srv.cpuTemp.toFixed(1)}°C
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-300 tabular-nums">
                        {srv.memUsedGB}G / {srv.memTotalGB}GB
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        <div>{srv.fanSpeedRpm} RPM</div>
                        <div>{srv.powerWatts}W 功耗</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] px-2 py-0.5 rounded border font-medium ${getStatusBadge(srv.status)}`}>
                          {srv.status === 'normal' ? '健康' : srv.status === 'warning' ? '预警' : '临界故障'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectServer(srv)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-slate-300 font-medium transition-colors"
                          >
                            硬件诊断
                          </button>
                          <button
                            onClick={() => onCreateWorkOrderForServer(srv)}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 transition-colors"
                            title="针对此服务器提报报修工单"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid Cards View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredServers.map((srv) => (
            <div
              key={srv.id}
              onClick={() => onSelectServer(srv)}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-bold text-slate-100 group-hover:text-cyan-300 text-sm">
                    {srv.hostname}
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {srv.ip} · 机架 {srv.rack}
                  </div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded border font-medium ${getStatusBadge(srv.status)}`}>
                  {srv.status === 'normal' ? '正常' : srv.status === 'warning' ? '预警' : '临界'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono p-2.5 rounded bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">CPU 使用率</span>
                  <span className="text-slate-200 font-bold">{srv.cpuUsage.toFixed(1)}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">核心温度</span>
                  <span className={srv.cpuTemp > 75 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {srv.cpuTemp.toFixed(1)}°C
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">内存占用</span>
                  <span className="text-slate-200">
                    {Math.round((srv.memUsedGB / srv.memTotalGB) * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">整机功耗</span>
                  <span className="text-slate-200">{srv.powerWatts}W</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="truncate">{srv.model}</span>
                <span className="text-cyan-400 font-semibold group-hover:underline">展开详情 &gt;</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
