export default [
  {
    path: '/negocios-fiduciarios/permisos/usuario',
    name: 'UserPermissionsList',
    component: () =>
      import(
        '@/views/trust-business/permissions/user-permissions/v1/list/UserPermissionsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'UserPermissionsList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/permisos/usuario/crear/:id',
    name: 'UserPermissionsCreate',
    component: () =>
      import(
        '@/views/trust-business/permissions/user-permissions/v1/create/UserPermissionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'UserPermissionsList',
        action: 'list',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/permisos/negocio',
    name: 'BusinessPermissionsList',
    component: () =>
      import(
        '@/views/trust-business/permissions/business-permissions/v1/list/BusinessPermissionsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BusinessPermissionsList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/permisos/negocio/crear/:id',
    name: 'BusinessPermissionsCreate',
    component: () =>
      import(
        '@/views/trust-business/permissions/business-permissions/v1/create/BusinessPermissionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'BusinessPermissionsList',
        action: 'list',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/permisos/usuario/transferir',
    name: 'UserPermissionsTransferList',
    component: () =>
      import(
        '@/views/trust-business/permissions/user-permissions-transfer/v1/list/UserPermissionsTransferList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'UserPermissionsTransferList',
      },
    },
  },
]
