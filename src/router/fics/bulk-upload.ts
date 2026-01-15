export default [
  {
    path: '/fics/cargues-masivos',
    name: 'FicsBulkUploadList',
    component: () =>
      import('@/views/fics/bulk-upload/v1/list/BulkUploadList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/fics/cargues-masivos/crear/',
    name: 'FicsBulkUploadCreate',
    component: () =>
      import('@/views/fics/bulk-upload/v1/create/BulkUploadCreate.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/fics/cargues-masivos/ver/:id',
    name: 'FicsBulkUploadView',
    component: () =>
      import('@/views/fics/bulk-upload/v1/view/BulkUploadView.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/fics/cargues-masivos/autorizar/:id',
    name: 'FicsBulkUploadAuthorize',
    component: () =>
      import('@/views/fics/bulk-upload/v1/Authorize/BulkUploadAuthorize.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/fics/cargues-masivos/cancelar/:id',
    name: 'FicsBulkUploadCancellation',
    component: () =>
      import(
        '@/views/fics/bulk-upload/v1/Cancellation/BulkUploadCancellation.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/fics/cargues-masivos/anular/:id',
    name: 'FicsBulkUploadAnnular',
    component: () =>
      import('@/views/fics/bulk-upload/v1/Annular/BulkUploadAnnular.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
