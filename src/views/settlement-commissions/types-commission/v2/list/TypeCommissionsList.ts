// Vue - pinia
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITypeCommissionsListV2 } from '@/interfaces/customs/settlement-commissions/TypeCommissionsV2'
import { IBaseTableProps } from '@/interfaces/global'

// Stores
import { useTypeCommissionsStore } from '@/stores/settlement-commissions/type-commissions'
import { useGoToUrl, useRouteValidator, useUtils } from '@/composables'

const useTypeCommissionList = () => {
  const { _getTypeCommissionsList, _clearData } = useTypeCommissionsStore('v2')
  const { headerPropsDefault, type_commissions_list, type_commissions_pages } =
    storeToRefs(useTypeCommissionsStore('v2'))

  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { validateRouter } = useRouteValidator()

  const headerProperties = headerPropsDefault.value

  const tableProperties = ref<IBaseTableProps<ITypeCommissionsListV2>>({
    title: 'Listado tipos de comisión',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'id',
        field: 'code',
        required: true,
        label: 'Código de comisión',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'description',
        field: 'description',
        required: true,
        label: 'Nombre de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'class',
        field: (row) => row.commission_class_catalog.name,
        required: true,
        label: 'Clase de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type',
        field: (row) => row.commission_type_catalog.name,
        required: true,
        label: 'Tipo de comisión',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
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

  const listAction = async (filters: Record<string, string | number>) => {
    tableProperties.value.rows = []
    tableProperties.value.loading = true
    await _getTypeCommissionsList(filters)
    tableProperties.value.loading = false
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

  onMounted(async () => {
    _clearData()
    await listAction(filtersFormat.value)
  })

  watch(
    type_commissions_list,
    () => {
      tableProperties.value.rows = [...type_commissions_list.value]

      const { currentPage, lastPage } = type_commissions_pages.value
      tableProperties.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProperties,
    tableProperties,
    defaultIconsLucide,

    updatePage,
    updatePerPage,
    goToURL,
    validateRouter,
  }
}

export default useTypeCommissionList
