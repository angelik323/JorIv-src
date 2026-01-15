export default [
  {
    path: '/facturacion-cartera/debito-automatico',
    name: 'AutomaticDebitList',
    component: () =>
      import(
        '@/views/billing-portfolio/automatic-debit-settings/v1/list/AutomaticDebitSettingsList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'AutomaticDebitList',
        action: 'list',
      },
    },
  },
  {
    path: '/facturacion-cartera/debito-automatico/crear',
    name: 'AutomaticDebitCreate',
    component: () =>
      import(
        '@/views/billing-portfolio/automatic-debit-settings/v1/create/AutomaticDebitSettingsCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'AutomaticDebitList',
        action: 'create',
      },
    },
  },
  {
    path: '/facturacion-cartera/debito-automatico/editar/:id',
    name: 'AutomaticDebitEdit',
    component: () =>
      import(
        '@/views/billing-portfolio/automatic-debit-settings/v1/edit/AutomaticDebitSettingsEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'AutomaticDebitList',
        action: 'edit',
      },
    },
  },
  {
    path: '/facturacion-cartera/debito-automatico/ver/:id',
    name: 'AutomaticDebitView',
    component: () =>
      import(
        '@/views/billing-portfolio/automatic-debit-settings/v1/view/AutomaticDebitSettingsView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BillingCollection',
        view: 'AutomaticDebitList',
        action: 'show',
      },
    },
  },
]
