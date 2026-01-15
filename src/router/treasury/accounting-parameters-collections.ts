export default [
  {
    path: '/tesoreria/parametros-contables-recaudos/crear/:id',
    name: 'AccountingParametersCollectionsCreate',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters-collections/v1/create/AccountingParametersCollectionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/parametros-contables-recaudos/editar/:id',
    name: 'AccountingParametersCollectionsEdit',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters-collections/v1/edit/AccountingParametersCollectionsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/parametros-contables-recaudos/ver/:id',
    name: 'AccountingParametersCollectionsView',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters-collections/v1/read/AccountingParametersCollectionsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
