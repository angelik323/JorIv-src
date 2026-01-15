// Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { ISupportDocumentNumberingItem } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { StatusID } from '@/interfaces/global/Status'
import { status } from '@/constants'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Stores
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useSupportDocumentNumberingList = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const {
    _getSupportDocumentNumberingList,
    _updateSupportDocumentNumberingStatus,
  } = useSupportDocumentNumberingStore('v1')

  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const showState = ref(false)
  const isSupportDocumentNumberingListEmpty = ref(true)

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const headerProps = {
    title: 'Resolución documento soporte',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Resolución documento soporte',
        route: 'SupportDocumentNumberingList',
      },
    ],
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    row: null as null | ISupportDocumentNumberingItem,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'id',
      label: 'NIT tributario',
      type: 'q-select',
      value: '',
      class: 'col-6',
      options: third_parties,
      autocomplete: true,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'support_document_numbering_issuer_status_id',
      label: 'Estado',
      type: 'q-select',
      value: 0,
      class: 'col-6',
      options: status,
      autocomplete: false,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const tableProps = ref<IBaseTableProps<ISupportDocumentNumberingItem>>({
    title: 'Listado de NIT tributarios',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'document',
        required: false,
        label: 'NIT tributario',
        align: 'left',
        field: 'document',
        sortable: true,
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: (row) =>
          (row.legal_person
            ? row.legal_person.business_name
            : row.natural_person?.full_name) ?? row.document,
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'support_document_numbering_issuer_status_id',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'id',
        sortable: false,
        align: 'center',
      },
    ],
    rows: [],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getSupportDocumentNumberingList(filters)

    if (result) {
      tableProps.value.rows = result.list
      tableProps.value.pages = result.pages
    }
    tableProps.value.loading = false
  }

  const filtersFormat = ref<
    {
      page: number
      rows: number
    } & Record<string, string | number>
  >({
    page: 1,
    rows: 20,
  })

  const handleFilter = async ($filters: {
    'filter[id]': number
    'filter[support_document_numbering_issuer_status_id]': number
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }
    clearData()
    await listAction(filtersFormat.value)

    showState.value = true
    isSupportDocumentNumberingListEmpty.value =
      tableProps.value.rows.length === 0
  }

  const handleClearFilters = async () => {
    clearData()
    isSupportDocumentNumberingListEmpty.value = true
    showState.value = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const openAlertModal = (row: ISupportDocumentNumberingItem) => {
    if (
      !validateRouter('AccountsPayable', 'SupportDocumentNumberingList', 'edit')
    )
      return

    alertModalConfig.value.row = row

    const newStatus =
      row.support_document_numbering_issuer_status_id === StatusID.ACTIVE
        ? 'inactivar'
        : 'activar'

    alertModalConfig.value.title = `¿Está seguro que desea ${newStatus} el nit tributario?`

    alertModalRef.value?.openModal()
  }

  const toggleStatus = async () => {
    if (!alertModalConfig.value.row) return
    alertModalRef.value?.closeModal()
    const success = await _updateSupportDocumentNumberingStatus(
      alertModalConfig.value.row.id
    )

    if (success) {
      const newStatus =
        alertModalConfig.value.row
          .support_document_numbering_issuer_status_id === StatusID.ACTIVE
          ? StatusID.INACTIVE
          : StatusID.ACTIVE

      alertModalConfig.value.row.support_document_numbering_issuer_status_id =
        newStatus
    }
  }

  const clearData = () => {
    tableProps.value.rows = []
    tableProps.value.pages = {
      currentPage: 1,
      lastPage: 1,
    }
  }

  const keys = {
    third_party: ['third_parties'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      keys,
      'fields[third_parties]=id,document,document_type_id&include[]=legalPerson&include[]=naturalPerson&include[]=documentType&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name&filter[status_id]=1'
    )
    filterConfig.value[0].options.unshift({ label: 'Todos', value: '' })
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    defaultIconsLucide,
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isSupportDocumentNumberingListEmpty,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleClearFilters,
    updatePage,
    updateRowsPerPage,
    isRowActive,
    openAlertModal,
    toggleStatus,
    goToURL,
    validateRouter,
  }
}

export default useSupportDocumentNumberingList
