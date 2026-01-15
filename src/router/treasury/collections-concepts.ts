export default [
  {
    path: '/tesoreria/conceptos-recaudos',
    name: 'CollectionConceptsList',
    component: () =>
      import(
        '@/views/treasury/collections-concepts/v1/list/CollectionsConceptsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CollectionConceptsList',
      },
    },
  },
  {
    path: '/tesoreria/conceptos-recaudos/crear',
    name: 'CollectionConceptsCreate',
    component: () =>
      import(
        '@/views/treasury/collections-concepts/v1/create/CollectionsConceptsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CollectionConceptsList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/conceptos-recaudos/editar/:id',
    name: 'CollectionsConceptsEdit',
    component: () =>
      import(
        '@/views/treasury/collections-concepts/v1/edit/CollectionsConceptsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CollectionConceptsList',
        action: 'edit',
      },
    },
  },
]
