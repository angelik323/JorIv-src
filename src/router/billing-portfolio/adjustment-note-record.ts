export default [
  {
    path: '/facturacion-cartera/registro-notas-de-ajuste',
    name: 'InvoicesCommissionNotesList',
    component: () =>
      import(
        '@/views/billing-portfolio/adjustment-note-record/v1/list/AdjustmentNoteRecordList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'InvoicesCommissionNotesList',
        action: 'list',
      },
    },
  },
  {
    path: '/facturacion-cartera/registro-notas-de-ajuste/crear',
    name: 'AdjustmentNoteRecordCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/adjustment-note-record/v1/create/AdjustmenNoteRecordCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'InvoicesCommissionNotesList',
        action: 'create',
      },
    },
  },
  {
    path: '/facturacion-cartera/registro-notas-de-ajuste/editar/:invoiceId/:noteId',
    name: 'AdjustmentNoteRecordEdit',
    component: () =>
      import(
        '@/views/billing-portfolio/adjustment-note-record/v1/edit/AdjustmentNoteRecordEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'InvoicesCommissionNotesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/facturacion-cartera/registro-notas-de-ajuste/ver/:id',
    name: 'AdjustmentNoteRecordView',
    component: () =>
      import(
        '@/views/billing-portfolio/adjustment-note-record/v1/view/AdjustmentNoteRecordView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'InvoicesCommissionNotesList',
        action: 'show',
      },
    },
  },
]
