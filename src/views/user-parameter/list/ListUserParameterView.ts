import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useResourceStore, useUserParametersStore, useLogin } from '@/stores'
import { storeToRefs } from 'pinia'
import { useMainLoader, useRouteValidator } from '@/composables'
import { login_types, default_yes_no } from '@/constants/resources'

export const useUserParamaterView = () => {
  const router = useRouter()
  const editFields = ref(false)
  const { data_parameters, success_update_parameters } = storeToRefs(
    useUserParametersStore('v1')
  )
  const { _getApiUserParameters, _setApiUserParameters } =
    useUserParametersStore('v1')
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const { _updateSessionTimeout } = useLogin()

  const formParameter = ref()

  const { options } = storeToRefs(useResourceStore('v1'))
  const alertModalRef = ref()

  const handleSave = async () => {
    const valid = await formParameter.value.validate()
    if (valid) {
      closeAlertModal()
      openMainLoader(true)

      await _setApiUserParameters()
      if (success_update_parameters) {
        if (data_parameters.value.session_timeout_minutes)
          _updateSessionTimeout(data_parameters.value.session_timeout_minutes)
        closeAlertModal()
        window.location.reload()
      }
      setTimeout(() => {
        openMainLoader(false)
        headerProps.editFields.value = false
      }, 1000)
    }
  }

  onMounted(() => {
    _getApiUserParameters()
  })

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea guardar la información?',
  })

  const openAlertModal = async () => {
    await alertModalRef.value.openModal()
  }
  const closeAlertModal = async () => {
    await alertModalRef.value.closeModal()
  }

  const validateForms = async () => {
    const valid = await formParameter.value.validate()
    if (valid) {
      openAlertModal()
    }
  }
  const getSelectedOption = computed(() => {
    const selected = headerProps.options.value.find(
      (option: { id: number }) => option.id === 1
    )
    return selected ? selected.value : 'Sin selección'
  })
  const headerProps = {
    title: 'Parámetros de usuarios',
    subtitle: '',
    breadcrumbs: [
      {
        label: 'Usuarios',
      },
      {
        label: 'Parámetros',
        route: 'UserParametersList',
      },
    ],
    showBackBtn: true,
    editFields,
    options,
  }

  const goToView = async (route: string, id?: number) => {
    await router.push({ name: route, params: { id } })
  }
  const handleEditFields = (opc: boolean) => {
    editFields.value = !opc
  }

  return {
    headerProps,
    goToView,
    handleEditFields,
    getSelectedOption,
    handleSave,
    validateForms,
    formParameter,
    alertModalRef,
    alertModalConfig,
    data_parameters,
    closeAlertModal,
    validateRouter,
    login_types,
    default_yes_no,
  }
}
