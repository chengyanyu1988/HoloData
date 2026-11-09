export type MenuKey =
  // 1. 集中监控 (二级菜单: IT设备监控、操作系统监控、容器监控、中间件监控、数据库监控、电子标识设备监控)
  | 'mon_it'
  | 'mon_it_network'
  | 'mon_it_server'
  | 'mon_it_stats'
  | 'mon_os'
  | 'mon_os_system'
  | 'mon_os_stats'
  | 'mon_container'
  | 'mon_container_data'
  | 'mon_container_stats'
  | 'mon_middleware'
  | 'mon_mw_web'
  | 'mon_mw_msg'
  | 'mon_mw_cache'
  | 'mon_mw_stats'
  | 'mon_database'
  | 'mon_db_data'
  | 'mon_db_stats'
  | 'mon_rfid'
  | 'mon_rfid_device'
  | 'mon_rfid_readrate'
  | 'mon_rfid_inspection'
  | 'mon_rfid_stats'
  | 'mon_rfid_alarms'
  | 'mon_alarm'
  | 'mon_alarm_info'
  | 'mon_alarm_rules'
  | 'mon_alarm_active'
  | 'mon_alarm_history'
  | 'mon_alarm_policy'
  // 兼容直接子页面
  | 'overview_cockpit'
  | 'overview_realtime'
  | 'hw_servers'
  | 'hw_storage'
  | 'hw_network'
  | 'hw_racks'
  | 'sw_bigdata'
  | 'sw_compute'
  | 'sw_queues'
  | 'sw_analytics'
  // 2. 事件中心 (待办事件、已办事件、所有事件、事件回顾、事件统计)
  | 'evt_todo'
  | 'evt_done'
  | 'evt_all'
  | 'evt_review'
  | 'evt_stats'
  | 'alarm_active'
  | 'alarm_history'
  | 'alarm_policy'
  // 3. 工单管理 (二级: 工单管理, 变更工单回顾)
  | 'wo_mgr'
  | 'wo_my'
  | 'wo_pending'
  | 'wo_done'
  | 'wo_all'
  | 'wo_reply'
  | 'wo_change_review'
  | 'wo_change_mgr'
  | 'wo_stats'
  | 'wo_lifecycle'
  | 'wo_analytics'
  // 4. 知识库
  | 'kb_list'
  | 'kb_troubleshooting'
  | 'kb_sop'
  | 'kb_drills'
  | 'kb_docs'
  // 5. 配置管理
  | 'cfg_items'
  | 'cfg_project'
  | 'cfg_params'
  | 'cfg_agents'
  | 'cfg_backup'
  // 6. 系统管理
  | 'sec_personnel'
  | 'sec_users'
  | 'sec_org'
  | 'sec_roles'
  | 'sec_resources'
  | 'sec_settings'
  | 'sec_logs'
  | 'sec_audit'
  | 'sec_accounts'
  | 'sec_sys_params'
  | 'sec_data_dicts';

export interface OperatingSystemMetric {
  id: string;
  hostname: string;
  ip: string;
  osName: string;
  kernelVersion: string;
  loadAvg1m: number;
  loadAvg5m: number;
  loadAvg15m: number;
  processCount: number;
  threadCount: number;
  contextSwitchesPerSec: number;
  memTotalGB: number;
  memUsedGB: number;
  memCachedGB: number;
  memBuffersGB: number;
  swapTotalGB: number;
  swapUsedGB: number;
  mounts: {
    mountPoint: string;
    device: string;
    fsType: string;
    totalGB: number;
    usedGB: number;
    inodesUsedPercent: number;
    ioAwaitMs: number;
  }[];
  systemServices: {
    name: string;
    status: 'active' | 'failed' | 'inactive';
    description: string;
  }[];
}

export interface ContainerWorkload {
  id: string;
  name: string;
  namespace: string;
  type: 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job';
  readyReplicas: number;
  totalReplicas: number;
  cpuRequestCores: number;
  cpuLimitCores: number;
  cpuUsageCores: number;
  cpuThrottleRate: number; // percentage
  memoryRequestGB: number;
  memoryLimitGB: number;
  memoryUsageGB: number;
  restarts24h: number;
  status: 'Running' | 'Degraded' | 'Pending' | 'Completed';
  nodePlacement: string;
  image: string;
}

export interface DatabaseInstance {
  id: string;
  name: string;
  engine: 'ClickHouse OLAP' | 'Apache Doris' | 'PostgreSQL 16' | 'Redis 7.2 Cluster' | 'MySQL 8.4';
  role: 'Cluster Shards' | 'Master' | 'Replica' | 'Coordinator';
  version: string;
  endpoint: string;
  activeConnections: number;
  maxConnections: number;
  qps: number;
  tps: number;
  avgLatencyMs: number;
  p99LatencyMs: number;
  cacheHitRate: number;
  dataSizeGB: number;
  status: 'healthy' | 'warning' | 'critical';
  slowQueryCount: number;
}

export interface ElectronicTagDevice {
  id: string;
  name: string;
  deviceType: '解析递归节点' | '工业RFID读写器' | '边缘标识IoT网关' | '激光/喷码标识赋码机';
  model: string;
  ipAddress: string;
  macAddress: string;
  location: string;
  status: 'online' | 'warning' | 'offline';
  firmwareVersion: string;
  throughputPerSec: number; // QPS or Tag/s
  latencyMs: number;
  rssiSignalDbm?: number; // for RFID
  successRate: number;
  dailyResolvedCount: number;
  lastHeartbeat: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: '故障排障' | '标准作业SOP' | '应急预案' | '架构文档';
  author: string;
  updateTime: string;
  tags: string[];
  views: number;
  likes: number;
  summary: string;
  content: string[];
}

export interface MenuItem {
  key: MenuKey;
  label: string;
  description: string;
  children?: {
    key: MenuKey;
    label: string;
    description: string;
  }[];
}

export interface MenuGroup {
  key: string;
  label: string;
  iconName: string;
  badge?: number;
  children: MenuItem[];
}

export type HardwareStatus = 'normal' | 'warning' | 'critical' | 'offline';

export interface ServerNode {
  id: string;
  hostname: string;
  ip: string;
  bmcIp: string;
  rack: string;
  rackUnit: string;
  model: string;
  role: 'Master' | 'Compute-Worker' | 'Storage-Worker' | 'GPU-AI' | 'Gateway';
  cpuModel: string;
  cpuCores: number;
  cpuUsage: number;
  cpuTemp: number; // Celsius
  memTotalGB: number;
  memUsedGB: number;
  diskTotalTB: number;
  diskUsedTB: number;
  fanSpeedRpm: number;
  powerWatts: number;
  gpuInfo?: {
    model: string;
    count: number;
    usage: number;
    temp: number;
  };
  status: HardwareStatus;
  uptimeDays: number;
  os: string;
  kernel: string;
  nics: {
    name: string;
    speed: string;
    rxMbps: number;
    txMbps: number;
    status: 'up' | 'down';
  }[];
}

export interface StorageDevice {
  id: string;
  name: string;
  type: 'NVMe-oF Array' | 'Ceph Distributed Pool' | 'Enterprise SAN' | 'High-Cap DAS';
  vendor: string;
  capacityTB: number;
  usedTB: number;
  iops: number;
  readLatencyMs: number;
  writeLatencyMs: number;
  raidType: string;
  healthScore: number;
  status: HardwareStatus;
  temperature: number;
  rebuildProgress?: number;
}

export interface NetworkDevice {
  id: string;
  name: string;
  role: 'Spine Switch' | 'Leaf Switch' | 'Border Gateway' | 'Out-of-band Mgmt';
  model: string;
  managementIp: string;
  totalPorts: number;
  activePorts: number;
  uplinkSpeed: string;
  inboundGbps: number;
  outboundGbps: number;
  packetLossRate: number;
  status: HardwareStatus;
  temperature: number;
  bgpPeers: number;
}

export interface RackUnit {
  uSlot: number;
  nodeId?: string;
  hostname?: string;
  role?: string;
  status: 'occupied' | 'empty' | 'reserved';
  nodeStatus?: HardwareStatus;
}

export interface DatacenterRack {
  id: string;
  name: string;
  zone: string;
  totalU: number;
  occupiedU: number;
  powerLoadKW: number;
  maxPowerKW: number;
  inletTempC: number;
  exhaustTempC: number;
  units: RackUnit[];
}

export interface SoftwareComponent {
  id: string;
  name: string;
  category: 'bigdata' | 'compute' | 'queue' | 'analytics';
  version: string;
  role: 'Master-Slave' | 'Distributed Clustered' | 'Quorum Consensus' | 'Stand-alone';
  activeNodes: number;
  totalNodes: number;
  jvmHeapUsedGB: number;
  jvmHeapMaxGB: number;
  gcPauseMs: number;
  qps: number;
  status: 'healthy' | 'degraded' | 'critical' | 'stopped';
  leaderNode: string;
  uptimeHours: number;
  healthMetrics: {
    label: string;
    value: string;
    status: 'good' | 'warn' | 'bad';
  }[];
}

export interface ComputeJob {
  id: string;
  engine: 'Apache Flink 1.19' | 'Apache Spark 3.5' | 'Ray 2.10' | 'Trino 440';
  name: string;
  type: 'Streaming' | 'Batch' | 'Micro-batch' | 'Interactive SQL';
  parallelism: number;
  allocatedCores: number;
  allocatedMemoryGB: number;
  startTime: string;
  duration: string;
  status: 'RUNNING' | 'FINISHED' | 'FAILED' | 'RESTARTING';
  recordsPerSec: number;
  checkpointLatencyMs?: number;
  backpressure: 'NONE' | 'LOW' | 'HIGH';
}

export interface MessageQueueTopic {
  topic: string;
  cluster: string;
  partitions: number;
  replicationFactor: number;
  messagesInSec: number;
  bytesInSecMB: number;
  consumerGroups: number;
  totalLag: number;
  retentionHours: number;
  status: 'healthy' | 'lagging' | 'degraded';
}

export interface AnalyticalQuery {
  queryId: string;
  engine: 'ClickHouse' | 'StarRocks' | 'Apache Doris' | 'Hive on Tez';
  user: string;
  database: string;
  durationMs: number;
  scannedRows: string;
  scannedBytesMB: number;
  memoryPeakMB: number;
  status: 'EXECUTING' | 'SUCCESS' | 'SLOW' | 'KILLED';
  submittedAt: string;
}

export type AlarmSeverity = 'critical' | 'major' | 'warning' | 'info';

export interface AlarmItem {
  id: string;
  title: string;
  sourceType: 'HARDWARE' | 'SOFTWARE' | 'NETWORK' | 'STORAGE' | 'SECURITY';
  sourceEntity: string;
  severity: AlarmSeverity;
  metric: string;
  triggerValue: string;
  threshold: string;
  firstTriggeredAt: string;
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved';
  assignee?: string;
  resolutionNote?: string;
}

export interface AlarmRule {
  id: string;
  name: string;
  targetType: string;
  metric: string;
  operator: '>' | '<' | '==' | '!=';
  threshold: string;
  durationMinutes: number;
  severity: AlarmSeverity;
  channels: ('SMS' | 'EMAIL' | 'WEBHOOK' | 'DINGTALK')[];
  enabled: boolean;
  dutyPerson: string;
}

export type WorkOrderStatus = 'pending' | 'in_progress' | 'review' | 'resolved' | 'closed';

export interface WorkOrder {
  id: string;
  title: string;
  type: '硬件故障报修' | '资源扩容审批' | '组件版本升级' | '安全权限申请' | '性能调优工单';
  priority: 'P1-紧急' | 'P2-高' | 'P3-中' | 'P4-低';
  applicant: string;
  applicantDept: string;
  assignee: string;
  targetObject: string;
  createdAt: string;
  dueTime: string;
  status: WorkOrderStatus;
  description: string;
  timeline: {
    time: string;
    operator: string;
    action: string;
    comment: string;
  }[];
}

export interface UserAccount {
  id: string;
  username: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'suspended' | 'locked';
  mfaEnabled: boolean;
  lastLogin: string;
  createdDate: string;
}

export interface RolePermission {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: {
    category: string;
    read: boolean;
    write: boolean;
    execute: boolean;
    delete: boolean;
  }[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  operator: string;
  operatorIp: string;
  actionType: 'LOGIN' | 'RESTART' | 'CONFIG_CHANGE' | 'PERM_GRANT' | 'WORK_ORDER' | 'SYSTEM_REBOOT';
  targetResource: string;
  status: 'SUCCESS' | 'FAILED' | 'DENIED';
  detail: string;
  diffJson?: string;
}

export interface ClusterConfigParam {
  id: string;
  component: string;
  paramKey: string;
  currentValue: string;
  defaultValue: string;
  unit?: string;
  dynamicApply: boolean;
  lastModifiedBy: string;
  lastModifiedTime: string;
  description: string;
}

export interface TelemetryAgent {
  id: string;
  hostname: string;
  ip: string;
  agentType: 'Node-Exporter' | 'Promtail' | 'Fluent-Bit' | 'Vector' | 'Holographic-Probe';
  version: string;
  status: 'online' | 'offline' | 'degraded';
  syncIntervalSec: number;
  cpuUsage: number;
  memMB: number;
  lastHeartbeat: string;
}
