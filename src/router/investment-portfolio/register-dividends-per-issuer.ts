export default [
  {
    path: '/portafolio-de-inversiones/registro-de-dividendos-por-emisor-acciones',
    name: 'RegisterDividendsPerIssuerList',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-per-issuer/v1/list/RegisterDividendsPerIssuerList.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-de-dividendos-por-emisor-acciones/crear',
    name: 'RegisterDividendsPerIssuerCreate',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-per-issuer/v1/create/RegisterDividendsPerIssuerCreate.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-de-dividendos-por-emisor-acciones/editar/:id',
    name: 'RegisterDividendsPerIssuerEdit',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-per-issuer/v1/edit/RegisterDividendsPerIssuerEdit.vue'
      ),
  },
  {
    path: '/portafolio-de-inversiones/registro-de-dividendos-por-emisor-acciones/ver/:id',
    name: 'RegisterDividendsPerIssuerView',
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
    component: () =>
      import(
        '@/views/investment-portfolio/register-dividends-per-issuer/v1/view/RegisterDividendsPerIssuerView.vue'
      ),
  },
]
