export default [
  {
    path: '/cuentas-por-pagar/estado-de-pagos',
    name: 'PaymentStatusList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentStatusList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-status/v1/list/PaymentStatusList.vue'
      ),
  },
]
