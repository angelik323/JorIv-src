export default [
  {
    path: '/facturacion-cartera/documentos-soporte',
    name: 'SupportingDocumentsList',
    component: () =>
      import(
        '@/views/billing-portfolio/supporting-documents/v1/list/SupportingDocumentsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'GenerateInvoicesOtherConceptsList',
      },
    },
  },
  {
    path: '/facturacion-cartera/documentos-soporte/crear',
    name: 'SupportingDocumentsCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/supporting-documents/v1/create/SupportingDocumentsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'GenerateInvoicesOtherConceptsList',
        action: 'create',
      },
    },
  },
  {
    path: '/facturacion-cartera/documentos-soporte/ver/:id',
    name: 'SupportingDocumentsView',
    component: () =>
      import(
        '@/views/billing-portfolio/supporting-documents/v1/view/SupportingDocumentsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'GenerateInvoicesOtherConceptsList',
        action: 'show',
      },
    },
  },
]
