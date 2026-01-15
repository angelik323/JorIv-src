export default [
  {
    path: '/activos-fijos/configuracion-tipos-activos-fijos-bienes',
    name: 'ConfigurationTypesSubtypesList',
    component: () =>
      import(
        '@/views/fixed-assets/configuration-types-subtypes/v1/list/ConfigurationTypesSubtypesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationTypesSubtypesList',
      },
    }
  },
  {
    path: '/activos-fijos/configuracion-tipos-activos-fijos-bienes/crear',
    name: 'ConfigurationTypesSubtypesCreate',
    component: () =>
      import(
        '@/views/fixed-assets/configuration-types-subtypes/v1/create/ConfigurationTypesSubtypesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationTypesSubtypesList',
        action: 'create',
      },
    }
  },
  {
    path: '/activos-fijos/configuracion-tipos-activos-fijos-bienes/editar/:id',
    name: 'ConfigurationTypesSubtypesEdit',
    component: () =>
      import(
        '@/views/fixed-assets/configuration-types-subtypes/v1/edit/ConfigurationTypesSubtypesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationTypesSubtypesList',
        action: 'edit',
      },
    }
  },
  {
    path: '/activos-fijos/configuracion-tipos-activos-fijos-bienes/ver/:id',
    name: 'ConfigurationTypesSubtypesRead',
    component: () =>
      import(
        '@/views/fixed-assets/configuration-types-subtypes/v1/read/ConfigurationTypesSubtypesRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConfigurationTypesSubtypesList',
        action: 'show',
      },
    }
  }
]
