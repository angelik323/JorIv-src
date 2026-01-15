export default [
  {
    path: '/tesoreria/parametros-entidades-bancarias/crear/:id',
    name: 'BankingEntityParametersCreate',
    component: () =>
      import(
        '@/views/treasury/banking-entities-parameters/v1/create/BankingEntityParametersCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CollectionAccountingBlocksList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/parametros-entidades-bancarias/edit/:id',
    name: 'BankingEntityParametersEdit',
    component: () =>
      import(
        '@/views/treasury/banking-entities-parameters/v1/edit/BankingEntityParametersEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CollectionAccountingBlocksList',
        action: 'edit',
      },
    },
  },
]