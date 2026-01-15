export default [
  {
    path: '/portafolio-de-inversiones/registro-manual-valor-unidad',
    name: 'ManualUnitValueList',
    component: () =>
      import(
        '@/views/investment-portfolio/manual-unit-value/v1/list/ManualUnitValueList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ManualUnitValueList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/registro-manual-valor-unidad/crear',
    name: 'ManualUnitValueCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/manual-unit-value/v1/create/ManualUnitValueCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ManualUnitValueList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/registro-manual-valor-unidad/ver/:id',
    name: 'ManualUnitValueView',
    component: () =>
      import(
        '@/views/investment-portfolio/manual-unit-value/v1/view/ManualUnitValueView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ManualUnitValueList',
        action: 'show',
      },
    },
  },
]
