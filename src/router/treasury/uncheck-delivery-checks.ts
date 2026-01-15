export default [
  {
    path: '/tesoreria/desmarcar-cheques-entregados',
    name: 'UncheckDeliveryChecksList',
    component: () =>
      import(
        '@/views/treasury/uncheck-delivery-checks/v1/list/UncheckDeliveryChecksList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
