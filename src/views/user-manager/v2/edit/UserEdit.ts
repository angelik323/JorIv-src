import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
// Composables & utils:
import { useAlertModal, useMainLoader, useAlert } from '@/composables'
// Interfaces:
import { IShowAlertInformation } from '@/interfaces/global'
// Stores:
import { useUserModuleStore, useResourceStore } from '@/stores'
// Assets:
import imageUrl from '@/assets/images/icons/confirmation_icon.svg'

export const useEditUserView = () => {
  // Utils
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { showAlertInformationNoDescription } = useAlertModal()
  // Stores
  const { _getResourcesUsers } = useResourceStore('v1')
  const { _getUserById, _updateUser } = useUserModuleStore('v1')
  const { user_data, user_form_data } = storeToRefs(useUserModuleStore('v1'))

  // Variables
  const id = ref()
  const userFormRef = ref()

  const headerProps = reactive({
    title: 'Edición de usuarios',
    subtitle: '',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Usuarios',
        route: 'ListUserView',
      },
      {
        label: 'Edición de usuarios',
      },
    ],
    showBackBtn: true,
  })

  const setDefaultValues = () => {
    user_data.value = null
  }

  const handleEditUser = async () => {
    const isSuccessForm = await userFormRef.value?.validateForm()
    if (isSuccessForm) await showSaveInformationAlert()
    else showAlert('Diligencie correctamente la información.', 'error')
  }

  const showSaveInformationAlert = async () => {
    const alertParams: IShowAlertInformation = {
      image_url: imageUrl,
      params_html: `<br>¿Desea guardar la información?<br>`,
      confirm_button_text: 'Guardar',
      cancel_button_text: 'Cancelar',
    }
    const actionAccept = await showAlertInformationNoDescription(alertParams)
    if (actionAccept) {
      await submit()
    }
  }

  const submit = async () => {
    if (!user_form_data.value) return

    openMainLoader(true)
    const response = await _updateUser(user_form_data.value, id.value)

    if (response.success) {
      user_form_data.value = null
      goToView('ListUserView')
    }
    openMainLoader(false)
  }

  const goToView = async (route: string, id?: number) => {
    await router.push({ name: route, params: { id } })
  }

  const getUser = async () => {
    await _getUserById(id.value)
  }

  const getSelectResources = async () => {
    await _getResourcesUsers('keys[]=document_types_user')
    await _getResourcesUsers('keys[]=roles')
  }

  onMounted(async () => {
    openMainLoader(true)
    id.value = route.params.id
    setDefaultValues()
    await getSelectResources()
    await getUser()
    openMainLoader(false)
  })

  onUnmounted(() => {
    setDefaultValues()
  })

  return {
    headerProps,
    userFormRef,

    // Methods
    goToView,
    handleEditUser,
  }
}
