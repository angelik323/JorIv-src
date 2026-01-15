export default [
  {
    path: '/apertura-periodo-contable',
    name: 'OpeningRecordList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import('@/views/accounting/opening-record/v2/list/OpeningRecordList.vue'),
  },
  {
    path: '/apertura-periodo-contable/crear',
    name: 'OpeningRecordCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounting/opening-record/v2/create/OpeningRecordCreate.vue'
      ),
  },
]
