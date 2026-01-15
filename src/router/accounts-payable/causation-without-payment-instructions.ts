export default [
  {
    path: '/cuentas-por-pagar/causacion-sin-instrucciones-pago',
    name: 'CausationWithoutPaymentInstructionsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'CausationWithoutPaymentInstructionsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/causation-without-payment-instructions/v1/list/CausationWithoutPaymentInstructionsList.vue'
      ),
  },
]
