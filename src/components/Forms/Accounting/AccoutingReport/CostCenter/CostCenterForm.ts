import { ref, watch, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import {
  ICostCenterReportModel,
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

const useCostCenterForm = (
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

  const costCenter = useAccoutingReportStore(
    'v1',
    'costCenter'
  ) as ReportTypes['costCenter']

  const {
    business_trust,
    cost_center,
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

  const models = ref<ICostCenterReportModel>({
    report_template_id: '',
    level: '',
    from_account: '',
    to_account: '',
    business_id: 0,
    account_structure_id: 0,
    structure_by_business: 0,
    amount_type: '',
    period: '',
    last_period: '',
    from_cost_center_id: '',
    to_cost_center_id: '',
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
    await _getResources({ accounting: ['business_trust'] })

    if (props.data) {
      setFormData()
    }
  })

  watch(
    () => models.value.business_id,
    async (newBusinessId) => {
      if (!newBusinessId) return

      const filters = `filter[business_id]=${newBusinessId}`

      await _getResources({ accounting: ['structure_by_business'] }, filters)

      models.value.account_structure_id = 0
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
      const filterAccountings = new URLSearchParams()
      filterAccounts.append('filter[account_structure_id]', String(structureId))
      filterAccountings.append(
        'filter[accounting_structure_id]',
        String(structureId)
      )
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

        _getResources(
          { accounting: ['cost_center'] },
          `filter[accounting_structure_id]=${
            business_trust.value?.find(
              (item) => item.id === models.value.business_id
            )?.account?.cost_center_structure_id
          }`,
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
      report_template_id: models.value.report_template_id,
      'filter[business_trust_id]': models.value.business_id,
      'filter[account_structure_id]': models.value.account_structure_id,
      'filter[level]': models.value.level,
      amount_type: models.value.amount_type,
      'filter[from_cost_center_code]': models.value.from_cost_center_id,
      'filter[to_cost_center_code]': models.value.to_cost_center_id,
      'filter[from_account_code]': models.value.from_account,
      'filter[to_account_code]': models.value.to_account,
      'filter[from_period]': models.value.period,
      'filter[to_period]': models.value.last_period,
    }

    await costCenter._getCostCenterBalance(filters)
    openMainLoader(false)
    emits('enable-preview-tab')
  }

  const isFormValid = computed(() => {
    const m = models.value
    return (
      !!m.business_id &&
      !!m.level &&
      !!m.amount_type &&
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
    business_trust,
    template,
    structure_by_business,
    structure_levels_report,
    amount_types,
    accounts_by_structure,
    cost_center,
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

export default useCostCenterForm
