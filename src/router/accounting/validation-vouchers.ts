export default [
  {
    path: '/contabilidad/validacion-de-comprobantes',
    name: 'ValidationVoucherList',
    component: () =>
      import('@/views/validation-vouchers/v1/list/ValidationVouchersList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ValidationVoucherList',
      },
    },
  },
  {
    path: '/contabilidad/validacion-de-comprobantes/crear',
    name: 'ValidationVoucherCreate',
    component: () =>
      import(
        '@/views/validation-vouchers/v1/create/ValidationVouchersCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ValidationVoucherList',
        action: 'create',
      },
    },
  },
  {
    path: '/contabilidad/validacion-de-comprobantes/editar',
    name: 'ValidationVouchersEdit',
    component: () =>
      import('@/views/validation-vouchers/v1/edit/ValidationVouchersEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ValidationVoucherList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contabilidad/validacion-de-comprobantes/ver/:id',
    name: 'ValidationVouchersView',
    component: () =>
      import('@/views/validation-vouchers/v1/view/ValidationVouchersView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ValidationVoucherList',
        action: 'show',
      },
    },
  },
]
