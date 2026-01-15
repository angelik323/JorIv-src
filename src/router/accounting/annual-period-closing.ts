export default [
  {
    path: '/contabilidad/cierre-de-periodo-anual',
    name: 'AnnualPeriodClosingList',
    component: () =>
      import(
        '@/views/accounting/annual-period-closing/v1/list/AnnualPeriodClosingList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AnnualPeriodClosingList',
      },
    },
  },
  {
    path: '/contabilidad/cierre-de-periodo-anual/crear',
    name: 'AnnualPeriodClosingsCreate',
    component: () =>
      import(
        '@/views/accounting/annual-period-closing/v1/create/AnnualPeriodClosingCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AnnualPeriodClosingList',
        action: 'create',
      },
    },
  },
]
