import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  useResourceManagerStore,
  useRegisterCancellationParticipationFicsForeignStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const useRegisterCancellationParticipationFicsForeignCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const registerCancellationParticipationFicsStore =
    useRegisterCancellationParticipationFicsForeignStore('v1')
  const { headerPropsDefault, buildPayload } = storeToRefs(
    registerCancellationParticipationFicsStore
  )
  const {
    _createAction,
    _updateBasicData,
    _updateOperationData,
    _updateComplianceData,
    _resetFormData,
  } = registerCancellationParticipationFicsStore

  const keys = [
    'investment_portfolio',
    'emitter',
    'emitter_buyer',
    'administrators_codes',

    //Operation data
    'fic_participation_value_foreign',
    'class_portfolio',
    'currency_foreign',
    'operation_type',
    'isin_code_mnemonics',
  ]

  const basicDataFormRef = ref()
  const operationDataFormRef = ref()
  const complianceConditionsDataFormRef = ref()
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
      icon: defaultIconsLucide.chartLine,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'compliance_conditions_data',
      label: 'Condiciones de cumplimiento',
      icon: defaultIconsLucide.dollarSign,
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
    } else if (tabActive.value === 'operation_data') {
      return await operationDataFormRef.value?.validateForm()
    } else if (tabActive.value === 'compliance_conditions_data') {
      return await complianceConditionsDataFormRef.value?.validateForm()
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
    } else if (tabActive.value === 'compliance_conditions_data') {
      const data = complianceConditionsDataFormRef.value?.getValues()
      if (data) {
        _updateComplianceData(data)
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
    complianceConditionsDataFormRef,
    backTab,
    nextTab,
    handleSubmitForm,
  }
}

export default useRegisterCancellationParticipationFicsForeignCreate
