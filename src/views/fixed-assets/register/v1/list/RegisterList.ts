// vue - pinia - quasar
import { onBeforeUnmount, ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters, ISelectorResources } from '@/interfaces/customs/Filters'
import {
  IRegisterFilters,
  IRegisterItemList,
} from '@/interfaces/customs/fixed-assets/v1/Register'

// composables - assets
import { useCalendarRules } from '@/composables/useCalendarRules'
import { useUtils } from '@/composables/useUtils'
import excelIcon from '@/assets/images/excel.svg'

// components
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useFixedAssetsResourceStore } from '@/stores/resources-manager/fixed-assets'
import { useRegisterStore } from '@/stores/fixed-assets/register'
import { useGoToUrl } from '@/composables/useGoToUrl'

const useRegisterList = () => {
  // imports
  const { formatParamsCustom, defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    business_trust_register,
    configuration_type_register,
    record_type,
    register_status,
  } = storeToRefs(useFixedAssetsResourceStore('v1'))

  const { headerPropsDefault } = storeToRefs(useRegisterStore('v1'))
  const { _getRegisterList, _downloadRegistriesList, _getQrCode } =
    useRegisterStore('v1')

  // data selects
  const keys = {
    fixed_assets: [
      'business_trust_register',
      'configuration_type_register',
      'record_type',
      'register_status',
    ],
  }

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs,
    btn: {
      label: 'Descargar excel',
      icon: excelIcon,
      color: 'orange',
      class: 'custom',
      textColor: 'black',
    },
  }

  // filters
  const filtersFormat = ref<Record<string, string | number>>({})
  const filteredSubtypes = ref<ISelectorResources[]>([])
  const selectedFilteredTypeId = ref<number | null>(null)
  const amount_uvt_options = ref([
    { label: 'Mayor cuantía', value: 'Mayor cuantía' },
    { label: 'Menor cuantía', value: 'Menor cuantía' }
  ])
  const handleUpdateFilters = (values: IRegisterFilters) => {
    if (values['filter[configuration_type_id]']) {
      const newTypeId = values['filter[configuration_type_id]']

      if (selectedFilteredTypeId.value === newTypeId) {
        return
      }

      selectedFilteredTypeId.value = newTypeId

      const selectedType = configuration_type_register.value.find(
        (type) => type.value === newTypeId
      )

      filteredSubtypes.value =
        selectedType?.subtypes.map((subtype) => ({
          ...subtype,
          label: `${subtype.code} - ${subtype.description}`,
          value: subtype.id,
        })) || []
    }
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      options: business_trust_register,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'configuration_type_id',
      label: 'Tipo de bien o activo fijo',
      type: 'q-select',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      options: configuration_type_register,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'configuration_subtype_id',
      label: 'Subtipo de activo fijo/bien',
      type: 'q-select',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      options: filteredSubtypes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'record_type',
      label: 'Tipo de registro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      options: record_type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'register_status',
      label: 'Estado del registro',
      type: 'q-select',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      options: register_status,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'amount_uvt_status',
      label: 'Cuantía',
      type: 'q-select',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      options: amount_uvt_options,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      ),
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-sm-6 col-md-4 col-lg-3',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      ),
    },
  ])

  const handleFilter = async ($filters: IRegisterFilters) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    await listAction(queryString ? '&' + queryString : '')
  }

  // table
  const rowsPerPage = ref(10)
  const tableProps = ref<IBaseTableProps<IRegisterItemList>>({
    title: 'Listado de registro de activos fijos y bienes',
    loading: false,
    columns: [
      {
        name: 'id',
        field: (row) => row.id,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'record_type',
        field: (row) => row.record_type,
        label: 'Tipo de registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'created_at',
        field: (row) => {
          const createdAt = row.created_at ?? ''
          return formatDate(createdAt, 'YYYY-MM-DD')
        },
        label: 'Fecha',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_trust',
        field: (row) =>
          `${row.business_trust?.business_code} - ${row.business_trust?.name}`,
        label: 'Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'configuration_type',
        field: (row) =>
          `${row.configuration_type?.code} - ${row.configuration_type?.description}`,
        label: 'Tipo de bien o activo fijo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'configuration_subtype',
        field: (row) =>
          `${row.configuration_subtype?.code} - ${row.configuration_subtype?.description}`,
        label: 'Subtipo de activo fijo/bien',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fixed_asset_status',
        field: (row) => `Registrado ${row.record_type}`,
        label: 'Estado del bien o activo fijo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'major_amount_uvt',
        field: (row) => row.major_amount_uvt ? 'Sí' : 'No',
        label: 'Mayor cuantía',
        align: 'left',
        sortable: true,
      },
      {
        name: 'minor_amount_uvt',
        field: (row) => row.minor_amount_uvt ? 'Sí' : 'No',
        label: 'Menor cuantía',
        align: 'left',
        sortable: true,
      },
      {
        name: 'register_status',
        field: (row) => row.status?.name,
        label: 'Estado del registro',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        label: 'Acciones',
        align: 'center',
        sortable: false,
      },
    ] as QTableColumn<IRegisterItemList>[],
    rows: [] as IRegisterItemList[],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    await listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (perPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: perPage,
    }
    rowsPerPage.value = perPage
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // modal QR
  const alertModalQrRef = ref<{
    openModal: () => Promise<void>
    closeModal: () => void
  } | null>(null)

  const selectedRegisterData = ref({
    description: 'Escritorio con 3 cajones y porta PC con puerta',
    type: 'Activo fijo',
    serialCode: 'SN116101 -03001',
    qr_blob_url: '',
  })

  const handleQrCode = async (id: number) => {
    const qrBlobUrl = await _getQrCode(id)
    selectedRegisterData.value.qr_blob_url = qrBlobUrl
    alertModalQrRef.value?.openModal()
  }

  // actions
  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const response = await _getRegisterList(filters)
    if (response) {
      tableProps.value.rows = response.list
      tableProps.value.pages = response.pages
    }
    tableProps.value.loading = false
  }

  const handleDownloadList = async () => {
    await _downloadRegistriesList()
  }

  const handleView = (id: number) => {
    goToURL('RegisterRead', { id })
  }

  const handleEdit = (id: number) => {
    goToURL('RegisterEdit', { id })
  }

  // lifecycle
  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })
  onBeforeUnmount(async () => await _resetKeys(keys))

  return {
    headerPropsList,
    defaultIconsLucide,

    filterConfig,
    tableProps,

    alertModalQrRef,
    selectedRegisterData,

    updatePage,
    updateRowsPerPage,
    handleFilter,
    handleClearFilters,
    handleUpdateFilters,

    handleView,
    handleEdit,
    handleDownloadList,
    goToURL,

    handleQrCode,
  }
}

export default useRegisterList
