export default [
  {
    path: '/presupuesto/consultas-traslados-presupuestales',
    name: 'BudgetTransfersQueryList',
    component: () =>
      import(
        '@/views/budget/budget-transfers-query/v1/list/BudgetTransfersQueryList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      // requiredValidRole: {
      //   module: 'Budget',
      //   view: 'BudgetItemsList',
      // },
    },
  },
  {
    path: '/presupuesto/consultas-traslados-presupuestales/documento-asociado/:id',
    name: 'BudgetTransfersQueryDocument',
    component: () =>
      import(
        '@/views/budget/budget-transfers-query/v1/document/BudgetTransfersQueryDocument.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      // requiredValidRole: {
      //   module: 'Budget',
      //   view: 'BudgetItemsList',
      //   action: 'create',
      // },
    },
  },
]
