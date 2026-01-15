export default [
  {
    path: '/tesoreria/chequeras',
    name: 'CheckbooksList',
    component: () =>
      import('@/views/treasury/checkbooks/v1/list/CheckbooksList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckbooksList',
      },
    },
  },
  {
    path: '/tesoreria/chequeras/crear',
    name: 'CheckbooksCreate',
    component: () =>
      import('@/views/treasury/checkbooks/v1/create/CheckbooksCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckbooksList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/chequeras/editar/:id',
    name: 'CheckbooksEdit',
    component: () =>
      import('@/views/treasury/checkbooks/v1/edit/CheckbooksEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckbooksList',
        action: 'edit',
      },
    },
  },
]
