// Vue - Pinia
import {
  getCurrentInstance,
  nextTick,
  ref,
  computed,
  onMounted,
  onUnmounted,
  reactive,
  watch,
} from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useGenerateBallotStore } from '@/stores/investment-portfolio/generate-ballot'
import { useInvestmentPortfolioResourceStore } from '@/stores/resources-manager/investment-portfolio'

// Interfaces
import {
  ICreateBallotPayload,
  IGenerateBallotSubmit,
  IInfoFormRefType,
} from '@/interfaces/customs/investment-portfolio/GenerateBallot'

export const useGenerateBallotCreate = () => {
  const instance = getCurrentInstance()
  if (!instance)
    throw new Error('Instance not found in useGenerateBallotCreate')

  const { defaultIconsLucide } = useUtils()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { instruction_slip_types } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )

  const { _createBallot } = useGenerateBallotStore('v1')
  const { menu_data, isForeign } = storeToRefs(useGenerateBallotStore('v1'))

  const dynamicTitle = ref('Generar papeleta – Cargando...')

  watch(
    () => ({
      menu: menu_data.value,
      types: instruction_slip_types.value,
    }),
    ({ menu, types }) => {
      const base = 'Generar'
      const typeLabel = isForeign.value ? 'moneda extranjera' : 'moneda local'

      const match = types.find(
        (t) =>
          Number(t.value ?? t.id) === Number(menu?.instruction_slip_type_id)
      )

      if (match) {
        dynamicTitle.value = `${base} ${match.label.toLowerCase()} ${typeLabel}`
      } else {
        dynamicTitle.value = `${base} ${typeLabel}`
      }
    },
    { immediate: true, deep: true }
  )

  const headerProps = computed(() => ({
    title: dynamicTitle.value,
    breadcrumbs: [
      { label: 'Instrucciones', route: 'GenerateBallotMenu' },
      { label: dynamicTitle.value, route: '' },
    ],
  }))

  const tabs = reactive([
    {
      name: 'InformationForm',
      label: 'Datos básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(0)

  const infoFormRef = computed<IInfoFormRefType | null>(() => {
    return (instance.proxy?.$refs.infoFormRef as IInfoFormRefType) || null
  })

  const handleBack = () => router.push({ name: 'GenerateBallotMenu' })

  const triggerFormSubmit = async () => {
    await nextTick()
    const form = infoFormRef.value
    if (!form || typeof form.onSubmit !== 'function') return
    form.onSubmit()
  }

  const handleSubmit = async (formData: IGenerateBallotSubmit) => {
    openMainLoader(true)

    const payload: ICreateBallotPayload = {
      investment_portfolio_id: String(
        menu_data.value?.investment_portfolio_id || ''
      ),
      operation_type_id: String(menu_data.value?.operation_type_id || ''),
      instruction_slip_type_id: String(
        menu_data.value?.instruction_slip_type_id || ''
      ),
      operation_date: String(menu_data.value?.operation_date || ''),
      issuers_counterparty_id: '',
      titles: formData.titles.map((t) => ({
        id: Number(t.id) || 0,
        title_id: Number(t.title_id),
        payment_or_collection_method_id: Number(
          t.payment_or_collection_method_id || 0
        ),
        origin_bank_id: t.bank_origin_id ?? null,
        origin_bank_account_id: t.account_origin_id ?? null,
        destiny_bank_id: t.bank_destiny_id ?? null,
        destiny_bank_account_id: t.account_destiny_id ?? null,
        compliance_bank_id: t.bank_fulfillment_id ?? null,
        compliance_bank_account_id: t.account_fulfillment_id ?? null,
        operation_value: Number(t.operation_value),
        benefit_id: Number(t.beneficiary),
        ...(isForeign.value && {
          currency: t.currency || null,
          origin_currency_value: t.origin_currency_value || null,
          operation_origin_currency_value:
            t.operation_origin_currency_value || null,
          local_currency_transaction_value:
            t.local_currency_transaction_value || null,
          resource_placement_date: t.resource_placement_date || null,
        }),
      })),
      treasury_instructions: [],
    }

    const success = await _createBallot(payload)
    openMainLoader(false)
    if (success) router.push({ name: 'GenerateBallotMenu' })
  }

  onMounted(async () => {
    await _getResources({
      treasury: ['payments', 'typeReceive'],
      investment_portfolio: [
        'instruction_slip_types',
        `investment_portfolio_collection_methods&investment_portfolio_id=${menu_data.value?.investment_portfolio_id}`,
        'investment_portfolio_payment_methods',
      ],
    })
  })

  onUnmounted(() => {
    _resetKeys({ treasury: ['bank_account'] })
  })

  return {
    headerProps,
    tabs,
    activeTab,
    tabActiveIdx,
    handleBack,
    handleSubmit,
    triggerFormSubmit,
    isForeign,
  }
}
