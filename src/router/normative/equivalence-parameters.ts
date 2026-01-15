export default [
  {
    path: '/normativo/parametros-equivalencias',
    name: 'EquivalenceParametersList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // Comentado hasta que se creen los permisos en back
      // requiredValidRole: {
      //   module: 'Normative',
      //   view: 'EquivalenceParametersList',
      // },
    },
    component: () =>
      import(
        '@/views/normative/equivalence-parameters/v1/list/EquivalenceParametersList.vue'
      ),
  },
  {
    path: '/normativo/parametros-equivalencias/crear',
    name: 'EquivalenceParametersCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // requiredValidRole: {
      //   module: 'Normative',
      //   view: 'EquivalenceParametersList',
      //   action: 'create',
      // },
    },
    component: () =>
      import(
        '@/views/normative/equivalence-parameters/v1/create/EquivalenceParametersCreate.vue'
      ),
  },
  {
    path: '/normativo/parametros-equivalencias/editar/:id',
    name: 'EquivalenceParametersEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // requiredValidRole: {
      //   module: 'Normative',
      //   view: 'EquivalenceParametersList',
      //   action: 'edit',
      // },
    },
    component: () =>
      import(
        '@/views/normative/equivalence-parameters/v1/edit/EquivalenceParametersEdit.vue'
      ),
  },
]
