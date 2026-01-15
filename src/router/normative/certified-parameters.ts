export default [
  {
    path: '/normativo/parametros-certificados',
    name: 'CertifiedParametersList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Normative',
        view: 'CertifiedParametersList',
      },
    },
    component: () =>
      import(
        '@/views/normative/certified-parameters/v1/list/CertifiedParametersList.vue'
      ),
  },
  {
    path: '/normativo/parametros-certificados/crear',
    name: 'CertifiedParametersCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Normative',
        view: 'CertifiedParametersList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/normative/certified-parameters/v1/create/CertifiedParametersCreate.vue'
      ),
  },
  {
    path: '/normativo/parametros-certificados/editar/:id',
    name: 'CertifiedParametersEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Normative',
        view: 'CertifiedParametersList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/normative/certified-parameters/v1/edit/CertifiedParametersEdit.vue'
      ),
  },
  {
    path: '/normativo/parametros-certificados/ver/:id',
    name: 'CertifiedParametersView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Normative',
        view: 'CertifiedParametersList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/normative/certified-parameters/v1/view/CertifiedParametersView.vue'
      ),
  },
]
