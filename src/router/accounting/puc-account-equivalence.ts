export default [
  {
    path: '/contabilidad/configuracion-puc-equivalente-fiscal',
    name: 'PucAccountEquivalenceList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PucAccountEquivalenceList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/puc-account-equivalence/v2/list/PucAccountEquivalenceList.vue'
      ),
  },
  {
    path: '/contabilidad/configuracion-puc-equivalente-fiscal/importar',
    name: 'PucAccountEquivalenceImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PucAccountEquivalenceList',
        action: 'action_import',
      },
    },
    component: () =>
      import(
        '@/views/accounting/puc-account-equivalence/v2/import/PucAccountingImport.vue'
      ),
  },
]
