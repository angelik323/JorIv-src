export default [
  {
    path: '/cuentas-por-pagar/instrucciones-de-pago',
    name: 'PaymentInstructionsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentInstructionsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-instructions/v1/list/PaymentInstructionsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/instrucciones-de-pago/crear',
    name: 'PaymentInstructionsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentInstructionsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-instructions/v1/create/PaymentInstructionsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/instrucciones-de-pago/editar/:id',
    name: 'PaymentInstructionsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentInstructionsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-instructions/v1/edit/PaymentInstructionsEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/instrucciones-de-pago/ver/:id',
    name: 'PaymentInstructionsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentInstructionsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-instructions/v1/view/PaymentInstructionsView.vue'
      ),
  },
]
