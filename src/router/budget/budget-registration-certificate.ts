export default [
  {
    path: '/presupuesto/certificado-registro-presupuestal',
    name: 'BudgetRegistrationCertificateList',
    component: () =>
      import(
        '@/views/budget/budget-registration-certificate/v1/list/BudgetRegistrationCertificateList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      // requiredValidRole: {
      //   module: 'Budget',
      //   view: 'BudgetRegistrationCertificateList',
      // },
    },
  },
  {
    path: '/presupuesto/certificado-registro-presupuestal/:id',
    name: 'BudgetRegistrationCertificateView',
    component: () =>
      import(
        '@/views/budget/budget-registration-certificate/v1/view/BudgetRegistrationCertificateView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirPasswordChange: true,
      // requiredValidRole: {
      //   module: 'Budget',
      //   view: 'BudgetRegistrationCertificateView',
      // },
    },
  },
]
