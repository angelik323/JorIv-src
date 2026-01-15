export default [
  {
    path: '/cuentas-por-pagar/bloques-de-pago',
    name: 'PaymentBlocksList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentBlocksList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-blocks/v1/list/PaymentBlocksList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/bloques-de-pago/crear',
    name: 'PaymentBlocksCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentBlocksList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-blocks/v1/create/PaymentBlocksCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/bloques-de-pago/editar/:id',
    name: 'PaymentBlocksEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentBlocksList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-blocks/v1/edit/PaymentBlocksEdit.vue'
      ),
  },
]
