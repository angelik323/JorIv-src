export default [
  {
    path: '/apertura-periodo/listado',
    name: 'OpeningRecordList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'OpeningRecordList',
      },
    },
    component: () =>
      import('@/views/opening-record/list/OpeningRecordList.vue'),
  },
  {
    path: '/apertura-periodo/crear',
    name: 'OpeningRecordCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'OpeningRecordList',
        action: 'process',
      },
    },
    component: () =>
      import('@/views/opening-record/create/OpeningRecordCreate.vue'),
  },
]
