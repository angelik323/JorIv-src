export default [
  {
    path: '/presupuestos/niveles-presupuestales',
    name: 'BudgetLevelsList',
    component: () =>
      import('@/views/budget/budget-levels/v1/list/BudgetLevels.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetLevelsList',
      },
    },
  },
  {
    path: '/presupuestos/niveles-presupuestales/crear',
    name: 'BudgetLevelsCreate',
    component: () =>
      import('@/views/budget/budget-levels/v1/create/BudgetLevelsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetLevelsList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuestos/niveles-presupuestales/editar/:id',
    name: 'BudgetLevelsEdit',
    component: () =>
      import('@/views/budget/budget-levels/v1/edit/BudgetLevelsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetLevelsList',
        action: 'edit',
      },
    },
  },
]
