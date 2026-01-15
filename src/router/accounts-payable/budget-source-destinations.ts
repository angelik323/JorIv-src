export default [
  {
    path: '/cuentas-por-pagar/fuentes-y-destinos',
    name: 'BudgetSourceDestinationsList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/budget-sources-destinations/v1/list/BudgetSourceDestinationsList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/fuentes-y-destinos/crear',
    name: 'BudgetSourceDestinationsCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
    component: () =>
      import(
        '@/views/accounts-payable/budget-sources-destinations/v1/create/BudgetSourceDestinationsCreate.vue'
      ),
  },
]
