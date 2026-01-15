export default [
  {
    path: '/cuentas-por-pagar/actividades-ica',
    name: 'IcaActivitiesList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'IcaActivitiesList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/ica-activities/v1/list/IcaActivitiesList.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/actividades-ica/crear',
    name: 'IcaActivitiesCreate',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'IcaActivitiesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/ica-activities/v1/create/IcaActivitiesCreate.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/actividades-ica/importar',
    name: 'IcaActivitiesImport',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'IcaActivitiesList',
        action: 'create',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/ica-activities/v1/import/IcaActivitiesImport.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/actividades-ica/editar/:id',
    name: 'IcaActivitiesEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'IcaActivitiesList',
        action: 'edit',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/ica-activities/v1/edit/IcaActivitiesEdit.vue'
      ),
  },
  {
    path: '/cuentas-por-pagar/relaciones-ciudad-tercero',
    name: 'IcaRelationList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'AccountsPayable',
        view: 'IcaActivitiesList',
        action: 'list',
      },
    },
    component: () =>
      import(
        '@/views/accounts-payable/ica-activities/v1/list/IcaRelationList.vue'
      ),
  },
]
