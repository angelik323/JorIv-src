export default [
  {
    path: '/contratacion-derivada/registro-contratos',
    name: 'ContractRegistrationList',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-registration/v1/list/ContractRegistrationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractRegistrationList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/registro-contratos/crear',
    name: 'ContractRegistrationCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-registration/v1/create/ContractRegistrationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractRegistrationList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/registro-contratos/editar/:id',
    name: 'ContractRegistrationEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-registration/v1/edit/ContractRegistrationEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractRegistrationList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contratacion-derivada/registro-contratos/ver/:id',
    name: 'ContractRegistrationView',
    component: () =>
      import(
        '@/views/derivative-contracting/contract-registration/v1/view/ContractRegistrationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'ContractRegistrationList',
        action: 'show',
      },
    },
  },
]
