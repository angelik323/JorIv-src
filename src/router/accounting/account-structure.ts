export default [
  {
    path: '/contabilidad/estructuras-de-cuentas',
    name: 'AccountStructureList',
    component: () =>
      import(
        '@/views/accounting/account-structure/v1/list/AccountStructureList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountStructureList',
      },
    },
  },
  {
    path: '/contabilidad/estructuras-de-cuentas/crear',
    name: 'AccountStructureCreate',
    component: () =>
      import(
        '@/views/accounting/account-structure/v1/create/AccountStructureCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountStructureList',
        action: 'create',
      },
    },
  },
  {
    path: '/contabilidad/estructuras-de-cuentas/editar/:id',
    name: 'AccountStructureEdit',
    component: () =>
      import(
        '@/views/accounting/account-structure/v1/edit/AccountStructureEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountStructureList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contabilidad/estructuras-de-cuentas/ver/:id',
    name: 'AccountStructureView',
    component: () =>
      import(
        '@/views/accounting/account-structure/v1/view/AccountStructureView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountStructureList',
        action: 'show',
      },
    },
  },
]
