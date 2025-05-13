import {createRouter, createWebHashHistory} from 'vue-router'

const stratoRouter = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      // meta: { keepAlive: false }
    },
    {
      path: '/',
      redirect: '/resource',
    },
    {
      path: '/resource',
      name: 'Resource',
      component: () => import('@/layout/StratoLayout.vue'),
      meta: { keepAlive: false },
      redirect: '/resource/list/COMPUTE_INSTANCE',
      children: [
        {
          path: '/resource/list/:category',
          name: 'ResourceList',
          component: () => import('@/views/resource/Resource.vue'),
        },
        {
          path: '/resource/stacks',
          name: 'ResourceStack',
          component: () => import('@/views/stack/ResourceStack.vue'),
        },
      ]
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('@/layout/StratoLayout.vue'),
      redirect: '/order/my-orders',
      children: [
        {
          path: '/order/my-orders',
          name: 'MyOrders',
          component: () => import('@/views/order/Orders.vue'),
        },
        {
          path: '/order/to-do-orders',
          name: 'ToDoOrders',
          component: () => import('@/views/order/Orders.vue'),
        },
        {
          path: '/order/done-orders',
          name: 'DoneOrders',
          component: () => import('@/views/order/Orders.vue'),
        },
        {
          path: '/order/all-orders',
          name: 'AllOrders',
          component: () => import('@/views/order/Orders.vue'),
        },
        {
          path: '/order/jobs',
          name: 'Job',
          component: () => import('@/views/jobs/Job.vue'),
        },
        {
          path: '/order/workflow',
          name: 'Workflow',
          component: () => import('@/views/workflow/Workflow.vue'),
        },
        {
          path: '/order/job-definitions',
          name: 'JobDefinition',
          component: () => import('@/views/jobs/JobDefinition.vue'),
        },
        {
          path: '/order/job-triggers',
          name: 'JobTrigger',
          component: () => import('@/views/jobs/JobTrigger.vue'),
        },
      ]
    },
    {
      path: '/cloud-configuration',
      name: 'CloudConfiguration',
      component: () => import('@/layout/StratoLayout.vue'),
      redirect: '/cloud-configuration/external-account',
      children: [
        {
          path: '/cloud-configuration/external-account',
          name: 'Account',
          component: () => import('@/views/account/ExternalAccount.vue'),
        },
        {
          path: '/cloud-configuration/tag',
          name: 'ResourceTag',
          component: () => import('@/views/tag/ResourceTagEntry.vue'),
        },
        {
          path: '/cloud-configuration/ip-pool',
          name: 'IpPool',
          component: () => import('@/views/ip/IpPool.vue'),
        },
        {
          path: '/cloud-configuration/blueprint',
          name: 'Blueprint',
          component: () => import('@/views/blueprint/Blueprint.vue'),
        },
        {
          path: '/cloud-configuration/script-definition',
          name: 'ScriptDefinition',
          component: () => import('@/views/script/ScriptDefinition.vue'),
        },
        {
          path: '/cloud-configuration/software-definition',
          name: 'SoftwareDefinition',
          component: () => import('@/views/software/SoftwareDefinition.vue'),
        },
      ]
    },
    {
      path: '/system-configuration',
      name: 'SystemConfiguration',
      component: () => import('@/layout/StratoLayout.vue'),
      redirect: '/system-configuration/tenant',
      children: [
        {
          path: '/system-configuration/tenant',
          name: 'Tenant',
          component: () => import('@/views/tenant/Tenant.vue'),
        },
        {
          path: '/system-configuration/user',
          name: 'User',
          component: () => import('@/views/user/User.vue'),
        },
        {
          path: '/system-configuration/role',
          name: 'Role',
          component: () => import('@/views/role/Role.vue'),
        },
        {
          path: '/system-configuration/user-group',
          name: 'UserGroup',
          component: () => import('@/views/usergroup/UserGroup.vue'),
        },
        {
          path: '/system-configuration/audit-log',
          name: 'AuditLog',
          component: () => import('@/views/audit/AuditLog.vue'),
        },
        {
          path: '/system-configuration/notification-way',
          name: 'NotificationWay',
          component: () => import('@/views/notification/NotificationWay.vue'),
        },
        {
          path: '/system-configuration/notification-policy',
          name: 'NotificationPolicy',
          component: () => import('@/views/notification/NotificationPolicy.vue'),
        },
        {
          path: '/system-configuration/notification',
          name: 'Notification',
          component: () => import('@/views/notification/Notification.vue'),
        },
      ]
    }
  ]
})

export default stratoRouter
