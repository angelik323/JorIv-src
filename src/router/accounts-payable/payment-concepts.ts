export default [
  {
    path: '/cuentas-por-pagar/conceptos-pago',
    name: 'PaymentConceptsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentConceptsList',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-concepts/v1/list/PaymentConceptsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/conceptos-pago/crear',
    name: 'PaymentConceptsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentConceptsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-concepts/v1/create/PaymentConceptsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/conceptos-pago/importar',
    name: 'PaymentConceptsImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentConceptsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-concepts/v1/import/PaymentConceptsImport.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/conceptos-pago/editar/:id',
    name: 'PaymentConceptsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'PaymentConceptsList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/payment-concepts/v1/edit/PaymentConceptsEdit.vue'
      ),
  },
]
