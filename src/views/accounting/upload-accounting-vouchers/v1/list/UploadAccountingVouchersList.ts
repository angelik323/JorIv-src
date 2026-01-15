import { useRouteValidator, useUtils } from '@/composables'
import {
  IFieldFilters,
  IUploadAccountingVoucherList,
} from '@/interfaces/customs'
import { useUploadAccountingVouchersStore } from '@/stores'
import { formatParamsCustom } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref, watch } from 'vue'

const useUploadAccountingVouchersList = () => {
  const { validateRouter } = useRouteValidator()
  const { _getListAction } = useUploadAccountingVouchersStore('v1')
  const { uploadAccountingVouchersList } = storeToRefs(
    useUploadAccountingVouchersStore('v1')
  )

  const headerProps = {
    title: 'Cargue de comprobantes contables',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad', route: '' },
      {
        label: 'Cargue de comprobantes contables',
        route: 'UploadAccountingVouchersList',
      },
    ],
  }
  let perPage = 20
  const tableProps = ref({
    title: 'Listado de comprobante',
    loading: false,
    columns: [
      {
        name: 'file_name',
        label: 'Nombre archivo',
        field: 'file_name',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'uploaded_at',
        label: 'Fecha carga',
        field: (row) => row.uploaded_at.split('T')[0],
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'user',
        label: 'Usuario',
        field: (row) => row.creator.full_name,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'total_count',
        label: 'Total registros',
        field: 'total_count',
        align: 'center',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado',
        field: 'status',
        align: 'left',
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as IUploadAccountingVoucherList[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: perPage,
    selection: 'multiple',
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'uploaded_at',
      label: 'Fecha',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 col-lg-6',
      disable: false,
      clean_value: true,
      placeholder: 'DD/MM/AAAA',
      mask: 'DD/MM/YYYY',
    },
    {
      name: 'file_name',
      label: 'Buscador',
      type: 'q-input',
      value: '',
      class: 'col-12 col-md-6',
      disable: false,
      placeholder: 'Buscar por nombre de archivo',
      clean_value: true,
      prepend_icon: useUtils().defaultIconsLucide.magnify,
    },
  ])

  const listAction = async (filters: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []
    await _getListAction(filters)
    tableProps.value.loading = false
  }

  const filtersFormat = ref<Record<string, string | number>>({})
  const handleFilter = ($filters: {
    'filter[uploaded_at]': string
    'filter[search]': string
  }) => {
    let uploadedAt = $filters['filter[uploaded_at]']
    if (uploadedAt) {
      const parts = uploadedAt.split('/')
      if (parts.length === 3) {
        uploadedAt = `${parts[2]}-${parts[1].padStart(
          2,
          '0'
        )}-${parts[0].padStart(2, '0')}`
      }
    }
    filtersFormat.value = {
      ...$filters,
      ...(uploadedAt ? { 'filter[uploaded_at]': uploadedAt } : {}),
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
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

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  watch(
    () => uploadAccountingVouchersList.value,
    () => {
      tableProps.value.rows = [...uploadAccountingVouchersList.value]
    }
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    handleClearFilters,
    handleFilter,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default useUploadAccountingVouchersList
