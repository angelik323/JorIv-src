export default [
  {
    path: '/tesoreria/bloques-contables-comisiones/crear',
    name: 'AccountingParametersCreate',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters/v1/create/AccountingParametersCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/bloques-contables-comisiones/editar/:id',
    name: 'AccountingParametersEdit',
    component: () =>
      import(
        '@/views/treasury/accounting-parameters/v1/edit/AccountingParametersEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
