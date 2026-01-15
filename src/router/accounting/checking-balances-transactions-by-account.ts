export default [
  {
    path: '/contabilidad/consulta-saldos-y-movimientos-por-cuenta',
    name: 'CheckingBalancesAndTransactionsByAccount',
    component: () =>
      import(
        '@/views/accounting/checking-balances-and-transactions-by-account/list/CheckingBalancesAndTransactionsByAccount.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'CheckingBalancesAndTransactionsByAccount',
      },
    },
  },
]
