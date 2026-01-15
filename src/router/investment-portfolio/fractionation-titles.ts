export default [
  {
    path: '/portafolio-de-inversiones/fraccionamiento-titulos',
    name: 'FractionationTitleList',
    component: () =>
      import(
        '@/views/investment-portfolio/fractionation-titles/v1/list/FractionationTitleList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/fraccionamiento-titulos/crear',
    name: 'FractionationTitleCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/fractionation-titles/v1/create/FractionationTitlesCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/fraccionamiento-titulos/ver/:id',
    name: 'FractionationTitleView',
    component: () =>
      import(
        '@/views/investment-portfolio/fractionation-titles/v1/view/FractionationTitlesView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
