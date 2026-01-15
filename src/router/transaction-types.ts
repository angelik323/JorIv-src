export default [
  {
    path: '/tipos-de-transacciones',
    name: 'TransactionTypesList',
    component: () =>
      import('@/views/transactions-types/list/TransactionTypesList.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tipos-de-transacciones/crear',
    name: 'CreateTransactionTypes',
    component: () =>
      import('@/views/transactions-types/create/CreateTransactionTypes.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tipos-de-transacciones/editar/:id',
    name: 'EditTransactionTypes',
    component: () =>
      import('@/views/transactions-types/edit/EditTransactionTypes.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
