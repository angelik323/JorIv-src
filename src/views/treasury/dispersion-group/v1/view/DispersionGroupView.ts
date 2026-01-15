// vue | quasar | router
import { ref, onBeforeMount, watch } from 'vue'
import { QTable } from 'quasar'
import { useRoute, useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { useDispersionGroupStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { IDispersionGroupDetailsTable } from '@/interfaces/customs'
import { formatParamsCustom } from '@/utils'

const useDispersionGroupView = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const { _getByIdDispersionGroup, _downloadExcelDispersionGroupTurns } =
    useDispersionGroupStore('v1')
  const {
    data_filters,
    dispersion_group_details_pages,
    dispersion_group_details_list,
  } = storeToRefs(useDispersionGroupStore('v1'))

  // props
  const headerProps = {
    title: 'Consulta grupo de dispersión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Consulta grupo de dispersión',
        route: 'DispersionGroupList',
      },
      {
        label: 'Ver',
      },
      {
        label: id,
      },
    ],
  }
  const tableProps = ref({
    title: 'Detalle de consulta',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'account',
        required: false,
        label: 'Negocio',
        align: 'left',
        field: (row) =>
          row?.business && row?.business_name
            ? `${row?.business} - ${row?.business_name}`
            : '',
        sortable: true,
      },
      {
        name: 'bank',
        required: true,
        label: 'Banco',
        align: 'left',
        field: 'bank',
        sortable: true,
      },
      {
        name: 'bank_name',
        required: true,
        label: 'Nombre banco',
        align: 'left',
        field: 'bank_name',
        sortable: true,
      },
      {
        name: 'account',
        required: true,
        label: 'Cuenta',
        align: 'left',
        field: 'account',
        sortable: true,
      },
      {
        name: 'dispersion_group',
        required: true,
        label: 'Grupo dispersión',
        align: 'left',
        field: 'dispersion_group',
        sortable: true,
      },
      {
        name: 'date',
        required: true,
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: true,
      },
      {
        name: 'concept',
        required: true,
        label: 'Concepto',
        align: 'left',
        field: 'concept',
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'left',
        field: 'value',
        sortable: true,
      },
      {
        name: 'third_party_name',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: 'third_party_name',
        sortable: true,
      },
      {
        name: 'voucher',
        required: true,
        label: 'Comprobante',
        align: 'left',
        field: 'voucher',
        sortable: true,
      },
      {
        name: 'voucher_number',
        required: true,
        label: 'Nro de comprobante',
        align: 'left',
        field: 'voucher_number',
        sortable: true,
      },
      {
        name: 'status_movement',
        required: true,
        label: 'Estado movimiento',
        align: 'left',
        field: 'status_movement',
        sortable: true,
      },
      {
        name: 'response_bank',
        required: true,
        label: 'Respuesta Banco',
        align: 'left',
        field: 'response_bank',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IDispersionGroupDetailsTable[],
    pages: dispersion_group_details_pages,
  })

  const filtersFormat = ref<Record<string, string | number | null | undefined>>(
    { rows: 20, page: 1 }
  )

  // handlers / actions
  const onClose = async () => {
    router.push({ name: 'DispersionGroupList' })
  }

  const onDdownloadExcel = async () => {
    openMainLoader(true)

    const filters = data_filters.value as Record<string, string>

    const values = {
      'params[from_business]': filters['filter[from_business]'] ?? null,
      'params[up_business]': filters['filter[up_business]'] ?? null,
      'params[from_bank]': filters['filter[from_bank]'] ?? null,
      'params[up_bank]': filters['filter[up_bank]'] ?? null,
      'params[from_account]': filters['filter[from_account]'] ?? null,
      'params[up_account]': filters['filter[up_account]'] ?? null,
      'params[starting_date]': filters['filter[starting_date]'] ?? null,
      'params[end_date]': filters['filter[end_date]'] ?? null,
      'params[from_group]': filters['filter[from_group]'] ?? null,
      'params[up_group]': filters['filter[up_group]'] ?? null,
      'filter[id_group]': id,
    }

    const params = Object.entries(values)
      .filter(([_, value]) => value != null && value !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&')

    await _downloadExcelDispersionGroupTurns(params)
    openMainLoader(false)
  }

  const listAction = async (filter: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getByIdDispersionGroup(Number(id), filter)
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: 20,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    openMainLoader(true)

    const queryString = formatParamsCustom(filtersFormat.value)
    await _getByIdDispersionGroup(
      Number(id),
      queryString ? '&' + queryString : ''
    )

    openMainLoader(false)
  })

  // watchers
  watch(
    () => dispersion_group_details_list.value,
    () => {
      tableProps.value.rows =
        dispersion_group_details_list.value as IDispersionGroupDetailsTable[]
      tableProps.value.pages = dispersion_group_details_pages.value
    }
  )
  return {
    headerProps,
    tableProps,
    onDdownloadExcel,
    updatePerPage,
    updatePage,
    onClose,
  }
}

export default useDispersionGroupView
