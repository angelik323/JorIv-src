export default [
  {
    path: '/negocios-fiduciarios/desistimientos',
    name: 'DiscontinuancesList',
    component: () =>
      import(
        '@/views/trust-business/discontinuances/v1/list/DiscontinuancesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DiscontinuancesList',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/desistimientos/crear',
    name: 'DiscontinuancesCreate',
    component: () =>
      import(
        '@/views/trust-business/discontinuances/v1/create/DiscontinuancesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DiscontinuancesList',
        action: 'create',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/desistimientos/editar/:id',
    name: 'DiscontinuancesEdit',
    component: () =>
      import(
        '@/views/trust-business/discontinuances/v1/edit/DiscontinuancesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DiscontinuancesList',
        action: 'show',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/desistimientos/ver/:id',
    name: 'DiscontinuancesView',
    component: () =>
      import(
        '@/views/trust-business/discontinuances/v1/view/DiscontinuancesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DiscontinuancesList',
        action: 'show',
      },
    },
  },
  {
    path: '/negocios-fiduciarios/desistimientos/autorizar/:id',
    name: 'DiscontinuancesAuthorize',
    component: () =>
      import(
        '@/views/trust-business/discontinuances/v1/authorize/DiscontinuancesAuthorize.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'BusinessTrust',
        view: 'DiscontinuancesList',
        action: 'edit',
      },
    },
  },
]
