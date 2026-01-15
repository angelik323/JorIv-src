import { useAlert, useMainLoader, useRules } from '@/composables'
import { GenerateScatterOptions } from '@/constants'
import {
  IFieldFilters,
  IGenerateScatterGroupFileBreakdown,
  IGenerateScatterGroupFileDetail,
} from '@/interfaces/customs'
import { useResourceManagerStore, useTreasuryResourceStore } from '@/stores'
import { useGenerateScatterGroupFileStore } from '@/stores/'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const useGenerateScatterGroupFileList = () => {
  const {
    _getListAction,
    _setDataFilters,
    _getDetailAction,
    _generateFile,
    _generateAuthorization,
  } = useGenerateScatterGroupFileStore('v1')
  const {
    generate_dispersion_group_file_list,
    generate_pages_dispersion,
    generate_dispersion_list_detail,
  } = storeToRefs(useGenerateScatterGroupFileStore('v1'))

  const {
    business_trusts_dipersion,
    banks_dispersion,
    dispersion_group,
    dispersion_file_bank_accounts,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { dispersion_file_bank_structures } = storeToRefs(
    useTreasuryResourceStore('v1')
  )
  const alertModalRef = ref()
  const filterComponentRef = ref()
  const selectedBankId = ref()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const modalFunction = ref()
  const showModal = ref(false)
  const formatDocument = ref('')
  const routerDocument = ref('')
  const selectedId = ref<IGenerateScatterGroupFileDetail | null>(null)
  const modalRef = ref()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  let perPage = 20
  const models = ref<{
    validity: string | number
    bank: string | number
    account: string | number
    group: number
    structure_bank_id?: number
    group_id?: number
    date_generate?: string
    route?: string
    motives: string
    action?: string
  }>({
    validity: '',
    bank: '',
    account: '',
    group: 0,
    motives: '',
    date_generate: new Date().toISOString().split('T')[0],
  })

  const modelKeys: Array<keyof typeof models.value> = [
    'validity',
    'bank',
    'account',
    'group',
    'structure_bank_id',
    'group_id',
    'date_generate',
    'route',
    'motives',
    'action',
  ]

  const headerProps = {
    title: 'Generar archivo de grupo de dispersión',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesoreria', route: '' },
      {
        label: 'Generar archivo de grupo de dispersión',
        route: 'GenerateScatterGroupFile',
      },
    ],
  }

  const alertModalConfig = ref({
    title: 'El archivo presentó errores',
    description: '¿Desea procesar parcialmente?',
    id: null as number | null,
  })

  const tableDetailProps = ref({
    loading: false,
    columns: [
      {
        name: 'select',
        label: '',
        required: true,
        align: 'center',
        field: 'select',
        sortable: true,
      },
      {
        name: 'id',
        label: '#',
        required: true,
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'validity',
        label: 'Vigencia',
        required: true,
        align: 'left',
        field: 'validity',
        sortable: true,
      },
      {
        name: 'business',
        label: 'Negocio',
        required: true,
        align: 'left',
        field: 'business',
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        required: true,
        align: 'left',
        field: 'bank',
        sortable: true,
      },
      {
        name: 'account',
        label: 'Cuenta bancaria',
        required: true,
        align: 'left',
        field: 'bank_account',
        sortable: true,
      },
      {
        name: 'dispersion_group',
        label: 'Grupo',
        required: true,
        align: 'left',
        field: 'group',
        sortable: true,
      },
      {
        name: 'turns',
        label: 'giros',
        required: true,
        align: 'left',
        field: 'turns',
        sortable: true,
      },
      {
        name: 'status',
        label: 'Estado',
        required: true,
        align: 'left',
        field: (row) => row.status.status,
        sortable: true,
      },
      {
        name: 'shipping_status',
        label: 'Estado de envío',
        required: true,
        align: 'left',
        field: (row) => row.status_shipping?.status ?? '-',
        sortable: true,
      },
      {
        name: 'response_bank',
        label: 'Respuesta banco',
        required: true,
        align: 'left',
        field: (row) => row.bank_response?.status ?? '-',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IGenerateScatterGroupFileDetail[],
    pages: generate_pages_dispersion,
  })

  const tableBreakdownProps = ref({
    title: 'Desglose',
    loading: false,
    columns: [
      {
        name: 'business',
        label: 'Negocio',
        required: true,
        align: 'left',
        field: (row) => (row.business ? row.business : '-'),
        sortable: true,
      },
      {
        name: 'payment_method',
        label: 'Forma de pago',
        required: true,
        align: 'left',
        field: (row) => (row.means_of_payment ? row.means_of_payment : '-'),
        sortable: true,
      },
      {
        name: 'bank',
        label: 'Banco',
        required: true,
        align: 'left',
        field: (row) => (row.bank ? row.bank : '-'),
        sortable: true,
      },
      {
        name: 'account',
        label: 'Cuenta',
        required: true,
        align: 'left',
        field: (row) => (row.bank_account ? row.bank_account : '-'),
        sortable: true,
      },
      {
        name: 'fund',
        label: 'Fondo',
        required: true,
        align: 'left',
        field: (row) => (row.found ? row.found : '-'),
        sortable: true,
      },
      {
        name: 'investment_plan',
        label: 'Plan de inversión',
        required: true,
        align: 'left',
        field: (row) => (row.plain_investment ? row.plain_investment : '-'),
        sortable: true,
      },
      {
        name: 'payment_order',
        label: 'Orden de pago',
        required: true,
        align: 'left',
        field: (row) => (row.order_payment ? row.order_payment : '-'),
        sortable: true,
      },
      {
        name: 'monetary_order',
        label: 'Orden monetaria',
        required: true,
        align: 'left',
        field: (row) => (row.operation_coin ? row.operation_coin : '-'),
        sortable: true,
      },
      {
        name: 'validity',
        label: 'Vigencia',
        required: true,
        align: 'left',
        field: (row) => (row.validity ? row.validity : '-'),
        sortable: true,
      },
      {
        name: 'document_type',
        label: 'Tipo de documento',
        required: true,
        align: 'left',
        field: (row) =>
          row.third_type_document ? row.third_type_document : '-',
        sortable: true,
      },
      {
        name: 'document_number',
        label: 'Número de documento',
        required: true,
        align: 'left',
        field: (row) =>
          row.third_party_document ? row.third_party_document : '-',
        sortable: true,
      },
      {
        name: 'destination_bank',
        label: 'Banco destino',
        required: true,
        align: 'left',
        field: (row) =>
          row.beneficiary_bank_id ? row.beneficiary_bank_id : '-',
        sortable: true,
      },
      {
        name: 'destination_account',
        label: 'Cuenta bancaria destino',
        required: true,
        align: 'left',
        field: (row) =>
          row.beneficiary_bank_account ? row.beneficiary_bank_account : '-',
        sortable: true,
      },
      {
        name: 'branch',
        label: 'Sucursal',
        required: true,
        align: 'left',
        field: (row) => (row.bank_branch ? row.bank_branch : '-'),
        sortable: true,
      },
      {
        name: 'value',
        label: 'Valor',
        required: true,
        align: 'left',
        field: (row) => (row.value ? row.value : '-'),
        sortable: true,
      },
      {
        name: 'gmf',
        label: 'GMF',
        required: true,
        align: 'center',
        field: (row) => (row.gmf ? row.gmf : '-'),
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IGenerateScatterGroupFileBreakdown[],
    pages: generate_pages_dispersion,
    rowsPerPage: perPage,
  })

  const getToday = () => {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    return `${yyyy}-${mm}-${dd}`
  }

  const loadBankAccounts = async (bankId: number) => {
    filterComponentRef.value?.cleanFiltersByNames(['bank_account'])
    const filterBankId = bankId ? `&filter[id_bank]=${bankId}` : ''

    _resetKeys({
      treasury: ['dispersion_file_bank_accounts'],
    })

    await _getResources(
      {
        treasury: [`dispersion_file_bank_accounts${filterBankId}`],
      },
      '',
      'v2'
    )
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'date_start',
      label: 'Fecha inicial *',
      type: 'q-date',
      value: getToday(),
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'Fecha inicial es requerida'),
      ],
    },
    {
      name: 'date_end',
      label: 'Fecha final *',
      type: 'q-date',
      value: getToday(),
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'Inserte',
      rules: [
        (val: string) =>
          useRules().is_required(val, 'Fecha final es requerida'),
      ],
    },
    {
      name: 'dispersion_group',
      label: 'Grupo de dispersión',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: dispersion_group,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      options: business_trusts_dipersion,
      disable: false,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'bank',
      label: 'Banco',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      options: banks_dispersion,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
      onChange: (bankId: number) => loadBankAccounts(bankId),
    },
    {
      name: 'bank_account',
      label: 'Cuenta bancaria',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      options: dispersion_file_bank_accounts,
      clean_value: true,
      autocomplete: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'option',
      label: 'Estado*',
      type: 'q-option-group',
      radioType: 'radio',
      value: null,
      options: GenerateScatterOptions,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      autocomplete: true,
      clean_value: true,
    },
  ])

  const filtersFormat = ref<Record<string, string | number | null | undefined>>(
    {}
  )

  const deleteField = async () => {
    openMainLoader(true)
    const payload = {
      group_id: models.value.group,
      action: 'delete',
      motives: models.value.motives,
    }

    if (await _generateAuthorization(payload)) {
      openMainLoader(false)
      modalRef.value = false
    }
    setTimeout(() => openMainLoader(false), 2000)
    modalRef.value = false
  }

  const createField = async () => {
    openMainLoader(true)
    const payload = {
      structure_bank_id: models.value.structure_bank_id,
      group_id:
        typeof models.value.group === 'string'
          ? Number(models.value.group)
          : models.value.group,
      date_generate: models.value.date_generate,
      route: routerDocument.value ? routerDocument.value : models.value.route,
    }
    const normalizedFormat = formatDocument.value
      .replace(/^\./, '')
      .toLowerCase() as 'csv' | 'xls' | 'xlsx' | 'txt' | 'prn' | 'gpg'

    const resetState = () => {
      tableDetailProps.value.rows = []
      tableBreakdownProps.value.rows = []
      filtersFormat.value = {}
      selectedBankId.value = null
      selectedId.value = null
      routerDocument.value = ''
      modalRef.value = false
    }

    await _generateFile(payload, normalizedFormat)
    openMainLoader(false)
    resetState()

    setTimeout(() => openMainLoader(false), 2000)
    modalRef.value = false

    modelKeys.forEach((key) => {
      if (key === 'group') {
        models.value[key] = 0
      } else if (key === 'structure_bank_id' || key === 'group_id') {
        models.value[key] = undefined
      } else {
        models.value[key] = ''
      }
    })
  }

  const handleFilter = (
    $filters: Record<string, string | number | null | undefined>
  ) => {
    const option = $filters.option ?? $filters['filter[option]'] ?? null

    const noOptionSelected =
      option === null ||
      option === undefined ||
      option === '' ||
      (Array.isArray(option) && option.length === 0)

    if (noOptionSelected) {
      _setDataFilters($filters)
      showAlert('Debes seleccionar una opción antes de continuar.', 'error')
      return
    }

    filtersFormat.value = {
      ...$filters,
    }

    _setDataFilters(filtersFormat.value)

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    tableDetailProps.value.rows = []

    filterConfig.value.forEach((f) => {
      f.value = null
    })

    filtersFormat.value = {}
    _setDataFilters({})
  }

  const listAction = async (filter: string = '') => {
    tableDetailProps.value.loading = true
    tableDetailProps.value.rows = []

    const pairs = filter.split('&')

    const filtered = pairs.filter((param) => !param.includes('_name')).join('&')

    await _getListAction(filtered)
    tableDetailProps.value.loading = false
  }

  const openFileSelector = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.txt,.csv,.xlsx,.xls'
    input.style.display = 'none'

    input.onchange = (event: Event) => {
      const target = event.target as HTMLInputElement
      const file = target.files?.[0]

      if (file) {
        const fileWithPath = file as File & {
          path?: string
          webkitRelativePath?: string
        }
        const fullPath =
          fileWithPath.path || fileWithPath.webkitRelativePath || file.name
        models.value.route = fullPath
      }

      document.body.removeChild(input)
    }

    input.oncancel = () => {
      document.body.removeChild(input)
    }

    document.body.appendChild(input)
    input.click()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }
  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const lastLoadedId = ref<number | null>(null)

  const resetModels = () => {
    modelKeys.forEach((key) => {
      if (key === 'group') {
        models.value[key] = 0
      } else if (key === 'structure_bank_id' || key === 'group_id') {
        models.value[key] = undefined
      } else {
        models.value[key] = ''
      }
    })
  }

  const openModal = (row?: IGenerateScatterGroupFileDetail | null) => {
    const currentId = typeof row?.id === 'string' ? Number(row.id) : row?.id

    resetModels()

    if (row) {
      models.value.validity = row.validity || ''
      models.value.bank = row.bank || ''
      models.value.account = row.bank_account || ''
      models.value.date_generate = new Date().toISOString().split('T')[0]
      models.value.group =
        typeof row.group === 'string'
          ? Number(row.group) || 0
          : row.group || 0
    }

    lastLoadedId.value = currentId ?? null
    modalRef.value = true
  }

  const handleClose = () => {
    routerDocument.value = ''
    modalRef.value = false
  }

  watch(
    () => generate_dispersion_group_file_list.value,
    () => {
      tableDetailProps.value.rows =
        generate_dispersion_group_file_list.value as IGenerateScatterGroupFileDetail[]
    }
  )

  watch(selectedId, async (newId, oldId) => {
    if (selectedId.value && typeof selectedId.value === 'object') {
      models.value.validity = selectedId.value.validity || ''
      models.value.bank = selectedId.value.bank || ''
      models.value.account = selectedId.value.bank_account || ''
      models.value.group =
        typeof selectedId.value.group === 'string'
          ? Number(selectedId.value.group) || 0
          : selectedId.value.group || 0
    }

    if (newId === oldId && tableBreakdownProps.value.rows.length > 0) return

    tableBreakdownProps.value.rows = []
    if (newId != null) {
      const id =
        typeof newId === 'object' && newId !== null && 'id' in newId
          ? (newId as IGenerateScatterGroupFileDetail).id
          : newId
      await _getDetailAction(id)
      if (generate_dispersion_list_detail.value) {
        tableBreakdownProps.value.rows =
          generate_dispersion_list_detail.value as IGenerateScatterGroupFileBreakdown[]
      }
    }
  })

  watch(
    () => selectedId.value,
    async (newVal) => {
      if (!newVal) return
      await _getResources(
        {
          treasury: [
            `dispersion_file_bank_structures&filter[bank_id]=${newVal.bank_id}`,
          ],
        },
        '',
        'v2'
      )
    }
  )

  watch(
    () => models.value.structure_bank_id,
    (newVal) => {
      if (!newVal) return
      const selectedBank = dispersion_file_bank_structures.value.find(
        (item) => item.value === newVal
      )
      if (selectedBank) {
        formatDocument.value = selectedBank.file_extension?.name ?? ''
        routerDocument.value = selectedBank.path ?? ''
      }
    }
  )

  onMounted(async () => {
    handleClear()
    await _getResources({
      treasury: [
        'business_trusts_dipersion',
        'banks_dispersion',
        'dispersion_group',
      ],
    })

    await _getResources(
      {
        treasury: ['dispersion_file_bank_accounts'],
      },
      '',
      'v2'
    )
  })

  onUnmounted(() => {
    _resetKeys({
      treasury: ['dispersion_file_bank_structures'],
    })
  })

  return {
    headerProps,
    selectedId,
    models,
    tableDetailProps,
    tableBreakdownProps,
    filterComponentRef,
    filterConfig,
    alertModalConfig,
    filtersFormat,
    showModal,
    alertModalRef,
    dispersion_file_bank_structures,
    modalFunction,
    modalRef,
    routerDocument,
    handleFilter,
    handleClear,
    openModal,
    openFileSelector,
    createField,
    handleClose,
    deleteField,
    updatePage,
    updatePerPage,
    selectedBankId,
  }
}

export default useGenerateScatterGroupFileList
