export default [
  {
    path: '/presupuesto/autorizacion-operaciones',
    name: 'OperationAuthorizationsList',
    component: () =>
      import(
        '@/views/budget/operation-authorizations/v1/list/OperationAuthorizationsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'OperationAuthorizationsList',
      },
    },
  },
  {
    path: '/presupuesto/autorizacion-operaciones/ver/:id',
    name: 'OperationAuthorizationsView',
    component: () =>
      import(
        '@/views/budget/operation-authorizations/v1/view/OperationAuthorizationsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'OperationAuthorizationsList',
        action: 'show',
      },
    },
  },
  {
    path: '/presupuesto/autorizacion-operaciones/editar/:id',
    name: 'OperationAuthorizationsEdit',
    component: () =>
      import(
        '@/views/budget/operation-authorizations/v1/edit/OperationAuthorizationsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'OperationAuthorizationsList',
        action: 'edit',
      },
    },
  },
]
