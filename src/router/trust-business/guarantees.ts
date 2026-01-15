export default [
  {
    path: '/negocios-fiduciarios/garantias',
    name: 'GuaranteesList',
    component: () =>
      import('@/views/trust-business/guarantees/v1/list/GuaranteesList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GuaranteesList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/garantias/crear',
    name: 'GuaranteesCreate',
    component: () =>
      import(
        '@/views/trust-business/guarantees/v1/create/GuaranteesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GuaranteesList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/garantias/editar/:id',
    name: 'GuaranteesEdit',
    component: () =>
      import('@/views/trust-business/guarantees/v1/edit/GuaranteesEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GuaranteesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/garantias/ver/:id',
    name: 'GuaranteesRead',
    component: () =>
      import('@/views/trust-business/guarantees/v1/read/GuaranteesRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GuaranteesList',
        action: 'show',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/garantias/autorizar/:id',
    name: 'GuaranteesAuthorize',
    component: () =>
      import(
        '@/views/trust-business/guarantees/v1/authorize/GuaranteesAuthorize.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'GuaranteesList',
        action: 'action_authorize',
      },
    },
  },
]
