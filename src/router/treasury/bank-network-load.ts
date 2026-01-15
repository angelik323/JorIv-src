export default [
  {
    path: '/tesoreria/cargue-red-bancaria',
    name: 'BankNetworkLoadList',
    component: () =>
      import(
        '@/views/treasury/bank-network-load/v1/list/BankNetworkLoadList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/cargue-red-bancaria/crear',
    name: 'BankNetworkLoadCreate',
    component: () =>
      import(
        '@/views/treasury/bank-network-load/v1/create/BankNetworkLoadCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/cargue-red-bancaria/editar/:id',
    name: 'BankNetworkLoadEdit',
    component: () =>
      import(
        '@/views/treasury/bank-network-load/v1/edit/BankNetworkLoadEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/cargue-red-bancaria/ver/:id',
    name: 'BankNetworkLoadView',
    component: () =>
      import(
        '@/views/treasury/bank-network-load/v1/view/BankNetworkLoadView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
