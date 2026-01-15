export default [
  {
    path: '/cuentas-por-pagar/notificaciones',
    name: 'AccountsPayableNotificationsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'AccountsPayableNotificationsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-notifications/v1/list/AccountsPayableNotificationsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/notificaciones/crear',
    name: 'AccountsPayableNotificationsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'AccountsPayableNotificationsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-notifications/v1/create/AccountsPayableNotificationsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/notificaciones/editar/:id',
    name: 'AccountsPayableNotificationsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'AccountsPayableNotificationsList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-notifications/v1/edit/AccountsPayableNotificationsEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/notificaciones/ver/:id',
    name: 'AccountsPayableNotificationsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'AccountsPayableNotificationsList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-notifications/v1/view/AccountsPayableNotificationsView.vue'
      ),
  },
]
