export default [
  {
    path: '/presupuesto/validaciones-cierre-vigencia',
    name: 'ClosureValidationsList',
    component: () =>
      import('@/views/budget/closure-validations/v1/list/ClosureValidationsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'ClosureValidationsList',
      }
    },
  },
  {
    path: '/presupuesto/validaciones-cierre-vigencia/crear',
    name: 'ClosureValidationsCreate',
    component: () =>
      import('@/views/budget/closure-validations/v1/create/ClosureValidationsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'ClosureValidationsList',
        action: 'create',
      }
    },
  },
  {
    path: '/presupuesto/validaciones-cierre-vigencia/editar/:id',
    name: 'ClosureValidationsEdit',
    component: () =>
      import('@/views/budget/closure-validations/v1/edit/ClosureValidationsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'ClosureValidationsList',
        action: 'edit',
      }
    },
  },
]
