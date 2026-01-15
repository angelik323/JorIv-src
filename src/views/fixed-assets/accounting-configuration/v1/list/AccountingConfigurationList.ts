// vue - pinia - quasar
import { onBeforeUnmount, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTableColumn } from 'quasar'

// interfaces
import { IBaseTableProps } from '@/interfaces/global'
import { IFieldFilters, ISelectorResources } from '@/interfaces/customs'
import {
  IAccountingConfigurationFilters,
  IAccountingConfigurationItemList,
} from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'

// composables
import { useCalendarRules, useMainLoader, useUtils } from '@/composables'

// stores
import {
  useAccountingResourceStore,
  useFixedAssetsResourceStore,
  useResourceManagerStore,
} from '@/stores'
import { useAccountingConfigurationStore } from '@/stores/fixed-assets/accounting-configuration'

const useAccountingConfigurationList = () => {
  // imports
  const { formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const router = useRouter()

  // general store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { receipt_types_with_sub_types } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const {
    type,
    configuration_type,
    novelty_configuration_accountings,
    business_trust_configuration_accountings,
  } = storeToRefs(useFixedAssetsResourceStore('v1'))
  const {
    headerPropsDefault,
    accounting_configuration_list,
    accounting_configuration_pages,
  } = storeToRefs(useAccountingConfigurationStore('v1'))
  const {
    _getAccountingConfigurationList,
    _deleteAccountingConfiguration,
    _clearData,
  } = useAccountingConfigurationStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})

  // data selects
  const keys = {
    fixed_assets: [
      'type',
      'configuration_type',
      'novelty_configuration_accountings',
      'business_trust_configuration_accountings',
    ],
    accounting: ['receipt_types_with_sub_types'],
  }

  // breadcrumb
  const headerPropsList = {
    title: headerPropsDefault.value.title,
    breadcrumbs: headerPropsDefault.value.breadcrumbs,
  }

  // filters
  const filteredSubtypes = ref<ISelectorResources[]>([])
  const selectedFilteredTypeId = ref<number | null>(null)

  const handleUpdateFilters = (values: IAccountingConfigurationFilters) => {
    if (values['filter[configuration_type_id]']) {
      const newTypeId = values['filter[configuration_type_id]']

      if (selectedFilteredTypeId.value === newTypeId) {
        return
      }

      selectedFilteredTypeId.value = newTypeId

      const selectedType = configuration_type.value.find(
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
      name: 'source',
      label: 'Fuente',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: type,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_trust_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: business_trust_configuration_accountings,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'configuration_type_id',
      label: 'Tipo de activo fijo/bien',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: configuration_type,
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
      class: 'col-12 col-md-3',
      options: filteredSubtypes,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'novelty_code',
      label: 'Código de novedad',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: novelty_configuration_accountings,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'created_at_from',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
      option_calendar: useCalendarRules().only_until(
        new Date().toISOString().slice(0, 10).replace(/-/g, '/')
      ),
    },
    {
      name: 'created_at_to',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-12 col-md-3',
      disable: false,
      clean_value: true,
    },
    {
      name: 'receipt_type_id',
      label: 'Tipo de comprobante',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-3',
      options: receipt_types_with_sub_types,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const handleFilter = async ($filters: IAccountingConfigurationFilters) => {
    filtersFormat.value = {
      ...$filters,
      rows: filtersFormat.value.rows || 20,
      page: 1,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    await listAction(queryString ? '&' + queryString : '')
  }
  const handleClearFilters = async () => {
    filtersFormat.value = {}
    tableProps.value.rows = []
  }

  // table
  const tableProps = ref<IBaseTableProps<IAccountingConfigurationItemList>>({
    title: 'Listado de configuraciones contables',
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
        name: 'source',
        field: (row) => row.source ?? 'Falta definir',
        required: true,
        label: 'Fuente',
        align: 'left',
        sortable: true,
      },
      {
        name: 'receipt_type',
        label: 'Tipo de comprobante',
        align: 'left',
        sortable: true,
        field: (row) =>
          row.receipt_type
            ? `${row.receipt_type.code} - ${row.receipt_type.name}`
            : '-',
      },
      {
        name: 'receipt_subtype',
        label: 'Subtipo de comprobante',
        align: 'left',
        sortable: true,
        field: (row) =>
          row.receipt_subtype
            ? `${row.receipt_subtype.code} - ${row.receipt_subtype.name}`
            : '-',
      },

      {
        name: 'configuration_type',
        field: (row) => row.configuration_type?.description ?? 'Falta definir',
        required: true,
        label: 'Tipo de activo fijo/bien',
        align: 'left',
        sortable: true,
      },
      {
        name: 'configuration_subtype',
        field: (row) =>
          row.configuration_subtype?.description ?? 'Falta definir',
        required: true,
        label: 'Subtipo de activo fijo/bien',
        align: 'left',
        sortable: true,
      },
      {
        name: 'asset_class',
        field: (row) =>
          row.configuration_type?.asset_class_label ?? 'Falta definir',
        required: true,
        label: 'Clase de bien',
        align: 'left',
        sortable: true,
      },
      {
        name: 'business_trust',
        field: (row) => row.business_trust?.business_code ?? 'Falta definir',
        required: true,
        label: 'Negocio',
        align: 'left',
        sortable: true,
      },
      {
        name: 'novelty_code',
        label: 'Código de novedad',
        align: 'left',
        sortable: true,
        field: (row) =>
          row.accounting_parameters
            ?.map((param) => param.configuration_novelty_type?.description)
            .filter(Boolean)
            .join(', ') || '',
      },

      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTableColumn<IAccountingConfigurationItemList>[],
    rows: [],
    pages: accounting_configuration_pages.value,
  })

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updateRowsPerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: 1 as number,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  // actions
  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getAccountingConfigurationList(filters)
    tableProps.value.loading = false
  }

  const handleView = (id: number) => {
    router.push({
      name: 'AccountingConfigurationRead',
      params: { id },
    })
  }
  const handleEdit = (id: number) => {
    router.push({
      name: 'AccountingConfigurationEdit',
      params: { id },
    })
  }

  const refreshList = async () => {
    const queryString = formatParamsCustom(filtersFormat.value)
    await listAction(queryString ? '&' + queryString : '')
  }
  const handleDelete = async (id: number) => {
    openMainLoader(true)
    const success = await _deleteAccountingConfiguration(id)

    if (success) {
      await refreshList()
    }
    openMainLoader(false)
  }

  // watch
  watch(
    () => accounting_configuration_list.value,
    () => {
      tableProps.value.rows = accounting_configuration_list.value
      tableProps.value.pages.currentPage =
        accounting_configuration_pages.value.currentPage
      tableProps.value.pages.lastPage =
        accounting_configuration_pages.value.lastPage
    },
    { deep: true }
  )

  // lifecycle
  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })
  onBeforeUnmount(async () => await _resetKeys(keys))

  // modals
  const alertModalRef = ref()
  const alertModalConfig = ref({
    description: '',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    showBtnCancel: true,
    id: null as null | number,
    canBeDeleted: false,
  })
  const handleDeleteModal = (id: number, canBeDeleted: boolean) => {
    alertModalConfig.value.id = id
    alertModalConfig.value.canBeDeleted = canBeDeleted

    if (canBeDeleted) {
      alertModalConfig.value.description = '¿Desea eliminar esta configuración?'
      alertModalConfig.value.showBtnCancel = true
    } else {
      alertModalConfig.value.description =
        'No es posible realizar la acción, este registro depende de otros procesos'
      alertModalConfig.value.showBtnCancel = false
    }

    alertModalRef.value?.openModal()
  }
  const handleConfirmDelete = () => {
    if (alertModalConfig.value.canBeDeleted && alertModalConfig.value.id) {
      handleDelete(alertModalConfig.value.id)
    }
    alertModalRef.value?.closeModal()
  }
  return {
    defaultIconsLucide,
    alertModalRef,
    alertModalConfig,

    headerPropsList,
    tableProps,
    filterConfig,
    filteredSubtypes,

    handleDeleteModal,
    handleConfirmDelete,
    handleView,
    handleEdit,
    handleFilter,
    handleClearFilters,
    handleUpdateFilters,

    updatePage,
    updateRowsPerPage,
  }
}

export default useAccountingConfigurationList
