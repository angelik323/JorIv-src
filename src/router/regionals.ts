export default [
  {
    path: '/regionales',
    name: 'RegionalList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/regionals/list/RegionalsList.vue'),
  },
  {
    path: '/regionales/crear',
    name: 'RegionalCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/regionals/create/RegionalsCreate.vue'),
  },
  {
    path: '/regionales/editar/:id',
    name: 'RegionalUpdate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/regionals/edit/RegionalsUpdate.vue'),
  },
  {
    path: '/regionales/ver/:id',
    name: 'RegionalView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () => import('@/views/regionals/view/RegionalsView.vue'),
  },
]
