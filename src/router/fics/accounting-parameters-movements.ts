export default [
  {
    path: '/fics/parametros-contabilidad/copiar/:id',
    name: 'AccountingParametersMovementsCopy',
    component: () =>
      import(
        '@/views/fics/accounting-parameters/accounting-parameters-movements/v1/copy/AccountingParametersMovementsCopy.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'AccountingParametersList',
      },
    },
  },
  {
    path: '/fics/parametros-contabilidad/crear',
    name: 'AccountingParametersMovementsCreate',
    component: () =>
      import(
        '@/views/fics/accounting-parameters/accounting-parameters-movements/v1/create/AccountingParametersMovementsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'AccountingParametersList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/parametros-contabilidad/editar/:id',
    name: 'AccountingParametersMovementsEdit',
    component: () =>
      import(
        '@/views/fics/accounting-parameters/accounting-parameters-movements/v1/edit/AccountingParametersMovementsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'AccountingParametersList',
        action: 'edit',
      },
    },
  },
]
