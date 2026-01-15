import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  IRepoInformationForm,
  IRegisterRepoPayload,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useMonetaryMarketOperationsStore,
} from '@/stores'

const useOperationReposCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const { _createRepoOperation } = useMonetaryMarketOperationsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const warrantyFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'operation_type_monetary_market',
    'list_counterparty_associated_trader',
    'currency_local',
    'compensation_systems',
    'paper_type',
    'operation_type',
    'issuer_counterparty_local_currency',
    'isin_codes_mnemonics_portfolio',
    'issuer_deposit',
    'paper_type_encompass_and_division',
  ]

  const headerProperties = {
    title: 'Crear operación repo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Operaciones de mercado', route: 'OperationReposList' },
      { label: 'Repos', route: 'OperationReposList' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
    {
      name: 'warranty',
      label: 'Garantía',
      icon: defaultIconsLucide.fileWithList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const position = ref<'Activo' | 'Pasivo'>('Activo')

  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )

  const loadResources = async () => {
    openMainLoader(true)
    await _getResources({ investment_portfolio: keys })
    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const validateForms = async (): Promise<boolean> => {
    if (tabActive.value === 'basic-data') {
      return await informationFormRef.value?.validateForm()
    } else if (tabActive.value === 'warranty') {
      return await warrantyFormRef.value?.validateForm()
    }
    return true
  }

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return
    const nextIdx = tabActiveIdx.value + 1
    const nextName = filteredTabs.value[nextIdx]?.name
    tabActiveIdx.value = nextIdx
    tabActive.value = nextName
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const informationData =
      informationFormRef.value?.getValues() as IRepoInformationForm
    const warrantyData = warrantyFormRef.value?.getValues?.() ?? null
    if (!informationData) return

    const payload: IRegisterRepoPayload = {
      operation_date: informationData.operation_date,
      investment_portfolio_id: Number(
        informationData.investment_portfolio_id ?? 0
      ),
      repo: informationData.repo ?? '',
      repo_type: informationData.repo_type ?? '',
      paper_type_id: Number(informationData.paper_id ?? 0),
      operation_type_id: Number(informationData.operation_type_id ?? 0),
      start_date: informationData.start_date,
      number_days: Number(informationData.days_number ?? 0),
      end_date: informationData.end_date,
      agreed_rate: Number(informationData.rate_value ?? 0),
      rate_class: informationData.rate_class ?? '',
      base_days: String(informationData.days_base ?? ''),
      face_value: Number(informationData.nominal_value ?? 0),
      counterparty_id: Number(informationData.counterparty_id ?? 0),
      currency_id: Number(informationData.currency_id ?? 1),
      folio: Number(informationData.folio ?? 0),
      compensation_system: informationData.compensation_system ?? '',
      guarantee_value: Number(informationData.warranty_value ?? 0),
      guarantee_percentage: Number(informationData.warranty_percentage ?? 0),
      return_value: Number(informationData.return_value ?? 0),
      repo_warranty: warrantyData
        ? [
            {
              title_id: Number(warrantyData.title_id),
              issuer_id: Number(warrantyData.issuer_id),
              deposit_id: Number(warrantyData.deposit_id),
              isin_code_id: Number(warrantyData.isin_code_id ?? 0),
              paper_type_id: Number(warrantyData.paper_type_id ?? 0),
              currency_id: warrantyData.currency_id
                ? Number(warrantyData.currency_id)
                : 1,
              market_value: Number(warrantyData.market_value ?? 0),
            },
          ]
        : [],
    }

    openMainLoader(true)
    const success = await _createRepoOperation(payload)
    openMainLoader(false)

    if (!success) return

    informationFormRef.value?.resetForm?.()
    warrantyFormRef.value?.resetForm?.()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name

    router.push({ name: 'RegisterMonetaryMarketList' })
  }

  onMounted(() => loadResources())
  onBeforeMount(async () => await _resetKeys({ investment_portfolio: keys }))

  return {
    isLoaded,
    tabActive,
    filteredTabs,
    tabActiveIdx,
    headerProperties,
    informationFormRef,
    warrantyFormRef,
    defaultIconsLucide,
    position,
    nextTab,
    backTab,
    handleSubmitForm,
  }
}

export default useOperationReposCreate
