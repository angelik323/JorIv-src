export default [
  {
    path: '/portafolio-de-inversiones/venta-renta-variable-acciones-moneda-extranjera/crear',
    name: 'ForeignCurrencyEquityStockSaleCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-currency-equity-stock-sale/v1/create/ForeignCurrencyEquityStockSaleCreate.vue'
      ),
  },
]
