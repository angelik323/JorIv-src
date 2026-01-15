export default [
  {
    path: '/portafolio-de-inversiones/calificadora-de-riesgo',
    name: 'RiskRatingAgenciesList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/risk-rating-agencies/v1/list/RiskRatingAgenciesList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/calificadora-de-riesgo/crear',
    name: 'RiskRatingAgenciesCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/risk-rating-agencies/v1/create/RiskRatingAgenciesCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/calificadora-de-riesgo/editar/:id',
    name: 'RiskRatingAgenciesEdit',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/risk-rating-agencies/v1/edit/RiskRatingAgenciesEdit.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/calificadora-de-riesgo/ver/:id',
    name: 'RiskRatingAgenciesView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/risk-rating-agencies/v1/view/RiskRatingAgenciesView.vue'
      ),
  },
]
