export default [
  {
    path: '/presupuesto/recursos/crear',
    name: 'ResourceBudgetCreate',
    component: () =>
      import(
        '@/views/budget/budget-resources/v1/create/ResourceBudgetCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      title: 'Crear Recurso Presupuestal',
      requiredValidRole: {
        module: 'Budget',
        view: 'ResourceBudgetList',
        action: 'create',
      },
    },
  },
  {
    path: '/presupuesto/recursos/editar/:id',
    name: 'ResourceBudgetEdit',
    component: () =>
      import('@/views/budget/budget-resources/v1/edit/ResourceBudgetEdit.vue'),
    meta: {
      requiresAuth: true,
      title: 'Editar Recurso Presupuestal',
      requiredValidRole: {
        module: 'Budget',
        view: 'ResourceBudgetList',
        action: 'edit',
      },
    },
  },
  {
    path: '/presupuesto/recursos/ver/:id',
    name: 'ResourceBudgetView',
    component: () =>
      import('@/views/budget/budget-resources/v1/view/ResourceBudgetView.vue'),
    meta: {
      requiresAuth: true,
      title: 'Recursos Presupuestales',
      requiredValidRole: {
        module: 'Budget',
        view: 'ResourceBudgetList',
        action: 'show',
      },
    },
  },
  {
    path: '/presupuesto/recursos',
    name: 'ResourceBudgetList',
    component: () =>
      import('@/views/budget/budget-resources/v1/list/ResourceBudgetList.vue'),
    meta: {
      requiresAuth: true,
      title: 'Recursos Presupuestales',
      requiredValidRole: {
        module: 'Budget',
        view: 'ResourceBudgetList',
      },
    },
  },
]
