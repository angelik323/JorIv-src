export default [
  {
    path: '/negocios-fiduciarios/negocios',
    name: 'TrustBusinessesList',
    component: () =>
      import(
        '@/views/trust-business/trust-businesses/v2/list/TrustBusinessManagementList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessesList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/negocios/crear',
    name: 'TrustBusinessesCreate',
    component: () =>
      import(
        '@/views/trust-business/trust-businesses/v2/create/TrustBusinessManagementCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessesList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/negocios/editar/:id',
    name: 'TrustBusinessesEdit',
    component: () =>
      import(
        '@/views/trust-business/trust-businesses/v2/edit/TrustBusinessManagementEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/negocios/ver/:id',
    name: 'TrustBusinessesRead',
    component: () =>
      import(
        '@/views/trust-business/trust-businesses/v2/read/TrustBusinessManagementRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessesList',
        action: 'show',
      },
    },
  },
]
