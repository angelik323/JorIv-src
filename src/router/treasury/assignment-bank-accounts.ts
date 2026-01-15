export default [
  {
    path: '/tesoreria/cesion-cuentas-bancarias',
    name: 'AssignmentBankAccountsList',
    component: () =>
      import(
        '@/views/treasury/assignment-bank-accounts/v2/list/assignmentBankAccountsList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
