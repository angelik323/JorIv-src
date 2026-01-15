import { computed, onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import moment from 'moment'

import {
  IBulkUploadForm,
  IGenericResource,
  IBulkUploadHistory,
  IBulkUploadPayload,
} from '@/interfaces/customs'

import {
  useBulkUploadStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

import { useUtils } from '@/composables'

const useBulkUploadForm = () => {
  const { _createAction } = useBulkUploadStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { offices } = storeToRefs(useFicResourceStore('v1'))
  const {
    business_banks_bulk,
    business_trusts_egreso,
    business_bank_accounts_bulk,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { bulk_upload_list } = storeToRefs(useBulkUploadStore('v1'))
  const { formatDate } = useUtils()
  const attachDocumentRef = ref<{ removeFilesRemote: () => void } | null>(null)
  const progressValue = ref(0)

  const selectOptions = computed(() => ({
    bank_accounts: business_bank_accounts_bulk.value,
    business: business_trusts_egreso.value,
    banks: business_banks_bulk.value,
    offices: offices.value,
  }))

  const formData = ref<IBulkUploadForm>({
    bulk_upload_id: 0,
    type: '',
    id_office: null,
    name_office: '',
    id_business: null,
    name_business: '',
    id_bank: null,
    name_bank: '',
    id_bank_account: null,
    name_bank_account: '',
    date: moment().format('YYYY-MM-DD'),
    load_number: '',
    status: '',
    total_records: 0,
    total_value: '',
    file: '',
  })

  const tableProperties = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'item',
        label: 'Item',
        align: 'left',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'filename',
        label: 'Nombre',
        align: 'left',
        field: 'filename',
        sortable: true,
        required: true,
      },
      {
        name: 'total_records',
        label: 'Total de registros',
        align: 'left',
        field: 'total_records',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado de cargue',
        align: 'center',
        field: (row) => row.status.id || '-',
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as IBulkUploadHistory[],
    pages: {},
  })

  const assignNameById = <K extends keyof IBulkUploadForm>(
    id: number | null,
    options: IGenericResource[],
    keyName: K
  ) => {
    const found = options.find((item) => item.value === id)
    formData.value[keyName] = (found?.name ?? '-') as IBulkUploadForm[K]
  }

  const onFileAdded = async (files: File[]) => {
    if (!files?.length) return

    const payload: IBulkUploadPayload = {
      operation_type: formData.value.type,
      office_id: formData.value.id_office,
      office_name: formData.value.name_office,
      business_trust_id: formData.value.id_business,
      bank_id: formData.value.id_bank,
      bank_account_id: formData.value.id_bank_account,
      date: formData.value.date,
      file: files[0],
    }

    tableProperties.value.loading = true

    await _createAction(payload)

    if (bulk_upload_list.value.length > 0) {
      const firstItem = bulk_upload_list.value[0]

      formData.value = {
        ...formData.value,
        bulk_upload_id: firstItem.id || 0,
        load_number: firstItem.load_number || '-',
        status: firstItem.status.status || '-',
        total_records: firstItem.total_records || 0,
        total_value: firstItem.total_value || '0.00',
      }
    }

    setTimeout(() => {
      tableProperties.value.loading = false
      attachDocumentRef.value?.removeFilesRemote()
    }, 1000)
  }

  const resetForm = () => {
    formData.value = {
      bulk_upload_id: 0,
      type: '',
      id_office: null,
      name_office: '',
      id_business: null,
      name_business: '',
      id_bank: null,
      name_bank: '',
      id_bank_account: null,
      name_bank_account: '',
      date: moment().format('YYYY-MM-DD'),
      load_number: '',
      status: '',
      total_records: null,
      total_value: '',
      file: '',
    }

    tableProperties.value.rows = []
    tableProperties.value.pages = {}

    attachDocumentRef.value?.removeFilesRemote()
  }

  const setValues = <K extends keyof IBulkUploadForm>(
    key: K,
    value: IBulkUploadForm[K]
  ) => (formData.value[key] = value)

  watch(
    () => formData.value.id_office,
    (id) => assignNameById(id, selectOptions.value.offices, 'name_office')
  )

  watch(
    () => formData.value.id_business,
    async (id) => {
      assignNameById(id, selectOptions.value.business, 'name_business')

      if (id)
        await _getResources(
          { treasury: ['business_bank_accounts'] },
          `business_id=${id}`,
          'v2'
        )
    }
  )

  watch(
    () => formData.value.id_bank,
    (id) => assignNameById(id, selectOptions.value.banks, 'name_bank')
  )

  watch(
    () => formData.value.id_bank_account,
    (id) =>
      assignNameById(id, selectOptions.value.bank_accounts, 'name_bank_account')
  )

  watch(
    () => bulk_upload_list.value,
    () => (tableProperties.value.rows = bulk_upload_list.value)
  )

  watch(
    () => formData.value.id_business,
    (val) => {
      formData.value.id_bank = null
      formData.value.name_bank = ''
      formData.value.id_bank_account = null
      formData.value.name_bank_account = ''
      if (!val) {
        _resetKeys({
          treasury: ['business_bank_accounts_bulk', 'business_banks_bulk'],
        })
        selectOptions.value.bank_accounts = []
        selectOptions.value.banks = []
      } else {
        selectOptions.value.bank_accounts = business_bank_accounts_bulk.value
        selectOptions.value.banks = business_banks_bulk.value
      }
    },
    { immediate: true }
  )

  watch(
    () => formData.value.id_bank,
    (val) => {
      if (val) {
        const filteredAccounts = business_bank_accounts_bulk.value.filter(
          (account) => account.bank_id === val
        )

        selectOptions.value.bank_accounts = filteredAccounts
      } else {
        selectOptions.value.bank_accounts = business_bank_accounts_bulk.value
      }

      formData.value.id_bank_account = null
      formData.value.name_bank_account = ''
    },
    { immediate: true }
  )

  const holidays = ref<string[]>([])

  const handlerHolidays = async ({ year }: { year: number }) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  onBeforeMount(async () => {
    _resetKeys({
      treasury: ['business_bank_accounts_bulk', 'business_banks_bulk'],
    })

    const formattedDate = formatDate(formData.value.date, 'YYYY')
    const currentYear = Number(formattedDate)
    await handlerHolidays({ year: currentYear })
  })

  return {
    formData,
    useUtils,
    holidays,
    resetForm,
    setValues,
    onFileAdded,
    selectOptions,
    progressValue,
    tableProperties,
    handlerHolidays,
    attachDocumentRef,
  }
}

export default useBulkUploadForm
