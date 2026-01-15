export default [
  {
    path: '/tesoreria/metodos-recaudos/crear/:idBlock/:idBankEntity',
    name: 'CollectionsMethodsCreate',
    component: () =>
      import(
        '@/views/treasury/collection-methods/v1/create/CollectionsMethodsCreate.vue'
      ),
  },
  {
    path: '/tesoreria/metodos-recaudos/editar/:id',
    name: 'CollectionsMethodsEdit',
    component: () =>
      import(
        '@/views/treasury/collection-methods/v1/edit/CollectionsMethodsEdit.vue'
      ),
  },
]