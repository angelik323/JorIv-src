export default [
  {
    path: '/terceros',
    name: 'ThirdPartiesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ThirdParty',
        view: 'ThirdPartiesList',
      },
    },
    component: () => import('@/views/third-parties/list/ThirdPartiesList.vue'),
  },
  {
    path: '/terceros/crear',
    name: 'ThirdPartiesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ThirdParty',
        view: 'ThirdPartiesList',
        action: 'create',
      },
    },
    component: () =>
      import('@/views/third-parties/create/ThirdPartiesCreate.vue'),
  },
  {
    path: '/terceros/editar/:id',
    name: 'ThirdPartiesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ThirdParty',
        view: 'ThirdPartiesList',
        action: 'edit',
      },
    },
    component: () => import('@/views/third-parties/edit/ThirdPartiesEdit.vue'),
  },
  {
    path: '/terceros/ver/:id',
    name: 'ThirdPartiesView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ThirdParty',
        view: 'ThirdPartiesList',
        action: 'show',
      },
    },
    component: () => import('@/views/third-parties/read/ThirdPartiesView.vue'),
  },
  {
    path: '/terceros/fideicomiso',
    name: 'TrustList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'ThirdParty',
        view: 'ThirdPartiesList',
        action: 'show',
      },
    },
    component: () => import('@/views/trust/v1/list/TrustList.vue'),
  },
  // {
  //   path: '/terceros/fideicomiso/ver/:id',
  //   name: 'TrustView',
  //   meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  //   component: () => import('@/views/third-parties/read/ThirdPartiesView.vue'),
  // },
]
