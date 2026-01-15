import { onMounted, ref, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'

import { useRules, useUtils } from '@/composables'

import { IBaseTableProps } from '@/interfaces/global'
import {
  ICancelLoadBanksDetailView,
  IBankingNetworkUploadRecord,
  IBankingNetworkUploadAnnulate,
} from '@/interfaces/customs/treasury/CancelLoadBanks'

import { useTreasuryResourceStore } from '@/stores/resources-manager/treasury'
import { useCancelBankLoadsStore } from '@/stores/treasury/cancel-load-banks'

const useCancelLoadBanksDetail = (
  props: {
    data: IBankingNetworkUploadAnnulate | null
  },
  emit: Function
) => {
  const { banking_network_uploads_data, banking_network_uploads_record } =
    storeToRefs(useCancelBankLoadsStore('v1'))

  const {
    isEmptyOrZero,
    isDateAllowed,
    getHolidaysByYear,
    formatDate,
    formatCurrency,
  } = useUtils()

  const { treasury_cancellation_codes } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const { is_required, valid_format_date } = useRules()

  const dateNow = new Date().toString()

  const listRecords = ref<number[]>([])

  const initialModelsView: ICancelLoadBanksDetailView = {
    business: '',
    business_name: '',
    bank: '',
    bank_name: '',
    format: '',
    format_name: '',
    closing_date: '',
    upload_date: '',
    bank_account: '',
    bank_account_name: '',
    upload_status: '',
    upload_number: '',
    office: '',
    office_name: '',
  }
  const infoModels = ref<ICancelLoadBanksDetailView>({ ...initialModelsView })

  const tableProps = ref<IBaseTableProps<IBankingNetworkUploadRecord>>({
    title: 'Listado de registros',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        field: 'id',
        label: '#',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'movement_id',
        field: (row) => row.movement.id ?? '',
        required: false,
        label: 'Número de movimiento',
        sortable: true,
        align: 'left',
      },
      {
        name: 'periodo',
        field: (row) => moment(row.date).year(),
        label: 'Periodo',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'date',
        field: (row) => row.date ?? '',
        label: 'Fecha',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'movement_code',
        field: (row) => row.movement.code ?? '',
        label: 'Código de movimiento',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'concept',
        field: (row) => row.details[0].concept ?? '',
        label: 'Concepto',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'sub_voucher',
        field: (row) => row.authorization?.voucher?.id ?? '',
        label: 'Codigo de comprobante',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'voucher',
        field: (row) => row.authorization?.voucher?.code ?? '',

        label: 'Numero de comprobante',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'bank_description',
        field: (row) => row.details[0].bank.description ?? '',
        label: 'Banco',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'account_bank',
        field: (row) => row.details[0].bank_account.account_bank ?? '',
        label: 'Cuenta bancaria',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'valor',
        field: (row) => formatCurrency(row.details[0].value) ?? '',
        label: 'Valor',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        name: 'status',
        field: (row) => row.status.status ?? '',
        label: 'Estado',
        required: false,
        sortable: true,
        align: 'left',
      },
      {
        field: 'id',
        name: 'select',
        label: 'Anular',
        align: 'left',
        sortable: false,
        required: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const initialModelsValues: IBankingNetworkUploadAnnulate = {
    income_record_ids: [],
    annulate_date: formatDate(dateNow, 'YYYY-MM-DD'),
    annulate_period: formatDate(dateNow, 'YYYYMM'),
    vigency: formatDate(dateNow, 'YYYY'),
    annulate_code_id: 0,
    annulate_observations: '',
  }
  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  watch(
    banking_network_uploads_data,
    (newVal) => {
      infoModels.value.business = newVal?.business_trust.code ?? ''
      infoModels.value.business_name = newVal?.business_trust.name ?? ''
      infoModels.value.bank = newVal?.bank.code ?? ''
      infoModels.value.bank_name = newVal?.bank.description ?? ''
      infoModels.value.format = newVal?.format_type.code ?? ''
      infoModels.value.format_name = newVal?.format_type.description ?? ''
      infoModels.value.closing_date = newVal?.created_at ?? ''
      infoModels.value.upload_date = newVal?.uploaded_at ?? ''
      infoModels.value.bank_account = newVal?.bank_account.account_number ?? ''
      infoModels.value.bank_account_name =
        newVal?.bank_account.account_type ?? ''
      infoModels.value.upload_status = newVal?.status.status ?? ''
      infoModels.value.upload_number = newVal?.id.toString() ?? ''
      infoModels.value.office = newVal?.office?.office_code ?? ''
      infoModels.value.office_name = newVal?.office?.office_description ?? ''
    },
    { deep: true }
  )

  watch(
    () => banking_network_uploads_record.value,
    () => {
      tableProps.value.rows = banking_network_uploads_record.value || []
    }
  )

  watch(
    () => listRecords.value,
    () => {
      models.value.income_record_ids = listRecords.value || []
    }
  )

  watch(
    () => models.value.annulate_date,
    (newVal) => {
      if (!newVal) return ''
      const [year, month] = newVal.split('-')
      models.value.annulate_period = year + month
      models.value.vigency = year
    }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  const holidays = ref<string[]>([])

  const cleanDetailForm = () => {
    listRecords.value = []
    models.value = { ...initialModelsValues }
  }

  onMounted(async () => {
    holidays.value = await getHolidaysByYear(new Date().getFullYear())
  })

  const isIndeterminate = computed(() => {
    const rows = tableProps.value.rows || []
    if (rows.length === 0) return false
    const selectedInPage = rows.filter((row) =>
      listRecords.value.includes(row.id)
    )
    return selectedInPage.length > 0 && selectedInPage.length < rows.length
  })

  const allSelected = computed({
    get: () => {
      if (isIndeterminate.value) return null
      const rows = tableProps.value.rows || []
      if (rows.length === 0) return false
      return rows.every((row) => listRecords.value.includes(row.id))
    },
    set: (val) => {
      const rows = tableProps.value.rows || []
      const rowIds = rows.map((r) => r.id)
      if (val === true || val === null) {
        const newIds = rowIds.filter((id) => !listRecords.value.includes(id))
        listRecords.value = [...listRecords.value, ...newIds]
      } else {
        listRecords.value = listRecords.value.filter(
          (id) => !rowIds.includes(id)
        )
        listRecords.value = listRecords.value.filter(
          (id) => !rowIds.includes(id)
        )
      }
    },
  })

  return {
    infoModels,
    tableProps,
    listRecords,
    models,
    holidays,
    treasury_cancellation_codes,
    banking_network_uploads_record,

    is_required,
    formatDate,
    valid_format_date,
    isDateAllowed,
    cleanDetailForm,
    allSelected,
  }
}

export default useCancelLoadBanksDetail
