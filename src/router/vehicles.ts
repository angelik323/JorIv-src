export default [
  {
    path: '/vehiculos',
    name: 'VehiclesList',
    component: () => import('@/views/vehicles/list/VehiclesList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/vehiculos/crear',
    name: 'VehiclesCreate',
    component: () => import('@/views/vehicles/create/VehiclesCreate.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/vehiculos/editar/:id',
    name: 'VehiclesEdit',
    component: () => import('@/views/vehicles/edit/VehiclesEdit.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/vehiculos/ver/:id',
    name: 'VehiclesRead',
    component: () => import('@/views/vehicles/read/VehiclesRead.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
