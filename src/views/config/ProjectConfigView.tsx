import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Building,
  Folder,
  FolderOpen,
  FolderKanban,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit3,
  Eye,
  Trash2,
  RefreshCw,
  Sliders,
  Settings,
  GitBranch,
  ShieldCheck,
  User,
  Layers,
  Award,
  Briefcase,
} from 'lucide-react';

export interface ProjectItem {
  id: string;
  projectCode: string;
  name: string;
  constructionMode: '自主研发' | '集中采购' | '联合攻关' | '厂商集成';
  constructionDeptKey: string; // e.g. 'dept_db', 'dept_rfid', 'dept_paas', 'dept_net', 'dept_sec', 'dept_compute'
  constructionDeptName: string;
  constructionDate: string; // Recent 2026 date
  isAccepted: '是 (已终验)' | '是 (阶段验收)' | '否 (试运行中)';
  contractorUnit: string;
  maintenanceUnit: string;
  description: string;
  linkedCICount: number;
  pmPerson: string;
  budgetAmount: string;
}

export interface ProjectTreeCategory {
  key: string;
  label: string;
  children: {
    key: string;
    label: string;
  }[];
}

const PROJECT_TREE: ProjectTreeCategory[] = [
  {
    key: 'by_dept',
    label: '按建设处室分类',
    children: [
      { key: 'dept_db', label: '数据架构与数据库技术部' },
      { key: 'dept_rfid', label: '边缘智能与 RFID 组' },
      { key: 'dept_paas', label: '容器与 PaaS 基础设施部' },
      { key: 'dept_net', label: '数据中心网络运维部' },
      { key: 'dept_sec', label: '信息安全与合规审计部' },
      { key: 'dept_compute', label: '实时与离线计算部' },
    ],
  },
  {
    key: 'by_mode',
    label: '按建设方式分类',
    children: [
      { key: 'mode_rd', label: '自主研发' },
      { key: 'mode_procure', label: '集中采购' },
      { key: 'mode_joint', label: '联合攻关' },
      { key: 'mode_vendor', label: '厂商集成' },
    ],
  },
];

const INITIAL_PROJECTS: ProjectItem[] = [
  // 1. 数据架构与数据库技术部 (dept_db) - 3 items
  {
    id: 'PRJ-2026-001',
    projectCode: 'PRJ-2026-OLTP01',
    name: 'PostgreSQL 16.2 零中断双活主库建设项目',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_db',
    constructionDeptName: '数据架构与数据库技术部',
    constructionDate: '2026/11/05',
    isAccepted: '是 (已终验)',
    contractorUnit: '全息数据库研发中心',
    maintenanceUnit: '数据中心数据库运维一处',
    description: '核心 OLTP 64 Core 双活复制与秒级 Failover 自动切换工程',
    linkedCICount: 18,
    pmPerson: '周峻峰',
    budgetAmount: '¥ 280 万',
  },
  {
    id: 'PRJ-2026-002',
    projectCode: 'PRJ-2026-CH02',
    name: 'ClickHouse 24.3 S3 透明冷热分层数据湖项目',
    constructionMode: '联合攻关',
    constructionDeptKey: 'dept_db',
    constructionDeptName: '数据架构与数据库技术部',
    constructionDate: '2026/11/02',
    isAccepted: '是 (阶段验收)',
    contractorUnit: 'ClickHouse 专家组 & 基础设施部',
    maintenanceUnit: '湖仓存储运维二处',
    description: '历史 45TB 索引与冷数据剥离至 MinIO/S3，节省 62% SSD 空间',
    linkedCICount: 32,
    pmPerson: '林立',
    budgetAmount: '¥ 320 万',
  },
  {
    id: 'PRJ-2026-003',
    projectCode: 'PRJ-2026-MYSQL03',
    name: 'MySQL 8.4 XtraBackup 无锁物理快照备份工程',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_db',
    constructionDeptName: '数据架构与数据库技术部',
    constructionDate: '2026/10/29',
    isAccepted: '是 (已终验)',
    contractorUnit: '全息数据库服务团队',
    maintenanceUnit: '数据库运维一处',
    description: '--no-lock 模式升级，彻底消除夜间备份 FTWRL 锁表死锁',
    linkedCICount: 12,
    pmPerson: '张建',
    budgetAmount: '¥ 120 万',
  },

  // 2. 边缘智能与 RFID 组 (dept_rfid) - 3 items
  {
    id: 'PRJ-2026-004',
    projectCode: 'PRJ-2026-RFID04',
    name: '工业级 RFID 04 天线场强与双基识读优化项目',
    constructionMode: '厂商集成',
    constructionDeptKey: 'dept_rfid',
    constructionDeptName: '边缘智能与 RFID 组',
    constructionDate: '2026/11/05',
    isAccepted: '是 (已终验)',
    contractorUnit: 'Impinj 射频集成服务商',
    maintenanceUnit: '物联仓储保障组',
    description: '自动仓储 2号产线超高频天线驻波比校准与边缘网关频段打散',
    linkedCICount: 14,
    pmPerson: '李建',
    budgetAmount: '¥ 180 万',
  },
  {
    id: 'PRJ-2026-005',
    projectCode: 'PRJ-2026-GW05',
    name: '边缘 IoT ARM 智能解析网关部署工程',
    constructionMode: '集中采购',
    constructionDeptKey: 'dept_rfid',
    constructionDeptName: '边缘智能与 RFID 组',
    constructionDate: '2026/10/15',
    isAccepted: '是 (已终验)',
    contractorUnit: '研华科技工业物联网事业部',
    maintenanceUnit: '边缘硬件运行维护处',
    description: '边缘 MQTT/OPC-UA 本地轻量化协议转译与断网续传缓存',
    linkedCICount: 10,
    pmPerson: '赵明',
    budgetAmount: '¥ 150 万',
  },
  {
    id: 'PRJ-2026-005B',
    projectCode: 'PRJ-2026-AGV05',
    name: 'AGV 自动引导车毫米波雷达与定位网关工程',
    constructionMode: '厂商集成',
    constructionDeptKey: 'dept_rfid',
    constructionDeptName: '边缘智能与 RFID 组',
    constructionDate: '2026/10/10',
    isAccepted: '是 (已终验)',
    contractorUnit: '映翰通车载网络团队',
    maintenanceUnit: '物联仓储保障组',
    description: '车载 5G 网关与毫米波雷达串口防碰撞数据融合',
    linkedCICount: 8,
    pmPerson: '赵明',
    budgetAmount: '¥ 110 万',
  },

  // 3. 容器与 PaaS 基础设施部 (dept_paas) - 3 items
  {
    id: 'PRJ-2026-006',
    projectCode: 'PRJ-2026-K8S06',
    name: 'Kubernetes v1.30 Cilium eBPF CNI 无缝迁移项目',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_paas',
    constructionDeptName: '容器与 PaaS 基础设施部',
    constructionDate: '2026/11/04',
    isAccepted: '是 (已终验)',
    contractorUnit: '云原生架构研发组',
    maintenanceUnit: 'PaaS 容器运维处',
    description: '替代 iptables 规则，全量开启 eBPF 内核套接字加速与 Pod 微隔离',
    linkedCICount: 64,
    pmPerson: '刘洋',
    budgetAmount: '¥ 450 万',
  },
  {
    id: 'PRJ-2026-007',
    projectCode: 'PRJ-2026-RDS07',
    name: 'Redis 7.2 分布式集群 BigKey 分片清理项目',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_paas',
    constructionDeptName: '容器与 PaaS 基础设施部',
    constructionDate: '2026/11/04',
    isAccepted: '是 (已终验)',
    contractorUnit: '中间件平台组',
    maintenanceUnit: '中间件运维处',
    description: '16 节点 Redis 内存碎片自愈率 1.08，UNLINK 非阻塞异步打散',
    linkedCICount: 16,
    pmPerson: '韩伟',
    budgetAmount: '¥ 160 万',
  },
  {
    id: 'PRJ-2026-007B',
    projectCode: 'PRJ-2026-TMC07',
    name: 'Spring Boot 3.2 低延迟 ZGC 微服务架构项目',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_paas',
    constructionDeptName: '容器与 PaaS 基础设施部',
    constructionDate: '2026/10/20',
    isAccepted: '是 (已终验)',
    contractorUnit: '中间件架构组',
    maintenanceUnit: 'PaaS 容器运维处',
    description: 'JDK 21 与 ZGC 垃圾回收全量适配，JVM 停顿时间缩短至 1ms 内',
    linkedCICount: 22,
    pmPerson: '韩伟',
    budgetAmount: '¥ 210 万',
  },

  // 4. 数据中心网络运维部 (dept_net) - 3 items
  {
    id: 'PRJ-2026-008',
    projectCode: 'PRJ-2026-NET08',
    name: '400G 无损以太网 Spine-Leaf 架构升级项目',
    constructionMode: '集中采购',
    constructionDeptKey: 'dept_net',
    constructionDeptName: '数据中心网络运维部',
    constructionDate: '2026/10/31',
    isAccepted: '是 (已终验)',
    contractorUnit: 'Mellanox / 华为网络技术',
    maintenanceUnit: '数据中心网络一处',
    description: '400G QSFP-DD 链路拓展，RoCEv2 PFC/ECN 拥塞门限自动调谐',
    linkedCICount: 36,
    pmPerson: '吴刚',
    budgetAmount: '¥ 680 万',
  },
  {
    id: 'PRJ-2026-008B',
    projectCode: 'PRJ-2026-SAN08',
    name: '32G FC 光纤存储专网死锁自愈优化项目',
    constructionMode: '集中采购',
    constructionDeptKey: 'dept_net',
    constructionDeptName: '数据中心网络运维部',
    constructionDate: '2026/10/18',
    isAccepted: '是 (已终验)',
    contractorUnit: '博科 Brocade 技术组',
    maintenanceUnit: '数据中心网络二处',
    description: '存储 FC 交换机 FOS v9.1 固件热升级与光敏隔离',
    linkedCICount: 15,
    pmPerson: '吴刚',
    budgetAmount: '¥ 230 万',
  },
  {
    id: 'PRJ-2026-008C',
    projectCode: 'PRJ-2026-WAF08',
    name: '应用层 WAF 高性能防护网关建设项目',
    constructionMode: '集中采购',
    constructionDeptKey: 'dept_net',
    constructionDeptName: '数据中心网络运维部',
    constructionDate: '2026/09/25',
    isAccepted: '是 (已终验)',
    contractorUnit: '绿盟科技',
    maintenanceUnit: '网络与安全运维处',
    description: 'WAF v6.0 防火墙部署，全量阻断 SQL 注入与恶意爬虫攻击',
    linkedCICount: 10,
    pmPerson: '吴刚',
    budgetAmount: '¥ 180 万',
  },

  // 5. 信息安全与合规审计部 (dept_sec) - 2 items
  {
    id: 'PRJ-2026-009',
    projectCode: 'PRJ-2026-SEC09',
    name: 'Linux 内核 CVE-2026-8890 kpatch 补丁工程',
    constructionMode: '联合攻关',
    constructionDeptKey: 'dept_sec',
    constructionDeptName: '信息安全与合规审计部',
    constructionDate: '2026/11/01',
    isAccepted: '是 (已终验)',
    contractorUnit: 'openEuler 社区 & 安全团队',
    maintenanceUnit: '主机安全与合规处',
    description: '420 台物理服务器零重启高危漏洞热注入防护',
    linkedCICount: 420,
    pmPerson: '崔健',
    budgetAmount: '¥ 210 万',
  },
  {
    id: 'PRJ-2026-009B',
    projectCode: 'PRJ-2026-AD09',
    name: '全域活动目录 AD 域控多因子 MFA 认证升级',
    constructionMode: '联合攻关',
    constructionDeptKey: 'dept_sec',
    constructionDeptName: '信息安全与合规审计部',
    constructionDate: '2026/10/12',
    isAccepted: '是 (已终验)',
    contractorUnit: '微软安全服务团队',
    maintenanceUnit: '身份鉴权保障组',
    description: '全员 Windows/Linux 统一身份绑定与动态 OTP 强鉴权',
    linkedCICount: 25,
    pmPerson: '崔健',
    budgetAmount: '¥ 140 万',
  },

  // 6. 实时与离线计算部 (dept_compute) - 3 items
  {
    id: 'PRJ-2026-010',
    projectCode: 'PRJ-2026-KFK10',
    name: 'Apache Kafka 3.7 热点主题消息队列平衡项目',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_compute',
    constructionDeptName: '实时与离线计算部',
    constructionDate: '2026/11/03',
    isAccepted: '是 (已终验)',
    contractorUnit: '实时计算组',
    maintenanceUnit: '计算平台运维处',
    description: '跨 Broker 12 分区副本重分配，限速 50MB/s 流量无抖动切割',
    linkedCICount: 24,
    pmPerson: '马飞',
    budgetAmount: '¥ 260 万',
  },
  {
    id: 'PRJ-2026-011',
    projectCode: 'PRJ-2026-STAR11',
    name: 'StarRocks 3.2 向量化物化视图大屏建设',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_compute',
    constructionDeptName: '实时与离线计算部',
    constructionDate: '2026/10/28',
    isAccepted: '是 (已终验)',
    contractorUnit: '数据分析团队',
    maintenanceUnit: '数据大屏保障组',
    description: '28 个增量物化视图分钟级刷新，报表响应提升 12 倍',
    linkedCICount: 28,
    pmPerson: '林立',
    budgetAmount: '¥ 310 万',
  },
  {
    id: 'PRJ-2026-012',
    projectCode: 'PRJ-2026-SPK12',
    name: 'Spark 3.5 Dynamic Allocation 内存优化项目',
    constructionMode: '自主研发',
    constructionDeptKey: 'dept_compute',
    constructionDeptName: '实时与离线计算部',
    constructionDate: '2026/10/25',
    isAccepted: '否 (试运行中)',
    contractorUnit: '离线计算团队',
    maintenanceUnit: '计算平台运维处',
    description: '防止 Spark Executor OOM 瓶颈，溢写磁盘阈值策略重构',
    linkedCICount: 80,
    pmPerson: '彭涛',
    budgetAmount: '¥ 190 万',
  },
];

export const ProjectConfigView: React.FC = () => {
  // Main Projects State
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);

  // Left Tree selected node (default to 'dept_db')
  const [selectedTreeKey, setSelectedTreeKey] = useState<string>('dept_db');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    by_dept: true,
    by_mode: true,
  });

  // Dynamic computation of counts for tree nodes to ensure 100% match with right side records!
  const projectCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    projects.forEach((item) => {
      // Count by department key
      counts[item.constructionDeptKey] = (counts[item.constructionDeptKey] || 0) + 1;

      // Count by construction mode
      if (item.constructionMode === '自主研发') counts['mode_rd'] = (counts['mode_rd'] || 0) + 1;
      if (item.constructionMode === '集中采购') counts['mode_procure'] = (counts['mode_procure'] || 0) + 1;
      if (item.constructionMode === '联合攻关') counts['mode_joint'] = (counts['mode_joint'] || 0) + 1;
      if (item.constructionMode === '厂商集成') counts['mode_vendor'] = (counts['mode_vendor'] || 0) + 1;
    });
    return counts;
  }, [projects]);

  // Tree search
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Right Table search & filter
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('ALL');
  const [startDate, setStartDate] = useState<string>('2026-01-01');
  const [endDate, setEndDate] = useState<string>('2026-11-06');

  // Pagination (Strict 10 items per page limit)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [jumpPage, setJumpPage] = useState('');

  // Modals
  const [selectedProjectDetail, setSelectedProjectDetail] = useState<ProjectItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [deletingProject, setDeletingProject] = useState<ProjectItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New project state matching screenshot image_403916eb.png
  const [addProjectCode, setAddProjectCode] = useState('');
  const [addProjectName, setAddProjectName] = useState('');
  const [addConstructionMode, setAddConstructionMode] = useState('');
  const [addConstructionDept, setAddConstructionDept] = useState('');
  const [addConstructionYear, setAddConstructionYear] = useState('');
  const [addIsAccepted, setAddIsAccepted] = useState('');
  const [addAcceptanceDate, setAddAcceptanceDate] = useState('');
  const [addMaintenanceMode, setAddMaintenanceMode] = useState('');
  const [addSupervisionUnit, setAddSupervisionUnit] = useState('');
  const [addContractNo, setAddContractNo] = useState('');
  const [addBiddingDocNo, setAddBiddingDocNo] = useState('');
  const [addCompletionDocNo, setAddCompletionDocNo] = useState('');
  const [addSectionCount, setAddSectionCount] = useState('');
  const [addDeviceCount, setAddDeviceCount] = useState('');
  const [addProjectContact, setAddProjectContact] = useState('');
  const [addContactPhone, setAddContactPhone] = useState('');
  const [addProjectIntro, setAddProjectIntro] = useState('');

  // Function to reset/clear all add form fields ("数据清空")
  const resetAddProjectForm = () => {
    setAddProjectCode('');
    setAddProjectName('');
    setAddConstructionMode('');
    setAddConstructionDept('');
    setAddConstructionYear('');
    setAddIsAccepted('');
    setAddAcceptanceDate('');
    setAddMaintenanceMode('');
    setAddSupervisionUnit('');
    setAddContractNo('');
    setAddBiddingDocNo('');
    setAddCompletionDocNo('');
    setAddSectionCount('');
    setAddDeviceCount('');
    setAddProjectContact('');
    setAddContactPhone('');
    setAddProjectIntro('');
  };

  const toggleParent = (parentKey: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentKey]: !prev[parentKey],
    }));
  };

  const activeTreeInfo = useMemo(() => {
    for (const parent of PROJECT_TREE) {
      const found = parent.children.find((c) => c.key === selectedTreeKey);
      if (found) {
        return { parentLabel: parent.label, childLabel: found.label, key: found.key };
      }
    }
    return { parentLabel: '按建设处室分类', childLabel: '数据架构与数据库技术部', key: 'dept_db' };
  }, [selectedTreeKey]);

  // Filter projects based on left tree selection, dropdown filter, and search keywords
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      // Tree Filter Check
      let matchesTree = false;
      if (selectedTreeKey.startsWith('dept_')) {
        matchesTree = item.constructionDeptKey === selectedTreeKey;
      } else if (selectedTreeKey === 'mode_rd') {
        matchesTree = item.constructionMode === '自主研发';
      } else if (selectedTreeKey === 'mode_procure') {
        matchesTree = item.constructionMode === '集中采购';
      } else if (selectedTreeKey === 'mode_joint') {
        matchesTree = item.constructionMode === '联合攻关';
      } else if (selectedTreeKey === 'mode_vendor') {
        matchesTree = item.constructionMode === '厂商集成';
      } else {
        matchesTree = true;
      }

      // Construction Mode Dropdown Check
      const matchesMode = selectedMode === 'ALL' || item.constructionMode === selectedMode;

      // Search Keyword Check
      const matchesSearch =
        item.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.projectCode.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.contractorUnit.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.maintenanceUnit.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.pmPerson.toLowerCase().includes(tableSearchTerm.toLowerCase());

      // Date Range Filter
      let matchesDate = true;
      if (startDate && endDate) {
        const dateStr = item.constructionDate.replace(/\//g, '-');
        matchesDate = dateStr >= startDate && dateStr <= endDate;
      }

      return matchesTree && matchesMode && matchesSearch && matchesDate;
    });
  }, [projects, selectedTreeKey, selectedMode, tableSearchTerm, startDate, endDate]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const handleReset = () => {
    setTableSearchTerm('');
    setSelectedMode('ALL');
    setStartDate('2026-01-01');
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

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addProjectName.trim() && !addProjectCode.trim()) {
      alert('请填写必要字段（如项目编号或项目名称）');
      return;
    }

    const modeMapped: ProjectItem['constructionMode'] =
      (addConstructionMode as ProjectItem['constructionMode']) || '自主研发';

    const newId = `PRJ-2026-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: ProjectItem = {
      id: newId,
      projectCode: addProjectCode || `PRJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      name: addProjectName || `${activeTreeInfo.childLabel}工程`,
      constructionMode: modeMapped,
      constructionDeptKey: selectedTreeKey.startsWith('dept_') ? selectedTreeKey : 'dept_db',
      constructionDeptName: addConstructionDept || activeTreeInfo.childLabel,
      constructionDate: addConstructionYear || addAcceptanceDate || '2026/11/06',
      isAccepted: (addIsAccepted as ProjectItem['isAccepted']) || '是 (已终验)',
      contractorUnit: addSupervisionUnit || '全息数据基础设施处',
      maintenanceUnit: addMaintenanceMode || '全息系统运维二部',
      description: addProjectIntro || '全息基础设施系统建设项目',
      linkedCICount: addDeviceCount ? parseInt(addDeviceCount) || 12 : 12,
      pmPerson: addProjectContact || '程总工',
      budgetAmount: '¥ 260 万',
    };

    setProjects((prev) => [newItem, ...prev]);
    alert(`成功创建项目配置记录: ${newItem.name} (${newItem.projectCode})`);

    // Reset and clear all form state
    resetAddProjectForm();
    setIsAddOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans text-xs">
      {/* Left Column: Project Tree Panel */}
      <div className="w-full lg:w-64 shrink-0 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <FolderKanban className="w-4 h-4 text-cyan-400" />
            <span>项目归属分类树</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
            PMO
          </span>
        </div>

        {/* Tree Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
          <input
            type="text"
            value={treeSearchTerm}
            onChange={(e) => setTreeSearchTerm(e.target.value)}
            placeholder="搜索处室 / 模式..."
            className="w-full pl-8 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-[11px]"
          />
        </div>

        {/* Expandable Tree View with 100% Dynamic Badge Counts */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 max-h-[70vh] lg:max-h-[750px]">
          {PROJECT_TREE.map((parent) => {
            const isExpanded = expandedParents[parent.key];
            const matchesParentSearch =
              !treeSearchTerm ||
              parent.label.toLowerCase().includes(treeSearchTerm.toLowerCase()) ||
              parent.children.some((c) => c.label.toLowerCase().includes(treeSearchTerm.toLowerCase()));

            if (!matchesParentSearch) return null;

            const parentTotal = parent.children.reduce((sum, c) => sum + (projectCounts[c.key] || 0), 0);

            return (
              <div key={parent.key} className="space-y-0.5">
                {/* Parent Node */}
                <button
                  onClick={() => toggleParent(parent.key)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800/60 text-slate-200 text-xs font-semibold transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-1.5">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    {isExpanded ? (
                      <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                    ) : (
                      <Folder className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span className="group-hover:text-cyan-300 transition-colors">{parent.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-500">
                    {parentTotal}
                  </span>
                </button>

                {/* Children Nodes */}
                {isExpanded && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-800 ml-3 py-0.5">
                    {parent.children.map((child) => {
                      const isSelected = selectedTreeKey === child.key;
                      // Dynamically derived count for 100% match with right side records!
                      const actualCount = projectCounts[child.key] || 0;

                      return (
                        <button
                          key={child.key}
                          onClick={() => {
                            setSelectedTreeKey(child.key);
                            setCurrentPage(1);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-bold shadow-sm shadow-cyan-950/50'
                              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 font-medium'
                          }`}
                        >
                          <span className="truncate">{child.label}</span>
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                              isSelected ? 'bg-cyan-900 text-cyan-200' : 'bg-slate-950 text-slate-500'
                            }`}
                          >
                            {actualCount}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Dynamic Table View */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Top Search Toolbar matching image_56c732ba.png */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">项目信息配置</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-slate-400 text-xs">{activeTreeInfo.parentLabel}</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-cyan-400 font-bold text-sm">{activeTreeInfo.childLabel}</span>
            </div>
            <p className="text-xs text-slate-400">
              对应 <strong className="text-slate-200">{activeTreeInfo.childLabel}</strong> 的项目列表（共 <strong className="text-cyan-400 font-bold">{filteredProjects.length}</strong> 项，左侧树数字 100% 对应）
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[300px]">
              {/* 请输入项目编号和名称 */}
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <input
                  type="text"
                  value={tableSearchTerm}
                  onChange={(e) => {
                    setTableSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="请输入项目编号和名称"
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              </div>

              {/* 请选择建设方式 Select Dropdown */}
              <div className="w-36">
                <select
                  value={selectedMode}
                  onChange={(e) => {
                    setSelectedMode(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="ALL">请选择建设方式 (全部)</option>
                  <option value="自主研发">自主研发</option>
                  <option value="集中采购">集中采购</option>
                  <option value="联合攻关">联合攻关</option>
                  <option value="厂商集成">厂商集成</option>
                </select>
              </div>

              {/* 请选择建设年份 / 近期日期区间 */}
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

              {/* 搜索 Button */}
              <button
                onClick={() => setCurrentPage(1)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-900/30 cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                搜索
              </button>

              {/* 重置 Button */}
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                重置
              </button>
            </div>

            {/* 新增 Button Top Right */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm shadow-cyan-950/50"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              新增项目
            </button>
          </div>
        </div>

        {/* Data Table with 9 Columns matching screenshot image_56c732ba.png */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1300px]">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                  <th className="py-3 px-3 min-w-[150px] border-r border-slate-800/80 font-mono">项目编号</th>
                  <th className="py-3 px-4 min-w-[220px] border-r border-slate-800/80">项目名称</th>
                  <th className="py-3 px-3 min-w-[110px] border-r border-slate-800/80">建设方式</th>
                  <th className="py-3 px-4 min-w-[180px] border-r border-slate-800/80">建设处室</th>
                  <th className="py-3 px-3 min-w-[120px] border-r border-slate-800/80 font-mono">建设年份</th>
                  <th className="py-3 px-3 min-w-[120px] border-r border-slate-800/80 text-center">是否验收</th>
                  <th className="py-3 px-4 min-w-[170px] border-r border-slate-800/80">承建单位</th>
                  <th className="py-3 px-4 min-w-[170px] border-r border-slate-800/80">维护单位</th>
                  <th className="py-3 px-4 text-center min-w-[160px] sticky right-0 bg-slate-950 border-l border-slate-800 shadow-l">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
                {paginatedProjects.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                      暂无属于 [{activeTreeInfo.childLabel}] 的真实项目配置数据
                    </td>
                  </tr>
                ) : (
                  paginatedProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-slate-800/50 transition-colors group">
                      {/* 项目编号 */}
                      <td className="py-3 px-3 font-mono text-cyan-400 font-semibold border-r border-slate-800/60">
                        {project.projectCode}
                      </td>

                      {/* 项目名称 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        <div className="space-y-0.5">
                          <div>{project.name}</div>
                          <div className="text-[10px] text-slate-500 font-sans font-normal">{project.description}</div>
                        </div>
                      </td>

                      {/* 建设方式 */}
                      <td className="py-3 px-3 border-r border-slate-800/60">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                            project.constructionMode === '自主研发'
                              ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
                              : project.constructionMode === '集中采购'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-800'
                              : project.constructionMode === '联合攻关'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          {project.constructionMode}
                        </span>
                      </td>

                      {/* 建设处室 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-200">
                        {project.constructionDeptName}
                      </td>

                      {/* 建设年份 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 font-mono text-slate-300">
                        {project.constructionDate}
                      </td>

                      {/* 是否验收 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-[10px] border ${
                            project.isAccepted.includes('已终验')
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                              : project.isAccepted.includes('阶段验收')
                              ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                              : 'bg-rose-950/80 text-rose-400 border-rose-800'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          {project.isAccepted}
                        </span>
                      </td>

                      {/* 承建单位 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300">
                        {project.contractorUnit}
                      </td>

                      {/* 维护单位 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300">
                        {project.maintenanceUnit}
                      </td>

                      {/* 操作 */}
                      <td className="py-3 px-4 text-center sticky right-0 bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 shadow-l whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => setEditingProject(project)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            修改
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setSelectedProjectDetail(project)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            查看详情
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setDeletingProject(project)}
                            className="text-rose-400 hover:text-rose-300 hover:underline transition-colors cursor-pointer"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* High-Precision Pagination Toolbar */}
          <div className="p-3 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span>
                分类 [<strong className="text-cyan-400 font-bold">{activeTreeInfo.childLabel}</strong>] 共 <strong className="text-cyan-400 font-bold">{filteredProjects.length}</strong> 个项目 （左侧数字 100% 对应）
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
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded font-mono font-semibold transition-colors cursor-pointer ${
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
                  className="p-1.5 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
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
      </div>

      {/* Detail Modal */}
      {selectedProjectDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm">项目属性详情 - {selectedProjectDetail.name}</h3>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{selectedProjectDetail.projectCode}</span>
              </div>
              <button onClick={() => setSelectedProjectDetail(null)} className="p-1 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div><span className="text-slate-500 block">项目名称:</span><strong className="text-slate-100">{selectedProjectDetail.name}</strong></div>
                <div><span className="text-slate-500 block">建设方式:</span><strong className="text-cyan-400 font-semibold">{selectedProjectDetail.constructionMode}</strong></div>
                <div><span className="text-slate-500 block">建设处室:</span><strong className="text-slate-200">{selectedProjectDetail.constructionDeptName}</strong></div>
                <div><span className="text-slate-500 block">建设年份 / 日期:</span><strong className="text-slate-200 font-mono">{selectedProjectDetail.constructionDate}</strong></div>
                <div><span className="text-slate-500 block">承建单位:</span><strong className="text-slate-200">{selectedProjectDetail.contractorUnit}</strong></div>
                <div><span className="text-slate-500 block">维护单位:</span><strong className="text-slate-200">{selectedProjectDetail.maintenanceUnit}</strong></div>
                <div><span className="text-slate-500 block">验收状态:</span><strong className="text-emerald-400">{selectedProjectDetail.isAccepted}</strong></div>
                <div><span className="text-slate-500 block">项目 PM / 预算:</span><strong className="text-slate-200">{selectedProjectDetail.pmPerson} ({selectedProjectDetail.budgetAmount})</strong></div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block font-semibold">项目目标与建设说明:</span>
                <p className="text-slate-200 leading-relaxed">{selectedProjectDetail.description}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSelectedProjectDetail(null)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold">
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100">修改项目配置 - {editingProject.projectCode}</h3>
              <button onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">项目名称</label>
                <input
                  type="text"
                  defaultValue={editingProject.name}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">承建单位</label>
                  <input
                    type="text"
                    defaultValue={editingProject.contractorUnit}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">维护单位</label>
                  <input
                    type="text"
                    defaultValue={editingProject.maintenanceUnit}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">建设说明</label>
                <textarea
                  defaultValue={editingProject.description}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setEditingProject(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                取消
              </button>
              <button
                onClick={() => {
                  alert(`项目记录 [${editingProject.name}] 修改保存成功！`);
                  setEditingProject(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 text-white font-semibold"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingProject && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#002b49] border border-rose-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            {/* Header */}
            <div className="px-5 py-3 bg-[#001e36] border-b border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>确认删除项目信息配置</span>
              </div>
              <button
                onClick={() => setDeletingProject(null)}
                className="text-slate-400 hover:text-white font-bold text-base p-1"
              >
                X
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要彻底删除项目记录 <strong className="text-cyan-300 font-semibold">{deletingProject.name}</strong> 吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">项目编号:</span> {deletingProject.projectCode}</div>
                <div><span className="text-slate-500">建设处室:</span> {deletingProject.constructionDeptName}</div>
                <div><span className="text-slate-500">建设方式:</span> {deletingProject.constructionMode}</div>
              </div>
              <p className="text-rose-400/90 text-[11px] font-medium">
                ⚠️ 注意：此操作不可撤销，删除后该项目关联的资产基线映射将归零注销！
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button
                onClick={() => setDeletingProject(null)}
                className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setProjects((prev) => prev.filter((p) => p.id !== deletingProject.id));
                  alert(`已成功注销删除项目配置: ${deletingProject.name}`);
                  setDeletingProject(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 transition-colors cursor-pointer"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal matching screenshot image_403916eb.png */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            {/* Title Bar */}
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm tracking-wide">新增</h3>
              <button
                onClick={() => {
                  resetAddProjectForm();
                  setIsAddOpen(false);
                }}
                className="text-cyan-400 hover:text-white font-bold text-base transition-colors p-1"
              >
                X
              </button>
            </div>

            {/* Form Content */}
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              {/* 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3.5">
                {/* Row 1 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>项目编号:
                  </label>
                  <input
                    type="text"
                    value={addProjectCode}
                    onChange={(e) => setAddProjectCode(e.target.value)}
                    placeholder="请输入项目编号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>项目名称:
                  </label>
                  <input
                    type="text"
                    value={addProjectName}
                    onChange={(e) => setAddProjectName(e.target.value)}
                    placeholder="请输入项目名称"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>建设方式:
                  </label>
                  <input
                    type="text"
                    value={addConstructionMode}
                    onChange={(e) => setAddConstructionMode(e.target.value)}
                    placeholder="请输入建设方式"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>建设处室:
                  </label>
                  <input
                    type="text"
                    value={addConstructionDept}
                    onChange={(e) => setAddConstructionDept(e.target.value)}
                    placeholder="请输入建设处室"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>建设年份:
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={addConstructionYear}
                      onChange={(e) => setAddConstructionYear(e.target.value)}
                      placeholder="请选择建设年份"
                      className="w-full bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 pr-8 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-cyan-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>是否验收:
                  </label>
                  <select
                    value={addIsAccepted}
                    onChange={(e) => setAddIsAccepted(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="" disabled>请选择是否验收</option>
                    <option value="是 (已终验)">是 (已终验)</option>
                    <option value="是 (阶段验收)">是 (阶段验收)</option>
                    <option value="否 (试运行中)">否 (试运行中)</option>
                  </select>
                </div>

                {/* Row 4 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>验收日期:
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={addAcceptanceDate}
                      onChange={(e) => setAddAcceptanceDate(e.target.value)}
                      placeholder="请选择验收日期"
                      className="w-full bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 pr-8 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                    />
                    <Calendar className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-cyan-400 pointer-events-none" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>维护方式:
                  </label>
                  <input
                    type="text"
                    value={addMaintenanceMode}
                    onChange={(e) => setAddMaintenanceMode(e.target.value)}
                    placeholder="请输入维护方式"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 5 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    监理单位:
                  </label>
                  <input
                    type="text"
                    value={addSupervisionUnit}
                    onChange={(e) => setAddSupervisionUnit(e.target.value)}
                    placeholder="请输入监理单位"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    合同编号:
                  </label>
                  <input
                    type="text"
                    value={addContractNo}
                    onChange={(e) => setAddContractNo(e.target.value)}
                    placeholder="请输入合同编号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Row 6 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    招标文件编号:
                  </label>
                  <input
                    type="text"
                    value={addBiddingDocNo}
                    onChange={(e) => setAddBiddingDocNo(e.target.value)}
                    placeholder="请输入招标文件编号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    竣工资料编号:
                  </label>
                  <input
                    type="text"
                    value={addCompletionDocNo}
                    onChange={(e) => setAddCompletionDocNo(e.target.value)}
                    placeholder="请输入竣工资料编号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Row 7 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    断面数:
                  </label>
                  <input
                    type="text"
                    value={addSectionCount}
                    onChange={(e) => setAddSectionCount(e.target.value)}
                    placeholder="请输入断面数"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    设备数:
                  </label>
                  <input
                    type="text"
                    value={addDeviceCount}
                    onChange={(e) => setAddDeviceCount(e.target.value)}
                    placeholder="请输入设备数"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 8 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    项目联系人:
                  </label>
                  <input
                    type="text"
                    value={addProjectContact}
                    onChange={(e) => setAddProjectContact(e.target.value)}
                    placeholder="请输入项目联系人"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    联系方式:
                  </label>
                  <input
                    type="text"
                    value={addContactPhone}
                    onChange={(e) => setAddContactPhone(e.target.value)}
                    placeholder="请输入联系方式"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Row 9: Project Intro (Full Width) */}
              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">
                  项目介绍:
                </label>
                <textarea
                  value={addProjectIntro}
                  onChange={(e) => setAddProjectIntro(e.target.value)}
                  placeholder="请输入项目介绍"
                  rows={3}
                  className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded p-2.5 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Footer Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/60">
                <button
                  type="button"
                  onClick={() => {
                    resetAddProjectForm();
                    setIsAddOpen(false);
                  }}
                  className="px-5 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-[#0082c8] hover:bg-[#0092e0] text-white font-semibold shadow-md shadow-cyan-950/50 transition-colors cursor-pointer"
                >
                  保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
