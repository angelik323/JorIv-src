export default [
  {
    path: '/sarlaft/listas-propias',
    name: 'SarlaftOwnList',
    component: () =>
      import('@/views/sarlaft/own-list/v1/record/OwnListRecord.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/sarlaft/listas-propias/crear',
    name: 'SarlaftOwnListCreate',
    component: () =>
      import('@/views/sarlaft/own-list/v2/create/OwnListCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/sarlaft/listas-propias/editar/:id',
    name: 'SarlaftOwnListEdit',
    component: () => import('@/views/sarlaft/own-list/v1/edit/OwnListEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/sarlaft/listas-propias/detalle/:id',
    name: 'SarlaftOwnListDetail',
    component: () =>
      import('@/views/sarlaft/own-list/v1/detail/OwnListDetail.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
