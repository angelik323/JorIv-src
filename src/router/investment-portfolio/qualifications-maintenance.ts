export default [
  {
    path: '/portafolio-de-inversiones/mantenimiento-calificacion-emisor',
    name: 'QualificationsMaintenanceList',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications-maintenance/v1/list/QualificationsMaintenanceList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsMaintenanceList',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/mantenimiento-calificacion-emisor/editar/:id',
    name: 'QualificationsMaintenanceEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications-maintenance/v1/edit/QualificationsMaintenanceEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsMaintenanceList',
        action: 'edit',
      },
    },
  },
  {
    path: '/portafolio-de-inversiones/mantenimiento-calificacion-emisor/ver/:id',
    name: 'QualificationsMaintenanceView',
    component: () =>
      import(
        '@/views/investment-portfolio/qualifications-maintenance/v1/view/QualificationsMaintenanceView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'InvestmentPortfolio',
        view: 'QualificationsMaintenanceList',
        action: 'show',
      },
    },
  },
]
