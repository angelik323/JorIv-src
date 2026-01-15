export default [
  {
    path: '/portafolio-de-inversion/generar-papeleta',
    name: 'GenerateBallotMenu',
    component: () =>
      import(
        '@/views/investment-portfolio/generate-ballot/v1/menu/GenerateBallotMenu.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/generar-papeleta/crear',
    name: 'GenerateBallotCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/generate-ballot/v1/create/GenerateBallotCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
