export default [
  {
    path: '/portafolio-de-inversiones/registro-dividendos-acciones-moneda-extranjera',
    name: 'RegisterDividendsForeignCurrencyList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-foreign-currency/v1/list/RegisterDividendsForeignCurrencyList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-dividendos-acciones-moneda-extranjera/crear',
    name: 'RegisterDividendsForeignCurrencyCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-foreign-currency/v1/create/RegisterDividendsForeignCurrencyCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-dividendos-acciones-moneda-extranjera/editar/:id',
    name: 'RegisterDividendsForeignCurrencyEdit',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-foreign-currency/v1/edit/RegisterDividendsForeignCurrencyEdit.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-dividendos-acciones-moneda-extranjera/ver/:id',
    name: 'RegisterDividendsForeignCurrencyView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-foreign-currency/v1/view/RegisterDividendsForeignCurrencyView.vue'
      ),
  },
]
