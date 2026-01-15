// core
import { ref, onMounted, watch, computed, onBeforeUnmount } from 'vue'
import { QTable } from 'quasar'

// stores
import { storeToRefs } from 'pinia'
import {
  useAccountingResourceStore,
  useAccoutingReportStore,
  useOpeningRecordStore,
  useResourceManagerStore,
} from '@/stores'

// interfaces y constantes
import {
  IGeneralLedgerReportModel,
  IOpeningRecord,
  IOpeningRecordModel,
  ReportTypes,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'

// utils
import { defaultIconsLucide, fullName } from '@/utils'
import { useUtils, useMainLoader } from '@/composables'

const useGeneralLedgerForm = (
  props: {
    action: ActionType
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const utils = useUtils()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    structure_levels_report,
    business_trusts_basic,
    structure_by_business,
    accounts_by_structure,
    template,
    accounting_chart_operative_by_structure,
    business_trust_account,
    business_trust,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const generalLedger = useAccoutingReportStore(
    'v1',
    'generalLedger'
  ) as ReportTypes['generalLedger']

  const { opening_bussines_list } = storeToRefs(useOpeningRecordStore('v1'))

  const keys = {
    accounting: ['business_trusts_basic', 'amount_types'],
  }

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

  const models = ref<IGeneralLedgerReportModel>({
    report_template_id: '',
    business_trust_id: 0,
    from_period: '',
    to_period: '',
    accounting_structure_id: '',
    from_account: '',
    to_account: '',
    paginate: 1,
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
    await _getResources(keys)
    _getResources({ accounting: ['template'] }, '', 'v2'), setFormData()
  })

  watch(
    () => models.value.business_trust_id,
    async (newBusinessId) => {
      models.value.accounting_structure_id = ''
      _resetKeys({
        accounting: ['structure_by_business'],
      })
      if (!newBusinessId) return

      const list = (
        business_trust.value && business_trust.value.length > 0
          ? business_trust.value
          : business_trusts_basic?.value || []
      ) as Array<{
        id?: number | string
        value?: number | string
        business_code?: string
        code?: string
        label?: string
      }>

      const selected = list.find(
        (item) => String(item?.id ?? item?.value) === String(newBusinessId)
      )

      let code: string = selected?.business_code ?? selected?.code ?? ''

      if (!code && typeof selected?.label === 'string') {
        code = selected.label.split(' - ')[0]?.trim() || ''
      }

      if (!code) {
        models.value.accounting_structure_id = ''
        models.value.from_account = ''
        models.value.to_account = ''
        return
      }

      const params = new URLSearchParams()
      params.set('filter[search]', code)
      params.set('filter[business_code]', code)

      await Promise.all([
        _getResources(
          { accounting: ['business_trust_without_permissions'] },
          params.toString(),
          'v2'
        ),
        _getResources({ accounting: ['template'] }, '', 'v2'),
      ])

      models.value.accounting_structure_id = ''
      models.value.from_account = ''
      models.value.to_account = ''

      _getResources(
        {
          accounting: ['structure_by_business'],
        },
        `filter[business_id]=${newBusinessId}`
      )
    }
  )

  watch(
    () => models.value.accounting_structure_id,
    async (structureId) => {
      if (!structureId) return

      const params = new URLSearchParams()
      params.set('filter[account_structures_id]', String(structureId))

      await _getResources(
        { accounting: ['accounting_chart_operative_by_structure'] },
        params.toString(),
        'v1'
      )

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
      'filter[business_trust_id]': models.value.business_trust_id,
      'filter[from_period]': models.value.from_period,
      'filter[to_period]': models.value.to_period,
      'filter[accounting_structure_id]': models.value.accounting_structure_id,
      'filter[from_account]': models.value.from_account,
      'filter[to_account]': models.value.to_account,
    }

    const result = await generalLedger._getGeneralLedgerBalance(filters)
    openMainLoader(false)
    if (result) {
      emits('enable-preview-tab')
    }
  }

  const isFormValid = computed(() => {
    const m = models.value
    return (
      !!m.business_trust_id &&
      !!m.from_period &&
      !!m.to_period &&
      !!m.accounting_structure_id &&
      !!m.report_template_id &&
      !!m.from_account &&
      !!m.to_account
    )
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    openingReportForm,
    models,
    isEdit,
    pagination,
    defaultIconsLucide,
    defaultPeriod,
    tableProps,
    business_trusts_basic,
    template,
    business_trust_account,
    structure_levels_report,
    accounting_chart_operative_by_structure,
    accounts_by_structure,
    fullName,
    selectedBusiness,
    isFormValid,
    opening_bussines_list,
    showTable,
    validate,
    handleContinue,
    getFormData,
    structure_by_business,
  }
}

export default useGeneralLedgerForm
