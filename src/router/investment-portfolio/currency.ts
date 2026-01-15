export default [
  {
    path: '/monedas',
    name: 'CurrencyList',
    component: () =>
      import('@/views/investment-portfolio/currency/v1/list/CurrencyList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'CurrencyList',
      },
    },
  },
  {
    path: '/monedas/crear',
    name: 'CurrencyCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/currency/v1/create/CurrencyCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'CurrencyList',
        action: 'create',
      },
    },
  },
  {
    path: '/monedas/editar/:id',
    name: 'CurrencyEdit',
    component: () =>
      import('@/views/investment-portfolio/currency/v1/edit/CurrencyEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'CurrencyList',
        action: 'edit',
      },
    },
  },
  {
    path: '/monedas/ver/:id',
    name: 'CurrencyView',
    component: () =>
      import('@/views/investment-portfolio/currency/v1/view/CurrencyView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'CurrencyList',
        action: 'show',
      },
    },
  },
]
