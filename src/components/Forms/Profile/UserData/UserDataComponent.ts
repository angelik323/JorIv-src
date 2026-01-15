import { computed, ref } from 'vue'
import { useLogin } from '@/stores'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { useAlertModal, useAlert } from '@/composables'

// Images
import defaultImgConfirmation from '@/assets/images/alert-confirmation.jpg'

const useUserData = () => {
  const { showAlert } = useAlert()
  const { showAlertInformation } = useAlertModal()
  const { openMainLoader } = useMainLoader()
  const { loggedUser } = storeToRefs(useLogin())
  // const { _updateMyProfile } = useLogin()
  const models = ref({
    names: loggedUser.value?.user.name,
    lastnames: loggedUser.value?.user.last_name,
    document: loggedUser.value?.user.document,
    email: loggedUser.value?.user.email,
    phone: loggedUser.value?.user.phone,
  })

  const userDataForm = ref()

  const isModified = computed(() => {
    const user = loggedUser.value?.user
    if (!user) return false

    return (
      models.value.names !== user.name ||
      models.value.lastnames !== user.last_name ||
      models.value.document !== user.document ||
      models.value.email !== user.email ||
      models.value.phone !== user.phone
    )
  })

  const submitForm = async () => {
    openMainLoader(true)
    // await _updateMyProfile({
    //   name: models.value.names,
    //   last_name: models.value.lastnames,
    //   document: models.value.document,
    //   phone: models.value.phone,
    //   email: models.value.email,
    // })

    setTimeout(() => {
      openMainLoader(false)
    }, 2000)
  }

  const execConfirmation = async () => {
    if (!isModified.value) {
      return showAlert(
        'No se ha realizado algún cambio para actualizar el usuario',
        'error',
        undefined,
        4000
      )
    }
    const alertParams = {
      params_html: `<p class="modal__confirmation--text">Confirmación</p><p>¿Desea actualizar el perfil?</p>`,
      image_url: defaultImgConfirmation,
      confirm_button_text: 'Aceptar',
      cancel_button_text: 'Cancelar',
    }
    const confirm = await showAlertInformation(alertParams)

    if (confirm) {
      submitForm()
    }
  }

  return {
    models,
    userDataForm,
    isModified,

    // Methods
    submitForm,
    execConfirmation,
  }
}

export default useUserData
