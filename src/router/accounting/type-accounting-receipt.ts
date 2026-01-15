export default [
  {
    path: '/contabilidad/tipos-comprobantes-contables',
    name: 'TypeAccountingReceiptList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'TypeAccountingReceiptList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/types_accounting_receipt/v2/list/TypesAccountingReceiptList.vue'
      ),
  },
  {
    path: '/contabilidad/tipos-comprobantes-contables/crear',
    name: 'TypeAccountingReceiptCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'TypeAccountingReceiptList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/types_accounting_receipt/v2/create/TypesAccountingReceiptCreate.vue'
      ),
  },
  {
    path: '/contabilidad/tipos-comprobantes-contables/editar/:id',
    name: 'TypeAccountingReceiptEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'TypeAccountingReceiptList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounting/types_accounting_receipt/v2/edit/TypesAccountingReceiptEdit.vue'
      ),
  },
  {
    path: '/contabilidad/tipos-comprobantes-contables/ver/:id',
    name: 'TypeAccountingReceiptView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'TypeAccountingReceiptList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounting/types_accounting_receipt/v2/view/TypesAccountingReceiptView.vue'
      ),
  },
  {
    path: '/contabilidad/tipos-comprobantes-contables/descargar',
    name: 'TypeAccountingReceiptDownload',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'TypeAccountingReceiptList',
        action: 'export',
      },
    },
    component: () =>
      import(
        '@/views/accounting/types_accounting_receipt/v1/download/TypesAccountingReceiptDownload.vue'
      ),
  },
]
