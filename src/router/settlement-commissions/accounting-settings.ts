export default [
  {
    path: '/liquidacion-de-comisiones/parametros-contables',
    name: 'AccountingSettingsList',
    component: () =>
      import(
        '@/views/settlement-commissions/accounting-settings/v2/list/AccountingSettingsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'AccountingSettingsList',
        action: 'list',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/parametros-contables/crear',
    name: 'AccountingSettingsCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/accounting-settings/v2/create/AccountingSettingsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'AccountingSettingsList',
        action: 'create',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/parametros-contables/editar/:id',
    name: 'AccountingSettingsEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/accounting-settings/v2/edit/AccountingSettingsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'AccountingSettingsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/parametros-contables/ver/:id',
    name: 'AccountingSettingsView',
    component: () =>
      import(
        '@/views/settlement-commissions/accounting-settings/v2/view/AccountingSettingsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'AccountingSettingsList',
        action: 'show',
      },
    },
  },
]
