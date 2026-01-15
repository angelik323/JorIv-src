export default [
  {
    path: '/portafolio-de-inversiones/tipos-papel',
    name: 'PaperTypesList',
    component: () =>
      import(
        '@/views/investment-portfolio/type-paper/v1/list/PaperTypesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PaperTypesList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/tipos-papel/crear',
    name: 'PaperTypesCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/type-paper/v1/create/PaperTypesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PaperTypesList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/tipos-papel/ver/:id',
    name: 'PaperTypesView',
    component: () =>
      import(
        '@/views/investment-portfolio/type-paper/v1/read/PaperTypesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PaperTypesList',
        action: 'show',
      },
    },
  },
]
