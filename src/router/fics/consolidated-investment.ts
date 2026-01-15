export default [
  {
    path: '/fics/consolidador-compartimientos',
    name: 'ConsolidatedInvestmentList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: { module: 'Fics', view: 'ConsolidatedInvestmentList' },
    },
    component: () =>
      import(
        '@/views/fics/consolidated-investment/list/ConsolidatedInvestmentList.vue'
      ),
  },
]
