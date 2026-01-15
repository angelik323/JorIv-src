export default [
  {
    path: '/presupuesto/comparativo-presupuestal',
    name: 'BudgetComparisonList',
    component: () =>
      import(
        '@/views/budget/budget-comparison/v1/list/BudgetComparisonList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      // requiredValidRole: {
      //   module: 'Budget',
      //   view: 'BudgetComparisonList',
      // },
    },
  },
]
