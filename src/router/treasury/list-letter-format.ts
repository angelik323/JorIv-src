export default [
  {
    path: '/tesoreria/formato-carta-listado',
    name: 'ListLetterFormatList',
    component: () =>
      import(
        '@/views/treasury/list-letter-format/v1/list/ListLetterFormatList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/formato-carta-listado/crear',
    name: 'ListLetterFormatCreate',
    component: () =>
      import(
        '@/views/treasury/list-letter-format/v1/create/ListLetterFormatCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/formato-carta-listado/editar/:id',
    name: 'ListLetterFormatEdit',
    component: () =>
      import(
        '@/views/treasury/list-letter-format/v1/edit/ListLetterFormatEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/formato-carta-listado/ver/:id',
    name: 'ListLetterFormatView',
    component: () =>
      import(
        '@/views/treasury/list-letter-format/v1/view/ListLetterFormatView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
