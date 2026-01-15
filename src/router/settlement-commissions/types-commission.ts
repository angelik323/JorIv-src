export default [
  {
    path: '/liquidacion-de-comisiones/tipos-de-comision',
    name: 'CommissionTypesList',
    component: () =>
      import(
        '@/views/settlement-commissions/types-commission/v2/list/TypeCommissionsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionTypesList',
        action: 'list',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/tipos-de-comision/crear',
    name: 'TypeCommissionsCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/types-commission/v2/create/TypeCommissionsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionTypesList',
        action: 'create',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/tipos-de-comision/editar/:id',
    name: 'TypeCommissionsEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/types-commission/v2/edit/TypeCommissionsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionTypesList',
        action: 'edit',
      },
    },
  },
]
