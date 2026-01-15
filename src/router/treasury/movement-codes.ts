export default [
  {
    path: '/tesoreria/codigos-movimiento-tesoreria',
    name: 'TreasuryMovementCodesList',
    component: () =>
      import(
        '@/views/treasury/movement-codes/v1/list/TreasuryMovementCodesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TreasuryMovementCodesList',
      },
    },
  },
  {
    path: '/tesoreria/codigos-movimiento-tesoreria/crear',
    name: 'TreasuryMovementCodesCreate',
    component: () =>
      import(
        '@/views/treasury/movement-codes/v1/create/TreasuryMovementCodesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TreasuryMovementCodesList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/codigos-movimiento-tesoreria/editar/:id',
    name: 'TreasuryMovementCodesEdit',
    component: () =>
      import(
        '@/views/treasury/movement-codes/v1/edit/TreasuryMovementCodesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TreasuryMovementCodesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/tesoreria/codigos-movimiento-tesoreria/ver/:id',
    name: 'TreasuryMovementCodesView',
    component: () =>
      import(
        '@/views/treasury/movement-codes/v1/view/TreasuryMovementCodesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'TreasuryMovementCodesList',
        action: 'show',
      },
    },
  },
]
