export default [
  {
    path: '/tesoreria/causales-devolucion-bancaria',
    name: 'GroundsForBankRefund',
    component: () =>
      import(
        '@/views/treasury/grounds-for-bank-refund/v1/list/GroundsForBankRefund.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'GroundsForBankRefund',
      },
    },
  },
  {
    path: '/tesoreria/causales-devolucion-bancaria/crear',
    name: 'GroundsForBankRefundCreate',
    component: () =>
      import(
        '@/views/treasury/grounds-for-bank-refund/v1/create/GroundsForBankRefundCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'GroundsForBankRefund',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/causales-devolucion-bancaria/editar/:id',
    name: 'GroundsForBankRefundUpdate',
    component: () =>
      import(
        '@/views/treasury/grounds-for-bank-refund/v1/edit/GroundsForBankRefundEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'GroundsForBankRefund',
        action: 'edit',
      },
    },
  },
]
