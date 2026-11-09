import React, { useState } from 'react';
import { 
  ClipboardList, Search, Filter, Clock, CheckCircle2, 
  XCircle, AlertTriangle, Eye, Check, X, ChevronLeft, ChevronRight,
  FileSearch, UserCheck, Wrench, ShieldCheck, Play, Calendar
} from 'lucide-react';
import { WorkOrder } from '../../types';

export interface PendingWorkOrderItem {
  id: string;              // e.g. WO-2026-209112382
  code: string;            // 编号 (e.g. 209112382)
  title: string;           // 工单名称 / 标题
  status: '待分析' | '待审批' | '待实施' | '待验证' | '已完成'; // 状态
  priority: '高' | '中' | '低';                       // 优先级
  assignee: string;        // 当前受理人
  applicant: string;       // 提单人
  dept: string;            // 提单部门
  createTime: string;      // 提单时间 (2026)
  lastUpdateTime: string;  // 最后修改时间 (2026)
  finishTime?: string;     // 完成时间
  description: string;     // 描述 (真实无xxx)
  // Fields for flow modals matching screenshots
  implementer?: string;    // 实施人
  verifier?: string;       // 验证人
  planStartTime?: string;  // 计划开始时间
  planEndTime?: string;    // 计划结束时间
  analysisText?: string;   // 分析描述
  approvalText?: string;   // 审批原因 / 变更影响描述
  actualStartTime?: string;// 实际开始时间
  actualEndTime?: string;  // 实际完成时间
  implResult?: string;     // 实施结果
  implText?: string;       // 实施说明
  verifyResult?: string;   // 验证结果
  verifyText?: string;     // 验证建议
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

const INITIAL_PENDING_WORK_ORDERS: PendingWorkOrderItem[] = [
  {
    id: 'WO-2026-209112382',
    code: '209112382',
    title: '天津西区 04 号读写天线阻抗衰减现场分析单',
    status: '待分析',
    priority: '高',
    assignee: '张帆',
    applicant: '李建',
    dept: '全息基础设施运维部',
    createTime: '2026/11/06 09:12:34',
    lastUpdateTime: '2026/11/06 09:12:34',
    finishTime: '2026/11/06 18:00:00',
    description: '读写天线4号通道驻波比(VSWR)升至 2.15，请射频专家张帆深入分析阻抗失配根本原因。',
    implementer: '李建',
    verifier: '赵振华',
    planStartTime: '2026/11/06 10:00',
    planEndTime: '2026/11/06 12:00',
    analysisText: '初步测试示波器回波损耗达 -10dB，需对同轴馈线防潮插头进行接头解体检测。',
    timelineNodes: [
      { stage: '创建人', person: '李建', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '张帆', status: 'active' },
      { stage: '受理中', person: '李建', status: 'pending' },
      { stage: '处理完成', person: '李建', status: 'pending' },
      { stage: '确认完成', person: '赵振华', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '李建',
        role: '运维平台专员',
        time: '2026/11/06 09:12:34',
        receiver: '张帆',
        auditTime: '2026/11/06 09:12:34',
        auditStatus: '待分析/进入技术诊断',
        comment: '提交天线射频衰减排查请求',
      },
    ],
  },
  {
    id: 'WO-2026-209112383',
    code: '209112383',
    title: 'MySQL 高可用数据库主从复制延迟紧急调优单',
    status: '待审批',
    priority: '低',
    assignee: '赵振华',
    applicant: '王强',
    dept: '数据库管理专家组',
    createTime: '2026/11/06 08:50:12',
    lastUpdateTime: '2026/11/06 08:50:12',
    finishTime: '2026/11/06 17:30:00',
    description: '申请临时提升 Binlog I/O 并发复制线程数，需 DB 主管赵振华审查合规性。',
    implementer: '王强',
    verifier: '顾亚军',
    planStartTime: '2026/11/06 13:00',
    planEndTime: '2026/11/06 15:00',
    analysisText: 'Binlog 延迟主因系单线程 Apply 瓶颈，提高 slave_parallel_workers 至 8 线程可解决。',
    approvalText: '拟评估高峰期数据一致性风险，同意在业务低峰期执行变更。',
    timelineNodes: [
      { stage: '创建人', person: '王强', status: 'completed' },
      { stage: '上级审批人', person: '赵振华', status: 'active' },
      { stage: '受理人', person: '王强', status: 'pending' },
      { stage: '受理中', person: '王强', status: 'pending' },
      { stage: '处理完成', person: '王强', status: 'pending' },
      { stage: '确认完成', person: '顾亚军', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '王强',
        role: 'DBA 运维工程师',
        time: '2026/11/06 08:50:12',
        receiver: '赵振华',
        auditTime: '2026/11/06 08:50:12',
        auditStatus: '待审批/等待复核',
        comment: '提交主从同步并发线程调整方案',
      },
    ],
  },
  {
    id: 'WO-2026-209112384',
    code: '209112384',
    title: '海河卡口边缘控制器千兆 PoE 模块现场替换单',
    status: '待实施',
    priority: '低',
    assignee: '赵勇',
    applicant: '李明远',
    dept: '智慧交通网络保障组',
    createTime: '2026/11/06 08:15:00',
    lastUpdateTime: '2026/11/06 08:15:00',
    finishTime: '2026/11/06 16:00:00',
    description: '审批已通过，备件千兆 PoE 模块已出库，安排网络工程师赵勇登高热插拔施工。',
    implementer: '赵勇',
    verifier: '杜小刚',
    planStartTime: '2026/11/06 09:30',
    planEndTime: '2026/11/06 11:30',
    analysisText: '卡口抓拍相机丢包率 0.8%，测得端口供电电压掉至 42V，符合硬件模组热备替换条件。',
    approvalText: '备件型号与原厂兼容，批准进行登高替换作业。',
    actualStartTime: '2026/11/06 09:30',
    actualEndTime: '2026/11/06 10:45',
    implResult: '实施成功',
    implText: '完成 PoE 供电模块全双工模块替换，网口指示灯持续常绿。',
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
        role: '网络硬件主管',
        time: '2026/11/06 08:15:00',
        receiver: '赵勇',
        auditTime: '2026/11/06 08:15:00',
        auditStatus: '待实施/现场施工准备',
        comment: '领取 PoE 硬件备件，安排派工实施',
      },
    ],
  },
  {
    id: 'WO-2026-209112385',
    code: '209112385',
    title: '双基识读 AI 算法 GPU 显存限制热更新终验单',
    status: '待验证',
    priority: '中',
    assignee: '严亮',
    applicant: '王海峰',
    dept: 'AI 视觉算法工程部',
    createTime: '2026/11/05 18:40:00',
    lastUpdateTime: '2026/11/05 18:40:00',
    finishTime: '2026/11/06 12:00:00',
    description: '显存分配限制更新已上线，请求质量验证官严亮对低照度场景算力置信度进行终验。',
    implementer: '姜文涛',
    verifier: '严亮',
    planStartTime: '2026/11/05 19:00',
    planEndTime: '2026/11/05 21:00',
    analysisText: 'TensorRT 显存预分配上限从 4GB 降至 2.5GB，压测显存未见泄露。',
    approvalText: '同意试运行测试。',
    actualStartTime: '2026/11/05 19:00',
    actualEndTime: '2026/11/05 20:30',
    implResult: '实施成功',
    implText: '完成算力集群配额热加载更新。',
    verifyResult: '验证通过',
    verifyText: '24 小时夜间低照度识别准确率达 99.94%，验证合格。',
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
        role: 'AI 算法组长',
        time: '2026/11/05 18:40:00',
        receiver: '严亮',
        auditTime: '2026/11/05 18:40:00',
        auditStatus: '待验证/请求验收',
        comment: '算法限制发布完成，申请终验闭环',
      },
    ],
  },
  {
    id: 'WO-2026-209112386',
    code: '209112386',
    title: 'SAN 光纤存储网络 SFP+ 接口清洁光功率排查单',
    status: '待分析',
    priority: '高',
    assignee: '陈晨',
    applicant: '周杰',
    dept: '存储网络运维组',
    createTime: '2026/11/05 14:10:00',
    lastUpdateTime: '2026/11/05 14:10:00',
    finishTime: '2026/11/06 18:00:00',
    description: '光端机接收光功率降至 -14.2dBm，请存储工程师陈晨分析光纤端面污染粉尘并测算。',
    implementer: '陈晨',
    verifier: '顾亚军',
    planStartTime: '2026/11/06 14:00',
    planEndTime: '2026/11/06 16:00',
    analysisText: '检测到 8Gbps FC 端口 Rx 光功率异常降低，建议使用无尘棉棒清理 SFP+ 端面。',
    timelineNodes: [
      { stage: '创建人', person: '周杰', status: 'completed' },
      { stage: '上级审批人', person: '顾亚军', status: 'completed' },
      { stage: '受理人', person: '陈晨', status: 'active' },
      { stage: '受理中', person: '陈晨', status: 'pending' },
      { stage: '处理完成', person: '陈晨', status: 'pending' },
      { stage: '确认完成', person: '顾亚军', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '周杰',
        role: '机房运维员',
        time: '2026/11/05 14:10:00',
        receiver: '陈晨',
        auditTime: '2026/11/05 14:10:00',
        auditStatus: '待分析/技术诊断',
        comment: '上报光纤衰减告警单',
      },
    ],
  },
  {
    id: 'WO-2026-209112387',
    code: '209112387',
    title: '防火墙僵尸 TCP 会话自动清理脚本部署审批单',
    status: '待审批',
    priority: '中',
    assignee: '刘芳',
    applicant: '孙伟',
    dept: '网络安全保障组',
    createTime: '2026/11/05 11:20:00',
    lastUpdateTime: '2026/11/05 11:20:00',
    finishTime: '2026/11/06 18:00:00',
    description: '编写定时脚本 clear 超期 inactive 链接，请安全负责人刘芳进行安全合规审查。',
    implementer: '孙伟',
    verifier: '程总工',
    planStartTime: '2026/11/06 15:00',
    planEndTime: '2026/11/06 16:30',
    analysisText: 'TCP 链接池使用率达 88%，清理超时连接可释放约 12000 个会话表项。',
    approvalText: '审查符合网络安全等级保护二层规范，批准部署。',
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
        auditTime: '2026/11/05 11:20:00',
        auditStatus: '待审批/安全评审',
        comment: '提交防火墙策略定时清理评估',
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
    implementer: '许峰',
    verifier: '彭雷',
    planStartTime: '2026/11/06 11:00',
    planEndTime: '2026/11/06 13:00',
    analysisText: '检测到写入坏块递增，需要执行 HDFS Block Node 挂起拉出并物理换盘。',
    approvalText: '批复执行物理更换。',
    actualStartTime: '2026/11/06 11:00',
    actualEndTime: '2026/11/06 12:15',
    implResult: '实施成功',
    implText: '更换企业级 3.84TB SSD，新盘挂载重建完成。',
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
    implementer: '徐洋',
    verifier: '钱国栋',
    planStartTime: '2026/11/05 14:00',
    planEndTime: '2026/11/05 16:00',
    analysisText: '误码率上升因光纤连接器插塞抖动，已校准夹紧锁扣。',
    approvalText: '批准上线测试。',
    actualStartTime: '2026/11/05 14:00',
    actualEndTime: '2026/11/05 15:30',
    implResult: '实施成功',
    implText: '完成光缆拔插紧固与波长测试。',
    verifyResult: '验证通过',
    verifyText: '40G 满载持续打流 1 小时 0 误码，测试合格。',
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
    implementer: '马天明',
    verifier: '何少华',
    planStartTime: '2026/11/06 16:00',
    planEndTime: '2026/11/06 17:30',
    analysisText: 'Cert-Manager 缺少集群级别的 Secret 写入权限，需扩充 ServiceAccount ClusterRole。',
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
    implementer: '郭宝成',
    verifier: '李明远',
    planStartTime: '2026/11/06 10:00',
    planEndTime: '2026/11/06 11:30',
    analysisText: '零地电压偏高导致高次谐波干扰采样，需要加装信号隔离变压器。',
    approvalText: '符合数据中心 PUE 校正标准，批准下发。',
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
    status: '待实施',
    priority: '低',
    assignee: '张帆',
    applicant: '严亮',
    dept: '中间件运维部',
    createTime: '2026/11/04 11:00:00',
    lastUpdateTime: '2026/11/04 11:00:00',
    finishTime: '2026/11/06 18:00:00',
    description: '死信队列积压超 50 万条，审批通过后使用 Shovel 插件重定向至持久化归档。',
    implementer: '张帆',
    verifier: '顾亚军',
    planStartTime: '2026/11/06 14:00',
    planEndTime: '2026/11/06 15:30',
    analysisText: '因下游消费服务防重机制死锁导致死信流转，已修复上游消费代码。',
    approvalText: '批复使用备份交换机转移清空。',
    actualStartTime: '2026/11/06 14:00',
    actualEndTime: '2026/11/06 14:45',
    implResult: '实施成功',
    implText: '死信队列全部搬迁至冷存储，集群内存使用下降 3.2GB。',
    timelineNodes: [
      { stage: '创建人', person: '严亮', status: 'completed' },
      { stage: '上级审批人', person: '顾亚军', status: 'completed' },
      { stage: '受理人', person: '张帆', status: 'completed' },
      { stage: '受理中', person: '张帆', status: 'active' },
      { stage: '处理完成', person: '张帆', status: 'pending' },
      { stage: '确认完成', person: '顾亚军', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '严亮',
        role: '中间件专家',
        time: '2026/11/04 11:00:00',
        receiver: '张帆',
        auditTime: '2026/11/04 11:00:00',
        auditStatus: '待实施/插件配置',
        comment: '准备使用 Shovel 插件流转清理',
      },
    ],
  },
  {
    id: 'WO-2026-209112393',
    code: '209112393',
    title: 'Prometheus 警报规则评估与抑制死锁解除单',
    status: '待验证',
    priority: '中',
    assignee: '赵勇',
    applicant: '李建',
    dept: '监控运维保障组',
    createTime: '2026/11/04 09:00:00',
    lastUpdateTime: '2026/11/04 09:00:00',
    finishTime: '2026/11/06 18:00:00',
    description: '报警风暴触发的抑制规则存在环形死锁，修改 Alertmanager yml 规则并提请验证。',
    implementer: '李建',
    verifier: '赵勇',
    planStartTime: '2026/11/04 10:00',
    planEndTime: '2026/11/04 11:30',
    analysisText: '抑制规则包含互斥条件，优化 equal 属性层级定义。',
    approvalText: '批准规则配置更新。',
    actualStartTime: '2026/11/04 10:00',
    actualEndTime: '2026/11/04 10:40',
    implResult: '实施成功',
    implText: 'Reload 警报规则，模拟告警触发通知恢复正常。',
    verifyResult: '验证通过',
    verifyText: '模拟 5 种并发告警场景，抑制与收敛逻辑完全符合期望。',
    timelineNodes: [
      { stage: '创建人', person: '李建', status: 'completed' },
      { stage: '上级审批人', person: '程总工', status: 'completed' },
      { stage: '受理人', person: '李建', status: 'completed' },
      { stage: '受理中', person: '李建', status: 'completed' },
      { stage: '处理完成', person: '李建', status: 'completed' },
      { stage: '确认完成', person: '赵勇', status: 'active' },
    ],
    formAudits: [
      {
        operator: '李建',
        role: '监控系统工程师',
        time: '2026/11/04 09:00:00',
        receiver: '赵勇',
        auditTime: '2026/11/04 09:00:00',
        auditStatus: '待验证/规则验证',
        comment: '请求进行报警抑制链路验证',
      },
    ],
  },
  {
    id: 'WO-2026-209112394',
    code: '209112394',
    title: 'Flink 实时流计算引擎 TaskManager 堆外内存调整',
    status: '待分析',
    priority: '高',
    assignee: '王强',
    applicant: '陈晨',
    dept: '实时计算技术部',
    createTime: '2026/11/03 16:10:00',
    lastUpdateTime: '2026/11/03 16:10:00',
    finishTime: '2026/11/06 18:00:00',
    description: 'Off-heap Direct Memory 溢出导致 Checkpoint 频繁失败，请大数据专家王强诊断。',
    implementer: '王强',
    verifier: '赵振华',
    planStartTime: '2026/11/06 16:30',
    planEndTime: '2026/11/06 18:00',
    analysisText: 'Netty 内存池未及时释放，需扩大 taskmanager.memory.framework.off-heap.size 参数。',
    timelineNodes: [
      { stage: '创建人', person: '陈晨', status: 'completed' },
      { stage: '上级审批人', person: '赵振华', status: 'completed' },
      { stage: '受理人', person: '王强', status: 'active' },
      { stage: '受理中', person: '王强', status: 'pending' },
      { stage: '处理完成', person: '王强', status: 'pending' },
      { stage: '确认完成', person: '赵振华', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '陈晨',
        role: '流计算工程师',
        time: '2026/11/03 16:10:00',
        receiver: '王强',
        auditTime: '2026/11/03 16:10:00',
        auditStatus: '待分析/堆外内存排查',
        comment: '提交 Flink 内存溢出分析单',
      },
    ],
  },
  {
    id: 'WO-2026-209112395',
    code: '209112395',
    title: '云机房冷通道机柜温湿度传感器频偏重校准单',
    status: '待审批',
    priority: '低',
    assignee: '许峰',
    applicant: '郭宝成',
    dept: '数据中心环境部',
    createTime: '2026/11/03 10:30:00',
    lastUpdateTime: '2026/11/03 10:30:00',
    finishTime: '2026/11/06 18:00:00',
    description: '环境温湿度漂移 1.5 度，申请对 Modbus 通信地址 0x0A 传感器清零校准。',
    implementer: '郭宝成',
    verifier: '许峰',
    planStartTime: '2026/11/06 11:00',
    planEndTime: '2026/11/06 12:00',
    analysisText: '测得采样电阻热敏性能老化，进行标定漂移补正。',
    approvalText: '同意校准。',
    timelineNodes: [
      { stage: '创建人', person: '郭宝成', status: 'completed' },
      { stage: '上级审批人', person: '许峰', status: 'active' },
      { stage: '受理人', person: '郭宝成', status: 'pending' },
      { stage: '受理中', person: '郭宝成', status: 'pending' },
      { stage: '处理完成', person: '郭宝成', status: 'pending' },
      { stage: '确认完成', person: '许峰', status: 'pending' },
    ],
    formAudits: [
      {
        operator: '郭宝成',
        role: '动环工程师',
        time: '2026/11/03 10:30:00',
        receiver: '许峰',
        auditTime: '2026/11/03 10:30:00',
        auditStatus: '待审批/标定复核',
        comment: '申请传感器标定授权',
      },
    ],
  },
];

interface WorkOrderApprovalViewProps {
  workOrders?: WorkOrder[];
  pageTitle?: string;
  subTitle?: string;
  onOpenOrderDetail?: (order: WorkOrder) => void;
  onApproveOrder?: (id: string, comment: string) => void;
  onRejectOrder?: (id: string, comment: string) => void;
}

export const WorkOrderApprovalView: React.FC<WorkOrderApprovalViewProps> = ({
  pageTitle = '待办工单处理列表',
  subTitle = '流转响应控制台 · 每页 10 条数据',
}) => {
  const [ordersList, setOrdersList] = useState<PendingWorkOrderItem[]>(INITIAL_PENDING_WORK_ORDERS);

  // Search & Filter state variables matching screenshot image_08348aec.png:
  // 请输入工单名称, 全部优先级, 全部工单状态, 搜索
  const [titleSearch, setTitleSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination states (Per user prompt discipline: 每页显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [jumpPageInput, setJumpPageInput] = useState<string>('1');

  // Interactive Stage Modals
  const [analyzingOrder, setAnalyzingOrder] = useState<PendingWorkOrderItem | null>(null);
  const [approvingOrder, setApprovingOrder] = useState<PendingWorkOrderItem | null>(null);
  const [implementingOrder, setImplementingOrder] = useState<PendingWorkOrderItem | null>(null);
  const [verifyingOrder, setVerifyingOrder] = useState<PendingWorkOrderItem | null>(null);
  const [viewingOrderDetail, setViewingOrderDetail] = useState<PendingWorkOrderItem | null>(null);

  // Modal Input Form States matching screenshots image_45427fc5, image_acc21362, image_fdf82cb3, image_e31f0b0b
  // 1. 工单分析 Form States
  const [formImplementer, setFormImplementer] = useState('李建');
  const [formVerifier, setFormVerifier] = useState('赵振华');
  const [formPlanStartTime, setFormPlanStartTime] = useState('2026/11/06 10:00');
  const [formPlanEndTime, setFormPlanEndTime] = useState('2026/11/06 12:00');
  const [formAnalysisText, setFormAnalysisText] = useState('经示波器与反射仪测算，驻波比失配系接头防潮圈老化，建议更换低损同轴接头。');

  // 2. 工单审批 Form States
  const [formApprovalText, setFormApprovalText] = useState('经评估硬件故障影响范围可控，备件充足，批准派发施工人员现场抢修。');

  // 3. 工单实施 Form States
  const [formActualStartTime, setFormActualStartTime] = useState('2026/11/06 10:15');
  const [formActualEndTime, setFormActualEndTime] = useState('2026/11/06 11:30');
  const [formImplResult, setFormImplResult] = useState('实施成功');
  const [formImplText, setFormImplText] = useState('完成硬件模块热插拔与射频线缆更换，各项硬件绿灯指示正常。');

  // 4. 工单验证 Form States
  const [formVerifyResult, setFormVerifyResult] = useState('验证通过');
  const [formVerifyText, setFormVerifyText] = useState('对捕获率和响应延时进行 24h 连续复测，各项 SLA 指标完全恢复最优水平。');

  // Detail Modal Tab
  const [detailActiveTab, setDetailActiveTab] = useState<'process' | 'form'>('process');

  // Open Handlers
  const handleOpenAnalyze = (item: PendingWorkOrderItem) => {
    setAnalyzingOrder(item);
    setFormImplementer(item.implementer || '李建');
    setFormVerifier(item.verifier || '张帆');
    setFormPlanStartTime(item.planStartTime || '2026/11/06 10:00');
    setFormPlanEndTime(item.planEndTime || '2026/11/06 12:00');
    setFormAnalysisText(item.analysisText || '经测量示波器回波损耗，初步定性为同轴馈线防潮老化，建议现场排查更换。');
  };

  const handleOpenApprove = (item: PendingWorkOrderItem) => {
    setApprovingOrder(item);
    setFormApprovalText(item.approvalText || '经评估变更方案合规，符合双人复核安全要求，准予下发实施。');
  };

  const handleOpenImplement = (item: PendingWorkOrderItem) => {
    setImplementingOrder(item);
    setFormActualStartTime(item.actualStartTime || '2026/11/06 10:00');
    setFormActualEndTime(item.actualEndTime || '2026/11/06 11:30');
    setFormImplResult(item.implResult || '实施成功');
    setFormImplText(item.implText || '已完成现场热插拔与线缆紧固，系统负载响应恢复正常。');
  };

  const handleOpenVerify = (item: PendingWorkOrderItem) => {
    setVerifyingOrder(item);
    setFormVerifyResult(item.verifyResult || '验证通过');
    setFormVerifyText(item.verifyText || '经 24h 持续监控压测，各项指标完全符合上线标准。');
  };

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

  // Stage Action Confirmations
  const confirmAnalysis = () => {
    if (analyzingOrder) {
      setOrdersList((prev) =>
        prev.map((o) => (o.id === analyzingOrder.id ? { 
          ...o, 
          status: '待审批', 
          implementer: formImplementer,
          verifier: formVerifier,
          planStartTime: formPlanStartTime,
          planEndTime: formPlanEndTime,
          analysisText: formAnalysisText,
          lastUpdateTime: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/') 
        } : o))
      );
      setAnalyzingOrder(null);
      alert(`工单 ${analyzingOrder.id} 故障分析已提交并流转至「待审批」阶段！`);
    }
  };

  const confirmApproval = (isApproved: boolean) => {
    if (approvingOrder) {
      if (isApproved) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === approvingOrder.id ? { 
            ...o, 
            status: '待实施', 
            approvalText: formApprovalText,
            lastUpdateTime: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/') 
          } : o))
        );
        alert(`工单 ${approvingOrder.id} 审批通过！已成功推进至「待实施」阶段。`);
      } else {
        setOrdersList((prev) => prev.filter((o) => o.id !== approvingOrder.id));
        alert(`工单 ${approvingOrder.id} 已成功驳回并退单关闭。`);
      }
      setApprovingOrder(null);
    }
  };

  const confirmImplementation = () => {
    if (implementingOrder) {
      setOrdersList((prev) =>
        prev.map((o) => (o.id === implementingOrder.id ? { 
          ...o, 
          status: '待验证', 
          actualStartTime: formActualStartTime,
          actualEndTime: formActualEndTime,
          implResult: formImplResult,
          implText: formImplText,
          lastUpdateTime: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/') 
        } : o))
      );
      setImplementingOrder(null);
      alert(`工单 ${implementingOrder.id} 现场实施完成！已提请进行「待验证」终验。`);
    }
  };

  const confirmVerification = (isPassed: boolean) => {
    if (verifyingOrder) {
      if (isPassed) {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === verifyingOrder.id ? { 
            ...o, 
            status: '已完成', 
            verifyResult: formVerifyResult,
            verifyText: formVerifyText,
            lastUpdateTime: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/') 
          } : o))
        );
        alert(`工单 ${verifyingOrder.id} 终验通过！工单闭环归档成功。`);
      } else {
        setOrdersList((prev) =>
          prev.map((o) => (o.id === verifyingOrder.id ? { 
            ...o, 
            status: '待实施', 
            verifyResult: '验证不通过',
            lastUpdateTime: new Date().toISOString().replace('T', ' ').slice(0, 19).replace(/-/g, '/') 
          } : o))
        );
        alert(`工单 ${verifyingOrder.id} 终验不合格，已退回整改实施阶段。`);
      }
      setVerifyingOrder(null);
    }
  };

  const getPriorityBadgeClass = (p: PendingWorkOrderItem['priority']) => {
    switch (p) {
      case '高':
        return 'text-rose-400 font-bold';
      case '中':
        return 'text-amber-400 font-bold';
      case '低':
        return 'text-emerald-400 font-bold';
    }
  };

  const getStatusBadgeClass = (st: PendingWorkOrderItem['status']) => {
    switch (st) {
      case '待分析':
        return 'text-cyan-400 font-bold animate-pulse';
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
      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">待办工单总数</span>
            <div className="text-2xl font-black text-slate-100 mt-1">
              {ordersList.length} <span className="text-xs font-normal text-slate-400">单</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ClipboardList className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">待分析 / 待审批</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {ordersList.filter((o) => o.status === '待分析' || o.status === '待审批').length} <span className="text-xs font-normal text-slate-400">单</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <FileSearch className="w-5 h-5 animate-pulse" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">待现场实施工单</span>
            <div className="text-2xl font-black text-yellow-300 mt-1">
              {ordersList.filter((o) => o.status === '待实施').length} <span className="text-xs font-normal text-slate-400">单</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-300">
            <Wrench className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between shadow-xs">
          <div>
            <span className="text-slate-400 font-sans text-xs block">待验收验证工单</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {ordersList.filter((o) => o.status === '待验证').length} <span className="text-xs font-normal text-slate-400">单</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Section Card: 待办工单 */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        {/* Title Header matching image_08348aec.png & image_a27149e8.png */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4.5 h-4.5 text-cyan-400" />
            <h3 className="text-base font-bold text-slate-100 font-sans">{pageTitle}</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              {subTitle}
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            多角色分工履约 · 动态支持分析/审批/实施/验证
          </span>
        </div>

        {/* Filter Toolbar matching screenshot image_08348aec.png:
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

        {/* Data Table matching exact columns from image_08348aec.png */}
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
                    暂无待办工单处理记录
                  </td>
                </tr>
              ) : (
                currentPageItems.map((item, idx) => {
                  const globalIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-950/80 transition-colors group cursor-pointer"
                      onClick={() => setViewingOrderDetail(item)}
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

                      {/* 10. 操作: Stage action buttons + 查看详情 */}
                      <td className="py-3 px-3 text-right font-sans">
                        <div className="flex items-center justify-end gap-3">
                          {item.status === '待分析' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenAnalyze(item);
                              }}
                              className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold hover:underline"
                            >
                              分析
                            </button>
                          )}

                          {item.status === '待审批' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenApprove(item);
                              }}
                              className="text-cyan-400 hover:text-amber-300 text-[11px] font-bold hover:underline"
                            >
                              审批
                            </button>
                          )}

                          {item.status === '待实施' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenImplement(item);
                              }}
                              className="text-cyan-400 hover:text-yellow-300 text-[11px] font-bold hover:underline"
                            >
                              实施
                            </button>
                          )}

                          {item.status === '待验证' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenVerify(item);
                              }}
                              className="text-cyan-400 hover:text-blue-300 text-[11px] font-bold hover:underline"
                            >
                              验证
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingOrderDetail(item);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 text-[11px] font-medium hover:underline"
                          >
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

        {/* Pagination Bar (Matching prompt discipline: 每页显示10条数据) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
          <span>
            显示第 {(currentPage - 1) * pageSize + 1} 至 {Math.min(currentPage * pageSize, filteredOrders.length)} 条，共 {filteredOrders.length} 条待办工单
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

      {/* ------------------------------------------------------------- */}
      {/* Modal 1: 「工单分析」Modal matching screenshot image_45427fc5.png */}
      {/* ------------------------------------------------------------- */}
      {analyzingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header: 工单分析 | X */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-sans">
                工单分析
              </h3>
              <button
                onClick={() => setAnalyzingOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: Basic Info Block (Matching image_45427fc5.png) */}
            <div className="space-y-2.5 font-sans text-xs">
              <div className="grid grid-cols-2 gap-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 font-sans">工单优先级: </span>
                  <span className={getPriorityBadgeClass(analyzingOrder.priority)}>{analyzingOrder.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">提单人: </span>
                  <span className="text-slate-100 font-bold font-sans">{analyzingOrder.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">创建时间: </span>
                  <span className="text-slate-300">{analyzingOrder.createTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">修改时间: </span>
                  <span className="text-slate-300">{analyzingOrder.lastUpdateTime}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-slate-400 font-sans">描述: </span>
                <span className="text-slate-200 font-sans font-medium">{analyzingOrder.description}</span>
              </div>
            </div>

            {/* Divider Line */}
            <div className="border-t border-slate-800" />

            {/* Section 2: Form Inputs Area (Matching image_45427fc5.png) */}
            <div className="space-y-4 font-sans text-xs">
              {/* Row 1: *实施人, *验证人 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>实施人:
                  </label>
                  <select
                    value={formImplementer}
                    onChange={(e) => setFormImplementer(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                  >
                    <option value="李建">李建</option>
                    <option value="张帆">张帆</option>
                    <option value="王强">王强</option>
                    <option value="赵勇">赵勇</option>
                    <option value="严亮">严亮</option>
                    <option value="陈晨">陈晨</option>
                    <option value="许峰">许峰</option>
                    <option value="钱国栋">钱国栋</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>验证人:
                  </label>
                  <select
                    value={formVerifier}
                    onChange={(e) => setFormVerifier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                  >
                    <option value="赵振华">赵振华</option>
                    <option value="程总工">程总工</option>
                    <option value="李明远">李明远</option>
                    <option value="王海峰">王海峰</option>
                    <option value="顾亚军">顾亚军</option>
                    <option value="刘芳">刘芳</option>
                    <option value="彭雷">彭雷</option>
                  </select>
                </div>
              </div>

              {/* Row 2: *计划开始时间, *计划结束时间 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>计划开始时间:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formPlanStartTime}
                      onChange={(e) => setFormPlanStartTime(e.target.value)}
                      placeholder="请选择开始时间"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-9 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>计划结束时间:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formPlanEndTime}
                      onChange={(e) => setFormPlanEndTime(e.target.value)}
                      placeholder="选择计划结束时间"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-9 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Row 3: *分析描述 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>分析描述:
                </label>
                <textarea
                  rows={4}
                  value={formAnalysisText}
                  onChange={(e) => setFormAnalysisText(e.target.value)}
                  placeholder="请输入分析描述"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Buttons: [ 取消 ] [ 提交 ] matching image_45427fc5.png */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setAnalyzingOrder(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                取消
              </button>
              <button
                onClick={confirmAnalysis}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors font-sans"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Modal 2: 「工单审批」Modal matching screenshot image_acc21362.png */}
      {/* ------------------------------------------------------------- */}
      {approvingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header: 工单审批 | X */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-sans">
                工单审批
              </h3>
              <button
                onClick={() => setApprovingOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Basic Info & Analysis Summary Block (Matching image_acc21362.png) */}
            <div className="space-y-2.5 font-sans text-xs">
              <div className="grid grid-cols-2 gap-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 font-sans">工单优先级: </span>
                  <span className={getPriorityBadgeClass(approvingOrder.priority)}>{approvingOrder.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">提单人: </span>
                  <span className="text-slate-100 font-bold font-sans">{approvingOrder.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">创建时间: </span>
                  <span className="text-slate-300">{approvingOrder.createTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">修改时间: </span>
                  <span className="text-slate-300">{approvingOrder.lastUpdateTime}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-400 font-sans">描述: </span>
                <span className="text-slate-200 font-sans font-medium">{approvingOrder.description}</span>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-slate-300 pt-1 font-sans">
                <div>
                  <span className="text-slate-400">实施人: </span>
                  <span className="text-cyan-300 font-bold">{approvingOrder.implementer || '李建'}</span>
                </div>
                <div>
                  <span className="text-slate-400">验证人: </span>
                  <span className="text-emerald-300 font-bold">{approvingOrder.verifier || '赵振华'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">计划开始时间: </span>
                  <span className="text-slate-300 font-mono">{approvingOrder.planStartTime || '2026/11/06 13:00'}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">计划结束时间: </span>
                  <span className="text-slate-300 font-mono">{approvingOrder.planEndTime || '2026/11/06 15:00'}</span>
                </div>
              </div>

              <div className="pt-1">
                <span className="text-slate-400">分析描述: </span>
                <span className="text-slate-300 leading-relaxed">
                  {approvingOrder.analysisText || '故障分析完成，硬件影响可控。'}
                </span>
              </div>
            </div>

            {/* Form Inputs Area: *审批原因 (Matching image_acc21362.png) */}
            <div className="space-y-2 font-sans text-xs pt-2 border-t border-slate-800">
              <label className="block text-slate-300 font-medium">
                <span className="text-rose-500 mr-1">*</span>审批原因:
              </label>
              <textarea
                rows={4}
                value={formApprovalText}
                onChange={(e) => setFormApprovalText(e.target.value)}
                placeholder="请输入变更影响描述"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs leading-relaxed"
              />
            </div>

            {/* Footer Buttons: [ 驳回 ] [ 通过 ] matching image_acc21362.png */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => confirmApproval(false)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-rose-300 text-xs font-bold transition-colors font-sans border border-slate-700"
              >
                驳回
              </button>
              <button
                onClick={() => confirmApproval(true)}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors font-sans"
              >
                通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Modal 3: 「工单实施」Modal matching screenshot image_fdf82cb3.png */}
      {/* ------------------------------------------------------------- */}
      {implementingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header: 工单实施 | X */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-sans">
                工单实施
              </h3>
              <button
                onClick={() => setImplementingOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: 工单信息 (Matching image_fdf82cb3.png) */}
            <div className="space-y-2 font-sans text-xs">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                工单信息
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 font-sans">工单优先级: </span>
                  <span className={getPriorityBadgeClass(implementingOrder.priority)}>{implementingOrder.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">提单人: </span>
                  <span className="text-slate-100 font-bold font-sans">{implementingOrder.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">创建时间: </span>
                  <span className="text-slate-300">{implementingOrder.createTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">修改时间: </span>
                  <span className="text-slate-300">{implementingOrder.lastUpdateTime}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">描述: </span>
                <span className="text-slate-200 font-medium">{implementingOrder.description}</span>
              </div>
            </div>

            {/* Section 2: 工单分析 (Matching image_fdf82cb3.png) */}
            <div className="space-y-2 font-sans text-xs pt-1">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                工单分析
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-300">
                <div>
                  <span className="text-slate-400">实施人: </span>
                  <span className="text-cyan-300 font-bold">{implementingOrder.implementer || '李建'}</span>
                </div>
                <div>
                  <span className="text-slate-400">验证人: </span>
                  <span className="text-emerald-300 font-bold">{implementingOrder.verifier || '赵振华'}</span>
                </div>
                <div>
                  <span className="text-slate-400">计划开始时间: </span>
                  <span className="text-slate-300 font-mono">{implementingOrder.planStartTime || '2026/11/06 09:30'}</span>
                </div>
                <div>
                  <span className="text-slate-400">计划结束时间: </span>
                  <span className="text-slate-300 font-mono">{implementingOrder.planEndTime || '2026/11/06 11:30'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">分析描述: </span>
                <span className="text-slate-300">{implementingOrder.analysisText || '分析结论已确认。'}</span>
              </div>
            </div>

            {/* Section 3: 审批原因 (Matching image_fdf82cb3.png) */}
            <div className="space-y-2 font-sans text-xs pt-1">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                审批原因
              </div>
              <div>
                <span className="text-slate-400">审批原因: </span>
                <span className="text-slate-300">{implementingOrder.approvalText || '批准现场热插拔替换实施。'}</span>
              </div>
            </div>

            {/* Section 4: 实施 Form Inputs (Matching image_fdf82cb3.png) */}
            <div className="space-y-4 font-sans text-xs pt-1 border-t border-slate-800">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                实施
              </div>

              <div>
                <span className="text-slate-400">实施人: </span>
                <span className="text-slate-100 font-bold">{implementingOrder.implementer || '李建'}</span>
              </div>

              {/* *实际开始时间, *实际完成时间 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>实际开始时间:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formActualStartTime}
                      onChange={(e) => setFormActualStartTime(e.target.value)}
                      placeholder="请选择开始时间"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-9 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">
                    <span className="text-rose-500 mr-1">*</span>实际完成时间:
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formActualEndTime}
                      onChange={(e) => setFormActualEndTime(e.target.value)}
                      placeholder="请选择完成时间"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-3 pr-9 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                    />
                    <Calendar className="w-4 h-4 absolute right-3 top-2.5 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* *实施结果 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>实施结果:
                </label>
                <select
                  value={formImplResult}
                  onChange={(e) => setFormImplResult(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option value="实施成功">实施成功</option>
                  <option value="实施异常">实施异常</option>
                  <option value="部分完成">部分完成</option>
                </select>
              </div>

              {/* 实施说明 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  实施说明:
                </label>
                <textarea
                  rows={3}
                  value={formImplText}
                  onChange={(e) => setFormImplText(e.target.value)}
                  placeholder="请输入描述"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Buttons: [ 返回 ] [ 提交 ] matching image_fdf82cb3.png */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setImplementingOrder(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                返回
              </button>
              <button
                onClick={confirmImplementation}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors font-sans"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Modal 4: 「工单验证」Modal matching screenshot image_e31f0b0b.png */}
      {/* ------------------------------------------------------------- */}
      {verifyingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Header: 工单验证 | X */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-slate-100 font-sans">
                工单验证
              </h3>
              <button
                onClick={() => setVerifyingOrder(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Section 1: 工单信息 (Matching image_e31f0b0b.png) */}
            <div className="space-y-2 font-sans text-xs">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                工单信息
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-300 font-mono">
                <div>
                  <span className="text-slate-400 font-sans">工单优先级: </span>
                  <span className={getPriorityBadgeClass(verifyingOrder.priority)}>{verifyingOrder.priority}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">提单人: </span>
                  <span className="text-slate-100 font-bold font-sans">{verifyingOrder.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">创建时间: </span>
                  <span className="text-slate-300">{verifyingOrder.createTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-sans">修改时间: </span>
                  <span className="text-slate-300">{verifyingOrder.lastUpdateTime}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">描述: </span>
                <span className="text-slate-200 font-medium">{verifyingOrder.description}</span>
              </div>
            </div>

            {/* Section 2: 工单分析 (Matching image_e31f0b0b.png) */}
            <div className="space-y-2 font-sans text-xs pt-1">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                工单分析
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-300">
                <div>
                  <span className="text-slate-400">实施人: </span>
                  <span className="text-cyan-300 font-bold">{verifyingOrder.implementer || '李建'}</span>
                </div>
                <div>
                  <span className="text-slate-400">验证人: </span>
                  <span className="text-emerald-300 font-bold">{verifyingOrder.verifier || '严亮'}</span>
                </div>
                <div>
                  <span className="text-slate-400">计划开始时间: </span>
                  <span className="text-slate-300 font-mono">{verifyingOrder.planStartTime || '2026/11/05 19:00'}</span>
                </div>
                <div>
                  <span className="text-slate-400">计划结束时间: </span>
                  <span className="text-slate-300 font-mono">{verifyingOrder.planEndTime || '2026/11/05 21:00'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">分析描述: </span>
                <span className="text-slate-300">{verifyingOrder.analysisText || '分析描述测试。'}</span>
              </div>
            </div>

            {/* Section 3: 审批原因 (Matching image_e31f0b0b.png) */}
            <div className="space-y-2 font-sans text-xs pt-1">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                审批原因
              </div>
              <div>
                <span className="text-slate-400">审批原因: </span>
                <span className="text-slate-300">{verifyingOrder.approvalText || '批准进行试运行测试。'}</span>
              </div>
            </div>

            {/* Section 4: 实施 (Matching image_e31f0b0b.png) */}
            <div className="space-y-2 font-sans text-xs pt-1">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                实施
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-slate-300">
                <div>
                  <span className="text-slate-400">实施人: </span>
                  <span className="text-slate-100 font-bold">{verifyingOrder.implementer || '李建'}</span>
                </div>
                <div>
                  <span className="text-slate-400">实施结果: </span>
                  <span className="text-emerald-400 font-bold">{verifyingOrder.implResult || '实施成功'}</span>
                </div>
                <div>
                  <span className="text-slate-400">实际开始时间: </span>
                  <span className="text-slate-300 font-mono">{verifyingOrder.actualStartTime || '2026/11/05 19:00'}</span>
                </div>
                <div>
                  <span className="text-slate-400">实际完成时间: </span>
                  <span className="text-slate-300 font-mono">{verifyingOrder.actualEndTime || '2026/11/05 20:30'}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-400">实施说明: </span>
                <span className="text-slate-300">{verifyingOrder.implText || '更新完成。'}</span>
              </div>
            </div>

            {/* Section 5: 工单验证 Form Inputs (Matching image_e31f0b0b.png) */}
            <div className="space-y-4 font-sans text-xs pt-1 border-t border-slate-800">
              <div className="text-xs font-bold text-cyan-400 border-b border-slate-800 pb-1">
                工单验证
              </div>

              <div>
                <span className="text-slate-400">验证人: </span>
                <span className="text-slate-100 font-bold">{verifyingOrder.verifier || '严亮'}</span>
              </div>

              {/* *验证结果 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  <span className="text-rose-500 mr-1">*</span>验证结果:
                </label>
                <select
                  value={formVerifyResult}
                  onChange={(e) => setFormVerifyResult(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option value="验证通过">验证通过</option>
                  <option value="验证不通过">验证不通过</option>
                </select>
              </div>

              {/* 验证建议 */}
              <div>
                <label className="block text-slate-300 font-medium mb-1.5">
                  验证建议:
                </label>
                <textarea
                  rows={3}
                  value={formVerifyText}
                  onChange={(e) => setFormVerifyText(e.target.value)}
                  placeholder="验证建议"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-cyan-500 font-sans text-xs leading-relaxed"
                />
              </div>
            </div>

            {/* Footer Buttons: [ 返回 ] [ 提交 ] matching image_e31f0b0b.png */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setVerifyingOrder(null)}
                className="px-5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors font-sans"
              >
                返回
              </button>
              <button
                onClick={() => confirmVerification(formVerifyResult === '验证通过')}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors font-sans"
              >
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: 查看详情 Modal */}
      {viewingOrderDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  工单全息明细卡片 ({viewingOrderDetail.id})
                </h3>
              </div>
              <button
                onClick={() => setViewingOrderDetail(null)}
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
                  <span className="font-bold text-slate-100 font-sans">{viewingOrderDetail.applicant}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">提单部门:</span>
                  <span className="text-slate-200 font-sans">{viewingOrderDetail.dept}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">提单时间:</span>
                  <span className="text-slate-300 text-[11px]">{viewingOrderDetail.createTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">完成时间:</span>
                  <span className="text-slate-300 text-[11px]">{viewingOrderDetail.finishTime || '处置中'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">当前受理人:</span>
                  <span className="font-bold text-emerald-400 font-sans">{viewingOrderDetail.assignee}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block font-sans">当前状态:</span>
                  <span className={`font-bold font-sans ${getStatusBadgeClass(viewingOrderDetail.status)}`}>
                    {viewingOrderDetail.status}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-500 block font-sans text-[11px]">工单描述:</span>
                <p className="text-slate-200 font-sans text-xs mt-0.5 leading-relaxed font-medium">
                  {viewingOrderDetail.description}
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
                    {viewingOrderDetail.timelineNodes.map((node, nIdx) => {
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

                          {nIdx < viewingOrderDetail.timelineNodes.length - 1 && (
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
                    {viewingOrderDetail.formAudits.map((audit, aIdx) => (
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
                onClick={() => setViewingOrderDetail(null)}
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
