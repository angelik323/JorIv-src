export default [
  {
    path: '/contabilidad/consulta-movimientos-cuentas',
    name: 'QueryMovementAccountsList',
    component: () =>
      import(
        '@/views/accounting/query-movement-accounts/v1/list/QueryMovementAccountsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'QueryMovementAccountsList',
      },
    },
  },
]
