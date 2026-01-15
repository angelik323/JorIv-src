export default [
  {
    path: '/tesoreria/generar-cartas-grupo-dispersion',
    name: 'GenerateDispersionGroupLetterList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/treasury/generate-dispersion-group-letter/v1/list/GenerateDispersionGroupLetterList.vue'
      ),
  },
]
