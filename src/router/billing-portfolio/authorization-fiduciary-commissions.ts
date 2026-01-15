export default [
  {
    path: '/facturacion-cartera/autorizacion-comisiones-fiduciarias',
    name: 'AuthorizationFiduciaryCommissionsList',
    component: () =>
      import(
        '@/views/billing-portfolio/authorization-fiduciary-commissions/v1/list/AuthorizationFiduciaryCommissionsList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/facturacion-cartera/autorizacion-comisiones-fiduciarias/ver/:id',
    name: 'AuthorizationFiduciaryCommissionsView',
    component: () =>
      import(
        '@/views/billing-portfolio/authorization-fiduciary-commissions/v1/view/AuthorizationFiduciaryCommissionsView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  }
]
