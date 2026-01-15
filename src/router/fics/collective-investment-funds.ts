export default [
  {
    path: '/fics/fondos-inversion-colectiva',
    name: 'CollectiveInvestmentFundsList',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/list/CollectiveInvestmentFundsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/crear',
    name: 'CollectiveInvestmentFundsCreate',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/create/CollectiveInvestmentFundsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/editar/:id',
    name: 'CollectiveInvestmentFundsEdit',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/edit/CollectiveInvestmentFundsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/ver/:id',
    name: 'CollectiveInvestmentFundsView',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/view/CollectiveInvestmentFundsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'view',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/consultar-porcentajes/:id',
    name: 'ConsultPercentagesView',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/consult-percentages/v1/view/ConsultPercentagesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'view',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/consultar-rentabilidades/:id',
    name: 'ConsultProfitabilityView',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/consult-profitability/v1/view/ConsultProfitabilityView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'view',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/consultar-transmision-formato-523/:id',
    name: 'ConsultTransmisionFormat523View',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/consult-transmision-format-523/v1/view/ConsultTransmisionFormat523View.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'view',
      },
    },
  },
  {
    path: '/fics/fondos-inversion-colectiva/consecutivos-tipos-participacion/:id',
    name: 'ParticipationTypeSequencesCreate',
    component: () =>
      import(
        '@/views/fics/collective-investment-funds/v1/participation-type-sequences/v1/create/ParticipationTypeSequencesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
        action: 'view',
      },
    },
  },
]
