export default [
  {
    path: '/cuentas-por-pagar/segunda-autorizacion',
    name: 'SecondAuthorizationList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SecondAuthorizationList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/second-authorization/v1/list/SecondAuthorizationList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/segunda-autorizacion/ver/:id',
    name: 'SecondAuthorizationView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SecondAuthorizationList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/second-authorization/v1/view/SecondAuthorizationView.vue'
      ),
  },
]
