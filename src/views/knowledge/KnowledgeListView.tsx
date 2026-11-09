import React, { useState, useMemo } from 'react';
import {
  Search,
  Download,
  Eye,
  Calendar,
  FileText,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Building,
  Clock,
  Layers,
  Sparkles,
  FileCode2,
  Lock,
} from 'lucide-react';

export interface KBListItem {
  id: number;
  code: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  riskAssessment: string;
  riskLevel: '低' | '中' | '高';
  resources: string;
  implementationStatus: string;
  implementationResult: string;
  verificationResult: string;
  verificationOpinion: string;
  createdAt: string;
  hasDocument: boolean;
  docName?: string;
  docSize?: string;
  docSecurity?: string;
  applicant: string;
  applicantDept: string;
  assignee: string;
  flowSteps: {
    title: string;
    person: string;
    status: 'completed' | 'active' | 'pending';
  }[];
  auditLogs: {
    time: string;
    operator: string;
    node: string;
    action: string;
    comment: string;
  }[];
}

const INITIAL_KB_LIST: KBListItem[] = [
  {
    id: 1,
    code: 'KB-20261105-001',
    type: '重大变更',
    title: 'PostgreSQL 16.2 零中断逻辑复制同步与故障倒换方案',
    description: '针对核心 OLTP 交易数据库的主从零中断双活复制升级与自动 Failover 倒换预案',
    impact: '涉及3个读库节点5秒只读切换，核心写库在线不受影响',
    riskAssessment: '低风险 - 已通过 200% 高并发双发流量压测与自动降级回滚验证',
    riskLevel: '低',
    resources: '资深 DBA x2, 基础设施运维工程师 x1, 容灾隔离节点 x4',
    implementationStatus: '逻辑复制拓扑热建立完成，同步延迟维持在 1.2ms',
    implementationResult: '热升级成功，数据一致性校验 100% 匹配',
    verificationResult: '通过 (全量 SQL 抽样无死锁，QPS 18,500 达标)',
    verificationOpinion: '高可用容灾演练指标优于 SLA 承诺，允许归档至知识库',
    createdAt: '2026/11/05 15:32:18',
    hasDocument: true,
    docName: 'PostgreSQL16_ZeroDowntime_Failover_Architecture.pdf',
    docSize: '4.8 MB',
    docSecurity: 'L3-内部机密',
    applicant: '周峻峰 (DBA 团队负责人)',
    applicantDept: '数据架构与数据库技术部',
    assignee: '张建 (首席 DBA 专家)',
    flowSteps: [
      { title: '创建人', person: '周峻峰', status: 'completed' },
      { title: '上级审批人', person: '陈国华', status: 'completed' },
      { title: '受理人', person: '张建', status: 'completed' },
      { title: '受理中', person: '张建', status: 'completed' },
      { title: '处理完成', person: '张建', status: 'completed' },
      { title: '确认完成', person: '周峻峰', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/05 14:00:00', operator: '周峻峰', node: '提交工单', action: '发起变更申请', comment: '申请提交核心 PostgreSQL 双活复制升级' },
      { time: '2026/11/05 14:30:12', operator: '陈国华', node: '部门审批', action: '审批通过', comment: '评估无业务风险，批准在低峰期上线' },
      { time: '2026/11/05 15:00:00', operator: '张建', node: '现场实施', action: '实施完成', comment: '主从逻辑复制拓扑搭建完毕，延迟 1.2ms' },
      { time: '2026/11/05 15:32:18', operator: '周峻峰', node: '终验归档', action: '入库知识库', comment: '验证各项指标无误，知识库归档完毕' },
    ],
  },
  {
    id: 2,
    code: 'KB-20261105-002',
    type: '紧急变更',
    title: 'RFID 04读写天线驻波比衰减告警自动化收敛与校准',
    description: '工业级 RFID 超高频识别天线场强衰减自动校准与边缘网关频段调优方案',
    impact: '自动化仓库 2 号产线读写器微调 30 秒，不影响物流主干',
    riskAssessment: '中风险 - 现场包含射频功率重新匹配，需现场工程师复核',
    riskLevel: '中',
    resources: 'RFID 射频专家 x1, 现场安检巡检员 x1, 网关诊断仪 x1',
    implementationStatus: '天线驻波比由 1.85 恢复至标准值 1.15，信号衰减消除',
    implementationResult: '调整成功，漏读率由 0.42% 降低至 0.00%',
    verificationResult: '通过 (双基识读率连续 10,000 次测试 100% 成功)',
    verificationOpinion: '射频物理层参数已封样，现场已巡检备案',
    createdAt: '2026/11/05 11:20:45',
    hasDocument: true,
    docName: 'Industrial_RFID_VSWR_Calibration_SOP.pdf',
    docSize: '3.2 MB',
    docSecurity: 'L2-商业受控',
    applicant: '赵明 (物联设备部)',
    applicantDept: '边缘智能与 RFID 组',
    assignee: '李建 (高级物联网工程师)',
    flowSteps: [
      { title: '创建人', person: '赵明', status: 'completed' },
      { title: '上级审批人', person: '王强', status: 'completed' },
      { title: '受理人', person: '李建', status: 'completed' },
      { title: '受理中', person: '李建', status: 'completed' },
      { title: '处理完成', person: '李建', status: 'completed' },
      { title: '确认完成', person: '赵明', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/05 10:15:00', operator: '赵明', node: '提交工单', action: '紧急提单', comment: '2号产线 RFID 读写天线信号衰减告警' },
      { time: '2026/11/05 10:30:00', operator: '王强', node: '审核放行', action: '快速批准', comment: '授权现场调优团队接入' },
      { time: '2026/11/05 11:00:00', operator: '李建', node: '现场调谐', action: '参数矫正', comment: '完成频段功率打散与天线匹配' },
      { time: '2026/11/05 11:20:45', operator: '赵明', node: '归档确认', action: '入库备案', comment: '双基识读率恢复正常，提报知识库' },
    ],
  },
  {
    id: 3,
    code: 'KB-20261104-003',
    type: '架构升级',
    title: 'Kubernetes v1.30 生产集群 Cilium eBPF CNI 无缝平滑升级',
    description: '替代传统 kube-proxy iptables 模式，全量切换至 Cilium eBPF 内核套接字路由',
    impact: '无业务中断，Pod 间网络穿透延迟降低 35%',
    riskAssessment: '低风险 - 灰度分段按 Node 节点逐步滚动扩缩',
    riskLevel: '低',
    resources: '云原生架构师 x2, K8s 运维团队, 100G 核心交换机',
    implementationStatus: '64 个 Worker 节点 eBPF 探针注入完成，连接打散正常',
    implementationResult: '平滑上线，网络吞吐从 42Gbps 提升至 88Gbps',
    verificationResult: '通过 (网络丢包率 0.000%，TCP RTT < 0.2ms)',
    verificationOpinion: '网络层性能得到显著提升，具备推及全机房推广价值',
    createdAt: '2026/11/04 18:45:10',
    hasDocument: true,
    docName: 'K8s_Cilium_eBPF_Migration_Guide_v2.pdf',
    docSize: '6.1 MB',
    docSecurity: 'L3-内部机密',
    applicant: '孙浩 (云原生架构组)',
    applicantDept: '容器与 PaaS 基础设施部',
    assignee: '刘洋 (K8s 资深专家)',
    flowSteps: [
      { title: '创建人', person: '孙浩', status: 'completed' },
      { title: '上级审批人', person: '黄磊', status: 'completed' },
      { title: '受理人', person: '刘洋', status: 'completed' },
      { title: '受理中', person: '刘洋', status: 'completed' },
      { title: '处理完成', person: '刘洋', status: 'completed' },
      { title: '确认完成', person: '孙浩', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/04 16:00:00', operator: '孙浩', node: '需求发起', action: '提交架构方案', comment: '申请进行 Cilium eBPF 网络插件全面升级' },
      { time: '2026/11/04 16:45:00', operator: '黄磊', node: '专家会审', action: '审批通过', comment: '方案评审通过，允许滚动切割' },
      { time: '2026/11/04 18:00:00', operator: '刘洋', node: '滚动安装', action: '集群生效', comment: '完成全量节点无感知流量平滑接管' },
      { time: '2026/11/04 18:45:10', operator: '孙浩', node: '成功归档', action: '整理为知识库', comment: '成果录入 SOP 与架构白皮书' },
    ],
  },
  {
    id: 4,
    code: 'KB-20261104-004',
    type: '性能调优',
    title: 'Redis 7.2 分布式集群 BigKey 分片清理与内存碎片治理',
    description: '清理历史残存 >100MB 哈希键，并开启 background-purge-active 内存碎片自愈',
    impact: '无业务中断，Redis 节点内存占用从 92% 降至 54%',
    riskAssessment: '低风险 - 采用 UNLINK 异步非阻塞删除与内存大页关闭',
    riskLevel: '低',
    resources: 'Redis 专家 x1, 缓存中间件运维工程师 x1',
    implementationStatus: '共扫描清理 142 个 BigKey，回收内存 128GB',
    implementationResult: '内存碎片率 (mem_fragmentation_ratio) 降至 1.08',
    verificationResult: '通过 (P99 响应耗时恢复至 0.8ms 内)',
    verificationOpinion: '有效规避内存主从同步阻塞风险，方案可复制至全量缓存集群',
    createdAt: '2026/11/04 14:10:22',
    hasDocument: false,
    applicant: '郑超 (缓存团队工程师)',
    applicantDept: '中间件与数据服务部',
    assignee: '韩伟 (中间件组长)',
    flowSteps: [
      { title: '创建人', person: '郑超', status: 'completed' },
      { title: '上级审批人', person: '韩伟', status: 'completed' },
      { title: '受理人', person: '韩伟', status: 'completed' },
      { title: '受理中', person: '韩伟', status: 'completed' },
      { title: '处理完成', person: '韩伟', status: 'completed' },
      { title: '确认完成', person: '郑超', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/04 13:00:00', operator: '郑超', node: '提交申请', action: '发起内存治理', comment: '提单清理生产 Redis BigKey' },
      { time: '2026/11/04 13:30:00', operator: '韩伟', node: '审核许可', action: '同意执行', comment: '采用 UNLINK 异步模式执行' },
      { time: '2026/11/04 14:00:00', operator: '韩伟', node: '脚本清理', action: '执行完毕', comment: '完成 142 个 Key 异步解绑' },
      { time: '2026/11/04 14:10:22', operator: '郑超', node: '终验闭环', action: '归档知识库', comment: '指标良好，沉淀排障案例' },
    ],
  },
  {
    id: 5,
    code: 'KB-20261103-005',
    type: '重大变更',
    title: 'Apache Kafka 3.7 主题分区平衡与零停机 Hot-Topic 分流',
    description: '解决高吞吐秒杀业务导致单个 Broker 磁盘 IOPS 告警，自动迁移 Partition 副本',
    impact: 'Topic 流量平滑重分布，业务写端无抖动',
    riskAssessment: '低风险 - 利用 kafka-reassign-partitions 工具限速 50MB/s 迁移',
    riskLevel: '低',
    resources: '消息中间件专家 x1, Kafka 运维专员 x1',
    implementationStatus: '完成 12 个 Partition 跨 Broker 自动均衡',
    implementationResult: 'Broker 磁盘 IOPS 负载不均度由 78% 降低至 4%',
    verificationResult: '通过 (Consumer Group 消费延迟 Consumer Lag 为 0)',
    verificationOpinion: '成功治理 Kafka 偏斜热点，归档至标准运维手册',
    createdAt: '2026/11/03 16:55:40',
    hasDocument: true,
    docName: 'Kafka_Partition_Rebalance_SOP_2026.pdf',
    docSize: '2.9 MB',
    docSecurity: 'L2-商业受控',
    applicant: '徐雪 (数据管道组)',
    applicantDept: '数据接入与实时计算部',
    assignee: '马飞 (Kafka 架构师)',
    flowSteps: [
      { title: '创建人', person: '徐雪', status: 'completed' },
      { title: '上级审批人', person: '马飞', status: 'completed' },
      { title: '受理人', person: '马飞', status: 'completed' },
      { title: '受理中', person: '马飞', status: 'completed' },
      { title: '处理完成', person: '马飞', status: 'completed' },
      { title: '确认完成', person: '徐雪', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/03 15:00:00', operator: '徐雪', node: '提交工单', action: '请求分区重平衡', comment: 'Broker 03 磁盘 IO 告警' },
      { time: '2026/11/03 15:20:00', operator: '马飞', node: '方案评估', action: '批准迁移', comment: '控制限额带宽，避免占用主干' },
      { time: '2026/11/03 16:30:00', operator: '马飞', node: '副本重分配', action: '迁移完成', comment: '分区数据校验无误' },
      { time: '2026/11/03 16:55:40', operator: '徐雪', node: '入库确认', action: '知识库落盘', comment: '完成知识库文档与工具脚本沉淀' },
    ],
  },
  {
    id: 6,
    code: 'KB-20261103-006',
    type: '紧急变更',
    title: '千兆 PoE 供电模块热插拔与核心 Spine 交换机端口聚合',
    description: '核心机房 B-04 柜 Spine 交换机 uplink 端口误码率上升，热替换 SFP+ 光模块',
    impact: '链路具备 LACP 双链路冗余，流量无丢包自动收敛',
    riskAssessment: '中风险 - 涉及数据中心核心网盘带电插拔',
    riskLevel: '中',
    resources: '网络工程师 x2, 机房防静电装备, 万用光功率计',
    implementationStatus: '光模块替换完成，Receive Optical Power -2.1 dBm 正常',
    implementationResult: '端口误码率由 1.2e-4 清零恢复为 0',
    verificationResult: '通过 (以太网帧 CRC 校验正确率 100%)',
    verificationOpinion: '物理硬件故障快速闭环，操作规范符合数据中心 SOP',
    createdAt: '2026/11/03 10:05:12',
    hasDocument: true,
    docName: 'Datacenter_Spine_Switch_SFP_HotSwap.pdf',
    docSize: '1.8 MB',
    docSecurity: 'L2-商业受控',
    applicant: '周强 (网络基础设施组)',
    applicantDept: '数据中心网络运维部',
    assignee: '吴刚 (资深网络专家)',
    flowSteps: [
      { title: '创建人', person: '周强', status: 'completed' },
      { title: '上级审批人', person: '吴刚', status: 'completed' },
      { title: '受理人', person: '吴刚', status: 'completed' },
      { title: '受理中', person: '吴刚', status: 'completed' },
      { title: '处理完成', person: '吴刚', status: 'completed' },
      { title: '确认完成', person: '周强', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/03 09:00:00', operator: '周强', node: '告警提单', action: '硬件替换申请', comment: 'Spine-02 端口 CRC 报错上升' },
      { time: '2026/11/03 09:20:00', operator: '吴刚', node: '快速核准', action: '带电插拔授权', comment: '确认 LACP 已建立备份链路' },
      { time: '2026/11/03 09:50:00', operator: '吴刚', node: '现场热换', action: '替换完毕', comment: '光衰减指标达标' },
      { time: '2026/11/03 10:05:12', operator: '周强', node: '终验入库', action: '知识库归档', comment: '写入硬件更换故障台账' },
    ],
  },
  {
    id: 7,
    code: 'KB-20261102-007',
    type: '标准变更',
    title: 'HDFS 3.3 生产集群坏盘自我修复与 DataNode 热解绑',
    description: '针对 NVMe 磁盘出现 SMART 坏道警告，自动执行 Block 重分配与磁盘隔离',
    impact: '无业务中断，三副本策略保障数据零丢失',
    riskAssessment: '低风险 - HDFS 自动触发复制因子平衡',
    riskLevel: '低',
    resources: '大数据存储工程师 x1, 硬件巡检员 x1',
    implementationStatus: '自动从坏盘拔出 1.2TB 数据块，副本完整',
    implementationResult: 'Bad Block 清零，集群 Storage 健康度 100%',
    verificationResult: '通过 (hdfs fsck 结果健康，Block 丢失数为 0)',
    verificationOpinion: '磁盘自愈自动化流转顺畅，流程具备示范效应',
    createdAt: '2026/11/02 17:30:00',
    hasDocument: false,
    applicant: '郭涛 (存储组)',
    applicantDept: '数据存储与大容量基础设施部',
    assignee: '高峰 (高级存储工程师)',
    flowSteps: [
      { title: '创建人', person: '郭涛', status: 'completed' },
      { title: '上级审批人', person: '高峰', status: 'completed' },
      { title: '受理人', person: '高峰', status: 'completed' },
      { title: '受理中', person: '高峰', status: 'completed' },
      { title: '处理完成', person: '高峰', status: 'completed' },
      { title: '确认完成', person: '郭涛', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/02 16:00:00', operator: '郭涛', node: '提单', action: '发起隔离', comment: 'Worker-12 /dev/nvme0n1 SMART 警告' },
      { time: '2026/11/02 16:15:00', operator: '高峰', node: '核准', action: '执行自我修复', comment: '触发 HDFS 解绑命令' },
      { time: '2026/11/02 17:10:00', operator: '高峰', node: '修复完毕', action: '数据平衡完成', comment: 'Block 复制100%完成' },
      { time: '2026/11/02 17:30:00', operator: '郭涛', node: '归档', action: '放入知识库', comment: '记录为经典磁盘故障治理案例' },
    ],
  },
  {
    id: 8,
    code: 'KB-20261102-008',
    type: '架构升级',
    title: 'ClickHouse 24.3 存算分离列式引擎与 S3 冷热数据分层存储',
    description: '将超过 90 天的历史表自动冷沉淀至 MinIO/S3 兼容存储，降低本地 SSD 存储成本',
    impact: '查询耗时微增 5%，本地高性能 SSD 空间释放 45TB',
    riskAssessment: '低风险 - 透明分层存储驱动，底层 MergeTree 无感',
    riskLevel: '低',
    resources: '数据湖架构师 x1, ClickHouse DBA x1, 对象存储集群',
    implementationStatus: '冷热策略规则生效，历史 45TB 索引与数据切割完成',
    implementationResult: '存储成本节省 62%，列存压缩比达到 4.2:1',
    verificationResult: '通过 (SQL 查询结果完全对齐，亿级关联毫秒返回)',
    verificationOpinion: '湖仓存储架构演进关键一步，方案推荐全域推广',
    createdAt: '2026/11/02 11:15:33',
    hasDocument: true,
    docName: 'ClickHouse_S3_StorageTiering_Architecture.pdf',
    docSize: '5.4 MB',
    docSecurity: 'L3-内部机密',
    applicant: '林立 (湖仓架构组)',
    applicantDept: '数据平台架构技术部',
    assignee: '张建 (首席 DBA 专家)',
    flowSteps: [
      { title: '创建人', person: '林立', status: 'completed' },
      { title: '上级审批人', person: '张建', status: 'completed' },
      { title: '受理人', person: '张建', status: 'completed' },
      { title: '受理中', person: '张建', status: 'completed' },
      { title: '处理完成', person: '张建', status: 'completed' },
      { title: '确认完成', person: '林立', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/02 09:30:00', operator: '林立', node: '提案', action: '提交冷热分层方案', comment: 'ClickHouse SSD 空间瓶颈治理' },
      { time: '2026/11/02 10:00:00', operator: '张建', node: '评审', action: '批复执行', comment: '配置 S3 磁盘策略并测试下发' },
      { time: '2026/11/02 10:50:00', operator: '张建', node: '策略下发', action: '数据迁移', comment: '策略自动迁移 45TB 冷数据' },
      { time: '2026/11/02 11:15:33', operator: '林立', node: '归档', action: '知识库落盘', comment: '方案全量沉淀' },
    ],
  },
  {
    id: 9,
    code: 'KB-20261101-009',
    type: '重大变更',
    title: 'OpenEuler 22.03 LTS SP3 物理服务器内核安全补丁全量滚动补丁',
    description: '修复 Linux 内核 CVE-2026-8890 越界访问漏洞，无感热补丁 (kpatch) 注入',
    impact: '无重启热修复，主机打补丁期间 CPU 占用率增加 1.5%',
    riskAssessment: '中风险 - 涉及生产底层 Linux 内核内存打热补丁',
    riskLevel: '中',
    resources: 'Linux 内核组专家 x2, 服务器运维总监 x1',
    implementationStatus: '420 台物理服务器热补丁成功加载率 100%',
    implementationResult: '安全漏洞风险级别由 Critical 降至 Safe',
    verificationResult: '通过 (内核基线检测扫描 0 漏洞漏洞警告)',
    verificationOpinion: '零重启补丁技术在生产大规模应用验证成功',
    createdAt: '2026/11/01 19:40:12',
    hasDocument: true,
    docName: 'Linux_Kernel_Kpatch_LiveUpdate_SOP.pdf',
    docSize: '3.9 MB',
    docSecurity: 'L3-内部机密',
    applicant: '崔健 (系统安全部)',
    applicantDept: '信息安全与合规审计部',
    assignee: '陈国华 (系统运维总监)',
    flowSteps: [
      { title: '创建人', person: '崔健', status: 'completed' },
      { title: '上级审批人', person: '陈国华', status: 'completed' },
      { title: '受理人', person: '陈国华', status: 'completed' },
      { title: '受理中', person: '陈国华', status: 'completed' },
      { title: '处理完成', person: '陈国华', status: 'completed' },
      { title: '确认完成', person: '崔健', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/01 17:00:00', operator: '崔健', node: '提单', action: '高危漏洞应急', comment: '下发 Linux CVE-2026-8890 补丁修复工单' },
      { time: '2026/11/01 17:30:00', operator: '陈国华', node: '批准', action: '热补丁全量下发', comment: '使用 kpatch 工具集热注入' },
      { time: '2026/11/01 19:00:00', operator: '陈国华', node: '下发完毕', action: '420台服务器挂载', comment: '内核线程无抖动' },
      { time: '2026/11/01 19:40:12', operator: '崔健', node: '归档闭环', action: '知识库入库', comment: '沉淀为企业级内核安全补丁 SOP' },
    ],
  },
  {
    id: 10,
    code: 'KB-20261101-010',
    type: '性能调优',
    title: 'Nginx 高性能反向代理 Gzip/Brotli 动静分离与 Buffer 优化',
    description: '针对数据大屏高频遥测 API 开启 Brotli 实时压缩，并优化 keepalive 连接池',
    impact: '出站带宽节省 68%，前端页面 FCP 耗时从 1.4s 降至 0.3s',
    riskAssessment: '低风险 - 在线无缝 reload Nginx 配置',
    riskLevel: '低',
    resources: 'WEB 中间件工程师 x1, 前端性能专家 x1',
    implementationStatus: '网关集群平滑 reload，CPU 占用保持在 18% 低位',
    implementationResult: '网络传输体积缩小至原来的 32%',
    verificationResult: '通过 (HTTP 200 状态码 99.999%，压测无报错)',
    verificationOpinion: '前端与反向代理网络性能调优效果极其优异',
    createdAt: '2026/11/01 14:15:05',
    hasDocument: false,
    applicant: '周蕾 (前端架构组)',
    applicantDept: '全息 UI 与用户体验部',
    assignee: '韩伟 (中间件组长)',
    flowSteps: [
      { title: '创建人', person: '周蕾', status: 'completed' },
      { title: '上级审批人', person: '韩伟', status: 'completed' },
      { title: '受理人', person: '韩伟', status: 'completed' },
      { title: '受理中', person: '韩伟', status: 'completed' },
      { title: '处理完成', person: '韩伟', status: 'completed' },
      { title: '确认完成', person: '周蕾', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/11/01 13:00:00', operator: '周蕾', node: '提单', action: '提交调优申请', comment: '前端数据大屏首屏压缩优化' },
      { time: '2026/11/01 13:20:00', operator: '韩伟', node: '审核', action: '允许热配置', comment: '审核配置变更项目' },
      { time: '2026/11/01 13:50:00', operator: '韩伟', node: '加载配置', action: 'Nginx reload', comment: '无感加载 Brotli 压缩模块' },
      { time: '2026/11/01 14:15:05', operator: '周蕾', node: '验收闭环', action: '入库知识库', comment: '验证响应延迟显著降低' },
    ],
  },
  {
    id: 11,
    code: 'KB-20261031-011',
    type: '标准变更',
    title: 'Apache Spark 3.5 算子内存溢出 OOM 预防与 Dynamic Allocation 调优',
    description: '调整 spark.executor.memoryOverhead 与 Shuffle 溢写磁盘阈值，消除长尾 Task',
    impact: '无业务中断，批处理 ETL 作业平均完成耗时缩短 28%',
    riskAssessment: '低风险 - Yarn / K8s 资源调度动态容忍',
    riskLevel: '低',
    resources: '大数据计算专家 x1, Flink/Spark 工程师 x1',
    implementationStatus: '80 个每日定期批处理作业参数自动热注入',
    implementationResult: 'Spark Task Fail/Retry 发生率由 4.1% 降为 0.0%',
    verificationResult: '通过 (YARN 资源利用率保持在 85% 黄金区间)',
    verificationOpinion: '有效规避内存溢出导致的数据重算，推报为团队 SOP',
    createdAt: '2026/10/31 16:22:00',
    hasDocument: true,
    docName: 'Spark35_Memory_Optimization_BestPractice.pdf',
    docSize: '4.1 MB',
    docSecurity: 'L2-商业受控',
    applicant: '彭涛 (数据计算组)',
    applicantDept: '实时与离线计算部',
    assignee: '马飞 (Kafka / Spark 架构师)',
    flowSteps: [
      { title: '创建人', person: '彭涛', status: 'completed' },
      { title: '上级审批人', person: '马飞', status: 'completed' },
      { title: '受理人', person: '马飞', status: 'completed' },
      { title: '受理中', person: '马飞', status: 'completed' },
      { title: '处理完成', person: '马飞', status: 'completed' },
      { title: '确认完成', person: '彭涛', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/10/31 14:00:00', operator: '彭涛', node: '提单', action: '提交优化申请', comment: '夜间 Spark OOM 失败预警治理' },
      { time: '2026/10/31 14:30:00', operator: '马飞', node: '批复', action: '参数调整生效', comment: '核准修改集群默认参数' },
      { time: '2026/10/31 15:50:00', operator: '马飞', node: '验证', action: '试运行成功', comment: '任务完成时间缩短' },
      { time: '2026/10/31 16:22:00', operator: '彭涛', node: '结案', action: '知识库落盘', comment: '形成 Spark 参数调优指南' },
    ],
  },
  {
    id: 12,
    code: 'KB-20261031-012',
    type: '架构升级',
    title: '400G 无损以太网 RoCE v2 物理链路 PFC 拥塞控制与 ECN 关联',
    description: '针对 AI 训练与大模型算子全减散 Row/Column 通信优化 PFC 死锁预防策略',
    impact: '无丢包网关建立，GPU 节点跨机柜 RDMA 延迟小于 1.1us',
    riskAssessment: '高风险 - 涉及整栋机楼 400G 交换机 QoS 队列重构',
    riskLevel: '高',
    resources: '网络架构总监 x1, Mellanox RDMA 专家 x2',
    implementationStatus: '分区块完成 PFC 与 ECN 联动门限配置下发',
    implementationResult: '网络拥塞暂停帧 Pause Frame 减少 99.4%',
    verificationResult: '通过 (NCCL AllReduce 通信效率提升 42%)',
    verificationOpinion: 'AI 算力基础设施重大破局，记录为特级技术白皮书',
    createdAt: '2026/10/31 11:05:44',
    hasDocument: true,
    docName: 'RoCEv2_Lossless_Ethernet_PFC_ECN_Whitepaper.pdf',
    docSize: '8.5 MB',
    docSecurity: 'L3-内部机密',
    applicant: '程总工 (首席系统架构师)',
    applicantDept: '数据基础设施技术委员会',
    assignee: '吴刚 (资深网络专家)',
    flowSteps: [
      { title: '创建人', person: '程总工', status: 'completed' },
      { title: '上级审批人', person: '陈国华', status: 'completed' },
      { title: '受理人', person: '吴刚', status: 'completed' },
      { title: '受理中', person: '吴刚', status: 'completed' },
      { title: '处理完成', person: '吴刚', status: 'completed' },
      { title: '确认完成', person: '程总工', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/10/31 08:30:00', operator: '程总工', node: '发起', action: '特级架构升级', comment: '提交 400G RoCEv2 无损网方案' },
      { time: '2026/10/31 09:00:00', operator: '陈国华', node: '审核', action: '特批上线', comment: '确认灰度区域风险可控' },
      { time: '2026/10/31 10:30:00', operator: '吴刚', node: '配置', action: 'QoS 参数热生效', comment: '全量下发 ECN 拥塞阈值' },
      { time: '2026/10/31 11:05:44', operator: '程总工', node: '归档', action: '特级白皮书入库', comment: '放入核心知识库' },
    ],
  },
  {
    id: 13,
    code: 'KB-20261030-013',
    type: '标准变更',
    title: 'Ceph 18.2 (Reef) 分布式存储 Pool 扩容与 OSD 自动再平衡',
    description: '新增 12 台 NVMe 全闪阵列存储节点，扩充 Ceph 存储池 240TB 净可用容量',
    impact: '存储池扩容过程在线无感，IOPS 无下降',
    riskAssessment: '低风险 - 设置 max_backfills 为 1 保证低限速后台恢复',
    riskLevel: '低',
    resources: 'Ceph 专家 x1, 硬件上架巡检组',
    implementationStatus: '新节点 48 块 OSD 顺利加入 CRUSH Map 树节点',
    implementationResult: '存储池总容量升至 1.8PB，均衡度 99.8%',
    verificationResult: '通过 (ceph health 服务状态显示 HEALTH_OK)',
    verificationOpinion: '存储扩容作业规范，数据再平衡平稳',
    createdAt: '2026/10/30 15:40:20',
    hasDocument: false,
    applicant: '郭涛 (存储组)',
    applicantDept: '数据存储基础设施部',
    assignee: '高峰 (高级存储工程师)',
    flowSteps: [
      { title: '创建人', person: '郭涛', status: 'completed' },
      { title: '上级审批人', person: '高峰', status: 'completed' },
      { title: '受理人', person: '高峰', status: 'completed' },
      { title: '受理中', person: '高峰', status: 'completed' },
      { title: '处理完成', person: '高峰', status: 'completed' },
      { title: '确认完成', person: '郭涛', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/10/30 13:00:00', operator: '郭涛', node: '提单', action: 'Ceph 扩容', comment: '申请上架 12 台全闪 NVMe 节点' },
      { time: '2026/10/30 13:30:00', operator: '高峰', node: '审批', action: '挂载 CRUSH 树', comment: '批准加入集群存储池' },
      { time: '2026/10/30 15:10:00', operator: '高峰', node: '再平衡', action: '平衡完成', comment: '后台 pg rebalance 100%' },
      { time: '2026/10/30 15:40:20', operator: '郭涛', node: '归档', action: '知识库落盘', comment: '补充 Ceph 扩容 SOP' },
    ],
  },
  {
    id: 14,
    code: 'KB-20261029-014',
    type: '紧急变更',
    title: 'MySQL 8.4 物理备份 (XtraBackup) 锁表故障切回与恢复',
    description: '针对备份期间 FTWRL 导致的死锁堵塞问题，升级为无锁非阻塞快照模式',
    impact: '彻底消除主库备份时间的写等待锁',
    riskAssessment: '中风险 - 涉及夜间定时备份脚本热替换',
    riskLevel: '中',
    resources: 'DBA 运维工程师 x1',
    implementationStatus: '更新备份脚本，添加 --no-lock 选项并开启 redo log 实时追踪',
    implementationResult: '备份耗时减少 40%，且写吞吐零受受阻',
    verificationResult: '通过 (抽样数据恢复还原 100% 成功)',
    verificationOpinion: '解决长期困扰的备份锁表隐患，归档知识库',
    createdAt: '2026/10/29 14:10:00',
    hasDocument: true,
    docName: 'MySQL84_XtraBackup_NoLock_SOP.pdf',
    docSize: '2.1 MB',
    docSecurity: 'L2-商业受控',
    applicant: '周峻峰 (DBA 团队)',
    applicantDept: '数据库服务部',
    assignee: '张建 (首席 DBA 专家)',
    flowSteps: [
      { title: '创建人', person: '周峻峰', status: 'completed' },
      { title: '上级审批人', person: '张建', status: 'completed' },
      { title: '受理人', person: '张建', status: 'completed' },
      { title: '受理中', person: '张建', status: 'completed' },
      { title: '处理完成', person: '张建', status: 'completed' },
      { title: '确认完成', person: '周峻峰', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/10/29 11:00:00', operator: '周峻峰', node: '提单', action: '锁表问题治理', comment: '提出改进 MySQL 无锁备份方案' },
      { time: '2026/10/29 11:30:00', operator: '张建', node: '审批', action: '脚本更新许可', comment: '测试环境验证通过后下发' },
      { time: '2026/10/29 13:40:00', operator: '张建', node: '测试', action: '生产部署', comment: '完成 XtraBackup 最新版本部署' },
      { time: '2026/10/29 14:10:00', operator: '周峻峰', node: '闭环', action: '写入知识库', comment: '沉淀为 DBA 核心 SOP' },
    ],
  },
  {
    id: 15,
    code: 'KB-20261028-015',
    type: '重大变更',
    title: '全息数据湖 StarRocks 3.2 向量化引擎与物化视图自动刷新',
    description: '构建分钟级增量实时物化视图，替代离线 T+1 报表计算引擎',
    impact: '查询响应速度提升 12 倍，离线算力资源占用减少 60%',
    riskAssessment: '低风险 - 物化视图异步刷新，原表查询无感知',
    riskLevel: '低',
    resources: '数仓架构师 x1, StarRocks 专家 x1',
    implementationStatus: '上线 28 个核心指标物化视图，增量刷新间隔 3 分钟',
    implementationResult: '报表大屏平均延迟控制在 150ms 左右',
    verificationResult: '通过 (与 Oracle 源库数据对账 100% 一致)',
    verificationOpinion: '成功支撑全息可视化大屏毫秒级响应，归档落盘',
    createdAt: '2026/10/28 17:50:00',
    hasDocument: true,
    docName: 'StarRocks_MaterializedView_Realtime_Architecture.pdf',
    docSize: '4.5 MB',
    docSecurity: 'L2-商业受控',
    applicant: '林立 (数仓组)',
    applicantDept: '数据分析与大屏技术部',
    assignee: '马飞 (架构师)',
    flowSteps: [
      { title: '创建人', person: '林立', status: 'completed' },
      { title: '上级审批人', person: '马飞', status: 'completed' },
      { title: '受理人', person: '马飞', status: 'completed' },
      { title: '受理中', person: '马飞', status: 'completed' },
      { title: '处理完成', person: '马飞', status: 'completed' },
      { title: '确认完成', person: '林立', status: 'completed' },
    ],
    auditLogs: [
      { time: '2026/10/28 15:00:00', operator: '林立', node: '提单', action: '实时数仓升级', comment: '申请构建 StarRocks 实时物化视图' },
      { time: '2026/10/28 15:30:00', operator: '马飞', node: '批复', action: '上线准许', comment: '同意物化视图自动刷新任务下发' },
      { time: '2026/10/28 17:10:00', operator: '马飞', node: '生效', action: '刷新成功', comment: '物化视图全量建立并增量同步' },
      { time: '2026/10/28 17:50:00', operator: '林立', node: '入库', action: '知识库沉淀', comment: '纳入数仓实时化开发标准' },
    ],
  },
];

export const KnowledgeListView: React.FC = () => {
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-06');

  // Pagination state (Strict 10 items per page limit)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [jumpPage, setJumpPage] = useState('');

  // Modals state
  const [selectedDetailItem, setSelectedDetailItem] = useState<KBListItem | null>(null);
  const [selectedDocItem, setSelectedDocItem] = useState<KBListItem | null>(null);
  const [usefulnessChoice, setUsefulnessChoice] = useState('');
  const [feedbackText, setFeedbackText] = useState('');

  // Filter items
  const filteredItems = useMemo(() => {
    return INITIAL_KB_LIST.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.applicant.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = selectedType === 'ALL' || item.type === selectedType;

      let matchesDate = true;
      if (startDate && endDate) {
        const itemDateStr = item.createdAt.slice(0, 10).replace(/\//g, '-');
        matchesDate = itemDateStr >= startDate && itemDateStr <= endDate;
      }

      return matchesSearch && matchesType && matchesDate;
    });
  }, [searchTerm, selectedType, startDate, endDate]);

  // Total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  // Current page items
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleReset = () => {
    setSearchTerm('');
    setSelectedType('ALL');
    setStartDate('2026-11-01');
    setEndDate('2026-11-06');
    setCurrentPage(1);
  };

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
    }
    setJumpPage('');
  };

  const handleDownloadDoc = (item: KBListItem) => {
    alert(`正在为您安全解密并下载知识库文档: ${item.docName}\n密级: ${item.docSecurity} | 文件大小: ${item.docSize}`);
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-950/80 border border-cyan-700/50 text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>知识库列表</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono font-medium">
                  全效技术沉淀与变更台账
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                收录全域重大变更复盘、技术风险评估、实施验证意见与标准文档下载 · <span className="text-cyan-400 font-semibold">每页严格显示 10 条数据</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-slate-300 font-mono">
            <span className="text-slate-500">知识条目总数:</span>
            <span className="text-cyan-400 font-bold text-sm">{filteredItems.length}</span>
            <span className="text-slate-500">条</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Ribbon matching screenshot layout & requirements */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Keyword Search Input */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="请输入名称 / 描述 / 编号"
              className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Type Select Dropdown */}
          <div className="w-36">
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
            >
              <option value="ALL">请选择类型 (全部)</option>
              <option value="重大变更">重大变更</option>
              <option value="紧急变更">紧急变更</option>
              <option value="架构升级">架构升级</option>
              <option value="性能调优">性能调优</option>
              <option value="标准变更">标准变更</option>
            </select>
          </div>

          {/* Recent Date Range Picker (2026/11/01 - 2026/11/06) */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-300 font-mono text-xs">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            />
            <span className="text-slate-500 font-bold">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-sm shadow-cyan-900/30 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            搜索
          </button>

          {/* Reset Button */}
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            重置
          </button>
        </div>
      </div>

      {/* Modernized 12-Column High-Fidelity Data Table matching screenshot image_34aadd40.png */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1450px]">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                <th className="py-3 px-3 text-center w-12 border-r border-slate-800/80">序号</th>
                <th className="py-3 px-4 min-w-[190px] border-r border-slate-800/80">内容</th>
                <th className="py-3 px-4 min-w-[180px] border-r border-slate-800/80">描述</th>
                <th className="py-3 px-3 min-w-[140px] border-r border-slate-800/80">变更影响</th>
                <th className="py-3 px-3 min-w-[150px] border-r border-slate-800/80">变更技术风险评估</th>
                <th className="py-3 px-3 min-w-[140px] border-r border-slate-800/80">所需调配资源</th>
                <th className="py-3 px-3 min-w-[150px] border-r border-slate-800/80">实施情况</th>
                <th className="py-3 px-3 min-w-[100px] border-r border-slate-800/80 text-center">实施结果</th>
                <th className="py-3 px-3 min-w-[140px] border-r border-slate-800/80">验证结果</th>
                <th className="py-3 px-4 min-w-[160px] border-r border-slate-800/80">验证意见信息</th>
                <th className="py-3 px-3 min-w-[130px] border-r border-slate-800/80 font-mono">创建时间</th>
                <th className="py-3 px-4 text-center min-w-[140px] sticky right-0 bg-slate-950 border-l border-slate-800 shadow-l">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-500 font-medium">
                    未查找到符合筛选条件的知识库变更记录
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item, index) => {
                  const globalIdx = (currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-800/50 transition-colors group"
                    >
                      {/* 1. 序号 */}
                      <td className="py-3 px-3 text-center font-mono text-slate-400 border-r border-slate-800/60 font-semibold">
                        {globalIdx}
                      </td>

                      {/* 2. 内容 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 font-medium">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-semibold border ${
                                item.type === '紧急变更'
                                  ? 'bg-rose-950/80 text-rose-400 border-rose-800'
                                  : item.type === '重大变更'
                                  ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                                  : item.type === '架构升级'
                                  ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                                  : 'bg-cyan-950/80 text-cyan-400 border-cyan-800'
                              }`}
                            >
                              {item.type}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">{item.code}</span>
                          </div>
                          <div className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                            {item.title}
                          </div>
                        </div>
                      </td>

                      {/* 3. 描述 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300 line-clamp-3 leading-relaxed">
                        {item.description}
                      </td>

                      {/* 4. 变更影响 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-slate-300">
                        {item.impact}
                      </td>

                      {/* 5. 变更技术风险评估 */}
                      <td className="py-3 px-3 border-r border-slate-800/60">
                        <div className="flex items-start gap-1.5">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 mt-0.5 ${
                              item.riskLevel === '高'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                                : item.riskLevel === '中'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            }`}
                          >
                            {item.riskLevel}风险
                          </span>
                          <span className="text-slate-300 leading-snug">{item.riskAssessment}</span>
                        </div>
                      </td>

                      {/* 6. 所需调配资源 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-slate-300 font-mono text-[10px]">
                        {item.resources}
                      </td>

                      {/* 7. 实施情况 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-slate-300">
                        {item.implementationStatus}
                      </td>

                      {/* 8. 实施结果 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-semibold text-[10px]">
                          <CheckCircle2 className="w-3 h-3" />
                          {item.implementationResult}
                        </span>
                      </td>

                      {/* 9. 验证结果 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-emerald-400 font-mono text-[10px]">
                        {item.verificationResult}
                      </td>

                      {/* 10. 验证意见信息 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300">
                        {item.verificationOpinion}
                      </td>

                      {/* 11. 创建时间 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 font-mono text-slate-400 whitespace-nowrap">
                        {item.createdAt}
                      </td>

                      {/* 12. 操作 */}
                      <td className="py-3 px-4 text-center sticky right-0 bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 shadow-l whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          {/* 文档下载 / 文档下载(无文档) */}
                          {item.hasDocument ? (
                            <button
                              onClick={() => setSelectedDocItem(item)}
                              className="px-2 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-800 text-cyan-300 hover:text-cyan-200 transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                              title="查看并下载附件文档"
                            >
                              <Download className="w-3 h-3" />
                              文档下载
                            </button>
                          ) : (
                            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-600 font-mono cursor-not-allowed">
                              文档下载(无文档)
                            </span>
                          )}

                          {/* 查看详情 */}
                          <button
                            onClick={() => {
                              setSelectedDetailItem(item);
                            }}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-cyan-400" />
                            查看详情
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* High-Precision Pagination Toolbar strictly adhering to 10 items/page */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>
              共 <strong className="text-cyan-400 font-bold">{filteredItems.length}</strong> 条记录
            </span>
            <span className="text-slate-600">|</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-semibold">
              每页 10 条
            </span>
            <span className="text-slate-600">|</span>
            <span>
              第 <strong className="text-slate-200">{currentPage}</strong> / {totalPages} 页
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Page Buttons */}
            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="上一页"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded font-mono font-semibold transition-colors ${
                    currentPage === pageNum
                      ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-900/50'
                      : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                title="下一页"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Jump to Page */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-1.5">
              <span className="text-slate-500">跳至</span>
              <input
                type="number"
                min={1}
                max={totalPages}
                value={jumpPage}
                onChange={(e) => setJumpPage(e.target.value)}
                placeholder={String(currentPage)}
                className="w-12 px-1.5 py-1 bg-slate-900 border border-slate-800 rounded text-center text-cyan-300 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-slate-500">页</span>
            </form>
          </div>
        </div>
      </div>

      {/* Modal 1: Document Download & Preview Modal */}
      {selectedDocItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-sm">知识库技术文档预览与下载</h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedDocItem.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDocItem(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-cyan-400" />
                    {selectedDocItem.docName}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 font-mono text-[10px]">
                    {selectedDocItem.docSecurity || 'L3-内部保密'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-400 text-[11px] font-mono pt-1">
                  <div>文件大小: <strong className="text-slate-200">{selectedDocItem.docSize}</strong></div>
                  <div>提单部门: <strong className="text-slate-200">{selectedDocItem.applicantDept}</strong></div>
                  <div>提单工程师: <strong className="text-slate-200">{selectedDocItem.applicant}</strong></div>
                  <div>创建日期: <strong className="text-slate-200">{selectedDocItem.createdAt}</strong></div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="font-semibold text-slate-200 block">文档目录与摘要说明</span>
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                  {selectedDocItem.description}
                </div>
              </div>

              <div className="p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/60 text-cyan-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-cyan-400" />
                  <span>已完成安全水纹与 DLP 签名解密校验</span>
                </div>
                <span className="font-mono text-[10px]">下载计数: 48 次</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDocItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                关闭预览
              </button>
              <button
                onClick={() => handleDownloadDoc(selectedDocItem)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-cyan-900/50"
              >
                <Download className="w-4 h-4" />
                立即安全下载 PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Knowledge Base 查看详情 Modal matching screenshot image_254d30b3.png */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>查看详情</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                  {selectedDetailItem.code}
                </span>
              </h2>
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Grid matching image_254d30b3.png */}
            <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              {/* Row 1: 内容, 变更影响, 所需调配资源, 验证结果 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">内容:</span>
                  <span className="text-slate-100 font-medium leading-relaxed">{selectedDetailItem.title}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">变更影响:</span>
                  <span className="text-slate-200 leading-relaxed">{selectedDetailItem.impact}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">所需调配资源:</span>
                  <span className="text-slate-200 font-mono text-[11px]">{selectedDetailItem.resources}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">验证结果:</span>
                  <span className="text-emerald-400 font-mono text-[11px] font-semibold">{selectedDetailItem.verificationResult}</span>
                </div>
              </div>

              {/* Row 2: 实施情况, 实施结果, 创建时间 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">实施情况:</span>
                  <span className="text-slate-200 leading-relaxed">{selectedDetailItem.implementationStatus}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">实施结果:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-semibold text-[11px]">
                    {selectedDetailItem.implementationResult}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0">创建时间:</span>
                  <span className="text-slate-300 font-mono">{selectedDetailItem.createdAt}</span>
                </div>
              </div>

              {/* Row 3: 验证意见信息 */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0">验证意见信息:</span>
                <span className="text-slate-200 leading-relaxed">{selectedDetailItem.verificationOpinion}</span>
              </div>

              {/* Row 4: 是否有用 (Dropdown) */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-cyan-400 font-bold block">是否有用:</label>
                <select
                  value={usefulnessChoice}
                  onChange={(e) => setUsefulnessChoice(e.target.value)}
                  className="w-full sm:w-72 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="">请选择验证结果</option>
                  <option value="是有用">是有用</option>
                  <option value="非常有帮助">非常有帮助</option>
                  <option value="基本符合需求">基本符合需求</option>
                  <option value="需要补充优化">需要补充优化</option>
                  <option value="否">否</option>
                </select>
              </div>

              {/* Row 5: 知识反馈 (Textarea) */}
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                <label className="text-cyan-400 font-bold block">知识反馈:</label>
                <textarea
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="请输入知识反馈..."
                  rows={3}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-sans"
                />
              </div>
            </div>

            {/* Modal Footer matching screenshot: 取消 / 确认 */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  setSelectedDetailItem(null);
                  setUsefulnessChoice('');
                  setFeedbackText('');
                }}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  alert(`知识反馈提交成功！\n评估条目: ${selectedDetailItem.title}\n验证结论: ${usefulnessChoice || '未选择'}\n反馈意见: ${feedbackText || '无'}`);
                  setSelectedDetailItem(null);
                  setUsefulnessChoice('');
                  setFeedbackText('');
                }}
                className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-sm shadow-cyan-900/50 transition-colors cursor-pointer"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
