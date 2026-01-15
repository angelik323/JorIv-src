export default [
  {
    path: '/tesoreria/entidades-bancarias',
    name: 'BankingEntitiesList',
    component: () =>
      import(
        '@/views/treasury/banking-entities/v1/list/BankingEntitiesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingEntitiesList',
      },
    },
  },
  {
    path: '/tesoreria/entidades-bancarias/crear',
    name: 'BankingEntitiesCreate',
    component: () =>
      import(
        '@/views/treasury/banking-entities/v1/create/BankingEntitiesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingEntitiesList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/entidades-bancarias/editar/:id',
    name: 'BankingEntitiesEdit',
    component: () =>
      import(
        '@/views/treasury/banking-entities/v1/edit/BankingEntitiesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingEntitiesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tesoreria/entidades-bancarias/ver/:id',
    name: 'BankingEntitiesView',
    component: () =>
      import(
        '@/views/treasury/banking-entities/v1/read/BankingEntitiesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankingEntitiesList',
        action: 'show',
      },
    },
  },
]
