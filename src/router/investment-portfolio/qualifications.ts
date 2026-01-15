export default [
  {
    path: '/portafolio-de-inversiones/calificaciones',
    name: 'QualificationsList',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications/v1/list/QualificationsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/calificaciones/crear',
    name: 'QualificationsCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications/v1/create/QualificationsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsList',
        action: 'create',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/calificaciones/editar/:id',
    name: 'QualificationsEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications/v1/edit/QualificationsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/calificaciones/ver/:id',
    name: 'QualificationsView',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications/v1/view/QualificationsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsList',
        action: 'show',
      },
    },
  },
]
