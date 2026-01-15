export default [
  {
    path: '/cuentas-por-pagar/conceptos-de-liquidacion',
    name: 'SettlementConceptsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementConceptsList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-concepts/v1/list/SettlementConceptsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/conceptos-de-liquidacion/crear',
    name: 'SettlementConceptsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementConceptsList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-concepts/v1/create/SettlementConceptsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/conceptos-de-liquidacion/editar/:id',
    name: 'SettlementConceptsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementConceptsList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-concepts/v1/edit/SettlementConceptsEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/conceptos-de-liquidacion/ver/:id',
    name: 'SettlementConceptsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementConceptsList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-concepts/v1/view/SettlementConceptsView.vue'
      ),
  },
]
