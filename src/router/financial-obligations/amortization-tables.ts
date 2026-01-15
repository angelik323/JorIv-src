export default [
  {
    path: '/negocios-fiduciarios/tablas-de-amortizacion',
    name: 'AmortizationTablesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'AmortizationTablesList',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/amortization-tables/V1/list/AmortizationTablesList.vue'
      ),
  },
  {
    path: '/negocios-fiduciarios/tablas-de-amortizacion/crear',
    name: 'AmortizationTablesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FinancialObligations',
        view: 'AmortizationTablesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/financial-obligations/amortization-tables/V1/create/AmortizationTablesCreate.vue'
      ),
  },
]
