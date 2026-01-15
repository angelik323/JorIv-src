export default [
  {
    path: '/contabilidad/consultas-consecutivas-de-comprobantes',
    name: 'ConsecutiveQueriesOfReceiptsList',
    component: () =>
      import(
        '@/views/accounting/consecutive-queries-of-receipts/v1/list/ConsecutiveQueriesOfReceiptsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ConsecutiveQueriesOfReceiptsList',
      },
    },
  },
]
