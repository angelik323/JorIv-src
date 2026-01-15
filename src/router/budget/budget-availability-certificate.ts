export default [
  {
    path: '/presupuesto/certificado-disponibilidad-presupuestal',
    name: 'BudgetAvailabilityCertificateList',
    component: () =>
      import('@/views/budget/budget-availability-certificate/v1/list/BudgetAvailabilityCertificateList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAvailabilityCertificateList',
        action: 'list',
      },
    },
  },
  {
    path: '/presupuesto/certificado-disponibilidad-presupuestal/ver/:id',
    name: 'BudgetAvailabilityCertificateView',
    component: () =>
      import('@/views/budget/budget-availability-certificate/v1/view/BudgetAvailabilityCertificateView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetAvailabilityCertificateList',
        action: 'show',
      },
    },
  },
]
