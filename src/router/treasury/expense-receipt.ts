export default [
  {
    path: '/tesoreria/comprobantes-de-egreso',
    name: 'ExpenseReceiptList',
    component: () =>
      import('@/views/treasury/expense-receipt/v1/list/ExpenseReceiptList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
