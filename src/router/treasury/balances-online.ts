export default [
  {
    path: '/tesoreria/saldos-de-cuentas-bancarias-en-linea',
    name: 'BalancesOnlineList',
    component: () =>
      import('@/views/treasury/balances-online/v1/list/BalancesOnlineList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
