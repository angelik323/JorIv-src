export default [
  {
    path: '/tesoreria/registrar-egresos-individuales',
    name: 'RecordIndividualExpensesList',
    component: () =>
      import(
        '@/views/treasury/record-individual-expenses/v1/list/RecordIndividualExpensesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'RecordIndividualExpensesList',
      },
    },
  },
  {
    path: '/tesoreria/registrar-egresos-individuales/crear',
    name: 'RecordIndividualExpensesCreate',
    component: () =>
      import(
        '@/views/treasury/record-individual-expenses/v1/create/RecordIndividualExpensesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'RecordIndividualExpensesList',
        action: 'create',
      },
    },
  },
  {
    path: '/tesoreria/registrar-egresos-individuales/editar/:id',
    name: 'RecordIndividualExpensesEdit',
    component: () =>
      import(
        '@/views/treasury/record-individual-expenses/v1/edit/RecordIndividualExpensesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Treasury',
        view: 'RecordIndividualExpensesList',
        action: 'edit',
      },
    },
  },
]
