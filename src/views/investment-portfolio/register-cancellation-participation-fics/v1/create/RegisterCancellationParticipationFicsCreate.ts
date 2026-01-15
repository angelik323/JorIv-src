import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useResourceManagerStore } from '@/stores'
import { useRegisterCancellationParticipationFicsStore } from '@/stores/investment-portfolio/register-cancellation-participation-fics'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useRegisterCancellationParticipationFicsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const registerCancellationParticipationFicsStore =
    useRegisterCancellationParticipationFicsStore('v1')
  const { headerPropsDefault, buildPayload } = storeToRefs(
    registerCancellationParticipationFicsStore
  )
  const {
    _createAction,
    _resetFormData,
    _updateBasicData,
    _updateOperationData,
  } = registerCancellationParticipationFicsStore

  const keys = [
    'investment_portfolio',
    'emitter',
    'emitter_buyer',
    'administrators_codes',
    'fic_participation_details',
    'class_portfolio',
    'operation_type',
    'paper_type_participation',
    'currency_local',
  ]

  const basicDataFormRef = ref()
  const operationDataFormRef = ref()
  const isLoaded = ref(false)

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'operation_data',
      label: 'Datos operación',
      icon: defaultIconsLucide.user,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    if (tabActive.value === 'basic_data') {
      return await basicDataFormRef.value?.validateForm()
    } else if (tabActive.value === 'emitter') {
      return await operationDataFormRef.value?.validateForm()
    }

    return true
  }

  const saveCurrentFormData = async () => {
    if (tabActive.value === 'basic_data') {
      const data = basicDataFormRef.value?.getValues()
      if (data) {
        _updateBasicData(data)
      }
    } else if (tabActive.value === 'operation_data') {
      const data = operationDataFormRef.value?.getValues()
      if (data) {
        _updateOperationData(data)
      }
    }
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    // Guardar datos del formulario actual antes de cambiar de tab
    await saveCurrentFormData()

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    await saveCurrentFormData()

    const payload = buildPayload.value

    openMainLoader(true)
    const success = await _createAction(payload)
    openMainLoader(false)

    if (!success) return

    basicDataFormRef.value?.resetForm()
    operationDataFormRef.value?.resetForm()
    _resetFormData()

    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name
  }

  const loadResources = async () => {
    openMainLoader(true)

    await _getResources({ investment_portfolio: keys })

    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  onMounted(() => loadResources())
  onBeforeUnmount(() => {
    keys.push('manual_unit_value')
    _resetKeys({ investment_portfolio: keys })
    _resetFormData()
  })

  // Watch para sincronizar cambios en tiempo real
  watch(tabActive, async (_, oldTab) => {
    if (oldTab) {
      await saveCurrentFormData()
    }
  })

  return {
    headerPropsDefault,
    defaultIconsLucide,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    operationDataFormRef,
    isLoaded,
    backTab,
    nextTab,
    handleSubmitForm,
  }
}

export default useRegisterCancellationParticipationFicsCreate
