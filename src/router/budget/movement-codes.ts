export default [
  {
    path: '/presupuestos/codigos-movimientos',
    name: 'BudgetMovementCodesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetMovementCodesList',
      },
    },
    component: () =>
      import(
        '@/views/budget/movement-codes/v1/list/BudgetMovementCodesList.vue'
      ),
  },
  {
    path: '/presupuestos/codigos-movimientos/crear',
    name: 'BudgetMovementCodesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetMovementCodesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/budget/movement-codes/v1/create/BudgetMovementCodesCreate.vue'
      ),
  },
  {
    path: '/presupuestos/codigos-movimientos/editar/:id',
    name: 'BudgetMovementCodesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetMovementCodesList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/budget/movement-codes/v1/edit/BudgetMovementCodesEdit.vue'
      ),
  },
]
