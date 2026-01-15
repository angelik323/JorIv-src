export default [
  {
    path: '/listado-de-comprobantes-contables',
    name: 'AccountingReportListReceiptsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounting/accouting-report/reports/ListReceipts/create/AccountingReportListReceiptsCreate.vue'
      ),
  },
  
]
