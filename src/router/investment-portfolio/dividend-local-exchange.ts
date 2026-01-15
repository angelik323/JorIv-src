export default [
  {
    path: '/portafolio-de-inversiones/dividendos-monedas',
    name: 'DividendLocalList',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-local-exchange/v1/list/DividendLocalList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/dividendos-moneda-local/crear',
    name: 'DividendLocalCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-local-exchange/v1/create/DividendLocalCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/dividendos-moneda-local/editar/:id',
    name: 'DividendLocalEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-local-exchange/v1/edit/DividendLocalEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/dividendos-moneda-local/ver/:id',
    name: 'DividendLocalView',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-local-exchange/v1/view/DividendLocalView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
