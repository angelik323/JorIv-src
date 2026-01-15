import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useLogin as useLoginStore } from '@/stores'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { storeToRefs } from 'pinia'
import { checkDigit } from '@/utils'

const useLogin = () => {
  const $q = useQuasar()

  const router = useRouter()

  const { firstLogin, contador_sms } = storeToRefs(useLoginStore())
  const {
    _loginAction,
    _loginLdapAction,
    // _changePassword,
    _logoutAction,
    // _securityDataAction,
    // _recoveryPasswordAction,
    // _recoveryPasswordEmailAction,
    _startCountdownVerifySMSOTP,
    _restartCountdownVerifySMSOTP,
  } = useLoginStore()

  const { openMainLoader } = useMainLoader()

  const loginForm = ref()

  const changePasswordForm = ref()

  const recoveryPasswordForm = ref()

  const form = ref({
    email: '',
    password: '',
  })

  const formModal = ref({
    password: '',
    password_confirmation: '',
  })

  const formModalRecovery = ref({
    email: '',
    answer: '',
  })

  const formRecoveryEmail = ref(Array(6).fill(''))

  const modalProperties = ref({
    title: 'Cambio de contraseña',
    open: false,
    minWidth: '50%',
  })

  const modalPropertiesRecovery = ref({
    title: 'Olvidé mi contraseña',
    subtitle:
      'Para cambiar su contraseña por favor, ingrese su correo electrónico.',
    open: false,
    minWidth: '30%',
  })

  const clasTitleModal = computed(() =>
    $q.screen.width <= 607
      ? 'text-h6 text-weight-medium'
      : 'text-h5 text-weight-medium'
  )

  const showPassword = ref(false)

  const showPasswordModal = ref({
    pass: false,
    confirmation: false,
  })

  const security_question = ref(false)

  const noMethodAuth = ref(false)

  const reminder = ref('')

  const question = ref('')

  const login = async () => {
    openMainLoader(true)
    const success = await _loginAction(form.value)
    if (success) {
      if (!firstLogin.value) {
        router.push({ name: 'HomeView' })
      } else {
        router.push({ name: 'ChangePassword' })
        modalProperties.value.open = true
      }
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 2000)
  }

  const loginLdap = async () => {
    openMainLoader(true)
    const success = await _loginLdapAction({
      username: form.value.email,
      password: form.value.password,
    })

    if (success) {
      router.push({ name: 'HomeView' })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 2000)
  }

  const loginAction = async (ldap: boolean = false) => {
    loginForm.value.validate().then(async (isValid: boolean) => {
      if (isValid) {
        if (ldap) {
          loginLdap()
        } else {
          login()
        }
      }
    })
  }

  const changePasswordAction = async () => {
    changePasswordForm.value.validate().then(async (isValid: boolean) => {
      if (isValid) {
        openMainLoader(true)

        // const success = await _changePassword(formModal.value)
        // if (success) {
        //   closeModal()
        // }

        setTimeout(() => {
          openMainLoader(false)
        }, 2000)
      }
    })
  }

  const getDataSecurityAction = async () => {
    recoveryPasswordForm.value.validate().then(async (isValid: boolean) => {
      if (isValid) {
        openMainLoader(true)

        // const response = await _securityDataAction(
        //   formModalRecovery.value.email
        // )
        // if (response.success) {
        //   noMethodAuth.value = response.data.noMethodAuth
        //   security_question.value = !response.data.noMethodAuth
        //   reminder.value = response.data.reminder
        //   question.value = response.data.question

        //   if (response.data.noMethodAuth) {
        //     _restartCountdownVerifySMSOTP()
        //   }
        // }

        setTimeout(() => {
          openMainLoader(false)
        }, 2000)
      }
    })
  }

  const recoveryPasswordAction = async (_: boolean = false) => {
    recoveryPasswordForm.value.validate().then(async (isValid: boolean) => {
      if (isValid) {
        openMainLoader(true)
        // let response
        // if (code_email) {
        //   response = await _recoveryPasswordEmailAction({
        //     email: formModalRecovery.value.email,
        //     code: formRecoveryEmail.value.join(''),
        //   })
        // } else {
        //   response = await _recoveryPasswordAction({
        //     email: formModalRecovery.value.email,
        //     answer: formModalRecovery.value.answer,
        //   })
        // }

        // if (response.success) {
        //   security_question.value = false
        //   noMethodAuth.value = false
        //   modalPropertiesRecovery.value.open = false
        //   form.value.email = formModalRecovery.value.email
        //   form.value.password = response.password
        //   // login()
        // }

        setTimeout(() => {
          openMainLoader(false)
        }, 2000)
      }
    })
  }

  const closeModal = async () => {
    modalProperties.value.open = false
    openMainLoader(true)
    await _logoutAction()
    openMainLoader(false)
    await router.push({ name: 'LoginView' })
  }

  const closeModalRecovery = async () => {
    modalPropertiesRecovery.value.open = false
    noMethodAuth.value = false
    security_question.value = false
  }

  const handleKeyUp = (event: KeyboardEvent, index: number) => {
    const inputs = document.querySelectorAll('input')

    const inputsConGuionBajo = Array.from(inputs).filter((input) => {
      return input.placeholder === '_'
    })

    const currentInput = inputsConGuionBajo[index]
    const nextInput = inputsConGuionBajo[index + 1]

    if (event.key === 'Backspace' && currentInput.value === '') {
      if (index > 0) {
        inputsConGuionBajo[index - 1].focus()
      }
    } else if (currentInput.value.length === 1 && nextInput) {
      nextInput.focus()
    }
  }

  onMounted(() => {
    if (firstLogin.value) {
      modalProperties.value.open = true
    }
  })

  return {
    form,
    formModal,
    formRecoveryEmail,
    showPassword,
    modalProperties,
    modalPropertiesRecovery,
    clasTitleModal,
    loginForm,
    changePasswordForm,
    showPasswordModal,
    recoveryPasswordForm,
    security_question,
    noMethodAuth,
    formModalRecovery,
    reminder,
    question,
    contador_sms,

    // Methods
    loginAction,
    changePasswordAction,
    closeModal,
    closeModalRecovery,
    recoveryPasswordAction,
    getDataSecurityAction,
    handleKeyUp,
    checkDigit,
    _startCountdownVerifySMSOTP,
    _restartCountdownVerifySMSOTP,
  }
}

export default useLogin