export default [
  {
    path: '/tesoreria/consecutivos-movimientos',
    name: 'ConsecutiveVouchersList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'ConsecutiveVouchersList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/treasury/consecutive-vouchers/list/ConsecutiveVouchersList.vue'
      ),
  },
  {
    path: '/tesoreria/consecutivos-movimientos/ver/:id',
    name: 'ConsecutiveVouchersView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'ConsecutiveVouchersList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/treasury/consecutive-vouchers/view/ConsecutiveVouchersView.vue'
      ),
  },
]
