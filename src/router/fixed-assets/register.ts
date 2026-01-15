export default [
  {
    path: '/activos-fijos/registro',
    name: 'RegisterList',
    component: () =>
      import('@/views/fixed-assets/register/v1/list/RegisterList.vue'),
    // meta: {
    //   requiresAuth: true,
    //   requiresFirstPasswordChanged: true,
    //   requiredValidRole: {
    //     module: 'FixedAssets',
    //     view: 'RegisterList',
    //     action: 'list',
    //   },
    // },
  },
  {
    path: '/activos-fijos/registro/crear',
    name: 'RegisterCreate',
    component: () =>
      import('@/views/fixed-assets/register/v1/create/RegisterCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterList',
        action: 'create',
      },
    },
  },
  {
    path: '/activos-fijos/registro/editar/:id',
    name: 'RegisterEdit',
    component: () =>
      import('@/views/fixed-assets/register/v1/edit/RegisterEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterList',
        action: 'edit',
      },
    },
  },
  {
    path: '/activos-fijos/registro/ver/:id',
    name: 'RegisterRead',
    component: () =>
      import('@/views/fixed-assets/register/v1/read/RegisterRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterList',
        action: 'show',
      },
    },
  },
  {
    path: '/activos-fijos/registro/importar',
    name: 'RegisterImport',
    component: () =>
      import('@/views/fixed-assets/register/v1/import/RegisterImport.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterList',
        action: 'create',
      },
    },
  },
]
