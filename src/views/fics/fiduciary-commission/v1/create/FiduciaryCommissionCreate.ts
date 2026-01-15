// Vue
import { ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IVariableCommission,
  IFiduciaryCommissionRequest,
} from '@/interfaces/customs/fics/FiduciaryCommission'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryCommissionStore } from '@/stores/fics/fiduciary-comission'

const useFiduciaryCommissionCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _createAction } = useFiduciaryCommissionStore('v1')

  const informationFormRef = ref()

  const headerProperties = {
    title: 'Crear comisión fiduciaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Comisión fiduciaria',
        route: 'FiduciaryCommissionList',
      },
      {
        label: 'Crear',
        route: 'FiduciaryCommissionCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    const data = informationFormRef.value?.getValues()

    const payload: IFiduciaryCommissionRequest = {
      code: data.code,
      type: data.type,
      description: data.description,
      liquidation_base: data.liquidation_base,
      rate_type: data.rate_type,
    }

    if (data.type === 1) {
      payload.fixed_rate_percentage = data.fixed_rate_percentage
    } else if (data.type === 2 && Array.isArray(data.variable_rates)) {
      payload.variable_rates = data.variable_rates.map(
        (item: IVariableCommission) => ({
          initial_balance: String(item.initial_balance),
          final_balance: String(item.final_balance),
          rate_percentage: item.rate_percentage,
        })
      )
    }

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('FiduciaryCommissionList', undefined, { reload: true })

  return {
    tabs,
    tabActive,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    handleSubmitForm,
    informationFormRef,
  }
}

export default useFiduciaryCommissionCreate
