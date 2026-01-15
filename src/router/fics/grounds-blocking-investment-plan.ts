export default [
  {
    path: '/fics/causales-de-bloqueos-plan-de-inversion',
    name: 'GroundsBlockingInvestmentPlanList',
    component: () =>
      import(
        '@/views/fics/grounds-blocking-investment-plan/v1/list/GroundsBlockingInvestmentPlanList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GroundsBlockingInvestmentPlanList',
      },
    },
  },
  {
    path: '/fics/causales-de-bloqueos-plan-de-inversion/editar/:id',
    name: 'GroundsBlockingInvestmentPlanEdit',
    component: () =>
      import(
        '@/views/fics/grounds-blocking-investment-plan/v1/edit/GroundsBlockingInvestmentPlanEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GroundsBlockingInvestmentPlanList',
        action: 'edit',
      },
    },
  },
  {
    path: '/fics/causales-de-bloqueos-plan-de-inversion/crear/',
    name: 'GroundsBlockingInvestmentPlanCreate',
    component: () =>
      import(
        '@/views/fics/grounds-blocking-investment-plan/v1/create/GroundsBlockingInvestmentPlanCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GroundsBlockingInvestmentPlanList',
        action: 'create',
      },
    },
  },
]
