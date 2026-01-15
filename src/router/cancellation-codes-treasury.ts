export default [
  {
    path: '/tesoreria/codigos-anulacion-tesoreria',
    name: 'CancellationCodesList',
    component: () =>
      import(
        '@/views/treasury/cancellation-codes/v1/list/CancellationCodesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CancellationCodesList',
      },
    },
  },
  {
    path: '/tesoreria/codigos-anulacion-tesoreria/crear',
    name: 'CancellationCodesCreate',
    component: () =>
      import(
        '@/views/treasury/cancellation-codes/v1/create/CancellationCodesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CancellationCodesList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/codigos-anulacion-tesoreria/editar/:id',
    name: 'CancellationCodesEdit',
    component: () =>
      import(
        '@/views/treasury/cancellation-codes/v1/edit/CancellationCodesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CancellationCodesList',
        action: 'edit',
      },
    },
  },
]
