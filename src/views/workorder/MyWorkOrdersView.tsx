import React, { useState } from 'react';
import { 
  ClipboardList, Plus, Search, Filter, Clock, CheckCircle2, 
  Trash2, Eye, AlertTriangle, X, ChevronLeft, ChevronRight, Check
} from 'lucide-react';
import { WorkOrder } from '../../types';

export interface ExtendedWorkOrderItem {
  id: string;              // e.g. WO-2026-209112382
  code: string;            // 编号 (e.g. 209112382)
  title: string;           // 工单标题 / 名称
  status: '待分析' | '待审批' | '待实施' | '待验证' | '已完成'; // 状态
  priority: '高' | '中' | '低';                       // 优先级
  assignee: string;        // 当前受理人 (不同人员)
  applicant: string;       // 提单人 (不同人员)
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

const INITIAL_MY_WORK_ORDERS: ExtendedWorkOrderItem[] = [
  {
    id: 'WO-2026-209112382',
    code: '209112382',
    title: '天津西区 04 号读写天线阻抗衰减现场排错工单',
    status: '待分析',
    priority: '高',
    assignee: '张帆',
    applicant: '李建',
    dept: '全息基础设施运维部',
    createTime: '2026/11/06 09:12:34',
    lastUpdateTime: '2026/11/06 09:15:20',
    finishTime: '2026/11/06 18:00:00',
    description: '读写天线4号通道驻波比(VSWR)升至 2.15，需安排现场硬件工程师张帆排查同轴避雷缆线。',
    timelineNodes: [
      { stage: '创建人', person: '李建', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '张帆', status: 'active' },
      { stage: '受理中', person: '张帆', status: 'pending' },
      { stage: '处理完成', person: '张帆', status: 'pending' },
      { stage: '确认完成', person: '张建国', status: 'pending' },
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
        operator: '程总工',
        role: '全栈基础设施专家',
        time: '2026/11/06 09:14:00',
        receiver: '张帆',
        auditTime: '2026/11/06 09:15:20',
        auditStatus: '运维平台经理/审批通过',
        comment: '批准工单提派，安排今日上午现场踏勘',
      },
    ],
  },
  {
    id: 'WO-2026-209112383',
    code: '209112383',
    title: 'MySQL 高可用主从复制延迟紧急调优审批单',
    status: '待审批',
    priority: '低',
    assignee: '赵振华',
    applicant: '王强',
    dept: '数据库管理专家组',
    createTime: '2026/11/06 08:50:12',
    lastUpdateTime: '2026/11/06 09:05:00',
    finishTime: '2026/11/06 17:30:00',
    description: '主从数据库拉取 Binlog 延迟超 10s，申请临时提升 I/O 线程并行度并重启复制链路。',
    timelineNodes: [
      { stage: '创建人', person: '王强', status: 'completed' },
      { stage: '上级审批人', person: '赵振华', status: 'active' },
      { stage: '受理人', person: '王强', status: 'pending' },
      { stage: '受理中', person: '王强', status: 'pending' },
      { stage: '处理完成', person: '王强', status: 'pending' },
      { stage: '确认完成', person: '赵振华', status: 'pending' },
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
    ],
  },
  {
    id: 'WO-2026-209112384',
    code: '209112384',
    title: '海河卡口边缘控制器千兆 PoE 模块更换实施单',
    status: '待实施',
    priority: '低',
    assignee: '赵勇',
    applicant: '李明远',
    dept: '智慧交通网络保障组',
    createTime: '2026/11/06 08:15:00',
    lastUpdateTime: '2026/11/06 08:30:22',
    finishTime: '2026/11/06 16:00:00',
    description: '网口丢包率达 0.8%，采购备品备件千兆 PoE 供电模块并安排现场热插拔更换。',
    timelineNodes: [
      { stage: '创建人', person: '李明远', status: 'completed' },
      { stage: '上级审批人', person: '杜小刚', status: 'completed' },
      { stage: '受理人', person: '赵勇', status: 'completed' },
      { stage: '受理中', person: '赵勇', status: 'active' },
      { stage: '处理完成', person: '赵勇', status: 'pending' },
      { stage: '确认完成', person: '杜小刚', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '李明远',
        role: '网络硬件工程师',
        time: '2026/11/06 08:15:00',
        receiver: '杜小刚',
        auditTime: '2026/11/06 08:20:00',
        auditStatus: '部门经理/批准领料',
        comment: '已领取 PoE 千兆模块备件，进入实施阶段',
      },
    ],
  },
  {
    id: 'WO-2026-209112385',
    code: '209112385',
    title: '双基识读 AI 算法 GPU 显存限制热更新验证工单',
    status: '待验证',
    priority: '中',
    assignee: '严亮',
    applicant: '王海峰',
    dept: 'AI 视觉算法工程部',
    createTime: '2026/11/05 18:40:00',
    lastUpdateTime: '2026/11/05 19:10:00',
    finishTime: '2026/11/06 12:00:00',
    description: 'TensorRT 显存分配策略调整完毕，需对夜间低照度识别准确率进行 24h 持续验证。',
    timelineNodes: [
      { stage: '创建人', person: '王海峰', status: 'completed' },
      { stage: '上级审批人', person: '罗国强', status: 'completed' },
      { stage: '受理人', person: '姜文涛', status: 'completed' },
      { stage: '受理中', person: '姜文涛', status: 'completed' },
      { stage: '处理完成', person: '姜文涛', status: 'completed' },
      { stage: '确认完成', person: '严亮', status: 'active' },
    ],
    formAudits: [
      {
        operator: '王海峰',
        role: 'AI 算法工程师',
        time: '2026/11/05 18:40:00',
        receiver: '严亮',
        auditTime: '2026/11/05 19:10:00',
        auditStatus: '算法组长/待终验',
        comment: '算法更新部署成功，请求终验关闭',
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
    title: '防火墙长连接会话清理脚本部署申请单',
    status: '待分析',
    priority: '中',
    assignee: '刘芳',
    applicant: '孙伟',
    dept: '网络安全保障组',
    createTime: '2026/11/05 11:20:00',
    lastUpdateTime: '2026/11/05 11:45:00',
    finishTime: '2026/11/06 18:00:00',
    description: '部署 Crontab 定时清理无用会话脚本，防止防火墙 TCP 连接池再次溢出。',
    timelineNodes: [
      { stage: '创建人', person: '孙伟', status: 'completed' },
      { stage: '上级审批人', person: '刘芳', status: 'active' },
      { stage: '受理人', person: '孙伟', status: 'pending' },
      { stage: '受理中', person: '孙伟', status: 'pending' },
      { stage: '处理完成', person: '孙伟', status: 'pending' },
      { stage: '确认完成', person: '程总工', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '孙伟',
        role: '安全工程师',
        time: '2026/11/05 11:20:00',
        receiver: '刘芳',
        auditTime: '2026/11/05 11:45:00',
        auditStatus: '安全总监/审核中',
        comment: '申请定时清理策略安全评审',
      },
    ],
  },
  {
    id: 'WO-2026-209112388',
    code: '209112388',
    title: 'HDFS 存储节点 DN-08 NVMe 缓存固态硬盘热更单',
    status: '待实施',
    priority: '高',
    assignee: '许峰',
    applicant: '宋佳欣',
    dept: '大数据底层架构组',
    createTime: '2026/11/05 10:00:00',
    lastUpdateTime: '2026/11/05 10:00:00',
    finishTime: '2026/11/06 18:00:00',
    description: 'SSD 盘健康度 SOH 降至 12%，备件盘已经就位，安排资深存储工程师许峰换盘。',
    timelineNodes: [
      { stage: '创建人', person: '宋佳欣', status: 'completed' },
      { stage: '上级审批人', person: '彭雷', status: 'completed' },
      { stage: '受理人', person: '许峰', status: 'completed' },
      { stage: '受理中', person: '许峰', status: 'active' },
      { stage: '处理完成', person: '许峰', status: 'pending' },
      { stage: '确认完成', person: '彭雷', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '宋佳欣',
        role: '大数据运维',
        time: '2026/11/05 10:00:00',
        receiver: '许峰',
        auditTime: '2026/11/05 10:00:00',
        auditStatus: '待实施/硬件提派',
        comment: '磁盘告警触发硬件更换单',
      },
    ],
  },
  {
    id: 'WO-2026-209112389',
    code: '209112389',
    title: 'Core-SW02 堆叠交换机光模块双路收发测试单',
    status: '待验证',
    priority: '中',
    assignee: '钱国栋',
    applicant: '潘智勇',
    dept: '网络工程专家组',
    createTime: '2026/11/05 09:15:00',
    lastUpdateTime: '2026/11/05 09:15:00',
    finishTime: '2026/11/06 18:00:00',
    description: '核心堆叠链路清洗完毕，请求网络验证官钱国栋做 40G 流量误码率复核。',
    timelineNodes: [
      { stage: '创建人', person: '潘智勇', status: 'completed' },
      { stage: '上级审批人', person: '钱国栋', status: 'completed' },
      { stage: '受理人', person: '徐洋', status: 'completed' },
      { stage: '受理中', person: '徐洋', status: 'completed' },
      { stage: '处理完成', person: '徐洋', status: 'completed' },
      { stage: '确认完成', person: '钱国栋', status: 'active' },
    ],
    formAudits: [
      {
        operator: '潘智勇',
        role: '网络架构师',
        time: '2026/11/05 09:15:00',
        receiver: '钱国栋',
        auditTime: '2026/11/05 09:15:00',
        auditStatus: '待验证/误码复核',
        comment: '请求进行链路误码率测试验收',
      },
    ],
  },
  {
    id: 'WO-2026-209112390',
    code: '209112390',
    title: 'Kubernetes Ingress 证书自动化续期 Cron 挂载单',
    status: '待分析',
    priority: '低',
    assignee: '马天明',
    applicant: '孙丽丽',
    dept: '云原生架构组',
    createTime: '2026/11/04 16:40:00',
    lastUpdateTime: '2026/11/04 16:40:00',
    finishTime: '2026/11/06 18:00:00',
    description: '针对 Let\'s Encrypt 证书申请自动化脚本进行定时任务接入并排查 RBAC 权限。',
    timelineNodes: [
      { stage: '创建人', person: '孙丽丽', status: 'completed' },
      { stage: '上级审批人', person: '何少华', status: 'completed' },
      { stage: '受理人', person: '马天明', status: 'active' },
      { stage: '受理中', person: '马天明', status: 'pending' },
      { stage: '处理完成', person: '马天明', status: 'pending' },
      { stage: '确认完成', person: '何少华', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '孙丽丽',
        role: 'DevOps 工程师',
        time: '2026/11/04 16:40:00',
        receiver: '马天明',
        auditTime: '2026/11/04 16:40:00',
        auditStatus: '待分析/权限梳理',
        comment: '自动化续期脚本排错申请',
      },
    ],
  },
  {
    id: 'WO-2026-209112391',
    code: '209112391',
    title: '数据中心 B2 区域电量计量表脉冲数据校准单',
    status: '待审批',
    priority: '中',
    assignee: '郭宝成',
    applicant: '周建国',
    dept: '机房基础设施组',
    createTime: '2026/11/04 14:20:00',
    lastUpdateTime: '2026/11/04 14:20:00',
    finishTime: '2026/11/06 18:00:00',
    description: '机柜 PDU 传感器采样偏差 3%，申请在配电柜停用短接重新对标测试。',
    timelineNodes: [
      { stage: '创建人', person: '周建国', status: 'completed' },
      { stage: '上级审批人', person: '郭宝成', status: 'active' },
      { stage: '受理人', person: '郭宝成', status: 'pending' },
      { stage: '受理中', person: '郭宝成', status: 'pending' },
      { stage: '处理完成', person: '郭宝成', status: 'pending' },
      { stage: '确认完成', person: '李明远', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '周建国',
        role: '电气工程师',
        time: '2026/11/04 14:20:00',
        receiver: '郭宝成',
        auditTime: '2026/11/04 14:20:00',
        auditStatus: '待审批/计量评审',
        comment: '申请电量传感器对标校准',
      },
    ],
  },
  {
    id: 'WO-2026-209112392',
    code: '209112392',
    title: 'RabbitMQ 交换机死信队列存量积压热清理单',
    status: '已完成',
    priority: '低',
    assignee: '徐洋',
    applicant: '严亮',
    dept: '中间件运维部',
    createTime: '2026/11/04 11:00:00',
    lastUpdateTime: '2026/11/04 14:45:00',
    finishTime: '2026/11/04 14:45:00',
    description: '死信队列积压超 50 万条，使用 Shovel 插件重定向至冷存储归档成功。',
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
        role: '中间件工程师',
        time: '2026/11/04 11:00:00',
        receiver: '顾亚军',
        auditTime: '2026/11/04 14:45:00',
        auditStatus: '归档完成',
        comment: '队列清理完毕，集群内存使用下降 3.2GB',
      },
    ],
  },
  {
    id: 'WO-2026-209112393',
    code: '209112393',
    title: 'Prometheus 警报规则评估与抑制死锁解除单',
    status: '已完成',
    priority: '中',
    assignee: '彭雷',
    applicant: '李建',
    dept: '监控运维保障组',
    createTime: '2026/11/04 09:00:00',
    lastUpdateTime: '2026/11/04 10:40:00',
    finishTime: '2026/11/04 10:40:00',
    description: '报警风暴触发的抑制规则环形死锁已解除，修改 Alertmanager 链路平滑上线。',
    timelineNodes: [
      { stage: '创建人', person: '李建', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '彭雷', status: 'completed' },
      { stage: '受理中', person: '彭雷', status: 'completed' },
      { stage: '处理完成', person: '彭雷', status: 'completed' },
      { stage: '确认完成', person: '程总工', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '彭雷',
        role: '监控架构师',
        time: '2026/11/04 09:00:00',
        receiver: '程总工',
        auditTime: '2026/11/04 10:40:00',
        auditStatus: '归档闭环',
        comment: '告警收敛逻辑符合预期，予以完结',
      },
    ],
  },
  {
    id: 'WO-2026-209112394',
    code: '209112394',
    title: 'Flink 实时流计算 TaskManager 堆外内存扩容',
    status: '待实施',
    priority: '高',
    assignee: '周建国',
    applicant: '陈晨',
    dept: '实时计算技术部',
    createTime: '2026/11/03 16:10:00',
    lastUpdateTime: '2026/11/03 16:10:00',
    finishTime: '2026/11/06 18:00:00',
    description: 'Off-heap Direct Memory 溢出导致 Checkpoint 失败，批复扩大 4GB 参数。',
    timelineNodes: [
      { stage: '创建人', person: '陈晨', status: 'completed' },
      { stage: '上级审批人', person: '赵振华', status: 'completed' },
      { stage: '受理人', person: '周建国', status: 'completed' },
      { stage: '受理中', person: '周建国', status: 'active' },
      { stage: '处理完成', person: '周建国', status: 'pending' },
      { stage: '确认完成', person: '赵振华', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '周建国',
        role: '大数据工程师',
        time: '2026/11/03 16:10:00',
        receiver: '赵振华',
        auditTime: '2026/11/03 16:10:00',
        auditStatus: '待实施/参数热加载',
        comment: '准备滚屏扩容内存参数',
      },
    ],
  },
  {
    id: 'WO-2026-209112395',
    code: '209112395',
    title: '数据中心冷通道机柜温湿度传感器漂移校准',
    status: '已完成',
    priority: '低',
    assignee: '何少华',
    applicant: '郭宝成',
    dept: '数据中心环境部',
    createTime: '2026/11/03 10:30:00',
    lastUpdateTime: '2026/11/03 12:00:00',
    finishTime: '2026/11/03 12:00:00',
    description: '环境温湿度漂移 1.5 度，对 Modbus 通信地址 0x0A 传感器校准完成。',
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
        role: '动环工程师',
        time: '2026/11/03 10:30:00',
        receiver: '许峰',
        auditTime: '2026/11/03 12:00:00',
        auditStatus: '校准完成',
        comment: '环境温湿度采样恢复精准，已归档',
      },
    ],
  },
];

interface MyWorkOrdersViewProps {
  workOrders?: WorkOrder[];
  onOpenOrderDetail?: (order: WorkOrder) => void;
  onCreateWorkOrder?: () => void;
}

export const MyWorkOrdersView: React.FC<MyWorkOrdersViewProps> = ({
  onCreateWorkOrder: externalCreateOrder,
}) => {
  const [ordersList, setOrdersList] = useState<ExtendedWorkOrderItem[]>(INITIAL_MY_WORK_ORDERS);

  // Search & Filter state variables matching screenshot image_fe108e82.png:
  // 请输入工单名称, 全部优先级, 全部工单状态, 搜索, 新建
  const [titleSearch, setTitleSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states (Per user prompt discipline: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive Modals
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<ExtendedWorkOrderItem | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<ExtendedWorkOrderItem | null>(null);
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

  const confirmDeleteOrder = () => {
    if (deletingOrder) {
      setOrdersList((prev) => prev.filter((o) => o.id !== deletingOrder.id));
      setDeletingOrder(null);
      alert(`已成功撤销删除工单 ${deletingOrder.id}！`);
    }
  };

  const getPriorityBadgeClass = (p: ExtendedWorkOrderItem['priority']) => {
    switch (p) {
      case '高':
        return 'text-rose-400 font-bold';
      case '中':
        return 'text-amber-400 font-bold';
      case '低':
        return 'text-emerald-400 font-bold';
    }
  };

  const getStatusBadgeClass = (st: ExtendedWorkOrderItem['status']) => {
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
      {/* Main Section Card: 我的工单 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Header with "+ 新建" button matching image_fe108e82.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">我的工单列表</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              全息基础设施运维工单 · 每页 10 条数据
            </span>
          </div>

          <button
            onClick={() => {
              if (externalCreateOrder) externalCreateOrder();
              else alert('已唤起新建工单表单！');
            }}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-all shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>新建</span>
          </button>
        </div>

        {/* Filter Toolbar matching screenshot image_fe108e82.png:
            请输入工单名称, 全部优先级, 全部工单状态, 搜索 */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-3 text-xs font-mono">
          {/* Input 1: 请输入工单名称 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入工单名称 / 编号"
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

        {/* Data Table matching exact columns from image_fe108e82.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-3 text-center w-12">编号</th>
                <th className="py-3 px-3">编号</th>
                <th className="py-3 px-3 text-center font-sans">状态</th>
                <th className="py-3 px-3 text-center font-sans">优先级</th>
                <th className="py-3 px-3 font-sans">当前受理人</th>
                <th className="py-3 px-3 font-sans">提单人</th>
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

                      {/* 6. 提单人 (Diverse applicants) */}
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

                      {/* 10. 操作: 查看详情, 删除 (Matching image_fe108e82.png) */}
                      <td className="py-3 px-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderDetail(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                          >
                            查看详情
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeletingOrder(item);
                            }}
                            className="text-cyan-400 hover:text-rose-400 text-[11px] font-medium hover:underline"
                          >
                            删除
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

      {/* Modal 1: Work Order Detail Modal */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
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

      {/* Modal 2: Delete Order Modal */}
      {deletingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  确认删除撤销工单
                </h3>
              </div>
              <button
                onClick={() => setDeletingOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              <p className="text-slate-300">
                确定要彻底删除撤销以下工单吗？该操作不可逆：
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-rose-500/20 font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">工单编号:</span>
                  <span className="text-cyan-400 font-bold">{deletingOrder.id} ({deletingOrder.code})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">工单标题:</span>
                  <span className="text-slate-200 font-bold font-sans truncate max-w-[200px]">{deletingOrder.title}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setDeletingOrder(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteOrder}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors font-sans flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
