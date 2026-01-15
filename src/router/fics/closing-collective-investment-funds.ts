export default [
  {
    path: '/fics/cierre-fondos-inversion-colectiva',
    name: 'ClosingCollectiveInvestmentFundsList',
    component: () =>
      import(
        '@/views/fics/closing-collective-investment-funds/v1/list/ClosingCollectiveInvestmentFundsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'ClosingCollectiveInvestmentFundsList',
      },
    },
  },
]
