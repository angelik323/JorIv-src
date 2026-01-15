export default [
  {
    path: '/cuentas-por-pagar/liquidacion-tributaria',
    name: 'TaxSettlementList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/tax-settlement/v1/list/TaxSettlementList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/liquidacion-tributaria/ver/:id',
    name: 'TaxSettlementView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/tax-settlement/v1/view/TaxSettlementView.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/liquidacion-tributaria/editar/:id',
    name: 'TaxSettlementEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/tax-settlement/v1/edit/TaxSettlementEdit.vue'
      ),
  },
]
