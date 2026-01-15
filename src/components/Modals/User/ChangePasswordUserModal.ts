import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import { useAlert } from '@/composables'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'
import { generatePassword } from '@/utils'

export const useChangePasswordUserModal = (props: any, emit: Function) => {
  const { changeUserPassword } = useUserStore()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()

  const isOpenModal = ref<boolean>()
  const newPassword = ref<string>()
  const passwordConfirmation = ref<string>()

  const showPassword = ref<boolean>(true)
  const showPasswordConfirmation = ref<boolean>(true)

  const handleCancelButton = () => {
    isOpenModal.value = false
    emit('close')
  }

  const handleChangeUserPassword = async () => {
    handleCancelButton()
    openMainLoader(true)
    const response = await changeUserPassword(
      {
        password: newPassword.value,
        password_confirmation: passwordConfirmation.value,
      },
      props.userId
    )
    if (response.success) {
      showAlert(response.message, 'success')
    }
    openMainLoader(false)
  }

  const suggestPassword = () => {
    const passwordSuggested = generatePassword()

    if (newPassword.value) newPassword.value = ''
    if (passwordConfirmation.value) passwordConfirmation.value = ''

    newPassword.value = passwordSuggested
    passwordConfirmation.value = passwordSuggested
  }

  onMounted(() => {
    isOpenModal.value = props.showModal
    showPassword.value = false
    showPasswordConfirmation.value = false
    newPassword.value = ''
  })

  return {
    // Variables:
    isOpenModal,
    newPassword,
    passwordConfirmation,
    showPassword,
    showPasswordConfirmation,

    // Methods:
    handleCancelButton,
    handleChangeUserPassword,
    suggestPassword,
  }
}
