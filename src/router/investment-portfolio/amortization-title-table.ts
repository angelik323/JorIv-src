export default [
  {
    path: '/portafolio-de-inversion/tablas-de-amortizacion',
    name: 'AmortizationTitleTableList',
    component: () =>
      import(
        '@/views/investment-portfolio/amortization-tables/v1/list/AmortizationTitleTableList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/tablas-de-amortizacion/crear',
    name: 'AmortizationTitleTableCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/amortization-tables/v1/create/AmortizationTitleTableCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/tablas-de-amortizacion/:id/ver',
    name: 'AmortizationTitleTableView',
    component: () =>
      import(
        '@/views/investment-portfolio/amortization-tables/v1/view/AmortizationTitleTableView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/tablas-de-amortizacion/:id/editar',
    name: 'AmortizationTitleTableEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/amortization-tables/v1/edit/AmortizationTitleTableEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
