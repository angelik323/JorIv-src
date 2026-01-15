export default [
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable',
    name: 'EquityOpsList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/list/EquityOpsList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/compra-moneda-local/crear',
    name: 'ETFLocalBuyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-local-buy/v1/create/ETFLocalBuyCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/compra-moneda-local/ver/:id',
    name: 'ETFLocalBuyView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-local-buy/v1/view/ETFLocalBuyView.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/venta-moneda-local/crear',
    name: 'ETFLocalSellCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-local-sell/v1/create/ETFLocalSellCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/venta-moneda-local/ver/:id',
    name: 'ETFLocalSellView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-local-sell/v1/view/ETFLocalSellView.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/compra-moneda-extranjera/crear',
    name: 'ETFForeignBuyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-foreign-buy/v1/create/ETFForeignBuyCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/compra-moneda-extranjera/ver/:id',
    name: 'ETFForeignBuyView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-foreign-buy/v1/view/ETFForeignBuyView.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/venta-moneda-extranjera/crear',
    name: 'ETFForeignSellCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-foreign-sell/v1/create/ETFForeignSellCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/operaciones-renta-variable/etf/venta-moneda-extranjera/ver/:id',
    name: 'ETFForeignSellView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/equity-ops/v1/menu/etf-foreign-sell/v1/view/ETFForeignSellView.vue'
      ),
  },
]
