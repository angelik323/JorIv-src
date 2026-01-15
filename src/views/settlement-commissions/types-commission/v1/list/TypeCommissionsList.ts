// Vue - pinia - moment
import { ref, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { ITypeCommissionsList } from '@/interfaces/customs'

// Stores
import { useTypeCommissionsStore } from '@/stores'

const useTypeCommissionList = () => {
  const { _getTypeCommissionsList, _clearData } = useTypeCommissionsStore('v1')
  const { type_commissions_list, type_commissions_pages } = storeToRefs(
    useTypeCommissionsStore('v1')
  )

  let perPage = 20

  const headerProps = {
    title: 'Definir tipos de comisión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir tipos de comisión',
        route: 'CommissionTypesList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado tipos de comisión',
    loading: false,
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
        name: 'description',
        field: 'description',
        required: true,
        label: 'Descripción',
        align: 'center',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ITypeCommissionsList[],
    pages: type_commissions_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getTypeCommissionsList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page,
    })
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    await listAction({ ...filtersFormat.value, page: 1 })
  }

  onMounted(async () => {
    _clearData()
    await listAction({
      ...filtersFormat.value,
      rows: perPage,
      page: 1,
    })
  })

  watch(
    type_commissions_list,
    () => {
      tableProps.value.rows = [...type_commissions_list.value]

      const { currentPage, lastPage } = type_commissions_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    tableProps,

    updatePage,
    updatePerPage,
  }
}

export default useTypeCommissionList
