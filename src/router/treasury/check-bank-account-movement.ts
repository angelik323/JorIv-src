export default [
  {
    path: '/tesoreria/consulta-movimiento-cuenta-bancaria',
    name: 'CheckBankAccountMovementList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckBankAccountMovementList',
      },
    },
    component: () =>
      import(
        '@/views/treasury/check-bank-account-movement/v1/list/CheckBankAccountMovementList.vue'
      ),
  },
]
