export default [
  {
    path: '/negocios-fiduciarios/parametros-contables-codigos-movimiento',
    name: 'AccountingParametersMovementCodesCreate',
    component: () =>
      import(
        '@/views/trust-business/accounting-parameters-movement-codes/v1/create/AccountingParametersMovementCodesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'AccountingParametersMovementCodesCreate',
      },
    },
  },
]
