import React, { useState, useEffect } from 'react';
import { DatabaseInstance } from '../../types';
import { 
  Database, RefreshCw, Search, CheckCircle2, AlertTriangle, 
  Terminal, Activity, HardDrive, Cpu, ShieldCheck, Zap, 
  Clock, ArrowUpRight, Flame, BarChart3, ChevronRight,
  Folder, FolderOpen, FileText, ArrowDownLeft, Sliders, Radio
} from 'lucide-react';
import { DatabaseMonitorStatsView } from './DatabaseMonitorStatsView';

interface Props {
  databases: DatabaseInstance[];
  initialSubTab?: 'data' | 'stats';
  onOpenTerminal: (name: string, ip: string) => void;
  onRefresh: () => void;
}

interface TreeDbItem {
  id: string;
  name: string;
  engine: string;
  type: string; // 'mysql' | 'clickhouse' | 'pg' | 'doris'
  version: string;
  status: 'healthy' | 'warning' | 'critical';
  uptime: string;
  startTime: string;
  portStatus: string;
  // 10 Exact Screenshot Metrics
  beginPerSec: number;
  insertPerSec: number;
  selectPerSec: number;
  deletePerSec: number;
  updatePerSec: number;
  commitPerSec: number;
  rollbackPerSec: number;
  bytesReceivedPerSec: number;
  bytesSentPerSec: number;
  slowQueryCount: number;
}

const DEFAULT_TREE_DATABASES: TreeDbItem[] = [
  {
    id: 'db-mysql-01',
    name: 'sys_orders_master_01',
    engine: 'MySQL',
    type: 'mysql',
    version: 'MySQL 8.0.36-28 Enterprise (InnoDB Engine)',
    status: 'healthy',
    uptime: '142天 08小时 25分',
    startTime: '2026-06-16 14:00:00',
    portStatus: '3306 (Listen / 监听中)',
    beginPerSec: 23,
    insertPerSec: 18,
    selectPerSec: 450,
    deletePerSec: 12,
    updatePerSec: 85,
    commitPerSec: 320,
    rollbackPerSec: 0,
    bytesReceivedPerSec: 1280450,
    bytesSentPerSec: 8450120,
    slowQueryCount: 2,
  },
  {
    id: 'db-mysql-02',
    name: 'user_center_replica_02',
    engine: 'MySQL',
    type: 'mysql',
    version: 'MySQL 8.0.36 Replica (Read-Only)',
    status: 'healthy',
    uptime: '98天 14小时 10分',
    startTime: '2026-07-30 09:15:00',
    portStatus: '3306 (Listen / 监听中)',
    beginPerSec: 15,
    insertPerSec: 0,
    selectPerSec: 820,
    deletePerSec: 0,
    updatePerSec: 0,
    commitPerSec: 15,
    rollbackPerSec: 0,
    bytesReceivedPerSec: 840200,
    bytesSentPerSec: 12450800,
    slowQueryCount: 0,
  },
  {
    id: 'db-mysql-03',
    name: 'inventory_cluster_db',
    engine: 'MySQL',
    type: 'mysql',
    version: 'MySQL 8.0.36 InnoDB Cluster',
    status: 'healthy',
    uptime: '210天 10小时 00分',
    startTime: '2026-04-09 13:00:00',
    portStatus: '3306 (Listen / 监听中)',
    beginPerSec: 42,
    insertPerSec: 35,
    selectPerSec: 610,
    deletePerSec: 8,
    updatePerSec: 140,
    commitPerSec: 480,
    rollbackPerSec: 1,
    bytesReceivedPerSec: 2100800,
    bytesSentPerSec: 15800400,
    slowQueryCount: 1,
  },
  {
    id: 'db-ck-01',
    name: 'ck_events_cluster_shard1',
    engine: 'ClickHouse',
    type: 'clickhouse',
    version: 'ClickHouse 24.3.2.14 LTS (ReplicatedMergeTree)',
    status: 'healthy',
    uptime: '180天 05小时 12分',
    startTime: '2026-05-09 18:30:00',
    portStatus: '8123 / 9000 (Listen / 监听中)',
    beginPerSec: 0,
    insertPerSec: 12500,
    selectPerSec: 3200,
    deletePerSec: 0,
    updatePerSec: 0,
    commitPerSec: 0,
    rollbackPerSec: 0,
    bytesReceivedPerSec: 45200000,
    bytesSentPerSec: 128400000,
    slowQueryCount: 3,
  },
  {
    id: 'db-pg-01',
    name: 'pg_billing_db_primary',
    engine: 'PostgreSQL',
    type: 'pg',
    version: 'PostgreSQL 16.2 (Patroni HA Cluster)',
    status: 'healthy',
    uptime: '150天 12小时 45分',
    startTime: '2026-06-08 11:20:00',
    portStatus: '5432 (Listen / 监听中)',
    beginPerSec: 85,
    insertPerSec: 64,
    selectPerSec: 1240,
    deletePerSec: 5,
    updatePerSec: 210,
    commitPerSec: 850,
    rollbackPerSec: 2,
    bytesReceivedPerSec: 4200100,
    bytesSentPerSec: 24800900,
    slowQueryCount: 1,
  },
];

export const DatabaseMonitorView: React.FC<Props> = ({
  databases,
  initialSubTab = 'data',
  onOpenTerminal,
  onRefresh
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'data' | 'stats'>(initialSubTab);
  const [treeSearch, setTreeSearch] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    mysql: true,
    clickhouse: true,
    pg: true,
  });
  const [selectedDb, setSelectedDb] = useState<TreeDbItem>(DEFAULT_TREE_DATABASES[0]);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const filteredTreeDbs = DEFAULT_TREE_DATABASES.filter(d => 
    d.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
    d.engine.toLowerCase().includes(treeSearch.toLowerCase())
  );

  const mysqlList = filteredTreeDbs.filter(d => d.type === 'mysql');
  const ckList = filteredTreeDbs.filter(d => d.type === 'clickhouse');
  const pgList = filteredTreeDbs.filter(d => d.type === 'pg');

  return (
    <div className="space-y-5">
      {/* Top Banner with Sub-Navigation */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Database className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  数据库监控
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    DATABASE CLUSTERS
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  集中监控 MySQL 8.0 核心业务库、ClickHouse 分析引擎、PostgreSQL 16 与数据库实时 SQL 吞吐统计
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">数据库实例:</span>
              <span className="text-emerald-400 font-bold">{DEFAULT_TREE_DATABASES.length} 个集群实例</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-400">活跃 SQL QPS:</span>
              <span className="text-blue-300 font-bold">18,450 req/s</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">慢查询:</span>
              <span className="text-amber-300 font-bold">4 条</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Content: Stats View */}
      {activeSubTab === 'stats' && (
        <DatabaseMonitorStatsView onRefresh={onRefresh} />
      )}

      {/* Subtab Content: Data View (Rebuilt based on image_3bc0f30b.png) */}
      {activeSubTab === 'data' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel (lg:col-span-3): 数据库列表 Tree View */}
          <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col h-[740px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>数据库列表</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {DEFAULT_TREE_DATABASES.length}
              </span>
            </div>

            {/* Tree Search Box */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                placeholder="请输入名称"
                value={treeSearch}
                onChange={(e) => setTreeSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            {/* Tree Nodes List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {/* MySQL Folder */}
              <div>
                <button
                  onClick={() => toggleFolder('mysql')}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-800/60 text-slate-300 font-bold text-left transition-colors"
                >
                  {expandedFolders.mysql ? (
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-cyan-400" />
                  )}
                  <span>MySQL</span>
                </button>
                {expandedFolders.mysql && (
                  <div className="pl-4 space-y-1 mt-0.5 border-l border-slate-800 ml-3">
                    {mysqlList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDb(item)}
                        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition-colors ${
                          selectedDb.id === item.id
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ClickHouse Folder */}
              <div>
                <button
                  onClick={() => toggleFolder('clickhouse')}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-800/60 text-slate-300 font-bold text-left transition-colors"
                >
                  {expandedFolders.clickhouse ? (
                    <FolderOpen className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-purple-400" />
                  )}
                  <span>ClickHouse</span>
                </button>
                {expandedFolders.clickhouse && (
                  <div className="pl-4 space-y-1 mt-0.5 border-l border-slate-800 ml-3">
                    {ckList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDb(item)}
                        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition-colors ${
                          selectedDb.id === item.id
                            ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PostgreSQL Folder */}
              <div>
                <button
                  onClick={() => toggleFolder('pg')}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-800/60 text-slate-300 font-bold text-left transition-colors"
                >
                  {expandedFolders.pg ? (
                    <FolderOpen className="w-4 h-4 text-blue-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-blue-400" />
                  )}
                  <span>PostgreSQL</span>
                </button>
                {expandedFolders.pg && (
                  <div className="pl-4 space-y-1 mt-0.5 border-l border-slate-800 ml-3">
                    {pgList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedDb(item)}
                        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition-colors ${
                          selectedDb.id === item.id
                            ? 'bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Main Content (lg:col-span-9): 基本信息 & 监控统计 */}
          <div className="lg:col-span-9 space-y-5">
            {/* 1. 基本信息 Card (e.g. MySQL基本信息) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    {selectedDb.engine}基本信息 ({selectedDb.name})
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                    运行状态: 正常运行 (Healthy)
                  </span>
                  <button
                    onClick={() => onOpenTerminal(`sql-cli --host ${selectedDb.name}`, selectedDb.name)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 flex items-center gap-1 transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>SQL 控制台</span>
                  </button>
                </div>
              </div>

              {/* 4 Exact Header Fields from Screenshot */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1 font-mono text-xs">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block">版本信息 :</span>
                  <span className="text-slate-200 font-bold block truncate" title={selectedDb.version}>
                    {selectedDb.version}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block">运行状态 :</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    正常运行
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block">运行时间 :</span>
                  <span className="text-cyan-300 font-bold block">
                    {selectedDb.uptime}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block">端口状态 :</span>
                  <span className="text-indigo-300 font-bold block">
                    {selectedDb.portStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. 监控统计 Section (10 Exact Metric Badges from Screenshot) */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    监控统计 (SQL Execution & IO Telemetry)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  采样频率: 1s 实时上报
                </span>
              </div>

              {/* Grid of 10 Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 font-mono">
                {/* 1. 每秒begin数量 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒begin数量</span>
                  <div className="text-2xl font-black text-cyan-300">
                    {selectedDb.beginPerSec}
                  </div>
                  <span className="text-[10px] text-slate-500 block">START TRANSACTION</span>
                </div>

                {/* 2. 每秒插入操作数 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒插入操作数</span>
                  <div className="text-2xl font-black text-emerald-400">
                    {selectedDb.insertPerSec}
                  </div>
                  <span className="text-[10px] text-emerald-500 block">INSERT ops/s</span>
                </div>

                {/* 3. 每秒查询操作数 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒查询操作数</span>
                  <div className="text-2xl font-black text-blue-400">
                    {selectedDb.selectPerSec}
                  </div>
                  <span className="text-[10px] text-blue-500 block">SELECT ops/s</span>
                </div>

                {/* 4. 每秒删除操作数 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒删除操作数</span>
                  <div className="text-2xl font-black text-purple-300">
                    {selectedDb.deletePerSec}
                  </div>
                  <span className="text-[10px] text-purple-500 block">DELETE ops/s</span>
                </div>

                {/* 5. 每秒更新操作数 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒更新操作数</span>
                  <div className="text-2xl font-black text-indigo-300">
                    {selectedDb.updatePerSec}
                  </div>
                  <span className="text-[10px] text-indigo-500 block">UPDATE ops/s</span>
                </div>

                {/* 6. 每秒commit数 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒commit数</span>
                  <div className="text-2xl font-black text-emerald-300">
                    {selectedDb.commitPerSec}
                  </div>
                  <span className="text-[10px] text-emerald-500 block">COMMIT ops/s</span>
                </div>

                {/* 7. 每秒rollback数 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒rollback数</span>
                  <div className={`text-2xl font-black ${selectedDb.rollbackPerSec > 0 ? 'text-amber-400' : 'text-slate-400'}`}>
                    {selectedDb.rollbackPerSec}
                  </div>
                  <span className="text-[10px] text-slate-500 block">ROLLBACK ops/s</span>
                </div>

                {/* 8. 每秒接收字节 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒接收字节</span>
                  <div className="text-xl font-black text-cyan-300">
                    {(selectedDb.bytesReceivedPerSec / 1024 / 1024).toFixed(2)} <span className="text-xs text-slate-400">MB/s</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Network Inbound</span>
                </div>

                {/* 9. 每秒发送字节 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">每秒发送字节</span>
                  <div className="text-xl font-black text-blue-300">
                    {(selectedDb.bytesSentPerSec / 1024 / 1024).toFixed(2)} <span className="text-xs text-slate-400">MB/s</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">Network Outbound</span>
                </div>

                {/* 10. 慢查询 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700 transition-colors">
                  <span className="text-[11px] text-slate-400 block truncate">慢查询</span>
                  <div className={`text-2xl font-black ${selectedDb.slowQueryCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {selectedDb.slowQueryCount} <span className="text-xs font-normal text-slate-400">条</span>
                  </div>
                  <span className="text-[10px] text-amber-500/80 block">&gt;500ms Slow SQL</span>
                </div>
              </div>

              {/* Extra SQL Execution Breakdown Viz */}
              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-300 font-mono">
                    <span className="font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      DML 读写比例分布
                    </span>
                    <span className="text-blue-300">SELECT 占 78.5%</span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="bg-blue-500 h-full" style={{ width: '78.5%' }} title="SELECT" />
                    <div className="bg-emerald-500 h-full" style={{ width: '14.8%' }} title="UPDATE" />
                    <div className="bg-purple-500 h-full" style={{ width: '4.6%' }} title="INSERT" />
                    <div className="bg-amber-500 h-full" style={{ width: '2.1%' }} title="DELETE" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-blue-400">■ SELECT (450)</span>
                    <span className="text-indigo-400">■ UPDATE (85)</span>
                    <span className="text-emerald-400">■ INSERT (18)</span>
                    <span className="text-amber-400">■ DELETE (12)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-300 font-mono">
                    <span className="font-bold flex items-center gap-1.5">
                      <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
                      网络吞吐 (In vs Out)
                    </span>
                    <span className="text-emerald-400">发送比接收高 6.6 倍</span>
                  </div>
                  <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden flex">
                    <div className="bg-cyan-500 h-full" style={{ width: '13%' }} title="Inbound" />
                    <div className="bg-blue-600 h-full" style={{ width: '87%' }} title="Outbound" />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span className="text-cyan-400">Inbound: 1.22 MB/s</span>
                    <span className="text-blue-400">Outbound: 8.06 MB/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
