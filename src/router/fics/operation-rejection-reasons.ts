export default [
  {
    path: '/fics/causales-rechazo-operacion',
    name: 'OperationRejectionReasonsList',
    component: () =>
      import(
        '@/views/fics/operation-rejection-reasons/v1/list/OperationRejectionReasonsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'OperationRejectionReasonsList',
      },
    },
  },
  {
    path: '/fics/causales-rechazo-operacion/crear',
    name: 'OperationRejectionReasonsCreate',
    component: () =>
      import(
        '@/views/fics/operation-rejection-reasons/v1/create/OperationRejectionReasonsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'OperationRejectionReasonsList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/causales-rechazo-operacion/editar/:id',
    name: 'OperationRejectionReasonsEdit',
    component: () =>
      import(
        '@/views/fics/operation-rejection-reasons/v1/edit/OperationRejectionReasonsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'OperationRejectionReasonsList',
        action: 'edit',
      },
    },
  },
]
