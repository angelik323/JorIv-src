export default [
  {
    path: '/normativo/generacion-archivos',
    name: 'FormatGenerationList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // Comentado hasta que se creen los permisos en back
      // requiredValidRole: {
      //   module: 'Normative',
      //   view: 'FormatGenerationList',
      // },
    },
    component: () =>
      import(
        '@/views/normative/format-generation/v1/list/FormatGenerationList.vue'
      ),
  },
  {
    path: '/normativo/generacion-archivos/crear',
    name: 'FormatGenerationCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      // requiredValidRole: {
      //   module: 'Normative',
      //   view: 'FormatGenerationList',
      //   action: 'create',
      // },
    },
    component: () =>
      import(
        '@/views/normative/format-generation/v1/create/FormatGenerationCreate.vue'
      ),
  },
]
