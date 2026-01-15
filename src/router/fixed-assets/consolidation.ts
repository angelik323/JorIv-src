export default [
  {
    path: '/activos-fijos/englobe',
    name: 'ConsolidationList',
    component: () =>
      import(
        '@/views/fixed-assets/consolidation/v1/list/ConsolidationList.vue'
      ),

    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConsolidationList',
      },
    },
  },
  {
    path: '/activos-fijos/englobe/crear',
    name: 'ConsolidationCreate',
    component: () =>
      import(
        '@/views/fixed-assets/consolidation/v1/create/ConsolidationCreate.vue'
      ),
    meta: {
      requiresAuth: false,
      requiresFirstPasswordChanged: false,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConsolidationList',
        action: 'create',
      },
    },
  },
  {
    path: '/activos-fijos/englobe/editar/:id',
    name: 'ConsolidationEdit',
    component: () =>
      import(
        '@/views/fixed-assets/consolidation/v1/edit/ConsolidationEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConsolidationList',
        action: 'edit',
      },
    },
  },
  {
    path: '/activos-fijos/englobe/ver/:id',
    name: 'ConsolidationRead',
    component: () =>
      import(
        '@/views/fixed-assets/consolidation/v1/read/ConsolidationRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'ConsolidationList',
        action: 'read',
      },
    },
  },
]
