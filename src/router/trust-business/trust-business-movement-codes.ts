export default [
  {
    path: '/negocios-fiduciarios/codigos-movimiento',
    name: 'TrustBusinessMovementCodesList',
    component: () =>
      import(
        '@/views/trust-business/trust-business-movement-code/v1/list/TrustBusinessMovementCodeList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessMovementCodesList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/codigos-movimiento/crear',
    name: 'TrustBusinessMovementCodesCreate',
    component: () =>
      import(
        '@/views/trust-business/trust-business-movement-code/v1/create/TrustBusinessMovementCodeCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessMovementCodesList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/codigos-movimiento/editar/:id',
    name: 'TrustBusinessMovementCodesEdit',
    component: () =>
      import(
        '@/views/trust-business/trust-business-movement-code/v1/edit/TrustBusinessMovementCodeEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessMovementCodesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/codigos-movimiento/ver/:id',
    name: 'TrustBusinessMovementCodesView',
    component: () =>
      import(
        '@/views/trust-business/trust-business-movement-code/v1/view/TrustBusinessMovementCodeView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'TrustBusinessMovementCodesList',
        action: 'show',
      },
    },
  },
]
