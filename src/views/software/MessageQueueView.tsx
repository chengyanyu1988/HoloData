import React, { useState } from 'react';
import {
  Zap, Activity, AlertTriangle, Layers, Database, ArrowUpDown,
  Search, RefreshCw, ChevronRight, Server, MessageSquare, HardDrive,
  Cpu, SlidersHorizontal, ArrowDownLeft, ArrowUpRight, Gauge, ChevronDown, CheckCircle2
} from 'lucide-react';
import { MessageQueueTopic } from '../../types';

interface MessageQueueViewProps {
  topics?: MessageQueueTopic[];
  onRefresh?: () => void;
}

interface MessageQueueClusterItem {
  id: string;
  name: string;
  clusterName: string;
  type: 'Apache Kafka 3.7' | 'Apache RocketMQ 5.2' | 'RabbitMQ 3.13 Cluster';
  ip: string;
  uptime: string;
  startTime: string;
  heapTotalGB: number;
  heapUsedGB: number;
  heapFreeGB: number;
  nonHeapTotalGB: number;
  nonHeapUsedGB: number;
  nonHeapFreeGB: number;
  // Topic Indicators
  topicMsgInPerSec: number; // 90
  topicBytesInPerSec: number; // 125
  topicBytesOutPerSec: number; // 234
  topicRejectedBytesPerSec: number; // 12
  topicFetchFailedCountPerSec: number; // 45
  // Broker Indicators
  syncFailedReplicas: number; // 0
  leaderReplicas: number; // 150
  partitionCount: number; // 568
  offlinePartitions: number; // 0
  leaderElectionTimeMs: number; // 90
  consumerProduceFetchTimeMs: number; // 120
  maxLagFollowerLeader: number; // 1233
}

const MQ_TREE_DATA: MessageQueueClusterItem[] = [
  {
    id: 'mq-01',
    name: 'hologram-kafka-cluster-prod',
    clusterName: 'Kafka 生产核心集群 (KRaft)',
    type: 'Apache Kafka 3.7',
    ip: '10.120.40.11:9092',
    uptime: '158天 12小时 40分',
    startTime: '2026-06-01 00:00:00',
    heapTotalGB: 36,
    heapUsedGB: 12,
    heapFreeGB: 24,
    nonHeapTotalGB: 36,
    nonHeapUsedGB: 8,
    nonHeapFreeGB: 28,
    topicMsgInPerSec: 90,
    topicBytesInPerSec: 125,
    topicBytesOutPerSec: 234,
    topicRejectedBytesPerSec: 12,
    topicFetchFailedCountPerSec: 45,
    syncFailedReplicas: 0,
    leaderReplicas: 150,
    partitionCount: 568,
    offlinePartitions: 0,
    leaderElectionTimeMs: 90,
    consumerProduceFetchTimeMs: 120,
    maxLagFollowerLeader: 1233,
  },
  {
    id: 'mq-02',
    name: 'hologram-rocketmq-trade-bus',
    clusterName: 'RocketMQ 交易消息总线',
    type: 'Apache RocketMQ 5.2',
    ip: '10.120.40.15:9876',
    uptime: '88天 06小时 15分',
    startTime: '2026-08-09 14:00:00',
    heapTotalGB: 36,
    heapUsedGB: 15,
    heapFreeGB: 21,
    nonHeapTotalGB: 36,
    nonHeapUsedGB: 10,
    nonHeapFreeGB: 26,
    topicMsgInPerSec: 180,
    topicBytesInPerSec: 260,
    topicBytesOutPerSec: 480,
    topicRejectedBytesPerSec: 0,
    topicFetchFailedCountPerSec: 8,
    syncFailedReplicas: 0,
    leaderReplicas: 210,
    partitionCount: 840,
    offlinePartitions: 0,
    leaderElectionTimeMs: 45,
    consumerProduceFetchTimeMs: 85,
    maxLagFollowerLeader: 420,
  },
  {
    id: 'mq-03',
    name: 'hologram-rabbitmq-async-tasks',
    clusterName: 'RabbitMQ 异步任务队列',
    type: 'RabbitMQ 3.13 Cluster',
    ip: '10.120.40.20:5672',
    uptime: '45天 20小时 10分',
    startTime: '2026-09-21 08:30:00',
    heapTotalGB: 36,
    heapUsedGB: 9,
    heapFreeGB: 27,
    nonHeapTotalGB: 36,
    nonHeapUsedGB: 6,
    nonHeapFreeGB: 30,
    topicMsgInPerSec: 45,
    topicBytesInPerSec: 85,
    topicBytesOutPerSec: 140,
    topicRejectedBytesPerSec: 0,
    topicFetchFailedCountPerSec: 2,
    syncFailedReplicas: 0,
    leaderReplicas: 90,
    partitionCount: 360,
    offlinePartitions: 0,
    leaderElectionTimeMs: 25,
    consumerProduceFetchTimeMs: 60,
    maxLagFollowerLeader: 150,
  },
];

export const MessageQueueView: React.FC<MessageQueueViewProps> = ({ onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string>('mq-01');
  const [selectedTopicMetricIndex, setSelectedTopicMetricIndex] = useState<string>('测试指标1');
  const [selectedBrokerMetricIndex, setSelectedBrokerMetricIndex] = useState<string>('测试指标1');

  const selectedMq = MQ_TREE_DATA.find(m => m.id === selectedId) || MQ_TREE_DATA[0];

  const filteredClusters = MQ_TREE_DATA.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.clusterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.ip.includes(searchTerm)
  );

  const heapUsedPercent = ((selectedMq.heapUsedGB / selectedMq.heapTotalGB) * 100).toFixed(1);
  const nonHeapUsedPercent = ((selectedMq.nonHeapUsedGB / selectedMq.nonHeapTotalGB) * 100).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <MessageSquare className="w-4 h-4" />
          </span>
          <span className="text-blue-400 font-semibold">集中监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-400">中间件监控</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-slate-100 font-bold">消息中间件监控</span>
          <span className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            采样时间: 2026-11-05 (近期实时)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`已针对 [${selectedMq.clusterName}] 发起 Rebalance 分区对齐诊断`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors font-mono"
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            集群健康巡检
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Workspace: Left 消息监控列表 + Right Telemetry Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ========================================================================= */}
        {/* Left Column: 消息监控列表 Search & Tree Navigation */}
        {/* ========================================================================= */}
        <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              消息监控列表
            </span>
            <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
              {MQ_TREE_DATA.length} 集群
            </span>
          </div>

          {/* Search Box matching screenshot header */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="请输入名称"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Tree Nodes List */}
          <div className="space-y-1 font-mono text-xs pt-1">
            <div className="text-[11px] text-slate-400 px-2 py-1 font-semibold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>消息监控 (Message Queue)</span>
            </div>

            <div className="pl-3 space-y-1">
              {filteredClusters.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                    selectedId === item.id
                      ? 'bg-blue-600/25 text-blue-300 border border-blue-500/40 shadow-xs font-bold'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full ${selectedId === item.id ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-slate-500 ${selectedId === item.id ? 'text-blue-300' : ''}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono border-t border-slate-800/80 flex justify-between">
            <span>吞吐 SLA: 99.999%</span>
            <span className="text-emerald-400">副本同步无缺损</span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Column: 内存(非饼图) | Topic指标 | broker指标 */}
        {/* ========================================================================= */}
        <div className="lg:col-span-9 space-y-4">

          {/* Top Block: 内存 (Replaced Donut Charts with LED Volume Meter & Concentric Ring Dial) */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-cyan-400" />
                内存 (Broker JVM Memory Capacity)
              </span>
              <span className="text-xs font-mono text-cyan-300 flex items-center gap-2">
                <span>集群: {selectedMq.name}</span>
                <span className="text-slate-500">|</span>
                <span>IP: {selectedMq.ip}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              {/* Left Donut Replacement: 20-Segment Glowing LED Progress Meter for 堆内存使用率 */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">堆内存使用率</span>
                  <span className="text-xs font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    堆内存使用率: {heapUsedPercent}%
                  </span>
                </div>

                <div className="space-y-2 py-1 font-mono">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Heap 堆内存总量</span>
                    <span className="text-cyan-300 font-bold">{selectedMq.heapUsedGB}G / {selectedMq.heapTotalGB}G</span>
                  </div>

                  {/* 20-segment LED horizontal bar graph gauge */}
                  <div className="grid grid-cols-20 gap-1 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {Array.from({ length: 20 }).map((_, i) => {
                      const filledCount = Math.round((selectedMq.heapUsedGB / selectedMq.heapTotalGB) * 20);
                      const isFilled = i < filledCount;
                      return (
                        <div
                          key={i}
                          className={`h-6 rounded-xs transition-all duration-300 ${
                            isFilled
                              ? 'bg-cyan-400 shadow-sm shadow-cyan-400/50'
                              : 'bg-slate-800/60'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>空闲率: {(100 - parseFloat(heapUsedPercent)).toFixed(1)}%</span>
                    <span>堆内存使用率: {heapUsedPercent}%</span>
                  </div>
                </div>
              </div>

              {/* Right Donut Replacement: Concentric Dual-Ring Arc Gauge for 非堆内存使用率 */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">非堆内存使用率</span>
                  <span className="text-xs font-mono text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    非堆内存使用率: {nonHeapUsedPercent}%
                  </span>
                </div>

                <div className="flex items-center justify-around py-1 font-mono">
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1e293b" strokeWidth="10" />
                      <circle
                        cx="50" cy="50" r="38" fill="transparent"
                        stroke="#3b82f6" strokeWidth="10"
                        strokeDasharray="238.76"
                        strokeDashoffset={`${238.76 * (1 - selectedMq.nonHeapUsedGB / selectedMq.nonHeapTotalGB)}`}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    </svg>
                    <div className="absolute text-center select-none">
                      <span className="text-lg font-black text-blue-300">{selectedMq.nonHeapUsedGB}G</span>
                      <span className="text-[9px] text-slate-400 block font-mono">已用非堆</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">Metaspace 总量:</span>
                      <span className="text-slate-100 font-bold">{selectedMq.nonHeapTotalGB}G</span>
                    </div>
                    <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-0.5">
                      <span className="text-[10px] text-slate-500 block">空闲 / 使用:</span>
                      <span className="text-blue-300 font-bold">{selectedMq.nonHeapFreeGB}G / {selectedMq.nonHeapUsedGB}G</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Middle Block: Topic指标 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                Topic指标
              </span>

              {/* Dropdown Selector on Top Right matching screenshot */}
              <select
                value={selectedTopicMetricIndex}
                onChange={(e) => setSelectedTopicMetricIndex(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
              >
                <option value="测试指标1">测试指标1</option>
                <option value="核心消费数据流">核心消费数据流</option>
                <option value="高吞吐写流控">高吞吐写流控</option>
              </select>
            </div>

            {/* 5 Big Telemetry Metric Cards matching screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono text-center">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-rose-500">
                  {selectedMq.topicMsgInPerSec}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  topic消息入站速率(信息)<br />
                  <span className="text-[10px] text-slate-500 font-mono">(Message/s)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.topicBytesInPerSec}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  topic消息入站速率(字节)<br />
                  <span className="text-[10px] text-slate-500 font-mono">(Bytes/s)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.topicBytesOutPerSec}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  topic消息出站速率<br />
                  <span className="text-[10px] text-slate-500 font-mono">(Bytes/s)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.topicRejectedBytesPerSec}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  topic请求被拒绝的速率<br />
                  <span className="text-[10px] text-slate-500 font-mono">(Bytes/s)</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.topicFetchFailedCountPerSec}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  topic每秒fetch<br />
                  请求失败数量(条)
                </div>
              </div>
            </div>
          </div>

          {/* Lower Block: broker指标 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-blue-400" />
                broker指标
              </span>

              {/* Dropdown Selector on Top Right matching screenshot */}
              <select
                value={selectedBrokerMetricIndex}
                onChange={(e) => setSelectedBrokerMetricIndex(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-xs text-blue-300 font-mono focus:outline-none focus:border-blue-500"
              >
                <option value="测试指标1">测试指标1</option>
                <option value="Broker集群多副本">Broker集群多副本</option>
                <option value="ConsumerLag耗时">ConsumerLag耗时</option>
              </select>
            </div>

            {/* 7 Big Telemetry Metric Cards matching screenshot layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 font-mono text-center">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.syncFailedReplicas}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  同步失效副本数
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.leaderReplicas}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  Leader副本数
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.partitionCount}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  Partition数量
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.offlinePartitions}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  下线Partition数量
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.leaderElectionTimeMs}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  Leader选举<br />
                  速率 (ms)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.consumerProduceFetchTimeMs}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-1 leading-tight">
                  请求FetchConsumer耗费的所有时间 (ms)<br />
                  请求produce所耗费的所有时间 (ms)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
                <div className="text-2xl font-black text-cyan-300">
                  {selectedMq.maxLagFollowerLeader}
                </div>
                <div className="text-[11px] text-slate-400 font-sans mt-2 leading-tight">
                  滞后follower和leader<br />
                  最大消息量
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
