export default [
  {
    path: '/fics/indexacion-ipc',
    name: 'IndexingIpcList',
    component: () =>
      import('@/views/fics/indexing-ipc/v1/list/IndexingIpcList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'IndexingIpcList',
      },
    },
  },
  {
    path: '/fics/indexacion-ipc/crear',
    name: 'IndexingIpcCreate',
    component: () =>
      import('@/views/fics/indexing-ipc/v1/create/IndexingIpcCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'IndexingIpcList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/indexacion-ipc/ver/:id',
    name: 'IndexingIpcRead',
    component: () =>
      import('@/views/fics/indexing-ipc/v1/read/IndexingIpcRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'IndexingIpcList',
        action: 'show',
      },
    },
  },
]
