export default [
  {
    path: '/portafolio-de-inversiones/fic-participaciones-adicion-moneda-local/crear',
    name: 'FicParticipationsAdditionLocalCurrencyCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/fic-participations-addition-local-currency/v1/create/FicParticipationsAdditionLocalCurrencyCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]