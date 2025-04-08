import {createRouter, createWebHashHistory} from 'vue-router'

const stratoRouter = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
      meta: { keepAlive: false }
    },
    {
      path: '/',
      redirect: '/resource',
      meta: { keepAlive: false }
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
          meta: { keepAlive: false },
        },
        {
          path: '/resource/stacks',
          name: 'ResourceStack',
          component: () => import('@/views/stack/ResourceStack.vue'),
          meta: { keepAlive: false },
        },
      ]
    },
    {
      path: '/order',
      name: 'Order',
      component: () => import('@/layout/StratoLayout.vue'),
      meta: { keepAlive: false },
      redirect: '/order/my-orders',
      children: [
        {
          path: '/order/my-orders',
          name: 'MyOrders',
          component: () => import('@/views/order/Orders.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/to-do-orders',
          name: 'ToDoOrders',
          component: () => import('@/views/order/Orders.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/done-orders',
          name: 'DoneOrders',
          component: () => import('@/views/order/Orders.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/all-orders',
          name: 'AllOrders',
          component: () => import('@/views/order/Orders.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/jobs',
          name: 'Job',
          component: () => import('@/views/jobs/Job.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/workflow',
          name: 'Workflow',
          component: () => import('@/views/workflow/Workflow.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/job-definitions',
          name: 'JobDefinition',
          component: () => import('@/views/jobs/JobDefinition.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/order/job-triggers',
          name: 'JobTrigger',
          component: () => import('@/views/jobs/JobTrigger.vue'),
          meta: { keepAlive: false },
        },
      ]
    },
    {
      path: '/cloud-configuration',
      name: 'CloudConfiguration',
      component: () => import('@/layout/StratoLayout.vue'),
      redirect: '/cloud-configuration/external-account',
      meta: { keepAlive: false },
      children: [
        {
          path: '/cloud-configuration/external-account',
          name: 'Account',
          component: () => import('@/views/account/ExternalAccount.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/cloud-configuration/tag',
          name: 'ResourceTag',
          component: () => import('@/views/tag/ResourceTagEntry.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/cloud-configuration/ip-pool',
          name: 'IpPool',
          component: () => import('@/views/ip/IpPool.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/cloud-configuration/blueprint',
          name: 'Blueprint',
          component: () => import('@/views/blueprint/Blueprint.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/cloud-configuration/script-definition',
          name: 'ScriptDefinition',
          component: () => import('@/views/script/ScriptDefinition.vue'),
          meta: { keepAlive: false }
        },
        {
          path: '/cloud-configuration/software-definition',
          name: 'SoftwareDefinition',
          component: () => import('@/views/software/SoftwareDefinition.vue'),
          meta: { keepAlive: false }
        },
      ]
    },
    {
      path: '/system-configuration',
      name: 'SystemConfiguration',
      component: () => import('@/layout/StratoLayout.vue'),
      redirect: '/system-configuration/tenant',
      meta: { keepAlive: false },
      children: [
        {
          path: '/system-configuration/tenant',
          name: 'Tenant',
          component: () => import('@/views/tenant/Tenant.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/system-configuration/user',
          name: 'User',
          component: () => import('@/views/user/User.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/system-configuration/role',
          name: 'Role',
          component: () => import('@/views/role/Role.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/system-configuration/user-group',
          name: 'UserGroup',
          component: () => import('@/views/usergroup/UserGroup.vue'),
          meta: { keepAlive: false },
        },
        {
          path: '/system-configuration/audit-log',
          name: 'AuditLog',
          component: () => import('@/views/audit/AuditLog.vue'),
          meta: { keepAlive: false }
        },
      ]
    }
  ]
})

export default stratoRouter
