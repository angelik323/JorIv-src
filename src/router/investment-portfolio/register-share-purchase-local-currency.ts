export default [
  {
    path: '/portafolio-de-inversiones/registro-compra-acciones-moneda-local/crear',
    name: 'RegisterSharePurchaseLocalCurrencyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-share-purchase-local-currency/v1/create/RegisterSharePurchaseLocalCurrencyCreate.vue'
      ),
  },
]
