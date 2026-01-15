export default [
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-contraparte',
    name: 'DefinitionQuotasCounterpartPermitsList',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-quotas-counterpart-permits/v1/list/DefinitionQuotasCounterpartPermitsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'DefinitionQuotasCounterpartPermitsList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-contraparte/crear',
    name: 'DefinitionQuotasCounterpartPermitsCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-quotas-counterpart-permits/v1/create/DefinitionQuotasCounterpartPermitsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'DefinitionQuotasCounterpartPermitsList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-contraparte/editar/:id',
    name: 'DefinitionQuotasCounterpartPermitsEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-quotas-counterpart-permits/v1/edit/DefinitionQuotasCounterpartPermitsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'DefinitionQuotasCounterpartPermitsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/definicion-cupos-y-permisos-contraparte/ver/:id',
    name: 'DefinitionQuotasCounterpartPermitsView',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-quotas-counterpart-permits/v1/view/DefinitionQuotasCounterpartPermitsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'DefinitionQuotasCounterpartPermitsList',
        action: 'show',
      },
    },
  },
]
