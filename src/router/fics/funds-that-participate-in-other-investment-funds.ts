export default [
  {
    path: '/fics/fondos-que-participan-en-otros-fondos-de-inversion',
    name: 'FundsThatParticipateInOtherInvestmentFundsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'FundsThatParticipateInOtherInvestmentFundsList',
      },
    },
    component: () =>
      import(
        '@/views/fics/funds-that-participate-in-other-investment-funds/v1/list/FundsThatParticipateInOtherInvestmentFundsList.vue'
      ),
  },
]
