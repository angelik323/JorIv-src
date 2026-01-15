export default [
  {
    path: '/portafolio-de-inversiones/compra-renta-acciones-moneda-extranjera/crear',
    name: 'ForeignEquityPurchaseCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/foreign-equity-purchase/v1/create/ForeignEquityPurchaseCreate.vue'
      ),
  },
]
