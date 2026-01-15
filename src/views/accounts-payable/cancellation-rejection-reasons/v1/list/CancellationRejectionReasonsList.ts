import { useGoToUrl, useMainLoader, useRules, useUtils } from '@/composables'
import {
  ICancellationRejectionReasonsItem,
  IFieldFilters,
} from '@/interfaces/customs'
import {
  useAccountsPayableResourceStore,
  useResourceManagerStore,
  useCancellationRejectionReasonsStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

export const useCancellationRejectionReasonsList = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const {
    cancellation_rejection_reasons_list,
    cancellation_rejection_reasons_pages,
  } = storeToRefs(useCancellationRejectionReasonsStore('v1'))

  const {
    _getCancellationRejectionReasonsList,
    _deleteCancellationRejectionReasons,
  } = useCancellationRejectionReasonsStore('v1')

  const { cancellation_reason_types } = storeToRefs(
    useAccountsPayableResourceStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { defaultIconsLucide } = useUtils()

  const { is_required } = useRules()

  const showState = ref(false)
  const isCancellationRejectionReasonsListEmpty = ref(true)
  const perPage = ref(20)

  const keys = {
    accounts_payable: ['cancellation_reason_types'],
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    description: '¿Desea eliminar el motivo?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: null as null | number,
  })

  const headerProps = {
    title: 'Motivos de anulación y rechazo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Motivos de anulación y rechazo',
        route: 'CancellationRejectionReasonsList',
      },
    ],
    btn: {
      icon: defaultIconsLucide.plusCircleOutline,
      label: 'Crear',
    },
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'reason_type',
      label: 'Motivo',
      type: 'q-select',
      value: 'todos',
      class: 'col-12',
      options: cancellation_reason_types,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => is_required(val, 'El motivo es requerido')],
    },
  ])

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ICancellationRejectionReasonsItem[]
    pages: typeof cancellation_rejection_reasons_pages
  }>({
    title: 'Listado motivos de anulación y rechazo',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'reason_type',
        required: false,
        label: 'Motivo',
        align: 'left',
        field: 'reason_type',
        sortable: true,
      },
      {
        name: 'reason_code',
        required: false,
        label: 'Código de motivo',
        align: 'left',
        field: 'reason_code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'left',
        field: 'description',
        sortable: true,
      },
      {
        name: 'has_reports_dian',
        required: false,
        label: 'Reporta DIAN',
        align: 'left',
        field: (row: ICancellationRejectionReasonsItem) =>
          row.reason_type === 'Anulación'
            ? row.has_reports_dian
              ? 'Si'
              : 'No'
            : 'No aplica',
        sortable: true,
      },
      {
        name: 'is_applies_tax_refund',
        required: false,
        label: 'Aplica devolución de impuestos',
        align: 'left',
        field: (row: ICancellationRejectionReasonsItem) =>
          row.reason_type === 'Anulación'
            ? row.is_applies_tax_refund
              ? 'Si'
              : 'No'
            : 'No aplica',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
    pages: cancellation_rejection_reasons_pages,
  })

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getCancellationRejectionReasonsList(filters)
    tableProps.value.loading = false
  }

  const filtersFormat = ref<Record<string, string | number | null>>({})

  const handleFilter = async ($filters: { 'filter[reason_type]'?: string }) => {
    if ($filters['filter[reason_type]'] === 'todos') {
      delete $filters['filter[reason_type]']
    }
    filtersFormat.value = {
      ...$filters,
    }

    await listAction(filtersFormat.value)

    const hasResults = cancellation_rejection_reasons_list.value.length > 0

    showState.value = filtersFormat.value ? true : false
    isCancellationRejectionReasonsListEmpty.value = !hasResults
  }

  const handleClearFilters = async () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage.value,
    }
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage.value,
    }
    await listAction(filtersFormat.value)
  }

  const openAlertModal = (row: ICancellationRejectionReasonsItem) => {
    alertModalConfig.value.id = row.id
    alertModalConfig.value.description = `¿Desea eliminar el motivo de ${row.reason_type}?`
    alertModalRef.value?.openModal()
  }

  const handleDelete = async () => {
    if (!alertModalConfig.value.id) return
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    const result = await _deleteCancellationRejectionReasons(
      alertModalConfig.value.id
    )
    if (result) {
      await listAction(filtersFormat.value)
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    await _getResources(keys)
    filterConfig.value[0].options.unshift({ label: 'Todos', value: 'todos' })
  })

  onBeforeUnmount(() => _resetKeys(keys))

  watch(
    () => cancellation_rejection_reasons_list.value,
    () => {
      tableProps.value.rows = cancellation_rejection_reasons_list.value
    }
  )

  return {
    headerProps,
    filterConfig,
    tableProps,
    showState,
    isCancellationRejectionReasonsListEmpty,
    alertModalRef,
    alertModalConfig,
    handleFilter,
    handleClearFilters,
    openAlertModal,
    handleDelete,
    updatePage,
    updateRowsPerPage,
    goToURL,
  }
}

export default useCancellationRejectionReasonsList
