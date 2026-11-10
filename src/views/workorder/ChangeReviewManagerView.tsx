import React, { useState, useRef } from 'react';
import { 
  FileText, Search, Calendar, Download, Eye, BookOpen, 
  CheckCircle2, X, AlertCircle, ChevronLeft, ChevronRight, Check,
  Clock, ShieldAlert, Cpu, FileCheck, Layers, Share2, Printer, Sparkles
} from 'lucide-react';
import { WorkOrder } from '../../types';

export interface ChangeReviewItem {
  id: string;              // e.g. CR-2026-001
  code: string;            // 编号 (e.g. 209112382)
  type: '紧急变更' | '重大变更' | '标准变更' | '例行变更'; // 变更单类型
  content: '版本升级' | '更换配件' | '架构扩容' | '软件热加载' | '配置调优'; // 变更单内容
  interruptBusiness: '是' | '否'; // 业务是否中断
  priority: 'P1' | 'P2' | 'P3' | 'P4' | 'P5'; // 优先级
  system: string;          // 业务系统
  team: string;            // 处理团队
  description: string;     // 描述
  planStartTime: string;   // 期望开始时间
  planEndTime: string;     // 期望完成时间
  analyst: string;         // 分析人
  needApproval: '是' | '否'; // 是否需要审批
  hasDoc: boolean;         // 是否有文档
  docName?: string;        // 文档名称
  addedToKb?: boolean;     // 是否已加知识库
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

const INITIAL_CHANGE_REVIEWS: ChangeReviewItem[] = [
  {
    id: 'CR-2026-001',
    code: '209112382',
    type: '紧急变更',
    content: '版本升级',
    interruptBusiness: '是',
    priority: 'P1',
    system: '工业标识解析核心集群',
    team: '全息基础设施运维团队',
    description: '标识解析引擎 v3.2.1 补丁热加载，针对并发吞吐卡顿平滑升级。',
    planStartTime: '2026/11/06 12:23:23',
    planEndTime: '2026/11/06 13:30:00',
    analyst: '张帆',
    needApproval: '是',
    hasDoc: true,
    docName: '标识解析引擎v3.2.1升级复盘与回滚SOP.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '李建', status: 'completed' },
      { stage: '技术分析人', person: '张帆', status: 'completed' },
      { stage: '复核审批', person: '程总工', status: 'completed' },
      { stage: '现场实施', person: '张帆', status: 'completed' },
      { stage: '效果终验', person: '张建国', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '张帆',
        role: '基础设施架构师',
        time: '2026/11/06 12:23:23',
        receiver: '程总工',
        auditTime: '2026/11/06 13:30:00',
        auditStatus: '变更成功归档',
        comment: '核心集群 TPS 升至 125,000，业务完全平滑过度。',
      },
    ],
  },
  {
    id: 'CR-2026-002',
    code: '209112383',
    type: '紧急变更',
    content: '更换配件',
    interruptBusiness: '是',
    priority: 'P3',
    system: '天津西区 04 号天线系统',
    team: '硬件保障专家团队',
    description: '读写天线4号通道驻波比(VSWR)失配，现场热插拔更换同轴避雷缆线接头。',
    planStartTime: '2026/11/06 10:15:00',
    planEndTime: '2026/11/06 11:30:00',
    analyst: '李建',
    needApproval: '是',
    hasDoc: true,
    docName: 'RFID射频天线同轴线接头抢修总结.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '李建', status: 'completed' },
      { stage: '技术分析人', person: '李建', status: 'completed' },
      { stage: '复核审批', person: '李明远', status: 'completed' },
      { stage: '现场实施', person: '李建', status: 'completed' },
      { stage: '效果终验', person: '张建国', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '李建',
        role: '硬件工程师',
        time: '2026/11/06 10:15:00',
        receiver: '张建国',
        auditTime: '2026/11/06 11:30:00',
        auditStatus: '测试达标归档',
        comment: '衰减由 2.15VSWR 回落至 1.08，配件更换符合规范。',
      },
    ],
  },
  {
    id: 'CR-2026-003',
    code: '209112384',
    type: '重大变更',
    content: '更换配件',
    interruptBusiness: '是',
    priority: 'P4',
    system: '卡口边缘控制器',
    team: '智慧交通保障组',
    description: '卡口边缘控制器千兆 PoE 供电模块故障，停机清空并更换模块。',
    planStartTime: '2026/11/06 09:00:00',
    planEndTime: '2026/11/06 10:30:00',
    analyst: '赵勇',
    needApproval: '是',
    hasDoc: true,
    docName: '边缘控制器PoE电源冗余更换方案.pdf',
    addedToKb: true,
    timelineNodes: [
      { stage: '提单人', person: '李明远', status: 'completed' },
      { stage: '技术分析人', person: '赵勇', status: 'completed' },
      { stage: '复核审批', person: '杜小刚', status: 'completed' },
      { stage: '现场实施', person: '赵勇', status: 'completed' },
      { stage: '效果终验', person: '杜小刚', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '赵勇',
        role: '网络工程师',
        time: '2026/11/06 09:00:00',
        receiver: '杜小刚',
        auditTime: '2026/11/06 10:30:00',
        auditStatus: '验收合格',
        comment: '卡口相机捕获率恢复 100%，无丢包记录。',
      },
    ],
  },
  {
    id: 'CR-2026-004',
    code: '209112385',
    type: '重大变更',
    content: '更换配件',
    interruptBusiness: '是',
    priority: 'P5',
    system: '核心数据库集群',
    team: 'DBA 数据库团队',
    description: 'MySQL 高可用集群从库节点 NVMe 缓存盘寿命耗尽热替换。',
    planStartTime: '2026/11/05 18:00:00',
    planEndTime: '2026/11/05 20:00:00',
    analyst: '王强',
    needApproval: '是',
    hasDoc: false,
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '王强', status: 'completed' },
      { stage: '技术分析人', person: '王强', status: 'completed' },
      { stage: '复核审批', person: '赵振华', status: 'completed' },
      { stage: '现场实施', person: '王强', status: 'completed' },
      { stage: '效果终验', person: '赵振华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '王强',
        role: 'DBA 专家',
        time: '2026/11/05 18:00:00',
        receiver: '赵振华',
        auditTime: '2026/11/05 20:00:00',
        auditStatus: '副本重建完成',
        comment: '从库 Binlog 并发复制正常，延迟 0 毫秒。',
      },
    ],
  },
  {
    id: 'CR-2026-005',
    code: '209112386',
    type: '重大变更',
    content: '架构扩容',
    interruptBusiness: '否',
    priority: 'P2',
    system: 'Redis 7.2 缓存集群',
    team: '高速缓存架构团队',
    description: 'Redis 集群 Hash BigKey 渐进分片拆解与 Cluster 节点扩容。',
    planStartTime: '2026/11/05 14:00:00',
    planEndTime: '2026/11/05 16:00:00',
    analyst: '严亮',
    needApproval: '是',
    hasDoc: true,
    docName: 'Redis集群BigKey热拆解与槽位重平衡报告.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '顾亚军', status: 'completed' },
      { stage: '技术分析人', person: '严亮', status: 'completed' },
      { stage: '复核审批', person: '程总工', status: 'completed' },
      { stage: '现场实施', person: '严亮', status: 'completed' },
      { stage: '效果终验', person: '顾亚军', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '严亮',
        role: '缓存专家',
        time: '2026/11/05 14:00:00',
        receiver: '顾亚军',
        auditTime: '2026/11/05 16:00:00',
        auditStatus: '扩容合规',
        comment: '分片集群读写耗时降至 0.8ms，达到目标。',
      },
    ],
  },
  {
    id: 'CR-2026-006',
    code: '209112387',
    type: '紧急变更',
    content: '软件热加载',
    interruptBusiness: '否',
    priority: 'P1',
    system: 'Core-R01 骨干路由器',
    team: '网络安全团队',
    description: '核心路由器安全内核漏洞 CVE-2026-9812 紧急补丁缝补。',
    planStartTime: '2026/11/05 11:00:00',
    planEndTime: '2026/11/05 13:00:00',
    analyst: '刘芳',
    needApproval: '是',
    hasDoc: true,
    docName: 'Core-R01高危内核补丁热缝补记录.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '孙伟', status: 'completed' },
      { stage: '技术分析人', person: '刘芳', status: 'completed' },
      { stage: '复核审批', person: '程总工', status: 'completed' },
      { stage: '现场实施', person: '刘芳', status: 'completed' },
      { stage: '效果终验', person: '孙伟', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '刘芳',
        role: '网络安全专员',
        time: '2026/11/05 11:00:00',
        receiver: '孙伟',
        auditTime: '2026/11/05 13:00:00',
        auditStatus: '缝补成功',
        comment: '网络 BGP 协议无震荡，安全合规审查通过。',
      },
    ],
  },
  {
    id: 'CR-2026-007',
    code: '209112388',
    type: '标准变更',
    content: '配置调优',
    interruptBusiness: '否',
    priority: 'P4',
    system: 'Kubernetes 容器云平台',
    team: '云原生架构团队',
    description: '容器集群 Kubelet API 审计日志动态过滤配置上线。',
    planStartTime: '2026/11/04 15:00:00',
    planEndTime: '2026/11/04 16:30:00',
    analyst: '马天明',
    needApproval: '否',
    hasDoc: true,
    docName: 'K8s审计日志动态过滤策略白皮书.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '孙丽丽', status: 'completed' },
      { stage: '技术分析人', person: '马天明', status: 'completed' },
      { stage: '复核审批', person: '何少华', status: 'completed' },
      { stage: '现场实施', person: '马天明', status: 'completed' },
      { stage: '效果终验', person: '何少华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '马天明',
        role: '云原生工程师',
        time: '2026/11/04 15:00:00',
        receiver: '何少华',
        auditTime: '2026/11/04 16:30:00',
        auditStatus: '标准变更归档',
        comment: '磁盘日志 IOPS 降低 40%，生效正常。',
      },
    ],
  },
  {
    id: 'CR-2026-008',
    code: '209112389',
    type: '重大变更',
    content: '架构扩容',
    interruptBusiness: '是',
    priority: 'P2',
    system: 'HDFS 大数据存储',
    team: '大数据运维团队',
    description: '数据节点 DN-102 损坏 NVMe 企业级盘替换与副本自动修复。',
    planStartTime: '2026/11/04 10:00:00',
    planEndTime: '2026/11/04 12:30:00',
    analyst: '许峰',
    needApproval: '是',
    hasDoc: true,
    docName: 'HDFS坏盘热拔插与集群副本自我修复记录.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '宋佳欣', status: 'completed' },
      { stage: '技术分析人', person: '许峰', status: 'completed' },
      { stage: '复核审批', person: '彭雷', status: 'completed' },
      { stage: '现场实施', person: '许峰', status: 'completed' },
      { stage: '效果终验', person: '彭雷', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '许峰',
        role: '存储专家',
        time: '2026/11/04 10:00:00',
        receiver: '彭雷',
        auditTime: '2026/11/04 12:30:00',
        auditStatus: '块校验合格',
        comment: '数据副本百份百对齐，更换成功。',
      },
    ],
  },
  {
    id: 'CR-2026-009',
    code: '209112390',
    type: '例行变更',
    content: '版本升级',
    interruptBusiness: '否',
    priority: 'P5',
    system: 'Nginx 边缘网关',
    team: '网络安全团队',
    description: '边缘网关 ECC 4096 位国密 SSL/TLS 证书升级。',
    planStartTime: '2026/11/03 14:00:00',
    planEndTime: '2026/11/03 15:00:00',
    analyst: '钱国栋',
    needApproval: '否',
    hasDoc: true,
    docName: '网关国密SSL证书热替换手册.pdf',
    addedToKb: true,
    timelineNodes: [
      { stage: '提单人', person: '潘智勇', status: 'completed' },
      { stage: '技术分析人', person: '钱国栋', status: 'completed' },
      { stage: '复核审批', person: '潘智勇', status: 'completed' },
      { stage: '现场实施', person: '钱国栋', status: 'completed' },
      { stage: '效果终验', person: '潘智勇', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '钱国栋',
        role: '安全工程师',
        time: '2026/11/03 14:00:00',
        receiver: '潘智勇',
        auditTime: '2026/11/03 15:00:00',
        auditStatus: '证书换发闭环',
        comment: '新证书校验通过，有效期延长至 2028 年。',
      },
    ],
  },
  {
    id: 'CR-2026-010',
    code: '209112391',
    type: '紧急变更',
    content: '配置调优',
    interruptBusiness: '否',
    priority: 'P3',
    system: 'Kafka 消息中间件',
    team: '中间件运维团队',
    description: '车联网 Topic 倾斜 Partition 数据快速重平衡。',
    planStartTime: '2026/11/03 09:30:00',
    planEndTime: '2026/11/03 11:00:00',
    analyst: '徐洋',
    needApproval: '是',
    hasDoc: true,
    docName: 'Kafka倾斜分区重分配实践总结.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '严亮', status: 'completed' },
      { stage: '技术分析人', person: '徐洋', status: 'completed' },
      { stage: '复核审批', person: '顾亚军', status: 'completed' },
      { stage: '现场实施', person: '徐洋', status: 'completed' },
      { stage: '效果终验', person: '顾亚军', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '徐洋',
        role: '中间件架构师',
        time: '2026/11/03 09:30:00',
        receiver: '顾亚军',
        auditTime: '2026/11/03 11:00:00',
        auditStatus: '重平衡完成',
        comment: 'Broker 流量分布方差缩小 80%。',
      },
    ],
  },
  {
    id: 'CR-2026-011',
    code: '209112392',
    type: '例行变更',
    content: '更换配件',
    interruptBusiness: '否',
    priority: 'P5',
    system: '机房动力环境系统',
    team: '机房保障团队',
    description: 'UPS B2 机房蓄电池组 30 分钟例行放电与电池内阻测试。',
    planStartTime: '2026/11/02 15:00:00',
    planEndTime: '2026/11/02 17:00:00',
    analyst: '郭宝成',
    needApproval: '否',
    hasDoc: true,
    docName: 'UPS电池放电容量对标测试报告.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '周建国', status: 'completed' },
      { stage: '技术分析人', person: '郭宝成', status: 'completed' },
      { stage: '复核审批', person: '李明远', status: 'completed' },
      { stage: '现场实施', person: '郭宝成', status: 'completed' },
      { stage: '效果终验', person: '李明远', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '郭宝成',
        role: '动环工程师',
        time: '2026/11/02 15:00:00',
        receiver: '李明远',
        auditTime: '2026/11/02 17:00:00',
        auditStatus: '例行放电合格',
        comment: '电池健康度 98.5%，性能完好。',
      },
    ],
  },
  {
    id: 'CR-2026-012',
    code: '209112393',
    type: '紧急变更',
    content: '配置调优',
    interruptBusiness: '否',
    priority: 'P2',
    system: 'Prometheus 告警平台',
    team: '监控保障团队',
    description: 'Alertmanager 抑制规则死锁解除与报警环路优化。',
    planStartTime: '2026/11/02 09:00:00',
    planEndTime: '2026/11/02 10:30:00',
    analyst: '何少华',
    needApproval: '是',
    hasDoc: false,
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '郭宝成', status: 'completed' },
      { stage: '技术分析人', person: '何少华', status: 'completed' },
      { stage: '复核审批', person: '许峰', status: 'completed' },
      { stage: '现场实施', person: '何少华', status: 'completed' },
      { stage: '效果终验', person: '许峰', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '何少华',
        role: '监控专员',
        time: '2026/11/02 09:00:00',
        receiver: '许峰',
        auditTime: '2026/11/02 10:30:00',
        auditStatus: '解死锁归档',
        comment: '通知链路畅通，告警降噪效果显著。',
      },
    ],
  },
  {
    id: 'CR-2026-013',
    code: '209112394',
    type: '重大变更',
    content: '架构扩容',
    interruptBusiness: '否',
    priority: 'P2',
    system: 'Flink 实时计算平台',
    team: '实时计算团队',
    description: 'TaskManager 堆外内存扩容与 Netty 堆外内存泄漏修复。',
    planStartTime: '2026/11/01 16:00:00',
    planEndTime: '2026/11/01 18:00:00',
    analyst: '周建国',
    needApproval: '是',
    hasDoc: true,
    docName: 'Flink堆外内存溢出根因排查与参数调整SOP.pdf',
    addedToKb: true,
    timelineNodes: [
      { stage: '提单人', person: '陈晨', status: 'completed' },
      { stage: '技术分析人', person: '周建国', status: 'completed' },
      { stage: '复核审批', person: '赵振华', status: 'completed' },
      { stage: '现场实施', person: '周建国', status: 'completed' },
      { stage: '效果终验', person: '赵振华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '周建国',
        role: '大数据工程师',
        time: '2026/11/01 16:00:00',
        receiver: '赵振华',
        auditTime: '2026/11/01 18:00:00',
        auditStatus: '扩容闭环',
        comment: 'Checkpoint 成功率恢复至 100%。',
      },
    ],
  },
  {
    id: 'CR-2026-014',
    code: '209112395',
    type: '例行变更',
    content: '配置调优',
    interruptBusiness: '否',
    priority: 'P5',
    system: '温湿度传感器网络',
    team: '动环工程师团队',
    description: '温湿度传感器通信地址 0x0A 采样数据校准。',
    planStartTime: '2026/11/01 10:00:00',
    planEndTime: '2026/11/01 11:30:00',
    analyst: '彭雷',
    needApproval: '否',
    hasDoc: true,
    docName: ' Modbus温湿度传感器微标定记录.pdf',
    addedToKb: false,
    timelineNodes: [
      { stage: '提单人', person: '陈晨', status: 'completed' },
      { stage: '技术分析人', person: '彭雷', status: 'completed' },
      { stage: '复核审批', person: '赵振华', status: 'completed' },
      { stage: '现场实施', person: '彭雷', status: 'completed' },
      { stage: '效果终验', person: '赵振华', status: 'completed' },
    ],
    formAudits: [
      {
        operator: '彭雷',
        role: '环境工程师',
        time: '2026/11/01 10:00:00',
        receiver: '赵振华',
        auditTime: '2026/11/01 11:30:00',
        auditStatus: '标定合格',
        comment: '精度满足数据中心 A 级机房要求。',
      },
    ],
  },
];

export const ChangeReviewManagerView: React.FC = () => {
  const [changeList, setChangeList] = useState<ChangeReviewItem[]>(INITIAL_CHANGE_REVIEWS);

  // Filter toolbar states matching image_65154712.png
  const [startDate, setStartDate] = useState('2026-11-01');
  const [endDate, setEndDate] = useState('2026-11-09');
  const [searchKeyword, setSearchKeyword] = useState('');

  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);

  const triggerDatePicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (!ref.current) return;
    try {
      if (typeof ref.current.showPicker === 'function') {
        ref.current.showPicker();
      } else {
        ref.current.focus();
      }
    } catch {
      // Cross-origin iframe fallback
      ref.current.focus();
      ref.current.click();
    }
  };

  // Pagination states (Per user prompt discipline: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Modal States
  // 1. 查看详情 Modal
  const [selectedDetail, setSelectedDetail] = useState<ChangeReviewItem | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<'process' | 'form'>('process');

  // 2. 专属「文档预览与下载」Modal Page
  const [previewingDocItem, setPreviewingDocItem] = useState<ChangeReviewItem | null>(null);

  // 3. 专属「加入知识库编辑」Modal Page
  const [kbAddingItem, setKbAddingItem] = useState<ChangeReviewItem | null>(null);
  const [kbTitle, setKbTitle] = useState('');
  const [kbCategory, setKbCategory] = useState('故障排障手册');
  const [kbTags, setKbTags] = useState('');
  const [kbSummary, setKbSummary] = useState('');
  const [kbAccessLevel, setKbAccessLevel] = useState('全员公开');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open Handlers
  const handleOpenDocPreview = (item: ChangeReviewItem) => {
    setPreviewingDocItem(item);
  };

  const handleOpenAddToKb = (item: ChangeReviewItem) => {
    setKbAddingItem(item);
    setKbTitle(`[变更复盘] ${item.system} ${item.content}变更经验总结与防范指南`);
    setKbCategory('标准作业程序 (SOP)');
    setKbTags(`变更复盘, ${item.type}, ${item.system}`);
    setKbSummary(`针对变更单编号 ${item.code}（${item.description}）的复盘踩坑防范总结：涉及业务中断评估为【${item.interruptBusiness}】，由${item.team}在低峰期实施。`);
    setKbAccessLevel('全员公开');
  };

  // Confirm Actions
  const confirmAddToKb = () => {
    if (kbAddingItem) {
      setChangeList((prev) =>
        prev.map((c) => (c.id === kbAddingItem.id ? { ...c, addedToKb: true } : c))
      );
      showToast(`已成功将《${kbTitle}》导入沉淀至知识库 [${kbCategory}]！`);
      setKbAddingItem(null);
    }
  };

  // Filter Logic
  const filteredItems = changeList.filter((item) => {
    const matchesKeyword = searchKeyword === '' || 
      item.system.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      item.analyst.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesKeyword;
  });

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const currentPageItems = filteredItems.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setCurrentPage(validPage);
    setJumpPageInput(String(validPage));
  };

  const getPriorityBadge = (p: ChangeReviewItem['priority']) => {
    switch (p) {
      case 'P1':
        return <span className="text-rose-400 font-bold font-mono">1 (紧急)</span>;
      case 'P2':
        return <span className="text-amber-400 font-bold font-mono">2 (高)</span>;
      case 'P3':
        return <span className="text-amber-300 font-bold font-mono">3 (中)</span>;
      case 'P4':
        return <span className="text-emerald-400 font-bold font-mono">4 (低)</span>;
      case 'P5':
        return <span className="text-emerald-500 font-bold font-mono">5 (低)</span>;
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification Notification Box */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-950 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-sans font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Section Card: 变更单回顾管理 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">变更单回顾管理</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              重大系统割接复盘 · 支持专属文档下载与知识库沉淀 · 每页 10 条数据
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            重大变更与风险事件回顾履约合规审查
          </span>
        </div>

        {/* Filter Toolbar matching screenshot image_65154712.png */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-sans">期望时间范围:</span>
            <div className="relative flex items-center">
              <input
                ref={startInputRef}
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono [color-scheme:dark] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => triggerDatePicker(startInputRef)}
                className="absolute right-2.5 text-slate-400 hover:text-cyan-400 p-0.5 rounded transition-colors"
                title="点击选择日期"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-slate-500 font-mono">至</span>
            <div className="relative flex items-center">
              <input
                ref={endInputRef}
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono [color-scheme:dark] cursor-pointer"
              />
              <button
                type="button"
                onClick={() => triggerDatePicker(endInputRef)}
                className="absolute right-2.5 text-slate-400 hover:text-cyan-400 p-0.5 rounded transition-colors"
                title="点击选择日期"
              >
                <Calendar className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => {
                  setStartDate('2026-11-03');
                  setEndDate('2026-11-09');
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-400 font-sans transition-colors"
              >
                近7天
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate('2026-10-10');
                  setEndDate('2026-11-09');
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-400 font-sans transition-colors"
              >
                近30天
              </button>
              <button
                type="button"
                onClick={() => {
                  setStartDate('2026-11-01');
                  setEndDate('2026-11-30');
                }}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 hover:text-cyan-400 font-sans transition-colors"
              >
                本月
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="请输入系统/描述/分析人/编号"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-56 font-sans"
            />
          </div>

          <button
            onClick={() => setCurrentPage(1)}
            className="px-5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
          >
            搜索
          </button>
        </div>

        {/* Data Table matching exact columns from screenshot image_65154712.png */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="py-3 px-2 text-center w-10">编号</th>
                <th className="py-3 px-2 font-sans">变更单类型</th>
                <th className="py-3 px-2 font-sans">变更单内容</th>
                <th className="py-3 px-2 text-center font-sans">业务是否中断</th>
                <th className="py-3 px-2 text-center font-sans">优先级</th>
                <th className="py-3 px-2 font-sans">业务系统</th>
                <th className="py-3 px-2 font-sans">处理团队</th>
                <th className="py-3 px-2 font-sans">描述</th>
                <th className="py-3 px-2">期望开始时间</th>
                <th className="py-3 px-2">期望完成时间</th>
                <th className="py-3 px-2 font-sans">分析人</th>
                <th className="py-3 px-2 text-center font-sans">是否需要审批</th>
                <th className="py-3 px-2 text-right font-sans min-w-[210px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentPageItems.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-8 text-center text-slate-500 font-sans">
                    暂无符合条件的变更单回顾记录
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                      onClick={() => setSelectedDetail(item)}
                    >
                      {/* 1. 序号 */}
                      <td className="py-3 px-2 text-center text-slate-500 font-mono">
                        {globalIdx}
                      </td>

                      {/* 2. 变更单类型 */}
                      <td className="py-3 px-2 font-sans">
                        <span className={`text-[11px] px-2 py-0.5 rounded ${
                          item.type === '紧急变更' 
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold'
                            : item.type === '重大变更'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}>
                          {item.type}
                        </span>
                      </td>

                      {/* 3. 变更单内容 */}
                      <td className="py-3 px-2 text-slate-200 font-sans font-medium">
                        {item.content}
                      </td>

                      {/* 4. 业务是否中断 */}
                      <td className="py-3 px-2 text-center font-sans">
                        <span className={`text-[11px] font-bold ${
                          item.interruptBusiness === '是' ? 'text-rose-400' : 'text-slate-400'
                        }`}>
                          {item.interruptBusiness}
                        </span>
                      </td>

                      {/* 5. 优先级 */}
                      <td className="py-3 px-2 text-center font-sans">
                        {getPriorityBadge(item.priority)}
                      </td>

                      {/* 6. 业务系统 */}
                      <td className="py-3 px-2 text-slate-200 font-sans font-medium">
                        {item.system}
                      </td>

                      {/* 7. 处理团队 */}
                      <td className="py-3 px-2 text-slate-300 font-sans text-[11px]">
                        {item.team}
                      </td>

                      {/* 8. 描述 */}
                      <td className="py-3 px-2 text-slate-300 font-sans max-w-xs">
                        <div className="truncate" title={item.description}>
                          {item.description}
                        </div>
                      </td>

                      {/* 9. 期望开始时间 */}
                      <td className="py-3 px-2 text-slate-400 font-mono text-[11px]">
                        {item.planStartTime}
                      </td>

                      {/* 10. 期望完成时间 */}
                      <td className="py-3 px-2 text-slate-400 font-mono text-[11px]">
                        {item.planEndTime}
                      </td>

                      {/* 11. 分析人 */}
                      <td className="py-3 px-2 text-slate-100 font-sans font-medium">
                        {item.analyst}
                      </td>

                      {/* 12. 是否需要审批 */}
                      <td className="py-3 px-2 text-center font-sans">
                        <span className={`text-[11px] font-bold ${
                          item.needApproval === '是' ? 'text-cyan-400' : 'text-slate-400'
                        }`}>
                          {item.needApproval}
                        </span>
                      </td>

                      {/* 13. 操作: 文档下载, 查看详情, 加入知识库 */}
                      <td className="py-3 px-2 text-right font-sans">
                        <div className="flex items-center justify-end gap-2.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDocPreview(item);
                            }}
                            className={`text-[11px] font-medium hover:underline flex items-center gap-0.5 ${
                              item.hasDoc 
                                ? 'text-cyan-400 hover:text-cyan-300' 
                                : 'text-slate-500 hover:text-slate-400'
                            }`}
                            title={item.hasDoc ? item.docName : '无挂载文档，点击可预览补全'}
                          >
                            <Download className="w-3 h-3" />
                            <span>{item.hasDoc ? '文档下载' : '文档下载(无文档)'}</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDetail(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                          >
                            查看详情
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddToKb(item);
                            }}
                            className={`text-[11px] font-medium hover:underline flex items-center gap-0.5 ${
                              item.addedToKb ? 'text-emerald-400 font-bold' : 'text-cyan-400 hover:text-emerald-300'
                            }`}
                          >
                            <BookOpen className="w-3 h-3" />
                            <span>{item.addedToKb ? '已入知识库' : '加入知识库'}</span>
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

        {/* Pagination Bar (Matching prompt discipline: 每页显示10条数据) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredItems.length)} 条，共 {filteredItems.length} 条变更回顾单
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

      {/* ------------------------------------------------------------------- */}
      {/* 专属 Page 1 Modal: 「文档预览与下载」 (Document Preview & Download Modal) */}
      {/* ------------------------------------------------------------------- */}
      {previewingDocItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100 font-sans">
                    变更单复盘归档文档预览下载 ({previewingDocItem.code})
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {previewingDocItem.docName || `《${previewingDocItem.system}变更总结白皮书.pdf》`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewingDocItem(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Badging & Metadata Bar */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                  绝密文件 (L3密级)
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  PDF (2.4 MB)
                </span>
              </div>

              <div className="flex items-center gap-4 text-slate-400 text-[11px] font-sans">
                <span>分析人: <strong className="text-slate-200">{previewingDocItem.analyst}</strong></span>
                <span>团队: <strong className="text-slate-200">{previewingDocItem.team}</strong></span>
                <span>归档时间: <strong className="text-slate-200 font-mono">{previewingDocItem.planEndTime}</strong></span>
              </div>
            </div>

            {/* Simulated High-Fidelity PDF Preview Container */}
            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-4 font-sans text-xs leading-relaxed text-slate-300">
              <div className="text-center border-b border-slate-800/80 pb-4 space-y-1">
                <div className="text-cyan-400 font-mono text-[11px] uppercase tracking-wider font-bold">
                  DataOps 基础设施变更复盘全息归档报告
                </div>
                <h4 className="text-base font-bold text-slate-100">
                  {previewingDocItem.system} - {previewingDocItem.content}技术复盘与 SLA 指标测算报告
                </h4>
                <div className="text-slate-500 text-[11px] font-mono">
                  变更类型: {previewingDocItem.type} · 优先级: {previewingDocItem.priority} · 业务中断: {previewingDocItem.interruptBusiness}
                </div>
              </div>

              {/* Section 1: 变更背景 */}
              <div className="space-y-1">
                <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  1. 变更背景与风险评估
                </div>
                <p className="text-slate-300 text-[11px] pl-3 border-l border-slate-800">
                  本次变更主要解决【{previewingDocItem.system}】在生产高并发运行期间发生的【{previewingDocItem.description}】隐患。
                  在变更前，技术团队对中断风险进行了评估（评估为：{previewingDocItem.interruptBusiness}），并在低峰期下发执行。
                </p>
              </div>

              {/* Section 2: 实施步骤与关键 SLA 数据 */}
              <div className="space-y-1">
                <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  2. 实施步骤与关键 SLA 数据比对
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div className="grid grid-cols-3 text-slate-400 border-b border-slate-800 pb-1 font-sans">
                    <span>评估指标项</span>
                    <span>变更实施前</span>
                    <span className="text-emerald-400">变更割接后</span>
                  </div>
                  <div className="grid grid-cols-3 text-slate-200 pt-1">
                    <span>系统 CPU 负荷</span>
                    <span>78.4%</span>
                    <span className="text-emerald-400 font-bold">24.1%</span>
                  </div>
                  <div className="grid grid-cols-3 text-slate-200">
                    <span>QPS/TPS 处理吞吐</span>
                    <span>42,000 /s</span>
                    <span className="text-emerald-400 font-bold">125,000 /s</span>
                  </div>
                  <div className="grid grid-cols-3 text-slate-200">
                    <span>平均响应时延</span>
                    <span>18.4 ms</span>
                    <span className="text-emerald-400 font-bold">0.8 ms</span>
                  </div>
                </div>
              </div>

              {/* Section 3: 回滚预案与最终结论 */}
              <div className="space-y-1">
                <div className="font-bold text-slate-100 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  3. 专家复核结论
                </div>
                <p className="text-slate-300 text-[11px] pl-3 border-l border-slate-800">
                  经由分析人【{previewingDocItem.analyst}】及复核专家二次抽检，所有监控指标均与白皮书期望预想一致，未产生非预期级联告警，予以准予归档结案。
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>电子签署水印编号: SIG-20261106-712</span>
              </div>

              <div className="flex items-center gap-3 font-sans">
                <button
                  onClick={() => setPreviewingDocItem(null)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  关闭预览
                </button>
                <button
                  onClick={() => {
                    showToast(`《${previewingDocItem.docName || '变更复盘总结白皮书.pdf'}》开始后台打包下载！`);
                    setPreviewingDocItem(null);
                  }}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-950/40"
                >
                  <Download className="w-4 h-4" />
                  <span>下载 PDF 格式原文</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* 专属 Page 2 Modal: 「加入知识库」编辑提交弹窗 (Add to KB Modal) */}
      {/* ------------------------------------------------------------------- */}
      {kbAddingItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-base font-bold text-slate-100">
                    将变更复盘转存沉淀至企业知识库 ({kbAddingItem.code})
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    关联业务系统: {kbAddingItem.system} · 技术分析人: {kbAddingItem.analyst}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setKbAddingItem(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Inputs Area */}
            <div className="space-y-4 text-xs">
              {/* Row 1: 文章标题 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>知识库文章标题:
                </label>
                <input
                  type="text"
                  value={kbTitle}
                  onChange={(e) => setKbTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans font-medium"
                />
              </div>

              {/* Row 2: 知识库分类 & 公开密级 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>目标知识库分类:
                  </label>
                  <select
                    value={kbCategory}
                    onChange={(e) => setKbCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="故障排障手册">故障排障手册 (Troubleshooting)</option>
                    <option value="标准作业程序 (SOP)">标准作业程序 (SOP)</option>
                    <option value="应急预案与演练">应急预案与演练 (Emergency Drill)</option>
                    <option value="技术架构白皮书">技术架构白皮书 (Whitepaper)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    公开访问密级:
                  </label>
                  <select
                    value={kbAccessLevel}
                    onChange={(e) => setKbAccessLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="全员公开">全员公开 (团队可无缝研读)</option>
                    <option value="仅运维专家团队可见">仅运维专家团队可见</option>
                    <option value="高管与架构师专享">高管与架构师专享</option>
                  </select>
                </div>
              </div>

              {/* Row 3: 归档技术标签 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  归档标签 (逗号分隔):
                </label>
                <input
                  type="text"
                  value={kbTags}
                  onChange={(e) => setKbTags(e.target.value)}
                  placeholder="例如: 变更复盘, 核心运维, 踩坑指南"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              {/* Row 4: 知识提炼与避坑指南 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>复盘经验提炼与避坑指南 (Markdown 格式):
                </label>
                <textarea
                  rows={5}
                  value={kbSummary}
                  onChange={(e) => setKbSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setKbAddingItem(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                取消
              </button>
              <button
                onClick={confirmAddToKb}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
              >
                <BookOpen className="w-4 h-4" />
                <span>确认沉淀至知识库</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Modal 3: 「查看详情」全息卡片 Modal */}
      {/* ------------------------------------------------------------------- */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  变更单全息明细与复盘卡片 ({selectedDetail.code})
                </h3>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 变更基础信息 */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
              <div className="text-xs font-bold text-cyan-400 tracking-wide uppercase font-mono flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                变更单基础档案
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">变更类型:</span>
                  <span className="font-bold text-cyan-400 font-sans">{selectedDetail.type}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">变更内容:</span>
                  <span className="text-slate-200 font-sans">{selectedDetail.content}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">业务系统:</span>
                  <span className="text-slate-200 font-sans">{selectedDetail.system}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">处理团队:</span>
                  <span className="text-slate-200 font-sans">{selectedDetail.team}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">技术分析人:</span>
                  <span className="font-bold text-emerald-400 font-sans">{selectedDetail.analyst}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">业务中断:</span>
                  <span className={`font-bold font-sans ${selectedDetail.interruptBusiness === '是' ? 'text-rose-400' : 'text-slate-300'}`}>
                    {selectedDetail.interruptBusiness}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block font-sans text-[11px]">变更描述:</span>
                <p className="text-slate-200 font-sans text-xs mt-0.5 leading-relaxed font-medium">
                  {selectedDetail.description}
                </p>
              </div>
            </div>

            {/* Detail Tabs: 变更流程信息 (Tab 1) | 流程表单 (Tab 2) */}
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
                  变更流程履约图
                </button>
                <button
                  onClick={() => setDetailActiveTab('form')}
                  className={`pb-2.5 text-xs font-bold font-sans transition-all relative ${
                    detailActiveTab === 'form'
                      ? 'text-cyan-400 border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  复盘审计日志
                </button>
              </div>

              {/* Tab 1 Content: Flowchart */}
              {detailActiveTab === 'process' && (
                <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
                  <div className="text-xs text-slate-400 font-sans">
                    变更单全周期履约轨迹
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6 py-6 font-sans">
                    {selectedDetail.timelineNodes.map((node, nIdx) => (
                      <div key={nIdx} className="flex items-center gap-4">
                        <div className="w-24 h-24 rotate-45 flex flex-col items-center justify-center transition-all shadow-lg border-2 bg-gradient-to-br from-cyan-600 to-cyan-800 border-cyan-400 text-white shadow-cyan-500/20">
                          <div className="-rotate-45 text-center space-y-0.5 font-bold text-xs">
                            <div className="text-slate-100 text-[11px]">{node.stage}</div>
                            <div className="text-cyan-200 text-[10px] font-mono border-t border-cyan-400/40 pt-0.5">
                              {node.person}
                            </div>
                          </div>
                        </div>

                        {nIdx < selectedDetail.timelineNodes.length - 1 && (
                          <div className="text-cyan-500/60 text-lg font-mono font-bold px-1">
                            ➔
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2 Content: Audit Log */}
              {detailActiveTab === 'form' && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-sans text-xs">
                  <div className="divide-y divide-slate-800">
                    {selectedDetail.formAudits.map((audit, aIdx) => (
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
                onClick={() => {
                  const curr = selectedDetail;
                  setSelectedDetail(null);
                  handleOpenDocPreview(curr);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold font-sans transition-colors flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>预览与下载变更文档</span>
              </button>

              <button
                onClick={() => {
                  const curr = selectedDetail;
                  setSelectedDetail(null);
                  handleOpenAddToKb(curr);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold font-sans transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-4 h-4" />
                <span>加入知识库</span>
              </button>

              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors"
              >
                关闭卡片
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
