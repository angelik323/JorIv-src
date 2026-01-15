export default [
  {
    path: '/fics/lineas-de-negocio-y-tipos-de-participacion',
    name: 'BusinessLineList',
    component: () =>
      import('@/views/fics/business-line/v1/list/BusinessLineList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'BusinessLineList',
      },
    },
  },
  {
    path: '/fics/lineas-de-negocio-y-tipos-de-participacion/crear',
    name: 'BusinessLineCreate',
    component: () =>
      import('@/views/fics/business-line/v1/create/BusinessLineCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'BusinessLineList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/lineas-de-negocio-y-tipos-de-participacion/editar/:id',
    name: 'BusinessLineEdit',
    component: () =>
      import('@/views/fics/business-line/v1/edit/BusinessLineEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'BusinessLineList',
        action: 'edit',
      },
    },
  },
]
