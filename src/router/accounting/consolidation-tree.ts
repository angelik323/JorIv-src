export default [
  {
    path: '/contabilidad/arbol-consolidacion',
    name: 'ConsolidationTreeList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ConsolidationTreeList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/consolidation-tree/v2/list/ConsolidationTreeList.vue'
      ),
  },
  {
    path: '/contabilidad/arbol-consolidacion/crear',
    name: 'ConsolidationTreeCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ConsolidationTreeList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/consolidation-tree/v2/create/ConsolidationTreeCreate.vue'
      ),
  },
  {
    path: '/contabilidad/arbol-consolidacion/editar/:id',
    name: 'ConsolidationTreeEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ConsolidationTreeList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounting/consolidation-tree/v2/edit/ConsolidationTreeEdit.vue'
      ),
  },
  {
    path: '/contabilidad/arbol-consolidacion/ver/:id',
    name: 'ConsolidationTreeView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ConsolidationTreeList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounting/consolidation-tree/v2/view/ConsolidationTreeView.vue'
      ),
  },
]
