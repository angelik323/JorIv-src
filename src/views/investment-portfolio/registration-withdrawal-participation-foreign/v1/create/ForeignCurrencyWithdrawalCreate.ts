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
  useResourceManagerStore,
  useForeignCurrencyWithdrawalStore,
  useLogin as useLoginStore,
} from '@/stores'
import { IForeignCurrencyWithdrawalParticipationForm } from '@/interfaces/customs'

const useForeignCurrencyWithdrawalCreate = () => {
  const { openMainLoader } = useMainLoader()

  const fcwStore = useForeignCurrencyWithdrawalStore('v1')
  const { _createForeignCurrencyWithdrawal, _clearData } = fcwStore
  const {
    definition_accounting_parameters_form,
    definition_accounting_parameters_details,
    definition_accounting_parameters_positions,
  } = storeToRefs(fcwStore)

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { loggedUser } = storeToRefs(useLoginStore())

  const basicDataFormRef = ref()
  const detailFormRef = ref()
  const positionFormRef = ref()
  const derivateFormRef = ref()

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
      'withdrawal_participation_unit_foreign_currency',
    ],
  }

  const keysPermission = {
    investment_portfolio: ['permission_user_portfolio'],
  }

  const headerProps = {
    title:
      'Crear registro retiro de participación en FICs en moneda extranjera',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'PDI' },
      {
        label: 'Registro retiro de participación en FICs en moneda extranjera',
        route: 'ForeignCurrencyWithdrawalList',
      },
      { label: 'Crear', route: 'ForeignCurrencyWithdrawalCreate' },
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
    {
      name: 'conditions',
      label: 'Condiciones de cumplimiento',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabsComputed = computed<ITabs[]>(() =>
    tabs.value.map((t) => {
      if (t.name === 'basicOperation')
        return { ...t, disable: !secondaryEnabled.value }
      if (t.name === 'conditions')
        return { ...t, disable: !completed.value.basicOperation }
      return t
    })
  )
  const filteredTabs = computed(() => tabsComputed.value.filter((t) => t.show))

  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )
  const currentIdx = computed(() =>
    filteredTabs.value.findIndex((t) => t.name === tabActive.value)
  )

  const formRefByTab: Record<string, any> = {
    basic_data: basicDataFormRef,
    basicOperation: detailFormRef,
    conditions: positionFormRef,
  }

  const validateActiveTab = async (): Promise<boolean> => {
    const targetRef = formRefByTab[tabActive.value]
    try {
      const ok = (await targetRef?.value?.validateForm()) ?? false
      return !!ok
    } catch {
      return false
    }
  }

  const guardedSetActive = async (nextName: string) => {
    if (nextName === 'basicOperation' && !secondaryEnabled.value) return
    if (nextName === 'conditions' && !completed.value.basicOperation) {
      const ok = await detailFormRef.value?.validateForm()
      if (!ok) return
      completed.value.basicOperation = true
    }
    const idx = filteredTabs.value.findIndex((t) => t.name === nextName)
    if (idx === -1) return
    tabActiveIdx.value = idx
    tabActive.value = nextName
  }

  const backTab = async () => {
    if (currentIdx.value > 0) {
      const prevIdx = currentIdx.value - 1
      tabActiveIdx.value = prevIdx
      tabActive.value = filteredTabs.value[prevIdx].name
      return
    }
    await nextTick()
    step1Ref.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
        investment_portfolio: [
          'withdrawal_participation_unit_foreign_currency',
        ],
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

  const nextTab = async () => {
    const ok = await validateActiveTab()
    if (!ok) return

    if (tabActive.value === 'basic_data') {
      completed.value.basicData = true
      const snapRaw = basicDataFormRef.value?.getModels?.()
      if (snapRaw) {
        const snapshot = JSON.parse(JSON.stringify(snapRaw))
        useForeignCurrencyWithdrawalStore(
          'v1'
        )._patchForeignCurrencyWithdrawalForm(snapshot)
      }
      secondaryEnabled.value = true
      await nextTick()
      step2Ref.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })

      await fetchWithdrawalUnitsFiltered()
    } else if (tabActive.value === 'basicOperation') {
      completed.value.basicOperation = true
    }

    if (currentIdx.value < filteredTabs.value.length - 1) {
      const nextIdx = currentIdx.value + 1
      tabActiveIdx.value = nextIdx
      tabActive.value = filteredTabs.value[nextIdx].name
    }
  }

  const makeDataRequest = (): IForeignCurrencyWithdrawalParticipationForm => {
    const form = definition_accounting_parameters_form.value
    const detailsSrc = definition_accounting_parameters_details.value
    const complianceSrc = definition_accounting_parameters_positions.value

    const toStr = (v: unknown): string | null =>
      v === undefined || v === null || v === '' ? null : String(v)

    const d = (detailsSrc?.details ?? form?.details ?? {}) as Record<
      string,
      unknown
    >
    const c = (complianceSrc?.compliance ?? form?.compliance ?? {}) as Record<
      string,
      unknown
    >

    const payload: IForeignCurrencyWithdrawalParticipationForm = {
      investment_portfolio_id: toStr(form?.investment_portfolio_id),
      investment_portfolio_description: toStr(
        form?.investment_portfolio_description
      ),
      operation_date: toStr(form?.operation_date),
      issuer_id: toStr(form?.issuer_id),
      issuer_description: toStr(form?.issuer_description),
      counterparty_id: toStr(form?.counterparty_id),
      counterparty_description: toStr(form?.counterparty_description),
      administrator_id: toStr(form?.administrator_id),
      administrator_description: toStr(form?.administrator_description),

      details: (() => {
        const obj = {
          unit_value: toStr(d?.unit_value),
          portfolio_class: toStr(d?.portfolio_class),
          operation_type_id: toStr(
            d?.operation_type_id ?? form?.operation_code
          ),
          cash_operation_days: toStr(d?.cash_operation_days),
        }
        const allNull = Object.values(obj).every((v) => v == null)
        return allNull ? null : (obj as any)
      })(),

      compliance: (() => {
        const obj = {
          withdrawal_value_origin_currency: toStr(
            c?.withdrawal_value_origin_currency
          ),
          compliance_date: toStr(c?.compliance_date),
          placement_resource_date: toStr(c?.placement_resource_date),
        }
        const allNull = Object.values(obj).every((v) => v == null)
        return allNull ? null : (obj as any)
      })(),
    }

    return payload
  }

  const onSubmit = async () => {
    const ok = await validateActiveTab()
    if (!ok) return
    const payload = makeDataRequest()
    openMainLoader(true)
    try {
      const success = await _createForeignCurrencyWithdrawal(payload)
      if (success) {
        setTimeout(() => {
          basicDataFormRef.value?.resetForm()
          detailFormRef.value?.resetForm()
          positionFormRef.value?.resetForm()

          tabActiveIdx.value = 0
          tabActive.value = filteredTabs.value[0].name
        }, 1000)
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
    positionFormRef,
    derivateFormRef,

    step1Ref,
    step2Ref,

    backTab,
    nextTab,
    onSubmit,
    guardedSetActive,

    secondaryEnabled,
    completed,
  }
}

export default useForeignCurrencyWithdrawalCreate
