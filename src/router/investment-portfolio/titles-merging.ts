export default [
  {
    path: '/portafolio-de-inversiones/englobe-de-titulos',
    name: 'TitlesMergingList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/titles-merging/v1/list/TitlesMergingList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/englobe-de-titulos/crear',
    name: 'TitlesMergingCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/titles-merging/v1/create/TitlesMergingCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/englobe-de-titulos/ver/:id',
    name: 'TitlesMergingView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/titles-merging/v1/view/TitlesMergingView.vue'
      ),
  },
]
