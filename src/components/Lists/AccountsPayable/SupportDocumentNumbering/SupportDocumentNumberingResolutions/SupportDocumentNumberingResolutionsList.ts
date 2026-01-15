// Vue - Pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ISupportDocumentNumberingResolution } from '@/interfaces/customs/accounts-payable/SupportDocumentNumbering'
import { IBaseTableProps } from '@/interfaces/global/Table'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Store
import { useSupportDocumentNumberingStore } from '@/stores/accounts-payable/support-document-numbering'

export const useSupportDocumentNumberingResolutionsList = (
  props: {
    third_party_id: number
  },
  emit: Function
) => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()
  const route = useRoute()
  const supportDocumentNumberingId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  const {
    _deleteSupportDocumentNumberingResolution,
    _getSupportDocumentNumberingResolutionsList,
  } = useSupportDocumentNumberingStore('v1')

  const tableProps = ref<IBaseTableProps<ISupportDocumentNumberingResolution>>({
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
        name: 'has_business_prefix',
        required: false,
        label: '¿Prefijos de negocios?',
        field: 'has_business_prefix',
        sortable: true,
        align: 'center',
      },
      {
        name: 'prefix',
        required: false,
        label: 'Prefijo',
        field: 'prefix',
        sortable: true,
        align: 'left',
      },
      {
        name: 'resolution_date',
        required: false,
        label: 'Fecha resolución',
        field: 'resolution_date',
        sortable: true,
        align: 'left',
      },
      {
        name: 'resolution',
        required: false,
        label: 'Resolución',
        field: 'resolution',
        sortable: true,
        align: 'left',
      },
      {
        name: 'range_start',
        required: false,
        label: 'Rango inicial',
        field: 'range_start',
        sortable: true,
        align: 'left',
      },
      {
        name: 'range_end',
        required: false,
        label: 'Rango final',
        field: 'range_end',
        sortable: true,
        align: 'left',
      },
      {
        name: 'validity_start_date',
        required: false,
        label: 'Fecha vigencia inicial',
        field: 'validity_start_date',
        sortable: true,
        align: 'left',
      },
      {
        name: 'validity_end_date',
        required: false,
        label: 'Fecha vigencia final',
        field: 'validity_end_date',
        sortable: true,
        align: 'left',
      },
      {
        name: 'next_available_number',
        required: false,
        label: 'Número siguiente disponible',
        field: 'next_available_number',
        sortable: true,
        align: 'left',
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

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    const result = await _getSupportDocumentNumberingResolutionsList({
      ...filters,
      'filter[third_party_id]': props.third_party_id,
    })

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

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction(filtersFormat.value)
  }

  const updateRowsPerPage = (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows
    listAction(filtersFormat.value)
  }

  const handleSelection = ({
    selected,
  }: {
    selected: ISupportDocumentNumberingResolution[]
  }) => {
    if (selected.length === 0) {
      emit('selectedResolution', null)
      return
    }
    emit(
      'selectedResolution',
      selected[0].has_business_prefix ? selected[0].id : null
    )
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar la resolución?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as number | null,
  })

  const openAlertModal = (row: ISupportDocumentNumberingResolution) => {
    alertModalConfig.value.id = row.id ?? null
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (
      await _deleteSupportDocumentNumberingResolution(alertModalConfig.value.id)
    ) {
      const index = tableProps.value.rows.findIndex(
        (resolution) => alertModalConfig.value.id === resolution.id
      )

      if (index !== -1) {
        tableProps.value.rows.splice(index, 1)
      }
    }
    openMainLoader(false)
  }

  onMounted(() => {
    listAction(filtersFormat.value)
  })

  return {
    defaultIconsLucide,
    tableProps,
    alertModalRef,
    alertModalConfig,
    supportDocumentNumberingId,
    handleSelection,
    updatePage,
    updateRowsPerPage,
    openAlertModal,
    handleDelete,
    goToURL,
    validateRouter,
  }
}

export default useSupportDocumentNumberingResolutionsList
