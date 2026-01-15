export default [
  {
    path: '/contabilidad/cargue-comprobantes-contables',
    name: 'UploadAccountingVouchersList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'UploadAccountingVouchersList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/upload-accounting-vouchers/v2/list/UploadAccountingVouchersList.vue'
      ),
  },
  {
    path: '/contabilidad/cargue-comprobantes-contables/importar',
    name: 'UploadAccountingVouchersImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'UploadAccountingVouchersList',
        action: 'process',
      },
    },
    component: () =>
      import(
        '@/views/accounting/upload-accounting-vouchers/v2/import/UploadAccountingVouchersImport.vue'
      ),
  },
]
