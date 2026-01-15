export default [
  {
    path: '/cuentas-por-pagar/impuestos-territoriales',
    name: 'TerritorialTaxesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'TerritorialTaxesList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/territorial-taxes/v1/list/TerritorialTaxesList.vue'
      ),
  },

  {
    path: '/cuentas-por-pagar/impuestos-territoriales/crear',
    name: 'TerritorialTaxesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'TerritorialTaxesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/territorial-taxes/v1/create/TerritorialTaxesCreate.vue'
      ),
  },

  {
    path: '/cuentas-por-pagar/impuestos-territoriales/editar/:id',
    name: 'TerritorialTaxesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'TerritorialTaxesList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/territorial-taxes/v1/edit/TerritorialTaxesEdit.vue'
      ),
  },
]
