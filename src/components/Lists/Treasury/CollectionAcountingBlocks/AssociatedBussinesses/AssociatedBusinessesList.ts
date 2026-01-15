import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useUtils, useRules, useRouteValidator, useMainLoader } from '@/composables'

import { IFieldFilters, IBusiness } from '@/interfaces/customs'
import { useCollectionAccountingBlocksStore } from '@/stores'

const useAssociatedBusinessesList = (props: {
  action: 'view'
  data?: number | 0
}) => {
  const {
    _getBussinessTrust,
    _downloadRegisters,
  } = useCollectionAccountingBlocksStore('v1')
  
  const {
    bussiness_trusts_list,
  } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { min_length, max_length } = useRules()
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()

  const collectionAccountingBlockIdSelected = props.data

  const filtersFormat = ref<Record<string, string | number>>({})
  const alertModalRef = ref()

  const headerProps = {
    title: '',
    breadcrumbs: [],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar codigo o nombre de negocio',
      rules: [
        (val: string) => max_length(val, 50),
        (val: string) => min_length(val, 3),
      ],
    },
  ])

   const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      paginate: 1,
      rows: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  const tableProps = ref({
    title: 'Listado de bloques',
    loading: false,
    columns: [
      {
        name: 'id',
        label: 'Código bloque',
        field: (row: IBusiness) => row.id,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'business_code',
        label: 'Código negocio',
        field: (row: IBusiness) => row.business_code,
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'name',
        label: 'Nombre de negocio',
        field: (row: IBusiness) => row.name,
        align: 'left',
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as IBusiness[],
    pages: {
      currentPage: 0,
      lastPage: 0,
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getBussinessTrust(collectionAccountingBlockIdSelected as number, filters)
    tableProps.value.loading = false
  }

  const downloadFile = async () => {
    openMainLoader(false)
    await _downloadRegisters(collectionAccountingBlockIdSelected as number)
    openMainLoader(false)
  }

  onMounted(() => {
    listAction()
  })

  watch(
    () => bussiness_trusts_list.value,
    () => {
      tableProps.value.rows = [...bussiness_trusts_list.value] as IBusiness[]
    }
  )

  return {
    headerProps,
    defaultIconsLucide,
    filterConfig,
    tableProps,
    alertModalRef,
    
    handleFilter,
    handleClear,
    updatePage,
    downloadFile,
    validateRouter,
  }
}

export default useAssociatedBusinessesList