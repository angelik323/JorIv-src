export default [
  {
    path: '/contabilidad/rangos-para-diferidos',
    name: 'RangesForDeferredList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'RangesForDeferredList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/ranges-for-deferred/v1/list/RangesForDeferredList.vue'
      ),
  },
  {
    path: '/contabilidad/rangos-para-diferidos/crear',
    name: 'RangesForDeferredCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'RangesForDeferredList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/ranges-for-deferred/v1/create/RangesForDeferredCreate.vue'
      ),
  },
  {
    path: '/contabilidad/rangos-para-diferidos/editar/:id',
    name: 'RangesForDeferredEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'RangesForDeferredList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounting/ranges-for-deferred/v1/edit/RangesForDeferredEdit.vue'
      ),
  },
  {
    path: '/contabilidad/rangos-para-diferidos/ver/:id',
    name: 'RangesForDeferredView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'RangesForDeferredList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounting/ranges-for-deferred/v1/view/RangesForDeferredView.vue'
      ),
  },
]
