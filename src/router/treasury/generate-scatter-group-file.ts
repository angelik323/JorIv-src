export default [
  {
    path: '/tesoreria/generar-grupo-dispersion',
    name: 'GenerateScatterGroupFile',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/treasury/generate-scatter-group-file/v1/list/GenerateScatterGroupFileList.vue'
      ),
  },
]
