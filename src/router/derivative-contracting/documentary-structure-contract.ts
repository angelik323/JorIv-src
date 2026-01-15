export default [
  {
    path: '/contratacion-derivada/estructura-documental-contrato',
    name: 'DocumentaryStructureContractList',
    component: () =>
      import(
        '@/views/derivative-contracting/documentary-structure-contract/v1/list/DocumentaryStructureContractList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DocumentaryStructureContractList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/estructura-documental-contrato/crear',
    name: 'DocumentaryStructureContractCreate',
    component: () =>
      import(
        '@/views/derivative-contracting/documentary-structure-contract/v1/create/DocumentaryStructureContractCreate.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DocumentaryStructureContractList',
        action: 'create',
      },
    },
  },
  {
    path: '/contratacion-derivada/estructura-documental-contrato/editar/:id',
    name: 'DocumentaryStructureContractEdit',
    component: () =>
      import(
        '@/views/derivative-contracting/documentary-structure-contract/v1/edit/DocumentaryStructureContractEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'DocumentaryStructureContractList',
        action: 'edit',
      },
    },
  },
]
