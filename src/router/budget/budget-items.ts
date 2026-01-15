export default [
  {
    path: '/presupuesto/rubros',
    name: 'BudgetItemsList',
    component: () =>
      import('@/views/budget/budget-items/v1/list/BudgetItemsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetItemsList',
      },
    },
  },
  {
    path: '/presupuesto/rubros/crear',
    name: 'BudgetItemsCreate',
    component: () =>
      import('@/views/budget/budget-items/v1/create/BudgetItemsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetItemsList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuesto/rubros/editar/:id',
    name: 'BudgetItemsEdit',
    component: () =>
      import('@/views/budget/budget-items/v1/edit/BudgetItemsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetItemsList',
        action: 'edit',
      },
    },
  },
]
