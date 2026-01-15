export default [
  {
    path: '/presupuesto/cierre-presupuestos',
    name: 'BudgetClosureList',
    component: () =>
      import('@/views/budget/budget-closure/v1/list/BudgetClosureList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetClosureList',
        action: 'list'
      },
    },
  },
  {
    path: '/presupuesto/cierre-presupuestos/crear',
    name: 'BudgetClosureCreate',
    component: () =>
      import('@/views/budget/budget-closure/v1/create/BudgetClosureCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetClosureList',
        action: 'action_generate',
      },
    },
  },
  {
    path: '/presupuesto/cierre-presupuestos/ver/:id/proceso/:actionType',
    name: 'BudgetClosureView',
    component: () =>
      import('@/views/budget/budget-closure/v1/view/BudgetClosureView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetClosureList',
        action: 'show',
      },
    },
  },
]
