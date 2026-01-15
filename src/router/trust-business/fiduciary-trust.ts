export default [
  {
    path: '/negocios-fiduciarios/encargos-fiduciarios',
    name: 'FiduciaryTrustList',
    component: () =>
      import(
        '@/views/trust-business/fiduciary-trust/v1/list/FiduciaryTrustList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'FiduciaryTrustList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/encargos-fiduciarios/crear',
    name: 'FiduciaryTrustCreate',
    component: () =>
      import(
        '@/views/trust-business/fiduciary-trust/v1/create/FiduciaryTrustCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'FiduciaryTrustList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/encargos-fiduciarios/editar/:id',
    name: 'FiduciaryTrustEdit',
    component: () =>
      import(
        '@/views/trust-business/fiduciary-trust/v1/edit/FiduciaryTrustEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'FiduciaryTrustList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/encargos-fiduciarios/ver/:id',
    name: 'FiduciaryTrustView',
    component: () =>
      import(
        '@/views/trust-business/fiduciary-trust/v1/read/FiduciaryTrustRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'FiduciaryTrustList',
        action: 'show',
      },
    },
  },
]
