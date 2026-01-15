export default [
  {
    path: '/tesoreria/sucursales-bancarias/list/:id',
    name: 'BankBranchesList',
    component: () =>
      import('@/views/treasury/bank-branches/v1/list/BankBranchesList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/sucursales-bancarias/crear',
    name: 'BankBranchesCreate',
    component: () =>
      import('@/views/treasury/bank-branches/v1/create/BankBranchesCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/sucursales-bancarias/editar/:id',
    name: 'BankBranchesEdit',
    component: () =>
      import('@/views/treasury/bank-branches/v1/edit/BankBranchesEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
