export default [
  {
    path: '/tesoreria/anulaciones-de-tesoreria',
    name: 'TreasuryCancellationsList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/treasury/treasury-cancellations/v1/list/TreasuryCancellationsList.vue'
      ),
  },
  {
    path: '/tesoreria/anulaciones-de-tesoreria/crear',
    name: 'TreasuryCancellationsCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/treasury/treasury-cancellations/v1/create/TreasuryCancellationsCreate.vue'
      ),
  },
  {
    path: '/tesoreria/anulaciones-de-tesoreria/ver/:id',
    name: 'TreasuryCancellationsView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/treasury/treasury-cancellations/v1/view/TreasuryCancellationView.vue'
      ),
  },
]
