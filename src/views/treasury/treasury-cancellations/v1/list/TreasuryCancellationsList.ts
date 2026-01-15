import { computed, onBeforeMount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import router from '@/router'

import { useMainLoader, useRules, useUtils } from '@/composables'

import {
  ITreasureCancellations,
  IFieldFilters,
  ITreasureCancellationsChecks,
} from '@/interfaces/customs'

import {
  useResourceManagerStore,
  useTreasuryResourceStore,
  useTreasuryCancellationsStore,
} from '@/stores'

const useTreasuryCancellationsList = () => {
  const { defaultIconsLucide, formatParamsCustom, formatCurrencyString } =
    useUtils()
  const { openMainLoader } = useMainLoader()
  const { is_required } = useRules()

  const {
    business_bank_accounts_bulk: bankAccountsSelect,
    treasury_movement_vouchers: vouchersSelect,
    treasury_number_transfers: transfersSelect,
    treasury_cancellation_codes: codesSelect,
    treasury_cancellation_types: typesSelect,
    sub_receipt_types: subReceiptTypesSelect,
    business_trusts_egreso: businessSelect,
    receipt_types: receiptTypesSelect,
    treasury_periods: periodsSelect,
    checkbooks: checkbooksSelect,
    banks: banksSelect,
  } = storeToRefs(useTreasuryResourceStore('v1'))
  const { treasury_cancellations_list } = storeToRefs(
    useTreasuryCancellationsStore('v1')
  )
  const { _listAction, _deleteChecksAction, _setTreasuryCancellationSelected } =
    useTreasuryCancellationsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const filtersFormatType = ref<Record<string, string | number>>({})
  const filtersFormat = ref<Record<string, string | number>>({})
  const selectedBusinessId = ref<string | number | null>(null)
  const selectedRows = ref<{ consecutive: number }[]>([])
  const selectedDocumentType = ref<string | null>(null)
  const titleSection = ref<string>('')
  const cancellationModalRef = ref()
  const isTableEmpty = ref(true)
  const isLoaded = ref(false)
  const filterKey = ref(0)
  const filtersRef = ref()
  const showState = ref(0)
  const selectedPeriod = ref<string | number | null>(null)
  const selectReceiptTypeId = ref<string | number | null>(null)
  const selectSubReceiptTypeId = ref<string | number | null>(null)

  const keysTes = [
    'treasury_cancellation_codes',
    'treasury_cancellation_types',
    'treasury_periods',
    'receipt_types',
  ]

  const cancellationModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea anular el registro?',
  })

  const headerProperties = {
    title: 'Anulaciones de tesorería',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Anulaciones de tesorería',
        route: 'TreasuryCancellationsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: businessSelect,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'business_name',
      label: 'Nombre negocio',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'cancellation_code_id',
      label: 'Código de anulación*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: codesSelect,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val)],
    },
    {
      name: 'name_cancellation',
      label: 'Nombre código de anulación',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'type',
      label: 'Tipo',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-6',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'document_query',
      label: 'Opción de consulta por documento*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-6',
      options: typesSelect,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val)],
    },
  ])

  const filterConfigType = ref<IFieldFilters[]>([])
  const filterComponentRef = ref()

  const tableProperties = ref({
    title: '',
    loading: false,
    columns: [] as QTable['columns'],
    rows: [] as ITreasureCancellations[],
  })

  const selectStructure = (structureId: number, filterName: string) => {
    filtersFormat.value[filterName] = structureId
    selectReceiptTypeId.value = structureId
    _resetKeys({
      treasury: ['sub_receipt_types'],
    })

    filterComponentRef.value.cleanFiltersByNames(['sub_receipt_type_id'])
  }

  const onChangePeriod = (period: string | number | null) => {
    selectedPeriod.value = period
    filterComponentRef.value.cleanFiltersByNames(['treasury_number_transfers'])
  }

  const onChangeSubReceiptType = (period: string | number | null) => {
    selectSubReceiptTypeId.value = period
  }

  const updateFieldsByDocumentType = (type: string | null) => {
    switch (type) {
      case 'Movimiento de tesorería':
        titleSection.value = 'Movimiento de tesorería'
        filterConfigType.value = [
          {
            name: 'period',
            label: 'Período',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: periodsSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
            onChange: onChangePeriod,
          },
          {
            name: 'receipt_type_id',
            label: 'Código de comprobante',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: receiptTypesSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
            onChange: selectStructure,
          },
          {
            name: 'sub_receipt_type_id',
            label: 'Código de subcomprobante',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: subReceiptTypesSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
            onChange: onChangeSubReceiptType,
          },
          {
            name: 'voucher_id',
            label: 'Número de comprobante',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: vouchersSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
          },
        ]
        tableProperties.value.title = 'Detalles del movimiento de tesorería'
        tableProperties.value.columns = [
          {
            name: 'id',
            label: '#',
            field: 'id',
            align: 'left',
            sortable: true,
          },
          {
            name: 'line_number',
            label: 'Número de movimiento',
            field: (row) => row.treasury_movement.line_number || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'period',
            label: 'Período',
            field: (row) => row.treasury_movement.period || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'date',
            label: 'Fecha',
            field: (row) => row.date || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'code',
            label: 'Código de movimiento',
            field: (row) => `${row.treasury_movement_code.code ?? ''} - ${row.treasury_movement_code.description ?? ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'concept',
            label: 'Concepto',
            field: (row) => row.concept || '-',
            align: 'left',
            sortable: true,
          },
          {
            name: 'voucher_number',
            label: 'Código de comprobante',
            field: (row) => row.voucher_number || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'sub_voucher',
            label: 'Código de subcomprobante',
            field: (row) => row.sub_voucher || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'voucher',
            label: 'Número de comprobante',
            field: (row) => row.voucher || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'payment_order',
            label: 'Orden de pago',
            field: '-',
            align: 'left',
            sortable: true,
          },
          {
            name: 'expiration_date',
            label: 'Vigencia',
            field: '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'bank',
            label: 'Banco',
            field: (row) => `${row.bank.code ?? ''} - ${row.bank.description ?? ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'bank_account',
            label: 'Cuenta bancaria',
            field: (row) => `${row.bank_account.account_bank ?? ''} - ${row.bank_account.account_name ?? ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'cheque',
            label: 'Número de cheque',
            field: (row) => row.cheque.consecutive || '-',
            align: 'left',
            sortable: true,
          },
          {
            name: 'value',
            label: 'Valor',
            field: (row) => formatCurrencyString(row.value.local) || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'reconciled',
            label: 'Conciliado',
            field: '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'actions',
            label: 'Acciones',
            field: 'actions',
            align: 'center',
            sortable: true,
          },
        ]
        filterKey.value++
        break

      case 'Traslados':
        titleSection.value = 'Traslados'
        filterConfigType.value = [
          {
            name: 'period',
            label: 'Período',
            type: 'q-select',
            value: '202507',
            class: 'col-12 col-md-6',
            options: periodsSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
            onChange: onChangePeriod,
          },
          {
            name: 'treasury_number_transfers',
            label: 'Número de traslado',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: transfersSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
          },
        ]
        tableProperties.value.title = 'Detalles de traslados'
        tableProperties.value.columns = [
          {
            name: 'id',
            label: '#',
            field: 'id',
            align: 'left',
            sortable: true,
          },
          {
            name: 'transfer_number',
            label: 'Número de traslado',
            field: (row) => row.id || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'period',
            label: 'Período',
            field: (row) => row.period || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'date',
            label: 'Fecha',
            field: (row) => row.date || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'origin_movement_code',
            label: 'Código de movimiento origen',
            field: (row) => `${row.origin.movement_code.code || ''} - ${row.origin.movement_code.description || ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'origin_business_trust',
            label: 'Negocio origen',
            field: (row) => `${row.origin.business_trust.code || ''} - ${row.origin.business_trust.name || ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'origin_bank',
            label: 'Banco origen',
            field: (row) => `${row.origin.bank.code || ''} - ${row.origin.bank.description || ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'origin_bank_account',
            label: 'Cuenta origen',
            field: (row) =>
              `${row.origin.bank_account.account_number}-${row.origin.bank_account.account_name}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'origin_found',
            label: 'Fondo origen',
            field: (row) => `${row.origin.found?.code || ''} - ${row.origin.found?.name || ''}`,
            align: 'left',
            sortable: true,
          },
          {
            name: 'origin_investment_plan',
            label: 'Plan de inversión origen',
            field: (row) => `${row.origin.investment_plan?.code || ''} - ${row.origin.investment_plan?.name || ''}`,
            align: 'left',
            sortable: true,
          },
          {
            name: 'destination_movement_code',
            label: 'Código de movimiento destino',
            field: (row) => `${row.destination.movement_code.code || ''} - ${row.destination.movement_code.description || ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'destination_business_trust',
            label: 'Negocio destino',
            field: (row) => `${row.destination.business_trust.code || ''} - ${row.destination.business_trust.name || ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'destination_bank',
            label: 'Banco destino',
            field: (row) => `${row.destination.bank.code || ''} - ${row.destination.bank.description || ''}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'destination_bank_account',
            label: 'Cuenta destino',
            field: (row) =>
              `${row.destination.bank_account.account_number}-${row.destination.bank_account.account_name}`,
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'destination_found',
            label: 'Fondo destino',
            field: (row) => `${row.destination.found?.code || ''} - ${row.destination.found?.name || ''}`,
            align: 'left',
            sortable: true,
          },
          {
            name: 'destination_investment_plan',
            label: 'Plan de inversión destino',
            field: (row) => `${row.destination.investment_plan?.code || ''} - ${row.destination.investment_plan?.name || ''}`,
            align: 'left',
            sortable: true,
          },
          {
            name: 'value',
            label: 'Valor',
            field: (row) => formatCurrencyString(row.value.local) || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'reconciled',
            label: 'Conciliado',
            field: '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'actions',
            label: 'Acciones',
            field: 'actions',
            align: 'center',
            sortable: true,
          },
        ]
        filterKey.value++
        break

      case 'Cheque':
        titleSection.value = 'Cheque'
        filterConfigType.value = [
          {
            name: 'bank_id',
            label: 'Banco',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: banksSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
          },
          {
            name: 'bank_account_id',
            label: 'Cuenta bancaria',
            type: 'q-select',
            value: null,
            class: 'col-12 col-md-6',
            options: bankAccountsSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
          },
          {
            name: 'checkbook_id',
            label: 'Chequera',
            type: 'q-select',
            value: null,
            class: 'col-12',
            options: checkbooksSelect,
            disable: false,
            clean_value: true,
            autocomplete: true,
            placeholder: 'Seleccione',
          },
        ]
        tableProperties.value.title = 'Detalles de cheques'
        tableProperties.value.columns = [
          {
            name: 'id',
            label: '#',
            field: 'id',
            align: 'left',
            sortable: true,
          },
          {
            name: 'bank',
            label: 'Banco',
            field: (row) => row.bank.description || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'bank_account',
            label: 'Cuenta bancaria',
            field: (row) => row.bank_account.account_bank || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'checkbook',
            label: 'Chequera',
            field: (row) => row.checkbook.code || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'consecutive',
            label: 'Número de cheque',
            field: (row) => row.consecutive || '-',
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'status',
            label: 'Estado',
            field: (row) => row.status || '',
            align: 'center',
            sortable: true,
            required: true,
          },
          {
            name: 'cancelled',
            label: 'Anula',
            field: (row) => (selectedRows.value.includes(row) ? 'Sí' : 'No'),
            align: 'left',
            sortable: true,
            required: true,
          },
          {
            name: 'actions',
            label: 'Acciones',
            field: 'actions',
            align: 'center',
            sortable: true,
          },
        ]
        filterKey.value++
        break

      default:
        titleSection.value = ''
        filterConfigType.value = []
        tableProperties.value.title = ''
        tableProperties.value.columns = []
    }
  }

  const loadResources = async () => {
    isLoaded.value = false
    openMainLoader(true)

    await _getResources({ treasury: keysTes }, '', 'v2')
    await _getResources({ treasury: ['business_trusts_egreso'] })

    setTimeout(() => {
      openMainLoader(false)
      isLoaded.value = true
    }, 1000)
  }

  const loadData = async (filters: string) => {
    tableProperties.value.loading = true
    tableProperties.value.rows = []

    await _listAction(filters)

    const hasResults = treasury_cancellations_list.value.length > 0

    showState.value = filters ? 1 : 0
    isTableEmpty.value = !hasResults

    setTimeout(() => {
      tableProperties.value.loading = false
    }, 1000)
  }

  const handleFilter = async ($filter: {
    'filter[cancellation_code_id]': string
    'filter[business_trust_id]': string
    'filter[document_query]': string
  }) => {
    filtersFormat.value = { ...$filter }

    const documentType = $filter['filter[document_query]']
    selectedDocumentType.value = documentType

    updateFieldsByDocumentType(documentType)
  }

  const handleFilterType = ($filter: {
    'filter[treasury_number_transfers]': string
    'filter[sub_receipt_type_id]': string
    'filter[bank_account_id]': string
    'filter[receipt_type_id]': string
    'filter[checkbook_id]': string
    'filter[voucher_id]': string
    'filter[bank_id]': string
    'filter[period]': string
  }) => {
    const generalFilters: Record<string, string | number> = {}

    const allowedFilters = [
      'filter[cancellation_code_id]',
      'filter[business_trust_id]',
      'filter[document_query]',
    ]
    for (const key of allowedFilters) {
      if (key === 'filter[document_query]')
        generalFilters['document_query'] = filtersFormat.value[key]
      else generalFilters[key] = filtersFormat.value[key]
    }

    const combinedFilters = {
      ...generalFilters,
      ...$filter,
    }

    filtersFormatType.value = { ...$filter }

    loadData(formatParamsCustom(combinedFilters))
  }

  const onChangeFilter = async (values: Record<string, string | number>) => {
    const selectedCodeCancellation = values['filter[cancellation_code_id]']
    selectedBusinessId.value = values['filter[business_trust_id]']

    if (!selectedBusinessId.value && !selectedCodeCancellation) return

    if (selectedBusinessId.value) {
      filtersRef.value?.setFieldValueByName(
        'business',
        selectedBusinessId.value
      )

      const selectedBusiness = businessSelect.value.find(
        (business) =>
          Number(business.value) === Number(selectedBusinessId.value)
      )

      if (selectedBusiness) {
        filtersRef.value?.setFieldValueByName(
          'business_name',
          selectedBusiness.name ?? ''
        )

        await _getResources(
          {
            treasury: ['banks'],
          },
          `filter[business_trust]=${selectedBusinessId.value}`,
          'v2'
        )
      }
    }

    if (selectedCodeCancellation) {
      filtersRef.value?.setFieldValueByName(
        'cancellation_code_id',
        selectedCodeCancellation
      )

      const selectedCode = codesSelect.value.find(
        (code) => String(code.value) === String(selectedCodeCancellation)
      )

      if (selectedCode) {
        filtersRef.value?.setFieldValueByName(
          'name_cancellation',
          selectedCode.name ?? ''
        )
        filtersRef.value?.setFieldValueByName(
          'type',
          selectedCode.description ?? ''
        )
      }
    }
  }

  const onChangeFilterType = async (
    values: Record<string, string | number>
  ) => {
    const selectedReceiptTypeId = values['filter[receipt_type_id]']
    const selectedBankAccountId = values['filter[bank_account_id]']
    const selectedBankId = values['filter[bank_id]']

    if (!selectedReceiptTypeId && !selectedBankId && !selectedBankAccountId)
      return

    if (selectedReceiptTypeId)
      await _getResources(
        {
          treasury: ['sub_receipt_types'],
        },
        `filter[receipt_type_id]=${selectedReceiptTypeId}`,
        'v2'
      )

    if (selectedBankId)
      await _getResources(
        {
          treasury: ['business_bank_accounts'],
        },
        `business_id=${selectedBusinessId.value}&filter[has_checkbook]=true&bank_id=${selectedBankId}`,
        'v2'
      )

    if (selectedBankAccountId)
      await _getResources(
        {
          treasury: ['checkbooks'],
        },
        `business_trust_id=${selectedBusinessId.value}&bank_id=${selectedBankId}&bank_account_id=${selectedBankAccountId}`,
        'v2'
      )
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    isTableEmpty.value = true
    selectedDocumentType.value = null
  }

  const handleClearFiltersType = () => {
    isTableEmpty.value = true
    filtersFormatType.value = {}
    tableProperties.value.rows = []
  }

  const openModalCancellation = () => cancellationModalRef.value.openModal()

  const handleCancellation = async () => {
    const consecutives = selectedRows.value.map((row) => row.consecutive)

    const payload: ITreasureCancellationsChecks = {
      consecutives,
      business_trust_id: Number(
        filtersFormat.value['filter[business_trust_id]']
      ),
      cancellation_code_id: Number(
        filtersFormat.value['filter[cancellation_code_id]']
      ),
      bank_id: Number(filtersFormatType.value['filter[bank_id]']),
      bank_account_id: Number(
        filtersFormatType.value['filter[bank_account_id]']
      ),
      checkbook_id: Number(filtersFormatType.value['filter[checkbook_id]']),
    }

    const success = await _deleteChecksAction(payload)

    filtersFormat.value.document_query =
      filtersFormat.value['filter[document_query]']

    const combinedFilters = {
      ...filtersFormat.value,
      ...filtersFormatType.value,
    }

    if (success) loadData(formatParamsCustom(combinedFilters))

    cancellationModalRef.value.closeModal()
  }

  const handleGoTo = (
    goURL: string,
    document_query?: string | null,
    authorization_type?: string,
    id?: number
  ) => {
    if (authorization_type === 'Ingresos') authorization_type = 'income'
    else if (authorization_type === 'Egresos') authorization_type = 'expense'
    else if (authorization_type === 'Traslados') authorization_type = 'transfer'
    const checkbookId = filtersFormatType.value['filter[checkbook_id]']

    if (document_query) {
      router.push({
        name: goURL,
        params: { id: checkbookId ?? id },
        query: { document_query, authorization_type, consecutive: id },
      })
    } else {
      router.push({
        name: goURL,
        params: { id: checkbookId ?? id },
      })
    }
  }

  const alertModalViewDetailsRef = ref()
  const alertModalViewDetailsConfig = ref({
    title: null as string | null,
    id: 0 as number | 0,
    type: null as string | null,
    documentType: null as string | null,
  })

  const handleView = (id:number, type: string, documentType: string) => {
    const typeMap:Record<string, string> = {
      Ingresos: 'income',
      Egresos: 'expense',
      Traslados: 'transfer',
    }

    let title:string = ''

    if (documentType === 'Movimiento de tesorería') {
      title = type === 'income' ? 'Ver detalles de anulación de ingresos' : 'Ver detalles de anulación de egresos'
    } else if (documentType === 'Traslados')
      title = 'Ver detalles de anulación de traslado'
    else title = 'Ver detalles de anulación de cheque'

    type = typeMap[type] ?? type

    alertModalViewDetailsConfig.value.title = title
    alertModalViewDetailsConfig.value.id = id
    alertModalViewDetailsConfig.value.type = type
    alertModalViewDetailsConfig.value.documentType = documentType
    alertModalViewDetailsRef.value.openModal()
  }

  const onContinue = () => {
    _setTreasuryCancellationSelected()

    setTimeout(() => {
      handleGoTo('TreasuryCancellationsCreate', selectedDocumentType.value)
    }, 1000)
  }

  const hasSelectedRows = computed(() => selectedRows.value.length > 0)

  watch(
    () => treasury_cancellations_list.value,
    () => (tableProperties.value.rows = treasury_cancellations_list.value)
  )

  watch(
    () => [selectedBusinessId.value, selectedPeriod.value],
    async () => {
      if (selectedBusinessId.value && selectedPeriod.value) {
        await _getResources(
          { treasury: ['treasury_number_transfers'] },
          `filter[period]=${selectedPeriod.value}&filter[business_trust_id]=${selectedBusinessId.value}`,
          'v2'
        )
      }
    },
    {
      deep: true,
    }
  )

  watch(
    () => [
      selectedBusinessId.value,
      selectedPeriod.value,
      selectReceiptTypeId.value,
      selectSubReceiptTypeId.value,
    ],
    async () => {
      if (
        selectedBusinessId.value &&
        selectedPeriod.value &&
        selectReceiptTypeId.value &&
        selectSubReceiptTypeId.value
      ) {
        await _getResources(
          {
            treasury: ['treasury_movement_vouchers'],
          },
          `filter[business_trust_id]=${selectedBusinessId.value}&filter[period]=${selectedPeriod.value}&filter[receipt_type_id]=${selectReceiptTypeId.value}&filter[sub_receipt_type_id]=${selectSubReceiptTypeId.value}`,
          'v2'
        )
      }
    },
    {
      deep: true,
    }
  )

  onMounted(() => loadResources())

  onBeforeMount(() =>
    _resetKeys({
      treasury: [...keysTes, 'treasury_movement_vouchers', 'sub_receipt_types'],
      trust_business: ['business_trusts'],
    })
  )

  return {
    filterComponentRef,
    isLoaded,
    showState,
    filterKey,
    filtersRef,
    alertModalViewDetailsConfig,
    alertModalViewDetailsRef,
    handleView,
    selectedRows,
    isTableEmpty,
    titleSection,
    filterConfig,
    handleFilter,
    onChangeFilter,
    hasSelectedRows,
    tableProperties,
    filterConfigType,
    handleFilterType,
    headerProperties,
    defaultIconsLucide,
    onChangeFilterType,
    handleClearFilters,
    handleCancellation,
    cancellationModalRef,
    selectedDocumentType,
    openModalCancellation,
    handleClearFiltersType,
    cancellationModalConfig,

    onContinue,
  }
}

export default useTreasuryCancellationsList
