export default [
  {
    path: '/presupuesto/traslados-presupuestales',
    name: 'BudgetTransferList',
    component: () =>
      import('@/views/budget/budget-transfers/v1/list/BudgetTransferList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetTransferList',
        action: 'list',
      },
    },
  },
  {
    path: '/presupuesto/traslados-presupuestales/crear',
    name: 'BudgetTransferCreate',
    component: () =>
      import(
        '@/views/budget/budget-transfers/v1/create/BudgetTransferCreate.vue'
      ),
    meta: {
      requerisAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetTransferList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuesto/traslados-presupuestales/editar/:id',
    name: 'BudgetTransferEdit',
    component: () =>
      import(
        '@/views/budget/budget-transfers/v1/create/BudgetTransferCreate.vue'
      ),
    meta: {
      requerisAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetTransferList',
        action: 'edit',
      },
    },
  },
]
