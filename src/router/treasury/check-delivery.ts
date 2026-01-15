export default [
  {
    path: '/tesoreria/entrega-de-cheques',
    name: 'CheckDeliveryList',
    component: () =>
      import(
        '@/views/treasury/check-delivery/v1/list/CheckDeliveryList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/entrega-de-cheques/editar/:id',
    name: 'CheckDeliveryEdit',
    component: () =>
      import(
        '@/views/treasury/check-delivery/v1/edit/CheckDeliveryEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/entrega-de-cheques/ver/:id',
    name: 'CheckDeliveryView',
    component: () =>
      import(
        '@/views/treasury/check-delivery/v1/view/CheckDeliveryView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
