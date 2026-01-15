export default [
  {
    path: '/fics/tipos-fondos-y-operacion',
    name: 'CollectiveInvestmentFundList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'CollectiveInvestmentFundsList',
      },
    },
    component: () =>
      import(
        '@/views/fics/funds-types-operation/v1/list/CollectiveInvestmentFundList.vue'
      ),
  },
]
