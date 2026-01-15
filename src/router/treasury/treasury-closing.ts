export default [
  {
    path: '/tesoreria/cierre-tesoreria',
    name: 'TreasuryClosingList',
    component: () =>
      import(
        '@/views/treasury/treasury-closing/v1/list/TreasuryClosingList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/cierre-tesoreria/resumen-cierre',
    name: 'TreasuryClosingSummaryList',
    component: () =>
      import(
        '@/views/treasury/treasury-closing-summary/v1/list/TreasuryClosingSummaryList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
  {
    path: '/tesoreria/cierre-tesoreria/resumen-errores',
    name: 'TreasuryClosingErrorsSummaryList',
    component: () =>
      import(
        '@/views/treasury/treasury-closing-errors-summary/v1/list/TreasuryClosingErrorsSummaryList.vue'
      ),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: true },
  },
]
