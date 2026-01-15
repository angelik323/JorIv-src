export default [
  {
    path: '/estructura-flujo-caja',
    name: 'CashFlowStructuresList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CashFlowStructuresList',
      },
    },
    component: () =>
      import(
        '@/views/treasury/cash-flow-structures/v1/list/CashFlowStructuresList.vue'
      ),
  },
  {
    path: '/estructura-flujo-caja/crear',
    name: 'CashFlowStructuresCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CashFlowStructuresList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/treasury/cash-flow-structures/v1/create/CashFlowStructuresCreate.vue'
      ),
  },
  {
    path: '/estructura-flujo-caja/editar/:id',
    name: 'CashFlowStructuresEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'CashFlowStructuresList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/treasury/cash-flow-structures/v1/edit/CashFlowStructuresEdit.vue'
      ),
  },
]
