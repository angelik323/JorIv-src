export default [
  {
    path: '/portafolio-de-inversion/definicion-cupos-y-permisos-trader',
    name: 'TradePermitQuotaList',
    component: () =>
      import(
        '@/views/investment-portfolio/trade-permit-quota/v1/list/TradePermitQuotaList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/definicion-cupos-y-permisos-trader/crear',
    name: 'TradePermitQuotaCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/trade-permit-quota/v1/create/TradePermitQuotaCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/definicion-cupos-y-permisos-trader/editar/:id',
    name: 'TradePermitQuotaEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/trade-permit-quota/v1/edit/TradePermitQuotaEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversion/definicion-cupos-y-permisos-trader/ver/:id',
    name: 'TradePermitQuotaView',
    component: () =>
      import(
        '@/views/investment-portfolio/trade-permit-quota/v1/view/TradePermitQuotaView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
