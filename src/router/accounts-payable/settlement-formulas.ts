export default [
  {
    path: '/cuentas-por-pagar/formulas-liquidacion',
    name: 'SettlementFormulasList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementFormulasList',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-formulas/v1/list/SettlementFormulasList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/formulas-liquidacion/crear',
    name: 'SettlementFormulasCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementFormulasList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-formulas/v1/create/SettlementFormulasCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/formulas-liquidacion/editar/:id',
    name: 'SettlementFormulasEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'SettlementFormulasList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/settlement-formulas/v1/edit/SettlementFormulasEdit.vue'
      ),
  },
]
