export default [
  {
    path: '/portafolio-de-inversiones/permisos-usuarios-por-portafolio',
    name: 'PermissionUserPorfolioList',
    component: () =>
      import(
        '@/views/investment-portfolio/permission-user-porfolio/v1/list/PermissionUserPorfolioList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PermissionUserPorfolioList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/permisos-usuarios-por-portafolio/crear',
    name: 'PermissionUserPorfolioCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/permission-user-porfolio/v1/create/PermissionUserPorfolioCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PermissionUserPorfolioList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/permisos-usuarios-por-portafolio/editar/:id',
    name: 'PermissionUserPorfolioEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/permission-user-porfolio/v1/edit/PermissionUserPorfolioEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PermissionUserPorfolioList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/permisos-usuarios-por-portafolio/ver/:id',
    name: 'PermissionUserPorfolioView',
    component: () =>
      import(
        '@/views/investment-portfolio/permission-user-porfolio/v1/view/PermissionUserPorfolioView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'PermissionUserPorfolioList',
        action: 'show',
      },
    },
  },
]
