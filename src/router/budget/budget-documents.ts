export default [
  {
    path: '/presupuesto/consulta-documentos-presupuestales',
    name: 'BudgetDocumentsList',
    component: () =>
      import('@/views/budget/budget-documents/v1/list/BudgetDocumentsList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetDocumentsList',
        action: 'list',
      },
    },
  },
  {
    path: '/presupuesto/consulta-documentos-presupuestales/ver/:id',
    name: 'BudgetDocumentsView',
    component: () =>
      import('@/views/budget/budget-documents/v1/view/BudgetDocumentsView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetDocumentsList',
        action: 'show',
      },
    },
  },
]
