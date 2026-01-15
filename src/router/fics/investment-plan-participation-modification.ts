export default [
  {
    path: '/fics/modificacion-tipo-participacion-plan-inversion',
    name: 'InvestmentPlanParticipationModificationList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanParticipationModificationList',
      },
    },
    component: () =>
      import(
        '@/views/fics/investment-plan-participation-modification/v1/list/InvestmentPlanParticipationModificationList.vue'
      ),
  },
  {
    path: '/fics/modificacion-tipo-participacion-plan-inversion/crear',
    name: 'InvestmentPlanParticipationModificationCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanParticipationModificationList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/investment-plan-participation-modification/v1/create/InvestmentPlanParticipationModificationCreate.vue'
      ),
  },
]
