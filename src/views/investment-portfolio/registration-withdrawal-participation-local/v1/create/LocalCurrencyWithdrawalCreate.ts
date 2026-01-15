import {
  ref,
  computed,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  watch,
} from 'vue'
import { storeToRefs } from 'pinia'
import { ITabs } from '@/interfaces/global'
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'
import {
  useLocalCurrencyWithdrawalStore,
  useResourceManagerStore,
  useLogin as useLoginStore,
} from '@/stores'
import { ILocalCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'

const useLocalCurrencyWithdrawalCreate = () => {
  const { openMainLoader } = useMainLoader()

  const lcwStore = useLocalCurrencyWithdrawalStore('v1')
  const { _createLocalCurrencyWithdrawal, _clearData } = lcwStore
  const {
    definition_accounting_parameters_form,
    definition_accounting_parameters_details,
  } = storeToRefs(lcwStore)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { loggedUser } = storeToRefs(useLoginStore())

  const basicDataFormRef = ref()
  const detailFormRef = ref()

  const formRefByTab: Record<string, any> = {
    basic_data: basicDataFormRef,
    basicOperation: detailFormRef,
  }

  const step1Ref = ref<HTMLElement | null>(null)
  const step2Ref = ref<HTMLElement | null>(null)

  const secondaryEnabled = ref(false)
  const completed = ref({
    basicData: false,
    basicOperation: false,
  })

  const keys = {
    investment_portfolio: [
      'third_party_issuers_selector',
      'issuer_counterparty_all',
      'administrators_codes',
      'class_portfolio',
      'operation_type',
    ],
  }
  const keysPermission = {
    investment_portfolio: ['permission_user_portfolio'],
  }

  const headerProps = {
    title: 'Crear registro retiro de participación en FICs',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'PDI' },
      { label: 'Registro retiro de participación en FICs' },
      { label: 'Crear', route: 'LocalCurrencyWithdrawalCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: true,
    },
    {
      name: 'basicOperation',
      label: 'Datos de operación',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabsComputed = computed<ITabs[]>(() =>
    tabs.value.map((t) =>
      t.name === 'basicOperation'
        ? { ...t, disable: !secondaryEnabled.value }
        : t
    )
  )
  const filteredTabs = computed(() => tabsComputed.value.filter((t) => t.show))

  const tabActive = ref<string>(filteredTabs.value[0].name)
  const tabActiveIdx = ref<number>(
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )
  const currentIdx = computed(() =>
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )

  const validateActiveTab = async (): Promise<boolean> => {
    const activeName = tabActive.value
    const targetRef = formRefByTab[activeName]
    try {
      const ok = (await targetRef?.value?.validateForm()) ?? false
      return !!ok
    } catch {
      return false
    }
  }

  const guardedSetActive = async (nextName: string) => {
    if (nextName === 'basicOperation' && !secondaryEnabled.value) return
    const idx = filteredTabs.value.findIndex((t) => t.name === nextName)
    if (idx === -1) return
    tabActiveIdx.value = idx
    tabActive.value = nextName
  }

  const fetchWithdrawalUnitsFiltered = async () => {
    const f = definition_accounting_parameters_form.value
    const investment_portfolio_id = f?.investment_portfolio_id
    const issuer_id = f?.issuer_id
    const counterparty_id = f?.counterparty_id
    const administrator_id = f?.administrator_id
    if (
      investment_portfolio_id == null ||
      issuer_id == null ||
      counterparty_id == null ||
      administrator_id == null
    )
      return

    const params = new URLSearchParams()
    params.set(
      'filter[investment_portfolio_id]',
      String(investment_portfolio_id)
    )
    params.set('filter[issuer_id]', String(issuer_id))
    params.set('filter[counterparty_id]', String(counterparty_id))
    params.set('filter[administrator_id]', String(administrator_id))

    await _getResources(
      {
        investment_portfolio: ['withdrawal_participation_unit_local_currency'],
      },
      params.toString(),
      'v1'
    )
  }

  watch(
    [
      () =>
        definition_accounting_parameters_form.value?.investment_portfolio_id,
      () => definition_accounting_parameters_form.value?.issuer_id,
      () => definition_accounting_parameters_form.value?.counterparty_id,
      () => definition_accounting_parameters_form.value?.administrator_id,
    ],
    async () => {
      await fetchWithdrawalUnitsFiltered()
    },
    { immediate: true }
  )

  const backTab = async () => {
    if (currentIdx.value > 0) {
      const prevIdx = currentIdx.value - 1
      tabActiveIdx.value = prevIdx
      tabActive.value = filteredTabs.value[prevIdx].name
    } else {
      await nextTick()
      step1Ref.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const nextTab = async () => {
    const ok = await validateActiveTab()
    if (!ok) return

    if (tabActive.value === 'basic_data') {
      completed.value.basicData = true
      const snapRaw = basicDataFormRef.value?.getModels?.()
      if (snapRaw) {
        const snapshot = JSON.parse(JSON.stringify(snapRaw))
        useLocalCurrencyWithdrawalStore('v1')._patchLocalCurrencyWithdrawalForm(
          snapshot
        )
      }
      secondaryEnabled.value = true
      await fetchWithdrawalUnitsFiltered()
    } else if (tabActive.value === 'basicOperation') {
      completed.value.basicOperation = true
    }

    if (currentIdx.value < filteredTabs.value.length - 1) {
      const nextIdx = currentIdx.value + 1
      tabActiveIdx.value = nextIdx
      tabActive.value = filteredTabs.value[nextIdx].name

      await nextTick()
      if (filteredTabs.value[nextIdx].name === 'basicOperation') {
        step2Ref.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const makeDataRequest = (): ILocalCurrencyWithdrawalParticipationForm => {
    const form = definition_accounting_parameters_form.value
    const detailsSrc = definition_accounting_parameters_details.value

    const toStr = (v: unknown): string | null =>
      v === undefined || v === null || v === '' ? null : String(v)

    const d = (detailsSrc?.details ?? form?.details ?? {}) as Record<
      string,
      unknown
    >

    const payload: ILocalCurrencyWithdrawalParticipationForm = {
      investment_portfolio_id: toStr(form?.investment_portfolio_id),
      operation_date: toStr(form?.operation_date),
      issuer_id: toStr(form?.issuer_id),
      counterparty_id: toStr(form?.counterparty_id),
      administrator_id: toStr(form?.administrator_id),

      investment_portfolio_description: toStr(
        form?.investment_portfolio_description
      ),
      issuer_description: toStr(form?.issuer_description),
      counterparty_description: toStr(form?.counterparty_description),
      administrator_description: toStr(form?.administrator_description),

      details: (() => {
        const obj = {
          unit_value: toStr(d?.unit_value),
          portfolio_class: toStr(d?.portfolio_class),
          currency_id: 1,
          value_currency: toStr(d?.value_currency),
          operation_type_id: toStr(
            d?.operation_type_id ?? form?.operation_code
          ),
          paper_type_id: toStr(d?.paper_type_id),
          withdrawal_value: toStr(d?.withdrawal_value),
        }
        const allNull = Object.values(obj).every((v) => v == null)
        return allNull ? null : (obj as any)
      })(),

      currency_id: null,
      value_currency: null,
      cash_value_currency: null,
      withdrawal_value: null,
      portfolio_class: null,
      security_type: null,
      origin_currency: null,
      isin: null,
      participation_count: null,
      title_count: null,
      current_participation_balance_in_pesos: null,
      current_balance_in_units: null,
      participation_balance_in_pesos: null,
      operation_code: null,
      operation_description: null,
      cash_operation_days: null,
      unit: null,
      currency_value: null,
      conversion_factor: null,
    }

    return payload
  }

  const softResetAll = async () => {
    _clearData()
    basicDataFormRef.value?.resetForm()
    detailFormRef.value?.resetForm()
    tabActiveIdx.value = 0
    tabActive.value = filteredTabs.value[0].name
    secondaryEnabled.value = false
    completed.value.basicData = false
    completed.value.basicOperation = false
    await nextTick()
  }

  const onSubmit = async () => {
    const ok = await validateActiveTab()
    if (!ok) return

    openMainLoader(true)
    try {
      const success = await _createLocalCurrencyWithdrawal(makeDataRequest())
      if (success) {
        await softResetAll()
      }
    } finally {
      openMainLoader(false)
    }
  }

  onBeforeMount(async () => {
    _clearData()
    openMainLoader(true)
    try {
      await _getResources(keys)
      const userId = loggedUser.value?.user.id
      const filters = userId ? `filter[user_id]=${userId}` : undefined
      await _getResources(keysPermission, filters)
    } finally {
      openMainLoader(false)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _clearData()
  })

  return {
    headerProps,
    tabs: tabsComputed,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    currentIdx,
    basicDataFormRef,
    detailFormRef,
    step1Ref,
    step2Ref,
    guardedSetActive,
    backTab,
    nextTab,
    onSubmit,
    secondaryEnabled,
    completed,
  }
}

export default useLocalCurrencyWithdrawalCreate
