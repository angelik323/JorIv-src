export default [
  {
    path: '/portafolio-de-inversiones/registro-venta-renta-fija-moneda-local/crear',
    name: 'RegisterFixedIncomeLocalCurrencySaleCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-fixed-income-local-currency-sale/v1/Create/RegisterFixedIncomeLocalCurrencySaleCreate.vue'
      ),
  },
]
