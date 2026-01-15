export default [
  {
    path: '/',
    name: 'LoginView',
    component: () => import('@/views/auth/login/v2/Login.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/verify-sms',
    name: 'SMSVerify',
    component: () => import('@/views/auth/verify-login/sms/SMSVerify.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/verify-otp',
    name: 'OTPVerify',
    component: () => import('@/views/auth/verify-login/otp/OTPVerify.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/change-password',
    name: 'ChangePassword',
    component: () => import('@/views/auth/login/v2/Login.vue'),
    meta: { requiresAuth: true, requiresFirstPasswordChanged: false },
  },
]
