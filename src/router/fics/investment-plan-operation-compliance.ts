export default [
  {
    path: '/fics/operaciones-plan-inversion/cumplimiento-operaciones-aportes-retiros/:id',
    name: 'InvestmentPlanOperationCompliance',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiresValidRole: {
        module: 'Fics',
        view: 'InvestmentPlanOperationCompliance',
      },
    },
    component: () =>
      import(
        '@/views/fics/investment-plan-operations-compliance/v1/compliance/InvestmentPlanOperationCompliance.vue'
      ),
  },
]
