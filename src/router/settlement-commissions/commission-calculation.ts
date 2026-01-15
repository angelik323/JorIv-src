export default [
  {
    path: '/liquidacion-de-comisiones/calculo-comisiones',
    name: 'CommissionsCalculationList',
    component: () =>
      import(
        '@/views/settlement-commissions/commission-calculation/v1/list/CommissionCalculationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionsCalculationList',
        action: 'list',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/calculo-comisiones/crear',
    name: 'CommissionCalculationCreate',
    component: () =>
      import(
        '@/views/settlement-commissions/commission-calculation/v2/create/CommissionCalculationCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionsCalculationList',
        action: 'create',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/calculo-comisiones/editar/:id',
    name: 'CommissionCalculationEdit',
    component: () =>
      import(
        '@/views/settlement-commissions/commission-calculation/v1/edit/CommissionCalculationEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionsCalculationList',
        action: 'edit',
      },
    },
  },
  {
    path: '/liquidacion-de-comisiones/calculo-comisiones/ver/:id',
    name: 'CommissionCalculationView',
    component: () =>
      import(
        '@/views/settlement-commissions/commission-calculation/v2/view/CommissionCalculationView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'SettlementCommissions',
        view: 'CommissionsCalculationList',
        action: 'show',
      },
    },
  },
]
