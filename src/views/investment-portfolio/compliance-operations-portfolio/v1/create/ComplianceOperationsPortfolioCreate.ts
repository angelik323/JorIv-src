import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { IComplianceOperationsPortfolioForm } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import {
  useComplianceOperationsPortfolioStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const useComplianceOperationsPortfolioCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const { headerPropsDefault } = storeToRefs(
    useComplianceOperationsPortfolioStore('v1')
  )
  const { _createComplianceOperationsPortfolio } =
    useComplianceOperationsPortfolioStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear cumplimiento operaciones portafolio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear',
      },
    ],
  }

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
  ])

  const basicDataFormRef = ref()

  const tabActive = ref('')
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    if (tabActive.value === 'basic_data') {
      return await basicDataFormRef.value?.validateForm()
    }

    return true
  }

  const keys = {
    investment_portfolio: ['operation_compliance_statuses'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    tabActive.value = tabs.value[0].name
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  const onSubmit = async () => {
    if (!(await validateForms())) return

    const payload: IComplianceOperationsPortfolioForm =
      basicDataFormRef.value?.getValues()
    if (payload.instruction_slip_ids.length === 0) {
      showAlert('Debe seleccionar al menos una operación para cumplir', 'error')
      return
    }

    openMainLoader(true)
    if (await _createComplianceOperationsPortfolio(payload)) {
      goToURL('ComplianceOperationsPortfolioList')
    }
    openMainLoader(false)
  }

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    goToURL,
    onSubmit,
  }
}

export default useComplianceOperationsPortfolioCreate
