export default [
  {
    path: '/retenciones',
    name: 'RetentionList',
    component: () => import('@/views/retentions/list/RetentionsList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/retenciones/edit/:id',
    name: 'RetentionsEdit',
    component: () => import('@/views/retentions/edit/RetentionsEdit.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/retenciones/crear',
    name: 'RetentionsCreate',
    component: () => import('@/views/retentions/create/RetentionsCreate.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
