export default [
  {
    path: '/movimientos-y-transacciones',
    name: 'TransactionsList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () => import('@/views/transactions/list/TransactionsList.vue'),
  },
  {
    path: '/movimientos-y-transacciones/crear',
    name: 'TransactionsCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/transactions/create/TransactionsCreate.vue'),
  },
  {
    path: '/movimientos-y-transacciones/ver/:id',
    name: 'TransactionsView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () => import('@/views/transactions/read/TransactionsView.vue'),
  },
  {
    path: '/movimientos-y-transacciones/gestionar/:id',
    name: 'TransactionsManage',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/transactions/manage/TransactionsManage.vue'),
  },

  {
    path: '/movimientos-y-transacciones-erp/ver/:id',
    name: 'TransactionsViewERP',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/transactions/read/TransactionsViewERP.vue'),
  },
]
