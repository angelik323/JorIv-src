export default [
  {
    path: '/contabilidad/plantilla-de-reportes',
    name: 'ReportTemplatesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportTemplatesList',
      },
    },
    component: () =>
      import(
        '@/views/accounting/report-templates/v2/list/ReportTemplateList.vue'
      ),
  },
  {
    path: '/contabilidad/plantilla-de-reportes/crear',
    name: 'ReportTemplatesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportTemplatesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/report-templates/v2/create/ReportTemplateCreate.vue'
      ),
  },
  {
    path: '/contabilidad/plantilla-de-reportes/imagenes',
    name: 'ReportTemplateImages',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportTemplatesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounting/report-templates/v2/images/ReportTemplateImages.vue'
      ),
  },
  {
    path: '/contabilidad/plantilla-de-reportes/editar/:id',
    name: 'ReportTemplatesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportTemplatesList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounting/report-templates/v2/edit/ReportTemplateEdit.vue'
      ),
  },
  {
    path: '/contabilidad/plantilla-de-reportes/ver/:id',
    name: 'ReportTemplatesView',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'ReportTemplatesList',
        action: 'show',
      },
    },
    component: () =>
      import(
        '@/views/accounting/report-templates/v2/view/ReportTemplateView.vue'
      ),
  },
]
