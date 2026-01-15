export default [
  {
    path: '/presupuesto/anulacion-de-documentos',
    name: 'BudgetDocumentCancellationsList',
    component: () =>
      import(
        '@/views/budget/budget-document-cancellation/v1/list/BudgetDocumentCancellationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Budget',
        view: 'BudgetDocumentCancellationsList',
        action: 'list',
      },
    },
  },
]
