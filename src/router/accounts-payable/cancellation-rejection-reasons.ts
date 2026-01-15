export default [
  {
    path: '/cuentas-por-pagar/motivos-anulacion-rechazo',
    name: 'CancellationRejectionReasonsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/cancellation-rejection-reasons/v1/list/CancellationRejectionReasonsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/motivos-anulacion-rechazo/crear',
    name: 'CancellationRejectionReasonsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/cancellation-rejection-reasons/v1/create/CancellationRejectionReasonsCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/motivos-anulacion-rechazo/editar/:id',
    name: 'CancellationRejectionReasonsEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/cancellation-rejection-reasons/v1/edit/CancellationRejectionReasonsEdit.vue'
      ),
  },
]
