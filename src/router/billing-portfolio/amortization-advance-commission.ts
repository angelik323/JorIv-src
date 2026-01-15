export default [
  {
    path: '/facturacion-cartera/amortizacion-comision-anticipada',
    name: 'AmortizationAdvanceCommissionList',
    component: () =>
      import(
        '@/views/billing-portfolio/amortization-advance-commission/v1/list/AmortizationAdvanceCommissionList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/facturacion-cartera/amortizacion-comision-anticipada/crear/:id?',
    name: 'AmortizationAdvanceCommissionCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/amortization-advance-commission/v1/create/AmortizationAdvanceCommissionCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/facturacion-cartera/amortizacion-comision-anticipada/ver/:id',
    name: 'AmortizationAdvanceCommissionView',
    component: () =>
      import(
        '@/views/billing-portfolio/amortization-advance-commission/v1/view/AmortizationAdvanceCommissionView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
