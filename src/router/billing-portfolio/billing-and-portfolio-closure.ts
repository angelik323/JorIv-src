export default [
  {
    path: '/facturacion-cartera/cierre-facturacion-cartera',
    name: 'BillingAndPortfolioClosureList',
    component: () =>
      import(
        '@/views/billing-portfolio/billing-portfolio-closure/v1/list/BillingAndPortfolioClosureList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'BillingAndPortfolioClosureList',
        action: 'create',
      },
    },
  },
  {
    path: '/facturacion-cartera/cierre-facturacion-cartera/crear',
    name: 'BillingAndPortfolioClosureCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/billing-portfolio-closure/v1/create/BillingAndPortfolioClosureCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'BillingAndPortfolioClosureList',
        action: 'create',
      },
    },
  },

  {
    path: '/facturacion-cartera/cierre-facturacion-cartera/ver/:id',
    name: 'BillingAndPortfolioClosureView',
    component: () =>
      import(
        '@/views/billing-portfolio/billing-portfolio-closure/v1/view/BillingAndPortfolioClosureView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'BillingAndPortfolioClosureList',
        action: 'show',
      },
    },
  },
  {
    path: '/facturacion-cartera/cierre-facturacion-cartera/confirmar/:id',
    name: 'BillingAndPortfolioClosureConfirm',
    component: () =>
      import(
        '@/views/billing-portfolio/billing-portfolio-closure/v1/confirm/BillingAndPortfolioClosureConfirm.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'BillingAndPortfolioClosureList',
        action: 'show',
      },
    },
  },
]
