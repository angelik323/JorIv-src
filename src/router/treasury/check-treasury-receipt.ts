export default [
  {
    path: '/tesoreria/consulta-movimiento-tesoreria',
    name: 'CheckTreasuryReceiptList',
    component: () =>
      import(
        '@/views/treasury/check-treasury-receipt/v1/list/CheckTreasuryReceiptList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckTreasuryReceiptList',
        action: 'list',
      },
    },
  },
  {
    path: '/tesoreria/consulta-movimiento-tesoreria/ver/:id',
    name: 'CheckTreasuryReceiptView',
    component: () =>
      import(
        '@/views/treasury/check-treasury-receipt/v1/view/CheckTreasuryReceiptView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckTreasuryReceiptList',
        action: 'show',
      },
    },
  },
  {
    path: '/tesoreria/consulta-movimiento-tesoreria/comprobante/:checkTreasuryReceiptId',
    name: 'AccountingVoucherView',
    component: () =>
      import(
        '@/views/treasury/check-treasury-receipt/v1/accounting-voucher/AccountingVoucherView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CheckTreasuryReceiptList',
        action: 'show',
      },
    },
    props: true,
  },
]
