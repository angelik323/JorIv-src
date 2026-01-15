export default [
  {
    path: '/activos-fijos/ubicacion-activos-fijos-bienes',
    name: 'LocationsList',
    component: () =>
      import('@/views/fixed-assets/locations/v1/list/LocationsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'LocationsList',
        action: 'list',
      },
    },
  },
  {
    path: '/activos-fijos/ubicacion-activos-fijos-bienes/crear',
    name: 'LocationsCreate',
    component: () =>
      import('@/views/fixed-assets/locations/v1/create/LocationsCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'LocationsList',
        action: 'create',
      },
    },
  },
  {
    path: '/activos-fijos/ubicacion-activos-fijos-bienes/editar/:id',
    name: 'LocationsEdit',
    component: () =>
      import('@/views/fixed-assets/locations/v1/edit/LocationsEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'LocationsList',
        action: 'edit',
      },
    },
  },
]
