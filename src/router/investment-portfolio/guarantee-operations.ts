export default [
  {
    path: '/portafolio-de-inversiones/llamado-al-margen-y-mantenimiento-de-garantias',
    name: 'GuaranteeOperationsList',
    component: () =>
      import(
        '@/views/investment-portfolio/guarantee-operations/v1/list/GuaranteeOperationsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'GuaranteeOperationsList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/llamado-al-margen-y-mantenimiento-de-garantias/crear-llamado-al-margen',
    name: 'MarginCallCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/guarantee-operations/v1/create/MarginCallCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'GuaranteeOperationsList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/llamado-al-margen-y-mantenimiento-de-garantias/ver-llamado-al-margen/:id',
    name: 'MarginCallView',
    component: () =>
      import(
        '@/views/investment-portfolio/guarantee-operations/v1/view/MarginCallView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'GuaranteeOperationsList',
        action: 'show',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/llamado-al-margen-y-mantenimiento-de-garantias/crear-mantenimiento-de-garantias',
    name: 'MaintenanceGuaranteesCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/guarantee-operations/v1/create/MaintenanceGuaranteesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'GuaranteeOperationsList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/llamado-al-margen-y-mantenimiento-de-garantias/ver-mantenimiento-de-garantias/:id',
    name: 'MaintenanceGuaranteesView',
    component: () =>
      import(
        '@/views/investment-portfolio/guarantee-operations/v1/view/MaintenanceGuaranteesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'GuaranteeOperationsList',
        action: 'show',
      },
    },
  },
]
