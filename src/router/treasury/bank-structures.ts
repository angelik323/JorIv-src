export default [
  {
    path: '/tesoreria/estructuras-bancarias',
    name: 'BankStructuresList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankStructuresList',
      },
    },
    component: () =>
      import('@/views/treasury/bank-structures/v1/list/BankStructuresList.vue'),
  },
  {
    path: '/tesoreria/estructuras-bancarias/ver-definicion-formato/:id',
    name: 'FormatDefinitionView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankStructuresList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/treasury/bank-structures/v1/view/FormatDefinitionView/FormatDefinitionView.vue'
      ),
  },
  {
    path: '/tesoreria/estructuras-bancarias/ver-columnas-registro/:id',
    name: 'RecordColumnsView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'BankStructuresList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/treasury/bank-structures/v1/view/RecordColumnsView/RecordColumnsView.vue'
      ),
  },
]
