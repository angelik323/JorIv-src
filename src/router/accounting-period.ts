export default [
  {
    path: '/periodo-contable',
    name: 'AccountingPeriodList',
    component: () =>
      import('@/views/accounting-period/list/AccountingPeriodList.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/periodo-contable/crear',
    name: 'CreateAccountingPeriod',
    component: () =>
      import('@/views/accounting-period/create/CreateAccountingPeriod.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/periodo-contable/editar/:id',
    name: 'EditAccountingPeriod',
    component: () =>
      import('@/views/accounting-period/edit/EditAccountingPeriod.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
