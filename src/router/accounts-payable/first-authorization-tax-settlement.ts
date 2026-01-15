export default [
  {
    path: '/cuentas-por-pagar/primera-autorizacion',
    name: 'FirstAuthorizationTaxSettlementList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'FirstAuthorizationTaxSettlementList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/first-authorization-tax-settlement/v1/list/FirstAuthorizationTaxSettlementList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/primera-autorizacion/ver/:id',
    name: 'FirstAuthorizationTaxSettlementView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'FirstAuthorizationTaxSettlementList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/first-authorization-tax-settlement/v1/view/FirstAuthorizationTaxSettlementView.vue'
      ),
  },
]