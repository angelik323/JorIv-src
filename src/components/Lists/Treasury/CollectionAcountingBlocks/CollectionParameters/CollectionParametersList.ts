import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useUtils, useRules, useMainLoader, useGoToUrl } from '@/composables'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { ICollectionAccountingParameterList } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'
import { ICollectionReference } from '@/interfaces/customs/treasury/CollectionReference'

// Stores
import { useAccountingParametersCollectionsStore } from '@/stores/treasury/accounting-parameters-collections'
import { useCollectionReferenceStore } from '@/stores/treasury/collection-reference'

const useAccountingParametersList = (props: { controls?: boolean, data: number | null }) => {

  const {
    accounting_parameters_collections_list,
    accounting_parameters_collections_pages,
  } = storeToRefs(useAccountingParametersCollectionsStore('v1'))
  const {
    _getAccountingParametersCollection,
    _deleteAccountingParametersCollections,
  } = useAccountingParametersCollectionsStore('v1')

  const {
    _getCollectionReferences,
    _deleteCollectionReference
  } = useCollectionReferenceStore('v1')
  const {
    collection_reference_list,
    collection_reference_pages,
  } = storeToRefs(useCollectionReferenceStore('v1'))

  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { min_length, max_length } = useRules()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const filtersFormat = ref<Record<string, string | number>>({})
  const collectionAccountParameterSelected = ref<number | null>(null)
  const alertModalParamRef = ref()
  const alertModalRefCollectionRef = ref()

  const headerProps = {
    title: `Parámetros de recaudo`,
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
      placeholder: 'Código de recaudo o nombre de recaudo',
      rules: [
        (val: string) => max_length(val, 50),
        (val: string) => min_length(val, 3),
      ],
    },
  ])

  const accountingParameterCollectionTable = ref({
    title: 'Parámetros contables de recaudo',
    loading: false,
    columns: [
      ...(props.controls ? [{
          label: '',
          name: 'select',
          field: 'id',
          align: 'left',
          sortable: true,
          required: true,
        }]
      : []),
      {
        label: '#',
        name: 'id',
        field: 'id',
        required: false,
        align: 'left',
        sortable: true,
      },
      {
        label: 'Código recaudo',
        name: 'code',
        field: 'code',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Nombre recaudo',
        name: 'description',
        field: 'description',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Cuenta con partida',
        name: 'account_chart_name',
        field: (row: ICollectionAccountingParameterList) =>
          row.account_chart?.name ?? '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Centro de costo',
        name: 'cost_center',
        field: (row: ICollectionAccountingParameterList) =>
          row.cost_center?.code ? `${row.cost_center?.code} - ${row.cost_center?.name}` : '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Tipo de tercero',
        name: 'third_party_type',
        field: 'third_party_type',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Tercero',
        name: 'third_party_name',
        field: (row: ICollectionAccountingParameterList) =>
          row.third_party?.name ?? '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Dist. Negocio',
        name: 'distributes_business_percentage',
        field: (row: ICollectionAccountingParameterList) =>
          row.distributes_business_percentage ? 'Sí' : 'No',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Rubro presupuestal',
        name: 'rubro_presupuestal',
        field: (row: ICollectionAccountingParameterList) =>
          row.budget_item ? `${row.budget_item?.code ?? ''} - ${row.budget_item?.description ?? ''}` : '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Area',
        name: 'area',
        field: (row: ICollectionAccountingParameterList) =>
          row.budget_area ? `${row.budget_area?.code ?? ''} - ${row.budget_area?.description ?? ''}` : '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Recurso',
        name: 'budget_resource',
        field: (row: ICollectionAccountingParameterList) =>
          row.budget_resource ? `${row.budget_resource?.code ?? ''} - ${row.budget_resource?.description ?? ''}` : '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Documento presupuestal',
        name: 'budget_document_type',
        field: (row: ICollectionAccountingParameterList) =>
          row.budget_document_type ? `${row.budget_document_type?.code ?? ''} - ${row.budget_document_type?.description ?? ''}` : '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        label: 'Código movimiento',
        name: 'budget_movement_code',
        field: (row: ICollectionAccountingParameterList) =>
          row.budget_movement_code ? `${row.budget_movement_code?.code ?? ''} - ${row.budget_movement_code?.description ?? ''}` : '',
        required: false,
        align: 'center',
        sortable: true,
      },
      {
        name: 'cash_flow_structure',
        field: (row: ICollectionAccountingParameterList) =>
          row.cash_flow_structure?.name ?? '',
        required: false,
        label: 'Flujo caja',
        align: 'center',
        sortable: true,
      },
      ...(props.controls ? [{
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          field: 'actions',
        }]
      : []),
    ] as QTable['columns'],
    rows: [] as ICollectionAccountingParameterList[],
    pages: accounting_parameters_collections_pages?.value || [],
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const collectionReferencesTable = ref({
    title: 'Referencias de recaudo',
    loading: false,
    columns: [
      {
        name: 'origin',
        field: (row: ICollectionReference) => row.origin?.name ?? '',
        required: false,
        label: 'Origen',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bank_reference',
        field: 'bank_reference',
        required: false,
        label: 'Referencia bancaria',
        align: 'left',
        sortable: true,
      },
      {
        name: 'bar_code',
        field: 'bar_code',
        required: false,
        label: 'Codigo de barras',
        align: 'left',
        sortable: true,
      },
      ...(props.controls ? [{
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          field: 'actions',
        }]
      : []),
    ] as QTable['columns'],
    rows: [] as ICollectionReference[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
    rowsPerPage: 20,
    selection: 'multiple',
    selected: ref([]),
  })

  const alertModalParamConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el parámetro contable?',
    id: null as number | null,
  })

  const alertModalRefConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar la referencia de recaudo?',
    id: null as number | null,
  })

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
      accounting_blocks_collection_id: props.data ?? 0,
      paginate: 1,
      rows: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const handleClear = () => {
    filtersFormat.value = {}
    accountingParameterCollectionTable.value.rows = []
    collectionReferencesTable.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1,
      per_page: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    accountingParameterCollectionTable.value.rows = []
    accountingParameterCollectionTable.value.loading = true
    await _getAccountingParametersCollection(filters)
    accountingParameterCollectionTable.value.loading = false
  }

  const handleEdit_accountingParameterCollection = (id: number) => {
    goToURL('AccountingParametersCollectionsEdit', {id: id})
  }

  const handleDelete_accountingParameterCollection = async (id: number) => {
    if (id) {
      alertModalParamConfig.value.id = id
      await alertModalParamRef.value.openModal()
    }
  }

  const deleteCollectionParam = async () => {
    openMainLoader(true)
    await alertModalParamRef.value.closeModal()
    if (!alertModalParamConfig.value.id) return
    await _deleteAccountingParametersCollections(alertModalParamConfig.value.id)

    filtersFormat.value = {
      accounting_blocks_collection_id: props.data ?? 0,
      page: 1,
      rows: 20,
    }

    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handleEdit_collectionRef = (id: number) => {
    goToURL('CollectionsReferenceEdit', {id: id})
  }

  const handleDelete_collectionRef = async (id: number) => {
    if (id) {
      alertModalRefConfig.value.id = id
      await alertModalRefCollectionRef.value.openModal()
    }
  }
  
  const deleteCollectionRef = async () => {
    openMainLoader(true)
    await alertModalRefCollectionRef.value.closeModal()
    if (!alertModalRefConfig.value.id) return
    await _deleteCollectionReference(alertModalRefConfig.value.id)
    openMainLoader(false)

    const queryString = formatParamsCustom({
      accounting_parameters_collection_id: collectionAccountParameterSelected.value ?? 0,
      paginate: 1,
      rows: 20,
    })

    collectionReferencesTable.value.rows = []
    collectionReferencesTable.value.loading = true
    await _getCollectionReferences(queryString)
    collectionReferencesTable.value.loading = false
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      filtersFormat.value = {
        accounting_blocks_collection_id: props.data ?? 0,
        page: 1,
        rows: 20,
      }

      const queryString = formatParamsCustom(filtersFormat.value)
      listAction(queryString ? '&' + queryString : '')
    },
    { deep: true, immediate: true }
  )

  watch(
    accounting_parameters_collections_list,
    () => {
      const { currentPage, lastPage } = accounting_parameters_collections_pages.value

      accountingParameterCollectionTable.value.rows = [...(accounting_parameters_collections_list.value ?? [])]
      accountingParameterCollectionTable.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )
  
  watch(collectionAccountParameterSelected,
    async (newVal) => {
      const queryString = formatParamsCustom({
        accounting_parameters_collection_id: newVal ?? 0,
        paginate: 1,
        rows: 20,
      })

      collectionReferencesTable.value.rows = []
      collectionReferencesTable.value.loading = true
      await _getCollectionReferences(queryString)
      collectionReferencesTable.value.loading = false
    }
  )

  watch(
    collection_reference_list,
    () => {
      const {currentPage, lastPage} = collection_reference_pages.value
      
      collectionReferencesTable.value.rows = [...collection_reference_list.value]
      collectionReferencesTable.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    defaultIconsLucide,
    filterConfig,
    accountingParameterCollectionTable,
    collectionReferencesTable,
    alertModalParamRef,
    alertModalParamConfig,
    alertModalRefCollectionRef,
    alertModalRefConfig,

    collectionAccountParameterSelected,

    handleFilter,
    handleClear,
    updatePage,
    updateRowsPerPage,
    handleEdit_accountingParameterCollection,
    handleDelete_accountingParameterCollection,
    handleEdit_collectionRef,
    handleDelete_collectionRef,
    deleteCollectionParam,
    deleteCollectionRef,
    goToURL,
  }
}

export default useAccountingParametersList
