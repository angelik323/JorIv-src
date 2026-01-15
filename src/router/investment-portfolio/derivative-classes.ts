export default [
  {
    path: '/portafolio-de-inversiones/clases-derivados',
    name: 'DerivativeClassesList',
    component: () =>
      import(
        '@/views/investment-portfolio/derivate-classes/v1/list/DerivativeClassesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/portafolio-de-inversiones/clases-derivados/crear',
    name: 'DerivativeClassesCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/derivate-classes/v1/create/DerivativeClassesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/portafolio-de-inversiones/clases-derivados/editar/:id',
    name: 'DerivativeClassesEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/derivate-classes/v1/edit/DerivativeClassesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/portafolio-de-inversiones/clases-derivados/ver/:id',
    name: 'DerivativeClassesView',
    component: () =>
      import(
        '@/views/investment-portfolio/derivate-classes/v1/view/DerivativeClassesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
