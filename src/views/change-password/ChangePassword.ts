import { ITabs } from '@/interfaces/global'
import { defaultIcons, generatePassword, copyToClipboard } from '@/utils'
import { ref } from 'vue'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// Images
import defaultImgConfirmation from '@/assets/images/alert-confirmation.jpg'

// Composables
import { useAlertModal } from '@/composables'

// Stores
// import { useLogin } from '@/stores'

const useChangePassword = () => {
  const { showAlertInformation } = useAlertModal()
  const { openMainLoader } = useMainLoader()
  // const { _changePassword } = useLogin()

  const headerProps = ref({
    breadcrumb: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cambiar contraseña',
        route: 'ChangePassword',
      },
    ],
  })

  const tabs = ref<ITabs[]>([
    {
      name: 'cambiar_contrasena',
      label: 'Cambiar contraseña',
      icon: defaultIcons.key,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const models = ref({
    new_password: '',
    password_confirmation: '',
    password_suggestion: '',
  })

  const propsModalSuggestionPassword = ref({
    open: false,
  })

  const propsModalHelp = ref({
    open: false,
  })

  const helpPolicyPassword = ref<string[]>([
    'a. Longitud de contraseña como mínimo 8 caracteres.',
    'b. Caractéres numéricos como mínimo 2 números.',
    'c. Caracteres de símbolos como mínimo 1 carácter especial.',
    'd. Letras mayúsculas como mínimo 1 letra mayúscula.',
    'e. Letras minúsculas como mínimo 1 letra minúscula.',
  ])

  const changePasswordForm = ref()

  const suggestPassword = () => {
    const passwordSuggested = generatePassword()

    models.value.password_suggestion = ''

    models.value.password_suggestion = passwordSuggested
  }

  const execConfirmation = async () => {
    changePasswordForm.value.validate().then(async (success: boolean) => {
      if (!success) {
        return
      }

      const alertParams = {
        params_html: `<p class="modal__confirmation--text">Confirmación</p><p>¿Desea cambiar su contraseña?</p>`,
        image_url: defaultImgConfirmation,
        confirm_button_text: 'Aceptar',
        cancel_button_text: 'Cancelar',
      }
      const confirm = await showAlertInformation(alertParams)

      if (confirm) {
        submitForm()
      }
    })
  }
  const submitForm = async () => {
    openMainLoader(true)

    // const success = await _changePassword({
    //   password: models.value.new_password,
    //   password_confirmation: models.value.password_confirmation,
    // })

    // if (success) {
    models.value.new_password = ''
    models.value.password_confirmation = ''

    setTimeout(() => {
      changePasswordForm.value.resetValidation()
    }, 500)
    // }

    setTimeout(() => {
      openMainLoader(false)
    }, 2000)
  }

  return {
    models,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    propsModalSuggestionPassword,
    propsModalHelp,
    helpPolicyPassword,
    changePasswordForm,

    // Methods
    suggestPassword,
    execConfirmation,
    copy: (text: string) => {
      copyToClipboard(text)
    },
  }
}

export default useChangePassword
