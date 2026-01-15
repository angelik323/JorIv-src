export default [
  // Listado
  {
    path: '/clientes',
    name: 'ClientsList',
    component: () => import('@/views/clients/v2/list/ClientList.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
      },
    },
  },

  // Persona jurídica
  {
    path: '/clientes/persona-juridica/crear',
    name: 'LegalEntity',
    component: () =>
      import('@/views/clients/v1/create/legal-person/LegalPersonCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'create',
      },
    },
  },
  {
    path: '/clientes/persona-juridica/editar/:id',
    name: 'LegalPersonEdit',
    component: () =>
      import('@/views/clients/v1/edit/legal-person/LegalPersonEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/clientes/persona-juridica/ver/:id',
    name: 'LegalPersonView',
    component: () =>
      import('@/views/clients/v1/read/legal-person/LegalPersonRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'show',
      },
    },
  },

  // Persona natural
  {
    path: '/clientes/persona-natural/crear',
    name: 'NaturalPersonCreate',
    component: () =>
      import(
        '@/views/clients/v1/create/natural-person/NaturalPersonCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'create',
      },
    },
  },
  {
    path: '/clientes/persona-natural/editar/:id',
    name: 'NaturalPersonEdit',
    component: () =>
      import('@/views/clients/v1/edit/natural-person/NaturalPersonEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/clientes/persona-natural/ver/:id',
    name: 'NaturePersonView',
    component: () =>
      import('@/views/clients/v1/read/natural-person/NaturalPersonRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'show',
      },
    },
  },

  // Fideicomiso
  {
    path: '/clientes/fideicomitente/crear',
    name: 'TrustorPersonCreate',
    component: () =>
      import(
        '@/views/clients/trustor-person/v1/create/TrustorPersonCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'create',
      },
    },
  },
  {
    path: '/clientes/fideicomitente/ver/:id',
    name: 'TrustorPersonView',
    component: () =>
      import('@/views/clients/trustor-person/v1/read/TrustorPersonView.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'show',
      },
    },
  },
  {
    path: '/clientes/fideicomitente/editar/:id',
    name: 'TrustorPersonUpdate',
    component: () =>
      import(
        '@/views/clients/trustor-person/v1/update/TrustorPersonUpdate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'edit',
      },
    },
  },

  // TODO: Indirecto queda pendinte de refatorizacion
  // Persona jurídica
  {
    path: '/clientes/v2/persona-juridica/crear',
    name: 'LegalEntityV2',
    component: () =>
      import('@/views/clients/v2/create/legal-person/LegalPersonCreate.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'create',
      },
    },
  },
  {
    path: '/clientes/v2/persona-juridica/editar/:id',
    name: 'LegalPersonEditV2',
    component: () =>
      import('@/views/clients/v2/edit/legal-person/LegalPersonEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/clientes/v2/persona-juridica/ver/:id',
    name: 'LegalPersonViewV2',
    component: () =>
      import('@/views/clients/v2/read/legal-person/LegalPersonRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'show',
      },
    },
  },

  // Persona natural
  {
    path: '/clientes/v2/persona-natural/crear',
    name: 'NaturalPersonCreateV2',
    component: () =>
      import(
        '@/views/clients/v2/create/natural-person/NaturalPersonCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'create',
      },
    },
  },
  {
    path: '/clientes/v2/persona-natural/editar/:id',
    name: 'NaturalPersonEditV2',
    component: () =>
      import('@/views/clients/v2/edit/natural-person/NaturalPersonEdit.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'edit',
      },
    },
  },
  {
    path: '/clientes/v2/persona-natural/ver/:id',
    name: 'NaturalPersonViewV2',
    component: () =>
      import('@/views/clients/v2/read/natural-person/NaturalPersonRead.vue'),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Clients',
        view: 'ClientsList',
        action: 'show',
      },
    },
  },
]
