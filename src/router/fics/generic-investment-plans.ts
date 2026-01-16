export default [
  {
    path: '/fics/planes-inversion-genericos',
    name: 'GenericInvestmentPlansList',
    component: () =>
      import(
        '@/views/fics/generic-investment-plans/v1/list/GenericInvestmentPlansList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GenericInvestmentPlansList',
      },
    },
  },
  {
    path: '/fics/planes-inversion-genericos/crear',
    name: 'GenericInvestmentPlansCreate',
    component: () =>
      import(
        '@/views/fics/generic-investment-plans/v1/create/GenericInvestmentPlansCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GenericInvestmentPlansList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/planes-inversion-genericos/legalizacion/ver/:id',
    name: 'GenericInvestmentPlansLegalizeView',
    component: () =>
      import(
        '@/views/fics/generic-investment-plans/v1/view-legalization/LegalizationResourcesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GenericInvestmentPlansList',
        action: 'export',
      },
    },
  },
  {
    path: '/fics/planes-inversion-genericos/legalizacion/crear/:id',
    name: 'GenericInvestmentPlansLegalizeCreate',
    component: () =>
      import(
        '@/views/fics/generic-investment-plans/v1/create-legalization/LegalizationResourcesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'GenericInvestmentPlansList',
        action: 'action_legalize',
      },
    },
  },
  {
    path: '/fics/planes-inversion-genericos/legalizacion/cancel/:id',
    name: 'GenericInvestmentPlansLegalizeCancel',
    component: () =>
      import(
        '@/views/fics/generic-investment-plans/v1/cancel-legalization/LegalizationResourcesCancel.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'GenericInvestmentPlansList',
        action: 'action_annul',
      },
    },
  },
]
