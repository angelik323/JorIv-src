export default [
  {
    path: '/portafolio-de-inversiones/registro-venta-renta-fija-moneda-extranjera/crear',
    name: 'RegisterFixedIncomeForeignCurrencySaleCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-fixed-income-foreign-currency-sale/v1/Create/RegisterFixedIncomeForeignCurrencySaleCreate.vue'
      ),
  },
]
