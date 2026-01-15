export default [
  {
    path: '/tesoreria/consulta-movimientos-de-tesoreria-anulados',
    name: 'TreasuryMovementsCancelledList',
    component: () =>
      import(
        '@/views/treasury/treasury-movements-cancelled/list/TreasuryMovementsCancelledList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/consulta-movimientos-de-tesoreria-anulados/ver/:id',
    name: 'TreasuryMovementsCancelledView',
    component: () =>
      import(
        '@/views/treasury/treasury-movements-cancelled/view/TreasuryMovementsCancelledView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
