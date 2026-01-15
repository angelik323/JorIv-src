export default [
  {
    path: '/portafolio-de-inversiones/fic-participaciones-adicion-moneda-extranjera/crear',
    name: 'FicParticipationsAdditionForeignCurrencyCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/fic-participations-addition-foreign-currency/v1/create/FicParticipationsAdditionForeignCurrencyCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]