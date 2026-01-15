// Vue - pinia - moment
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { QTable } from 'quasar'
import { IFieldFilters, IThirdPartyBillingList } from '@/interfaces/customs'

// Stores
import { useResourceManagerStore, useThirdPartyBillingStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'

const useThirdPartyBillingList = () => {
  const { _getThirdPartyBillingList, _clearData } =
    useThirdPartyBillingStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { third_party_billing_list, third_party_billing_pages } = storeToRefs(
    useThirdPartyBillingStore('v1')
  )

  const {
    document_types_third_legal: legal_documents,
    document_types_third_party_natural: natural_documents,
  } = storeToRefs(useAssetResourceStore('v1'))

  const keys = {
    assets: [
      'document_types_third_party_natural',
      'document_types_third_legal',
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'third_party_document_type_id',
      label: 'Tipo de documento',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-3 col-lg-3',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Todos',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAA/MM/DD',
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'AAA/MM/DD',
    },
    {
      name: 'search',
      label: 'Buscador',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código o nombre',
      rules: [
        (val: string) =>
          !val || val.length <= 50 || 'Debe contener como máximo 50 caracteres',
      ],
    },
  ])

  const headerProps = {
    title: 'Definir terceros de facturación',
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
        label: 'Definir terceros de facturación',
        route: 'ThirdPartyBillingList',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de terceros de facturación',
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
        name: 'third_party_document_type_id',
        field: (row) => {
          return (
            legal_documents.value.find(
              (e) => e.value === row.third_party_document_type_id
            )?.label ||
            natural_documents.value.find(
              (e) => e.value === row.third_party_document_type_id
            )?.label ||
            'Sin información'
          )
        },

        required: true,
        label: 'Tipo de identificación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_document',
        field: 'third_party_document',
        required: true,
        label: 'Identificación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_name',
        field: 'third_party_name',
        required: true,
        label: 'Nombre terceros',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_date',
        field: 'created_date',
        required: true,
        label: 'Fecha de registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_address',
        field: 'third_party_address',
        required: true,
        label: 'Dirección',
        align: 'left',
        sortable: true,
      },
      {
        name: 'third_party_email',
        field: 'third_party_email',
        required: true,
        label: 'Email',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status_id',
        field: (row) => row.comission_settlement_statuses?.id,
        required: true,
        label: 'Estado',
        align: 'left',
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
    rows: [] as IThirdPartyBillingList[],
    pages: third_party_billing_pages.value,
  })

  const filtersFormat = ref<Record<string, string | number>>({})

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getThirdPartyBillingList(filters)
    tableProps.value.loading = false
  }

  const updatePage = async (page: number) => {
    await listAction({
      ...filtersFormat.value,
      page,
    })
  }

  const handleFilter = async ($filters: {
    'filter[type]': string
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }
    await listAction(filtersFormat.value)
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    listAction(filtersFormat.value)
  }

  const handleClear = async () => {
    tableProps.value.rows = []
    filtersFormat.value = {}
  }

  onMounted(async () => {
    await _getResources(keys)
    _clearData()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    third_party_billing_list,
    () => {
      tableProps.value.rows = [...third_party_billing_list.value]

      const { currentPage, lastPage } = third_party_billing_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  watch([natural_documents, legal_documents], () => {
    filterConfig.value[0].options = [
      ...(natural_documents.value ?? []),
      ...(legal_documents.value ?? []),
    ]
  })

  return {
    headerProps,
    tableProps,
    filterConfig,
    handleClear,
    handleFilter,
    updatePage,
    updatePerPage,
  }
}

export default useThirdPartyBillingList
