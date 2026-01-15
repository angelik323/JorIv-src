export default [
  {
    path: '/presupuesto/registro-operaciones',
    name: 'BudgetOperationLogsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetOperationLogsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/budget/operation-logs/v1/list/BudgetOperationLogsList.vue'
      ),
  },
]
