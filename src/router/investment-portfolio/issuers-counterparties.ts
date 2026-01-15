export default [
  {
    path: '/portafolio-de-inversiones/emisores-contrapartes',
    name: 'IssuersCounterpartiesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IssuersCounterpartiesList',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/issuers-counterparties/v1/list/IssuersCounterpartiesList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/emisores-contrapartes/crear',
    name: 'IssuersCounterpartiesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IssuersCounterpartiesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/issuers-counterparties/v1/create/IssuersCounterpartiesCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/emisores-contrapartes/editar/:id',
    name: 'IssuersCounterpartiesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IssuersCounterpartiesList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/issuers-counterparties/v1/edit/IssuersCounterpartiesEdit.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/emisores-contrapartes/ver/:id',
    name: 'IssuersCounterpartiesView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IssuersCounterpartiesList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/issuers-counterparties/v1/view/IssuersCounterpartiesView.vue'
      ),
  },
]
