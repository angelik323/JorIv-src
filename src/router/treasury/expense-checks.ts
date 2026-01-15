export default [
  {
    path: '/tesoreria/cheques-con-egreso',
    name: 'ExpenseChecksList',
    component: () =>
      import('@/views/treasury/expense-checks/list/ExpenseChecksList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/reimprimir-cheque-con-egreso',
    name: 'ExpenseReprintChecksList',
    component: () =>
      import(
        '@/views/treasury/expense-checks/reprint/ExpenseCheckssListReprint.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
