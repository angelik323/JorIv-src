export default [
  {
    path: '/portafolio-de-inversion/tipos-bursatilidad',
    name: 'TypesMarketabilityList',
    component: () =>
      import(
        '@/views/investment-portfolio/types-marketability/v1/list/TypesMarketabilityList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesMarketabilityList',
      },
    },
  },
  {
    path: '/portafolio-de-inversion/tipos-bursatilidad/crear',
    name: 'TypesMarketabilityCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/types-marketability/v1/create/TypesMarketabilityCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesMarketabilityList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversion/tipos-bursatilidad/editar/:id',
    name: 'TypesMarketabilityEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/types-marketability/v1/edit/TypesMarketabilityEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesMarketabilityList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversion/tipos-bursatilidad/ver/:id',
    name: 'TypesMarketabilityView',
    component: () =>
      import(
        '@/views/investment-portfolio/types-marketability/v1/view/TypesMarketabilityView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesMarketabilityList',
        action: 'show',
      },
    },
  },
]
