export default [
  {
    path: '/portafolio-de-inversiones/operaciones-inversiones-derivados',
    name: 'DerivativeInvestmentOperationsList',
    component: () =>
      import(
        '@/views/investment-portfolio/derivative-investment-operation/v1/list/DerivativeInvestmentOperationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesOperationList',
        action: 'list',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/operaciones-inversiones-derivados/compra-forward/crear',
    name: 'DerivativeInvestmentOperationsBuysForwardCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/derivative-investment-operation/v1/create/buys/CurrencyPurchaseCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesOperationList',
        action: 'create',
      },
    },
    props: true,
  },
  {
    path: '/portafolio-de-inversiones/operaciones-inversiones-derivados/venta-forward/crear',
    name: 'DerivativeInvestmentOperationsSaleForwardCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/derivative-investment-operation/v1/create/sale/CurrencySaleCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesOperationList',
        action: 'create',
      },
    },
    props: true,
  },
  {
    path: '/portafolio-de-inversiones/operaciones-inversiones-derivados/ver/:id',
    name: 'DerivativeInvestmentOperationsView',
    component: () =>
      import(
        '@/views/investment-portfolio/derivative-investment-operation/v1/view/DerivativeInvestmentOperationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesOperationList',
        action: 'show',
      },
    },
  },
]
