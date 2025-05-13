export const definedSystemConfigurationMenus = [
    {
        menuName: '租户管理',
        path: '/system-configuration/tenant',
        permissionTarget: 'Tenant',
    },{
        menuName: '用户管理',
        path: '/system-configuration/user',
        permissionTarget: 'User',
    },
    {
        menuName: '角色管理',
        path: '/system-configuration/role',
        permissionTarget: 'Role',
    },
    {
        menuName: '用户组管理',
        path: '/system-configuration/user-group',
        permissionTarget: 'UserGroup',
    },
    {
        menuName: '审计日志',
        path: '/system-configuration/audit-log',
        permissionTarget: 'AuditLog',
    },
    {
        menuName: '通知方式',
        path: '/system-configuration/notification-way',
        permissionTarget: 'NotificationWay',
    },
    {
        menuName: '通知策略',
        path: '/system-configuration/notification-policy',
        permissionTarget: 'NotificationPolicy',
    },
    {
        menuName: '通知记录',
        path: '/system-configuration/notification',
        permissionTarget: 'Notification',
    }
]

export const definedCloudConfigurationMenus = [
    {
        menuName: '云账号',
        path: '/cloud-configuration/external-account',
        permissionTarget: 'ExternalAccount',
    },
    {
        menuName: '标签管理',
        path: '/cloud-configuration/tag',
        permissionTarget: 'ResourceTag',
    },
    {
        menuName: 'IP池',
        path: '/cloud-configuration/ip-pool',
        permissionTarget: 'IpPool',
    },
    {
        menuName: '资源栈蓝图',
        path: '/cloud-configuration/blueprint',
        permissionTarget: 'Blueprint',
    },
    {
        menuName: '脚本库',
        path: '/cloud-configuration/script-definition',
        permissionTarget: 'ScriptDefinition',
    },
    {
        menuName: '软件库',
        path: '/cloud-configuration/software-definition',
        permissionTarget: 'SoftwareDefinition',
    },
]

export const definedOrderMenus = [
    {
        menuName: '我的工单',
        path: '/order/my-orders',
        permissionTarget: 'Order',
    },
    {
        menuName: '待办工单',
        path: '/order/to-do-orders',
        permissionTarget: 'Order',
    },
    {
        menuName: '已办工单',
        path: '/order/done-orders',
        permissionTarget: 'Order',
    },
    {
        menuName: '所有工单',
        path: '/order/all-orders',
        permissionTarget: 'Order',
    },
    {
        menuName: '任务',
        path: '/order/jobs',
        permissionTarget: 'Job',
    },
    {
        menuName: '流程管理',
        path: '/order/workflow',
        permissionTarget: 'Workflow',
    },
    {
        menuName: '任务类型',
        path: '/order/job-definitions',
        permissionTarget: 'JobDefinition',
    },
    {
        menuName: '定时任务',
        path: '/order/job-triggers',
        permissionTarget: 'JobTrigger',
    },
]

export const definedResourceMenus = [
    {
        menuName: '资源栈',
        path: '/resource/stacks',
        permissionTarget: 'ResourceStack',
    },
]
