export default [
  {
    path: '/cuentas-por-pagar/montos-anuales-de-pago',
    name: 'AnnualPaymentAmountsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/annual-payment-amounts/v1/list/AnnualPaymentAmountsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/montos-anuales-de-pago/crear',
    name: 'AnnualPaymentAmountsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/annual-payment-amounts/v1/create/AnnualPaymentAmountsCreate.vue'
      ),
  },

  {
    path: '/cuentas-por-pagar/montos-anuales-de-pago/editar/:id',
    name: 'AnnualPaymentAmountsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/annual-payment-amounts/v1/edit/AnnualPaymentAmountsEdit.vue'
      ),
  },
]
