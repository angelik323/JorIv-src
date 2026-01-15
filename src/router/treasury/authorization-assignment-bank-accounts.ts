export default [
  {
    path: '/tesoreria/autorizacion-cesion-cuentas-bancarias',
    name: 'AuthorizationAssignmentBankAccountsList',
    component: () =>
      import(
        '@/views/treasury/authorization-assignment-bank-accounts/v2/list/AuthorizationAssignmentBankAccountsList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
