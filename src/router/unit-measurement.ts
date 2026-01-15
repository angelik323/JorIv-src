export default [
  {
    path: '/unidad-de-medida',
    name: 'UnitMeasurementList',
    component: () =>
      import('@/views/unit-measurement/list/UnitMeasurementList.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/unidad-de-medida/edit/:id',
    name: 'UnitMeasurementEdit',
    component: () =>
      import('@/views/unit-measurement/edit/UnitMeasurementEdit.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/unidad-de-medida/crear',
    name: 'UnitMeasurementCreate',
    component: () =>
      import('@/views/unit-measurement/create/UnitMeasurementCreate.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
