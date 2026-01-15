// Vue - Vue Router
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IVariableCommission,
  IFiduciaryCommission,
  IFiduciaryCommissionRequest,
} from '@/interfaces/customs/fics/FiduciaryCommission'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryCommissionStore } from '@/stores/fics/fiduciary-comission'

const useFiduciaryCommissionEdit = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()

  const { _showAction, _updateAction } = useFiduciaryCommissionStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const initialData = ref<IFiduciaryCommission>({
    id: 0,
    code: '',
    type: 2,
    type_description: 0,
    liquidation_base: 'SFF - Saldo final fondo',
    liquidation_base_abv: '',
    rate_type: 'EF - Efectiva',
    rate_type_abv: '',
    fixed_rate_percentage: '',
    description: '',
    variable_rates: [],
  })

  const headerProperties = {
    title: 'Editar comisión fiduciaria',
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
        label: 'Editar',
        route: 'FiduciaryCommissionCreate',
      },
      {
        label: id,
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

  const loadData = async () => {
    openMainLoader(true)

    const success = await _showAction(Number(id))

    if (success) {
      initialData.value = success
      isLoaded.value = true
    }

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    const data = informationFormRef.value?.getValues()

    const payload: IFiduciaryCommissionRequest = {
      id: Number(id),
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

    const success = await _updateAction(payload)

    if (success) handleGoToList()

    setTimeout(() => openMainLoader(false), 1000)
  }

  const handleGoToList = () =>
    goToURL('FiduciaryCommissionList', undefined, { reload: true })

  onMounted(() => loadData())

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    tabActiveIdx,
    handleGoToList,
    headerProperties,
    handleSubmitForm,
    informationFormRef,
  }
}

export default useFiduciaryCommissionEdit
