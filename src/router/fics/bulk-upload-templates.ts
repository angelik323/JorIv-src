export default [
  {
    path: '/fics/plantillas-de-cargues-masivos',
    name: 'BulkUploadTemplatesList',
    component: () =>
      import(
        '@/views/fics/bulk-upload-templates/v1/list/BulkUploadTemplatesList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'BulkUploadTemplatesList',
      },
    },
  },
  {
    path: '/fics/plantillas-de-cargues-masivos/crear',
    name: 'BulkUploadTemplatesCreate',
    component: () =>
      import(
        '@/views/fics/bulk-upload-templates/v1/create/BulkUploadTemplatesCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'BulkUploadTemplatesList',
        action: 'create',
      },
    },
  },
  {
    path: '/fics/plantillas-de-cargues-masivos/editar/:id',
    name: 'BulkUploadTemplatesEdit',
    component: () =>
      import(
        '@/views/fics/bulk-upload-templates/v1/edit/BulkUploadTemplatesEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'BulkUploadTemplatesList',
        action: 'edit',
      },
    },
  },
  {
    path: '/fics/plantillas-de-cargues-masivos/ver/:id',
    name: 'BulkUploadTemplatesView',
    component: () =>
      import(
        '@/views/fics/bulk-upload-templates/v1/view/BulkUploadTemplatesView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'BulkUploadTemplatesList',
        action: 'show',
      },
    },
  },
]
