export default [
  {
    path: '/tesoreria/parametros-contables-comisiones/editar/:idBlock/:idParam',
    name: 'AccountingParametersCommissionsEdit',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters-commissions/v1/edit/AccountingParametersCommissionsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/parametros-contables-comisiones/crear/:id',
    name: 'AccountingParametersCommissionsCreate',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters-commissions/v1/create/AccountingParametersCommissionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  }
]