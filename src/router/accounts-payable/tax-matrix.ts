export default [
  {
    path: '/cuentas-por-pagar/matriz-tributaria',
    name: 'TaxMatrixList',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
        module: 'AccountsPayable',
        view: 'TaxMatrixList',
        action: 'list',
      
    },
    component: () =>
      import(
        '@/views/accounts-payable/tax-matrix/v1/list/TaxMatrixList.vue'
      ),
  },

  {
    path: '/cuentas-por-pagar/matriz-tributaria/editar/:taxType?',
    name: 'TaxMatrixEdit',
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
        module: 'AccountsPayable',
        view: 'TaxMatrixList',
        action: 'edit',
      
    },
    component: () =>
      import(
        '@/views/accounts-payable/tax-matrix/v1/edit/TaxMatrixEdit.vue'
      ),
  },
]