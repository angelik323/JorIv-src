export default [
  {
    path: '/activos-fijos/registro-autorizacion-novedades',
    name: 'RegisterAuthorizationChangesList',
    component: () =>
      import(
        '@/views/fixed-assets/register-authorization-changes/v1/list/RegisterAuthorizationChangesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterAuthorizationChangesList',
        action: 'list',
      },
    },
  },

  {
    path: '/activos-fijos/registro-autorizacion-novedades/crear',
    name: 'RegisterAuthorizationChangesCreate',
    component: () =>
      import(
        '@/views/fixed-assets/register-authorization-changes/v1/create/RegisterAuthorizationChangesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterAuthorizationChangesList',
        action: 'create',
      },
    },
  },
  {
    path: '/activos-fijos/registro-autorizacion-novedades/editar/:id',
    name: 'RegisterAuthorizationChangesEdit',
    component: () =>
      import(
        '@/views/fixed-assets/register-authorization-changes/v1/edit/RegisterAuthorizationChangesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterAuthorizationChangesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/activos-fijos/registro-autorizacion-novedades/ver/:id',
    name: 'RegisterAuthorizationChangesView',
    component: () =>
      import(
        '@/views/fixed-assets/register-authorization-changes/v1/view/RegisterAuthorizationChangesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'RegisterAuthorizationChangesList',
        action: 'show',
      },
    },
  },
]
