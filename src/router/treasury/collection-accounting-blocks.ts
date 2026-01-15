export default [
  {
    path: '/tesoreria/bloques-contables-recaudo',
    name: 'CollectionAccountingBlocksList',
    component: () =>
      import(
        '@/views/treasury/collection-accounting-blocks/v1/list/CollectionAccountingBlocksList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CollectionAccountingBlocksList',
      },
    },
  },
  {
    path: '/tesoreria/bloques-contables-recaudo/crear',
    name: 'CollectionAccountingBlocksCreate',
    component: () =>
      import(
        '@/views/treasury/collection-accounting-blocks/v1/create/CollectionAccountingBlocksCreate.vue'
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
    path: '/tesoreria/bloques-contables-recaudo/editar/:id',
    name: 'CollectionAccountingBlocksEdit',
    component: () =>
      import(
        '@/views/treasury/collection-accounting-blocks/v1/edit/CollectionAccountingBlocksEdit.vue'
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
