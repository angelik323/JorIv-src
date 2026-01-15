export default [
  {
    path: '/fics/oficinas-de-operacion',
    name: 'OperatingOfficesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: { module: 'Fics', view: 'OperatingOfficesList' },
    },
    component: () =>
      import('@/views/fics/operating-offices/v1/list/OperatingOfficesList.vue'),
  },
  {
    path: '/fics/oficinas-de-operacion/editar/:id',
    name: 'OperatingOfficesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'OperatingOfficesList',
        action: 'edit',
      },
    },
    component: () =>
      import('@/views/fics/operating-offices/v1/edit/OperatingOfficesEdit.vue'),
  },
  {
    path: '/fics/oficinas-de-operacion/:id/ver',
    name: 'OperatingOfficesView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'OperatingOfficesList',
        action: 'view',
      },
    },
    component: () =>
      import('@/views/fics/operating-offices/v1/view/OperatingOfficesView.vue'),
  },
  {
    path: '/fics/oficinas-de-operacion/crear',
    name: 'OperatingOfficesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'OperatingOfficesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fics/operating-offices/v1/create/OperatingOfficesCreate.vue'
      ),
  },
]
