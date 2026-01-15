export default [
  {
    path: '/contratacion-derivada/consulta-general-de-contratos',
    name: 'GeneralContractInquiryList',
    component: () =>
      import(
        '@/views/derivative-contracting/general-contract-inquiry/v1/list/GeneralContractInquiryList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'GeneralContractInquiryList',
        action: 'list',
      },
    },
  },
  {
    path: '/contratacion-derivada/consulta-general-de-contratos/ver/:id',
    name: 'GeneralContractInquiryView',
    component: () =>
      import(
        '@/views/derivative-contracting/general-contract-inquiry/v1/view/GeneralContractInquiryView.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'DerivativeContracting',
        view: 'GeneralContractInquiryView',
        action: 'view',
      },
    },
  },
]
