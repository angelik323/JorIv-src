export default [
  {
    permission: 'module-foreign-exchange-sales-buy-operations',
    path: '/portafolio-de-inversiones/renta-variable',
    name: 'ForeignExchangeSalesList',
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-exchange-sales-operations/list/ForeignExchangeSalesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ForeignExchangeSalesList',
        action: 'list',
      },
    },
  },
  {
    permission: 'module-foreign-exchange-sales-buy-operations',
    path: '/portafolio-de-inversiones/renta-variable/venta-divisas/crear',
    name: 'ForeignExchangeSalesCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-exchange-sales-operations/create/ForeignExchangeSalesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ForeignExchangeSalesList',
        action: 'create',
      },
    },
  },
  {
    permission: 'module-foreign-exchange-sales-buy-operations',
    path: '/portafolio-de-inversiones/renta-variable/venta-divisas/:id/ver',
    name: 'ForeignExchangeSalesView',
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-exchange-sales-operations/view/ForeignExchangeSalesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ForeignExchangeSalesList',
        action: 'view',
      },
    },
  },
  {
    permission: 'module-foreign-exchange-sales-buy-operations',
    path: '/portafolio-de-inversiones/renta-variable/compra-divisas/crear',
    name: 'ForeignExchangeBuyCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-exchange-buy-operations/create/ForeignExchangeBuyCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ForeignExchangeSalesList',
        action: 'create',
      },
    },
  },
  {
    permission: 'module-foreign-exchange-sales-buy-operations',
    path: '/portafolio-de-inversiones/renta-variable/compra-divisas/:id/ver',
    name: 'ForeignExchangeBuyView',
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-exchange-buy-operations/view/ForeignExchangeBuyView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ForeignExchangeSalesList',
        action: 'view',
      },
    },
  },
]
