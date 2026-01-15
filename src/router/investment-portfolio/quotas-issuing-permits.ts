export default [
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-emisor',
    name: 'QuotasIssuingPermitsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QuotasIssuingPermitsList',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/quotas-issuing-permits/v1/list/QuotasIssuingPermitsList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-emisor/crear',
    name: 'QuotasIssuingPermitsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QuotasIssuingPermitsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/quotas-issuing-permits/v1/create/QuotasIssuingPermitsCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-emisor/editar/:id',
    name: 'QuotasIssuingPermitsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QuotasIssuingPermitsList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/quotas-issuing-permits/v1/edit/QuotasIssuingPermitsEdit.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-emisor/ver/:id',
    name: 'QuotasIssuingPermitsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QuotasIssuingPermitsList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/investment-portfolio/quotas-issuing-permits/v1/view/QuotasIssuingPermitsView.vue'
      ),
  },
]
