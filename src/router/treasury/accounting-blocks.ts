export default [
  {
    path: '/tesoreria/bloques-contables',
    name: 'AccountingBlocksList',
    component: () =>
      import(
        '@/views/treasury/accounting-blocks/v1/list/AccountingBlocksList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'AccountingBlocksList',
      },
    },
  },
  {
    path: '/tesoreria/bloques-contables/crear',
    name: 'AccountingBlocksCreate',
    component: () =>
      import(
        '@/views/treasury/accounting-blocks/v1/create/AccountingBlocksCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'AccountingBlocksList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/bloques-contables/editar/:id',
    name: 'AccountingBlocksEdit',
    component: () =>
      import(
        '@/views/treasury/accounting-blocks/v1/edit/AccountingBlocksEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'AccountingBlocksList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tesoreria/bloques-contables/ver/:id',
    name: 'AccountingBlocksView',
    component: () =>
      import(
        '@/views/treasury/accounting-blocks/v1/read/AccountingBlocksView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'AccountingBlocksList',
        action: 'show',
      },
    },
  },
]
