export default [
  {
    path: '/portafolio-de-inversiones/dividendos-moneda-extranjera/crear',
    name: 'DividendForeignCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-foreing-exchange/create/DividendForeignCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/dividendos-moneda-extranjera/editar/:id',
    name: 'DividendForeignEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-foreing-exchange/edit/DividendForeignEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/dividendos-moneda-extranjera/ver/:id',
    name: 'DividendForeignView',
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-foreing-exchange/view/DividendForeignView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
