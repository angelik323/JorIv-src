export default [
  {
    path: '/tesoreria/cargue-masivo',
    name: 'BulkUploadCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/treasury/bulk-upload/v1/create/BulkUploadCreate.vue'),
  },
  {
    path: '/tesoreria/cargue-masivo/ver/:bulkUploadId/registro/:recordId',
    name: 'BulkUploadView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/treasury/bulk-upload/v1/view/BulkUploadView.vue'),
  },
  {
    path: '/tesoreria/cargue-masivo/historial',
    name: 'BulkUploadHistory',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/treasury/bulk-upload/v1/history/BulkUploadHistory.vue'),
  },
]
