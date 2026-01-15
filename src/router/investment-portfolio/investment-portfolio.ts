export default [
  {
    path: '/portafolio-de-inversiones',
    name: 'InvestmentPortfolioList',
    component: () =>
      import(
        '@/views/investment-portfolio/investment-portfolio/v1/list/InvestmentPortfolioList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InvestmentPortfolioList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/crear',
    name: 'InvestmentPortfolioCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/investment-portfolio/v1/create/InvestmentPortfolioCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InvestmentPortfolioList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/editar/:id',
    name: 'InvestmentPortfolioEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/investment-portfolio/v1/edit/InvestmentPortfolioEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InvestmentPortfolioList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/:id',
    name: 'InvestmentPortfolioView',
    component: () =>
      import(
        '@/views/investment-portfolio/investment-portfolio/v1/view/InvestmentPortfolioView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'InvestmentPortfolioList',
        action: 'show',
      },
    },
  },
]
