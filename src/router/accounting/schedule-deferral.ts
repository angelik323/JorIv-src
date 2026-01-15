export default [
  {
    path: '/contabilidad/programar-diferidos',
    name: 'ScheduleDeferralList',
    component: () =>
      import(
        '@/views/accounting/schedule-deferral/v1/list/ScheduleDeferralList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ScheduleDeferralList',
      },
    },
  },
  {
    path: '/contabilidad/programar-diferidos/programar',
    name: 'ScheduleDeferralCreate',
    component: () =>
      import(
        '@/views/accounting/schedule-deferral/v1/create/ScheduleDeferralCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ScheduleDeferralList',
        action: 'create',
      },
    },
  },
  {
    path: '/contabilidad/programar-diferidos/editar/:id',
    name: 'ScheduleDeferralEdit',
    component: () =>
      import(
        '@/views/accounting/schedule-deferral/v1/edit/ScheduleDeferralEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ScheduleDeferralList',
        action: 'edit',
      },
    },
  },
  {
    path: '/contabilidad/programar-diferidos/:id',
    name: 'ScheduleDeferralView',
    component: () =>
      import(
        '@/views/accounting/schedule-deferral/v1/view/ScheduleDeferralView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ScheduleDeferralList',
        action: 'show',
      },
    },
  },
  {
    path: '/contabilidad/programar-diferidos/procesar',
    name: 'ProcessDeferredList',
    component: () =>
      import(
        '@/views/accounting/process-deferred/v1/list/ProcessDeferredList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
