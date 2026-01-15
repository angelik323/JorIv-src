import { ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import {
  IPeriodStatementModel,
  IOpeningRecord,
  IOpeningRecordModel,
  ReportTypes,
} from '@/interfaces/customs'
import {
  useAccountingResourceStore,
  useOpeningRecordStore,
  useResourceManagerStore,
  useAccoutingReportStore,
} from '@/stores'
import { defaultIconsLucide, fullName } from '@/utils'
import { useUtils, useMainLoader } from '@/composables'
import { QTable } from 'quasar'
import { ActionType } from '@/interfaces/global'

const usePeriodStatementForm = (
  props: {
    action: ActionType
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const utils = useUtils()

  const resourceManagerStore = useResourceManagerStore('v1')
  const accountingStoreV1 = useAccountingResourceStore('v1')
  const openingRecordStore = useOpeningRecordStore('v1')

  const period = useAccoutingReportStore(
    'v1',
    'period'
  ) as ReportTypes['period']

  const {
    business_trusts_with_description,
    amount_types,
    accounts_by_structure,
    structure_by_business,
    structure_levels_report,
    template,
    third_parties_by_account_range,
    cost_centers_by_account_range,
    accounting_chart_operative_by_structure,
  } = storeToRefs(accountingStoreV1)

  const { opening_bussines_list } = storeToRefs(openingRecordStore)

  const { _getResources, _resetKeys } = resourceManagerStore
  const showAuxiliaries = ref<number>(2)
  const showCostCenters = ref<number>(2)

  const openingReportForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const selectedBusiness = ref()
  const showTable = ref(false)
  const { openMainLoader } = useMainLoader()

  const defaultPeriod = computed(() => {
    if (selectedBusiness.value?.account?.current_period) {
      return useUtils().formatDate(
        selectedBusiness.value.account.current_period,
        'YYYY-MM'
      )
    }
    return useUtils().formatDate(new Date().toISOString(), 'YYYY-MM')
  })

  const models = ref<IPeriodStatementModel>({
    report_template_id: '',
    business_trrust_id: 0,
    level: '',
    from_period: '',
    to_period: '',
    from_account: '',
    to_account: '',
    from_third_party: '',
    to_third_party: '',
    amount_type: '',
    from_cost_center: '',
    to_cost_center: '',
    account_structures_id: 0,
  })

  if (props.action === 'edit' && props.data) {
    models.value = { ...models.value, ...props.data }
  }

  const pagination = ref({
    page: 1,
    rowsPerPage: 5,
  })

  const validate = async () => {
    const result = await openingReportForm.value?.validate?.()
    return result
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: IOpeningRecord[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'Listado de reporte contable comparativo',
    loading: false,
    columns: [
      {
        name: 'account_code',
        label: 'Cuenta',
        field: 'account_code',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'account_name',
        label: 'Nombre de la cuenta',
        field: 'account_name',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'initial_balance',
        label: 'Saldo inicial',
        field: 'initial_balance',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
      },
      {
        name: 'debit',
        label: 'Débito',
        field: 'debit',
        sortable: true,
        style: 'width: 150px',
        align: 'center',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'credit',
        label: 'Crédito',
        field: 'credit',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'total',
        label: 'Saldo final',
        field: 'total',
        sortable: false,
        style: 'width: 150px',
        align: 'center',
        headerStyle: 'text-align: center;',
        format: (val) =>
          utils.formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ],

    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const setFormData = () => {
    if (!props.data) return
  }

  const getFormData = () => {
    const data = JSON.parse(JSON.stringify(models.value))

    return data
  }

  onMounted(async () => {
    await Promise.all([
      _getResources(
        { accounting: ['business_trusts_with_description', 'amount_types'] },
        '',
        'v1'
      ),
      _getResources({ accounting: ['template'] }, '', 'v2'),
    ])
    setFormData()
  })

  watch(
    () => models.value.business_trrust_id,
    async (newBusinessId) => {
      models.value.account_structures_id = ''
      _resetKeys({
        accounting: ['structure_by_business'],
      })
      if (!newBusinessId) return

      const params = new URLSearchParams()
      params.set('filter[business_id]', String(newBusinessId))

      await Promise.all([
        _getResources(
          { accounting: ['structure_by_business'] },
          params.toString(),
          'v1'
        ),
        _getResources({ accounting: ['template'] }, '', 'v2'),
        _getResources({ accounting: ['amount_types'] }, '', 'v1'),
      ])

      models.value.account_structures_id = ''
      models.value.level = ''
      models.value.from_account = ''
      models.value.to_account = ''
      models.value.from_third_party = ''
      models.value.to_third_party = ''
      models.value.from_cost_center = ''
      models.value.to_cost_center = ''
    }
  )

  watch(
    () => models.value.account_structures_id,
    async (structureId) => {
      if (!structureId) return

      const paramsAccounts = new URLSearchParams()
      paramsAccounts.set('filter[account_structures_id]', String(structureId))

      await Promise.all([
        _getResources(
          { accounting: ['structure_levels'] },
          `filter[id]=${structureId}`,
          'v2'
        ),
        _getResources(
          { accounting: ['accounting_chart_operative_by_structure'] },
          paramsAccounts.toString(),
          'v1'
        ),
      ])

      models.value.level = ''
      models.value.from_account = ''
      models.value.to_account = ''
      models.value.from_third_party = ''
      models.value.to_third_party = ''
      models.value.from_cost_center = ''
      models.value.to_cost_center = ''
    }
  )

  watch(
    () => [models.value.from_account, models.value.to_account],
    async ([fromAcc, toAcc]) => {
      if (!fromAcc || !toAcc) return

      const params = new URLSearchParams()
      params.set('filter[from_account]', String(fromAcc))
      params.set('filter[to_account]', String(toAcc))

      await Promise.all([
        _getResources(
          { accounting: ['third_parties_by_account_range'] },
          params.toString(),
          'v1'
        ),
        _getResources(
          { accounting: ['cost_centers_by_account_range'] },
          params.toString(),
          'v1'
        ),
      ])

      models.value.from_third_party = ''
      models.value.to_third_party = ''
      models.value.from_cost_center = ''
      models.value.to_cost_center = ''
    }
  )

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })

  const handleContinue = async () => {
    openMainLoader(true)
    const filters = {
      'filter[business_trust_id]': models.value.business_trrust_id,
      level: models.value.level,
      'filter[from_period]': models.value.from_period,
      'filter[to_period]': models.value.to_period,
      'filter[from_account]': models.value.from_account,
      'filter[to_account]': models.value.to_account,
      'filter[from_third_party]': models.value.from_third_party,
      'filter[to_third_party]': models.value.to_third_party,
      amount_type: models.value.amount_type,
      'filter[from_cost_center]': models.value.from_cost_center,
      'filter[to_cost_center]': models.value.to_cost_center,
      report_template_id: models.value.report_template_id,
    }

    const result = await period._getPeriodStatementBalance(filters)
    openMainLoader(false)
    if (result) {
      emits('enable-preview-tab', filters)
    }
  }

  const isFormValid = computed(() => {
    const m = models.value

    const baseOk =
      !!m.business_trrust_id &&
      !!m.report_template_id &&
      !!m.from_period &&
      !!m.to_period &&
      !!m.level &&
      !!m.amount_type &&
      !!m.from_account &&
      !!m.to_account

    const auxOk =
      showAuxiliaries.value === 1
        ? !!m.from_third_party && !!m.to_third_party
        : true

    const ccOk =
      showCostCenters.value === 1
        ? !!m.from_cost_center && !!m.to_cost_center
        : true

    return baseOk && auxOk && ccOk
  })

  watch(showAuxiliaries, (val) => {
    if (val !== 1) {
      models.value.from_third_party = ''
      models.value.to_third_party = ''
    }
  })

  watch(showCostCenters, (val) => {
    if (val !== 1) {
      models.value.from_cost_center = ''
      models.value.to_cost_center = ''
    }
  })

  return {
    openingReportForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    defaultPeriod,
    tableProps,
    business_trusts_with_description,
    third_parties_by_account_range,
    cost_centers_by_account_range,
    accounting_chart_operative_by_structure,
    template,
    structure_by_business,
    structure_levels_report,
    amount_types,
    accounts_by_structure,
    fullName,
    selectedBusiness,
    isFormValid,
    opening_bussines_list,
    showTable,
    showAuxiliaries,
    showCostCenters,
    validate,
    handleContinue,
    getFormData,
  }
}

export default usePeriodStatementForm
