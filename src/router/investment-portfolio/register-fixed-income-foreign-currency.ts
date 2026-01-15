export default [
  {
    path: '/portafolio-de-inversiones/registro-compra-renta-fija-moneda-extranjera/crear',
    name: 'RegisterFixedIncomeForeignCurrencyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-fixed-income-foreign-currency/v1/Create/RegisterFixedIncomeForeignCurrencyCreate.vue'
      ),
  },
]
