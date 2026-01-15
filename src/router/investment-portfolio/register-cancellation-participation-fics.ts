export default [
  {
    path: '/portafolio-de-inversiones/registro-cancelacion-participacion-fics',
    name: 'RegisterCancellationParticipationFicsCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-cancellation-participation-fics/v1/create/RegisterCancellationParticipationFicsCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-cancelacion-participacion-fics-extranjera',
    name: 'RegisterCancellationParticipationFicsForeignCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-cancellation-participation-fics-foreign/v1/create/RegisterCancellationParticipationFicsForeignCreate.vue'
      ),
  },
]
