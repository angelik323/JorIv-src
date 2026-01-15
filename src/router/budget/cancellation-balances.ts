export default [
  {
    path: '/presupuesto/cancelacion-saldos',
    name: 'BudgetCancellationBalancesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetCancellationBalancesList',
      },
    },
    component: () =>
      import(
        '@/views/budget/cancellation-balances/v1/list/BudgetCancellationBalancesList.vue'
      ),
  },
]
