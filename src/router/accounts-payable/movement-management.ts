export default [
  {
    path: '/cuentas-por-pagar/gestion-de-movimientos',
    name: 'MovementManagementList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'MovementManagementList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/movement-management/v1/list/MovementManagementList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/gestion-de-movimientos/crear',
    name: 'MovementManagementCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'MovementManagementList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/movement-management/v1/create/MovementManagementCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/gestion-de-movimientos/importar',
    name: 'MovementManagementImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'MovementManagementList',
        action: 'export',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/movement-management/v1/import/MovementManagementImport.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/gestion-de-movimientos/editar/:id',
    name: 'MovementManagementEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'MovementManagementList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/movement-management/v1/edit/MovementManagementEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/gestion-de-movimientos/ver/:id',
    name: 'MovementManagementView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'MovementManagementList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/movement-management/v1/view/MovementManagementView.vue'
      ),
  },
]
