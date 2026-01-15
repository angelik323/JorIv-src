export default [
  {
    path: '/tesoreria/referencias-recaudos/crear/:idBlock/:idParam',
    name: 'CollectionsReferenceCreate',
    component: () =>
      import(
        '@/views/treasury/collections-reference/v1/create/CollectionsReferenceCreate.vue'
      ),
  },
  {
    path: '/tesoreria/referencias-recaudos/editar/:id',
    name: 'CollectionsReferenceEdit',
    component: () =>
      import(
        '@/views/treasury/collections-reference/v1/edit/CollectionsReferenceEdit.vue'
      ),
  },
]