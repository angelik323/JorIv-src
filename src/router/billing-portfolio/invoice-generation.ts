export default [
  {
    path: '/facturacion-cartera/generacion-de-facturas',
    name: 'GenerationCommissionInvoicesList',
    component: () =>
      import(
        '@/views/billing-portfolio/invoice-generation/v1/list/InvoiceGenerationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'GenerationCommissionInvoicesList',
      },
    },
  },
  {
    path: '/facturacion-cartera/generacion-de-facturas/crear',
    name: 'GenerationCommissionInvoicesCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/invoice-generation/v1/create/InvoiceGenerationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'GenerationCommissionInvoicesList',
        action: 'create',
      },
    },
  },
]
