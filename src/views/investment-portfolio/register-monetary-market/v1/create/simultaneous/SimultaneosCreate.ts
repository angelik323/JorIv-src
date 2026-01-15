import { computed, onMounted, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  ISimultaneousInformationForm,
  IWarrantyFormData,
  IRegisterSimultaneousPayload,
  ISimultaneousWarranty,
} from '@/interfaces/customs'
import {
  useResourceManagerStore,
  useMonetaryMarketOperationsStore,
} from '@/stores'

const toNumberOrZero = (val: unknown): number => {
  return val !== undefined && val !== null && val !== '' ? Number(val) : 0
}

const mapSimultaneous = (pos: 'Activa' | 'Pasiva' | null): string => {
  if (pos === 'Activa') return 'Activa'
  if (pos === 'Pasiva') return 'Pasiva'
  return ''
}

const buildSimultaneousPayload = (
  info: ISimultaneousInformationForm,
  warrantyData: IWarrantyFormData[] | IWarrantyFormData | null,
  pos: 'Activa' | 'Pasiva'
): IRegisterSimultaneousPayload => {
  const warranties: ISimultaneousWarranty[] = Array.isArray(warrantyData)
    ? warrantyData.map((w) => ({
        title_id: toNumberOrZero(w.title_id),
        issuer_id: toNumberOrZero(w.issuer_id),
        deposit_id: toNumberOrZero(w.deposit_id),
        isin_code_id: toNumberOrZero(w.isin_code_id),
        paper_type_id: toNumberOrZero(w.paper_type_id),
        currency_id: info.currency_id ? Number(info.currency_id) : 1,
        market_value: toNumberOrZero(w.market_value),
      }))
    : warrantyData
    ? [
        {
          title_id: toNumberOrZero(
            (warrantyData as IWarrantyFormData).title_id
          ),
          issuer_id: toNumberOrZero(
            (warrantyData as IWarrantyFormData).issuer_id
          ),
          deposit_id: toNumberOrZero(
            (warrantyData as IWarrantyFormData).deposit_id
          ),
          isin_code_id: toNumberOrZero(
            (warrantyData as IWarrantyFormData).isin_code_id
          ),
          paper_type_id: toNumberOrZero(
            (warrantyData as IWarrantyFormData).paper_type_id
          ),
          currency_id: warrantyData
            ? Number((warrantyData as IWarrantyFormData).currency_id)
            : 1,
          market_value: toNumberOrZero(
            (warrantyData as IWarrantyFormData).market_value
          ),
        },
      ]
    : []

  return {
    operation_date: info.operation_date,
    investment_portfolio_id: toNumberOrZero(info.investment_portfolio_id),
    simultaneous: mapSimultaneous(pos),
    paper_type_id: toNumberOrZero(info.paper_id),
    operation_type_id: toNumberOrZero(info.operation_type_id),
    start_date: info.start_date,
    number_days: toNumberOrZero(info.days_number),
    end_date: info.end_date,
    agreed_rate: toNumberOrZero(info.rate_value),
    rate_class: info.rate_class ?? '',
    base_days: String(info.days_base ?? ''),
    face_value: toNumberOrZero(info.nominal_value),
    counterparty_id: toNumberOrZero(info.counterparty_id),
    currency_id: info.currency_id ? Number(info.currency_id) : 1,
    folio: toNumberOrZero(info.folio),
    compensation_system: info.compensation_system ?? '',
    guarantee_value: toNumberOrZero(info.warranty_value),
    guarantee_percentage: toNumberOrZero(info.warranty_percentage),
    return_value: toNumberOrZero(info.return_value),
    simultaneous_warranty: warranties,
  }
}

const useSimultaneousCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  const { _createSimultaneousOperation } =
    useMonetaryMarketOperationsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const warrantyFormRef = ref()
  const isLoaded = ref(false)

  const keys = [
    'investment_portfolio',
    'list_counterparty_associated_trader',
    'currency_local',
    'compensation_systems',
    'isin_codes_mnemonics_portfolio',
    'paper_type',
    'issuer_counterparty_local_currency',
    'issuer_deposit',
    'paper_type_encompass_and_division',
    'operation_type',
  ]

  const headerProperties = {
    title: 'Crear operación simultánea',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: 'Operaciones de mercado' },
      { label: 'Simultáneas', route: 'RegisterSimultaneousList' },
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
      required: false,
    },
    {
      name: 'warranty',
      label: 'Garantía',
      icon: defaultIconsLucide.fileWithList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const position = ref<'Activa' | 'Pasiva'>('Activa')

  const filteredTabs = computed(() => tabs.value.filter((t) => t.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(0)

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
    tabActiveIdx.value++
    tabActive.value = filteredTabs.value[tabActiveIdx.value]?.name
  }

  const backTab = () => {
    tabActiveIdx.value--
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const handleSubmitForm = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    const infoData =
      informationFormRef.value?.getValues() as ISimultaneousInformationForm
    const warrantyData = warrantyFormRef.value?.getValues()
    if (!infoData) return

    const payload = buildSimultaneousPayload(
      infoData,
      warrantyData,
      position.value
    )

    openMainLoader(true)
    const success = await _createSimultaneousOperation(payload)
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

export default useSimultaneousCreate
