// core
import { ref, onMounted, watch, computed } from 'vue'
import { QTable } from 'quasar'

// stores
import { storeToRefs } from 'pinia'
import {
  useAccountingResourceStore,
  useOpeningRecordStore,
  useResourceManagerStore,
  useAccoutingReportStore,
} from '@/stores'

// interfaces y constantes
import {
  IOpeningRecord,
  IOpeningRecordModel,
  IComparativeStatementModel,
  ReportTypes,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// utils
import { defaultIconsLucide, fullName } from '@/utils'
import { useUtils, useMainLoader } from '@/composables'

const useConsolidatedBalanceStatementForm = (
  props: {
    action: ActionType
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const utils = useUtils()
  const { openMainLoader } = useMainLoader()

  const resourceManagerStore = useResourceManagerStore('v1')
  const accountingStoreV1 = useAccountingResourceStore('v1')
  const openingRecordStore = useOpeningRecordStore('v1')

  const consolidatedBalance = useAccoutingReportStore(
    'v1',
    'consolidatedBalance'
  ) as ReportTypes['consolidatedBalance']

  const {
    bussines_parent,
    amount_types,
    accounts_by_structure,
    structure_by_business,
    structure_levels_report,
    template,
  } = storeToRefs(accountingStoreV1)

  const { opening_bussines_list } = storeToRefs(openingRecordStore)

  const { _getResources } = resourceManagerStore

  const openingReportForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const selectedBusiness = ref()
  const showTable = ref(false)

  const defaultPeriod = computed(() => {
    if (selectedBusiness.value?.account?.current_period) {
      return useUtils().formatDate(
        selectedBusiness.value.account.current_period,
        'YYYY-MM'
      )
    }
    return useUtils().formatDate(new Date().toISOString(), 'YYYY-MM')
  })

  const models = ref<IComparativeStatementModel>({
    report_template_id: '',
    level: '',
    from_account: '',
    to_account: '',
    business_id: 0,
    account_structure_id: '',
    structure_by_business: 0,
    amount_type: '',
    period: '',
    last_period: '',
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
        { accounting: ['bussines_parent', 'amount_types'] },
        '',
        'v1'
      ),
      _getResources({ accounting: ['template'] }, '', 'v2'),
    ])
    setFormData()
  })

  watch(
    () => models.value.business_id,
    async (newBusinessId) => {
      if (!newBusinessId) return

      const filters = `filter[business_id]=${newBusinessId}`

      await _getResources({ accounting: ['structure_by_business'] }, filters)

      models.value.account_structure_id = ''
      models.value.level = ''
      models.value.from_account = ''
      models.value.to_account = ''
    }
  )

  watch(
    () => models.value.account_structure_id,
    async (structureId) => {
      if (!structureId) return

      const filterAccounts = new URLSearchParams()
      filterAccounts.append('filter[account_structure_id]', String(structureId))
      await Promise.all([
        _getResources(
          { accounting: ['structure_levels'] },
          `filter[id]=${structureId}`,
          'v2'
        ),

        _getResources(
          { accounting: ['accounts_by_structure'] },
          filterAccounts.toString(),
          'v1'
        ),
      ])

      models.value.level = ''
      models.value.from_account = ''
      models.value.to_account = ''
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
      'filter[business_trust_id]': models.value.business_id,
      level: models.value.level,
      'filter[from_account]': models.value.from_account,
      'filter[to_account]': models.value.to_account,
      'filter[period]': models.value.period,
      'filter[last_period]': models.value.last_period,
      report_template_id: models.value.report_template_id,
      'filter[accounting_structure_id]': models.value.account_structure_id,
    }

    const result = await consolidatedBalance._getConsolidatedBalanceBalance(
      filters
    )
    openMainLoader(false)

    if (result) {
      emits('enable-preview-tab', filters)
    }
  }

  const isFormValid = computed(() => {
    const m = models.value
    return (
      !!m.business_id &&
      !!m.level &&
      !!m.from_account &&
      !!m.to_account &&
      !!m.period &&
      !!m.last_period
    )
  })

  return {
    openingReportForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    defaultPeriod,
    tableProps,
    bussines_parent,
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
    validate,
    handleContinue,
    getFormData,
  }
}

export default useConsolidatedBalanceStatementForm
