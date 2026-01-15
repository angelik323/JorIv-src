export default [
  {
    path: '/presupuesto/consulta-saldos-presupuestales',
    name: 'BudgetBalanceQueryList',
    component: () =>
      import(
        '@/views/budget/budget-balance-query/v1/list/BudgetBalanceQueryList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      // requiredValidRole: {
      //   module: 'Budget',
      //   view: 'BudgetBalanceQueryList',
      // },
    },
  },
]
