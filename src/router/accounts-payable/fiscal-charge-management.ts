export default [
  {
    path: '/cuentas-por-pagar/gestion-cargo-fiscal',
    name: 'FiscalChargeManagementList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/fiscal-charge-management/v1/list/FiscalChargeManagementList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/gestion-cargo-fiscal/crear',
    name: 'FiscalChargeManagementCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/fiscal-charge-management/v1/create/FiscalChargeManagementCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/gestion-cargo-fiscal/editar/:id',
    name: 'FiscalChargeManagementEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/fiscal-charge-management/v1/edit/FiscalChargeManagementEdit.vue'
      ),
  },
]
