// Vue - Pinia - Quasar
import { QRejectedEntry, QTable } from 'quasar'
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IUploadedFile } from '@/interfaces/global'
import {
  IMovementTemp,
  IFileAtachment,
  IImportedMovement,
  ITempArrMovements,
  ISelectOptionsList,
  IImportMovementsBach,
  IInvestmentFundsTable,
  IRegisterTempSimplified,
  IParticipationTypeTable,
  ICollectiveInvesmentFund,
  IParticipationFundsDetail,
  IImportMovementsBachTable,
  ITempArrMovementsSimplified,
  IClosingCollectiveInvestmentFundsParticipationsStatus,
} from '@/interfaces/customs/fics/ClosingCollectiveInvestmentFunds'

// Composables
import {
  useUtils,
  useAlert,
  useRules,
  useMainLoader,
  useRouteValidator,
} from '@/composables'

// Stores
import { useClosingCollectiveInvestmentFundsStore } from '@/stores/fics/closing-collective-investment-funds'
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useClosingCollectiveInvestmentFundsList = () => {
  const { validateRouter } = useRouteValidator()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const {
    formatDate,
    defaultIconsLucide,
    formatParamsCustom,
    formatCurrencyString,
    addDaysToDate,
  } = useUtils()

  const { _showAction } = useCollectiveInvestmentFundsStore('v1')
  const { funds } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')
  const {
    _cleanData,
    _synchronize,
    _undoClosure,
    _processClosure,
    _downloadTemplate,
    _listFundsInterval,
    _importBachMovements,
    _getImportedMovements,
    _getMovementCodesCloseList,
    _importBachMovementsErrors,
  } = useClosingCollectiveInvestmentFundsStore('v1')
  const {
    movement_codes_close_list,
    collective_investment_funds,
    collective_funds_participation_type_table,
  } = storeToRefs(useClosingCollectiveInvestmentFundsStore('v1'))

  const filtersFormat = ref<Record<string, string | number>>({})
  const movementsImportBach = ref<IImportMovementsBach[]>([])
  const fileRowList = ref<IFileAtachment[]>([])
  const fundIdFilterTypesParticipation = ref()
  const filtersRefParticipation = ref()
  const fund_id_second_filter = ref()
  const alertModalConfirmRef = ref()
  const alertModalImportRef = ref()
  const dateSynchronize = ref()
  const attachFilesRef = ref()
  const alertModalRef = ref()
  const filtersRef = ref()
  const deleteId = ref()
  const flagStatusFunds = ref(false)

  const tempArrMovementsForParticipationType = ref<ITempArrMovements>({
    closing_date: '',
    funds: [],
  })

  const arrMovementsForParticipationTypeRequest =
    ref<ITempArrMovementsSimplified>({
      closing_date: '',
      funds: [],
    })

  const buttonsDisabled = ref({
    undoClosure: true,
    processClosure: true,
  })

  const alertModalConfirmValidateProcessImportRef = ref()
  const alertModalConfirmProcessImportRef = ref()
  const alertModalUndoClosureRef = ref()
  const alertModalUndoClosureMonetaryRef = ref()
  const flagStatusProgressError = ref(false)
  const alertModalConfirmProcessRef = ref()
  const flagStatusProgress = ref(false)
  const disablebBtnRegistro = ref(false)
  const importId = ref()

  const selectedRows = ref<ICollectiveInvesmentFund[]>([])
  const selectedParticipationId = ref<string | number>()
  const selectedFundModalId = ref<string | number>()
  const selectedFundlId = ref<string | number>()
  const isFundsParticipationType = ref(true)
  const formAddMovementsTable = ref()
  const selectedRadioFund = ref()
  const showState = ref(0)

  const MAX_FILE_SIZE_MB = 5

  const statusAllValidated = ref(false)
  const statusAllPending = ref(false)
  const statusMixed = ref(false)

  const alertModalConfirmConfig = ref({
    title: 'Advertencia',
    description: '',
    id: null as number | null,
  })

  const alertModalConfirmConfigProcessImport = ref({
    title: 'Advertencia',
    description: '',
  })

  const headerProps = {
    title: 'Cierre de fondos de inversión colectiva',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Cierre de fondos de inversión colectiva',
        route: 'ClosingCollectiveInvestmentFundsList',
      },
    ],
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_fund',
      label: 'Desde fondo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-py-md',
      options: funds,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'Este campo es requerido'),
      ],
    },
    {
      name: 'bussines_origin',
      label: 'Negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-sm-12 col-md-4 q-py-md',
      disable: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'last_close_origin',
      label: 'Fecha último cierre',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-2 q-py-md',
      disable: true,
      icon: defaultIconsLucide.calendar,
      clean_value: true,
      placeholder: 'AAAA-MMDD',
    },
    {
      name: 'final_date_origin',
      label: 'Fecha de cierre',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-2 q-py-md',
      disable: true,
      icon: defaultIconsLucide.calendar,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
    },
    {
      name: 'to_fund',
      label: 'Hasta fondo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-4 q-py-md',
      options: funds,
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      autocomplete: true,
      rules: [
        (v: string) => useRules().is_required(v, 'El fondo es requerido'),
      ],
    },
    {
      name: 'bussines_destination',
      label: 'Negocio',
      type: 'q-input',
      value: null,
      class: 'col-12 col-sm-12 col-md-4 q-py-md',
      disable: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'final_date_destination',
      label: 'Fecha último cierre',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-2 q-py-md',
      disable: true,
      icon: defaultIconsLucide.calendar,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
    },
  ])

  const filterConfigParticipation = ref<IFieldFilters[]>([
    {
      name: 'fund_origin',
      label: 'Código fondo de inversión',
      type: 'q-select',
      value: fundIdFilterTypesParticipation.value,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) => useRules().is_required(v, 'El fondo es requerido'),
      ],
    },
    {
      name: 'participation_type_id',
      label: 'Tipo de participación',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-12 col-md-6 q-py-md',
      options: [],
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          useRules().is_required(v, 'El tipo de participación es requerido'),
      ],
    },
  ])

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const styleCustomAttachFile = ref(
    'width: 100% !important; border-radius: 20px !important; min-height: 50px !important; max-height: 300px !important; display: inherit !important; border: 3px dashed #dcdcdc !important'
  )

  const tablePropsModal = ref({
    loading: false,
    columns: [
      {
        name: 'fund_code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: IInvestmentFundsTable) => `${row.fund_code}`,
        sortable: true,
      },
      {
        name: 'fund_name',
        required: true,
        label: 'Descripción de fondo',
        align: 'left',
        field: (row: IInvestmentFundsTable) => `${row.fund_name}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'last_closing_date',
        required: true,
        label: 'Fecha de cierre',
        align: 'left',
        field: (row: IInvestmentFundsTable) =>
          `${row.last_closing_date ?? '--'}`,
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status',
      },
    ] as QTable['columns'],
    rows: [] as IInvestmentFundsTable[] | [],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const tablePropsTypeofParticipation = ref({
    loading: false,
    columns: [
      {
        name: 'select',
        label: '',
        field: 'id',
        align: 'left',
        sortable: false,
        required: true,
      },
      {
        name: 'fund_code',
        required: true,
        label: 'Código fondo de inversión',
        align: 'left',
        field: (row: IParticipationTypeTable) => `${row.fund_code}`,
        sortable: false,
      },
      {
        name: 'participation_type',
        required: true,
        label: 'Tipo de participación',
        align: 'left',
        field: (row: IParticipationTypeTable) => `${row.participation_type}`,
        sortable: false,
        style: styleColumn(200),
      },
      {
        name: 'participation_description',
        required: true,
        label: 'Descripción tipo de participación',
        align: 'left',
        field: (row: IParticipationTypeTable) =>
          `${row.participation_description ?? '--'}`,
        sortable: false,
      },
      {
        name: 'balance_participation_type',
        required: true,
        label: 'Saldo inicial tipo de participación',
        align: 'left',
        field: (row: IParticipationTypeTable) =>
          `${row.balance_participation_type ?? '--'}`,
        sortable: false,
        format: (val: number) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
    ] as QTable['columns'],
    rows: [] as IParticipationTypeTable[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const tablePropsMovements = ref({
    title: 'Detalle de movimientos proceso de cierre de fondo',
    loading: false,
    columns: [
      {
        name: 'movement_id',
        required: true,
        label: 'Código de movimiento',
        align: 'left',
        field: (row: IParticipationFundsDetail) => `${row.movement_id}`,
        sortable: true,
      },
      {
        name: 'movement_description',
        required: true,
        label: 'Descripción del movimiento',
        align: 'left',
        field: (row: IParticipationFundsDetail) =>
          `${row.movement_description ?? '--'}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'income_expense',
        required: true,
        label: 'Ingreso / Gasto',
        align: 'left',
        field: (row: IParticipationFundsDetail) =>
          `${row.income_expense ?? '--'}`,
        sortable: true,
      },
      {
        name: 'movement_value',
        required: true,
        label: 'Valor del movimiento',
        align: 'left',
        field: (row: IParticipationFundsDetail) =>
          `${row.movement_value ?? '--'}`,
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
    rows: [] as IParticipationFundsDetail[],
  })

  const tablePropsMovementsBach = ref({
    title: 'Detalle de movimientos proceso de cierre de fondo',
    loading: false,
    columns: [
      {
        name: 'fund_code',
        required: true,
        label: 'Código fondo de inversión',
        align: 'left',
        field: (row: IImportMovementsBachTable) => `${row.fund_code}`,
        sortable: true,
      },
      {
        name: 'participation_type_code',
        required: true,
        label: 'Tipo de participación',
        align: 'left',
        field: (row: IImportMovementsBachTable) =>
          `${row.participation_type_code ?? '--'}`,
        sortable: true,
      },
      {
        name: 'movement_code',
        required: true,
        label: 'Descripción del movimiento',
        align: 'left',
        field: (row: IImportMovementsBachTable) =>
          `${row.movement_code ?? '--'}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'movement_value',
        required: true,
        label: 'Valor del movimiento',
        align: 'left',
        field: (row: IImportMovementsBachTable) =>
          `${row.movement_value ?? '--'}`,
        sortable: true,
        format: (val: number) =>
          formatCurrencyString(val, { currency: 'COP', locale: 'es-CO' }),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as IImportMovementsBachTable[],
  })

  const tablePropertiesUploadFiles = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
        required: true,
      },
      {
        name: 'filename',
        label: 'Nombre',
        align: 'left',
        field: 'filename',
        sortable: true,
        required: true,
      },
      {
        name: 'total_records',
        label: 'Total de registros',
        align: 'left',
        field: 'total_records',
        sortable: true,
        required: true,
      },
      {
        name: 'status',
        label: 'Estado de cargue',
        align: 'center',
        field: (row) => row.status.id || '-',
        sortable: true,
        required: true,
      },
    ] as QTable['columns'],
    rows: [] as IFileAtachment[],
    pages: {},
  })

  const handlerFilter = async ($filters: { 'filter[search]': string }) => {
    openMainLoader(true)
    filtersFormat.value = {
      ...$filters,
    }

    delete filtersFormat.value['filter[bussines_origin]']
    delete filtersFormat.value['filter[final_date_origin]']
    delete filtersFormat.value['filter[last_close_origin]']
    delete filtersFormat.value['filter[bussines_destination]']
    delete filtersFormat.value['filter[final_date_destination]']

    const queryString = formatParamsCustom(filtersFormat.value)
    await listActionFunds(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const handlerCleanDataFiltersParticipationType = () => {
    tablePropsTypeofParticipation.value.rows = [
      ...collective_funds_participation_type_table.value,
    ]
  }

  const handlerFilterParticipation = ($filters: {
    'filter[search]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    tablePropsTypeofParticipation.value.loading = true

    const fundFilter = filtersFormat.value['filter[fund_origin]']
    const participationFilter =
      filtersFormat.value['filter[participation_type_id]']

    tablePropsTypeofParticipation.value.rows =
      collective_funds_participation_type_table.value.filter((row) => {
        const matchesFund = fundFilter ? row.fund_id == fundFilter : true
        const matchesParticipation = participationFilter
          ? row.participation_id == participationFilter
          : true

        return matchesFund && matchesParticipation
      })

    tablePropsMovements.value.rows = []
    tablePropsTypeofParticipation.value.loading = false
  }

  const listActionFunds = async (filters: string = '') => {
    tablePropsModal.value.loading = true
    tablePropsModal.value.rows = []
    tablePropsTypeofParticipation.value.rows = []
    tablePropsTypeofParticipation.value.loading = true
    tablePropsMovements.value.rows = []
    tablePropsMovements.value.loading = true
    tablePropsMovementsBach.value.rows = []
    tablePropsMovementsBach.value.loading = true
    selectedRows.value = []

    const success = await _listFundsInterval(filters)
    if (success) alertModalRef.value?.openModal()
    tablePropsModal.value.loading = false
    tablePropsTypeofParticipation.value.loading = false
    tablePropsMovements.value.loading = false
    tablePropsMovementsBach.value.loading = false
  }

  const handlerFieldChange = (
    currentFilters: Record<string, string | number | null>
  ) => {
    const fromFundValue = currentFilters['filter[from_fund]']
    if (fromFundValue) {
      getInfoFund(fromFundValue, 'origin')
    } else {
      filtersRef.value?.setFieldValueByName('bussines_origin', '')
      filtersRef.value?.setFieldValueByName('last_close_origin', '')
      filtersRef.value?.setFieldValueByName('final_date_origin', '')
    }

    const toFundValue = currentFilters['filter[to_fund]']
    if (toFundValue) {
      getInfoFund(toFundValue, 'destination')
    } else {
      filtersRef.value?.setFieldValueByName('bussines_destination', '')
      filtersRef.value?.setFieldValueByName('final_date_destination', '')
    }
  }

  const handlerFieldChangeParticipationTypes = (
    currentFilters: Record<string, string | number | null>
  ) => {
    if (currentFilters['filter[fund_origin]'])
      fund_id_second_filter.value = currentFilters['filter[fund_origin]']
  }

  const getInfoFund = async (id: string | number, type: string) => {
    if (id !== null) {
      const fund_info = await _showAction(id.toString())
      switch (type) {
        case 'origin':
          filtersRef.value?.setFieldValueByName(
            'bussines_origin',
            `${fund_info.business_trust?.business_code ?? ''} - ${
              fund_info.business_trust?.name ?? ''
            }`
          )

          const formattedLastClosingDate = fund_info.last_closing_date
            ? formatDate(fund_info.last_closing_date, 'YYYY-MM-DD')
            : 'Sin datos'

          filtersRef.value?.setFieldValueByName(
            'last_close_origin',
            formattedLastClosingDate
          )

          if (fund_info.last_closing_date) {
            const nextDay = addDaysToDate(fund_info.last_closing_date)

            filtersRef.value?.setFieldValueByName('final_date_origin', nextDay)
            dateSynchronize.value = nextDay
          } else {
            const finalDate = fund_info?.parameters[0]
              ? formatDate(
                  fund_info?.parameters[0]?.operation_start_date,
                  'YYYY-MM-DD'
                )
              : new Date().toISOString().split('T')[0]

            filtersRef.value?.setFieldValueByName(
              'final_date_origin',
              finalDate
            )
            dateSynchronize.value = finalDate
          }

          break

        case 'destination':
          filtersRef.value?.setFieldValueByName(
            'bussines_destination',
            `${fund_info.business_trust?.business_code ?? ''} - ${
              fund_info.business_trust?.name ?? ''
            }`
          )
          const formattedFinalDateDestination = fund_info.last_closing_date
            ? formatDate(fund_info.last_closing_date, 'YYYY-MM-DD')
            : 'Sin datos'

          filtersRef.value?.setFieldValueByName(
            'final_date_destination',
            formattedFinalDateDestination
          )

          break

        default:
          break
      }
    }
  }

  const removeObjectById = (
    array: IParticipationFundsDetail[] | IImportMovementsBachTable[],
    id: string
  ) => {
    const index = array.findIndex(
      (obj: IParticipationFundsDetail | IImportMovementsBachTable) =>
        obj.id === id
    )
    if (index !== -1) {
      return array.splice(index, 1)[0]
    }
    return null
  }

  const removeObjectTempByIdMovement = (
    array: ITempArrMovements,
    fundId: string,
    idMovement: string
  ) => {
    const objFundId = array.funds.find((fund) => fund.id === fundId)
    const index = objFundId?.participation_types[0].movements.findIndex(
      (obj: IMovementTemp) => obj.id === idMovement
    )
    if (index !== -1) {
      return objFundId?.participation_types[0].movements.splice(index!, 1)[0]
    }
    return null
  }

  const actionsOptions = (
    type: string,
    row?: IParticipationFundsDetail | IImportMovementsBachTable
  ) => {
    switch (type) {
      case 'delete':
        deleteId.value = row?.id

        const description =
          'movement_description' in row!
            ? row.movement_description
            : 'movement_code' in row!
            ? row.movement_code
            : ''

        if (description == undefined) {
          alertModalConfirmConfig.value.description = `¿Desea eliminar el movimiento?`
        } else {
          alertModalConfirmConfig.value.description = `¿Desea eliminar el movimiento ${description}?`
        }
        alertModalConfirmRef.value?.openModal()
        break
      case 'deleteConfirm':
        removeObjectById(tablePropsMovements.value.rows, deleteId.value)
        removeObjectTempByIdMovement(
          tempArrMovementsForParticipationType.value,
          selectedRadioFund.value.id,
          deleteId.value
        )
        alertModalConfirmRef.value?.closeModal()
        showAlert('Movimiento eliminado correctamente', 'success')
        disablebBtnRegistro.value = false

        break

      case 'deleteConfirmBach':
        removeObjectById(tablePropsMovementsBach.value.rows, deleteId.value)
        alertModalConfirmRef.value?.closeModal()
        showAlert('Movimiento eliminado correctamente', 'success')
        break

      default:
        break
    }
  }

  const buildFileRow = (
    fileData: IImportedMovement,
    file: IUploadedFile
  ): IFileAtachment => ({
    id: fileData.id?.toString() || '',
    filename: fileData.file_name || '',
    total_records: fileData.total_records || 0,
    status: fileData.status?.id || 0,
    file,
  })

  const updateTableWithFile = (fileResponse: IFileAtachment) => {
    tablePropertiesUploadFiles.value.rows = [
      {
        id: fileResponse.id,
        filename: fileResponse.filename,
        total_records: fileResponse.total_records,
        status: fileResponse.status,
        file: fileResponse.file,
      },
    ]
    tablePropertiesUploadFiles.value.loading = false
  }

  const handlerImportBachMovements = async () => {
    openMainLoader(true)
    buttonsDisabled.value.processClosure = true
    alertModalConfirmValidateProcessImportRef.value?.closeModal()

    const file = fileRowList.value?.[0]?.file
    if (!file) {
      showAlert('No se encontró ningún archivo para importar', 'warning')
      openMainLoader(false)
      return
    }

    const response = await _importBachMovements(file)
    if (!response?.success) {
      showAlert('Error durante la carga del archivo', 'error')
      openMainLoader(false)
      return
    }

    tablePropsMovementsBach.value.rows = []
    flagStatusProgress.value = true
    importId.value = response.data.id

    const importedData = await _getImportedMovements(importId.value)
    if (!importedData?.data?.length) {
      showAlert('No se encontraron datos importados', 'warning')
      openMainLoader(false)
      return
    }

    const fileData = importedData.data[0] as IImportedMovement
    const fileResponse = buildFileRow(fileData, file)

    updateTableWithFile(fileResponse)
    dateSynchronize.value = new Date().toISOString().split('T')[0]

    openMainLoader(false)
  }

  const handlerImportBachMovementsValidation = async () => {
    const importedData = await _getImportedMovements(importId.value)
    const fileData = importedData.data[0] as IImportedMovement
    const fileResponse = buildFileRow(fileData, fileRowList.value[0].file)

    updateTableWithFile(fileResponse)
    alertModalConfirmProcessImportRef.value?.openModal()

    const { id: statusId, status: statusName } = fileData.status || {}

    if (statusId === 73) {
      flagStatusProgressError.value = true
      alertModalConfirmConfigProcessImport.value.title =
        'El archivo cargado presenta errores. ¿Desea realizar el cargue parcial de los registros correctos?'
      alertModalConfirmConfigProcessImport.value.description =
        'Se descargará un archivo con los errores encontrados en el proceso de validación'

      await _importBachMovementsErrors(importId.value)
    } else {
      alertModalConfirmConfigProcessImport.value.title = `Cargue en estado ${statusName}`
      alertModalConfirmConfigProcessImport.value.description = ''

      if (tablePropertiesUploadFiles.value.rows.length > 0) {
        const details = importedData.data[0].details || []
        movementsImportBach.value = details

        if (details.length > 0) {
          tablePropsMovementsBach.value.rows =
            organizedDataTableMovementsBach(details)
          transformMovementsBach(tablePropsMovementsBach.value.rows)
        }
      }
    }
  }

  const saveImportBachMovements = async () => {
    const importedData = await _getImportedMovements(importId.value)
    const fileData = importedData.data[0] as IImportedMovement

    const { id: statusId } = fileData.status || {}

    if (flagStatusProgressError.value) {
      const details = (importedData.data[0].details || []).filter(
        (item: IImportedMovement) => item.status?.id === 75
      )
      movementsImportBach.value = details

      if (details.length > 0) {
        tablePropsMovementsBach.value.rows =
          organizedDataTableMovementsBach(details)
        transformMovementsBach(tablePropsMovementsBach.value.rows)
      }
    }

    alertModalConfirmProcessImportRef.value?.closeModal()
    if (statusId === 29 || statusId === 73) {
      attachFilesRef.value?.removeFilesRemote()
      alertModalImportRef.value.closeModal()
      flagStatusProgress.value = false
    }
  }

  const handleCancelImportBachMovements = () => {
    attachFilesRef.value?.removeFilesRemote()
  }

  const openAlertModalConfirmValidateProcessImport = () => {
    if (!fileRowList.value.length) {
      return showAlert('Debe subir un archivo', 'error')
    }
    alertModalConfirmValidateProcessImportRef.value?.openModal()
  }

  const actionTableHeaderButton = (type: string) => {
    switch (type) {
      case 'import':
        alertModalImportRef.value.openModal()
        break

      case 'add':
        tablePropsMovements.value.rows.push({
          id: tablePropsMovements.value.rows.length,
          movement_id: undefined,
          movement_description: undefined,
          income_expense: undefined,
          movement_value: '',
        })
        break

      default:
        break
    }
  }

  const organizedDataSelectInvesmentFund = (
    array: ICollectiveInvesmentFund[]
  ): ISelectOptionsList[] => {
    const uniqueMap = new Map<string | number, ISelectOptionsList>()

    array.forEach((item: ICollectiveInvesmentFund) => {
      uniqueMap.set(item.id, {
        value: item.id,
        label: `${item.fund_code} - ${item.fund_name}`,
      })
    })

    return Array.from(uniqueMap.values())
  }

  const organizedDataTableMovementsBach = (
    array: IImportMovementsBach[]
  ): IImportMovementsBachTable[] => {
    return array.map((item, index) => ({
      id: index,
      fund_id: Number(item.fund_id),
      fund_code: Number(item.fund_code),
      participation_type_code: item.participation_type_code,
      participation_type: item.participation_type_id,
      movement_id: item.movement_id,
      movement_code: `${item.movement_code ?? ''} - ${
        item.movement_description ?? ''
      }`,
      movement_value: item.value,
    }))
  }

  const initializeTempArrMovementsStructure = () => {
    const fundsMap = new Map<
      string | number,
      {
        id: string | number
        participation_types: {
          id: string | number
          movements: IMovementTemp[]
        }[]
      }
    >()

    tablePropsTypeofParticipation.value.rows.forEach((row) => {
      const fundId = row.fund_id
      const participationTypeId = row.participation_id

      if (!fundsMap.has(fundId)) {
        fundsMap.set(fundId, {
          id: fundId,
          participation_types: [],
        })
      }

      const fund = fundsMap.get(fundId)!

      const existingParticipationType = fund.participation_types.find(
        (pt) => pt.id === participationTypeId
      )

      if (!existingParticipationType) {
        fund.participation_types.push({
          id: participationTypeId,
          movements: [],
        })
      }
    })

    tempArrMovementsForParticipationType.value = {
      closing_date:
        dateSynchronize.value ?? new Date().toISOString().split('T')[0],
      funds: Array.from(fundsMap.values()),
    }
  }

  const makeTempArrMovementsForParticipationType = (index: number) => {
    if (
      !selectedRadioFund.value ||
      !selectedRadioFund.value.fund_id ||
      !selectedRadioFund.value.participation_id
    ) {
      return
    }

    const fundId = selectedRadioFund.value.fund_id
    const participationTypeId = selectedRadioFund.value.participation_id

    const existingFund = tempArrMovementsForParticipationType.value.funds.find(
      (f) => f.id === fundId
    )

    const existingParticipationType = existingFund?.participation_types.find(
      (pt) => pt.id === participationTypeId
    )

    if (index > 0 && tablePropsMovements.value.rows[index - 1]) {
      tablePropsMovements.value.rows[index - 1].value =
        tablePropsMovements.value.rows[index - 1].movement_value
      const newMovement = tablePropsMovements.value.rows[index - 1]

      const movementExists = existingParticipationType?.movements.some(
        (m) => m.id === newMovement.id
      )

      if (!movementExists && newMovement.movement_id) {
        existingParticipationType?.movements.push(newMovement)
      }
    }
  }

  const transformMovementsBach = (data: IImportMovementsBachTable[]) => {
    const fundsMap = new Map<number, IRegisterTempSimplified>()

    data.forEach((item) => {
      if (!fundsMap.has(item.fund_code)) {
        fundsMap.set(item.fund_code, {
          id: item.fund_id,
          participation_types: [],
        })
      }

      const fund = fundsMap.get(item.fund_code)!

      let participationType = fund.participation_types.find(
        (pt) => pt.id === item.participation_type
      )

      if (!participationType) {
        participationType = {
          id: item.participation_type,
          movements: [],
        }
        fund.participation_types.push(participationType)
      }

      participationType.movements.push({
        id: item.movement_id,
        value: item.movement_value,
      })
    })

    arrMovementsForParticipationTypeRequest.value = {
      closing_date:
        dateSynchronize.value ?? new Date().toISOString().split('T')[0],
      funds: Array.from(fundsMap.values()),
    }
  }

  const rememberMovementsByFundIdParticipationId = (
    data: ITempArrMovements,
    fundId: number,
    participationTypeId: number
  ) => {
    tablePropsMovements.value.rows = []
    const fund = data.funds.find((f) => f.id === fundId)
    if (!fund) return []

    const participationType = fund.participation_types.find(
      (pt) => pt.id === participationTypeId
    )
    if (!participationType) return []

    tablePropsMovements.value.rows = participationType.movements
  }

  const transformParticipationTableToTempMovements = (
    rows: IParticipationTypeTable[]
  ): ITempArrMovements => {
    const fundsMap = new Map<
      string | number,
      {
        id: string | number | undefined
        participation_types: {
          id: string | number
          movements: IMovementTemp[]
        }[]
      }
    >()

    rows.forEach((row) => {
      const fundId = row.fund_id
      const participationTypeId = row.participation_id

      if (!fundsMap.has(fundId)) {
        fundsMap.set(fundId, {
          id: fundId,
          participation_types: [],
        })
      }

      const fund = fundsMap.get(fundId)!

      const existingParticipationType = fund.participation_types.find(
        (pt) => pt.id === participationTypeId
      )

      if (!existingParticipationType) {
        fund.participation_types.push({
          id: participationTypeId,
          movements: [],
        })
      }
    })

    return {
      closing_date:
        dateSynchronize.value ?? new Date().toISOString().split('T')[0],
      funds: Array.from(fundsMap.values()),
    }
  }

  const convertToSimpleStructure = (data: ITempArrMovements) => {
    return {
      funds: data.funds.reduce((acc, fund) => {
        acc.push({ id: fund.id as number })
        return acc
      }, [] as Array<{ id: number }>),
    }
  }

  //Modal interval funds methods
  const organizedDataTableCollectiveInvesmentFund = (
    array: ICollectiveInvesmentFund[]
  ): IInvestmentFundsTable[] => {
    return array.map((item) => ({
      id: item.id,
      fund_code: item.fund_code ?? 'Sin datos',
      fund_name: item.fund_name ?? 'Sin datos',
      last_closing_date: item.last_closing_date ?? 'Sin datos',
      participation_types: item.participation_types,
      consolidation_option: item.consolidation_option,
      status: item.status ?? 'Sin datos',
    }))
  }

  const organizedDataTableParticipeType = (
    array: ICollectiveInvesmentFund[]
  ): IParticipationTypeTable[] => {
    const result: IParticipationTypeTable[] = []

    array.forEach((item: ICollectiveInvesmentFund) => {
      const { consolidation_option, participation_types } = item

      result.push({
        id: item.id + '-' + consolidation_option?.code,
        fund_id: item.id,
        fund_code: item.fund_code ?? 'Sin datos',
        participation_id: consolidation_option?.id ?? 'Sin datos',
        participation_description: consolidation_option?.name ?? 'Sin datos',
        balance_participation_type:
          consolidation_option?.participation_types_balance ?? 0,
        participation_type: consolidation_option?.code ?? 'Sin datos',
      })

      participation_types.forEach((participation) => {
        const exists = result.some(
          (r) =>
            r.id === participation.id &&
            r.participation_id === participation.business_line_id
        )

        if (!exists) {
          result.push({
            id: participation.id + '-' + participation.business_line?.code,
            fund_id: participation.fund_id,
            fund_code: item.fund_code ?? 'Sin datos',
            participation_id: participation.business_line_id ?? 'Sin datos',
            participation_description:
              participation.business_line?.description ?? 'Sin datos',
            balance_participation_type:
              participation.participation_types_balance ?? 0,
            participation_type:
              participation.business_line?.code ?? 'Sin datos',
          })
        }
      })
    })

    return result
  }

  const confirmModalCollectiveFunds = () => {
    if (!selectedRows.value || selectedRows.value.length === 0) {
      return showAlert('Debe seleccionar al menos un fondo', 'error')
    } else {
      const statusesFunds = selectedRows.value.map((fund) => fund.status)
      statusFunds(statusesFunds)
      filterConfigParticipation.value[0].options =
        organizedDataSelectInvesmentFund(selectedRows.value)
      alertModalRef.value?.closeModal()

      const newRows = organizedDataTableParticipeType(selectedRows.value)
      tablePropsTypeofParticipation.value.rows = newRows
      collective_funds_participation_type_table.value = newRows

      initializeTempArrMovementsStructure()
    }
  }

  const onUpdateSelected = (val: ICollectiveInvesmentFund[]) => {
    flagStatusFunds.value = false
    selectedRows.value = []

    if (!val.length) return

    const invalidFunds: string[] = []

    const date = val[0].last_closing_date
    const status = val[0].status.id

    val.forEach((item) => {
      if (item.status.id === status && item.last_closing_date === date) {
        selectedRows.value.push(item)
      } else {
        invalidFunds.push(item.fund_name || item.fund_code || 'desconocido')
      }
    })

    if (invalidFunds.length > 0) {
      flagStatusFunds.value = true
      showAlert(
        `Los siguientes fondos no cumplen con la misma fecha de cierre o estado : ${invalidFunds.join(
          ', '
        )}`,
        'error'
      )
    }
  }

  const onSynchronize = async () => {
    openMainLoader(true)
    const responseSynchronize = await _synchronize(dateSynchronize.value)
    openMainLoader(false)
    if (responseSynchronize) buttonsDisabled.value.processClosure = false
  }

  const onUndoClosure = () => {
    alertModalUndoClosureRef.value?.openModal()
  }

  const onConfirmUndoClosure = () => {
    alertModalUndoClosureRef.value?.closeModal()
    alertModalUndoClosureMonetaryRef.value?.openModal()
  }

  const onConfirmUndoClosureMonetary = async () => {
    alertModalUndoClosureMonetaryRef.value?.closeModal()
    openMainLoader(true)
    const responseProcessClosure = await _undoClosure(
      convertToSimpleStructure(tempArrMovementsForParticipationType.value)
    )
    openMainLoader(false)
    if (responseProcessClosure) buttonsDisabled.value.undoClosure = false
  }

  const validateDuplicateIds = (
    row: IParticipationFundsDetail,
    newValue: { value: string | number }
  ) => {
    const exists = tablePropsMovements.value.rows.some(
      (item) => item.id === newValue.value && item.id !== row.id
    )

    if (exists) {
      showAlert(
        'Este registro ya se encuentra creado, si desea modificar su valor debe eliminar el registro existente e ingresarlo nuevamente',
        'warning'
      )
      disablebBtnRegistro.value = true

      row.id = undefined
      row.movement_id = undefined
      row.movement_description = undefined
      row.income_expense = undefined
    } else {
      disablebBtnRegistro.value = false
    }

    return exists
  }

  const undoClosureFundsText = ref('')

  watch(
    () => selectedRows.value,
    (rows) => {
      if (rows && rows.length > 0) {
        const fundCodes = rows.map((row) => row.fund_code).join(', ')
        undoClosureFundsText.value = `Se va a deshacer el proceso del cierre del(os) fondo(s) ${fundCodes}\n\n¿Desea continuar con el proceso?`
      }
    },
    { deep: true }
  )

  const onConfirmProcessClosure = () => {
    alertModalConfirmProcessRef.value?.openModal()
  }

  const onProcessClosure = async () => {
    openMainLoader(true)
    let responseProcessClosure
    if (arrMovementsForParticipationTypeRequest.value.funds.length > 0) {
      if (
        arrMovementsForParticipationTypeRequest.value.closing_date === '' ||
        arrMovementsForParticipationTypeRequest.value.closing_date === undefined
      ) {
        arrMovementsForParticipationTypeRequest.value.closing_date = new Date()
          .toISOString()
          .split('T')[0]
      }

      responseProcessClosure = await _processClosure(
        arrMovementsForParticipationTypeRequest?.value
      )
    } else if (tempArrMovementsForParticipationType.value.funds.length === 0) {
      const dataToProcess = transformParticipationTableToTempMovements(
        tablePropsTypeofParticipation.value.rows
      )
      tempArrMovementsForParticipationType.value = dataToProcess

      responseProcessClosure = await _processClosure(dataToProcess)
    } else {
      if (
        tempArrMovementsForParticipationType.value.closing_date === '' ||
        tempArrMovementsForParticipationType.value.closing_date === undefined
      ) {
        tempArrMovementsForParticipationType.value.closing_date = new Date()
          .toISOString()
          .split('T')[0]
      }
      responseProcessClosure = await _processClosure(
        tempArrMovementsForParticipationType.value
      )
    }
    alertModalConfirmProcessRef.value?.closeModal()
    openMainLoader(false)
    if (responseProcessClosure) buttonsDisabled.value.undoClosure = false
  }

  //UploadFiles Methods
  const downloadTemplate = () => {
    openMainLoader(true)
    _downloadTemplate(
      dateSynchronize.value ?? new Date().toISOString().split('T')[0]
    )
    openMainLoader(false)
  }

  const addedFiles = (file: IUploadedFile[]) => {
    const newFileSizeMB = file[0].size / (1024 * 1024)

    if (isFileTooLarge(newFileSizeMB)) {
      handleLargeFile()
      return
    }
    addNewFile(file[0])
  }

  const isFileTooLarge = (sizeMB: number): boolean => {
    return sizeMB > MAX_FILE_SIZE_MB
  }

  const handleLargeFile = () => {
    showAlert('¡El archivo supera el tamaño máximo permitido (5mb)!', 'error')
    attachFilesRef.value?.removeFilesRemote()
  }

  const addNewFile = (file: IUploadedFile) => {
    const newFile: IFileAtachment = {
      id: file.__key,
      filename: file.name,
      total_records: 10,
      status: 20,
      file: file,
    }

    fileRowList.value.push(newFile)
  }

  const rejectedFiles = (fileRejected: QRejectedEntry[]) => {
    if (fileRejected[0]?.failedPropValidation === 'accept')
      showAlert('¡Tipo de archivo no permitido!', 'error')
    if (fileRejected[0]?.failedPropValidation === 'duplicate')
      showAlert('¡Este archivo ya ha sido añadido!', 'error')
    attachFilesRef.value?.removeFilesRemote()
  }

  const removeFile = () => {
    fileRowList.value = []
    tablePropertiesUploadFiles.value.rows = []
    attachFilesRef.value?.removeFilesRemote()
    flagStatusProgress.value = false
    flagStatusProgressError.value = false
  }

  const statusFunds = (
    items: IClosingCollectiveInvestmentFundsParticipationsStatus[]
  ) => {
    statusAllValidated.value = false
    statusAllPending.value = false
    statusMixed.value = false

    if (!items.length) return

    statusAllValidated.value = items.every((item) => item.id === 76)
    statusAllPending.value = items.every(
      (item) => item.id === 77 || item.id === 78
    )
    statusMixed.value = !statusAllValidated.value && !statusAllPending.value

    buttonsDisabled.value.undoClosure = !statusAllPending.value
  }

  onMounted(async () => {
    _cleanData()
    openMainLoader(true)
    await _getResources(
      { fics: ['funds'] },
      'filter[keep_availables]=true&sort=fund_code'
    )
    await _getMovementCodesCloseList(true)
    openMainLoader(false)
  })

  watch(
    () => selectedRadioFund.value,
    () => {
      if (
        selectedRadioFund.value &&
        selectedRadioFund.value.id &&
        selectedRadioFund.value.participation_id
      ) {
        rememberMovementsByFundIdParticipationId(
          tempArrMovementsForParticipationType.value,
          selectedRadioFund.value.fund_id,
          selectedRadioFund.value.participation_id
        )
      } else {
        tablePropsMovements.value.rows = []
      }
    }
  )

  watch(
    () => tablePropsMovements.value.rows,
    () => {
      if (tablePropsMovements.value.rows.length > 0) {
        makeTempArrMovementsForParticipationType(
          tablePropsMovements.value.rows.length
        )
      }
    },
    { deep: true }
  )

  watch(
    () => collective_investment_funds.value,
    () => {
      if (
        collective_investment_funds.value &&
        collective_investment_funds.value.length > 0
      ) {
        tablePropsModal.value.rows = organizedDataTableCollectiveInvesmentFund(
          collective_investment_funds.value
        )

        const statuses = collective_investment_funds.value.map(
          (fund) => fund.status
        )
        statusFunds(statuses)
      }
    }
  )

  watch(
    () => fund_id_second_filter.value,
    () => {
      if (fund_id_second_filter.value) {
        tablePropsMovements.value.rows = []
        selectedRadioFund.value = null

        const fundIndex =
          tempArrMovementsForParticipationType.value.funds.findIndex(
            (f) => f.id === fund_id_second_filter.value
          )
        if (fundIndex !== -1) {
          tempArrMovementsForParticipationType.value.funds.splice(fundIndex, 1)
        }

        filterConfigParticipation.value[1].options = []
        filtersRefParticipation.value?.cleanFiltersByNames?.([
          'participation_type_id',
        ])

        const item = selectedRows.value.find(
          (obj) => obj.id === fund_id_second_filter.value
        )

        if (item?.participation_types) {
          filterConfigParticipation.value[1].options = []
          filterConfigParticipation.value[1].options =
            tablePropsTypeofParticipation.value.rows
              .filter((row) => row.fund_code === item.fund_code)
              .map((row) => ({
                value: row.participation_id,
                label: `${row.participation_type} - ${row.participation_description}`,
              }))

          filterConfigParticipation.value[1].disable = false
        }
      } else {
        tablePropsMovements.value.rows = []
        selectedRadioFund.value = null
        filterConfigParticipation.value[1].options = []
        filtersRefParticipation.value?.cleanFiltersByNames?.([
          'participation_type_id',
        ])
      }
    }
  )

  return {
    headerProps,
    filterConfig,
    filterConfigParticipation,
    filtersRef,
    filtersRefParticipation,
    alertModalRef,
    alertModalConfirmRef,
    alertModalConfirmProcessRef,
    alertModalConfirmProcessImportRef,
    alertModalConfirmValidateProcessImportRef,
    alertModalImportRef,
    fundIdFilterTypesParticipation,
    movement_codes_close_list,
    movementsImportBach,
    buttonsDisabled,
    disablebBtnRegistro,

    tablePropsModal,
    tablePropertiesUploadFiles,
    tablePropsMovements,
    tablePropsMovementsBach,
    tablePropsTypeofParticipation,
    selectedFundModalId,
    selectedFundlId,
    selectedParticipationId,
    selectedRadioFund,
    isFundsParticipationType,
    showState,
    alertModalConfirmConfig,
    alertModalConfirmConfigProcessImport,
    alertModalUndoClosureRef,
    alertModalUndoClosureMonetaryRef,
    undoClosureFundsText,
    styleCustomAttachFile,
    attachFilesRef,
    defaultIconsLucide,
    formAddMovementsTable,
    selectedRows,
    deleteId,
    statusMixed,
    flagStatusFunds,
    statusAllPending,

    useRules,
    validateDuplicateIds,
    handlerFilter,
    handlerFilterParticipation,
    handlerFieldChange,
    handlerFieldChangeParticipationTypes,
    handlerCleanDataFiltersParticipationType,
    _cleanData,
    actionsOptions,
    actionTableHeaderButton,
    addedFiles,
    rejectedFiles,
    onUpdateSelected,
    confirmModalCollectiveFunds,
    downloadTemplate,
    removeFile,
    handlerImportBachMovements,
    handlerImportBachMovementsValidation,
    handleCancelImportBachMovements,
    openAlertModalConfirmValidateProcessImport,
    saveImportBachMovements,
    onSynchronize,
    onConfirmProcessClosure,
    onProcessClosure,
    onUndoClosure,
    onConfirmUndoClosure,
    onConfirmUndoClosureMonetary,
    validateRouter,
    useUtils,
    flagStatusProgress,
    flagStatusProgressError,
    initializeTempArrMovementsStructure,
    tempArrMovementsForParticipationType,
  }
}

export default useClosingCollectiveInvestmentFundsList
