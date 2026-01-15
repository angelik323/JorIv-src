export default [
  {
    path: '/activos-fijos/configuracion-tipo-novedades',
    name: 'ConfigurationActiveNoveltyTypesList',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationActiveNoveltyTypesList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/configuration-active-novelty-types/v1/list/ConfigurationActiveNoveltyTypesList.vue'
      ),
  },
  {
    path: '/activos-fijos/configuracion-tipo-novedades/crear',
    name: 'ConfigurationActiveNoveltyTypesCreate',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationActiveNoveltyTypesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/configuration-active-novelty-types/v1/create/ConfigurationActiveNoveltyTypesCreate.vue'
      ),
  },
  {
    path: '/activos-fijos/configuracion-tipo-novedades/editar/:id',
    name: 'ConfigurationActiveNoveltyTypesEdit',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationActiveNoveltyTypesList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/configuration-active-novelty-types/v1/edit/ConfigurationActiveNoveltyTypesEdit.vue'
      ),
  },
  {
    path: '/activos-fijos/configuracion-tipo-novedades/ver/:id',
    name: 'ConfigurationActiveNoveltyTypesRead',
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationActiveNoveltyTypesList',
        action: 'view',
      },
    },
    component: () =>
      import(
        '@/views/fixed-assets/configuration-active-novelty-types/v1/read/ConfigurationActiveNoveltyTypesRead.vue'
      ),
  },
]
