export default [
  {
    path: '/portafolio-de-inversiones/tipos-cobertura',
    name: 'TypesCoverageList',
    component: () =>
      import(
        '@/views/investment-portfolio/types-coverage/v1/list/TypesCoverageList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/tipos-cobertura/crear',
    name: 'TypesCoverageCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/types-coverage/v1/create/TypesCoverageCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/tipos-cobertura/editar/:id',
    name: 'TypesCoverageEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/types-coverage/v1/edit/TypesCoverageEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
