// vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IFieldFilters, IInvoiceCommissionNote } from '@/interfaces/customs'
import {
  useAlert,
  useGoToUrl,
  useRouteValidator,
  useUtils,
} from '@/composables'

// Constants
import { note_type } from '@/constants'

// Stores
import { useAdjustmentNoteRecordStore } from '@/stores'

const useAdjustmentNoteRecordList = () => {
  const { _listInvoicesCommissionsNote } = useAdjustmentNoteRecordStore('v1')
  const { list_invoices_comissions_note, list_invoices_comissions_note_pages } =
    storeToRefs(useAdjustmentNoteRecordStore('v1'))

  const { validateRouter } = useRouteValidator()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()
  const { defaultIconsLucide, formatCurrencyString } = useUtils()

  const headerProps = {
    title: 'Registros de notas de ajuste',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Facturación y cartera', route: '' },
      {
        label: 'Registros de notas de ajuste',
        route: 'InvoicesCommissionNotesList',
      },
    ],
  }

  const holidays = ref<string[]>([])

  const handlerHolidays = async (year: number) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  const selectedRecords = ref<IInvoiceCommissionNote[]>([])
  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'adjustment_notes',
      label: 'Fecha de ajuste',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      mask: 'YYYY-MM-DD',
      clean_value: true,
      disable: false,
      navigation_max_year: new Date().getFullYear().toString(),
      navigation_min_year: '1000/01',
      option_calendar: ($event) =>
        useUtils().isDateAllowed($event, holidays.value),
      onNavigation: async ({ year }: { year: number }) => {
        handlerHolidays(year)
      },
    },
    {
      name: 'invoice_number',
      label: 'Número de factura',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      placeholder: 'Inserte',
      clean_value: true,
      disable: false,
    },
    {
      name: 'note_type',
      label: 'Tipo de ajuste',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: note_type,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-3',
      prepend_icon: defaultIconsLucide.magnify,
      placeholder: 'Buscar por Tercero o Número de nota',
      clean_value: true,
      disable: false,
    },
  ])

  const tableProps = ref({
    title: 'Listado de notas de ajuste',
    loading: false,
    columns: [
      { name: 'id', field: 'id', label: '#', align: 'left', sortable: true },
      {
        name: 'id',
        field: 'id',
        label: 'Número de nota',
        align: 'left',
        sortable: true,
      },
      {
        name: 'invoice_number',
        field: 'invoice_number',
        label: 'Número de factura',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third',
        field: (row) =>
          `${row.third_party_billings_document_snapshot ?? ''}-${
            row.third_party_billings_name_snapshot ?? ''
          }`,
        label: 'Tercero',
        align: 'left',
        sortable: true,
      },
      {
        name: 'note_type',
        field: (row) => row.adjustment_notes?.note_type ?? '',
        label: 'Tipo de ajuste',
        align: 'left',
        sortable: true,
      },
      {
        name: 'note_adjustment_total',
        field: (row) => row.adjustment_notes?.amount ?? '',
        label: 'Valor total de ajuste',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      {
        name: 'invoice_date',
        field: (row) => row.adjustment_notes?.adjustment_date ?? '',
        label: 'Fecha de ajuste',
        align: 'left',
        sortable: true,
      },
      {
        name: 'invoice_total',
        field: 'invoice_total',
        label: 'Valor total factura',
        align: 'left',
        sortable: true,
        format: (val: number) => formatCurrencyString(val),
      },
      { name: 'actions', field: 'actions', label: 'Acciones', align: 'center' },
    ] as QTable['columns'],
    rows: [] as IInvoiceCommissionNote[],
    pages: list_invoices_comissions_note_pages.value,
  })

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
    'filter[adjustment_notes]': string
    'filter[invoice_number]': string
    'filter[note_type]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rows: filtersFormat.value.rows,
    }

    await listAction(filtersFormat.value)
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _listInvoicesCommissionsNote(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updatePerPage = async (rows: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rows = rows

    await listAction(filtersFormat.value)
  }

  const handleClearFilters = () => {
    tableProps.value.rows = []
  }

  const hasAdjustmentNote = (row: IInvoiceCommissionNote) => {
    return !!(row?.adjustment_notes && Object.keys(row.adjustment_notes).length)
  }

  const handleCreate = () => {
    if (!selectedRecords.value.length) return

    const first = selectedRecords.value[0]
    if (hasAdjustmentNote(first)) {
      showAlert(
        'La factura seleccionada ya tiene una nota de ajuste asignada',
        'warning'
      )
      return
    }
    goToURL('AdjustmentNoteRecordCreate', undefined, {
      ids: selectedRecords.value.map((r) => r.id).join(','),
    })
  }

  const handleView = (row: IInvoiceCommissionNote) => {
    if (hasAdjustmentNote(row)) {
      goToURL('AdjustmentNoteRecordView', row.id)
    } else {
      showAlert('Primero debes crear una nota de ajuste', 'warning')
    }
  }

  const handleEdit = (row: IInvoiceCommissionNote) => {
    if (hasAdjustmentNote(row)) {
      goToURL('AdjustmentNoteRecordEdit', {
        invoiceId: row.id,
        noteId: row.adjustment_notes?.id,
      })
    } else {
      showAlert(
        'No se puede editar porque la factura no tiene notas de ajuste',
        'warning'
      )
    }
  }

  watch(
    list_invoices_comissions_note,
    () => {
      tableProps.value.rows = [...list_invoices_comissions_note.value]
      tableProps.value.pages = list_invoices_comissions_note_pages.value
    },
    { deep: true }
  )

  onMounted(() => {
    handlerHolidays(new Date().getFullYear())
    tableProps.value.rows = []
  })

  return {
    headerProps,
    filterConfig,
    filtersFormat,
    tableProps,
    selectedRecords,
    defaultIconsLucide,
    updatePage,
    updatePerPage,
    handleFilter,
    handleClearFilters,
    handleEdit,
    handleCreate,
    handleView,
    validateRouter,
  }
}

export default useAdjustmentNoteRecordList
