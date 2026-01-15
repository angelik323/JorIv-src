export default [
  {
    path: '/negocios-fiduciarios/prorroga-fideicomiso',
    name: 'ExtendTrustList',
    component: () =>
      import('@/views/trust-business/extend-trust/v1/list/ExtendTrustList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'ExtendTrustList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/prorroga-fideicomiso/crear',
    name: 'ExtendTrustCreate',
    component: () =>
      import(
        '@/views/trust-business/extend-trust/v1/create/ExtendTrustCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'ExtendTrustList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/prorroga-fideicomiso/editar/:id',
    name: 'ExtendTrustEdit',
    component: () =>
      import('@/views/trust-business/extend-trust/v1/edit/ExtendTrustEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'ExtendTrustList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/prorroga-fideicomiso/ver/:id',
    name: 'ExtendTrustView',
    component: () =>
      import('@/views/trust-business/extend-trust/v1/view/ExtendTrustView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'ExtendTrustList',
        action: 'show',
      },
    },
  },
]
