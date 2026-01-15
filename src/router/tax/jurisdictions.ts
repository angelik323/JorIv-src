export default [
  {
    path: '/tributario/jurisdicciones',
    name: 'JurisdictionsList',
    component: () =>
      import('@/views/tax/jurisdictions/v1/list/JurisdictionList.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'JurisdictionsList',
      },
    },
  },
  {
    path: '/tributario/jurisdicciones/crear',
    name: 'JurisdictionCreate',
    component: () =>
      import('@/views/tax/jurisdictions/v1/create/JurisdictionCreate.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'JurisdictionsList',
        action: 'create',
      },
    },
  },
  {
    path: '/tributario/jurisdicciones/editar/:id',
    name: 'JurisdictionEdit',
    component: () =>
      import('@/views/tax/jurisdictions/v1/edit/JurisdictionEdit.vue'),
    meta: {
      requiresAdmin: true,
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Tax',
        view: 'JurisdictionsList',
        action: 'edit',
      },
    },
  },
]
