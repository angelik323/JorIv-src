export default [
  {
    path: '/fics/registro-tipo-participacion',
    name: 'ParticipationTypeRegistrationList',
    component: () =>
      import(
        '@/views/fics/participation-type-registration/v1/list/ParticipationTypeRegistrationList.vue'
      ),
    meta: {
      requiresAuth: true,
      requiresFirstPasswordChanged: true,
      requiredValidRole: {
        module: 'Fics',
        view: 'ParticipationTypeRegistrationList',
      },
    },
  },
]
