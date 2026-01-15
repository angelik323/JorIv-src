export default [
  {
    path: '/portafolio-de-inversiones/registro-participacion-moneda-local/crear',
    name: 'LocalCurrencyWithdrawalCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/registration-withdrawal-participation-local/v1/create/LocalCurrencyWithdrawalCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
