export default [
  {
    path: '/cuentas-por-pagar/cierre',
    name: 'AccountsPayableClosingList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-closing/v1/list/AccountsPayableClosingList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/cierre/crear',
    name: 'AccountsPayableClosingCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-closing/v1/create/AccountsPayableClosingCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/cierre/ver/:id',
    name: 'AccountsPayableClosingView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-closing/v1/view/AccountsPayableClosingView.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/cierre/resultado',
    name: 'AccountsPayableClosingResult',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/accounts-payable-closing/v1/result/AccountsPayableClosingResult.vue'
      ),
  },
]
