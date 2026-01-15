export default [
  {
    path: '/fics/codigos-movimiento',
    name: 'MovementCodesList',
    component: () =>
      import('@/views/fics/movement-codes/v2/list/MovementCodesList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'MovementCodesList',
      },
    },
  },
  {
    path: '/fics/codigos-movimiento/crear',
    name: 'MovementCodesCreate',
    component: () =>
      import('@/views/fics/movement-codes/v2/create/MovementCodesCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'MovementCodesList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/codigos-movimiento/ver/:id',
    name: 'MovementCodesRead',
    component: () =>
      import('@/views/fics/movement-codes/v2/read/MovementCodesRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'MovementCodesList',
        action: 'read',
      },
    },
  },
  {
    path: '/fics/codigos-movimiento/editar/:id',
    name: 'MovementCodesEdit',
    component: () =>
      import('@/views/fics/movement-codes/v2/edit/MovementCodesEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'MovementCodesList',
        action: 'edit',
      },
    },
  },
]
