export default [
  {
    path: '/fics/montos-de-retiros-y-aportes-maximos',
    name: 'WithdrawalContributionLimitsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'WithdrawalContributionLimitsList',
      },
    },
    component: () =>
      import(
        '@/views/fics/withdrawal-contribution-limits/v1/list/WithdrawalContributionLimitsList.vue'
      ),
  },
]
