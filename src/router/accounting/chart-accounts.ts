export default [
  {
    path: '/contabilidad/plan-de-cuentas',
    name: 'ChartAccountsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ChartAccountsList',
      },
    },
    component: () =>
      import('@/views/accounting/chart-accounts/v2/list/ChartAccountsList.vue'),
  },
  {
    path: '/contabilidad/plan-de-cuentas/crear',
    name: 'ChartAccountsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ChartAccountsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/chart-accounts/v2/create/ChartAccountsCreate.vue'
      ),
  },

  {
    path: '/contabilidad/plan-de-cuentas/importar',
    name: 'ChartAccountsImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ChartAccountsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/chart-accounts/v2/import/ChartAccountsImport.vue'
      ),
  },
  {
    path: '/contabilidad/plan-de-cuentas/editar/:id',
    name: 'ChartAccountsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ChartAccountsList',
        action: 'edit',
      },
    },
    component: () =>
      import('@/views/accounting/chart-accounts/v2/edit/ChartAccountsEdit.vue'),
  },
  {
    path: '/contabilidad/plan-de-cuentas/ver/:id',
    name: 'ChartAccountsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ChartAccountsList',
        action: 'show',
      },
    },
    component: () =>
      import('@/views/accounting/chart-accounts/v2/view/ChartAccountsView.vue'),
  },
]
