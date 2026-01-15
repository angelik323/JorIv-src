export default [
  {
    path: '/tasas-de-interes',
    name: 'InterestRateList',
    component: () =>
      import(
        '@/views/investment-portfolio/interest-rates/v1/list/InterestRatesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InterestRateList',
      },
    },
  },
  {
    path: '/tasas-de-interes/crear',
    name: 'InterestRatesCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/interest-rates/v1/create/InterestRatesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InterestRateList',
        action: 'create',
      },
    },
  },
  {
    path: '/tasas-de-interes/editar/:id',
    name: 'InterestRatesEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/interest-rates/v1/edit/InterestRatesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InterestRateList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tasas-de-interes/:id',
    name: 'InterestRatesView',
    component: () =>
      import(
        '@/views/investment-portfolio/interest-rates/v1/view/InterestRatesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InterestRateList',
        action: 'show',
      },
    },
  },
]
