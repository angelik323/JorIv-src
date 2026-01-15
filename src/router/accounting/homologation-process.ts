export default [
  {
    path: '/contabilidad/proceso-homologacion',
    name: 'HomologationProcessList',
    component: () =>
      import(
        '@/views/accounting/homologation-process/v1/list/HomologationProcessList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'HomologationProcessList',
      },
    },
  },
  {
    path: '/contabilidad/proceso-homologacion/crear',
    name: 'HomologationProcessCreate',
    component: () =>
      import(
        '@/views/accounting/homologation-process/v1/create/HomologationProcessCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'HomologationProcessList',
        action: 'action_homologate',
      },
    },
  },
  {
    path: '/contabilidad/proceso-homologacion/ver/:id',
    name: 'HomologationProcessView',
    component: () =>
      import(
        '@/views/accounting/homologation-process/v1/view/HomologationProcessView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'HomologationProcessList',
        action: 'show',
      },
    },
  },
  {
    path: '/contabilidad/proceso-homologacion/ver/:id/comprobante/:voucherId',
    name: 'HomologationProcessViewVoucher',
    component: () =>
      import(
        '@/views/accounting/homologation-process/v1/view-voucher/HomologationProcessViewVoucher.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'HomologationProcessList',
        action: 'show',
      },
    },
  },
  {
    path: '/contabilidad/proceso-homologacion/ver/:id/comprobante/:voucherId/novedades',
    name: 'HomologationProcessVoucherLogs',
    component: () =>
      import(
        '@/views/accounting/homologation-process/v1/voucher-logs/HomologationProcessVoucherLogs.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'HomologationProcessList',
        action: 'show',
      },
    },
  },
]
