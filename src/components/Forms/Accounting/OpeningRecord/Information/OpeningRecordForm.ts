// Vue - Pinia
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import type {
  IOpeningRecord,
  IOpeningRecordCreatePayload,
  IOpeningRecordModel,
  IOpeningRecordProcessReportData,
  IPendingRow,
  ISuccessRow,
  ProcessModalExpose,
} from '@/interfaces/customs/accounting/OpeningRecord'

import type { IBaseTableProps } from '@/interfaces/global'

// Composables / utils
import { useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useOpeningRecordV2 } from '@/stores/accounting/opening-record/opening-record-v2'
import { ActionType } from '@/interfaces/global'

const useOpeningRecordForm = (
  props: {
    action: ActionType
    data?: IOpeningRecordModel
  },
  emits: Function
) => {
  const { accounting_account_structures, business_trusts_for_period_opening } =
    storeToRefs(useAccountingResourceStore('v1'))

  const { opening_bussines_list, opening_record_pages } = storeToRefs(
    useOpeningRecordV2()
  )

  const { _getResources } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()
  const keys = {
    accounting: ['accounting_account_structures'],
  }

  const openingRecordForm = ref()
  const isEdit = computed(() => props.action === 'edit')
  const isFormValid = ref(false)
  const selectedBusiness = ref()
  const showTable = ref(false)
  const openingReason = ref('')
  const isProcessing = ref(false)
  const processModalRef = ref<ProcessModalExpose | null>(null)
  const models = ref<IOpeningRecordModel>({
    id: undefined,
    accounts_chart_id: 1,
    accounting_structure_id: 0,
    from_business: 0,
    to_business: 0,
    initial_period: '',
    final_period: '',
    opening_reason: '',
    business_ids: [],
    structure_id: 0,
    from_business_id: 0,
    to_business_id: 0,
    leave_in_period: '',
    current_period: null,
  })

  const selectedRows = computed({
    get: () => models.value.business_ids,
    set: (val) => {
      models.value.business_ids = val
    },
  })

  const setFormData = () => {
    if (!props.data) return

    models.value = {
      ...models.value,
      ...props.data,
      accounting_structure_id: props.data.accounting_structure_id ?? 0,
      from_business: props.data.from_business ?? 0,
      to_business: props.data.to_business ?? 0,
      initial_period: props.data.initial_period ?? '',
      final_period: props.data.final_period ?? '',
      opening_reason: props.data.opening_reason ?? '',
      business_ids: props.data.business_ids ?? [],
    }
  }

  const resetFormModel = () => {
    models.value = {
      id: undefined,
      accounts_chart_id: 1,
      accounting_structure_id: undefined,
      from_business: undefined,
      to_business: undefined,
      initial_period: '',
      final_period: '',
      opening_reason: '',
      business_ids: [],
      structure_id: 0,
      from_business_id: 0,
      to_business_id: 0,
      leave_in_period: '',
      current_period: null,
    }
    selectedRows.value = []
    showTable.value = false
    emits('hasSelectedBusiness', false)
  }

  const getFormData = () => JSON.parse(JSON.stringify(models.value))

  const validate = async () => await openingRecordForm.value?.validate?.()

  const tableProps = ref<IBaseTableProps<IOpeningRecord>>({
    title: 'Listado de negocios habilitados',
    loading: false,
    columns: [
      {
        name: 'id_negocio',
        required: true,
        label: '#',
        align: 'left',
        field: (row) => row.id_negocio,
        sortable: true,
      },
      {
        name: 'negocio',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: (row) => row.negocio,
        sortable: true,
      },
      {
        name: 'periodo_actual',
        required: true,
        label: 'Período actual',
        align: 'left',
        field: (row) => row.periodo_actual,
        sortable: true,
      },
      {
        name: 'afecta_consolidacion',
        required: true,
        label: 'Afecta consolidación',
        align: 'left',
        field: (row) => (row.afecta_consolidacion ? 'Sí' : 'No'),
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  onMounted(async () => {
    await _getResources(keys, '', 'v2')
    setFormData()
  })

  watch(
    () => props.data,
    () => setFormData()
  )

  watch(models, () => emits('update'), { deep: true })

  watch(
    models,
    () => {
      const hasBusinesses =
        Array.isArray(models.value.business_ids) &&
        models.value.business_ids.length > 0
      emits('hasSelectedBusiness', hasBusinesses)
    },
    { deep: true }
  )

  watch(opening_bussines_list, () => {
    tableProps.value.rows = opening_bussines_list.value
  })

  watch(opening_record_pages, () => {
    tableProps.value.pages = {
      currentPage: opening_record_pages.value.currentPage,
      lastPage: opening_record_pages.value.lastPage,
    }
  })

  const loadBusinessTrusts = async (extraQuery = '') => {
    const { initial_period, accounting_structure_id } = models.value

    if (!initial_period || !accounting_structure_id) return

    const base = `filter[current_period]=${initial_period}&filter[accounting_structure_id]=${accounting_structure_id}`
    const query = extraQuery ? `${base}&${extraQuery}` : base

    await _getResources(
      { accounting: ['business_trusts_for_period_opening'] },
      query,
      'v2'
    )
  }

  watch(
    () => [models.value.initial_period, models.value.accounting_structure_id],
    async () => {
      if (!models.value.from_business) {
        await loadBusinessTrusts()
      }
    }
  )

  watch(
    () => models.value.initial_period,
    async (val) => {
      const value = val ? String(val).trim() : ''

      if (!value) {
        models.value.final_period = ''
        return
      }

      const regex = /^\d{4}-(0[1-9]|1[0-2])$/
      if (!regex.test(value)) {
        models.value.final_period = ''
        return
      }

      const [yearStr, monthStr] = value.split('-')
      let year = Number(yearStr)
      let month = Number(monthStr)

      month -= 1
      if (month === 0) {
        month = 12
        year -= 1
      }

      const finalMonth = month.toString().padStart(2, '0')
      models.value.final_period = `${year}-${finalMonth}`
    }
  )

  watch(
    () => models.value.from_business,
    async (fromVal) => {
      if (!fromVal) {
        await loadBusinessTrusts()
        return
      }

      await loadBusinessTrusts(`filter[from_business_code]=${fromVal}`)
    }
  )

  const handleSearch = async () => {
    if (!openingRecordForm.value) return

    const valid = await openingRecordForm.value.validate()
    if (!valid) return

    if (!models.value.accounting_structure_id) {
      return
    }

    const params: {
      accounting_structure_id: number
      period: string
      from_business_id?: number
      to_business_id?: number
    } = {
      accounting_structure_id: models.value.accounting_structure_id,
      period: models.value.initial_period ?? '',
    }

    if (models.value.from_business) {
      params.from_business_id = models.value.from_business
    }

    if (models.value.to_business) {
      params.to_business_id = models.value.to_business
    }

    await useOpeningRecordV2()._getOpeningRecordBusinessListing(params)
    showTable.value = true
  }

  const handleResetForm = () => {
    resetFormModel()
    tableProps.value.rows = []
  }

  const handleContinue = handleSearch

  const canProcess = computed(() => {
    return (
      !!models.value.accounting_structure_id &&
      !!models.value.initial_period &&
      !!models.value.final_period &&
      Array.isArray(models.value.business_ids) &&
      models.value.business_ids.length > 0
    )
  })

  const openProcessModal = () => {
    if (!canProcess.value) return

    openingReason.value = ''

    const modal = processModalRef.value

    if (modal?.openModal) {
      modal.openModal()
    } else if (modal?.open) {
      modal.open()
    }
  }

  const closeProcessModal = () => {
    const modal = processModalRef.value

    if (modal?.closeModal) {
      modal.closeModal()
    } else if (modal?.close) {
      modal.close()
    }
  }

  const confirmProcess = async () => {
    if (!openingReason.value.trim()) return

    isProcessing.value = true
    const store = useOpeningRecordV2()

    const payload: IOpeningRecordCreatePayload = {
      accounting_structure_id: models.value.accounting_structure_id,
      from_business: models.value.from_business,
      to_business: models.value.to_business,
      initial_period: models.value.initial_period,
      final_period: models.value.final_period,
      opening_reason: openingReason.value.trim(),
      business_ids: models.value.business_ids.map((item): number =>
        typeof item === 'number' ? item : item.id_negocio
      ),
    }

    const resp = await store._createOpeningRecord(payload)
    isProcessing.value = false

    if (!resp || !resp.success) return

    const processId = resp.data?.id
    if (!processId) return

    const successReport = await store._getSuccessProcessesReport({
      process_id: processId,
    })

    const pendingReport = await store._getPendingProcessesReport({
      process_id: processId,
    })

    const processReportData: IOpeningRecordProcessReportData = {
      processId,
      successful: (successReport?.data ?? []) as ISuccessRow[],
      pending: (pendingReport?.data ?? []) as IPendingRow[],
    }

    closeProcessModal()

    emits('processCompleted', processReportData)
  }

  return {
    openingRecordForm,
    models,
    isEdit,
    defaultIconsLucide,
    tableProps,
    accounting_account_structures,
    business_trusts_for_period_opening,

    opening_bussines_list,

    selectedBusiness,
    selectedRows,
    showTable,
    isFormValid,

    validate,
    getFormData,
    handleSearch,
    handleResetForm,
    handleContinue,
    openProcessModal,
    closeProcessModal,
    confirmProcess,
    openingReason,
    isProcessing,
    processModalRef,
    canProcess,
  }
}

export default useOpeningRecordForm
