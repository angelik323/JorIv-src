export default [
  {
    path: '/cierre-periodo',
    name: 'PeriodClosureList',
    component: () =>
      import('@/views/accounting/period-closure/v2/list/PeriodClosureList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PeriodClosureList',
      },
    },
  },
  {
    path: '/cierre-periodo/crear',
    name: 'PeriodClosureCreate',
    component: () =>
      import(
        '@/views/accounting/period-closure/v2/create/PeriodClosureCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PeriodClosureList',
        action: 'create',
      },
    },
  },
]
