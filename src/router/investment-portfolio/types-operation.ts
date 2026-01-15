export default [
  {
    path: '/portafolio-de-inversion/tipos-de-operacion',
    name: 'TypesOperationList',
    component: () =>
      import(
        '@/views/investment-portfolio/types-operation/v1/list/TypesOperationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'TypesOperationList',
      },
    },
  },
  {
    path: '/portafolio-de-inversion/tipos-de-operacion/crear',
    name: 'TypesOperationCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/types-operation/v1/create/TypesOperationCreate.vue'
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
  },
  //TODO: Se remueve parcialmente
  // {
  //   path: '/portafolio-de-inversion/tipos-de-operacion/editar/:id',
  //   name: 'TypesOperationEdit',
  //   component: () =>
  //     import(
  //       '@/views/investment-portfolio/types-operation/v1/edit/TypesOperationEdit.vue'
  //     ),
  //   meta: {
  //     requiresAuth: true,
  //     requiresFirstPasswordChanged: true,
  //     requiredValidRole: {
  //       module: 'InvestmentPortfolio',
  //       view: 'TypesOperationList',
  //       action: 'edit',
  //     },
  //   },
  // },
  {
    path: '/portafolio-de-inversion/tipos-de-operacion/ver/:id',
    name: 'TypesOperationView',
    component: () =>
      import(
        '@/views/investment-portfolio/types-operation/v1/view/TypesOperationView.vue'
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
