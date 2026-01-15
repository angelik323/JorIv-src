export default [
  {
    path: '/tesoreria/tipos-recaudo',
    name: 'TypesCollectionList',
    component: () =>
      import(
        '@/views/treasury/types-collection/v1/list/TypesCollectionList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TypesCollectionList',
      },
    },
  },
  {
    path: '/tesoreria/tipos-recaudo/crear',
    name: 'TypesCollectionCreate',
    component: () =>
      import(
        '@/views/treasury/types-collection/v1/create/TypesCollectionCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TypesCollectionList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/tipos-de-recaudo/editar/:id',
    name: 'TypesCollectionEdit',
    component: () =>
      import(
        '@/views/treasury/types-collection/v1/edit/TypesCollectionEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TypesCollectionList',
        action: 'edit',
      },
    },
  },
]
