export default [
  {
    path: '/contratacion-derivada/clausulas-de-contrato',
    name: 'ContractClausesList',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-clauses/v1/list/ContractClausesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractClausesList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/clausulas-de-contrato/crear',
    name: 'ContractClausesCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-clauses/v1/create/ContractClausesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractClausesList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/clausulas-de-contrato/editar/:id',
    name: 'ContractClausesEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-clauses/v1/edit/ContractClausesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractClausesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contratacion-derivada/clausulas-de-contrato/ver/:id',
    name: 'ContractClausesRead',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-clauses/v1/read/ContractClausesRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractClausesList',
        action: 'show',
      },
    },
  },
]
