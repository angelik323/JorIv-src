export default [
  {
    path: '/cuentas-por-pagar/cumplir-anular-orpa-sin-tesoreria',
    name: 'OrpaFulfillmentCancelationNonTreasuryList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'OrpaFulfillmentCancelationNonTreasuryList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/orpa-fulfillment-cancellation-non-treasury/v1/list/OrpaFulfillmentCancelationNonTreasuryList.vue'
      ),
  },
]
