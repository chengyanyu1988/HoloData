import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Upload,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  Server,
  Network,
  Database,
  Cpu,
  Layers,
  HardDrive,
  Globe,
  Radio,
  Edit3,
  Eye,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Folder,
  FolderOpen,
  Sliders,
  RefreshCw,
  Building,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export interface CIDeviceItem {
  id: string;
  categoryKey: string; // e.g. 'net_switch', 'net_firewall', 'rfid_antenna', 'rfid_gateway', 'srv_physical', 'srv_gpu', 'os_euleros', 'os_win', 'container_pod', 'web_nginx', 'web_tomcat', 'msg_kafka', 'msg_rocketmq', 'cache_redis', 'db_pg', 'db_clickhouse'
  name: string;
  type: string;
  vendor: string;
  serialNumber: string;
  version: string;
  systemInfo: string;
  ipAddress: string;
  description: string;
  updatedAt: string;
  status: 'online' | 'maintenance' | 'warning';
  location: string;
  ownerPerson: string;
  ownerDept: string;
}

export interface CategoryNode {
  key: string;
  label: string;
  iconName: string;
  children?: {
    key: string;
    label: string;
  }[];
}

const CATEGORY_TREE: CategoryNode[] = [
  {
    key: 'net',
    label: '网络设备',
    iconName: 'Network',
    children: [
      { key: 'net_switch', label: '交换机' },
      { key: 'net_firewall', label: '防火墙' },
    ],
  },
  {
    key: 'rfid',
    label: 'RFID交通设备',
    iconName: 'Radio',
    children: [
      { key: 'rfid_antenna', label: '读写天线' },
      { key: 'rfid_gateway', label: '边缘网关' },
    ],
  },
  {
    key: 'srv',
    label: '服务器',
    iconName: 'Server',
    children: [
      { key: 'srv_physical', label: '物理服务器' },
      { key: 'srv_gpu', label: 'GPU算力服务器' },
    ],
  },
  {
    key: 'os',
    label: '操作系统',
    iconName: 'Cpu',
    children: [
      { key: 'os_euleros', label: 'openEuler / Linux' },
      { key: 'os_win', label: 'Windows Server' },
    ],
  },
  {
    key: 'container',
    label: '容器',
    iconName: 'Layers',
    children: [
      { key: 'container_pod', label: 'K8s Pod & 工作负载' },
    ],
  },
  {
    key: 'mw_web',
    label: 'Web中间件',
    iconName: 'Globe',
    children: [
      { key: 'web_nginx', label: 'Nginx / Ingress 网关' },
      { key: 'web_tomcat', label: 'Tomcat / Spring Boot' },
    ],
  },
  {
    key: 'mw_msg',
    label: '消息中间件',
    iconName: 'Sliders',
    children: [
      { key: 'msg_kafka', label: 'Apache Kafka' },
      { key: 'msg_rocketmq', label: 'RocketMQ' },
    ],
  },
  {
    key: 'mw_cache',
    label: '缓存中间件',
    iconName: 'HardDrive',
    children: [
      { key: 'cache_redis', label: 'Redis 7.2 集群' },
    ],
  },
  {
    key: 'db',
    label: '数据库',
    iconName: 'Database',
    children: [
      { key: 'db_pg', label: 'PostgreSQL 16' },
      { key: 'db_clickhouse', label: 'ClickHouse / Doris' },
    ],
  },
];

// Rich, high-fidelity mock data strictly mapped to categories
const INITIAL_CI_DEVICES: CIDeviceItem[] = [
  // 1. 网络设备 -> 交换机 (net_switch) - 3 items
  {
    id: 'CI-NET-SW-01',
    categoryKey: 'net_switch',
    name: 'Spine-Switch-01 (400G 无损交换机)',
    type: '400G 核心 Spine 交换机',
    vendor: 'Mellanox / Arista',
    serialNumber: 'SN-400G-20261105001',
    version: 'Arista EOS 4.28.1F',
    systemInfo: '核心网络 / A01 机柜',
    ipAddress: '10.120.0.1',
    description: '48 x 400G QSFP-DD 端口，开启 RoCEv2 PFC/ECN 无损转发',
    updatedAt: '2026/11/05 15:40:12',
    status: 'online',
    location: '华东数据中心 A01 柜 U20',
    ownerPerson: '吴刚',
    ownerDept: '网络运维部',
  },
  {
    id: 'CI-NET-SW-02',
    categoryKey: 'net_switch',
    name: 'Leaf-Switch-02 (100G 汇聚交换机)',
    type: '100G 柜顶 Leaf 交换机',
    vendor: 'Huawei CloudEngine',
    serialNumber: 'SN-100G-20261105002',
    version: 'V200R019C10',
    systemInfo: '核心网络 / B04 机柜',
    ipAddress: '10.120.0.12',
    description: '32 x 100G QSFP28 端口，高密度双电源冗余供电',
    updatedAt: '2026/11/05 14:10:05',
    status: 'online',
    location: '华东数据中心 B04 柜 U42',
    ownerPerson: '吴刚',
    ownerDept: '网络运维部',
  },
  {
    id: 'CI-NET-SW-03',
    categoryKey: 'net_switch',
    name: 'Storage-SAN-Switch-03 (32G 光纤交换机)',
    type: '32G FC 存储专网交换机',
    vendor: 'Brocade / Broadcom',
    serialNumber: 'SN-FC32-20261104003',
    version: 'FOS v9.1.1b',
    systemInfo: '存储专网 / C01 机柜',
    ipAddress: '10.120.200.5',
    description: '核心 SAN 存储网络专网，硬件光敏死锁自愈',
    updatedAt: '2026/11/04 18:20:00',
    status: 'online',
    location: '华东数据中心 C01 柜 U15',
    ownerPerson: '高峰',
    ownerDept: '存储基础设施部',
  },

  // 2. 网络设备 -> 防火墙 (net_firewall) - 3 items
  {
    id: 'CI-NET-FW-01',
    categoryKey: 'net_firewall',
    name: 'Border-Firewall-01 (下一代边界防火墙)',
    type: '100G 硬件 NGFW 防火墙',
    vendor: 'Palo Alto Networks',
    serialNumber: 'SN-FW100-20261105010',
    version: 'PAN-OS 10.2.4',
    systemInfo: '互联网出口 / 安全防护区',
    ipAddress: '10.120.254.1',
    description: 'DDoS 深度防御与零信任微隔离策略，吞吐 120Gbps',
    updatedAt: '2026/11/05 16:00:00',
    status: 'online',
    location: '边界安全机柜 SEC-01',
    ownerPerson: '崔健',
    ownerDept: '信息安全部',
  },
  {
    id: 'CI-NET-FW-02',
    categoryKey: 'net_firewall',
    name: 'Internal-Firewall-02 (核心内网隔离防火墙)',
    type: '万兆内网分布式防火墙',
    vendor: 'Fortinet FortiGate',
    serialNumber: 'SN-FW10-20261104011',
    version: 'FortiOS v7.4.2',
    systemInfo: '数据中心核心内网区',
    ipAddress: '10.120.254.2',
    description: '核心数据库与业务网段间 IPS 深度防护与状态检测',
    updatedAt: '2026/11/04 11:30:00',
    status: 'online',
    location: '核心安全机柜 SEC-02',
    ownerPerson: '崔健',
    ownerDept: '信息安全部',
  },
  {
    id: 'CI-NET-FW-03',
    categoryKey: 'net_firewall',
    name: 'WAF-Gateway-03 (应用层 Web 防火墙)',
    type: 'WAF 应用防火墙集群',
    vendor: 'NSFOCUS / 绿盟',
    serialNumber: 'SN-WAF-20261103012',
    version: 'WAF v6.0.8',
    systemInfo: '应用网关区',
    ipAddress: '10.120.254.10',
    description: '防止 SQL 注入、XSS 与 API 越权恶意攻防检测',
    updatedAt: '2026/11/03 15:10:00',
    status: 'online',
    location: '边界网关机柜 SEC-03',
    ownerPerson: '崔健',
    ownerDept: '信息安全部',
  },

  // 3. RFID交通设备 -> 读写天线 (rfid_antenna) - 3 items
  {
    id: 'CI-RFID-ANT-01',
    categoryKey: 'rfid_antenna',
    name: '工业级 RFID 04 阵列天线 (2号产线)',
    type: '超高频 UHF 四通道读写天线',
    vendor: 'Impinj / Zebra',
    serialNumber: 'SN-UHF-20261105101',
    version: 'Firmware v4.12.0',
    systemInfo: '物联仓储 / 2号自动产线',
    ipAddress: '192.168.10.45',
    description: '天线驻波比 1.15，防爆等级 IP67，支持 1000 Tag/s 捕获',
    updatedAt: '2026/11/05 11:20:45',
    status: 'online',
    location: '物联自动化库房 02 通道',
    ownerPerson: '李建',
    ownerDept: '边缘智能组',
  },
  {
    id: 'CI-RFID-ANT-02',
    categoryKey: 'rfid_antenna',
    name: '激光赋码读写天线 (1号通道)',
    type: '高频 HF / 激光双基频天线',
    vendor: 'Siemens / Turck',
    serialNumber: 'SN-HF-20261104102',
    version: 'Firmware v3.08.2',
    systemInfo: '物联仓储 / 1号装配线',
    ipAddress: '192.168.10.46',
    description: '高精度感应范围 0.5m，配合激光喷码机秒级同步',
    updatedAt: '2026/11/04 16:30:10',
    status: 'online',
    location: '物联自动化库房 01 通道',
    ownerPerson: '李建',
    ownerDept: '边缘智能组',
  },
  {
    id: 'CI-RFID-ANT-03',
    categoryKey: 'rfid_antenna',
    name: '物流门禁托盘识读天线 (3号出入口)',
    type: '长距离 UHF 阵列相位天线',
    vendor: 'Honeywell / Impinj',
    serialNumber: 'SN-UHF-20261103103',
    version: 'Firmware v4.14.1',
    systemInfo: '智能物流门禁',
    ipAddress: '192.168.10.47',
    description: '托盘标签批量穿透识别，双频冗余校准',
    updatedAt: '2026/11/03 09:15:00',
    status: 'online',
    location: '物流枢纽大门 03 闸口',
    ownerPerson: '李建',
    ownerDept: '边缘智能组',
  },

  // 4. RFID交通设备 -> 边缘网关 (rfid_gateway) - 3 items
  {
    id: 'CI-RFID-GW-01',
    categoryKey: 'rfid_gateway',
    name: '边缘 IoT 智能解析网关 GW-01',
    type: '工业级 ARM 8核边缘网关',
    vendor: 'Advantech / 研华',
    serialNumber: 'SN-GW-20261105201',
    version: 'EdgeOS v2.4.1',
    systemInfo: '边缘节点 / 仓储网关区',
    ipAddress: '192.168.10.1',
    description: '本地 MQTT / OPC-UA 协议转译，内嵌 Lite-SQLite 缓存',
    updatedAt: '2026/11/05 10:15:30',
    status: 'online',
    location: '仓储控制配电柜 GW-A',
    ownerPerson: '赵明',
    ownerDept: '边缘智能组',
  },
  {
    id: 'CI-RFID-GW-02',
    categoryKey: 'rfid_gateway',
    name: '车载定位边缘网关 GW-02',
    type: '5G / GPS 车载工业网关',
    vendor: 'InHand / 映翰通',
    serialNumber: 'SN-GW-20261104202',
    version: 'InOS v3.1.2',
    systemInfo: 'AGV 自动引导车网络',
    ipAddress: '192.168.10.2',
    description: 'AGV 运行姿态遥测与防碰撞毫米波雷达串口接入',
    updatedAt: '2026/11/04 14:00:00',
    status: 'online',
    location: 'AGV 充电基站控制区',
    ownerPerson: '赵明',
    ownerDept: '边缘智能组',
  },
  {
    id: 'CI-RFID-GW-03',
    categoryKey: 'rfid_gateway',
    name: '环境温湿度 IoT 边缘采集网关 GW-03',
    type: 'LoRaWAN 工业采集网关',
    vendor: 'Moxa / 摩莎',
    serialNumber: 'SN-GW-20261103203',
    version: 'ThingsPro v2.0',
    systemInfo: '冷链仓储监测',
    ipAddress: '192.168.10.3',
    description: '机房与冷库多传感器高频采样，毫秒级异常告警',
    updatedAt: '2026/11/03 11:20:00',
    status: 'online',
    location: '冷链库房配电间',
    ownerPerson: '赵明',
    ownerDept: '边缘智能组',
  },

  // 5. 服务器 -> 物理服务器 (srv_physical) - 3 items
  {
    id: 'CI-SRV-PHY-01',
    categoryKey: 'srv_physical',
    name: 'DB-Node-01 (裸金属物理服务器)',
    type: '2U 四路物理服务器',
    vendor: 'Inspur / 浪潮',
    serialNumber: 'SN-SRV-20261105301',
    version: 'openEuler 22.03 LTS SP3',
    systemInfo: '核心数据库区 / A02 机柜',
    ipAddress: '10.120.99.15',
    description: 'Intel Xeon 8480+ 112核，512GB RAM，NVMe PCIe 5.0 RAID',
    updatedAt: '2026/11/05 15:32:18',
    status: 'online',
    location: '华东数据中心 A02 柜 U10',
    ownerPerson: '周峻峰',
    ownerDept: '数据服务部',
  },
  {
    id: 'CI-SRV-PHY-02',
    categoryKey: 'srv_physical',
    name: 'Storage-Worker-02 (高密度计算节点)',
    type: '1U 双路通用服务器',
    vendor: 'Dell PowerEdge R760',
    serialNumber: 'SN-SRV-20261104302',
    version: 'Linux Kernel 6.6.21',
    systemInfo: '大数据计算区 / B01 机柜',
    ipAddress: '10.120.44.101',
    description: '256GB ECC DDR5，双 25G 光纤网卡，带外 BMC 管理',
    updatedAt: '2026/11/04 17:00:00',
    status: 'online',
    location: '华东数据中心 B01 柜 U18',
    ownerPerson: '郭涛',
    ownerDept: '基础设施部',
  },
  {
    id: 'CI-SRV-PHY-03',
    categoryKey: 'srv_physical',
    name: 'K8s-Master-Node-03 (管理平面服务器)',
    type: '1U 双路微模块服务器',
    vendor: 'H3C UniServer R4900',
    serialNumber: 'SN-SRV-20261103303',
    version: 'openEuler 22.03 LTS',
    systemInfo: '容器控制平面',
    ipAddress: '10.120.44.102',
    description: 'etcd 高可用三节点之一，NVMe 极速写入保护',
    updatedAt: '2026/11/03 13:40:00',
    status: 'online',
    location: '华东数据中心 B01 柜 U20',
    ownerPerson: '刘洋',
    ownerDept: '基础设施部',
  },

  // 6. 服务器 -> GPU算力服务器 (srv_gpu) - 3 items
  {
    id: 'CI-SRV-GPU-01',
    categoryKey: 'srv_gpu',
    name: 'AI-Cluster-GPU-01 (8卡 NVLink 服务器)',
    type: '4U 8x H800 GPU 服务器',
    vendor: 'NVIDIA / Inspur',
    serialNumber: 'SN-GPU-20261105401',
    version: 'CUDA 12.4 / Driver 550',
    systemInfo: 'AI 算力机房 / GPU-A1 机柜',
    ipAddress: '10.120.210.10',
    description: '8x H800 80GB NVLink 总线，400G RoCEv2 双口网卡直连',
    updatedAt: '2026/11/05 12:00:00',
    status: 'online',
    location: 'AI 算力区 A1 柜 U01-U04',
    ownerPerson: '程总工',
    ownerDept: '技术委员会',
  },
  {
    id: 'CI-SRV-GPU-02',
    categoryKey: 'srv_gpu',
    name: 'AI-Cluster-GPU-02 (8卡 A800 训练节点)',
    type: '4U 8x A800 GPU 服务器',
    vendor: 'NVIDIA / Sugon',
    serialNumber: 'SN-GPU-20261104402',
    version: 'CUDA 12.2 / Driver 535',
    systemInfo: 'AI 算力机房 / GPU-A2 机柜',
    ipAddress: '10.120.210.11',
    description: '8x A800 80GB 显存，针对大语言模型与多模态预训练',
    updatedAt: '2026/11/04 15:20:00',
    status: 'online',
    location: 'AI 算力区 A2 柜 U01-U04',
    ownerPerson: '程总工',
    ownerDept: '技术委员会',
  },
  {
    id: 'CI-SRV-GPU-03',
    categoryKey: 'srv_gpu',
    name: 'Vision-Infer-GPU-03 (推理渲染服务器)',
    type: '2U 4x L40S 推理服务器',
    vendor: 'NVIDIA / Gigabyte',
    serialNumber: 'SN-GPU-20261103403',
    version: 'CUDA 12.3 / TensorRT 10.0',
    systemInfo: '视觉分析与边缘推理',
    ipAddress: '10.120.210.20',
    description: '用于工业检测视频流秒级并发特征提取',
    updatedAt: '2026/11/03 10:10:00',
    status: 'online',
    location: 'AI 算力区 B1 柜 U10',
    ownerPerson: '程总工',
    ownerDept: '技术委员会',
  },

  // 7. 操作系统 -> openEuler / Linux (os_euleros) - 3 items
  {
    id: 'CI-OS-LNX-01',
    categoryKey: 'os_euleros',
    name: 'openEuler 22.03 LTS SP3 核心内核实例',
    type: '企业级 Linux 操作系统',
    vendor: 'openEuler 社区 / 华为',
    serialNumber: 'SN-OS-20261105501',
    version: 'Kernel 5.10.0-182.0.0',
    systemInfo: '生产全域物理机 / 虚拟机',
    ipAddress: '10.120.99.15',
    description: '开启 kpatch 热补丁 CVE-2026-8890 防护，上下文切换消耗 < 1%',
    updatedAt: '2026/11/05 15:32:18',
    status: 'online',
    location: '虚拟化集群 / 物理宿主机',
    ownerPerson: '崔健',
    ownerDept: '系统运维部',
  },
  {
    id: 'CI-OS-LNX-02',
    categoryKey: 'os_euleros',
    name: 'Ubuntu 24.04 LTS Server 内核实例',
    type: 'AI 计算专用 Linux',
    vendor: 'Canonical / Ubuntu',
    serialNumber: 'SN-OS-20261104502',
    version: 'Kernel 6.8.0-31-generic',
    systemInfo: 'GPU 算力集群操作系统',
    ipAddress: '10.120.210.10',
    description: '深度整合 NVIDIA GDS (GPU Direct Storage) 驱动链',
    updatedAt: '2026/11/04 11:00:00',
    status: 'online',
    location: 'GPU 算力物理节点',
    ownerPerson: '崔健',
    ownerDept: '系统运维部',
  },
  {
    id: 'CI-OS-LNX-03',
    categoryKey: 'os_euleros',
    name: 'Red Hat Enterprise Linux 9.4 实例',
    type: '商业级 Enterprise Linux',
    vendor: 'Red Hat / IBM',
    serialNumber: 'SN-OS-20261103503',
    version: 'Kernel 5.14.0-427.13.1',
    systemInfo: '金融交易核心节点',
    ipAddress: '10.120.99.20',
    description: '增强型 SELinux 强制访问控制与 FIPS 140-3 合规',
    updatedAt: '2026/11/03 09:30:00',
    status: 'online',
    location: '核心物理服务器区',
    ownerPerson: '崔健',
    ownerDept: '系统运维部',
  },

  // 8. 操作系统 -> Windows Server (os_win) - 2 items
  {
    id: 'CI-OS-WIN-01',
    categoryKey: 'os_win',
    name: 'Windows Server 2022 Datacenter AD 域控',
    type: '企业级 Windows 操作系统',
    vendor: 'Microsoft',
    serialNumber: 'SN-WIN-20261105510',
    version: 'Build 20348.2402',
    systemInfo: '活动目录中心 AD-01',
    ipAddress: '10.120.5.10',
    description: '域控制器与 LDAP 身份鉴权，多因子 MFA 策略绑定',
    updatedAt: '2026/11/05 08:30:00',
    status: 'online',
    location: '管理区机柜 MGMT-01',
    ownerPerson: '崔健',
    ownerDept: '系统运维部',
  },
  {
    id: 'CI-OS-WIN-02',
    categoryKey: 'os_win',
    name: 'Windows Server 2019 Exchange 邮件网关',
    type: '邮件与协作服务器 OS',
    vendor: 'Microsoft',
    serialNumber: 'SN-WIN-20261104511',
    version: 'Build 17763.5696',
    systemInfo: '办公协作网关',
    ipAddress: '10.120.5.20',
    description: 'TLS 1.3 传输加密与反垃圾邮件隔离引擎',
    updatedAt: '2026/11/04 10:20:00',
    status: 'online',
    location: '管理区机柜 MGMT-02',
    ownerPerson: '崔健',
    ownerDept: '系统运维部',
  },

  // 9. 容器 -> K8s Pod (container_pod) - 3 items
  {
    id: 'CI-CON-POD-01',
    categoryKey: 'container_pod',
    name: 'Cilium eBPF CNI DaemonSet 工作负载',
    type: 'Kubernetes Pod 集群组件',
    vendor: 'Cilium / CNCF',
    serialNumber: 'SN-POD-20261104601',
    version: 'Cilium v1.15.2',
    systemInfo: 'K8s 生产集群 / Cilium 命名空间',
    ipAddress: '10.244.0.1 (Pod CIDR)',
    description: 'eBPF 套接字加速与微隔离策略，无丢包负载打散',
    updatedAt: '2026/11/04 18:45:10',
    status: 'online',
    location: 'K8s 64 Worker 节点',
    ownerPerson: '刘洋',
    ownerDept: '云原生组',
  },
  {
    id: 'CI-CON-POD-02',
    categoryKey: 'container_pod',
    name: 'CoreDNS 1.11 高可用域名解析 Pod',
    type: 'Kubernetes 系统 DNS 负载',
    vendor: 'CoreDNS / CNCF',
    serialNumber: 'SN-POD-20261103602',
    version: 'CoreDNS 1.11.1',
    systemInfo: 'K8s 生产集群 / kube-system',
    ipAddress: '10.244.0.10',
    description: '自动缓存服务发现与全局节点存根域名热下发',
    updatedAt: '2026/11/03 14:10:00',
    status: 'online',
    location: 'K8s 基础服务',
    ownerPerson: '刘洋',
    ownerDept: '云原生组',
  },
  {
    id: 'CI-CON-POD-03',
    categoryKey: 'container_pod',
    name: 'Prometheus-Node-Exporter 探针 StatefulSet',
    type: '容器遥测指标采集 Pod',
    vendor: 'Prometheus / CNCF',
    serialNumber: 'SN-POD-20261102603',
    version: 'v1.8.0',
    systemInfo: 'K8s 生产集群 / monitoring',
    ipAddress: '10.244.0.15',
    description: '实时采集物理机 CPU/内存/磁盘 I/O 遥测数据',
    updatedAt: '2026/11/02 16:30:00',
    status: 'online',
    location: 'K8s 全量 Worker',
    ownerPerson: '刘洋',
    ownerDept: '云原生组',
  },

  // 10. Web中间件 -> Nginx / Ingress 网关 (web_nginx) - 3 items
  {
    id: 'CI-MW-WEB-01',
    categoryKey: 'web_nginx',
    name: 'Nginx 1.26 高性能反向代理网关',
    type: 'HTTP / HTTPS 统一接入网关',
    vendor: 'F5 / Nginx OpenSource',
    serialNumber: 'SN-NGX-20261101701',
    version: 'Nginx 1.26.0 (Brotli Enabled)',
    systemInfo: '接入网关区 / DMZ 机房',
    ipAddress: '10.120.1.10:443',
    description: '支持 Brotli 动态压缩与 HTTP/3 QUIC，首屏响应耗时 0.3s',
    updatedAt: '2026/11/01 14:15:05',
    status: 'online',
    location: 'DMZ 网关柜 GW-01',
    ownerPerson: '周蕾',
    ownerDept: '体验架构部',
  },
  {
    id: 'CI-MW-WEB-02',
    categoryKey: 'web_nginx',
    name: 'Kubernetes Ingress-Nginx Controller',
    type: '集群入口流量路由控制器',
    vendor: 'Kubernetes Community',
    serialNumber: 'SN-NGX-20261031702',
    version: 'v1.10.1',
    systemInfo: 'K8s 边缘接入层',
    ipAddress: '10.120.1.12:80',
    description: '灰度发布与 Canary 权重流转控制器',
    updatedAt: '2026/10/31 09:20:00',
    status: 'online',
    location: 'DMZ 网关柜 GW-02',
    ownerPerson: '周蕾',
    ownerDept: '体验架构部',
  },
  {
    id: 'CI-MW-WEB-03',
    categoryKey: 'web_nginx',
    name: 'OpenResty 动态 Lua 认证网关',
    type: 'Lua 规则安全过滤网关',
    vendor: 'OpenResty Inc.',
    serialNumber: 'SN-NGX-20261030703',
    version: 'OpenResty 1.25.3.1',
    systemInfo: 'API 安全关口',
    ipAddress: '10.120.1.15:443',
    description: 'JWT 签名热校验与 API 限流熔断防护',
    updatedAt: '2026/10/30 17:40:00',
    status: 'online',
    location: 'DMZ 网关柜 GW-03',
    ownerPerson: '周蕾',
    ownerDept: '体验架构部',
  },

  // 11. Web中间件 -> Tomcat / Spring Boot (web_tomcat) - 2 items
  {
    id: 'CI-MW-TMC-01',
    categoryKey: 'web_tomcat',
    name: 'Spring Boot 3.2 交易中间件容器',
    type: 'Java 应用微服务容器',
    vendor: 'Apache Tomcat / Spring',
    serialNumber: 'SN-TMC-20261102710',
    version: 'Tomcat 10.1 / JDK 21',
    systemInfo: '核心应用集群',
    ipAddress: '10.120.20.10:8080',
    description: '支持 ZGC 低延迟垃圾回收，JVM 堆内存 16GB 优配',
    updatedAt: '2026/11/02 11:00:00',
    status: 'online',
    location: '应用服务器区 APP-01',
    ownerPerson: '韩伟',
    ownerDept: '中间件组',
  },
  {
    id: 'CI-MW-TMC-02',
    categoryKey: 'web_tomcat',
    name: 'Apache Tomcat 9.0 运营报表服务',
    type: 'Servlet WEB 应用容器',
    vendor: 'Apache Software Foundation',
    serialNumber: 'SN-TMC-20261029711',
    version: 'Tomcat 9.0.88',
    systemInfo: '运营分析集群',
    ipAddress: '10.120.20.15:8080',
    description: '异步 I/O NIO2 模式，并发连接池 2000 处理能力',
    updatedAt: '2026/10/29 15:30:00',
    status: 'online',
    location: '应用服务器区 APP-02',
    ownerPerson: '韩伟',
    ownerDept: '中间件组',
  },

  // 12. 消息中间件 -> Apache Kafka (msg_kafka) - 3 items
  {
    id: 'CI-MW-MQ-01',
    categoryKey: 'msg_kafka',
    name: 'Apache Kafka 3.7 分布式消息队列集群',
    type: '高吞吐事件流存储集群',
    vendor: 'Apache Software Foundation',
    serialNumber: 'SN-KFK-20261103801',
    version: 'Kafka 3.7.0 (KRaft 模式)',
    systemInfo: '实时数据总线区 / B03 机柜',
    ipAddress: '10.120.88.11:9092',
    description: '12 分区副本重平衡，磁盘 IOPS 不均度减少 95%',
    updatedAt: '2026/11/03 16:55:40',
    status: 'online',
    location: '华东数据中心 B03 柜',
    ownerPerson: '马飞',
    ownerDept: '数据接入组',
  },
  {
    id: 'CI-MW-MQ-02',
    categoryKey: 'msg_kafka',
    name: 'Kafka Connect 数据同步集群',
    type: 'CDC 实时数据变更捕获',
    vendor: 'Confluent / Apache',
    serialNumber: 'SN-KFK-20261102802',
    version: 'Confluent 7.6.0',
    systemInfo: '异构数据库同步通道',
    ipAddress: '10.120.88.20:8083',
    description: 'Debezium MySQL / PostgreSQL CDC 毫秒级抓取',
    updatedAt: '2026/11/02 13:20:00',
    status: 'online',
    location: '华东数据中心 B03 柜',
    ownerPerson: '马飞',
    ownerDept: '数据接入组',
  },
  {
    id: 'CI-MW-MQ-03',
    categoryKey: 'msg_kafka',
    name: 'Schema Registry 元数据字典节点',
    type: 'Avro / JSON Schema 格式注册表',
    vendor: 'Confluent',
    serialNumber: 'SN-KFK-20261028803',
    version: 'Schema Registry v7.6',
    systemInfo: '消息格式强类型校验',
    ipAddress: '10.120.88.30:8081',
    description: '保证全局数据管道消息 Protocol 兼容性校验',
    updatedAt: '2026/10/28 10:00:00',
    status: 'online',
    location: '华东数据中心 B03 柜',
    ownerPerson: '马飞',
    ownerDept: '数据接入组',
  },

  // 13. 消息中间件 -> RocketMQ (msg_rocketmq) - 2 items
  {
    id: 'CI-MW-RMQ-01',
    categoryKey: 'msg_rocketmq',
    name: 'Apache RocketMQ 5.2 业务事务消息集群',
    type: '金融级高可靠消息中间件',
    vendor: 'Apache / 阿里',
    serialNumber: 'SN-RMQ-20261101810',
    version: 'RocketMQ 5.2.1',
    systemInfo: '交易订单防重分发',
    ipAddress: '10.120.88.50:9876',
    description: '支持二阶段提交事务消息与长延时定时消息',
    updatedAt: '2026/11/01 16:40:00',
    status: 'online',
    location: '华东数据中心 B04 柜',
    ownerPerson: '马飞',
    ownerDept: '数据接入组',
  },
  {
    id: 'CI-MW-RMQ-02',
    categoryKey: 'msg_rocketmq',
    name: 'RocketMQ NameServer 路由配置节点',
    type: '无状态轻量路由命名服务',
    vendor: 'Apache Software Foundation',
    serialNumber: 'SN-RMQ-20261029811',
    version: 'RocketMQ 5.2.1',
    systemInfo: '消息拓扑路由导航',
    ipAddress: '10.120.88.51:9876',
    description: '内存级 Topic 路由元数据维护，秒级剔除故障 Broker',
    updatedAt: '2026/10/29 11:20:00',
    status: 'online',
    location: '华东数据中心 B04 柜',
    ownerPerson: '马飞',
    ownerDept: '数据接入组',
  },

  // 14. 缓存中间件 -> Redis 7.2 集群 (cache_redis) - 3 items
  {
    id: 'CI-MW-RDS-01',
    categoryKey: 'cache_redis',
    name: 'Redis 7.2.4 分布式缓存集群',
    type: '内存级 High-QPS 缓存分片',
    vendor: 'Redis Labs / Redis Ltd',
    serialNumber: 'SN-RDS-20261104901',
    version: 'Redis 7.2.4 Cluster',
    systemInfo: '中间件服务区 / B02 机柜',
    ipAddress: '10.120.30.20:6379',
    description: 'UNLINK 异步内存回收，碎片率 1.08，彻底治理 BigKey 堵塞',
    updatedAt: '2026/11/04 14:10:22',
    status: 'online',
    location: '华东数据中心 B02 柜',
    ownerPerson: '韩伟',
    ownerDept: '中间件组',
  },
  {
    id: 'CI-MW-RDS-02',
    categoryKey: 'cache_redis',
    name: 'Redis Sentinel 高可用哨兵监控组',
    type: 'Redis 自动主从故障倒换',
    vendor: 'Redis Labs',
    serialNumber: 'SN-RDS-20261101902',
    version: 'Sentinel 7.2.4',
    systemInfo: '缓存容灾监视区',
    ipAddress: '10.120.30.25:26379',
    description: 'quorum 2 自动选举机制，3 秒内完成故障转移主从漂移',
    updatedAt: '2026/11/01 10:00:00',
    status: 'online',
    location: '华东数据中心 B02 柜',
    ownerPerson: '韩伟',
    ownerDept: '中间件组',
  },
  {
    id: 'CI-MW-RDS-03',
    categoryKey: 'cache_redis',
    name: 'KeyDB 多线程高性能兼容集群',
    type: '高并发 KeyDB 内存数据库',
    vendor: 'KeyDB / Snapchat',
    serialNumber: 'SN-RDS-20261027903',
    version: 'KeyDB v6.3.4',
    systemInfo: '热点秒杀大流量区',
    ipAddress: '10.120.30.30:6379',
    description: '多线程 I/O 架构，单节点支持 500,000 QPS 吞吐',
    updatedAt: '2026/10/27 15:40:00',
    status: 'online',
    location: '华东数据中心 B02 柜',
    ownerPerson: '韩伟',
    ownerDept: '中间件组',
  },

  // 15. 数据库 -> PostgreSQL 16 (db_pg) - 3 items
  {
    id: 'CI-DB-PG-01',
    categoryKey: 'db_pg',
    name: 'PostgreSQL 16.2 零中断双活主库',
    type: '企业级 RDBMS 关系型数据库',
    vendor: 'PostgreSQL Global Development Group',
    serialNumber: 'SN-PG16-20261105001',
    version: 'PostgreSQL 16.2 on x86_64',
    systemInfo: '核心 DB 专用机柜 A02',
    ipAddress: '10.120.99.15:5432',
    description: '逻辑复制延迟 1.2ms，QPS 18,500 稳定运行',
    updatedAt: '2026/11/05 15:32:18',
    status: 'online',
    location: '华东数据中心 A02 柜 U10-U12',
    ownerPerson: '张建',
    ownerDept: '数据库技术部',
  },
  {
    id: 'CI-DB-PG-02',
    categoryKey: 'db_pg',
    name: 'PgBouncer 高并发连接池中间件',
    type: 'PostgreSQL 事务级连接池',
    vendor: 'PgBouncer Community',
    serialNumber: 'SN-PG16-20261103002',
    version: 'PgBouncer 1.22.1',
    systemInfo: '数据库高并发前端网关',
    ipAddress: '10.120.99.16:6432',
    description: '支持 10,000 前端客户端连接收敛复用，降低主库内存消耗',
    updatedAt: '2026/11/03 14:00:00',
    status: 'online',
    location: '华东数据中心 A02 柜 U13',
    ownerPerson: '张建',
    ownerDept: '数据库技术部',
  },
  {
    id: 'CI-DB-PG-03',
    categoryKey: 'db_pg',
    name: 'PostGIS 3.4 空间地理元数据数据库',
    type: '地理信息空间扩展数据库',
    vendor: 'PostGIS / OSGeo',
    serialNumber: 'SN-PG16-20261031003',
    version: 'PostGIS 3.4.2 on PG 16',
    systemInfo: 'AGV 与仓储轨迹坐标计算',
    ipAddress: '10.120.99.20:5432',
    description: '高效空间 R-Tree 索引，毫秒级 AGV 轨迹碰撞判定',
    updatedAt: '2026/10/31 16:50:00',
    status: 'online',
    location: '华东数据中心 A02 柜 U14',
    ownerPerson: '张建',
    ownerDept: '数据库技术部',
  },

  // 16. 数据库 -> ClickHouse / Doris (db_clickhouse) - 3 items
  {
    id: 'CI-DB-CH-01',
    categoryKey: 'db_clickhouse',
    name: 'ClickHouse 24.3 S3 列式分析数据库',
    type: '大规模 OLAP 列式数据库',
    vendor: 'ClickHouse Inc.',
    serialNumber: 'SN-CH24-20261102001',
    version: 'ClickHouse 24.3.2.14',
    systemInfo: '湖仓分析区 / C02 机柜',
    ipAddress: '10.120.150.88:8123',
    description: 'S3 透明冷热分层，离线冷数据 45TB 沉淀，压缩比 4.2:1',
    updatedAt: '2026/11/02 11:15:33',
    status: 'online',
    location: '华东数据中心 C02 柜',
    ownerPerson: '林立',
    ownerDept: '数据架构部',
  },
  {
    id: 'CI-DB-CH-02',
    categoryKey: 'db_clickhouse',
    name: 'Apache Doris 2.1 极速实时分析数据库',
    type: 'MPP 列式实时 MPP 数据库',
    vendor: 'Apache Doris / 飞轮',
    serialNumber: 'SN-DRS-20261030002',
    version: 'Apache Doris 2.1.2',
    systemInfo: '实时报表与多维分析',
    ipAddress: '10.120.150.90:9030',
    description: '支持主键模型高频 Upsert，Pipeline 向量化执行引擎',
    updatedAt: '2026/10/30 14:10:00',
    status: 'online',
    location: '华东数据中心 C02 柜',
    ownerPerson: '林立',
    ownerDept: '数据架构部',
  },
  {
    id: 'CI-DB-CH-03',
    categoryKey: 'db_clickhouse',
    name: 'ClickHouse Keeper 分布式协调节点',
    type: 'ClickHouse 纯 C++ 协调元数据',
    vendor: 'ClickHouse Inc.',
    serialNumber: 'SN-CH24-20261028003',
    version: 'ClickHouse Keeper 24.3',
    systemInfo: 'OLAP 分片 DDL 协调',
    ipAddress: '10.120.150.95:9181',
    description: '取代 ZooKeeper，提供更高吞吐的日志 DDL 复制状态机',
    updatedAt: '2026/10/28 11:30:00',
    status: 'online',
    location: '华东数据中心 C02 柜',
    ownerPerson: '林立',
    ownerDept: '数据架构部',
  },
];

export const ConfigItemDataView: React.FC = () => {
  // Main Devices State
  const [ciDevices, setCiDevices] = useState<CIDeviceItem[]>(INITIAL_CI_DEVICES);

  // Left tree selection
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('net_switch');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({
    net: true,
    rfid: false,
    srv: true,
    os: false,
    container: false,
    mw_web: false,
    mw_msg: false,
    mw_cache: false,
    db: true,
  });

  // Dynamic computation of actual count per categoryKey to make left badges 100% match right side records!
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    ciDevices.forEach((item) => {
      counts[item.categoryKey] = (counts[item.categoryKey] || 0) + 1;
    });
    return counts;
  }, [ciDevices]);

  // Tree Search
  const [treeSearchTerm, setTreeSearchTerm] = useState('');

  // Right Table Search
  const [tableSearchTerm, setTableSearchTerm] = useState('');

  // Pagination (Strict 10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [jumpPage, setJumpPage] = useState('');

  // Modals
  const [selectedItemDetail, setSelectedItemDetail] = useState<CIDeviceItem | null>(null);
  const [editingItem, setEditingItem] = useState<CIDeviceItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<CIDeviceItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // New Item Form State matching image_5e073308.png
  const [addSwitchType, setAddSwitchType] = useState('');
  const [addDeviceName, setAddDeviceName] = useState('');
  const [addDeviceVendor, setAddDeviceVendor] = useState('');
  const [addDeviceBrand, setAddDeviceBrand] = useState('');
  const [addDeviceModel, setAddDeviceModel] = useState('');
  const [addDeviceSN, setAddDeviceSN] = useState('');
  const [addOsVersion, setAddOsVersion] = useState('');
  const [addSystemInfo, setAddSystemInfo] = useState('');
  const [addMacAddress, setAddMacAddress] = useState('');
  const [addIpAddress, setAddIpAddress] = useState('');
  const [addPortCount, setAddPortCount] = useState('');
  const [addPortList, setAddPortList] = useState('');
  const [addDescription, setAddDescription] = useState('');

  // Function to reset and clear all add form fields ("数据清空")
  const resetAddForm = () => {
    setAddSwitchType('');
    setAddDeviceName('');
    setAddDeviceVendor('');
    setAddDeviceBrand('');
    setAddDeviceModel('');
    setAddDeviceSN('');
    setAddOsVersion('');
    setAddSystemInfo('');
    setAddMacAddress('');
    setAddIpAddress('');
    setAddPortCount('');
    setAddPortList('');
    setAddDescription('');
  };

  const toggleParent = (parentKey: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentKey]: !prev[parentKey],
    }));
  };

  const activeCategoryInfo = useMemo(() => {
    for (const parent of CATEGORY_TREE) {
      if (parent.children) {
        const found = parent.children.find((c) => c.key === selectedCategoryKey);
        if (found) {
          return { parentLabel: parent.label, childLabel: found.label, key: found.key };
        }
      }
    }
    return { parentLabel: '网络设备', childLabel: '交换机', key: 'net_switch' };
  }, [selectedCategoryKey]);

  // Filter items matching selected left-tree category AND search term
  const filteredDevices = useMemo(() => {
    return ciDevices.filter((item) => {
      const matchesCategory = item.categoryKey === selectedCategoryKey;
      const matchesSearch =
        item.name.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.serialNumber.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.ipAddress.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.vendor.toLowerCase().includes(tableSearchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(tableSearchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [ciDevices, selectedCategoryKey, tableSearchTerm]);

  const totalPages = Math.ceil(filteredDevices.length / itemsPerPage) || 1;

  const paginatedDevices = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDevices.slice(start, start + itemsPerPage);
  }, [filteredDevices, currentPage]);

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
    if (!addDeviceName.trim() && !addIpAddress.trim() && !addDeviceModel.trim()) {
      alert('请填写必要字段（如设备名称、设备型号或 IP 地址）');
      return;
    }

    const newId = `CI-${selectedCategoryKey.toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newItem: CIDeviceItem = {
      id: newId,
      categoryKey: selectedCategoryKey,
      name: addDeviceName || `${activeCategoryInfo.childLabel}-${newId}`,
      type: addSwitchType || addDeviceModel || activeCategoryInfo.childLabel,
      vendor: addDeviceVendor || addDeviceBrand || '自定义厂商',
      serialNumber: addDeviceSN || `SN-${Math.floor(10000000 + Math.random() * 90000000)}`,
      version: addOsVersion || 'v1.0.0',
      systemInfo: addSystemInfo || '全息数据基础设施',
      ipAddress: addIpAddress || '10.120.10.10',
      description: addDescription || '手动新增配置项资产',
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      status: 'online',
      location: '华东数据中心',
      ownerPerson: '程总工',
      ownerDept: '全息基础设施处',
    };

    setCiDevices((prev) => [newItem, ...prev]);
    alert(`成功创建配置项资产: ${newItem.name}`);

    // Clear form state completely
    resetAddForm();
    setIsAddOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full font-sans text-xs">
      {/* Left Column: Category Tree Panel matching image_78d6093b.png */}
      <div className="w-full lg:w-64 shrink-0 rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-3 shadow-lg flex flex-col">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 font-bold text-slate-100 text-xs">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>配置项分类树</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono">
            CMDB
          </span>
        </div>

        {/* Tree Search Box */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
          <input
            type="text"
            value={treeSearchTerm}
            onChange={(e) => setTreeSearchTerm(e.target.value)}
            placeholder="请输入分类名称..."
            className="w-full pl-8 pr-2 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors text-[11px]"
          />
        </div>

        {/* Expandable Tree View with 100% Dynamic Matching Badge Counts */}
        <div className="flex-1 overflow-y-auto space-y-1 pr-1 max-h-[70vh] lg:max-h-[750px]">
          {CATEGORY_TREE.map((parent) => {
            const isExpanded = expandedParents[parent.key];
            const matchesParentSearch =
              !treeSearchTerm ||
              parent.label.toLowerCase().includes(treeSearchTerm.toLowerCase()) ||
              (parent.children && parent.children.some((c) => c.label.toLowerCase().includes(treeSearchTerm.toLowerCase())));

            if (!matchesParentSearch) return null;

            // Compute total parent count dynamically
            const parentTotal = parent.children
              ? parent.children.reduce((sum, c) => sum + (categoryCounts[c.key] || 0), 0)
              : 0;

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

                {/* Sub Children Nodes */}
                {isExpanded && parent.children && (
                  <div className="pl-6 space-y-0.5 border-l border-slate-800 ml-3 py-0.5">
                    {parent.children.map((child) => {
                      const isSelected = selectedCategoryKey === child.key;
                      // Dynamically derived count for perfect match with right table dataset!
                      const actualCount = categoryCounts[child.key] || 0;

                      return (
                        <button
                          key={child.key}
                          onClick={() => {
                            setSelectedCategoryKey(child.key);
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

      {/* Right Column: Dynamic Data Table View */}
      <div className="flex-1 space-y-4 overflow-hidden">
        {/* Top Header & Search Toolbar */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-xs">配置项数据</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-slate-400 text-xs">{activeCategoryInfo.parentLabel}</span>
              <span className="text-slate-600">&gt;</span>
              <span className="text-cyan-400 font-bold text-sm">{activeCategoryInfo.childLabel}</span>
            </div>
            <p className="text-xs text-slate-400">
              对应 <strong className="text-slate-200">{activeCategoryInfo.childLabel}</strong> 的最新 CMDB 配置状态（共 <strong className="text-cyan-400 font-bold">{filteredDevices.length}</strong> 条，左侧树节点数字 100% 对应）
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                value={tableSearchTerm}
                onChange={(e) => {
                  setTableSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="请输入名称 / IP / 序列号"
                className="w-48 px-3 py-1.5 pl-8 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-xs"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            </div>

            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold flex items-center gap-1 transition-colors shadow-sm shadow-cyan-900/30 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              搜索
            </button>

            {/* 新增 Button */}
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/80 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              新增
            </button>

            {/* 导入 Button */}
            <button
              onClick={() => setIsImportOpen(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-slate-400" />
              导入
            </button>
          </div>
        </div>

        {/* Data Table with 9 Columns matching screenshot image_78d6093b.png */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1250px]">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold text-[11px] whitespace-nowrap">
                  <th className="py-3 px-4 min-w-[200px] border-r border-slate-800/80">设备名称</th>
                  <th className="py-3 px-3 min-w-[140px] border-r border-slate-800/80">{activeCategoryInfo.childLabel}类型</th>
                  <th className="py-3 px-3 min-w-[110px] border-r border-slate-800/80">品牌</th>
                  <th className="py-3 px-3 min-w-[150px] border-r border-slate-800/80 font-mono">序列号 (S/N)</th>
                  <th className="py-3 px-3 min-w-[140px] border-r border-slate-800/80 font-mono">OS/软件版本</th>
                  <th className="py-3 px-4 min-w-[160px] border-r border-slate-800/80">系统信息</th>
                  <th className="py-3 px-3 min-w-[130px] border-r border-slate-800/80 font-mono">IP地址</th>
                  <th className="py-3 px-4 min-w-[200px] border-r border-slate-800/80">描述</th>
                  <th className="py-3 px-4 text-center min-w-[160px] sticky right-0 bg-slate-950 border-l border-slate-800 shadow-l">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300 text-[11px]">
                {paginatedDevices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-500 font-medium">
                      暂无 [{activeCategoryInfo.childLabel}] 分类下的真实配置项数据
                    </td>
                  </tr>
                ) : (
                  paginatedDevices.map((device) => (
                    <tr key={device.id} className="hover:bg-slate-800/50 transition-colors group">
                      {/* 设备名称 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        <div className="space-y-0.5">
                          <div>{device.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{device.id}</div>
                        </div>
                      </td>

                      {/* 类型 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 text-slate-200">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium border border-slate-700">
                          {device.type}
                        </span>
                      </td>

                      {/* 品牌 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 font-medium text-slate-300">
                        {device.vendor}
                      </td>

                      {/* 序列号 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 font-mono text-cyan-400 font-semibold">
                        {device.serialNumber}
                      </td>

                      {/* OS/软件版本 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 font-mono text-slate-300">
                        {device.version}
                      </td>

                      {/* 系统信息 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300">
                        {device.systemInfo}
                      </td>

                      {/* IP地址 */}
                      <td className="py-3 px-3 border-r border-slate-800/60 font-mono text-slate-200 font-medium">
                        {device.ipAddress}
                      </td>

                      {/* 描述 */}
                      <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300 leading-relaxed">
                        {device.description}
                      </td>

                      {/* 操作 */}
                      <td className="py-3 px-4 text-center sticky right-0 bg-slate-900 group-hover:bg-slate-800/90 border-l border-slate-800 shadow-l whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2 font-medium">
                          <button
                            onClick={() => setEditingItem(device)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            修改
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setSelectedItemDetail(device)}
                            className="text-cyan-400 hover:text-cyan-300 hover:underline transition-colors cursor-pointer"
                          >
                            查看详情
                          </button>
                          <span className="text-slate-700">|</span>
                          <button
                            onClick={() => setDeletingItem(device)}
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
                当前分类 [<strong className="text-cyan-400 font-bold">{activeCategoryInfo.childLabel}</strong>] 共 <strong className="text-cyan-400 font-bold">{filteredDevices.length}</strong> 条记录 （左侧数字 100% 对应）
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
      {selectedItemDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-100 text-sm">配置项详情基线 - {selectedItemDetail.name}</h3>
              </div>
              <button onClick={() => setSelectedItemDetail(null)} className="p-1 text-slate-400 hover:text-slate-100 rounded hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-950 border border-slate-800">
                <div><span className="text-slate-500 block">设备名称:</span><strong className="text-slate-100">{selectedItemDetail.name}</strong></div>
                <div><span className="text-slate-500 block">设备类型:</span><strong className="text-cyan-400 font-mono">{selectedItemDetail.type}</strong></div>
                <div><span className="text-slate-500 block">品牌 / 厂商:</span><strong className="text-slate-200">{selectedItemDetail.vendor}</strong></div>
                <div><span className="text-slate-500 block">序列号 (S/N):</span><strong className="text-cyan-400 font-mono">{selectedItemDetail.serialNumber}</strong></div>
                <div><span className="text-slate-500 block">OS / 软件版本:</span><strong className="text-slate-200 font-mono">{selectedItemDetail.version}</strong></div>
                <div><span className="text-slate-500 block">IP 地址:</span><strong className="text-slate-200 font-mono">{selectedItemDetail.ipAddress}</strong></div>
                <div><span className="text-slate-500 block">所属物理位置:</span><strong className="text-slate-200">{selectedItemDetail.location}</strong></div>
                <div><span className="text-slate-500 block">责任工程师:</span><strong className="text-slate-200">{selectedItemDetail.ownerPerson} ({selectedItemDetail.ownerDept})</strong></div>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 block font-semibold">系统信息与配置描述:</span>
                <p className="text-slate-200 leading-relaxed">{selectedItemDetail.description}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button onClick={() => setSelectedItemDetail(null)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold">
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100">修改配置项信息 - {editingItem.name}</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">设备名称</label>
                <input
                  type="text"
                  defaultValue={editingItem.name}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">IP 地址</label>
                <input
                  type="text"
                  defaultValue={editingItem.ipAddress}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">描述与修改备注</label>
                <textarea
                  defaultValue={editingItem.description}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button onClick={() => setEditingItem(null)} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300">
                取消
              </button>
              <button
                onClick={() => {
                  alert(`配置项 [${editingItem.name}] 修改保存成功！`);
                  setEditingItem(null);
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
      {deletingItem && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#002b49] border border-rose-800/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            {/* Header */}
            <div className="px-5 py-3 bg-[#001e36] border-b border-rose-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>确认删除配置项资产</span>
              </div>
              <button
                onClick={() => setDeletingItem(null)}
                className="text-slate-400 hover:text-white font-bold text-base p-1"
              >
                X
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3">
              <p className="text-slate-200 leading-relaxed text-xs">
                您确定要彻底删除配置项 <strong className="text-cyan-300 font-semibold">{deletingItem.name}</strong> 吗？
              </p>
              <div className="p-3 bg-[#001d33] border border-cyan-900/60 rounded text-[11px] space-y-1 font-mono text-slate-300">
                <div><span className="text-slate-500">设备 ID:</span> {deletingItem.id}</div>
                <div><span className="text-slate-500">IP 地址:</span> {deletingItem.ipAddress}</div>
                <div><span className="text-slate-500">序列号:</span> {deletingItem.serialNumber}</div>
              </div>
              <p className="text-rose-400/90 text-[11px] font-medium">
                ⚠️ 注意：此操作不可撤销，删除后该资产关联的拓扑快照将同步注销！
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-3 bg-[#001e36] border-t border-cyan-900/60 flex justify-end gap-2.5">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-1.5 rounded bg-[#0b385c] hover:bg-[#124874] text-slate-200 font-semibold border border-cyan-800/80 transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setCiDevices((prev) => prev.filter((d) => d.id !== deletingItem.id));
                  alert(`已成功删除配置项资产: ${deletingItem.name}`);
                  setDeletingItem(null);
                }}
                className="px-4 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold shadow-md shadow-rose-950/50 transition-colors cursor-pointer"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal matching screenshot image_5e073308.png */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl bg-[#002b49] border border-cyan-700/80 rounded-lg shadow-2xl overflow-hidden flex flex-col text-xs text-slate-100">
            {/* Title Bar */}
            <div className="px-5 py-3 bg-[#001e36] border-b border-cyan-800/80 flex items-center justify-between">
              <h3 className="font-bold text-cyan-300 text-sm tracking-wide">新增</h3>
              <button
                onClick={() => {
                  resetAddForm();
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
                    <span className="text-red-500 font-bold mr-0.5">*</span>交换机类型:
                  </label>
                  <select
                    value={addSwitchType}
                    onChange={(e) => setAddSwitchType(e.target.value)}
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="" disabled>请选择交换机类型</option>
                    <option value="核心 Spine 交换机">核心 Spine 交换机</option>
                    <option value="汇聚 Leaf 交换机">汇聚 Leaf 交换机</option>
                    <option value="TOR 柜顶交换机">TOR 柜顶交换机</option>
                    <option value="SAN 光纤专网交换机">SAN 光纤专网交换机</option>
                    <option value="工业以太网交换机">工业以太网交换机</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>设备名称:
                  </label>
                  <input
                    type="text"
                    value={addDeviceName}
                    onChange={(e) => setAddDeviceName(e.target.value)}
                    placeholder="请输入设备名称"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>设备厂商:
                  </label>
                  <input
                    type="text"
                    value={addDeviceVendor}
                    onChange={(e) => setAddDeviceVendor(e.target.value)}
                    placeholder="请输入设备品牌"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    设备品牌:
                  </label>
                  <input
                    type="text"
                    value={addDeviceBrand}
                    onChange={(e) => setAddDeviceBrand(e.target.value)}
                    placeholder="请输入设备品牌"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 3 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>设备型号:
                  </label>
                  <input
                    type="text"
                    value={addDeviceModel}
                    onChange={(e) => setAddDeviceModel(e.target.value)}
                    placeholder="请输入设备型号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    设备序列号:
                  </label>
                  <input
                    type="text"
                    value={addDeviceSN}
                    onChange={(e) => setAddDeviceSN(e.target.value)}
                    placeholder="请输入设备序列号"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Row 4 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    设备OS版本:
                  </label>
                  <input
                    type="text"
                    value={addOsVersion}
                    onChange={(e) => setAddOsVersion(e.target.value)}
                    placeholder="请输入OS版本"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    系统信息:
                  </label>
                  <input
                    type="text"
                    value={addSystemInfo}
                    onChange={(e) => setAddSystemInfo(e.target.value)}
                    placeholder="请输入系统信息"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Row 5 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    MAC地址:
                  </label>
                  <input
                    type="text"
                    value={addMacAddress}
                    onChange={(e) => setAddMacAddress(e.target.value)}
                    placeholder="请输入MAC地址"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    <span className="text-red-500 font-bold mr-0.5">*</span>IP地址:
                  </label>
                  <input
                    type="text"
                    value={addIpAddress}
                    onChange={(e) => setAddIpAddress(e.target.value)}
                    placeholder="请输入IP地址"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {/* Row 6 */}
                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    设备网口数:
                  </label>
                  <input
                    type="text"
                    value={addPortCount}
                    onChange={(e) => setAddPortCount(e.target.value)}
                    placeholder="请输入设备网口数"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-24 text-right shrink-0 font-medium text-slate-200">
                    网口列表:
                  </label>
                  <input
                    type="text"
                    value={addPortList}
                    onChange={(e) => setAddPortList(e.target.value)}
                    placeholder="请输入网口列表"
                    className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded px-3 py-2 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Row 7: Description (Full Width) */}
              <div className="flex items-start gap-2 pt-1">
                <label className="w-24 text-right shrink-0 font-medium text-slate-200 pt-2">
                  描述:
                </label>
                <textarea
                  value={addDescription}
                  onChange={(e) => setAddDescription(e.target.value)}
                  placeholder="请输入描述"
                  rows={3}
                  className="flex-1 bg-[#001d33] border border-cyan-800/90 rounded p-2.5 text-cyan-100 placeholder:text-cyan-600/80 focus:outline-none focus:border-cyan-400 resize-none"
                />
              </div>

              {/* Footer Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-cyan-900/60">
                <button
                  type="button"
                  onClick={() => {
                    resetAddForm();
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

      {/* Import Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100">批量导入 CMDB 配置项</h3>
              <button onClick={() => setIsImportOpen(false)} className="text-slate-400 hover:text-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center space-y-2 bg-slate-950/60 hover:border-cyan-500 cursor-pointer transition-colors">
              <Upload className="w-8 h-8 text-cyan-400" />
              <span className="text-slate-200 font-semibold">点击或将 CSV/Excel 模版文件拖拽至此处</span>
              <span className="text-[10px] text-slate-500">支持 .xlsx, .csv 批量覆盖或增量更新</span>
            </div>

            <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800">
              <button onClick={() => alert('标准 CMDB 导入模板下载成功！')} className="text-cyan-400 hover:underline">
                下载 Excel 标准模板
              </button>
              <button onClick={() => setIsImportOpen(false)} className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200">
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
