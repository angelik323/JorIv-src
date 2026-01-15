export default [
  {
    path: '/portafolio-inversion/operaciones-renta-fija',
    name: 'RegisterMonetaryMarketList',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/list/RegisterMonetaryMarketList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/crear/ttvs',
    name: 'TtvCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/create/ttvs/TtvCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/crear/repos',
    name: 'OperationReposCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/create/operation-repos/OperationReposCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/crear/simultaneas',
    name: 'SimultaneosCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/create/simultaneous/SimultaneosCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/ver/ttv/:operationNumber',
    name: 'TtvView',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/view/ttvs/TtvView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/ver/repo/:operationNumber',
    name: 'OperationReposView',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/view/operation-repos/OperationReposView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/ver/simultaneas/:operationNumber',
    name: 'SimultaneousView',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/view/simultaneous/SimultaneosView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-inversion/operaciones-mercado-monetario/editar/:id',
    name: 'RegisterMonetaryMarketEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/register-monetary-market/v1/edit/RegisterMonetaryMarketEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
