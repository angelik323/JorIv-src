export default [
  {
    path: '/tesoreria/asignar-cifrado',
    name: 'AssignEncryptionList',
    component: () =>
      import(
        '@/views/treasury/assign-encryption/list/AssignEncryptionList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
  {
    path: '/tesoreria/asignar-cifrado/editar/:id',
    name: 'AssignEncryptionEdit',
    component: () =>
      import(
        '@/views/treasury/assign-encryption/edit/AssignEncryptionEdit.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
    },
  },
]
