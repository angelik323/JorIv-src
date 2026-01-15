export default [
  {
    path: '/contabilidad/desactualizar-comprobantes',
    name: 'DesactivateDailyClosingList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'DesactivateDailyClosingList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/desactivate-daily-closing-vouchers/v2/list/DesactivateDailyClosingVouchersList.vue'
      ),
  },
  {
    path: '/contabilidad/desactualizar-comprobantes/crear',
    name: 'DesactivateDailyClosingCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'DesactivateDailyClosingList',
        action: 'action_outdated',
      },
    },
    component: () =>
      import(
        '@/views/accounting/desactivate-daily-closing-vouchers/v2/create/DesactivateDailyClosingVouchersCreate.vue'
      ),
  },
]
