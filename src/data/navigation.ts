import { MenuGroup } from '../types';

export const NAVIGATION_GROUPS: MenuGroup[] = [
  {
    key: 'monitoring',
    label: '集中监控',
    iconName: 'Activity',
    children: [
      {
        key: 'mon_it',
        label: 'IT设备监控',
        description: '网络设备监控、服务器监控与 IT 监控统计全息看板',
        children: [
          {
            key: 'mon_it_network',
            label: '网络设备监控',
            description: '400G 无损以太网 Fabric、核心 Spine/Leaf 交换机与端口遥测',
          },
          {
            key: 'mon_it_server',
            label: '服务器监控',
            description: '物理服务器 CPU、内存、带外 BMC、风扇功耗与微模块机架',
          },
          {
            key: 'mon_it_stats',
            label: '监控统计',
            description: '硬件可用性 SLA、算力负荷分布与网络丢包率报表统计',
          },
        ],
      },
      {
        key: 'mon_os',
        label: '操作系统监控',
        description: 'openEuler / Linux 6.6 内核负载、上下文切换、虚拟内存与磁盘挂载 I/O',
        children: [
          {
            key: 'mon_os_system',
            label: '系统监控',
            description: '主机系统实时遥测、内核参数、负载、内存与磁盘挂载监控',
          },
          {
            key: 'mon_os_stats',
            label: '监控统计',
            description: '操作系统分布统计、发行版健康度、内核事件与性能达标率',
          },
        ],
      },
      {
        key: 'mon_container',
        label: '容器监控',
        description: 'Kubernetes v1.30 集群、Pod 分布、CPU/Memory 限额与 Cilium 网络',
        children: [
          {
            key: 'mon_container_data',
            label: '监控数据',
            description: 'K8s 生产集群工作负载、Pod 实时指标、限额超售与容器终端',
          },
          {
            key: 'mon_container_stats',
            label: '监控统计',
            description: '容器生命周期统计、命名空间配额率、重启频次分布与调度健康度',
          },
        ],
      },
      {
        key: 'mon_middleware',
        label: '中间件监控',
        description: 'WEB应用接入、Kafka 消息队列、Redis 缓存集群与中间件全息统计',
        children: [
          {
            key: 'mon_mw_web',
            label: 'WEB中间件监控',
            description: 'Nginx 高性能反向代理、Ingress 网关与 Tomcat / Spring Boot 应用容器',
          },
          {
            key: 'mon_mw_msg',
            label: '消息中间件监控',
            description: 'Apache Kafka 3.7、RocketMQ 5.2 主题分区、消费延迟与集群吞吐',
          },
          {
            key: 'mon_mw_cache',
            label: '缓存中间件监控',
            description: 'Redis 7.2 分布式集群分片、命中率、内存碎片率与热 Key 监控',
          },
          {
            key: 'mon_mw_stats',
            label: '监控统计',
            description: '中间件可用度 SLA、QPS/TPS 流量分布、JVM 堆内存与告警收敛',
          },
        ],
      },
      {
        key: 'mon_database',
        label: '数据库监控',
        description: 'ClickHouse 24.3、Apache Doris、PostgreSQL 16 与慢查询优化分析',
        children: [
          {
            key: 'mon_db_data',
            label: '监控数据',
            description: '数据库实例活跃会话、QPS/TPS、复制延迟、慢查询与分布式分片状态',
          },
          {
            key: 'mon_db_stats',
            label: '监控统计',
            description: '数据库引擎分布、存储空间消耗、慢 SQL 频次排行与可用度报表',
          },
        ],
      },
      {
        key: 'mon_rfid',
        label: '电子标识设备监控',
        description: '工业互联网标识解析体系、工业 RFID 智能读写器、边缘网关与设备告警',
        children: [
          {
            key: 'mon_rfid_device',
            label: '设备监控',
            description: '电子标识读写器、边缘网关、激光赋码机在线状态与天线场强遥测',
          },
          {
            key: 'mon_rfid_readrate',
            label: '双基识读率',
            description: '高频 / 超高频双基频协议标签捕获率、识读成功率与漏读率分析',
          },
          {
            key: 'mon_rfid_inspection',
            label: '设备巡查信息',
            description: '现场巡检记录、防爆安检、天线驻波比校准与设备巡检日志',
          },
          {
            key: 'mon_rfid_stats',
            label: '监控统计',
            description: '电子标识标签吞吐、识别耗时、驻波比比对与故障频次统计',
          },
        ],
      },
      {
        key: 'mon_alarm',
        label: '告警管理',
        description: '全域集中告警收敛、实时告警事件、告警过滤规则与工单闭环处置',
        children: [
          {
            key: 'mon_alarm_info',
            label: '告警信息',
            description: '全域集中致命、严重、警告级别即时异常告警流与工单处置',
          },
          {
            key: 'mon_alarm_rules',
            label: '告警过滤规则',
            description: '告警阈值、多指标过滤收敛规则、降噪与升级策略',
          },
        ],
      },
    ],
  },
  {
    key: 'event',
    label: '事件中心',
    iconName: 'AlertTriangle',
    badge: 5,
    children: [
      {
        key: 'evt_todo',
        label: '待办事件',
        description: '待处置活动告警流、紧急事件首响应与实时排障',
      },
      {
        key: 'evt_done',
        label: '已办事件',
        description: '已确认闭环事件台账、处置人回执与归档历史',
      },
      {
        key: 'evt_all',
        label: '所有事件',
        description: '全域事件总览台账、多维度事件检索与综合过滤',
      },
      {
        key: 'evt_review',
        label: '事件回顾',
        description: '重大事件 Root-Cause 根因复盘与演进事故链总结',
      },
      {
        key: 'evt_stats',
        label: '事件统计',
        description: '事件分类分布、MTTD / MTTR 响应效能与环比分析',
      },
    ],
  },
  {
    key: 'workorder',
    label: '工单管理',
    iconName: 'ClipboardList',
    children: [
      {
        key: 'wo_mgr',
        label: '工单管理',
        description: '我的工单、待办工单、已办工单、所有工单与工单回复流程',
        children: [
          {
            key: 'wo_my',
            label: '我的工单',
            description: '我提交与处理中的工单追踪、状态回执与评价',
          },
          {
            key: 'wo_pending',
            label: '待办工单',
            description: '待派发与待审批工单审核、现场操作与双人复核',
          },
          {
            key: 'wo_done',
            label: '已办工单',
            description: '已处理完毕与结案的工单记录台账与归档',
          },
          {
            key: 'wo_all',
            label: '所有工单',
            description: '全域运维工单总览、多条件检索与流转轨迹',
          },
          {
            key: 'wo_reply',
            label: '工单回复',
            description: '工单交互沟通、处理进度反馈与回复记录',
          },
        ],
      },
      {
        key: 'wo_change_review',
        label: '变更工单回顾',
        description: '变更单回顾管理与工单效能统计分析',
        children: [
          {
            key: 'wo_change_mgr',
            label: '变更单回顾管理',
            description: '重大系统变更、版本割接回顾管理与复盘',
          },
          {
            key: 'wo_stats',
            label: '工单统计',
            description: '工单处置履约率、平均解决时长与运维团队效能矩阵',
          },
        ],
      },
    ],
  },
  {
    key: 'knowledge',
    label: '知识库',
    iconName: 'BookOpen',
    children: [
      {
        key: 'kb_list',
        label: '知识库列表',
        description: '系统变更评估、知识库归档台账、实施验证与全效技术沉淀',
      },
    ],
  },
  {
    key: 'config',
    label: '配置管理',
    iconName: 'Sliders',
    children: [
      {
        key: 'cfg_items',
        label: '配置项数据',
        description: 'CMDB 资产配置项 (CI) 拓扑、版本快照、依赖关系与元数据映射',
      },
      {
        key: 'cfg_project',
        label: '项目信息配置',
        description: '业务项目环境架构、关联 CI 拓扑映射、PM 归属与割接上线属性配置',
      },
    ],
  },
  {
    key: 'system',
    label: '系统管理',
    iconName: 'ShieldCheck',
    children: [
      {
        key: 'sec_personnel',
        label: '人员管理',
        description: '运维人员档案、岗位工号、所属部门、手机邮箱与账号状态维护',
      },
      {
        key: 'sec_org',
        label: '组织管理',
        description: '基础设施处室组织架构树、部门职责、人员编制与上下级归属',
      },
      {
        key: 'sec_roles',
        label: '角色管理',
        description: '基于角色的访问控制 (RBAC) 细粒度资源操作授权与人员角色绑定',
      },
      {
        key: 'sec_resources',
        label: '资源管理',
        description: '系统菜单路由、操作按钮权限标识、API 接口资源与访问策略目录',
      },
      {
        key: 'sec_settings',
        label: '系统设置',
        description: '日志管理、账户策略、系统核心参数与数据字典维护',
        children: [
          {
            key: 'sec_logs',
            label: '日志管理',
            description: '全链路操作审计日志、系统异常追踪、登录存证与安全审计',
          },
          {
            key: 'sec_accounts',
            label: '账户管理',
            description: '运维账号全局策略、MFA 强制认证、密码过期周期与 IP 白名单',
          },
          {
            key: 'sec_sys_params',
            label: '系统参数维护',
            description: '数据采集粒度、告警收敛窗口、系统缓存与基础运行参数配置',
          },
          {
            key: 'sec_data_dicts',
            label: '数据字典维护',
            description: '设备类型、告警级别、工单优先级、存储协议等全局数据字典分类与键值',
          },
        ],
      },
    ],
  },
];
