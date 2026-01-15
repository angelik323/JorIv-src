export default [
  {
    path: '/activos-fijos/configuracion-contable',
    name: 'AccountingConfigurationList',
    component: () =>
      import(
        '@/views/fixed-assets/accounting-configuration/v1/list/AccountingConfigurationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'AccountingConfigurationList',
        action: 'list',
      },
    },
  },
  {
    path: '/activos-fijos/configuracion-contable/crear',
    name: 'AccountingConfigurationCreate',
    component: () =>
      import(
        '@/views/fixed-assets/accounting-configuration/v1/create/AccountingConfigurationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'AccountingConfigurationList',
        action: 'create',
      },
    },
  },
  {
    path: '/activos-fijos/configuracion-contable/editar/:id',
    name: 'AccountingConfigurationEdit',
    component: () =>
      import(
        '@/views/fixed-assets/accounting-configuration/v1/edit/AccountingConfigurationEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'AccountingConfigurationList',
        action: 'edit',
      },
    },
  },
  {
    path: '/activos-fijos/configuracion-contable/ver/:id',
    name: 'AccountingConfigurationRead',
    component: () =>
      import(
        '@/views/fixed-assets/accounting-configuration/v1/read/AccountingConfigurationRead.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'AccountingConfigurationList',
        action: 'show',
      },
    },
  },

  {
    path: '/activos-fijos/configuracion-contable/importar',
    name: 'AccountingConfigurationImport',
    component: () =>
      import(
        '@/views/fixed-assets/accounting-configuration/v1/import/AccountingConfigurationImport.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'FixedAssets',
        view: 'AccountingConfigurationList',
        action: 'create',
      },
    },
  },
]
