import React, { useState, useEffect } from 'react';
import { 
  MenuKey, ServerNode, StorageDevice, SoftwareComponent, AlarmItem, 
  WorkOrder, UserAccount, RolePermission, AuditLog, ClusterConfigParam, 
  TelemetryAgent, KnowledgeArticle, OperatingSystemMetric, ContainerWorkload, 
  DatabaseInstance, ElectronicTagDevice 
} from './types';
import {
  INITIAL_SERVERS,
  INITIAL_STORAGE,
  INITIAL_NETWORKS,
  INITIAL_RACKS,
  INITIAL_COMPONENTS,
  INITIAL_COMPUTE_JOBS,
  INITIAL_TOPICS,
  INITIAL_QUERIES,
  INITIAL_ALARMS,
  INITIAL_RULES,
  INITIAL_WORK_ORDERS,
  INITIAL_USERS,
  INITIAL_ROLES,
  INITIAL_AUDIT_LOGS,
  INITIAL_CONFIG_PARAMS,
  INITIAL_AGENTS,
  INITIAL_KNOWLEDGE_ARTICLES,
  INITIAL_OS_METRICS,
  INITIAL_CONTAINERS,
  INITIAL_DATABASES,
  INITIAL_ELECTRONIC_TAGS,
} from './data/mockData';

// Layout
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NAVIGATION_GROUPS } from './data/navigation';

// Modals & Drawers
import { ServerDetailDrawer } from './components/modals/ServerDetailDrawer';
import { WorkOrderDetailModal } from './components/modals/WorkOrderDetailModal';
import { WorkOrderCreateModal } from './components/modals/WorkOrderCreateModal';
import { AlarmActionModal } from './components/modals/AlarmActionModal';
import { ComponentActionModal } from './components/modals/ComponentActionModal';
import { GlobalSearchModal } from './components/modals/GlobalSearchModal';

// Views - 集中监控 7 大二级菜单
import { ITDeviceMonitorView } from './views/monitoring/ITDeviceMonitorView';
import { OSMonitorView } from './views/monitoring/OSMonitorView';
import { ContainerMonitorView } from './views/monitoring/ContainerMonitorView';
import { MiddlewareMonitorView } from './views/monitoring/MiddlewareMonitorView';
import { DatabaseMonitorView } from './views/monitoring/DatabaseMonitorView';
import { ElectronicTagMonitorView } from './views/monitoring/ElectronicTagMonitorView';
import { CentralizedAlarmMonitorView } from './views/monitoring/CentralizedAlarmMonitorView';

// Views - 其他功能与兼容
import { ClusterCockpitView } from './views/overview/ClusterCockpitView';
import { RealtimeMetricsView } from './views/overview/RealtimeMetricsView';
import { ServerMonitorView } from './views/hardware/ServerMonitorView';
import { ModernServerTelemetryView } from './views/hardware/ModernServerTelemetryView';
import { StorageMonitorView } from './views/hardware/StorageMonitorView';
import { NetworkMonitorView } from './views/hardware/NetworkMonitorView';
import { DatacenterRackView } from './views/hardware/DatacenterRackView';
import { BigDataCoreView } from './views/software/BigDataCoreView';
import { ComputeEngineView } from './views/software/ComputeEngineView';
import { MessageQueueView } from './views/software/MessageQueueView';
import { AnalyticsEngineView } from './views/software/AnalyticsEngineView';
import { ActiveAlarmsView } from './views/alarm/ActiveAlarmsView';
import { EventTodoView } from './views/event/EventTodoView';
import { EventDoneView } from './views/event/EventDoneView';
import { EventAllView } from './views/event/EventAllView';
import { EventReviewView } from './views/event/EventReviewView';
import { EventStatsView } from './views/event/EventStatsView';
import { AlarmHistoryView } from './views/alarm/AlarmHistoryView';
import { AlarmPolicyView } from './views/alarm/AlarmPolicyView';
import { MyWorkOrdersView } from './views/workorder/MyWorkOrdersView';
import { WorkOrderApprovalView } from './views/workorder/WorkOrderApprovalView';
import { WorkOrderDoneView } from './views/workorder/WorkOrderDoneView';
import { ChangeReviewManagerView } from './views/workorder/ChangeReviewManagerView';
import { WorkOrderLifecycleView } from './views/workorder/WorkOrderLifecycleView';
import { WorkOrderAnalyticsView } from './views/workorder/WorkOrderAnalyticsView';
import { PersonnelManagementView } from './views/security/PersonnelManagementView';
import { OrganizationManagementView } from './views/security/OrganizationManagementView';
import { RoleManagementView } from './views/security/RoleManagementView';
import { ResourceManagementView } from './views/security/ResourceManagementView';
import { LogManagementView } from './views/security/LogManagementView';
import { AccountManagementView } from './views/security/AccountManagementView';
import { SystemParamMaintenanceView } from './views/security/SystemParamMaintenanceView';
import { DataDictionaryMaintenanceView } from './views/security/DataDictionaryMaintenanceView';
import { ConfigItemDataView } from './views/config/ConfigItemDataView';
import { ProjectConfigView } from './views/config/ProjectConfigView';
import { KnowledgeListView } from './views/knowledge/KnowledgeListView';
import { LoginView } from './views/auth/LoginView';

// Default to the first menu feature in the navigation hierarchy (网络设备监控)
const FIRST_DEFAULT_MENU_KEY: MenuKey =
  NAVIGATION_GROUPS[0]?.children[0]?.children?.[0]?.key ||
  NAVIGATION_GROUPS[0]?.children[0]?.key ||
  'mon_it_network';

export default function App() {
  // Authentication State - default to false so login page displays immediately
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState('adimin');

  // Navigation & Theme State - default to first menu function (网络设备监控)
  const [currentMenu, setCurrentMenu] = useState<MenuKey>(FIRST_DEFAULT_MENU_KEY);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Core Data States
  const [servers, setServers] = useState<ServerNode[]>(INITIAL_SERVERS);
  const [storages, setStorages] = useState<StorageDevice[]>(INITIAL_STORAGE);
  const [networks, setNetworks] = useState(INITIAL_NETWORKS);
  const [racks, setRacks] = useState(INITIAL_RACKS);
  const [components, setComponents] = useState<SoftwareComponent[]>(INITIAL_COMPONENTS);
  const [computeJobs, setComputeJobs] = useState(INITIAL_COMPUTE_JOBS);
  const [topics, setTopics] = useState(INITIAL_TOPICS);
  const [queries, setQueries] = useState(INITIAL_QUERIES);
  const [alarms, setAlarms] = useState<AlarmItem[]>(INITIAL_ALARMS);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(INITIAL_WORK_ORDERS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RolePermission[]>(INITIAL_ROLES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [configParams, setConfigParams] = useState<ClusterConfigParam[]>(INITIAL_CONFIG_PARAMS);
  const [agents, setAgents] = useState<TelemetryAgent[]>(INITIAL_AGENTS);
  const [articles, setArticles] = useState<KnowledgeArticle[]>(INITIAL_KNOWLEDGE_ARTICLES);
  const [osMetrics, setOsMetrics] = useState<OperatingSystemMetric[]>(INITIAL_OS_METRICS);
  const [containers, setContainers] = useState<ContainerWorkload[]>(INITIAL_CONTAINERS);
  const [databases, setDatabases] = useState<DatabaseInstance[]>(INITIAL_DATABASES);
  const [electronicTags, setElectronicTags] = useState<ElectronicTagDevice[]>(INITIAL_ELECTRONIC_TAGS);

  // Modals & Drawers State
  const [selectedServer, setSelectedServer] = useState<ServerNode | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);
  const [isCreateWorkOrderOpen, setIsCreateWorkOrderOpen] = useState(false);
  const [createWorkOrderTarget, setCreateWorkOrderTarget] = useState('');
  const [selectedAlarmForAction, setSelectedAlarmForAction] = useState<AlarmItem | null>(null);
  const [selectedComponentForAction, setSelectedComponentForAction] = useState<SoftwareComponent | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Synchronize Dark Mode with html tag
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global Keyboard Shortcuts (Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleToggleTheme = () => setIsDark((prev) => !prev);
  const handleToggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate micro fluctuation in CPU usage and temperature
      setServers((prev) =>
        prev.map((s) => ({
          ...s,
          cpuUsage: Math.min(98, Math.max(20, s.cpuUsage + (Math.random() * 4 - 2))),
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  // Alarm Actions
  const handleAcknowledgeAlarm = (id: string, note?: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'acknowledged', resolutionNote: note } : a))
    );
  };

  const handleBatchAcknowledgeAll = () => {
    setAlarms((prev) =>
      prev.map((a) => (a.status === 'active' ? { ...a, status: 'acknowledged' } : a))
    );
  };

  const handleDispatchToWorkOrder = (alarm: AlarmItem) => {
    setCreateWorkOrderTarget(`${alarm.sourceEntity} (关联告警: ${alarm.id})`);
    setIsCreateWorkOrderOpen(true);
  };

  // Work Order Actions
  const handleCreateWorkOrder = (newOrderPartial: Partial<WorkOrder>) => {
    const newId = `WO-20261105-${String(workOrders.length + 1).padStart(3, '0')}`;
    const newOrder: WorkOrder = {
      id: newId,
      title: newOrderPartial.title || '未命名工单',
      type: newOrderPartial.type || '硬件故障报修',
      priority: newOrderPartial.priority || 'P2-高',
      applicant: newOrderPartial.applicant || '程总工',
      applicantDept: newOrderPartial.applicantDept || '全息数据基础设施技术部',
      assignee: newOrderPartial.assignee || '待派发',
      targetObject: newOrderPartial.targetObject || '集群全局资源',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
      dueTime: newOrderPartial.dueTime || '2026-11-06 18:00:00',
      status: 'pending',
      description: newOrderPartial.description || '',
      timeline: newOrderPartial.timeline || [],
    };

    setWorkOrders((prev) => [newOrder, ...prev]);

    // Record audit log
    const audit: AuditLog = {
      id: `AUD-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      operator: 'admin (程总工)',
      operatorIp: '10.120.99.15',
      actionType: 'WORK_ORDER',
      targetResource: newId,
      status: 'SUCCESS',
      detail: `在线提交新工单: ${newOrder.title}`,
    };
    setAuditLogs((prev) => [audit, ...prev]);
  };

  const handleUpdateWorkOrderStatus = (id: string, newStatus: WorkOrder['status'], comment: string) => {
    setWorkOrders((prev) =>
      prev.map((wo) => {
        if (wo.id === id) {
          return {
            ...wo,
            status: newStatus,
            timeline: [
              ...wo.timeline,
              {
                time: new Date().toISOString().replace('T', ' ').slice(0, 19),
                operator: '程总工 (超级管理员)',
                action: newStatus === 'resolved' ? '标记解决' : newStatus === 'closed' ? '归档关闭' : '状态推进',
                comment,
              },
            ],
          };
        }
        return wo;
      })
    );
  };

  const handleApproveOrder = (id: string, comment: string) => {
    handleUpdateWorkOrderStatus(id, 'in_progress', comment);
  };

  const handleRejectOrder = (id: string, comment: string) => {
    handleUpdateWorkOrderStatus(id, 'closed', comment);
  };

  // User Actions
  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'active' ? 'locked' : 'active';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleResetMfa = (userId: string) => {
    alert(`已为用户 ${userId} 重新下发多因子认证密钥激活邮件`);
  };

  // Rule Actions
  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  // Param Actions
  const handleUpdateParam = (id: string, newVal: string) => {
    setConfigParams((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            currentValue: newVal,
            lastModifiedBy: 'admin',
            lastModifiedTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
          };
        }
        return p;
      })
    );
  };

  // Query Actions
  const handleKillQuery = (queryId: string) => {
    setQueries((prev) =>
      prev.map((q) => (q.queryId === queryId ? { ...q, status: 'KILLED' } : q))
    );
  };

  // Knowledge Article Action
  const handleAddArticle = (newArt: Partial<KnowledgeArticle>) => {
    const art: KnowledgeArticle = {
      id: `KB-MAN-${Math.floor(100 + Math.random() * 900)}`,
      title: newArt.title || '新知识条目',
      category: newArt.category || '故障排障',
      author: newArt.author || '程总工',
      updateTime: newArt.updateTime || new Date().toISOString().slice(0, 10),
      tags: newArt.tags || ['系统沉淀'],
      views: 1,
      likes: 0,
      summary: newArt.summary || '',
      content: newArt.content || [],
    };
    setArticles((prev) => [art, ...prev]);
  };

  const activeAlarmsCount = alarms.filter((a) => a.status === 'active').length;
  const pendingWorkOrdersCount = workOrders.filter((w) => w.status === 'pending').length;

  if (!isLoggedIn) {
    return (
      <LoginView
        onLogin={(name) => {
          setCurrentUser(name || 'adimin');
          setCurrentMenu(FIRST_DEFAULT_MENU_KEY);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Collapsible Left Sidebar */}
      <Sidebar
        currentMenu={currentMenu}
        onNavigate={setCurrentMenu}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleSidebar}
        activeAlarmsCount={activeAlarmsCount}
        pendingWorkOrdersCount={pendingWorkOrdersCount}
      />

      {/* Main Execution Viewport */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentMenu={currentMenu}
          onNavigate={setCurrentMenu}
          onOpenSearch={() => setIsGlobalSearchOpen(true)}
          alarms={alarms}
          onOpenAlarmAction={setSelectedAlarmForAction}
          isDark={isDark}
          onToggleTheme={handleToggleTheme}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
          onLogout={() => {
            setIsLoggedIn(false);
            setCurrentMenu(FIRST_DEFAULT_MENU_KEY);
          }}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-5 bg-slate-950/95">
          <div className="w-full max-w-[1920px] mx-auto">
            {/* 1. 集中监控 (6 大二级菜单: IT设备监控, 操作系统监控, 容器监控, 中间件监控, 数据库监控, 电子标识设备监控) */}
            {/* IT设备监控 及其子项: 网络设备监控、服务器监控、监控统计 */}
            {(currentMenu === 'mon_it' ||
              currentMenu === 'mon_it_network' ||
              currentMenu === 'mon_it_server' ||
              currentMenu === 'mon_it_stats') && (
              <ITDeviceMonitorView
                servers={servers}
                storages={storages}
                networks={networks}
                racks={racks}
                initialSubTab={
                  currentMenu === 'mon_it_network'
                    ? 'network'
                    : currentMenu === 'mon_it_server'
                    ? 'server'
                    : currentMenu === 'mon_it_stats'
                    ? 'stats'
                    : 'network'
                }
                onSelectServer={setSelectedServer}
                onCreateWorkOrderForServer={(server) => {
                  setCreateWorkOrderTarget(`${server.hostname} (${server.ip}, ${server.rack})`);
                  setIsCreateWorkOrderOpen(true);
                }}
                onRefresh={handleRefresh}
              />
            )}
            {(currentMenu === 'mon_os' ||
              currentMenu === 'mon_os_system' ||
              currentMenu === 'mon_os_stats') && (
              <OSMonitorView
                osMetrics={osMetrics}
                initialSubTab={currentMenu === 'mon_os_stats' ? 'stats' : 'system'}
                onOpenTerminal={(name, ip) => alert(`正在连接主机 SSH 终端: ${name} [${ip}]...`)}
                onRefresh={handleRefresh}
              />
            )}
            {(currentMenu === 'mon_container' ||
              currentMenu === 'mon_container_data' ||
              currentMenu === 'mon_container_stats') && (
              <ContainerMonitorView
                containers={containers}
                initialSubTab={currentMenu === 'mon_container_stats' ? 'stats' : 'data'}
                onOpenTerminal={(cmd, ip) => alert(`正在建立 Kubernetes 容器终端: ${cmd} @ ${ip}...`)}
                onRefresh={handleRefresh}
              />
            )}
            {(currentMenu === 'mon_middleware' ||
              currentMenu === 'mon_mw_web' ||
              currentMenu === 'mon_mw_msg' ||
              currentMenu === 'mon_mw_cache' ||
              currentMenu === 'mon_mw_stats') && (
              <MiddlewareMonitorView
                components={components}
                computeJobs={computeJobs}
                topics={topics}
                queries={queries}
                initialSubTab={
                  currentMenu === 'mon_mw_web'
                    ? 'web'
                    : currentMenu === 'mon_mw_msg'
                    ? 'msg'
                    : currentMenu === 'mon_mw_cache'
                    ? 'cache'
                    : currentMenu === 'mon_mw_stats'
                    ? 'stats'
                    : 'web'
                }
                onOpenActionModal={setSelectedComponentForAction}
                onKillQuery={handleKillQuery}
                onRefresh={handleRefresh}
              />
            )}
            {(currentMenu === 'mon_database' ||
              currentMenu === 'mon_db_data' ||
              currentMenu === 'mon_db_stats') && (
              <DatabaseMonitorView
                databases={databases}
                initialSubTab={currentMenu === 'mon_db_stats' ? 'stats' : 'data'}
                onOpenTerminal={(cmd, host) => alert(`正在启动 SQL 客户端: ${cmd} @ ${host}...`)}
                onRefresh={handleRefresh}
              />
            )}
            {(currentMenu === 'mon_rfid' ||
              currentMenu === 'mon_rfid_device' ||
              currentMenu === 'mon_rfid_readrate' ||
              currentMenu === 'mon_rfid_inspection' ||
              currentMenu === 'mon_rfid_stats' ||
              currentMenu === 'mon_rfid_alarms') && (
              <ElectronicTagMonitorView
                tagDevices={electronicTags}
                initialSubTab={
                  currentMenu === 'mon_rfid_readrate'
                    ? 'readrate'
                    : currentMenu === 'mon_rfid_inspection'
                    ? 'inspection'
                    : currentMenu === 'mon_rfid_stats'
                    ? 'stats'
                    : 'device'
                }
                onOpenTerminal={(cmd, ip) => alert(`已向电子标识设备 ${ip} 发送命令: ${cmd}`)}
                onRefresh={handleRefresh}
              />
            )}
            {(currentMenu === 'mon_alarm' ||
              currentMenu === 'mon_alarm_info' ||
              currentMenu === 'mon_alarm_rules' ||
              currentMenu === 'mon_alarm_active' ||
              currentMenu === 'mon_alarm_history' ||
              currentMenu === 'mon_alarm_policy') && (
              <CentralizedAlarmMonitorView
                alarms={alarms}
                rules={rules}
                initialSubTab={
                  currentMenu === 'mon_alarm_rules' || currentMenu === 'mon_alarm_policy'
                    ? 'rules'
                    : currentMenu === 'mon_alarm_history'
                    ? 'history'
                    : 'info'
                }
                onOpenAlarmAction={setSelectedAlarmForAction}
                onBatchAcknowledgeAll={handleBatchAcknowledgeAll}
                onToggleRule={handleToggleRule}
              />
            )}

            {/* 驾驶舱全景与兼容路由 */}
            {currentMenu === 'overview_cockpit' && (
              <ClusterCockpitView
                servers={servers}
                storages={storages}
                components={components}
                alarms={alarms}
                workOrders={workOrders}
                onSelectServer={setSelectedServer}
                onNavigate={setCurrentMenu}
                onOpenAlarmAction={setSelectedAlarmForAction}
                onCreateWorkOrder={() => {
                  setCreateWorkOrderTarget('集群全息管控中心');
                  setIsCreateWorkOrderOpen(true);
                }}
              />
            )}
            {currentMenu === 'overview_realtime' && (
              <RealtimeMetricsView
                servers={servers}
                onSelectServer={setSelectedServer}
              />
            )}
            {currentMenu === 'hw_servers' && (
              <ModernServerTelemetryView
                servers={servers}
                onSelectServer={setSelectedServer}
                onCreateWorkOrderForServer={(server: ServerNode) => {
                  setCreateWorkOrderTarget(`${server.hostname} (${server.ip}, ${server.rack})`);
                  setIsCreateWorkOrderOpen(true);
                }}
                onRefresh={handleRefresh}
              />
            )}
            {currentMenu === 'hw_storage' && (
              <StorageMonitorView
                storages={storages}
                onTriggerScan={(id) => alert(`存储设备 ${id} SMART 完整性巡检通过，坏道率为 0.00%`)}
              />
            )}
            {currentMenu === 'hw_network' && (
              <NetworkMonitorView networks={networks} />
            )}
            {currentMenu === 'hw_racks' && (
              <DatacenterRackView
                racks={racks}
                servers={servers}
                onSelectServer={setSelectedServer}
              />
            )}
            {currentMenu === 'sw_bigdata' && (
              <BigDataCoreView
                components={components}
                onOpenActionModal={setSelectedComponentForAction}
              />
            )}
            {currentMenu === 'sw_compute' && (
              <ComputeEngineView
                jobs={computeJobs}
                onTriggerJobAction={(jobId, act) => alert(`已为作业 ${jobId} 触发 ${act} 状态快照！`)}
              />
            )}
            {currentMenu === 'sw_queues' && (
              <MessageQueueView topics={topics} />
            )}
            {currentMenu === 'sw_analytics' && (
              <AnalyticsEngineView
                queries={queries}
                onKillQuery={handleKillQuery}
              />
            )}

            {/* 2. 事件中心 (待办事件, 已办事件, 所有事件, 事件回顾, 事件统计) */}
            {currentMenu === 'evt_todo' && (
              <EventTodoView />
            )}
            {currentMenu === 'alarm_active' && (
              <ActiveAlarmsView
                alarms={alarms}
                onOpenAlarmAction={setSelectedAlarmForAction}
                onBatchAcknowledgeAll={handleBatchAcknowledgeAll}
              />
            )}
            {currentMenu === 'evt_done' && (
              <EventDoneView />
            )}
            {currentMenu === 'alarm_history' && (
              <AlarmHistoryView />
            )}
            {currentMenu === 'evt_all' && (
              <EventAllView />
            )}
            {currentMenu === 'evt_review' && (
              <EventReviewView />
            )}
            {currentMenu === 'evt_stats' && (
              <EventStatsView />
            )}
            {currentMenu === 'alarm_policy' && (
              <AlarmPolicyView
                rules={rules}
                onToggleRule={handleToggleRule}
              />
            )}

            {/* 3. 工单管理 (二级: 工单管理, 变更工单回顾) */}
            {(currentMenu === 'wo_mgr' || currentMenu === 'wo_my') && (
              <MyWorkOrdersView
                workOrders={workOrders}
                onOpenOrderDetail={setSelectedWorkOrder}
                onCreateWorkOrder={() => {
                  setCreateWorkOrderTarget('');
                  setIsCreateWorkOrderOpen(true);
                }}
              />
            )}
            {currentMenu === 'wo_pending' && (
              <WorkOrderApprovalView
                workOrders={workOrders}
                onOpenOrderDetail={setSelectedWorkOrder}
                onApproveOrder={handleApproveOrder}
                onRejectOrder={handleRejectOrder}
              />
            )}
            {currentMenu === 'wo_done' && (
              <WorkOrderDoneView
                pageTitle="已办工单列表"
                subTitle="已归档与终验闭环工单记录 · 每页10条数据"
              />
            )}
            {currentMenu === 'wo_all' && (
              <WorkOrderApprovalView
                pageTitle="所有工单列表"
                subTitle="全量工单综合视图 · 支持各阶段处置与流程穿透 · 每页 10 条数据"
              />
            )}
            {currentMenu === 'wo_reply' && (
              <WorkOrderDoneView
                pageTitle="工单回复记录"
                subTitle="工单交互与追加回复台账 · 每页10条数据"
              />
            )}
            {currentMenu === 'wo_change_review' && (
              <WorkOrderDoneView
                pageTitle="变更工单回顾"
                subTitle="重大系统变更复盘与风险追踪 · 每页10条数据"
              />
            )}
            {currentMenu === 'wo_change_mgr' && (
              <ChangeReviewManagerView />
            )}
            {currentMenu === 'wo_lifecycle' && (
              <WorkOrderLifecycleView
                workOrders={workOrders}
                onOpenOrderDetail={setSelectedWorkOrder}
              />
            )}
            {(currentMenu === 'wo_stats' || currentMenu === 'wo_analytics') && (
              <WorkOrderAnalyticsView />
            )}

            {/* 4. 知识库 */}
            {currentMenu === 'kb_list' && (
              <KnowledgeListView />
            )}

            {/* 5. 配置管理 */}
            {currentMenu === 'cfg_items' && (
              <ConfigItemDataView />
            )}
            {currentMenu === 'cfg_project' && (
              <ProjectConfigView />
            )}

            {/* 6. 系统管理 */}
            {currentMenu === 'sec_personnel' && (
              <PersonnelManagementView />
            )}
            {currentMenu === 'sec_org' && (
              <OrganizationManagementView />
            )}
            {currentMenu === 'sec_roles' && (
              <RoleManagementView />
            )}
            {currentMenu === 'sec_resources' && (
              <ResourceManagementView />
            )}
            {(currentMenu === 'sec_settings' || currentMenu === 'sec_logs' || currentMenu === 'sec_audit') && (
              <LogManagementView />
            )}
            {(currentMenu === 'sec_accounts' || currentMenu === 'sec_users') && (
              <AccountManagementView />
            )}
            {currentMenu === 'sec_sys_params' && (
              <SystemParamMaintenanceView />
            )}
            {currentMenu === 'sec_data_dicts' && (
              <DataDictionaryMaintenanceView />
            )}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals and Drawers */}
      <ServerDetailDrawer
        server={selectedServer}
        onClose={() => setSelectedServer(null)}
        onSimulateAction={(act) => alert(`已下发指令: ${act}`)}
      />

      <WorkOrderDetailModal
        workOrder={selectedWorkOrder}
        onClose={() => setSelectedWorkOrder(null)}
        onUpdateStatus={handleUpdateWorkOrderStatus}
      />

      <WorkOrderCreateModal
        isOpen={isCreateWorkOrderOpen}
        onClose={() => setIsCreateWorkOrderOpen(false)}
        onCreate={handleCreateWorkOrder}
        defaultTarget={createWorkOrderTarget}
      />

      <AlarmActionModal
        alarm={selectedAlarmForAction}
        onClose={() => setSelectedAlarmForAction(null)}
        onAcknowledge={handleAcknowledgeAlarm}
        onDispatchToWorkOrder={handleDispatchToWorkOrder}
      />

      <ComponentActionModal
        component={selectedComponentForAction}
        onClose={() => setSelectedComponentForAction(null)}
        onExecuteAction={(cId, act) => {
          alert(`已对组件 ${cId} 执行操作: ${act}`);
          setSelectedComponentForAction(null);
        }}
      />

      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigate={setCurrentMenu}
        servers={servers}
        storages={storages}
        components={components}
        alarms={alarms}
        workOrders={workOrders}
        articles={articles}
      />
    </div>
  );
}
