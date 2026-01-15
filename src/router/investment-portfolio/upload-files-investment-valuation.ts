export default [
  {
    path: '/portafolio-de-inversiones/cargue-archivos-valoracion-inversiones/crear',
    name: 'UploadFilesInvestmentValuationCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/upload-files-investment-valuation/v1/create/UploadFilesInvestmentValuationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
