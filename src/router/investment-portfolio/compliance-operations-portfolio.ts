export default [
  {
    path: '/portafolio-de-inversiones/cumplimiento-operaciones-portafolio',
    name: 'ComplianceOperationsPortfolioList',
    component: () =>
      import(
        '@/views/investment-portfolio/compliance-operations-portfolio/v1/list/ComplianceOperationsPortfolioList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ComplianceOperationsPortfolioList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/cumplimiento-operaciones-portafolio/crear',
    name: 'ComplianceOperationsPortfolioCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/compliance-operations-portfolio/v1/create/ComplianceOperationsPortfolioCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ComplianceOperationsPortfolioList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/cumplimiento-operaciones-portafolio/anular',
    name: 'ComplianceOperationsPortfolioCancel',
    component: () =>
      import(
        '@/views/investment-portfolio/compliance-operations-portfolio/v1/cancel/ComplianceOperationsPortfolioCancel.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'ComplianceOperationsPortfolioCancel',
        action: 'edit',
      },
    },
  },
]
