export default [
  {
    path: '/cuentas-por-pagar/autorizadores-pago',
    name: 'PaymentAuthorizersList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentAuthorizersList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-authorizers/v1/list/PaymentAuthorizersList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/autorizadores-pago/crear',
    name: 'PaymentAuthorizersCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentAuthorizersList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-authorizers/v1/create/PaymentAuthorizersCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/autorizadores-pago/editar/:id',
    name: 'PaymentAuthorizersEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentAuthorizersList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-authorizers/v1/edit/PaymentAuthorizersEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/autorizadores-pago/importar',
    name: 'PaymentAuthorizersImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentAuthorizersList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-authorizers/v1/import/PaymentAuthorizersImport.vue'
      ),
  },
]
