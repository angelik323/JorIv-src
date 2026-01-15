// Vue
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ISupportDocumentNumberingBusinessTrust } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { IBaseTableProps } from '@/interfaces/global/Table'
import { StatusID } from '@/interfaces/global/Status'

// Composables
import { useGoToUrl, useRouteValidator, useUtils } from '@/composables'

// Stores
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'

export const useSupportDocumentNumberingBusinessList = (props: {
  resolutionId: number | null
  third_party_id: null | number
}) => {
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const route = useRoute()
  const supportDocumentNumberingId = +route.params.id

  const isRowActive = (status_id: number) => status_id === StatusID.ACTIVE

  const { defaultIconsLucide } = useUtils()

  const {
    _updateSupportDocumentNumberingBusiness,
    _getSupportDocumentNumberingBusinessList,
  } = useSupportDocumentNumberingStore('v1')

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    row: null as null | ISupportDocumentNumberingBusinessTrust,
  })

  const tableProps = ref<
    IBaseTableProps<ISupportDocumentNumberingBusinessTrust>
  >({
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
        name: 'business_code',
        required: false,
        label: 'Negocio',
        field: 'business_code',
        sortable: true,
        align: 'left',
      },
      {
        name: 'name',
        required: false,
        label: 'Nombre de negocio',
        field: 'name',
        sortable: true,
        align: 'left',
      },
      {
        name: 'business_mod',
        required: false,
        label: 'Modalidad del negocio',
        field: 'business_mod',
        sortable: true,
        align: 'left',
      },
      {
        name: 'handles_issuer_data',
        required: false,
        label: 'Maneja datos del emisor',
        field: 'handles_issuer_data',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        field: 'status',
        sortable: true,
        align: 'left',
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

  const handleChangeIssuerData = (
    row: ISupportDocumentNumberingBusinessTrust
  ) => {
    row.handles_issuer_data = !row.handles_issuer_data
    const payload = {
      business_trust_id: row.id,
      support_document_numbering_resolution_id: props.resolutionId,
      handles_issuer_data: row.handles_issuer_data,
      status_id: row.status.id,
    }
    _updateSupportDocumentNumberingBusiness(payload, false)
  }

  const openAlertModal = (row: ISupportDocumentNumberingBusinessTrust) => {
    if (
      !validateRouter('AccountsPayable', 'SupportDocumentNumberingList', 'edit')
    )
      return

    alertModalConfig.value.row = row

    const newStatus =
      row.status.id === StatusID.ACTIVE ? 'inactivar' : 'activar'

    alertModalConfig.value.title = `¿Está seguro que desea ${newStatus} el negocio?`

    alertModalRef.value?.openModal()
  }

  const toggleStatus = async () => {
    if (!alertModalConfig.value.row) return
    const newStatus =
      alertModalConfig.value.row.status.id === StatusID.ACTIVE
        ? StatusID.INACTIVE
        : StatusID.ACTIVE
    const payload = {
      business_trust_id: alertModalConfig.value.row.id,
      support_document_numbering_resolution_id: props.resolutionId,
      handles_issuer_data: alertModalConfig.value.row.handles_issuer_data,
      status_id: newStatus,
    }
    alertModalRef.value?.closeModal()
    const success = await _updateSupportDocumentNumberingBusiness(payload)

    if (success) {
      alertModalConfig.value.row.status.id = newStatus
    }
  }

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getSupportDocumentNumberingBusinessList({
      ...filters,
      'filter[third_party_id]': props.third_party_id,
    })

    if (result) {
      tableProps.value.rows = mapBusinessList(result.list)
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

  const mapBusinessList = (list: ISupportDocumentNumberingBusinessTrust[]) => {
    return list.map((business) => {
      let handles_issuer_data = true
      let status = {
        id: 1,
        status: 'Activo',
      }
      if (business.support_document_numberings) {
        const resolution_info = business.support_document_numberings.find(
          (resolution) =>
            resolution.support_document_numbering_resolution_id ===
            props.resolutionId
        )

        if (resolution_info) {
          handles_issuer_data = resolution_info.handles_issuer_data
          status = resolution_info.status
        }
      }
      return {
        ...business,
        handles_issuer_data: handles_issuer_data,
        status: status,
      }
    })
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

  watch(
    () => props.resolutionId,
    (val) => {
      if (!val || !props.third_party_id) {
        tableProps.value.rows = []
        return
      }
      listAction(filtersFormat.value)
    }
  )

  return {
    defaultIconsLucide,
    tableProps,
    supportDocumentNumberingId,
    alertModalRef,
    alertModalConfig,
    isRowActive,
    handleChangeIssuerData,
    openAlertModal,
    toggleStatus,
    updatePage,
    updateRowsPerPage,
    goToURL,
    validateRouter,
  }
}

export default useSupportDocumentNumberingBusinessList
