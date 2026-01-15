export default [
  {
    path: '/portafolio-de-inversiones/registro-ventas-renta-variable-acciones-moneda-local/crear',
    name: 'RegisterSalesVariableIncomeShareLocalCurrencyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-sales-variable-income-share-local-currency/v1/Create/RegisterSalesVariableIncomeShareLocalCurrencyCreate.vue'
      ),
  },
]
