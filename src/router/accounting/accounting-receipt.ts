export default [
  {
    path: '/comprobantes-contables',
    name: 'AccountingReceiptList',
    component: () =>
      import(
        '@/views/accounting/accounting-receipt/v3/list/AccountingReceiptList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingReceiptList',
      },
    },
  },
  {
    path: '/comprobantes-contables/crear',
    name: 'AccountingReceiptCreate',
    component: () =>
      import(
        '@/views/accounting/accounting-receipt/v3/create/AccountingReceiptCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingReceiptList',
        action: 'create',
      },
    },
  },
  {
    path: '/comprobantes-contables/editar/:id',
    name: 'AccountingReceiptEdit',
    component: () =>
      import(
        '@/views/accounting/accounting-receipt/v3/edit/AccountingReceiptEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    requiredValidRole: {
      module: 'Accounting',
      view: 'AccountingReceiptList',
      action: 'edit',
    },
  },
  {
    path: '/comprobantes-contables/:id',
    name: 'AccountingReceiptView',
    component: () =>
      import(
        '@/views/accounting/accounting-receipt/v3/view/AccountingReceiptView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: [
        {
          module: 'Accounting',
          view: 'AccountingReceiptList',
          action: 'show',
        },
        {
          module: 'Accounting',
          view: 'VoucherAuthorization',
          action: 'show',
        },
      ],
    },
  },
]
