export default [
  {
    path: '/parametros-cierre-periodo',
    name: 'PeriodClosureParameterList',
    component: () =>
      import(
        '@/views/accounting/period-closure-parameter/v2/list/PeriodClosureParameterList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PeriodClosureParameterList',
      },
    },
  },
  {
    path: '/parametros-cierre-periodo/crear',
    name: 'PeriodClosureParameterCreate',
    component: () =>
      import(
        '@/views/accounting/period-closure-parameter/v2/create/PeriodClosureParameterCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PeriodClosureParameterList',
        action: 'create',
      },
    },
  },
  {
    path: '/parametros-cierre-periodo/editar/:id',
    name: 'PeriodClosureParameterEdit',
    component: () =>
      import(
        '@/views/accounting/period-closure-parameter/v2/edit/PeriodClosureParameterEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PeriodClosureParameterList',
        action: 'edit',
      },
    },
  },
  {
    path: '/parametros-cierre-periodo/:id',
    name: 'PeriodClosureParameterView',
    component: () =>
      import(
        '@/views/accounting/period-closure-parameter/v2/view/PeriodClosureParameterView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'PeriodClosureParameterList',
        action: 'show',
      },
    },
  },
]
