export default [
  {
    path: '/portafolio-de-inversiones/definicion-parametros-contables',
    name: 'DefinitionAccountingParametersList',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-accounting-parameters/v1/list/DefinitionAccountingParametersList.vue'
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
    path: '/portafolio-de-inversiones/definicion-parametros-contables/crear',
    name: 'DefinitionAccountingParametersCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-accounting-parameters/v1/create/DefinitionAccountingParametersCreate.vue'
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
    path: '/portafolio-de-inversiones/definicion-parametros-contables/editar/:id',
    name: 'DefinitionAccountingParametersEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-accounting-parameters/v1/edit/DefinitionAccountingParametersEdit.vue'
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
    path: '/portafolio-de-inversiones/definicion-parametros-contables/ver/:id',
    name: 'DefinitionAccountingParametersView',
    component: () =>
      import(
        '@/views/investment-portfolio/definition-accounting-parameters/v1/view/DefinitionAccountingParametersView.vue'
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
