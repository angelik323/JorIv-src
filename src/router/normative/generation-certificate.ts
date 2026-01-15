export default [
  {
    path: '/normativo/generacion-certificado-gmf',
    name: 'GmfGroupList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'GmfGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/gmf/list/group/GmfGroupList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-gmf/detalles/:id',
    name: 'GmfDetailList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'GmfGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/gmf/list/detail/GmfDetailList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-gmf/crear/:id',
    name: 'GmfCertificateCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'GmfGroupList',
      // action: 'create'
      // },
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/gmf/create/GmfCertificateCreate.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado/ver/:id',
    name: 'GenerationCertificateView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'GmfGroupList',
      // action: 'show'
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/view/GenerationCertificateView.vue'
      ),
  },

  {
    path: '/normativo/generacion-certificado-apertura',
    name: 'OpeningGroupList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'OpeningGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/opening/list/group/OpeningGroupList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-apertura/detalles/:id',
    name: 'OpeningDetailList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'OpeningGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/opening/list/detail/OpeningDetailList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-apertura/crear/:id',
    name: 'OpeningCertificateCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'OpeningGroupList',
      // action: 'create'
      // },
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/opening/create/OpeningCertificateCreate.vue'
      ),
  },

  {
    path: '/normativo/generacion-certificado-retencion',
    name: 'RetentionGroupList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'RetentionGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/retention/list/group/RetentionGroupList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-retencion/detalles/:id',
    name: 'RetentionDetailList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'RetentionGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/retention/list/detail/RetentionDetailList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-retencion/crear/:id',
    name: 'RetentionCertificateCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'RetentionGroupList',
      // action: 'create'
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/retention/create/RetentionCertificateCreate.vue'
      ),
  },

  {
    path: '/normativo/generacion-certificado-participaciones',
    name: 'ParticipationGroupList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'ParticipationGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/participation/list/group/ParticipationGroupList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-participaciones/detalles/:id',
    name: 'ParticipationDetailList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'ParticipationGroupList',
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/participation/list/detail/ParticipationDetailList.vue'
      ),
  },
  {
    path: '/normativo/generacion-certificado-participaciones/crear/:id',
    name: 'ParticipationCertificateCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      //requiredValidRole: {
      // module: 'Normative',
      // view: 'ParticipationGroupList',
      // action: 'create'
      //},
    },
    component: () =>
      import(
        '@/views/normative/generation-certificate/participation/create/ParticipationCertificateCreate.vue'
      ),
  },
]
