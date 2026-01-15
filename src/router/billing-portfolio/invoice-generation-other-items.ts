export default [
  {
    path: '/facturacion-cartera/factura-otros-conceptos',
    name: 'GenerateInvoicesOtherConceptsList',
    component: () =>
      import(
        '@/views/billing-portfolio/invoice-generation-other-items/v1/list/InvoiceGenerationOtherItemsList.vue'
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
    path: '/facturacion-cartera/factura-otros-conceptos/crear',
    name: 'InvoiceGenerationOtherItemsCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/invoice-generation-other-items/v1/create/InvoiceGenerationOtherItemsCreate.vue'
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
    path: '/facturacion-cartera/factura-otros-conceptos/ver/:id',
    name: 'InvoiceGenerationOtherItemsView',
    component: () =>
      import(
        '@/views/billing-portfolio/invoice-generation-other-items/v1/view/InvoiceGenerationOtherItemsView.vue'
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
