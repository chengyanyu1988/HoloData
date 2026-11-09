import React, { useState } from 'react';
import { 
  CheckCircle2, Search, Filter, Clock, Eye, X, ChevronLeft, ChevronRight, Check, FileText
} from 'lucide-react';

export interface StandardWorkOrderItem {
  id: string;              // e.g. WO-2026-209112382
  code: string;            // 编号 (e.g. 209112382)
  title: string;           // 工单标题 / 名称
  status: '待分析' | '待审批' | '待实施' | '待验证' | '已完成'; // 状态
  priority: '高' | '中' | '低';                       // 优先级
  assignee: string;        // 当前受理人 (不同人员)
  applicant: string;       // 申领人 / 提单人 (不同人员)
  dept: string;            // 提单部门
  createTime: string;      // 提单时间 (2026)
  lastUpdateTime: string;  // 最后修改时间 (2026)
  finishTime?: string;     // 完成时间
  description: string;     // 描述 (真实无xxx)
  timelineNodes: {
    stage: string;
    person: string;
    status: 'completed' | 'active' | 'pending';
  }[];
  formAudits: {
    operator: string;
    role: string;
    time: string;
    receiver: string;
    auditTime: string;
    auditStatus: string;
    comment?: string;
  }[];
}

const INITIAL_DONE_WORK_ORDERS: StandardWorkOrderItem[] = [
  {
    id: 'WO-2026-209112382',
    code: '209112382',
    title: '天津西区 04 号读写天线阻抗衰减现场排错工单',
    status: '已完成',
    priority: '高',
    assignee: '张帆',
    applicant: '李建',
    dept: '全息基础设施运维部',
    createTime: '2026/11/06 09:12:34',
    lastUpdateTime: '2026/11/06 11:30:15',
    finishTime: '2026/11/06 11:30:15',
    description: '读写天线4号通道驻波比(VSWR)升至 2.15，经现场更换低损同轴避雷缆线后复测指标恢复至 1.08 正常水平。',
    timelineNodes: [
      { stage: '创建人', person: '李建', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '张帆', status: 'completed' },
      { stage: '受理中', person: '张帆', status: 'completed' },
      { stage: '处理完成', person: '张帆', status: 'completed' },
      { stage: '确认完成', person: '张建国', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '李建',
        role: '运维平台专员',
        time: '2026/11/06 09:12:34',
        receiver: '程总工',
        auditTime: '2026/11/06 09:14:00',
        auditStatus: '运维平台经理/提交提单',
        comment: '提交硬件故障现场紧急排错工单需求',
      },
      {
        operator: '张帆',
        role: '射频硬件工程师',
        time: '2026/11/06 09:14:00',
        receiver: '张建国',
        auditTime: '2026/11/06 11:30:15',
        auditStatus: '终验通过/已闭环',
        comment: '天线射频指标测试达标，同意关闭工单',
      },
    ],
  },
  {
    id: 'WO-2026-209112383',
    code: '209112383',
    title: 'MySQL 高可用数据库主从复制延迟紧急调优单',
    status: '已完成',
    priority: '低',
    assignee: '赵振华',
    applicant: '王强',
    dept: '数据库管理专家组',
    createTime: '2026/11/06 08:50:12',
    lastUpdateTime: '2026/11/06 10:15:00',
    finishTime: '2026/11/06 10:15:00',
    description: '主从数据库拉取 Binlog 延迟超 10s，通过调整 slave_parallel_workers 提升并发复制线程，延时已降至零毫秒。',
    timelineNodes: [
      { stage: '创建人', person: '王强', status: 'completed' },
      { stage: '上级审批人', person: '赵振华', status: 'completed' },
      { stage: '受理人', person: '王强', status: 'completed' },
      { stage: '受理中', person: '王强', status: 'completed' },
      { stage: '处理完成', person: '王强', status: 'completed' },
      { stage: '确认完成', person: '赵振华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '王强',
        role: 'DBA 运维工程师',
        time: '2026/11/06 08:50:12',
        receiver: '赵振华',
        auditTime: '2026/11/06 09:05:00',
        auditStatus: 'DBA主管/待复核',
        comment: '申请在低峰期进行并发复制线程调优',
      },
      {
        operator: '赵振华',
        role: '数据库专家',
        time: '2026/11/06 10:00:00',
        receiver: '王强',
        auditTime: '2026/11/06 10:15:00',
        auditStatus: 'DBA主管/验收合规',
        comment: '从库主从延迟完全平抑，调优方案生效。',
      },
    ],
  },
  {
    id: 'WO-2026-209112384',
    code: '209112384',
    title: '海河卡口边缘控制器千兆 PoE 模块更换实施单',
    status: '已完成',
    priority: '低',
    assignee: '赵勇',
    applicant: '李明远',
    dept: '智慧交通网络保障组',
    createTime: '2026/11/06 08:15:00',
    lastUpdateTime: '2026/11/06 09:40:22',
    finishTime: '2026/11/06 09:40:22',
    description: '网口丢包率达 0.8%，采购备品备件千兆 PoE 供电模块并已完成现场热插拔更换与全双工协商。',
    timelineNodes: [
      { stage: '创建人', person: '李明远', status: 'completed' },
      { stage: '上级审批人', person: '杜小刚', status: 'completed' },
      { stage: '受理人', person: '赵勇', status: 'completed' },
      { stage: '受理中', person: '赵勇', status: 'completed' },
      { stage: '处理完成', person: '赵勇', status: 'completed' },
      { stage: '确认完成', person: '杜小刚', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '杜小刚',
        role: '硬件主管',
        time: '2026/11/06 08:20:00',
        receiver: '赵勇',
        auditTime: '2026/11/06 09:40:22',
        auditStatus: '实施完成/确认正常',
        comment: '千兆网口全双工协商正常，无丢包现象。',
      },
    ],
  },
  {
    id: 'WO-2026-209112385',
    code: '209112385',
    title: '双基识读 AI 算法 GPU 显存限制热更新验证工单',
    status: '已完成',
    priority: '中',
    assignee: '严亮',
    applicant: '王海峰',
    dept: 'AI 视觉算法工程部',
    createTime: '2026/11/05 18:40:00',
    lastUpdateTime: '2026/11/06 08:00:00',
    finishTime: '2026/11/06 08:00:00',
    description: 'TensorRT 显存分配策略调整完毕，经过 24 小时夜间低照度识别率测试，识别率维持在 99.92%。',
    timelineNodes: [
      { stage: '创建人', person: '王海峰', status: 'completed' },
      { stage: '上级审批人', person: '罗国强', status: 'completed' },
      { stage: '受理人', person: '姜文涛', status: 'completed' },
      { stage: '受理中', person: '姜文涛', status: 'completed' },
      { stage: '处理完成', person: '姜文涛', status: 'completed' },
      { stage: '确认完成', person: '严亮', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '严亮',
        role: 'AI 质量总监',
        time: '2026/11/05 18:40:00',
        receiver: '王海峰',
        auditTime: '2026/11/06 08:00:00',
        auditStatus: '算法组长/验收归档',
        comment: '算法更新部署成功，Night-Vision 识别准确率达标',
      },
    ],
  },
  {
    id: 'WO-2026-209112386',
    code: '209112386',
    title: 'Redis 7.2 缓存集群 BigKey 分片清理完毕确认单',
    status: '已完成',
    priority: '高',
    assignee: '陈晨',
    applicant: '顾亚军',
    dept: '高速缓存架构组',
    createTime: '2026/11/05 14:10:00',
    lastUpdateTime: '2026/11/05 15:30:00',
    finishTime: '2026/11/05 15:30:00',
    description: '对大 Hash Key 成功执行渐进式 Scan 拆解，集群响应耗时由 18ms 降至 0.8ms。',
    timelineNodes: [
      { stage: '创建人', person: '顾亚军', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '陈晨', status: 'completed' },
      { stage: '受理中', person: '陈晨', status: 'completed' },
      { stage: '处理完成', person: '陈晨', status: 'completed' },
      { stage: '确认完成', person: '程总工', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '陈晨',
        role: 'SRE 运维工程师',
        time: '2026/11/05 14:10:00',
        receiver: '程总工',
        auditTime: '2026/11/05 15:30:00',
        auditStatus: 'SRE 负责人/已归档',
        comment: '性能测试指标符合要求，予以完结归档',
      },
    ],
  },
  {
    id: 'WO-2026-209112387',
    code: '209112387',
    title: '核心路由 Core-R01 OS 版本安全补丁缝补工单',
    status: '已完成',
    priority: '高',
    assignee: '刘芳',
    applicant: '孙伟',
    dept: '网络工程专家组',
    createTime: '2026/11/05 11:20:00',
    lastUpdateTime: '2026/11/05 14:00:00',
    finishTime: '2026/11/05 14:00:00',
    description: '完成网络主干 Core-R01 路由内核 CVE-2026-9812 高危漏洞补丁无缝热加载升级。',
    timelineNodes: [
      { stage: '创建人', person: '孙伟', status: 'completed' },
      { stage: '上级审批人', person: '刘芳', status: 'completed' },
      { stage: '受理人', person: '刘芳', status: 'completed' },
      { stage: '受理中', person: '刘芳', status: 'completed' },
      { stage: '处理完成', person: '刘芳', status: 'completed' },
      { stage: '确认完成', person: '孙伟', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '刘芳',
        role: '安全分析师',
        time: '2026/11/05 11:20:00',
        receiver: '孙伟',
        auditTime: '2026/11/05 14:00:00',
        auditStatus: '安全组/缝补完成闭环',
        comment: '完成补丁热加载，BGP 路由表平滑收敛。',
      },
    ],
  },
  {
    id: 'WO-2026-209112388',
    code: '209112388',
    title: 'HDFS 数据节点 DN-102 固态硬盘故障更换变更单',
    status: '已完成',
    priority: '中',
    assignee: '许峰',
    applicant: '宋佳欣',
    dept: '大数据平台保障部',
    createTime: '2026/11/04 16:30:00',
    lastUpdateTime: '2026/11/04 19:15:00',
    finishTime: '2026/11/04 19:15:00',
    description: 'DN-102 节点 NVMe SSD 盘寿命耗尽报警，更换 3.84TB 企业级盘并完成数据块自动副本修复。',
    timelineNodes: [
      { stage: '创建人', person: '宋佳欣', status: 'completed' },
      { stage: '上级审批人', person: '彭雷', status: 'completed' },
      { stage: '受理人', person: '许峰', status: 'completed' },
      { stage: '受理中', person: '许峰', status: 'completed' },
      { stage: '处理完成', person: '许峰', status: 'completed' },
      { stage: '确认完成', person: '彭雷', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '许峰',
        role: '存储工程师',
        time: '2026/11/04 16:30:00',
        receiver: '彭雷',
        auditTime: '2026/11/04 19:15:00',
        auditStatus: '大数据主管/验收归档',
        comment: 'HDFS 副本一致性检查百分之百通过。',
      },
    ],
  },
  {
    id: 'WO-2026-209112389',
    code: '209112389',
    title: 'Nginx 边缘网关 TLS 1.3 证书升级与算法替换',
    status: '已完成',
    priority: '低',
    assignee: '钱国栋',
    applicant: '潘智勇',
    dept: '网络安全保障组',
    createTime: '2026/11/04 10:00:00',
    lastUpdateTime: '2026/11/04 11:30:00',
    finishTime: '2026/11/04 11:30:00',
    description: '替换边缘网关 4096 位 ECC SSL/TLS 国密算法证书，防范旧证书到期隐患。',
    timelineNodes: [
      { stage: '创建人', person: '潘智勇', status: 'completed' },
      { stage: '上级审批人', person: '钱国栋', status: 'completed' },
      { stage: '受理人', person: '钱国栋', status: 'completed' },
      { stage: '受理中', person: '钱国栋', status: 'completed' },
      { stage: '处理完成', person: '钱国栋', status: 'completed' },
      { stage: '确认完成', person: '潘智勇', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '钱国栋',
        role: '安全运维',
        time: '2026/11/04 10:00:00',
        receiver: '潘智勇',
        auditTime: '2026/11/04 11:30:00',
        auditStatus: '安全组/证书全息验证',
        comment: '新证书套件部署完毕，HTTPS 握手耗时降低 12ms。',
      },
    ],
  },
  {
    id: 'WO-2026-209112390',
    code: '209112390',
    title: 'Kafka 消息中间件 Topic 倾斜分区自动重平衡',
    status: '已完成',
    priority: '中',
    assignee: '马天明',
    applicant: '孙丽丽',
    dept: '中间件运维部',
    createTime: '2026/11/03 14:20:00',
    lastUpdateTime: '2026/11/03 16:50:00',
    finishTime: '2026/11/03 16:50:00',
    description: '通过 reassign-partitions 工具打散实时车联网数据倾斜 Partition，负载完全均衡。',
    timelineNodes: [
      { stage: '创建人', person: '孙丽丽', status: 'completed' },
      { stage: '上级审批人', person: '何少华', status: 'completed' },
      { stage: '受理人', person: '马天明', status: 'completed' },
      { stage: '受理中', person: '马天明', status: 'completed' },
      { stage: '处理完成', person: '马天明', status: 'completed' },
      { stage: '确认完成', person: '何少华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '马天明',
        role: '中间件专家',
        time: '2026/11/03 14:20:00',
        receiver: '何少华',
        auditTime: '2026/11/03 16:50:00',
        auditStatus: '中间件组/重平衡归档',
        comment: 'Broker 节点 I/O 读写率降至 35% 安全线。',
      },
    ],
  },
  {
    id: 'WO-2026-209112391',
    code: '209112391',
    title: 'Kubernetes Pod 资源 Limits 动态限额微调工单',
    status: '已完成',
    priority: '低',
    assignee: '郭宝成',
    applicant: '周建国',
    dept: '容器云平台组',
    createTime: '2026/11/03 09:10:00',
    lastUpdateTime: '2026/11/03 10:20:00',
    finishTime: '2026/11/03 10:20:00',
    description: '微调业务网关 Pod CPU Request/Limits 参数，杜绝 OOMKilled 异常容器重启。',
    timelineNodes: [
      { stage: '创建人', person: '周建国', status: 'completed' },
      { stage: '上级审批人', person: '郭宝成', status: 'completed' },
      { stage: '受理人', person: '郭宝成', status: 'completed' },
      { stage: '受理中', person: '郭宝成', status: 'completed' },
      { stage: '处理完成', person: '郭宝成', status: 'completed' },
      { stage: '确认完成', person: '周建国', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '郭宝成',
        role: '云原生架构师',
        time: '2026/11/03 09:10:00',
        receiver: '周建国',
        auditTime: '2026/11/03 10:20:00',
        auditStatus: '云原生组/更新归档',
        comment: 'Kubelet 指标观测正常，成功归档。',
      },
    ],
  },
  {
    id: 'WO-2026-209112392',
    code: '209112392',
    title: 'UPS 无中断电源蓄电池组例行放电测试评估单',
    status: '已完成',
    priority: '低',
    assignee: '徐洋',
    applicant: '严亮',
    dept: '机房动力环境组',
    createTime: '2026/11/02 15:00:00',
    lastUpdateTime: '2026/11/02 17:30:00',
    finishTime: '2026/11/02 17:30:00',
    description: '对 B2 数据中心 32 节蓄电池组完成 30 分钟满载模拟放电，内阻测试全部合格。',
    timelineNodes: [
      { stage: '创建人', person: '严亮', status: 'completed' },
      { stage: '上级审批人', person: '顾亚军', status: 'completed' },
      { stage: '受理人', person: '徐洋', status: 'completed' },
      { stage: '受理中', person: '徐洋', status: 'completed' },
      { stage: '处理完成', person: '徐洋', status: 'completed' },
      { stage: '确认完成', person: '顾亚军', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '徐洋',
        role: '动环工程师',
        time: '2026/11/02 15:00:00',
        receiver: '顾亚军',
        auditTime: '2026/11/02 17:30:00',
        auditStatus: '动环主管/放电测试归档',
        comment: '电池组健康度(SOH)98.5%，符合机房交付标准。',
      },
    ],
  },
  {
    id: 'WO-2026-209112393',
    code: '209112393',
    title: 'RabbitMQ 交换机死信队列存量积压热清理单',
    status: '已完成',
    priority: '低',
    assignee: '周建国',
    applicant: '李建',
    dept: '中间件运维部',
    createTime: '2026/11/02 11:00:00',
    lastUpdateTime: '2026/11/02 14:45:00',
    finishTime: '2026/11/02 14:45:00',
    description: '死信队列积压超 50 万条，使用 Shovel 插件重定向至冷存储归档成功。',
    timelineNodes: [
      { stage: '创建人', person: '李建', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '周建国', status: 'completed' },
      { stage: '受理中', person: '周建国', status: 'completed' },
      { stage: '处理完成', person: '周建国', status: 'completed' },
      { stage: '确认完成', person: '程总工', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '周建国',
        role: '中间件工程师',
        time: '2026/11/02 11:00:00',
        receiver: '程总工',
        auditTime: '2026/11/02 14:45:00',
        auditStatus: '归档完成',
        comment: '队列清理完毕，集群内存使用下降 3.2GB',
      },
    ],
  },
  {
    id: 'WO-2026-209112394',
    code: '209112394',
    title: 'Prometheus 警报规则评估与抑制死锁解除单',
    status: '已完成',
    priority: '中',
    assignee: '何少华',
    applicant: '郭宝成',
    dept: '监控运维保障组',
    createTime: '2026/11/02 09:00:00',
    lastUpdateTime: '2026/11/02 10:40:00',
    finishTime: '2026/11/02 10:40:00',
    description: '报警风暴触发的抑制规则环形死锁已解除，修改 Alertmanager 链路平滑上线。',
    timelineNodes: [
      { stage: '创建人', person: '郭宝成', status: 'completed' },
      { stage: '上级审批人', person: '许峰', status: 'completed' },
      { stage: '受理人', person: '何少华', status: 'completed' },
      { stage: '受理中', person: '何少华', status: 'completed' },
      { stage: '处理完成', person: '何少华', status: 'completed' },
      { stage: '确认完成', person: '许峰', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '何少华',
        role: '监控架构师',
        time: '2026/11/02 09:00:00',
        receiver: '许峰',
        auditTime: '2026/11/02 10:40:00',
        auditStatus: '归档闭环',
        comment: '告警收敛逻辑符合预期，予以完结',
      },
    ],
  },
  {
    id: 'WO-2026-209112395',
    code: '209112395',
    title: '数据中心冷通道机柜温湿度传感器漂移校准',
    status: '已完成',
    priority: '低',
    assignee: '彭雷',
    applicant: '陈晨',
    dept: '数据中心环境部',
    createTime: '2026/11/01 10:30:00',
    lastUpdateTime: '2026/11/01 12:00:00',
    finishTime: '2026/11/01 12:00:00',
    description: '环境温湿度漂移 1.5 度，对 Modbus 通信地址 0x0A 传感器校准完成。',
    timelineNodes: [
      { stage: '创建人', person: '陈晨', status: 'completed' },
      { stage: '上级审批人', person: '赵振华', status: 'completed' },
      { stage: '受理人', person: '彭雷', status: 'completed' },
      { stage: '受理中', person: '彭雷', status: 'completed' },
      { stage: '处理完成', person: '彭雷', status: 'completed' },
      { stage: '确认完成', person: '赵振华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '彭雷',
        role: '动环工程师',
        time: '2026/11/01 10:30:00',
        receiver: '赵振华',
        auditTime: '2026/11/01 12:00:00',
        auditStatus: '校准完成',
        comment: '环境温湿度采样恢复精准，已归档',
      },
    ],
  },
];

interface WorkOrderDoneViewProps {
  pageTitle?: string;
  subTitle?: string;
}

export const WorkOrderDoneView: React.FC<WorkOrderDoneViewProps> = ({
  pageTitle = '已办工单与历史归档列表',
  subTitle = '根据最新排版呈现 · 单一查看详情操作列 · 每页显示 10 条数据',
}) => {
  const [ordersList] = useState<StandardWorkOrderItem[]>(INITIAL_DONE_WORK_ORDERS);

  // Search & Filter state variables matching screenshot image_33f05cd3.png:
  // 请输入工单名称, 全部优先级, 全部工单状态, 搜索
  const [titleSearch, setTitleSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states (Per user prompt discipline: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive Detail Modal state
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<StandardWorkOrderItem | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'process' | 'form'>('process');

  // Filter Logic
  const filteredOrders = ordersList.filter((item) => {
    const matchesTitle = item.title.toLowerCase().includes(titleSearch.toLowerCase()) || 
                         item.code.toLowerCase().includes(titleSearch.toLowerCase()) ||
                         item.id.toLowerCase().includes(titleSearch.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesTitle && matchesPriority && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
  const currentPageItems = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
    setJumpPageInput(String(validPage));
  };

  const getPriorityBadgeClass = (p: StandardWorkOrderItem['priority']) => {
    switch (p) {
      case '高':
        return 'text-rose-400 font-bold';
      case '中':
        return 'text-amber-400 font-bold';
      case '低':
        return 'text-emerald-400 font-bold';
    }
  };

  const getStatusBadgeClass = (st: StandardWorkOrderItem['status']) => {
    switch (st) {
      case '待分析':
        return 'text-cyan-400 font-bold';
      case '待审批':
        return 'text-amber-400 font-bold';
      case '待实施':
        return 'text-yellow-300 font-bold';
      case '待验证':
        return 'text-blue-400 font-bold';
      case '已完成':
        return 'text-emerald-400 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Section Card matching image_33f05cd3.png */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">{pageTitle}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              {subTitle}
            </span>
          </div>
        </div>

        {/* Filter Toolbar matching screenshot image_33f05cd3.png:
            请输入工单名称, 全部优先级, 全部工单状态, 搜索 */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Input 1: 请输入工单名称 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入工单名称"
              value={titleSearch}
              onChange={(e) => {
                setTitleSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52 font-sans"
            />
          </div>

          {/* Dropdown 1: 全部优先级 */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部优先级</option>
            <option value="高">高</option>
            <option value="中">中</option>
            <option value="低">低</option>
          </select>

          {/* Dropdown 2: 全部工单状态 */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
          >
            <option value="all">全部工单状态</option>
            <option value="待分析">待分析</option>
            <option value="待审批">待审批</option>
            <option value="待实施">待实施</option>
            <option value="待验证">待验证</option>
            <option value="已完成">已完成</option>
          </select>

          {/* Search Button */}
          <button
            onClick={() => setCurrentPage(1)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table matching exact columns from image_33f05cd3.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3 text-center w-12">编号</th>
                <th className="py-3 px-3">编号</th>
                <th className="py-3 px-3 text-center font-sans">状态</th>
                <th className="py-3 px-3 text-center font-sans">优先级</th>
                <th className="py-3 px-3 font-sans">当前受理人</th>
                <th className="py-3 px-3 font-sans">申领人</th>
                <th className="py-3 px-3">提单时间</th>
                <th className="py-3 px-3">最后修改时间</th>
                <th className="py-3 px-3 font-sans">描述</th>
                <th className="py-3 px-3 text-right font-sans">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentPageItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-500 font-sans">
                    暂无符合条件的工单记录
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrderDetail(item)}
                    >
                      {/* 1. 序号编号 */}
                      <td className="py-3 px-3 text-center text-slate-500 font-mono">
                        {globalIdx}
                      </td>

                      {/* 2. 工单编号 code */}
                      <td className="py-3 px-3 font-bold text-cyan-400 font-mono">
                        {item.code}
                      </td>

                      {/* 3. 状态 */}
                      <td className="py-3 px-3 text-center font-sans">
                        <span className={`text-[11px] inline-block ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* 4. 优先级 */}
                      <td className="py-3 px-3 text-center font-sans">
                        <span className={`text-[11px] inline-block ${getPriorityBadgeClass(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* 5. 当前受理人 (Diverse engineers) */}
                      <td className="py-3 px-3 text-slate-200 font-sans font-medium">
                        {item.assignee}
                      </td>

                      {/* 6. 申领人 (Diverse applicants) */}
                      <td className="py-3 px-3 text-slate-300 font-sans">
                        {item.applicant}
                      </td>

                      {/* 7. 提单时间 */}
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {item.createTime}
                      </td>

                      {/* 8. 最后修改时间 */}
                      <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                        {item.lastUpdateTime}
                      </td>

                      {/* 9. 描述 */}
                      <td className="py-3 px-3 text-slate-300 font-sans max-w-xs">
                        <div className="truncate" title={item.description}>
                          {item.description}
                        </div>
                      </td>

                      {/* 10. 操作: 查看详情 (SOLE ACTION matching image_33f05cd3.png) */}
                      <td className="py-3 px-3 text-right font-sans">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedOrderDetail(item);
                          }}
                          className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Matching prompt constraint: 每页显示10条数据) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredOrders.length)} 条，共 {filteredOrders.length} 条工单
          </span>

          <div className="flex flex-wrap items-center gap-3">
            {/* Page buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-40"
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-2.5 py-1 rounded font-bold ${
                    currentPage === p
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400 disabled:opacity-40"
              >
                &gt;
              </button>
            </div>

            {/* Page Size Select */}
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none font-sans"
            >
              <option value="10">10条/页</option>
              <option value="20">20条/页</option>
              <option value="50">50条/页</option>
            </select>

            {/* Jump Page */}
            <div className="flex items-center gap-1.5 font-sans">
              <span>跳至</span>
              <input
                type="text"
                value={jumpPageInput}
                onChange={(e) => setJumpPageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const parsed = parseInt(jumpPageInput, 10);
                    if (!isNaN(parsed)) handlePageChange(parsed);
                  }
                }}
                className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center text-slate-200 font-mono"
              />
              <span>页</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Work Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  工单全息明细卡片 ({selectedOrderDetail.id})
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 工单信息 Header Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
              <div className="text-xs font-bold text-cyan-400 tracking-wide uppercase font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                工单基础信息
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">提单人:</span>
                  <span className="font-bold text-slate-100 font-sans">{selectedOrderDetail.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">提单部门:</span>
                  <span className="text-slate-200 font-sans">{selectedOrderDetail.dept}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">提单时间:</span>
                  <span className="text-slate-300 text-[11px]">{selectedOrderDetail.createTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">完成时间:</span>
                  <span className="text-slate-300 text-[11px]">{selectedOrderDetail.finishTime || '处置中'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">当前受理人:</span>
                  <span className="font-bold text-emerald-400 font-sans">{selectedOrderDetail.assignee}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">当前状态:</span>
                  <span className={`font-bold font-sans ${getStatusBadgeClass(selectedOrderDetail.status)}`}>
                    {selectedOrderDetail.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block font-sans text-[11px]">工单描述:</span>
                <p className="text-slate-200 font-sans text-xs mt-0.5 leading-relaxed font-medium">
                  {selectedOrderDetail.description}
                </p>
              </div>
            </div>

            {/* Detail Tabs: 工单流程信息 (Tab 1) | 流程表单 (Tab 2) */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 border-b border-slate-800">
                <button
                  onClick={() => setDetailActiveTab('process')}
                  className={`pb-2.5 text-xs font-bold font-sans transition-all relative ${
                    detailActiveTab === 'process'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  工单流程信息
                </button>
                <button
                  onClick={() => setDetailActiveTab('form')}
                  className={`pb-2.5 text-xs font-bold font-sans transition-all relative ${
                    detailActiveTab === 'form'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  流程表单
                </button>
              </div>

              {/* Tab 1 Content: Flowchart */}
              {detailActiveTab === 'process' && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
                  <div className="text-xs text-slate-400 font-sans">
                    工单工作流状态演进图（菱形节点表示节点阶段与执行责任人）
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 py-6 font-sans">
                    {selectedOrderDetail.timelineNodes.map((node, nIdx) => {
                      const isActive = node.status === 'active';
                      const isCompleted = node.status === 'completed';

                      return (
                        <div key={nIdx} className="flex items-center gap-4">
                          <div
                            className={`w-24 h-24 rotate-45 flex flex-col items-center justify-center transition-all shadow-lg border-2 ${
                              isCompleted
                                ? 'bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-400 text-white shadow-cyan-500/20'
                                : isActive
                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-300 text-white shadow-emerald-500/30 scale-110 animate-pulse'
                                : 'bg-slate-900 border-slate-800 text-slate-500'
                            }`}
                          >
                            <div className="-rotate-45 text-center space-y-0.5 font-bold text-xs">
                              <div className="text-slate-100 text-[11px]">{node.stage}</div>
                              <div className="text-cyan-200 text-[10px] font-mono border-t border-cyan-400/40 pt-0.5">
                                {node.person}
                              </div>
                            </div>
                          </div>

                          {nIdx < selectedOrderDetail.timelineNodes.length - 1 && (
                            <div className="text-cyan-500/60 text-lg font-mono font-bold px-1">
                              ➔
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2 Content: Audit Log */}
              {detailActiveTab === 'form' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
                  <div className="divide-y divide-slate-800">
                    {selectedOrderDetail.formAudits.map((audit, aIdx) => (
                      <div key={aIdx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                            {audit.operator.slice(0, 1)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-100 text-xs">{audit.operator}</span>
                              <span className="text-[11px] px-2 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                                {audit.role}
                              </span>
                            </div>
                            <div className="text-slate-400 text-[11px] mt-0.5">
                              接收人: <span className="text-cyan-300 font-mono">{audit.receiver}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right font-mono">
                          <div className="text-slate-300 font-bold text-xs">{audit.auditStatus}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">{audit.auditTime}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors"
              >
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
