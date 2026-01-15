export default [
  {
    path: '/activos-fijos/registro-visitas',
    name: 'VisitRecordsList',
    component: () =>
      import('@/views/fixed-assets/visit-records/v1/list/VisitRecordsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'VisitRecordsList',
        action: 'list',
      },
    },
  },
  {
    path: '/activos-fijos/registro-visitas/crear',
    name: 'VisitRecordsCreate',
    component: () =>
      import(
        '@/views/fixed-assets/visit-records/v1/create/VisitRecordsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'VisitRecordsList',
        action: 'create',
      },
    },
  },
  {
    path: '/activos-fijos/registro-visitas/editar/:id',
    name: 'VisitRecordsEdit',
    component: () =>
      import('@/views/fixed-assets/visit-records/v1/edit/VisitRecordsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'VisitRecordsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/activos-fijos/registro-visitas/ver/:id',
    name: 'VisitRecordsRead',
    component: () =>
      import('@/views/fixed-assets/visit-records/v1/read/VisitRecordsRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'VisitRecordsList',
        action: 'show',
      },
    },
  },
]
