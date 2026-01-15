export default [
  {
    path: '/fics/consulta-proceso-cierre-fondo-inversion',
    name: 'ConsultClosingProcessInvestmentFundsList',
    component: () =>
      import(
        '@/views/fics/consult-closing-process-investment-funds/v1/list/ConsultClosingProcessInvestmentFundsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'ClosingCollectiveInvestmentFundsList',
      },
    },
  },
]
