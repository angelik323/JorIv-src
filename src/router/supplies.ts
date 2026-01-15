export default [
  {
    path: '/insumos',
    name: 'SuppliesList',
    component: () => import('@/views/supplies/v1/list/SuppliesList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/insumos/crear',
    name: 'SuppliesCreate',
    component: () => import('@/views/supplies/v1/create/SuppliesCreate.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/insumos/editar/:id',
    name: 'SuppliesEdit',
    component: () => import('@/views/supplies/v1/edit/SuppliesEdit.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/insumos/ver/:id',
    name: 'SuppliesRead',
    component: () => import('@/views/supplies/v1/read/SuppliesRead.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
