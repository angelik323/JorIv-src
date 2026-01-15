export default [
  {
    path: '/portafolio-de-inversiones/etf-operacionales',
    name: 'OperationalETFList',
    component: () =>
      import(
        '@/views/investment-portfolio/operational-etf/v1/list/OperationalETFList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/etf-operacionales/crear',
    name: 'OperationalETFCreate',
    component: () =>
      import(
        '@/views/investment-portfolio/operational-etf/v1/create/OperationalETFCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/etf-operacionales/editar/:id',
    name: 'OperationalETFEdit',
    component: () =>
      import(
        '@/views/investment-portfolio/operational-etf/v1/edit/OperationalETFEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/portafolio-de-inversiones/etf-operacionales/ver/:id',
    name: 'OperationalETFView',
    component: () =>
      import(
        '@/views/investment-portfolio/operational-etf/v1/view/OperationalETFView.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
