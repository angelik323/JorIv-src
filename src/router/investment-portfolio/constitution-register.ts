export default [
  {
    path: '/portafolio-de-inversion/registro-constitucion-participacion-fic',
    name: 'RegisterConstitutionList',
    component: () =>
      import(
        '@/views/investment-portfolio/registration-constitution/v1/list/RegisterConstitutionList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/registro-constitucion-participacion-fic/crear',
    name: 'RegisterConstitutionCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/registration-constitution/v1/create/RegisterConstitutionCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/registro-constitucion-participacion-fic/crear/moneda-extranjera',
    name: 'RegisterConstitutionForeignCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/registration-constitution/v1/create/RegisterConstitutionForeignCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
