export default [
  {
    path: '/tesoreria/contactos-bancarias/list/:id',
    name: 'BankContactsList',
    component: () =>
      import('@/views/treasury/bank-contacts/v1/list/BankContactsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/contactos-bancarias/crear/:bank',
    name: 'BankContactsCreate',
    component: () =>
      import('@/views/treasury/bank-contacts/v1/create/BankContactsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/contactos-bancarias/editar/:id',
    name: 'BankContactsEdit',
    component: () =>
      import('@/views/treasury/bank-contacts/v1/edit/BankContactsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/contactos-bancarias/:bank/ver/:id',
    name: 'BankContactsView',
    component: () =>
      import('@/views/treasury/bank-contacts/v1/read/BankContactsView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
