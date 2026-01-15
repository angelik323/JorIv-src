// core
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// composables - utils - assets
import excelIcon from '@/assets/images/excel.svg'
import { handleFileObjectToUrlConversion } from '@/utils'
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useRules,
  useUtils,
} from '@/composables'

// interfaces
import { IBaseTableProps, ITabs } from '@/interfaces/global'
import {
  IIcaActivitiesFileErrorJson,
  IIcaActivitiesFileErrorJsonRow,
  IIcaActivitiesFileTable,
} from '@/interfaces/customs/accounts-payable/IcaActivities'

// store
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useIcaActivitiesStore } from '@/stores/accounts-payable/ica-activities/'

const useIcaActivitiesImport = () => {
  // hooks
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { is_required, max_length } = useRules()
  const { validateRouter } = useRouteValidator()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const {
    _downloadExcelActivitiesTemplate,
    _downloadExcelIcaActivitiesErrorsJson,
    _downloadExcelActivityErrors,
    _createBulkActivity,
    _getAvalibleCities,
  } = useIcaActivitiesStore('v1')
  const {
    ica_activity_types,
    fiscal_charges,
    third_party_types,
    settlement_concept,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))
  const { ciius } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { account_structures_payment_concepts, accounts_chart } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  // refs
  const keys = ref({
    third_party: ['ciius'],
    accounts_payable: [
      'ica_activity_types',
      'third_party_types',
      'settlement_concept',
    ],
  })
  const keysParams = ref({
    accounting: ['account_structures'],
  })
  const keysParams2 = ref({
    accounts_payable: ['fiscal_charges'],
  })
  const keysParamV2 = ref({
    accounting: ['accounts_chart'],
  })
  const cities = ref()
  const validatingForm = ref(false)
  const globalFile = ref()
  const errors = ref()
  const validated = ref()
  const alertModalRef = ref()
  const alertImportModalRef = ref()
  const currentPage = ref(1)
  const perPage = ref(20)

  // configs
  const headerProps = {
    title: 'Importar actividades ICA',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Actividades ICA',
        route: 'IcaActivitiesList',
      },
      {
        label: 'Importar',
        route: 'IcaActivitiesImport',
      },
    ],
    btn: {
      label: 'Descargar plantilla',
      icon: excelIcon,
      color: 'orange',
      class: 'custom',
      textColor: 'black',
    },
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const alertModalConfig = ref({
    title: '',
    description: '¿Desea eliminar el cargue?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    id: 0 as number,
    type: 'eliminar_archivo' as 'eliminar_archivo' | 'cargo_parcial',
  })

  const alertImportModalConfig = ref({
    title: '',
    description: '¿Desea eliminar el registro?',
    textBtnConfirm: 'Aceptar',
    textBtnCancel: 'Cancelar',
    index: -1 as number,
  })

  const uploadProps = {
    title: 'Cargar archivo',
    styleCustom: 'width: 100%;',
    labelBtn: 'Seleccione el archivo para subir',
    multiple: true,
    bordered: false,
    accept: '.xlsx',
    classNameTitle: 'text-weight-medium text-grey-6 q-mb-xs',
  }

  const tableProps = ref<IBaseTableProps<IIcaActivitiesFileTable>>({
    title: 'Listado de cargue de actividades ICA',
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
        name: 'name',
        required: false,
        label: 'Nombre',
        align: 'left',
        field: 'name',
        sortable: true,
      },
      {
        name: 'successful_records',
        required: false,
        label: 'Registros exitosos',
        align: 'left',
        field: 'successful_records',
        sortable: true,
      },
      {
        name: 'failed_records',
        required: false,
        label: 'Registros errados',
        align: 'left',
        field: 'failed_records',
        sortable: true,
      },
      {
        name: 'size',
        required: false,
        label: 'Total de registros',
        align: 'left',
        field: (row) => (row.size > 0 ? row.size : '-'),
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado de cargue',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'actions',
        sortable: false,
      },
    ],
    rows: [] as IIcaActivitiesFileTable[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tableValidatingProps = ref<
    IBaseTableProps<IIcaActivitiesFileErrorJsonRow>
  >({
    title: 'Listado de cargue de actividades ICA',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'city',
        required: false,
        label: 'Ciudad',
        field: 'ciudad',
        align: 'left',
        sortable: true,
      },
      {
        name: 'economic_activity',
        required: false,
        label: 'Actividad económica',
        field: 'actividad_economica',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description_economic_activity',
        required: false,
        label: 'Descripción actividad económica',
        field: 'descripcion_actividad_economica',
        align: 'left',
        sortable: true,
      },
      {
        name: 'type_economic_activity',
        required: false,
        label: 'Tipo de actividad',
        field: 'tipo_de_actividad',
        align: 'left',
        sortable: true,
      },
      {
        name: 'fiscal_charge',
        required: false,
        label: 'Cargo fiscal',
        field: 'cargo_fiscal',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description_fiscal_charge',
        required: false,
        label: 'Descripción del cargo fiscal',
        field: 'descripcion_cargo_fiscal',
        align: 'left',
        sortable: true,
      },
      {
        name: 'applies_to_third_party',
        required: false,
        label: 'Aplica a terceros registrados en cámara y comercio',
        field: 'aplica_terceros_registrados_en_camara_y_comercio',
        align: 'center',
        sortable: true,
      },
      {
        name: 'third_party_type',
        required: false,
        label: 'Tipo de tercero',
        field: 'tipo_de_tercero',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_structure',
        required: false,
        label: 'Estructura contable',
        field: 'estructura_contable',
        align: 'left',
        sortable: true,
      },
      {
        name: 'account_chart',
        required: false,
        label: 'Cuenta contable',
        field: 'cuenta_contable',
        align: 'left',
        sortable: true,
      },
      {
        name: 'description_account_chart',
        required: false,
        label: 'Descripción cuenta contable',
        field: 'descripcion_cuenta_contable',
        align: 'left',
        sortable: true,
      },
      {
        name: 'settlement_concept_id',
        required: false,
        label: 'Concepto de liquidación',
        field: 'concepto_de_liquidacion',
        align: 'left',
        sortable: true,
      },
      {
        name: 'minimum_base_pesos',
        required: false,
        label: 'Base mínima en pesos',
        field: 'base_minima_en_pesos',
        align: 'left',
        sortable: true,
      },
      {
        name: 'minimum_base_uvt',
        required: false,
        label: 'Base mínima en UVT',
        field: 'base_minima_en_uvt',
        align: 'left',
        sortable: true,
      },
      {
        name: 'percentage',
        required: false,
        label: 'Porcentaje',
        field: 'porcentaje',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        required: false,
        label: 'Estado',
        align: 'left',
        field: 'status',
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        field: 'actions',
        align: 'left',
        sortable: false,
      },
    ],
    rows: [] as IIcaActivitiesFileErrorJsonRow[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  // actions
  const handleDownloadTemplate = () => {
    _downloadExcelActivitiesTemplate()
  }

  const handleAddFile = async (file: File[]) => {
    errors.value = 0
    validated.value = []
    validatingForm.value = false

    // Se usa for y no foreach para que se respete el asincronismo y no se sature de peticiones el back
    for (let index = 0; index < file.length; index++) {
      const auxFile = handleFileObjectToUrlConversion(file[index] as never)

      if (auxFile) {
        tableProps.value.rows[index] = {
          id: 1,
          is_new: false,
          url: auxFile,
          name: file[index].name,
          status_id: 68,
          failed_records: 0,
          successful_records: 0,
          size: 0,
          status: '',
          actions: '',
        }
        const fileResponse: IIcaActivitiesFileErrorJson | null =
          await _downloadExcelIcaActivitiesErrorsJson(file[index])
        if (fileResponse) {
          fileResponse.validated_rows = fileResponse.validated_rows.map(
            (row, index) => ({
              id: index + 1,
              ...row,
              aplica_terceros:
                row.aplica_terceros_registrados_en_camara_y_comercio === 'Sí',
            })
          )

          errors.value = fileResponse.failed_records
          validated.value.push(fileResponse.validated_rows)
          tableProps.value.rows[index].status_id =
            fileResponse.failed_records > 0 ? 66 : 67
          tableProps.value.rows[index].failed_records =
            fileResponse.failed_records
          tableProps.value.rows[index].successful_records =
            fileResponse.successful_records
          tableProps.value.rows[index].size = fileResponse.total_records
        }
      }
    }
    globalFile.value = file
  }

  const handleDownloadErrors = (index: number) => {
    _downloadExcelActivityErrors(globalFile.value[index])
  }

  const openAlertModal = async (
    type: 'eliminar_archivo' | 'cargo_parcial',
    index: number = 0
  ) => {
    alertModalConfig.value = {
      ...alertModalConfig.value,
      type,
      id: index,
    }

    if (type === 'eliminar_archivo') {
      return showModal('¿Desea eliminar el archivo de cargue?')
    }

    const hasErrors = errors.value > 0
    const hasValidated = validated.value[0].length > 0

    if (!hasErrors && hasValidated) {
      tableValidatingProps.value.rows = validated.value[0]
      tableValidatingProps.value.pages.lastPage = Math.ceil(
        validated.value[0].length / perPage.value
      )
      validatingForm.value = true
      return
    }

    if (!hasValidated) {
      return showModal('Todo el archivo presentó error', 'No se puede cargar')
    }

    return showModal(
      `El archivo presentó (${errors.value}) error${
        errors.value.length > 1 ? 'es' : ''
      }`,
      '¿Desea cargar parcialmente?'
    )
  }

  const showModal = (title: string, description: string = '') => {
    alertModalConfig.value.title = title
    alertModalConfig.value.description = description
    alertModalRef.value?.openModal()
  }

  const makePayload = () => {
    return tableValidatingProps.value.rows
  }

  const handleCreate = async () => {
    const payload = makePayload()
    openMainLoader(true)
    const success = await _createBulkActivity(payload)
    openMainLoader(false)
    if (success) {
      goToURL('IcaActivitiesList')
    }
  }

  const handleDelete = (index: number) => {
    alertImportModalConfig.value.index = index
    alertImportModalRef.value.openModal()
  }

  const handleConfirmDelete = () => {
    tableValidatingProps.value.rows.splice(
      alertImportModalConfig.value.index,
      1
    )
    validated.value.splice(alertImportModalConfig.value.index, 1)
    alertImportModalRef.value?.closeModal()
  }

  const handleAdd = () => {
    const nextRowNumber =
      tableValidatingProps.value.rows.length > 0
        ? Math.max(
            ...tableValidatingProps.value.rows.map((r) => r.id as number)
          ) + 1
        : 1

    tableValidatingProps.value.rows.push({
      id: nextRowNumber,
      ciudad: '',
      actividad_economica: '',
      descripcion_actividad_economica: '',
      tipo_de_actividad: '',
      cargo_fiscal: '',
      descripcion_cargo_fiscal: '',
      aplica_terceros: false,
      aplica_terceros_registrados_en_camara_y_comercio: '',
      tipo_de_tercero: '',
      estructura_contable: '',
      cuenta_contable: '',
      descripcion_cuenta_contable: '',
      concepto_de_liquidacion: '',
      base_minima_en_pesos: null,
      base_minima_en_uvt: null,
      porcentaje: null,
      actions: '',
      status: '',
    })

    tableValidatingProps.value.pages.lastPage = Math.ceil(
      tableValidatingProps.value.rows.length / perPage.value
    )
  }

  const handleConfirm = async () => {
    if (alertModalConfig.value.type === 'eliminar_archivo') {
      tableProps.value.rows.splice(alertModalConfig.value.id, 1)
      validated.value.splice(alertModalConfig.value.id, 1)
    } else {
      if (validated.value[0].length > 0) {
        tableValidatingProps.value.rows = validated.value[0]
        tableValidatingProps.value.pages.lastPage = Math.ceil(
          validated.value[0].length / perPage.value
        )
        validatingForm.value = true
      }
    }
    alertModalRef.value?.closeModal()
  }

  const handleCancel = () => {
    tableProps.value.rows = []
    tableValidatingProps.value.rows = []
    errors.value = []
    validated.value = []
  }

  const disableLoad = () => {
    return tableProps.value.rows.some((item) => item.status_id === 68)
  }

  // la paginacion NO interactua con back solo es con datos que ya estan en el front cargados desde un excel
  const paginatedRows = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return tableValidatingProps.value.rows.slice(start, end)
  })

  const updatePage = async (page: number) => {
    currentPage.value = page
  }

  const updatePerPage = async (rowsPerPage: number) => {
    perPage.value = rowsPerPage
    currentPage.value = 1
    tableValidatingProps.value.pages.lastPage = Math.ceil(
      tableValidatingProps.value.rows.length / rowsPerPage
    )
  }

  const handleAppliesToThirdParty = (
    $event: boolean,
    row: IIcaActivitiesFileErrorJsonRow
  ) => {
    row.aplica_terceros_registrados_en_camara_y_comercio = $event ? 'Sí' : 'No'
  }

  const mapByCode = <T extends { code?: string }>(
    arr: T[],
    opts: { label?: boolean; value?: boolean; valueNumber?: boolean } = {
      value: true,
      valueNumber: false,
    }
  ): T[] => {
    return arr.map((item: T) => ({
      ...item,
      ...(opts.label ? { label: item.code ?? '' } : {}),
      ...(opts.value && !opts.valueNumber ? { value: item.code ?? '' } : {}),
      ...(opts.valueNumber && !opts.value
        ? { value: Number(item.code) ?? '' }
        : {}),
    }))
  }

  const changeEconomicActivity = (
    row: IIcaActivitiesFileErrorJsonRow,
    $event: string
  ) => {
    row.actividad_economica = $event
    const found = ciius.value.find((item) => item.value === $event)
    row.descripcion_actividad_economica = found?.description ?? ''
  }

  const changeFiscalCharges = (
    row: IIcaActivitiesFileErrorJsonRow,
    $event: string
  ) => {
    row.cargo_fiscal = $event
    const found = fiscal_charges.value.find((item) => item.value === $event)
    row.descripcion_cargo_fiscal = found?.name ?? ''
  }

  const changeAccountChart = (
    row: IIcaActivitiesFileErrorJsonRow,
    $event: string
  ) => {
    row.cuenta_contable = $event
    const found = accounts_chart.value.find((item) => item.value === $event)
    row.descripcion_cuenta_contable = found?.name ?? ''
  }

  onMounted(async () => {
    openMainLoader(true)
    cities.value = await _getAvalibleCities({ is_associated: true })
    await _getResources(keys.value)
    await _getResources(
      keysParams.value,
      'filter[type]=Catálogo de cuentas contables&filter[status_id]=1'
    )
    await _getResources(
      keysParams2.value,
      'filter[tax_type_id]=3&filter[status_id]=1'
    )
    await _getResources(
      keysParamV2.value,
      'fields[accounts_chart]=id,code,name,nature&filter[status_id]=1&filter[type]=Operativo',
      'v2'
    )

    // El importar solo acepta el codigo y no el id
    cities.value = mapByCode(cities.value, { value: true })
    ciius.value = mapByCode(ciius.value, { label: true, value: true })
    fiscal_charges.value = mapByCode(fiscal_charges.value, {
      label: true,
      value: true,
    })
    account_structures_payment_concepts.value = mapByCode(
      account_structures_payment_concepts.value
    )
    accounts_chart.value = mapByCode(accounts_chart.value, {
      label: false,
      valueNumber: true,
    })
    openMainLoader(false)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    tableProps,
    uploadProps,
    alertModalRef,
    alertImportModalRef,
    paginatedRows,
    tableValidatingProps,
    alertModalConfig,
    alertImportModalConfig,

    // selects
    account_structures_payment_concepts,
    accounts_chart,
    settlement_concept,
    cities,
    ciius,
    ica_activity_types,
    fiscal_charges,
    third_party_types,

    // utils
    defaultIconsLucide,

    // refs
    validatingForm,

    // methods
    handleDownloadTemplate,
    handleAddFile,
    handleDownloadErrors,
    openAlertModal,
    disableLoad,
    updatePage,
    updatePerPage,
    handleAdd,
    handleDelete,
    handleCreate,
    handleConfirm,
    handleCancel,
    handleConfirmDelete,
    handleAppliesToThirdParty,
    changeEconomicActivity,
    changeFiscalCharges,
    changeAccountChart,
    goToURL,
    is_required,
    max_length,
    validateRouter,
  }
}

export default useIcaActivitiesImport
