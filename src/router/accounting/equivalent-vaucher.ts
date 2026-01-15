export default [
  {
    path: '/contabilidad/comprobantes-equivalentes/crear',
    name: 'EquivalentVaucherCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'EquivalentVaucherList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/equivalent-vaucher/v1/create/EquivalentVaucherCreate.vue'
      ),
  },
  {
    path: '/contabilidad/comprobantes-equivalentes',
    name: 'EquivalentVaucherList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'EquivalentVaucherList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/equivalent-vaucher/v1/list/EquivalentVaucherList.vue'
      ),
  },
  {
    path: '/contabilidad/comprobantes-equivalentes/importar',
    name: 'EquivalentVaucherImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      action: 'action_import',
    },
    component: () =>
      import(
        '@/views/accounting/equivalent-vaucher/v1/import/EquivalentVaucherImport.vue'
      ),
  },
]
