export default [
  {
    path: '/portafolio-de-inversiones/pago-dividendos-moneda-extranjera',
    name: 'DividendPaymentForeignCurrencyList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-payment-foreign-currency/v1/list/DividendPaymentForeignCurrencyList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/pago-dividendos-moneda-extranjera/crear',
    name: 'DividendPaymentForeignCurrencyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-payment-foreign-currency/v1/create/DividendPaymentForeignCurrencyCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/pago-dividendos-moneda-extranjera/ver/:id',
    name: 'DividendPaymentForeignCurrencyView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/dividend-payment-foreign-currency/v1/view/DividendPaymentForeignCurrencyView.vue'
      ),
  },
]
