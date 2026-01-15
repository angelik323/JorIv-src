export default [
  {
    path: '/portafolio-de-inversiones/registro-compra-renta-fija-moneda-local/crear',
    name: 'RegisterFixedIncomeLocalCurrencyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-fixed-income-local-currency/v1/Create/RegisterFixedIncomeLocalCurrencyCreate.vue'
      ),
  },
]
