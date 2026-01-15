export default [
  {
    path: '/contabilidad/reexpresion-moneda-extranjera',
    name: 'AccountingRestatementList',
    component: () =>
      import(
        '@/views/accounting/accounting-restatement/v2/list/ExchangeDifferenceRestatementList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingRestatementList',
      },
    },
  },
  {
    path: '/contabilidad/reexpresion-moneda-extranjera/procesar',
    name: 'ExchangeDifferenceRestatementCreate',
    component: () =>
      import(
        '@/views/accounting/accounting-restatement/v2/create/ExchangeDifferenceRestatementCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingRestatementList',
        action: 'process',
      },
    },
  },
  {
    path: '/contabilidad/reexpresion-moneda-extranjera/ver/:id',
    name: 'ExchangeDifferenceRestatementView',
    component: () =>
      import(
        '@/views/accounting/accounting-restatement/v2/view/ExchangeDifferenceRestatementView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingRestatementList',
        action: 'show',
      },
    },
  },
  {
    path: '/contabilidad/reexpresion-moneda-extranjera/deshacer',
    name: 'ExchangeDifferenceRestatementUndo',
    component: () =>
      import(
        '@/views/accounting/accounting-restatement/v2/undo/ExchangeDifferenceRestatementUndo.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingRestatementList',
        action: 'undo',
      },
    },
  },
  {
    path: '/contabilidad/reexpresion-moneda-extranjera/novedades/:id',
    name: 'ExchangeDifferenceRestatementDetail',
    component: () =>
      import(
        '@/views/accounting/accounting-restatement/v2/detail/ExchangeDifferenceRestatementDetail.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'AccountingRestatementList',
        action: 'show',
      },
    },
  },
]
