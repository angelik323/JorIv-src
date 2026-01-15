export default [
  {
    path: '/tesoreria/registrar-ingresos-individuales',
    name: 'RecordIndividualIncomeList',
    component: () =>
      import(
        '@/views/treasury/record-individual-income/v1/list/RecordIndividualIncomeList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'RecordIndividualIncomeList',
      },
    },
  },
  {
    path: '/tesoreria/registrar-ingresos-individuales/crear',
    name: 'RecordIndividualIncomeCreate',
    component: () =>
      import(
        '@/views/treasury/record-individual-income/v1/create/RecordIndividualIncomeCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'RecordIndividualIncomeList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/registrar-ingresos-individuales/editar/:id',
    name: 'RecordIndividualIncomeEdit',
    component: () =>
      import(
        '@/views/treasury/record-individual-income/v1/edit/RecordIndividualIncomeEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'RecordIndividualIncomeList',
        action: 'edit',
      },
    },
  },
]
