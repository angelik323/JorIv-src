export default [
  {
    path: '/cuentas-por-pagar/solicitudes-de-pago',
    name: 'PaymentRequestsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentRequestsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-requests/v1/list/PaymentRequestsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/solicitudes-de-pago/crear',
    name: 'PaymentRequestsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentRequestsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-requests/v1/create/PaymentRequestsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/solicitudes-de-pago/ver/:id',
    name: 'PaymentRequestsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentRequestsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-requests/v1/view/PaymentRequestsView.vue'
      ),
  },
]
