import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { useMonetaryMarketOperationsStore } from '@/stores'
import {
  IEditOperationForm,
  IMoneyMarketTransactionRecord,
} from '@/interfaces/customs'

const useMonetaryMarketEdit = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getMoneyMarketOperation, _updateAction } =
    useMonetaryMarketOperationsStore('v1')

  const operationId = Number(route.params.id)

  const formRef = ref()
  const model = ref<IEditOperationForm>({
    user: '',
    operation_date: '',
    portfolio_code: '',
    portfolio_description: '',
    operation_number: '',
    start_date: '',
    days_number: null,
    end_date: '',
    counterparty: '',
    negotiation_value: 0,
    rate_value: 0,
    return_value: 0,
    modification_type: null,
    observation: '',
  })

  const headerProps = {
    title: 'Editar operación de mercado',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Operaciones de mercado', route: 'RegisterMonetaryMarketList' },
      {
        label: 'Editar operación',
        route: 'RegisterMonetaryMarketEdit',
        params: { id: operationId },
      },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(0)

  const loadOperation = async (): Promise<void> => {
    openMainLoader(true)

    const response: IMoneyMarketTransactionRecord | null =
      await _getMoneyMarketOperation(operationId)

    if (!response) {
      openMainLoader(false)
      return
    }

    model.value = {
      user: response.created_by_user ?? '',
      operation_date: response.operation_date ?? '',
      portfolio_code: response.investment_portfolio_code ?? '',
      portfolio_description: response.investment_portfolio_description ?? '',
      operation_number: String(response.operation_number ?? ''),
      start_date: response.start_date ?? '',
      days_number: response.number_days ?? 0,
      end_date: response.end_date ?? '',
      counterparty: response.counterparty ?? '',
      negotiation_value: Number(response.negotiation_value ?? 0),
      rate_value: Number(response.rate_value ?? 0),
      return_value: Number(response.return_value ?? 0),
      modification_type: null,
      observation: '',
    }

    openMainLoader(false)
  }

  const onUpdate = async (): Promise<void> => {
    const valid = await formRef.value?.validateForm?.()

    if (!valid) {
      return
    }

    const payload = formRef.value?.getFormData?.()

    const success = await _updateAction(operationId, payload)

    if (success) router.push({ name: 'RegisterMonetaryMarketList' })
  }

  onMounted(async () => {
    await loadOperation()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    formRef,
    model,
    onUpdate,
  }
}

export default useMonetaryMarketEdit
