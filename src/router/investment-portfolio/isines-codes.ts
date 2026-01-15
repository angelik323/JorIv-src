export default [
  {
    path: '/portafolio-de-inversiones/codigos-isines',
    name: 'IsinesCodesList',
    component: () =>
      import(
        '@/views/investment-portfolio/isines-codes/v1/list/IsinesCodesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IsinesCodesList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/codigos-isines/crear',
    name: 'IsinesCodesCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/isines-codes/v1/create/IsinesCodesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IsinesCodesList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/codigos-isines/editar/:id',
    name: 'IsinesCodesEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/isines-codes/v1/edit/IsinesCodesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IsinesCodesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/codigos-isines/ver/:id',
    name: 'IsinesCodesView',
    component: () =>
      import(
        '@/views/investment-portfolio/isines-codes/v1/view/IsinesCodesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'IsinesCodesList',
        action: 'show',
      },
    },
  },
]
