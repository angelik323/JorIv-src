export default [
  {
    path: '/liquidacion-de-comisiones/calificaciones-de-cartera',
    name: 'PortfolioClassificationList',
    component: () =>
      import(
        '@/views/settlement-commissions/portfolio-classification/v2/list/PortfolioClassificationList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/calificaciones-de-cartera/crear',
    name: 'PortfolioClassificationCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/portfolio-classification/v2/create/PortfolioClassificationCreate.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/liquidacion-de-comisiones/calificaciones-de-cartera/editar/:id',
    name: 'PortfolioClassificationEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/portfolio-classification/v2/edit/PortfolioClassificationEdit.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
