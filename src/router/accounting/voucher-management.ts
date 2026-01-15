export default [
  {
    path: '/contabilidad/gestion-de-comprobantes',
    name: 'VoucherManagementList',
    component: () =>
      import(
        '@/views/accounting/voucher-management/v2/list/VoucherManagementList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'VoucherManagementList',
      },
    },
  },
  {
    path: '/contabilidad/gestion-de-comprobantes/validar',
    name: 'VoucherManagementValidation',
    component: () =>
      import(
        '@/views/accounting/voucher-management/v2/create/VoucherManagementValidation.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'VoucherManagementList',
        action: 'validate',
      },
    },
  },
  {
    path: '/contabilidad/gestion-de-comprobantes/actualizar',
    name: 'VoucherManagementUpdateCreate',
    component: () =>
      import(
        '@/views/accounting/voucher-management/v2/update/VoucherManagementUpdate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'VoucherManagementList',
        action: 'action_update',
      },
    },
  },
  {
    path: '/contabilidad/gestion-de-comprobantes/ver-validacion/:id',
    name: 'VoucherManagementValidationView',
    component: () =>
      import(
        '@/views/accounting/voucher-management/v2/view/VoucherManagementValidationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'VoucherManagementList',
        action: 'show',
      },
    },
  },
  {
    path: '/contabilidad/gestion-de-comprobantes/ver-actualizacion/:id',
    name: 'VoucherManagementUpdateView',
    component: () =>
      import(
        '@/views/accounting/voucher-management/v2/view/VoucherManagementUpdateView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'VoucherManagementList',
        action: 'show',
      },
    },
  },
]
