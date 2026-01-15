export default [
  {
    path: '/contabilidad/consolidacion-contabilidades',
    name: 'AccountingConsolidationList',
    component: () =>
      import(
        '@/views/accounting/accounting-consolidation/v2/list/AccountingConsolidationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingConsolidationList',
      },
    },
  },
  {
    path: '/contabilidad/consolidacion-contabilidades/procesar',
    name: 'AccountingConsolidationCreate',
    component: () =>
      import(
        '@/views/accounting/accounting-consolidation/v2/process/AccountingConsolidationProcess.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingConsolidationList',
        action: 'process',
      },
    },
  },
  {
    path: '/contabilidad/consolidacion-contabilidades/ver/:id',
    name: 'AccountingConsolidationView',
    component: () =>
      import(
        '@/views/accounting/accounting-consolidation/v2/view/AccountingConsolidationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingConsolidationList',
        action: 'show',
      },
    },
  },
  {
    path: '/contabilidad/consolidacion-contabilidades/detalle/:id',
    name: 'AccountingConsolidationDetail',
    component: () =>
      import(
        '@/views/accounting/accounting-consolidation/v2/detail/AccountingConsolidationDetail.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingConsolidationList',
        action: 'process',
      },
    },
  },
]
