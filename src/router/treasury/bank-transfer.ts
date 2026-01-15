export default [
  {
    path: '/tesoreria/traslados-bancarios',
    name: 'BankTransferList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/treasury/bank-transfer/list/BankTransferList.vue'),
  },
  {
    path: '/tesoreria/traslados-bancarios/crear',
    name: 'BankTransferCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/treasury/bank-transfer/create/BankTransferCreate.vue'),
  },
    {
    path: '/tesoreria/traslados-bancarios/editar/:id',
    name: 'BankTransferEdit',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import('@/views/treasury/bank-transfer/edit/BankTransferEdit.vue'),
  },
]
