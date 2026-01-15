export default [
  {
    path: '/fics/operaciones-plan-inversion',
    name: 'InvestmentPlanOperationList',
    component: () =>
      import(
        '@/views/fics/investment-plan-operations/v1/list/InvestmentPlanOperationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanOperationList',
      },
    },
  },
  {
    path: '/fics/operaciones-plan-inversion/crear',
    name: 'InvestmentPlanOperationCreate',
    component: () =>
      import(
        '@/views/fics/investment-plan-operations/v1/create/InvestmentPlanOperationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanOperationList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/operaciones-plan-inversion/anular/:id',
    name: 'InvestmentPlanOperationAnnulate',
    component: () =>
      import(
        '@/views/fics/investment-plan-operations/v1/annulate/InvestmentPlanOperationAnnulate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanOperationList',
        action: 'annulate',
      },
    },
  },
  {
    path: '/fics/operaciones-plan-inversion/consultar/:id',
    name: 'InvestmentPlanOperationView',
    component: () =>
      import(
        '@/views/fics/investment-plan-operations/v1/view/InvestmentPlanOperationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanOperationList',
        action: 'show',
      },
    },
  },
]
