export default [
  {
    path: '/portafolio-de-inversiones/registro-participacion-moneda-extranjera/crear',
    name: 'ForeignCurrencyWithdrawalCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/registration-withdrawal-participation-foreign/v1/create/ForeignCurrencyWithdrawalCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
