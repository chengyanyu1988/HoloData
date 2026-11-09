import React, { useState, useEffect } from 'react';
import { ElectronicTagDevice } from '../../types';
import { 
  Radio, RefreshCw, Search, CheckCircle2, AlertTriangle, 
  Terminal, Activity, Wifi, ShieldCheck, Zap, 
  Cpu, Signal, QrCode, HardDrive, ArrowUpRight, Barcode,
  Bell, ChevronRight, Sliders, Shield, Filter, Check, Clock,
  Layers, CheckSquare, Award, UserCheck, FileText, BarChart3,
  TrendingUp, DownloadCloud, Folder, FolderOpen, Tv, Settings,
  MapPin, Eye, Compass, Navigation, Thermometer, X, Wrench, Info, ShieldAlert
} from 'lucide-react';

interface Props {
  tagDevices: ElectronicTagDevice[];
  initialSubTab?: 'device' | 'readrate' | 'inspection' | 'stats';
  onOpenTerminal: (name: string, ip: string) => void;
  onRefresh: () => void;
}

type DeviceTimeRangeKey = '5m' | '1h' | '24h' | '7d';

interface InspectionRecord {
  id: string;
  deviceName: string;
  location: string;
  inspector: string;
  checkItems: string;
  result: 'normal' | 'warning' | 'calibrated';
  vswrValue: string;
  inspectionTime: string;
}

const INSPECTION_LOGS: InspectionRecord[] = [
  {
    id: 'INS-2026-089',
    deviceName: '固定式读写设备_Impinj_R700_01',
    location: '制造车间 A 跨区通道 01#',
    inspector: '张伟 (边缘标识组)',
    checkItems: '天线 1-4# 驻波比测试、防爆外壳密封、供电电压 24V',
    result: 'normal',
    vswrValue: 'VSWR 1.15',
    inspectionTime: '2026-11-06 08:15:00',
  },
  {
    id: 'INS-2026-088',
    deviceName: '控制器_Edge_IoT_Master_123',
    location: '智能仓储 B 区控制柜 01',
    inspector: '李娜 (硬件巡检组)',
    checkItems: '8口 RS485 链路校验、PoE 网口物理链路',
    result: 'calibrated',
    vswrValue: 'VSWR 1.22 (已校准)',
    inspectionTime: '2026-11-05 18:40:00',
  },
  {
    id: 'INS-2026-087',
    deviceName: 'RV一体机_Laser_Coder_01',
    location: '总装产线 3 号线头工位',
    inspector: '王强 (标识自动化组)',
    checkItems: '激光赋码镜头防尘擦拭、QR/ Handle 码在线校验读头',
    result: 'normal',
    vswrValue: 'N/A (光学识别)',
    inspectionTime: '2026-11-05 14:10:00',
  },
];

export interface DeviceWarningMonitorItem {
  id: string;
  model: string;          // 设备型号 (e.g. GTR12332322)
  pointName: string;      // 点位名称 (e.g. 新市区红光山)
  warningName: string;    // 预警名称 (e.g. 设备网络中断,功率异常)
  warningTypes: ('network' | 'power' | 'vswr' | 'cpu' | 'temp')[];
  alarmTime: string;      // 报警时间 (e.g. 2026/11/06 08:35:12)
  installTime: string;    // 安装时间 (e.g. 2025/06/15 12:12:20)
  devicePower: string;    // 设备功率 (e.g. 90)
  temperature: string;    // 温度 (e.g. 23°C)
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'processing' | 'resolved';
  ipAddress: string;
  firmwareVersion: string;
}

export const DEVICE_WARNING_MONITOR_LIST: DeviceWarningMonitorItem[] = [
  {
    id: 'WRN-2026-101',
    model: 'GTR12332322',
    pointName: '天津港智能物联网卡口 01#',
    warningName: '设备网络中断,功率异常',
    warningTypes: ['network', 'power'],
    alarmTime: '2026/11/06 08:35:12',
    installTime: '2026/01/15 10:00:00',
    devicePower: '90',
    temperature: '23°C',
    severity: 'critical',
    status: 'active',
    ipAddress: '192.168.10.105',
    firmwareVersion: 'v4.2.8-industrial',
  },
  {
    id: 'WRN-2026-102',
    model: 'GTR12332322',
    pointName: '河西区湘江道电子标识卡口 02#',
    warningName: '设备网络中断,功率异常',
    warningTypes: ['network', 'power'],
    alarmTime: '2026/11/06 08:12:45',
    installTime: '2026/02/20 09:30:00',
    devicePower: '90',
    temperature: '25°C',
    severity: 'critical',
    status: 'processing',
    ipAddress: '192.168.10.106',
    firmwareVersion: 'v4.2.8-industrial',
  },
  {
    id: 'WRN-2026-103',
    model: 'FX9600-RFID-02',
    pointName: '滨海新区物流自贸区卡口 03#',
    warningName: '天线驻波异常',
    warningTypes: ['vswr'],
    alarmTime: '2026/11/06 07:50:30',
    installTime: '2026/03/12 14:15:00',
    devicePower: '33',
    temperature: '38°C',
    severity: 'warning',
    status: 'active',
    ipAddress: '192.168.10.107',
    firmwareVersion: 'v5.1.0-ultra',
  },
  {
    id: 'WRN-2026-104',
    model: 'R700-EDGE-04',
    pointName: '西青工业园区智能闸口 04#',
    warningName: 'CPU利用率高项,温度异常',
    warningTypes: ['cpu', 'temp'],
    alarmTime: '2026/11/06 06:15:08',
    installTime: '2026/04/18 10:45:00',
    devicePower: '30',
    temperature: '48°C',
    severity: 'warning',
    status: 'processing',
    ipAddress: '192.168.10.108',
    firmwareVersion: 'v6.0.2-edge',
  },
  {
    id: 'WRN-2026-105',
    model: 'GTR12332322',
    pointName: '南开区智慧交通综合卡口 05#',
    warningName: '设备网络中断,功率异常',
    warningTypes: ['network', 'power'],
    alarmTime: '2026/11/05 23:40:19',
    installTime: '2026/05/25 12:10:00',
    devicePower: '90',
    temperature: '23°C',
    severity: 'critical',
    status: 'active',
    ipAddress: '192.168.10.109',
    firmwareVersion: 'v4.2.8-industrial',
  },
  {
    id: 'WRN-2026-106',
    model: 'Edge-IoT-Master-01',
    pointName: '津南海河教育园物流通道 06#',
    warningName: '温度异常',
    warningTypes: ['temp'],
    alarmTime: '2026/11/05 21:05:00',
    installTime: '2026/06/10 16:20:00',
    devicePower: '28',
    temperature: '51°C',
    severity: 'warning',
    status: 'active',
    ipAddress: '192.168.10.110',
    firmwareVersion: 'v3.8.1-plc',
  },
  {
    id: 'WRN-2026-107',
    model: 'Laser-Coder-RV-03',
    pointName: '北辰区陆港多式联运枢纽 07#',
    warningName: '天线驻波异常,功率异常',
    warningTypes: ['vswr', 'power'],
    alarmTime: '2026/11/05 18:22:34',
    installTime: '2026/07/22 11:10:00',
    devicePower: '85',
    temperature: '29°C',
    severity: 'warning',
    status: 'resolved',
    ipAddress: '192.168.10.111',
    firmwareVersion: 'v2.9.4-optics',
  },
  {
    id: 'WRN-2026-108',
    model: 'GTR12332322',
    pointName: '东丽区航空保税查验卡口 08#',
    warningName: '设备网络中断,功率异常',
    warningTypes: ['network', 'power'],
    alarmTime: '2026/11/05 15:10:00',
    installTime: '2026/08/15 08:30:00',
    devicePower: '90',
    temperature: '23°C',
    severity: 'critical',
    status: 'resolved',
    ipAddress: '192.168.10.112',
    firmwareVersion: 'v4.2.8-industrial',
  },
];

export interface OfflineDeviceItem {
  id: number;
  code: string;
  faultContent: string;
  faultProduct: string;
  offlineCount: number;
  severity: '消息' | '轻微' | '一般' | '严重' | '重大';
  startTime: string;
  recoveryTime: string;
  productCategory: 'fixed_reader' | 'controller' | 'rv_allinone';
}

export const OFFLINE_DEVICE_LIST: OfflineDeviceItem[] = [
  {
    id: 1,
    code: 'OFF-2026-001',
    faultContent: '服务器内存溢出告警',
    faultProduct: '固定式超高频读写设备_Impinj_R700',
    offlineCount: 2,
    severity: '消息',
    startTime: '2026/11/06 08:20:15',
    recoveryTime: '2026/11/06 08:35:10',
    productCategory: 'fixed_reader',
  },
  {
    id: 2,
    code: 'OFF-2026-002',
    faultContent: '设备告警',
    faultProduct: '工业标识控制器_Edge_IoT_Master',
    offlineCount: 3,
    severity: '轻微',
    startTime: '2026/11/06 07:45:00',
    recoveryTime: '2026/11/06 08:00:20',
    productCategory: 'controller',
  },
  {
    id: 3,
    code: 'OFF-2026-003',
    faultContent: '服务器内存溢出告警',
    faultProduct: 'RV激光赋码喷码一体机_Coder_01',
    offlineCount: 6,
    severity: '严重',
    startTime: '2026/11/06 06:12:30',
    recoveryTime: '2026/11/06 06:40:00',
    productCategory: 'rv_allinone',
  },
  {
    id: 4,
    code: 'OFF-2026-004',
    faultContent: '设备告警',
    faultProduct: '固定式工业 RFID 读写设备_UHF_02',
    offlineCount: 7,
    severity: '消息',
    startTime: '2026/11/05 23:10:45',
    recoveryTime: '2026/11/05 23:50:12',
    productCategory: 'fixed_reader',
  },
  {
    id: 5,
    code: 'OFF-2026-005',
    faultContent: 'RFID过车数据心跳断联告警',
    faultProduct: 'PLC 智能协议转换控制器_PLC_Master',
    offlineCount: 4,
    severity: '重大',
    startTime: '2026/11/05 19:30:00',
    recoveryTime: '2026/11/05 20:15:22',
    productCategory: 'controller',
  },
  {
    id: 6,
    code: 'OFF-2026-006',
    faultContent: '天线驻波比阻抗匹配异常',
    faultProduct: 'RV 电子标签打印读写一体机_RV_03',
    offlineCount: 2,
    severity: '一般',
    startTime: '2026/11/05 14:05:10',
    recoveryTime: '2026/11/05 14:28:40',
    productCategory: 'rv_allinone',
  },
];

interface DualBaseLocationItem {
  rank: number;
  locationName: string;
  district: string;
  rfidRate: number;
  videoRate: number;
  avgRate: number;
  status: 'excellent' | 'normal' | 'attention';
  xPct: number;
  yPct: number;
}

const TOP10_DUAL_BASE_LOCATIONS: DualBaseLocationItem[] = [
  { rank: 1, locationName: '天津市河西区湘江道 34号', district: '河西区湘江道核心卡口', rfidRate: 99.5, videoRate: 98.9, avgRate: 99.20, status: 'excellent', xPct: 45, yPct: 42 },
  { rank: 2, locationName: '天津滨海新区港区智能卡口 01#', district: '滨海新区集装箱货运通道', rfidRate: 99.2, videoRate: 98.6, avgRate: 98.90, status: 'excellent', xPct: 68, yPct: 35 },
  { rank: 3, locationName: '天津西青区智造工业园区 02#', district: '西青区总装物流大门', rfidRate: 99.0, videoRate: 98.4, avgRate: 98.70, status: 'excellent', xPct: 32, yPct: 58 },
  { rank: 4, locationName: '天津南开区鞍山道智能卡口 03#', district: '南开区医疗物资配送站', rfidRate: 98.8, videoRate: 98.2, avgRate: 98.50, status: 'excellent', xPct: 40, yPct: 48 },
  { rank: 5, locationName: '天津津南区海河教育园卡口 04#', district: '海河教育园科研物资通道', rfidRate: 98.6, videoRate: 98.0, avgRate: 98.30, status: 'excellent', xPct: 55, yPct: 62 },
  { rank: 6, locationName: '天津北辰区陆港枢纽站 05#', district: '北辰区多式联运枢纽', rfidRate: 98.4, videoRate: 97.8, avgRate: 98.10, status: 'normal', xPct: 50, yPct: 22 },
  { rank: 7, locationName: '天津东丽区航空物流园区 06#', district: '东丽区机场保税物流口', rfidRate: 98.2, videoRate: 97.5, avgRate: 97.85, status: 'normal', xPct: 62, yPct: 40 },
  { rank: 8, locationName: '天津静海区综合保税区 07#', district: '静海区保税仓查验闸口', rfidRate: 98.0, videoRate: 97.2, avgRate: 97.60, status: 'normal', xPct: 28, yPct: 75 },
  { rank: 9, locationName: '天津武清区京津冀枢纽站 08#', district: '武清区电商物流中心', rfidRate: 97.8, videoRate: 97.0, avgRate: 97.40, status: 'normal', xPct: 38, yPct: 15 },
  { rank: 10, locationName: '天津宝坻区工业园通道 09#', district: '宝坻区智能装备基地', rfidRate: 97.5, videoRate: 96.8, avgRate: 97.15, status: 'normal', xPct: 58, yPct: 12 },
];

interface RfidTreeDeviceItem {
  id: string;
  name: string;
  category: 'fixed_reader' | 'controller' | 'rv_allinone';
  categoryLabel: string;
  ipAddress: string;
  deviceType: string;
  spec: string;
  status: 'online' | 'warning' | 'offline';
  uptimeStr: string;
  lastActiveTime: string;
  antennaVswr: {
    antenna1: { vswr: string; status: string; powerDbm: number };
    antenna2: { vswr: string; status: string; powerDbm: number };
    antenna3: { vswr: string; status: string; powerDbm: number };
    antenna4: { vswr: string; status: string; powerDbm: number };
  };
  noDataMonitoringMin: number;
  noDataCurrentMin: number;
  throughputPerSec: number;
}

const DEFAULT_TREE_RFID_DEVICES: RfidTreeDeviceItem[] = [
  // 1. 固定式读写设备
  {
    id: 'rfid-fix-01',
    name: '固定读写设备1',
    category: 'fixed_reader',
    categoryLabel: '固定式读写设备',
    ipAddress: '192.168.10.101',
    deviceType: '固定式超高频 RFID 读写设备',
    spec: '4通道 / 33dBm / Gen2 V2 / PoE+',
    status: 'online',
    uptimeStr: '128天 14小时 20分',
    lastActiveTime: '2026-11-06 08:06:45',
    antennaVswr: {
      antenna1: { vswr: '1.15', status: '匹配极佳', powerDbm: 30 },
      antenna2: { vswr: '1.22', status: '匹配良好', powerDbm: 30 },
      antenna3: { vswr: '1.18', status: '匹配极佳', powerDbm: 28 },
      antenna4: { vswr: '1.25', status: '匹配良好', powerDbm: 28 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 450,
  },
  {
    id: 'rfid-fix-02',
    name: '固定读写设备2',
    category: 'fixed_reader',
    categoryLabel: '固定式读写设备',
    ipAddress: '192.168.10.102',
    deviceType: '固定式工业 RFID 读写设备',
    spec: '4通道 / 30dBm / IP67 防尘防水',
    status: 'online',
    uptimeStr: '95天 06小时 10分',
    lastActiveTime: '2026-11-06 08:06:40',
    antennaVswr: {
      antenna1: { vswr: '1.18', status: '匹配极佳', powerDbm: 30 },
      antenna2: { vswr: '1.20', status: '匹配良好', powerDbm: 30 },
      antenna3: { vswr: '1.24', status: '匹配良好', powerDbm: 26 },
      antenna4: { vswr: '1.19', status: '匹配极佳', powerDbm: 26 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 380,
  },
  {
    id: 'rfid-fix-03',
    name: '固定读写设备3',
    category: 'fixed_reader',
    categoryLabel: '固定式读写设备',
    ipAddress: '192.168.10.103',
    deviceType: '固定式 PROFINET 读写设备',
    spec: '4通道 / 30dBm / 双网口环网',
    status: 'online',
    uptimeStr: '210天 10小时 00分',
    lastActiveTime: '2026-11-06 08:06:30',
    antennaVswr: {
      antenna1: { vswr: '1.12', status: '匹配极佳', powerDbm: 32 },
      antenna2: { vswr: '1.16', status: '匹配极佳', powerDbm: 32 },
      antenna3: { vswr: '1.21', status: '匹配良好', powerDbm: 30 },
      antenna4: { vswr: '1.28', status: '匹配良好', powerDbm: 30 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 520,
  },

  // 2. 控制器
  {
    id: 'rfid-ctrl-01',
    name: '控制器123',
    category: 'controller',
    categoryLabel: '控制器',
    ipAddress: '192.168.10.201',
    deviceType: '工业标识边缘解析控制器',
    spec: '8口 RS485/CAN / Linux 6.6 / 双网口',
    status: 'online',
    uptimeStr: '160天 18小时 40分',
    lastActiveTime: '2026-11-06 08:06:50',
    antennaVswr: {
      antenna1: { vswr: '1.10', status: '匹配极佳', powerDbm: 28 },
      antenna2: { vswr: '1.14', status: '匹配极佳', powerDbm: 28 },
      antenna3: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
      antenna4: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 620,
  },
  {
    id: 'rfid-ctrl-02',
    name: '控制器1234',
    category: 'controller',
    categoryLabel: '控制器',
    ipAddress: '192.168.10.202',
    deviceType: 'PLC 智能协议转换控制器',
    spec: '双千兆网口 / Modbus-TCP / Profinet',
    status: 'online',
    uptimeStr: '180天 12小时 00分',
    lastActiveTime: '2026-11-06 08:06:20',
    antennaVswr: {
      antenna1: { vswr: '1.12', status: '匹配极佳', powerDbm: 26 },
      antenna2: { vswr: '1.15', status: '匹配极佳', powerDbm: 26 },
      antenna3: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
      antenna4: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 410,
  },
  {
    id: 'rfid-ctrl-03',
    name: '控制器1235',
    category: 'controller',
    categoryLabel: '控制器',
    ipAddress: '192.168.10.203',
    deviceType: 'AGV 搬运移动读写控制器',
    spec: '防震动 / 24V DC / 无线 5G 模组',
    status: 'online',
    uptimeStr: '110天 08小时 30分',
    lastActiveTime: '2026-11-06 08:06:55',
    antennaVswr: {
      antenna1: { vswr: '1.14', status: '匹配极佳', powerDbm: 30 },
      antenna2: { vswr: '1.18', status: '匹配极佳', powerDbm: 30 },
      antenna3: { vswr: '1.15', status: '匹配极佳', powerDbm: 28 },
      antenna4: { vswr: '1.20', status: '匹配良好', powerDbm: 28 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 310,
  },

  // 3. RV一体机
  {
    id: 'rfid-rv-01',
    name: 'RV一体机1',
    category: 'rv_allinone',
    categoryLabel: 'RV一体机',
    ipAddress: '192.168.10.301',
    deviceType: 'RV 激光赋码/视觉/校验一体机',
    spec: '30W 飞秒激光 / CCD 视觉校验 / RFID 写入',
    status: 'online',
    uptimeStr: '145天 09小时 15分',
    lastActiveTime: '2026-11-06 08:06:58',
    antennaVswr: {
      antenna1: { vswr: '1.16', status: '匹配极佳', powerDbm: 28 },
      antenna2: { vswr: '1.19', status: '匹配极佳', powerDbm: 28 },
      antenna3: { vswr: '1.21', status: '匹配良好', powerDbm: 26 },
      antenna4: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 280,
  },
  {
    id: 'rfid-rv-02',
    name: 'RV一体机2',
    category: 'rv_allinone',
    categoryLabel: 'RV一体机',
    ipAddress: '192.168.10.302',
    deviceType: 'RV 工业高精喷码一体机',
    spec: '600DPI 墨水喷码 / 自动化感应读头',
    status: 'online',
    uptimeStr: '88天 14小时 00分',
    lastActiveTime: '2026-11-06 08:06:12',
    antennaVswr: {
      antenna1: { vswr: '1.15', status: '匹配极佳', powerDbm: 26 },
      antenna2: { vswr: '1.18', status: '匹配极佳', powerDbm: 26 },
      antenna3: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
      antenna4: { vswr: '暂无', status: '端口备用', powerDbm: 0 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 240,
  },
  {
    id: 'rfid-rv-03',
    name: 'RV一体机3',
    category: 'rv_allinone',
    categoryLabel: 'RV一体机',
    ipAddress: '192.168.10.303',
    deviceType: 'RV 电子标签打印读写一体机',
    spec: '热敏打印 / RFID 芯片实时编码',
    status: 'online',
    uptimeStr: '200天 05小时 40分',
    lastActiveTime: '2026-11-06 08:06:42',
    antennaVswr: {
      antenna1: { vswr: '1.16', status: '匹配极佳', powerDbm: 30 },
      antenna2: { vswr: '1.19', status: '匹配极佳', powerDbm: 30 },
      antenna3: { vswr: '1.21', status: '匹配良好', powerDbm: 28 },
      antenna4: { vswr: '1.23', status: '匹配良好', powerDbm: 28 },
    },
    noDataMonitoringMin: 15,
    noDataCurrentMin: 0,
    throughputPerSec: 350,
  },
];

export const ElectronicTagMonitorView: React.FC<Props> = ({
  tagDevices,
  initialSubTab = 'device',
  onOpenTerminal,
  onRefresh,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'device' | 'readrate' | 'inspection' | 'stats'>(initialSubTab);
  const [treeSearch, setTreeSearch] = useState('');
  const [mapSearch, setMapSearch] = useState('');
  const [selectedMapPoint, setSelectedMapPoint] = useState<DualBaseLocationItem>(TOP10_DUAL_BASE_LOCATIONS[0]);
  
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    fixed_reader: true,
    controller: true,
    rv_allinone: true,
  });
  const [selectedTreeDevice, setSelectedTreeDevice] = useState<RfidTreeDeviceItem>(DEFAULT_TREE_RFID_DEVICES[0]);
  
  const [deviceTimeRange, setDeviceTimeRange] = useState<DeviceTimeRangeKey>('24h');
  const [statsTimeRange, setStatsTimeRange] = useState<'1h' | '6h' | '24h' | '7d'>('24h');
  
  // States for 设备巡查信息 & 设备预警实时监控
  const [warningSearch, setWarningSearch] = useState('');
  const [warningFilterType, setWarningFilterType] = useState<'all' | 'network' | 'power' | 'vswr' | 'cpu' | 'temp'>('all');
  const [selectedWarningDetail, setSelectedWarningDetail] = useState<DeviceWarningMonitorItem | null>(null);

  // States for 监控统计 & 离线设备列表
  const [statsProductFilter, setStatsProductFilter] = useState<'all' | 'fixed_reader' | 'controller' | 'rv_allinone'>('all');
  const [statsSeverityFilter, setStatsSeverityFilter] = useState<'all' | '消息' | '轻微' | '一般' | '严重' | '重大'>('all');
  const [statsSearchQuery, setStatsSearchQuery] = useState('');
  const [selectedOfflineDetail, setSelectedOfflineDetail] = useState<OfflineDeviceItem | null>(null);

  useEffect(() => {
    if (initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [initialSubTab]);

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({ ...prev, [folderKey]: !prev[folderKey] }));
  };

  const filteredTreeDevices = DEFAULT_TREE_RFID_DEVICES.filter((item) =>
    item.name.toLowerCase().includes(treeSearch.toLowerCase()) ||
    item.categoryLabel.toLowerCase().includes(treeSearch.toLowerCase()) ||
    item.ipAddress.includes(treeSearch)
  );

  const fixedReadersList = filteredTreeDevices.filter(d => d.category === 'fixed_reader');
  const controllersList = filteredTreeDevices.filter(d => d.category === 'controller');
  const rvList = filteredTreeDevices.filter(d => d.category === 'rv_allinone');

  const filteredMapLocations = TOP10_DUAL_BASE_LOCATIONS.filter(loc =>
    loc.locationName.toLowerCase().includes(mapSearch.toLowerCase()) ||
    loc.district.toLowerCase().includes(mapSearch.toLowerCase())
  );

  const getDeviceTimeMultiplier = (r: DeviceTimeRangeKey) => {
    switch (r) {
      case '5m':
        return { multiplier: 1.0, label: '实时5分钟 (5s秒级采样)', avgThroughputScale: 1.0, totalTagMultiplier: 1 };
      case '1h':
        return { multiplier: 1.8, label: '近1小时 (流计算统计)', avgThroughputScale: 1.15, totalTagMultiplier: 12 };
      case '24h':
        return { multiplier: 6.2, label: '近24小时 (日累计分析)', avgThroughputScale: 1.28, totalTagMultiplier: 280 };
      case '7d':
        return { multiplier: 24.5, label: '近7天 (周趋势明细)', avgThroughputScale: 1.40, totalTagMultiplier: 1960 };
    }
  };

  const { multiplier, label: rangeTextLabel, avgThroughputScale, totalTagMultiplier } = getDeviceTimeMultiplier(deviceTimeRange);

  const scaledThroughput = Math.round(selectedTreeDevice.throughputPerSec * avgThroughputScale);
  const totalTagsInPeriod = (selectedTreeDevice.throughputPerSec * 60 * totalTagMultiplier / 10000).toFixed(1);

  return (
    <div className="space-y-5">
      {/* Top Banner Header */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <Radio className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  电子标识设备监控
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                    RFID & IDENTIFICATION SUITE
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  集中监控固定式读写设备、控制器、RV一体机、点位地图与双基识读率矩阵
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-slate-400">设备在线:</span>
              <span className="text-emerald-400 font-bold">{DEFAULT_TREE_RFID_DEVICES.length} 台</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">双基识读率:</span>
              <span className="text-cyan-300 font-bold">99.2%</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">视频识读率:</span>
              <span className="text-emerald-400 font-bold">98.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Subtab Panel 1: 设备监控 */}
      {activeSubTab === 'device' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Panel (lg:col-span-3): 监控列表 Tree View */}
          <div className="lg:col-span-3 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 flex flex-col h-[740px]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <Radio className="w-4 h-4 text-teal-400" />
                <span>监控列表</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                {DEFAULT_TREE_RFID_DEVICES.length}
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
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>

            {/* Tree Nodes List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              <div>
                <button
                  onClick={() => toggleFolder('fixed_reader')}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-800/60 text-slate-300 font-bold text-left transition-colors"
                >
                  {expandedFolders.fixed_reader ? (
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-cyan-400" />
                  )}
                  <span>固定式读写设备</span>
                </button>
                {expandedFolders.fixed_reader && (
                  <div className="pl-4 space-y-1 mt-0.5 border-l border-slate-800 ml-3">
                    {fixedReadersList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTreeDevice(item)}
                        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition-colors ${
                          selectedTreeDevice.id === item.id
                            ? 'bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30'
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

              <div>
                <button
                  onClick={() => toggleFolder('controller')}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-800/60 text-slate-300 font-bold text-left transition-colors"
                >
                  {expandedFolders.controller ? (
                    <FolderOpen className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-indigo-400" />
                  )}
                  <span>控制器</span>
                </button>
                {expandedFolders.controller && (
                  <div className="pl-4 space-y-1 mt-0.5 border-l border-slate-800 ml-3">
                    {controllersList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTreeDevice(item)}
                        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition-colors ${
                          selectedTreeDevice.id === item.id
                            ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleFolder('rv_allinone')}
                  className="w-full flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-slate-800/60 text-slate-300 font-bold text-left transition-colors"
                >
                  {expandedFolders.rv_allinone ? (
                    <FolderOpen className="w-4 h-4 text-purple-400" />
                  ) : (
                    <Folder className="w-4 h-4 text-purple-400" />
                  )}
                  <span>RV一体机</span>
                </button>
                {expandedFolders.rv_allinone && (
                  <div className="pl-4 space-y-1 mt-0.5 border-l border-slate-800 ml-3">
                    {rvList.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedTreeDevice(item)}
                        className={`w-full flex items-center gap-1.5 py-1 px-2 rounded text-left transition-colors ${
                          selectedTreeDevice.id === item.id
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
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-9 space-y-5">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-inner">
                    <Radio className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">{selectedTreeDevice.categoryLabel}</h3>
                      <span className="px-2.5 py-0.5 rounded text-xs font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold">
                        在线正常 (Online)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      选定设备: <span className="text-slate-200 font-bold">{selectedTreeDevice.name}</span> · IP: <span className="text-cyan-300">{selectedTreeDevice.ipAddress}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <button
                    onClick={() => onOpenTerminal(`rfid-cli --target ${selectedTreeDevice.ipAddress}`, selectedTreeDevice.ipAddress)}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <Terminal className="w-3.5 h-3.5 text-teal-400" />
                    <span>设备终端 (CLI)</span>
                  </button>
                </div>
              </div>

              {/* 时间标签 (实时5分 / 1小时 / 24小时 / 7天) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300 font-sans">
                  <Clock className="w-4 h-4 text-teal-400" />
                  <span className="font-bold">设备遥测时间切换:</span>
                  <span className="text-[11px] text-teal-400 font-mono">
                    {rangeTextLabel}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800/90 rounded-lg p-1">
                  {(['5m', '1h', '24h', '7d'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setDeviceTimeRange(r)}
                      className={`px-3 py-1 rounded-md transition-all font-bold ${
                        deviceTimeRange === r
                          ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`}
                    >
                      {r === '5m' ? '实时5分' : r === '1h' ? '1小时' : r === '24h' ? '24小时' : '7天'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 设备参数 Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">设备参数</h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  运行时间: {selectedTreeDevice.uptimeStr}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono pt-1">
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block font-sans">设备名称 :</span>
                  <span className="text-slate-100 font-bold block truncate" title={selectedTreeDevice.name}>
                    {selectedTreeDevice.name}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block font-sans">设备IP :</span>
                  <span className="text-cyan-300 font-bold block">
                    {selectedTreeDevice.ipAddress}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block font-sans">设备类型 :</span>
                  <span className="text-indigo-300 font-bold block truncate" title={selectedTreeDevice.deviceType}>
                    {selectedTreeDevice.deviceType}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 block font-sans">设备规格 :</span>
                  <span className="text-emerald-400 font-bold block truncate" title={selectedTreeDevice.spec}>
                    {selectedTreeDevice.spec}
                  </span>
                </div>
              </div>
            </div>

            {/* 驻波比 Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Signal className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">驻波比 (Antenna VSWR Telemetry)</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  [{deviceTimeRange === '5m' ? '实时5分' : deviceTimeRange === '1h' ? '1小时' : deviceTimeRange === '24h' ? '24小时' : '7天'}] 匹配门限 &lt; 1.50
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                      天线一
                    </span>
                    <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {selectedTreeDevice.antennaVswr.antenna1.status}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    {selectedTreeDevice.antennaVswr.antenna1.vswr}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>功率: {selectedTreeDevice.antennaVswr.antenna1.powerDbm} dBm</span>
                    <span>VSWR</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                      天线二
                    </span>
                    <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
                      {selectedTreeDevice.antennaVswr.antenna2.status}
                    </span>
                  </div>
                  <div className="text-2xl font-black text-emerald-300 mt-1">
                    {selectedTreeDevice.antennaVswr.antenna2.vswr}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>功率: {selectedTreeDevice.antennaVswr.antenna2.powerDbm} dBm</span>
                    <span>VSWR</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                      天线三
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      selectedTreeDevice.antennaVswr.antenna3.vswr === '暂无'
                        ? 'text-slate-500 bg-slate-900 border border-slate-800'
                        : 'text-cyan-400 bg-cyan-500/10'
                    }`}>
                      {selectedTreeDevice.antennaVswr.antenna3.status}
                    </span>
                  </div>
                  <div className={`text-2xl font-black mt-1 ${
                    selectedTreeDevice.antennaVswr.antenna3.vswr === '暂无' ? 'text-slate-500' : 'text-cyan-300'
                  }`}>
                    {selectedTreeDevice.antennaVswr.antenna3.vswr}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>功率: {selectedTreeDevice.antennaVswr.antenna3.powerDbm} dBm</span>
                    <span>VSWR</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-sans font-bold flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                      天线四
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      selectedTreeDevice.antennaVswr.antenna4.vswr === '暂无'
                        ? 'text-slate-500 bg-slate-900 border border-slate-800'
                        : 'text-cyan-400 bg-cyan-500/10'
                    }`}>
                      {selectedTreeDevice.antennaVswr.antenna4.status}
                    </span>
                  </div>
                  <div className={`text-2xl font-black mt-1 ${
                    selectedTreeDevice.antennaVswr.antenna4.vswr === '暂无' ? 'text-slate-500' : 'text-cyan-300'
                  }`}>
                    {selectedTreeDevice.antennaVswr.antenna4.vswr}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>功率: {selectedTreeDevice.antennaVswr.antenna4.powerDbm} dBm</span>
                    <span>VSWR</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 设备无数据监控 (min) Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-slate-100">设备无数据监控 (min)</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  超时阈值: 15 min (正常在线)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-sans block">当前无数据持续时长</span>
                    <div className="text-3xl font-black text-emerald-400 mt-1">
                      0 <span className="text-xs font-normal text-slate-400">min</span>
                    </div>
                    <span className="text-[11px] text-emerald-400 block mt-0.5">心跳正常，正在实时传输数据</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-sans block">无数据告警离线阈值</span>
                    <div className="text-3xl font-black text-purple-300 mt-1">
                      {selectedTreeDevice.noDataMonitoringMin} <span className="text-xs font-normal text-slate-400">min</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-0.5">超过 15 分钟触发离线告警</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Clock className="w-5 h-5" />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 font-sans block">选定周期平均识读速率</span>
                    <div className="text-3xl font-black text-blue-400 mt-1">
                      {scaledThroughput} <span className="text-xs font-normal text-slate-400">次/s</span>
                    </div>
                    <span className="text-[11px] text-blue-300 block mt-0.5">[{deviceTimeRange === '5m' ? '5分钟' : deviceTimeRange === '1h' ? '1小时' : deviceTimeRange === '24h' ? '24小时' : '7天'}] 累计 {totalTagsInPeriod} 万次</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <Zap className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Panel 2: 双基识读率 (Rebuilt according to screenshot image_f67f5ca8.png) */}
      {activeSubTab === 'readrate' && (
        <div className="space-y-5">
          {/* Top KPI Metrics (Reconstructing image_f67f5ca8.png: 全网识别率 - RFID系统识读率 99.2% & 视频系统识读率 98.9%) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-sans block">全网 RFID 系统识读率</span>
                <div className="text-3xl font-black text-rose-400 mt-1">
                  99.2%
                </div>
                <span className="text-[11px] text-rose-300 block mt-0.5">RFID系统识读率 (全网实时)</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Radio className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-sans block">全网视频系统识读率</span>
                <div className="text-3xl font-black text-emerald-400 mt-1">
                  98.9%
                </div>
                <span className="text-[11px] text-emerald-400 block mt-0.5">视频系统识读 (AI CCD 视觉)</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Eye className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-sans block">双基融合综合识读率</span>
                <div className="text-3xl font-black text-cyan-300 mt-1">
                  99.6%
                </div>
                <span className="text-[11px] text-cyan-400 block mt-0.5">双频互补卡口融合准确率</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Zap className="w-6 h-6" />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-slate-400 font-sans block">监控卡口点位总数</span>
                <div className="text-3xl font-black text-purple-300 mt-1">
                  10 <span className="text-xs font-normal text-slate-400">个点位</span>
                </div>
                <span className="text-[11px] text-slate-400 block mt-0.5">点位地图覆盖率 100%</span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <MapPin className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Main Grid: [Left 7 Cols] 点位地图 (GIS Interactive Map)  [Right 5 Cols] 双击识别率 (top10) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column (lg:col-span-7): 点位地图 (Preserved search & location pin map) */}
            <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">点位地图</h3>
                </div>

                {/* 点位搜索 (Preserved exact input: 请输入点位名称 + 搜索) */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="请输入点位名称"
                      value={mapSearch}
                      onChange={(e) => setMapSearch(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-48"
                    />
                  </div>
                  <button
                    onClick={() => {}}
                    className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-mono transition-colors"
                  >
                    搜索
                  </button>
                </div>
              </div>

              {/* Interactive GIS Map Canvas Simulation */}
              <div className="relative bg-slate-950 rounded-xl border border-slate-800/90 h-[460px] overflow-hidden p-4">
                {/* SVG Dark GIS Cyber Map Lines Background */}
                <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6,182,212,0.15)" strokeWidth="0.8" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Simulated River & Highway Routes */}
                  <path d="M 0 150 Q 200 120 400 250 T 800 320" fill="none" stroke="#0284c7" strokeWidth="6" opacity="0.4" />
                  <path d="M 100 0 Q 300 220 500 460" fill="none" stroke="#0ea5e9" strokeWidth="3" opacity="0.3" strokeDasharray="6,6" />
                  <path d="M 0 350 L 800 200" fill="none" stroke="#10b981" strokeWidth="4" opacity="0.3" />
                </svg>

                {/* Location Map Pins (Interactive) */}
                {filteredMapLocations.map((loc) => {
                  const isSelected = selectedMapPoint.rank === loc.rank;
                  return (
                    <button
                      key={loc.rank}
                      onClick={() => setSelectedMapPoint(loc)}
                      style={{ left: `${loc.xPct}%`, top: `${loc.yPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300 z-10 ${
                        isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                      }`}
                    >
                      <div className="relative flex items-center justify-center">
                        <span className={`absolute w-7 h-7 rounded-full animate-ping opacity-75 ${
                          isSelected ? 'bg-cyan-400' : 'bg-emerald-500/40'
                        }`} />
                        <div className={`w-8 h-8 rounded-full border flex items-center justify-center shadow-lg transition-all ${
                          isSelected
                            ? 'bg-cyan-500 border-white text-slate-950 font-black shadow-cyan-500/50'
                            : 'bg-slate-900/90 border-cyan-500/60 text-cyan-300'
                        }`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                      </div>
                      <span className="absolute left-1/2 -translate-x-1/2 top-9 px-2 py-0.5 rounded bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-200 whitespace-nowrap opacity-90 group-hover:opacity-100 shadow-md">
                        {loc.rank}. {loc.district.split('')[0]}{loc.district.substring(1, 4)}
                      </span>
                    </button>
                  );
                })}

                {/* Selected Location Details Popup Box (Preserved exact popup fields from screenshot) */}
                {selectedMapPoint && (
                  <div className="absolute top-4 right-4 bg-slate-900/95 border border-cyan-500/50 rounded-xl p-4 shadow-xl backdrop-blur-md w-72 z-20 space-y-2.5 font-mono text-xs animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <span className="text-cyan-400 font-bold flex items-center gap-1.5 font-sans">
                        <Navigation className="w-3.5 h-3.5" />
                        点位详情卡片
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                        TOP #{selectedMapPoint.rank}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-slate-300">
                        <span className="text-slate-400 block font-sans">点位名称:</span>
                        <span className="font-bold text-slate-100 font-sans block">{selectedMapPoint.locationName}</span>
                      </div>

                      <div className="p-2 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-sans">RFID系统识读率:</span>
                          <span className="text-rose-400 font-black">{selectedMapPoint.rfidRate}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-sans">视频系统识读率:</span>
                          <span className="text-emerald-400 font-black">{selectedMapPoint.videoRate}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[11px]">
                        <span className="text-slate-400 font-sans">双基融合平均识读率:</span>
                        <span className="text-cyan-300 font-bold">{selectedMapPoint.avgRate}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Footer Note */}
                <div className="absolute bottom-3 left-3 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>实时高精矢量 GIS 点位矩阵已就绪 · 点击地标点位查看测值</span>
                </div>
              </div>
            </div>

            {/* Right Column (lg:col-span-5): 双击识别率 (top10) Table (Preserved exact columns: 排名, 位置, RFID, 视频, 平均值) */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100">
                    双击识别率 (top10)
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  前 10 名识读矩阵
                </span>
              </div>

              {/* Preserved Table: 排名, 位置, RFID, 视频, 平均值 */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                      <th className="py-2.5 px-2">排名</th>
                      <th className="py-2.5 px-3">位置</th>
                      <th className="py-2.5 px-2 text-rose-400">RFID</th>
                      <th className="py-2.5 px-2 text-emerald-400">视频</th>
                      <th className="py-2.5 px-2 text-right text-cyan-300">平均值</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    {TOP10_DUAL_BASE_LOCATIONS.map((row) => (
                      <tr
                        key={row.rank}
                        onClick={() => setSelectedMapPoint(row)}
                        className={`hover:bg-slate-950/80 transition-colors cursor-pointer ${
                          selectedMapPoint.rank === row.rank ? 'bg-cyan-950/30' : ''
                        }`}
                      >
                        <td className="py-2 px-2">
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-md font-bold text-[10px] ${
                            row.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                            row.rank === 2 ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' :
                            row.rank === 3 ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                            'bg-slate-800 text-slate-400'
                          }`}>
                            {row.rank}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-200 font-sans truncate max-w-[140px]" title={row.locationName}>
                          {row.locationName}
                        </td>
                        <td className="py-2 px-2 font-bold text-rose-400">
                          {row.rfidRate}%
                        </td>
                        <td className="py-2 px-2 font-bold text-emerald-400">
                          {row.videoRate}%
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-cyan-300">
                          {row.avgRate}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer Summary */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>平均双基融合率: 98.45%</span>
                <span className="text-emerald-400">双频抗干扰: 优秀</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Panel 3: 设备巡查信息 (Rebuilt according to image_ea4acb3b.png) */}
      {activeSubTab === 'inspection' && (
        <div className="space-y-6">
          {/* Top Header & Filter Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldAlert className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  设备巡查与预警实时监控
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                    2026 实时遥测
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  集中监控电子标识设备网络连通、功率增益、天线驻波比与芯片温度
                </p>
              </div>
            </div>

            {/* Filter Pill Buttons & Search Box */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索点位名称 / 设备型号..."
                  value={warningSearch}
                  onChange={(e) => setWarningSearch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-56"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-1">
                {(
                  [
                    { key: 'all', label: '全部预警' },
                    { key: 'network', label: '网络中断' },
                    { key: 'power', label: '功率异常' },
                    { key: 'vswr', label: '驻波异常' },
                    { key: 'cpu', label: 'CPU高负载' },
                    { key: 'temp', label: '温度异常' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setWarningFilterType(f.key)}
                    className={`px-2.5 py-1 rounded transition-all font-bold ${
                      warningFilterType === f.key
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => alert('已开启设备现场巡查派发工单向导')}
                className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition-all flex items-center gap-1.5"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>+ 登记现场巡查</span>
              </button>
            </div>
          </div>

          {/* Section 1: 设备巡查信息 (5 KPI Cards Matching image_ea4acb3b.png) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">设备巡查信息</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                数据实时更新于: 2026-11-06 08:46:48 (点击卡片快捷筛选)
              </span>
            </div>

            {/* 5 Cards Row - Preserved values & titles from screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 font-mono">
              {/* Card 1: 设备网络中断 (98%) */}
              <button
                onClick={() => setWarningFilterType(warningFilterType === 'network' ? 'all' : 'network')}
                className={`p-4 rounded-xl text-left transition-all border ${
                  warningFilterType === 'network'
                    ? 'bg-rose-950/40 border-rose-500 shadow-rose-900/30 shadow-md scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-rose-500/50 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <Wifi className="w-5 h-5 animate-pulse" />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
                    网络中断
                  </span>
                </div>
                <div className="text-3xl font-black text-rose-500 mt-3">
                  98%
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 font-sans">
                  设备网络中断
                </div>
                <div className="text-[10px] text-rose-400/80 mt-1 flex items-center justify-between">
                  <span>断联/心跳丢失</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Card 2: 功率异常 (3.1%) */}
              <button
                onClick={() => setWarningFilterType(warningFilterType === 'power' ? 'all' : 'power')}
                className={`p-4 rounded-xl text-left transition-all border ${
                  warningFilterType === 'power'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-emerald-900/30 shadow-md scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    功率偏低
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-3">
                  3.1%
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 font-sans">
                  功率异常
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center justify-between">
                  <span>RF 功率抖动</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Card 3: 天线驻波异常 (10.1%) */}
              <button
                onClick={() => setWarningFilterType(warningFilterType === 'vswr' ? 'all' : 'vswr')}
                className={`p-4 rounded-xl text-left transition-all border ${
                  warningFilterType === 'vswr'
                    ? 'bg-amber-950/40 border-amber-500 shadow-amber-900/30 shadow-md scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-amber-500/50 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Radio className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                    驻波失配
                  </span>
                </div>
                <div className="text-3xl font-black text-amber-400 mt-3">
                  10.1%
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 font-sans">
                  天线驻波异常
                </div>
                <div className="text-[10px] text-amber-400/80 mt-1 flex items-center justify-between">
                  <span>VSWR &gt; 1.50</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Card 4: CPU利用率高项 (8.9%) */}
              <button
                onClick={() => setWarningFilterType(warningFilterType === 'cpu' ? 'all' : 'cpu')}
                className={`p-4 rounded-xl text-left transition-all border ${
                  warningFilterType === 'cpu'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-emerald-900/30 shadow-md scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    CPU高负荷
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-3">
                  8.9%
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 font-sans">
                  CPU利用率高项
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center justify-between">
                  <span>边缘并发流负载</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Card 5: 温度异常 (12.1%) */}
              <button
                onClick={() => setWarningFilterType(warningFilterType === 'temp' ? 'all' : 'temp')}
                className={`p-4 rounded-xl text-left transition-all border ${
                  warningFilterType === 'temp'
                    ? 'bg-emerald-950/40 border-emerald-500 shadow-emerald-900/30 shadow-md scale-[1.02]'
                    : 'bg-slate-950/70 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                    过温告警
                  </span>
                </div>
                <div className="text-3xl font-black text-emerald-400 mt-3">
                  12.1%
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1 font-sans">
                  温度异常
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1 flex items-center justify-between">
                  <span>风扇/机柜温控</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: 设备预警实时监控 (Data Table matching image_ea4acb3b.png) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4.5 h-4.5 text-rose-400" />
                <h3 className="text-sm font-bold text-slate-100">设备预警实时监控</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  共 {DEVICE_WARNING_MONITOR_LIST.length} 条记录
                </span>
              </div>

              {warningFilterType !== 'all' && (
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">已按预警类型过滤:</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 flex items-center gap-1">
                    {warningFilterType === 'network' && '设备网络中断'}
                    {warningFilterType === 'power' && '功率异常'}
                    {warningFilterType === 'vswr' && '天线驻波异常'}
                    {warningFilterType === 'cpu' && 'CPU利用率高项'}
                    {warningFilterType === 'temp' && '温度异常'}
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-white" onClick={() => setWarningFilterType('all')} />
                  </span>
                </div>
              )}
            </div>

            {/* Preserved Data Table: 设备型号, 点位名称, 预警名称, 报警时间, 安装时间, 设备功率, 温度 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-3">设备型号</th>
                    <th className="py-3 px-3">点位名称</th>
                    <th className="py-3 px-3">预警名称</th>
                    <th className="py-3 px-3">报警时间</th>
                    <th className="py-3 px-3">安装时间</th>
                    <th className="py-3 px-3 text-center">设备功率</th>
                    <th className="py-3 px-3 text-center">温度</th>
                    <th className="py-3 px-3 text-right">诊断 / 操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {DEVICE_WARNING_MONITOR_LIST
                    .filter((row) => {
                      const matchesSearch =
                        row.model.toLowerCase().includes(warningSearch.toLowerCase()) ||
                        row.pointName.toLowerCase().includes(warningSearch.toLowerCase()) ||
                        row.warningName.toLowerCase().includes(warningSearch.toLowerCase());
                      const matchesFilter =
                        warningFilterType === 'all' || row.warningTypes.includes(warningFilterType);
                      return matchesSearch && matchesFilter;
                    })
                    .map((row) => (
                      <tr
                        key={row.id}
                        className="hover:bg-slate-950/80 transition-colors cursor-pointer group"
                        onClick={() => setSelectedWarningDetail(row)}
                      >
                        <td className="py-3 px-3 font-bold text-cyan-300 font-mono">
                          {row.model}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-200 font-sans">
                          {row.pointName}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-sans font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30 inline-block">
                            {row.warningName}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono">
                          {row.alarmTime}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono">
                          {row.installTime}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-200 font-mono">
                          {row.devicePower}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-emerald-400 font-mono">
                          {row.temperature}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWarningDetail(row);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-sans font-bold text-[11px] border border-slate-700 transition-colors"
                          >
                            查验诊断
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostic Detail Popover Modal */}
      {selectedWarningDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  设备预警遥测诊断 ({selectedWarningDetail.model})
                </h3>
              </div>
              <button
                onClick={() => setSelectedWarningDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-slate-400 block font-sans">点位名称:</span>
                  <span className="text-slate-100 font-bold font-sans block truncate">{selectedWarningDetail.pointName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">设备 IP:</span>
                  <span className="text-cyan-300 font-bold block">{selectedWarningDetail.ipAddress}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">预警名称:</span>
                  <span className="text-rose-400 font-bold block">{selectedWarningDetail.warningName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">固件版本:</span>
                  <span className="text-slate-300 font-bold block">{selectedWarningDetail.firmwareVersion}</span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">报警时间</span>
                  <span className="text-slate-200 font-bold text-[11px] block mt-1">{selectedWarningDetail.alarmTime}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">安装时间</span>
                  <span className="text-slate-300 font-bold text-[11px] block mt-1">{selectedWarningDetail.installTime}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">设备功率</span>
                  <span className="text-amber-400 font-black text-sm block mt-1">{selectedWarningDetail.devicePower}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">设备温度</span>
                  <span className="text-emerald-400 font-black text-sm block mt-1">{selectedWarningDetail.temperature}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-slate-300 font-sans">
                <span className="text-slate-400 text-xs font-bold block">遥测系统诊断分析建议:</span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  检测到卡口硬件与 RFID 天线匹配正常，已触发 PoE 链路重握手命令。建议现场人员复核阻抗匹配并清除冷却风道。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  alert(`已下发远程 Ping 与硬件探针指令至 ${selectedWarningDetail.ipAddress}`);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-sans transition-colors"
              >
                远程探针测试
              </button>
              <button
                onClick={() => {
                  alert(`已成功处理预警 ${selectedWarningDetail.id} 并关单！`);
                  setSelectedWarningDetail(null);
                }}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold font-sans transition-colors"
              >
                一键解决/归档
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtab Panel 4: 监控统计 (Rebuilt according to image_2013048d.png) */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6">
          {/* Top Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl px-5 py-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
                <BarChart3 className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 font-sans">
                  电子标识设备监控统计
                  <span className="text-xs px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono">
                    2026 大屏全景
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  各级别告警汇总、设备在线率、过车数据回传率与离线故障明细
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs font-mono">
                {(['1h', '6h', '24h', '7d'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setStatsTimeRange(r)}
                    className={`px-3 py-1 rounded-md transition-all font-bold ${
                      statsTimeRange === r
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                    }`}
                  >
                    {r === '1h' ? '1小时' : r === '6h' ? '6小时' : r === '24h' ? '24小时' : '近7天'}
                  </button>
                ))}
              </div>

              <button
                onClick={() => alert('已生成电子标识设备监控统计报表！')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700/60"
              >
                <DownloadCloud className="w-3.5 h-3.5 text-teal-400" />
                导出报表
              </button>
            </div>
          </div>

          {/* Section 1: 各级别告警数量 (5 Severity Indicator Boxes matching image_2013048d.png) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-amber-400" />
                <h3 className="text-sm font-bold text-slate-100 font-sans">各级别告警数量</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                按全网告警严重程度统计
              </span>
            </div>

            {/* 5 Severity Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 font-mono">
              {/* 消息 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold text-cyan-400 block font-sans">消息</span>
                  <div className="text-2xl font-black text-cyan-300 mt-1">
                    123 <span className="text-xs font-normal text-slate-400">条</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Info className="w-5 h-5" />
                </div>
              </div>

              {/* 轻微 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block font-sans">轻微</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    123 <span className="text-xs font-normal text-slate-400">条</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* 一般 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold text-amber-400 block font-sans">一般</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    12 <span className="text-xs font-normal text-slate-400">条</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              </div>

              {/* 严重 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-orange-500/30 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold text-orange-400 block font-sans">严重</span>
                  <div className="text-2xl font-black text-orange-400 mt-1">
                    12 <span className="text-xs font-normal text-slate-400">条</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>

              {/* 重大 */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between shadow-xs">
                <div>
                  <span className="text-xs font-bold text-rose-400 block font-sans">重大</span>
                  <div className="text-2xl font-black text-rose-500 mt-1">
                    12 <span className="text-xs font-normal text-slate-400">条</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                  <Zap className="w-5 h-5 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Metric Gauges & Rate Displays (Matching image_2013048d.png middle section) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Block (lg:col-span-4): 设备在线率 */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-sans">设备在线率</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">实时健康</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                {/* 控制器 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-2xl font-black text-emerald-400">99.5%</div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-sans text-slate-300 block">控制器</span>
                </div>

                {/* RV一体机 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-2xl font-black text-amber-400">45.5%</div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                    <Tv className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-sans text-slate-300 block">RV一体机</span>
                </div>

                {/* 固定式读写设备 */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-2xl font-black text-amber-400">45.5%</div>
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                    <Radio className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] font-sans text-slate-300 block">固定式读写设备</span>
                </div>
              </div>
            </div>

            {/* Middle Block (lg:col-span-4): RFID过车数据回传率 & 天线安装质量统计 */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <span className="text-xs text-slate-400 font-sans font-bold block">
                  RFID过车数据回传率
                </span>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  45.5%
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: '45.5%' }} />
                </div>
                <span className="text-[10px] text-slate-500 font-mono">
                  边缘链路数据实时上报比
                </span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-3">
                <span className="text-xs text-slate-400 font-sans font-bold block">
                  天线安装质量统计
                </span>
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  98.5%
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: '98.5%' }} />
                </div>
                <span className="text-[10px] text-emerald-400/80 font-mono">
                  阻抗驻波比合格率
                </span>
              </div>
            </div>

            {/* Right Block (lg:col-span-4): 严重故障告警率 */}
            <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100 font-sans">严重故障告警率</h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">低故障运行</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-2xl font-black text-emerald-400">0.5%</div>
                  <span className="text-[11px] font-sans text-slate-400 block mt-2">控制器</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-2xl font-black text-emerald-400">0.5%</div>
                  <span className="text-[11px] font-sans text-slate-400 block mt-2">RV一体机</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-2xl font-black text-emerald-400">0.5%</div>
                  <span className="text-[11px] font-sans text-slate-400 block mt-2">固定式读写设备</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: 离线设备列表 (Data Table matching image_2013048d.png bottom section) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-4.5 h-4.5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100 font-sans">离线设备列表</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                  共 {OFFLINE_DEVICE_LIST.length} 条记录
                </span>
              </div>

              {/* Controls matching screenshot: Dropdown 全部产品 + 告警时间 search + 搜索按钮 */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <select
                  value={statsProductFilter}
                  onChange={(e) => setStatsProductFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                >
                  <option value="all">全部产品</option>
                  <option value="fixed_reader">固定式读写设备</option>
                  <option value="controller">控制器</option>
                  <option value="rv_allinone">RV一体机</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索故障内容 / 故障产品..."
                    value={statsSearchQuery}
                    onChange={(e) => setStatsSearchQuery(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-52"
                  />
                </div>

                <button
                  onClick={() => {}}
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs font-sans transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>

            {/* Preserved Exact Table Columns: 编号, 故障内容, 故障产品, 离线次数, 告警级别, 发生时间, 恢复时间, 操作 */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="py-3 px-3 w-14">编号</th>
                    <th className="py-3 px-3">故障内容</th>
                    <th className="py-3 px-3">故障产品</th>
                    <th className="py-3 px-3 text-center">离线次数</th>
                    <th className="py-3 px-3 text-center">告警级别</th>
                    <th className="py-3 px-3">发生时间</th>
                    <th className="py-3 px-3">恢复时间</th>
                    <th className="py-3 px-3 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {OFFLINE_DEVICE_LIST
                    .filter((row) => {
                      const matchesSearch =
                        row.faultContent.toLowerCase().includes(statsSearchQuery.toLowerCase()) ||
                        row.faultProduct.toLowerCase().includes(statsSearchQuery.toLowerCase());
                      const matchesProduct =
                        statsProductFilter === 'all' || row.productCategory === statsProductFilter;
                      return matchesSearch && matchesProduct;
                    })
                    .map((row) => (
                      <tr key={row.id} className="hover:bg-slate-950/80 transition-colors">
                        <td className="py-3 px-3 text-slate-400 font-mono font-bold">
                          {row.id}
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-200 font-sans">
                          {row.faultContent}
                        </td>
                        <td className="py-3 px-3 text-cyan-300 font-mono">
                          {row.faultProduct}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-amber-400">
                          {row.offlineCount}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-sans font-bold ${
                            row.severity === '消息' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30' :
                            row.severity === '轻微' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                            row.severity === '一般' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                            row.severity === '严重' ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30' :
                            'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}>
                            {row.severity}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300 font-mono">
                          {row.startTime}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-mono">
                          {row.recoveryTime}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => setSelectedOfflineDetail(row)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 font-sans font-bold text-[11px] border border-slate-700 transition-colors"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Preserved Pagination Bar matching image_2013048d.png */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono text-slate-400">
              <span>显示第 1 至 6 条，共 6 条记录</span>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <button className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400">
                    &lt;
                  </button>
                  <button className="px-2.5 py-1 rounded bg-cyan-600 text-white font-bold">
                    1
                  </button>
                  <button className="px-2 py-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-400">
                    &gt;
                  </button>
                </div>

                <select className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 focus:outline-none">
                  <option value="10">10条/页</option>
                  <option value="20">20条/页</option>
                  <option value="50">50条/页</option>
                </select>

                <div className="flex items-center gap-1.5">
                  <span>跳至</span>
                  <input
                    type="text"
                    defaultValue="1"
                    className="w-10 bg-slate-950 border border-slate-800 rounded px-1.5 py-1 text-center text-slate-200"
                  />
                  <span>页</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Device Detail Popover Modal */}
      {selectedOfflineDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-slate-100 font-sans">
                  离线故障记录详情 ({selectedOfflineDetail.code})
                </h3>
              </div>
              <button
                onClick={() => setSelectedOfflineDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div>
                  <span className="text-slate-400 block font-sans">故障产品:</span>
                  <span className="text-cyan-300 font-bold font-mono block">{selectedOfflineDetail.faultProduct}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-sans">故障内容描述:</span>
                  <span className="text-slate-100 font-bold font-sans block">{selectedOfflineDetail.faultContent}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">离线次数</span>
                  <span className="text-amber-400 font-black text-base block mt-1">{selectedOfflineDetail.offlineCount} 次</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">告警级别</span>
                  <span className="text-rose-400 font-black text-sm block mt-1">{selectedOfflineDetail.severity}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block font-sans">恢复状态</span>
                  <span className="text-emerald-400 font-black text-sm block mt-1">已恢复连通</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400 font-sans">故障发生时间:</span>
                  <span>{selectedOfflineDetail.startTime}</span>
                </div>
                <div className="flex justify-between text-slate-300 pt-1">
                  <span className="text-slate-400 font-sans">链路恢复时间:</span>
                  <span className="text-emerald-400">{selectedOfflineDetail.recoveryTime}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedOfflineDetail(null)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold font-sans transition-colors"
              >
                确认关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
