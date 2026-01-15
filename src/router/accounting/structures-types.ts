export default [
  {
    path: '/tipos-estructura',
    name: 'StructureTypeList',
    component: () =>
      import(
        '@/views/accounting/structure-types/v1/list/StructureTypeList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'StructureTypeList',
      },
    },
  },
  {
    path: '/tipos-estructura/crear',
    name: 'StructureTypeCreate',
    component: () =>
      import(
        '@/views/accounting/structure-types/v1/create/StructureTypeCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'StructureTypeList',
        action: 'create',
      },
    },
  },
  {
    path: '/tipos-estructura/editar/:id',
    name: 'StructureTypeEdit',
    component: () =>
      import(
        '@/views/accounting/structure-types/v1/edit/StructureTypeEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Accounting',
        view: 'StructureTypeList',
        action: 'edit',
      },
    },
  },
]
