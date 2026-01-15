export default [
  {
    path: '/negocios-fiduciarios/polizas',
    name: 'PolicyList',
    component: () =>
      import('@/views/trust-business/policy-trust/v1/list/PolicyList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PolicyList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/polizas/crear',
    name: 'PolicyCreate',
    component: () =>
      import('@/views/trust-business/policy-trust/v1/create/PolicyCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PolicyList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/polizas/editar/:id',
    name: 'PolicyEdit',
    component: () =>
      import('@/views/trust-business/policy-trust/v1/edit/PolicyEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PolicyList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/polizas/ver/:id',
    name: 'PolicyView',
    component: () =>
      import('@/views/trust-business/policy-trust/v1/view/PolicyView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PolicyList',
        action: 'show',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/polizas/autorizar/:id',
    name: 'PolicyAuthorize',
    component: () =>
      import(
        '@/views/trust-business/policy-trust/v1/authorize/PolicyAuthorize.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'PolicyList',
        action: 'action_authorize',
      },
    },
  },
]
