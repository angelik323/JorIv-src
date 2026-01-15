// Vue -pinia
import { ref, onMounted, watch, computed } from 'vue'
import { QTable, QTableColumn } from 'quasar'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters } from '@/interfaces/customs/Filters'
import { IPages } from '@/interfaces/customs/IPages'
import {
  IDetailedMovement,
  IInvestmentFundItem,
  IFundValidationResponse,
  IInvestmentFundValidationItem,
  IDetailedMovementParticipation,
  IInvestmentFundValidationDetail,
} from '@/interfaces/customs/fics/ValidationFicsClosing'

// Composables
import {
  useMainLoader,
  useRules,
  useGoToUrl,
  useUtils,
  useAlert,
} from '@/composables'

// Stores
import { useCollectiveInvestmentFundsStore } from '@/stores/fics/collective-investment-funds'
import { useValidationFicsClosingStore } from '@/stores/fics/validation-fics-closing'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

export default function useValidationFicsClosingList() {
  const { defaultIconsLucide, formatDate } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { showAlert } = useAlert()
  const { goToURL } = useGoToUrl()

  const { _getResources } = useResourceManagerStore('v1')
  const { funds } = storeToRefs(useFicResourceStore('v1'))
  const { _showAction } = useCollectiveInvestmentFundsStore('v1')

  const statusAllValidated = ref(false)
  const statusAllPending = ref(false)
  const statusMixed = ref(false)
  const flagStatusFunds = ref(false)
  const hasValidatedOnce = ref(false)

  const {
    _getFunds,
    _clearData,
    _validation,
    _undoValidation,
    _validationDetails,
    _getDetailedMovements,
    _transferParticipationType,
    _getDetailedMovementsParticipation,
  } = useValidationFicsClosingStore('v1')

  const {
    listFunds,
    detailedMovements,
    listFundsValidation,
    detailedMovementsParticipation,
  } = storeToRefs(useValidationFicsClosingStore('v1'))

  const headerProps = {
    title: 'Validación cierre de fondos de inversión colectiva',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Validación cierre de fondos de inversión colectiva',
        route: 'ValidationFicsClosingList',
      },
    ],
  }

  const updateFundFields = async (
    value: number | null,
    businessFieldName: string,
    dateFieldName: string
  ) => {
    if (!value) {
      filtersComponentRef.value?.setFieldValueByName?.(businessFieldName, '-')
      filtersComponentRef.value?.setFieldValueByName?.(dateFieldName, '')
      return
    }

    const fund_info = await _showAction(value.toString())

    const businessName = fund_info?.business_trust
      ? `${fund_info?.business_trust?.business_code} - ${fund_info?.business_trust?.name}`
      : '-'

    const validationDate =
      useUtils().formatDate(fund_info.last_closing_date, 'YYYY-MM-DD') || ''

    filtersComponentRef.value?.setFieldValueByName?.(
      businessFieldName,
      businessName
    )
    filtersComponentRef.value?.setFieldValueByName?.(
      dateFieldName,
      validationDate
    )
  }

  const onChangeFund = (value: number | null) => {
    updateFundFields(value, 'from_business', 'validation_date_from')
  }

  const onChangeToFund = (value: number | null) => {
    updateFundFields(value, 'to_business', 'validation_date_to')
  }

  const filtersComponentRef = ref()

  const filtersFormat = ref<Record<string, string | number>>({
    rows: 20,
    page: 1,
  })

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'from_fund',
      label: 'Desde fondo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      options: funds,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          v ? useRules().is_required(v) : 'El campo es requerido',
      ],
      onChange: onChangeFund,
    },
    {
      name: 'from_business',
      label: 'Negocio',
      type: 'q-input',
      value: '-',
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'validation_date_from',
      label: 'Fecha de validación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => (v ? useRules().length_exactly(v, 10) : true),
        (v: string) => (v ? useRules().date_is_not_weekend(v) : true),
        (v: string) =>
          v ? useRules().date_before_or_equal_to_the_current_date(v) : true,
      ],
    },
    {
      name: 'to_fund',
      label: 'Hasta fondo',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      options: funds,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [
        (v: string) =>
          v ? useRules().is_required(v) : 'El campo es requerido',
      ],
      onChange: onChangeToFund,
    },
    {
      name: 'to_business',
      label: 'Negocio',
      type: 'q-input',
      value: '-',
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: '-',
    },
    {
      name: 'validation_date_to',
      label: 'Fecha de validación',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-4 col-lg-4',
      disable: true,
      clean_value: true,
      placeholder: 'AAAA-MM-DD',
      mask: 'YYYY-MM-DD',
      rules: [
        (v: string) => useRules().valid_format_date(v, 'YYYY-MM-DD'),
        (v: string) => (v ? useRules().length_exactly(v, 10) : true),
        (v: string) => (v ? useRules().date_is_not_weekend(v) : true),
        (v: string) =>
          v ? useRules().date_before_or_equal_to_the_current_date(v) : true,
      ],
    },
  ])

  const handleFilter = async (filters: Record<string, string | number>) => {
    if ('filter[from_business]' in filters) {
      delete filters['filter[from_business]']
      delete filters['filter[to_business]']
      delete filters['filter[validation_date_from]']
      delete filters['filter[validation_date_to]']
    }
    filtersFormat.value = {
      rows: filtersFormat.value.rows,
      page: filtersFormat.value.page,
      ...filters,
    }
    listAction()
  }

  const columns: QTableColumn[] = [
    {
      name: 'id',
      label: '#',
      field: 'id',
      align: 'left',
      sortable: true,
      headerClasses: 'text-left',
    },
    {
      name: 'fund',
      label: 'Fondo',
      field: (row: IInvestmentFundValidationItem) =>
        `${row.fund.code} - ${row.fund.description}`,
      align: 'left',
      sortable: true,
      classes: 'ellipsis',
    },
    {
      name: 'participation_type',
      label: 'Tipo de participación',
      field: (row: IInvestmentFundValidationItem) =>
        `${row.participation_type.code} - ${row.participation_type.description}`,
      align: 'left',
      sortable: true,
      classes: 'ellipsis',
    },
    {
      name: 'business',
      label: 'Negocio',
      field: (row: IInvestmentFundValidationItem) =>
        `${row.business_trust.code} - ${row.business_trust.description}`,
      align: 'left',
      sortable: true,
      classes: 'ellipsis',
    },
  ]

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTableColumn[]
    rows: IInvestmentFundValidationItem[]
    pages: IPages
  }>({
    title: 'Validaciones',
    loading: false,
    columns,
    rows: [] as IInvestmentFundValidationItem[],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const investmentFundsTableProps = ref<{
    loading: boolean
    columns: QTableColumn[]
    rows: IInvestmentFundItem[]
  }>({
    loading: false,
    columns: [
      {
        name: 'fund_code',
        label: 'Código fondo de inversión',
        field: (row: IInvestmentFundItem) => row.fund_code,
        align: 'left',
        sortable: true,
        classes: 'ellipsis',
      },
      {
        name: 'fund_name',
        label: 'Descripción del fondo',
        field: (row: IInvestmentFundItem) => row.fund_name,
        align: 'left',
        sortable: true,
        classes: 'ellipsis',
      },
      {
        name: 'last_closing_date',
        label: 'Fecha de cierre',
        field: (row: IInvestmentFundItem) =>
          useUtils().formatDate(row?.last_closing_date ?? '', 'YYYY-MM-DD'),
        align: 'left',
        sortable: true,
        classes: 'ellipsis',
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'center',
        field: 'status',
      },
    ],
    rows: [],
  })

  const validationDetailsTableProps = ref<{
    loading: boolean
    columns: QTableColumn[]
    rows: IInvestmentFundValidationDetail[]
  }>({
    loading: false,
    columns: [
      {
        name: 'validator',
        label: 'Validador',
        field: (row: IInvestmentFundValidationDetail) => row.validator,
        align: 'left',
        sortable: true,
        classes: 'ellipsis',
      },
      {
        name: 'status',
        label: 'Estado',
        field: (row: IInvestmentFundValidationDetail) => row.status.status,
        align: 'left',
        sortable: true,
        classes: 'ellipsis',
      },
      {
        name: 'actions',
        label: 'Acciones',
        field: 'actions',
        align: 'center',
        classes: 'ellipsis',
      },
    ],
    rows: [],
  })

  let selectedFunds: number[] = []

  const handleFundsSelection = (val: {
    rows: number
    selected: IInvestmentFundItem[]
  }) => {
    flagStatusFunds.value = false
    selectedRows.value = []

    if (!val.selected || val.selected.length === 0) return

    const invalidFunds: string[] = []

    const date = val.selected[0].last_closing_date
    const status = val.selected[0].status.id

    for (const item of val.selected) {
      if (item.status.id === status && item.last_closing_date === date) {
        selectedRows.value.push(item)
      } else {
        invalidFunds.push(item.fund_name || item.fund_code || 'desconocido')
      }
    }

    if (invalidFunds.length > 0) {
      flagStatusFunds.value = true
      showAlert(
        `Los siguientes fondos no cumplen con la misma fecha de cierre o estado: ${invalidFunds.join(
          ', '
        )}`,
        'error'
      )
    }

    selectedFunds = val.selected.map((item: IInvestmentFundItem) => item.id)
  }

  const transformFundToValidationItems = (
    fund: IInvestmentFundItem
  ): IInvestmentFundValidationItem | IInvestmentFundValidationItem[] => {
    const baseFundData = {
      id: fund.id,
      code: fund.fund_code,
      description: fund.fund_name,
    }

    const businessTrustData = fund.business_trust
      ? {
          id: fund.business_trust.id,
          code: fund.business_trust.business_code,
          description: fund.business_trust.name,
        }
      : {
          id: 0,
          code: '-',
          description: 'Sin negocio asignado',
        }

    const items: IInvestmentFundValidationItem[] = []

    if (fund.consolidation_option) {
      items.push({
        id: fund.id,
        fund: baseFundData,
        participation_type: {
          id: fund.consolidation_option.id,
          code: fund.consolidation_option.code,
          description: fund.consolidation_option.name ?? '',
        },
        business_trust: businessTrustData,
      })
    }

    if (fund.participation_types && fund.participation_types.length > 0) {
      const participationItems = fund.participation_types.map(
        (participationType) => ({
          id: fund.id,
          fund: baseFundData,
          participation_type: participationType.business_line
            ? {
                id: participationType.business_line.id,
                code: participationType.business_line.code,
                description: participationType.business_line.description,
              }
            : {
                id: participationType.id,
                code: participationType.code,
                description: participationType.description,
              },
          business_trust: businessTrustData,
        })
      )
      items.push(...participationItems)
    }

    if (items.length === 0) {
      items.push({
        id: fund.id,
        fund: baseFundData,
        participation_type: {
          id: 0,
          code: '-',
          description: 'Sin tipo de participación',
        },
        business_trust: businessTrustData,
      })
    }

    return items.length === 1 ? items[0] : items
  }

  const getFundsValidations = (fundIds: number[]): void => {
    const filteredFunds = listFunds.value.filter((fund) =>
      fundIds.includes(fund.id)
    )

    const validations = filteredFunds.flatMap((fund) => {
      const items = transformFundToValidationItems(fund)
      const itemsArray = Array.isArray(items) ? items : [items]

      return itemsArray
    })

    tableProps.value.rows = validations
  }

  const validateAllFundsHaveParticipationTypes = (
    fundIds: number[]
  ): boolean => {
    const selectedFundsData = listFunds.value.filter((fund) =>
      fundIds.includes(fund.id)
    )

    return selectedFundsData.every(
      (fund) => fund.has_participation_types === false
    )
  }

  const filterFundsValidations = (): void => {
    if (selectedFunds.length === 0) {
      return
    }

    const selectedFundsData = listFunds.value.filter((fund) =>
      selectedFunds.includes(fund.id)
    )

    const statusesFunds = selectedFundsData.map((fund) => fund.status)
    statusFunds(statusesFunds)

    hasTransferredParticipationTypes.value =
      validateAllFundsHaveParticipationTypes(selectedFunds)

    getFundsValidations(selectedFunds)
    alertModalRef.value.closeModal()
  }

  const handleClear = () => {
    tableProps.value.rows = []
    isValidated.value = false
    hasValidatedOnce.value = false
  }

  const listAction = async () => {
    isValidated.value = false
    tableProps.value.rows = []
    tableProps.value.loading = true
    hasValidatedOnce.value = false

    openMainLoader(true)
    _clearData()
    await _getFunds(filtersFormat.value)
    openMainLoader(false)

    if (listFunds.value.length > 0) {
      alertModalRef.value.openModal()
    }
    tableProps.value.loading = false
  }

  const updatePage = (page: number) => {
    filtersFormat.value.page = page
    listAction()
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      page: 1,
    }
    listAction()
  }

  const selectedRows = ref<IInvestmentFundItem[]>([])

  const onUpdateSelected = (val: IInvestmentFundItem[]) => {
    selectedRows.value = val
  }

  const alertModalRef = ref()

  const hasTransferredParticipationTypes = ref<boolean>(false)

  const transferParticipationType = async () => {
    openMainLoader(true)
    const payload = {
      funds: selectedFunds.map((id) => ({ id })),
    }

    const success = await _transferParticipationType(payload)

    if (success) {
      hasTransferredParticipationTypes.value = success
    }
    openMainLoader(false)
  }

  const undoValidationModalRef = ref()

  const undoValidation = () => {
    undoValidationModalRef.value.openModal()
  }

  const confirmUndoValidation = async () => {
    undoValidationModalRef.value.closeModal()
    openMainLoader(true)

    const payload = {
      funds: selectedFunds.map((id) => ({ id })),
    }

    await _undoValidation(payload)
    openMainLoader(false)
  }

  const isValidated = ref<boolean>(false)
  const textValidate = ref<string>('Validar')

  const transformValidationResponse = (
    data: IFundValidationResponse[]
  ): IInvestmentFundValidationItem[] => {
    const transformedData: IInvestmentFundValidationItem[] = []

    const filteredData = data.filter((fund) => selectedFunds.includes(fund.id))

    for (const fund of filteredData) {
      for (const participationType of fund.participation_types) {
        transformedData.push({
          id: fund.id,
          fund: {
            id: fund.id,
            code: fund.fund_code,
            description: fund.fund_name,
          },
          participation_type: {
            id: participationType.participation_type_id,
            code: participationType.participation_type_id.toString(),
            description: participationType.participation_type_description,
          },
          business_trust: {
            id: 0,
            code: '-',
            description: '-',
          },
          participation_type_id: participationType.participation_type_id,
          last_closing_date: fund.last_closing_date,
          details: participationType.validations,
        })
      }
    }

    return transformedData
  }

  const validate = async () => {
    openMainLoader(true)

    const payload = {
      funds: selectedFunds.map((id) => ({ id })),
    }

    if (!hasValidatedOnce.value) {
      const ids = selectedRows.value.map((item: IInvestmentFundItem) => item.id)

      const idsToSend = ids.join(',')

      const filter = {
        'filter[id]': idsToSend,
      }
      const success = await _validationDetails(filter)

      if (success) {
        textValidate.value = 'Confirmar validación'
      }
    } else {
      const success = await _validation(payload)

      if (!success) {
        openMainLoader(false)
        return
      }
      statusAllValidated.value = true
    }

    if (listFundsValidation.value?.length > 0) {
      tableProps.value.rows = transformValidationResponse(
        listFundsValidation.value
      )
    }

    isValidated.value = true
    hasValidatedOnce.value = true

    openMainLoader(false)
  }

  const detailReviewModalRef = ref()

  const selectedDetailItem = ref<IInvestmentFundValidationDetail>()

  const processTypesProps = ref([
    {
      type: 'incomes',
      title: 'Revisión proceso por ingresos y gastos',
      loading: false,
      columns: [
        {
          name: 'id',
          label: '#',
          field: (row: IDetailedMovement) => row.id,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'movement_code',
          label: 'Código de movimiento',
          field: (row: IDetailedMovement) =>
            `${row.movement?.code ?? ''} - ${row.movement?.description ?? ''}`,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'movement_group',
          label: 'Grupo de movimiento',
          field: (row: IDetailedMovement) =>
            row.movement?.movement_group_code &&
            row.movement?.movement_group_description
              ? `${row.movement.movement_group_code} - ${row.movement.movement_group_description}`
              : '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'value',
          label: 'Valor',
          field: (row: IDetailedMovement) => row.value ?? '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'user',
          label: 'Usuario',
          field: (row: IDetailedMovement) => {
            const user = row.created_by
            return user ? `${user.name} ${user.last_name}`.trim() : '-'
          },
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'module',
          label: 'Módulo',
          field: (row: IDetailedMovement) =>
            row.movement?.origin_module_code &&
            row.movement?.origin_module_description
              ? `${row.movement.origin_module_code} - ${row.movement.origin_module_description}`
              : '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
      ] as QTable['columns'],
      rows: [] as IDetailedMovement[],
    },
    {
      type: 'expenses',
      title: 'Revisión proceso por ingresos y gastos',
      loading: false,
      columns: [
        {
          name: 'id',
          label: '#',
          field: (row: IDetailedMovement) => row.id,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'movement_code',
          label: 'Código de movimiento',
          field: (row: IDetailedMovement) => row.movement?.code ?? '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'movement_group',
          label: 'Grupo de movimiento',
          field: (row: IDetailedMovement) =>
            row.movement?.movement_group_code &&
            row.movement?.movement_group_description
              ? `${row.movement.movement_group_code} - ${row.movement.movement_group_description}`
              : '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'value',
          label: 'Valor',
          field: (row: IDetailedMovement) => row.value ?? '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'user',
          label: 'Usuario',
          field: (row: IDetailedMovement) => {
            const user = row.created_by
            return user ? `${user.name} ${user.last_name}`.trim() : '-'
          },
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'module',
          label: 'Módulo',
          field: (row: IDetailedMovement) =>
            row.movement?.origin_module_code &&
            row.movement?.origin_module_description
              ? `${row.movement.origin_module_code} - ${row.movement.origin_module_description}`
              : '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
      ] as QTable['columns'],
      rows: [] as IDetailedMovement[],
    },
    {
      type: 'movements',
      title: 'Revisión proceso erróneo para patrimonio',
      loading: false,
      columns: [
        {
          name: 'id',
          label: '#',
          field: (row: IDetailedMovementParticipation) => row.id,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'movement_code',
          label: 'Código de movimiento',
          field: (row: IDetailedMovementParticipation) =>
            row.movement_code.code,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'movement_class',
          label: 'Clase de movimiento',
          field: (row: IDetailedMovementParticipation) =>
            row.movement_code.process_class_id.toString(),
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'nature',
          label: 'Naturaleza',
          field: (row: IDetailedMovementParticipation) =>
            row.movement_code.process_nature_id.toString(),
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'value',
          label: 'Valor',
          field: (row: IDetailedMovementParticipation) => row.value,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'user',
          label: 'Usuario',
          field: (row: IDetailedMovementParticipation) => row.user,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'currency_operation',
          label: 'Operación moneda',
          field: (row: IDetailedMovementParticipation) =>
            row.operationType.description ?? '-',
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
        {
          name: 'investment_plan',
          label: 'Plan de inversión',
          field: (row: IDetailedMovementParticipation) => row.plan.code,
          align: 'left',
          sortable: true,
          classes: 'ellipsis',
        },
      ] as QTable['columns'],
      rows: [] as IDetailedMovementParticipation[],
    },
  ])

  const reviewProcessProps = computed(() => {
    return processTypesProps.value.find(
      (process) => process.type === selectedDetailItem.value?.validator_type
    )
  })

  const showDetailReview = async (
    validator: IInvestmentFundValidationDetail,
    validation: IInvestmentFundValidationItem
  ) => {
    selectedDetailItem.value = validator
    detailReviewModalRef.value?.openModal()
    openMainLoader(true)

    const params: {
      'filter[participation_type_id]': number
      'filter[closing_date]'?: string
      'filter[nature]'?: string
      'include[]'?: string
      'filter[ignoreReturns]'?: string
    } = {
      'filter[participation_type_id]': validation.participation_type_id!,
    }

    if (validation.last_closing_date) {
      params['filter[closing_date]'] = formatDate(
        validation.last_closing_date,
        'YYYY-MM-DD'
      )
      params['filter[ignoreReturns]'] = '1'
    }

    if (validator.validator_type == 'movements') {
      await _getDetailedMovementsParticipation(params)
    } else {
      params['filter[nature]'] = validator.validator_type
      params['include[]'] = 'movement'
      await _getDetailedMovements(params)
    }
    openMainLoader(false)
  }

  const statusFunds = (
    items: { id: number; status: string; comments: string | null }[]
  ) => {
    statusAllValidated.value = false
    statusAllPending.value = false
    statusMixed.value = false

    if (!items.length) return

    statusAllValidated.value = items.every((item) => item.id === 76)
    statusAllPending.value = items.every((item) => item.id === 77)
    statusMixed.value = !statusAllValidated.value && !statusAllPending.value
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(
      { fics: ['funds'] },
      'sort=fund_code&filter[keep_availables]=true'
    )
    openMainLoader(false)
  })

  watch(
    () => listFunds.value,
    () => {
      investmentFundsTableProps.value.rows = listFunds.value || []
      const statuses = investmentFundsTableProps.value.rows.map(
        (fund) => fund.status
      )
      statusFunds(statuses)
    },
    { deep: true }
  )

  watch(
    () => detailedMovements.value,
    (newData) => {
      if (selectedDetailItem.value?.validator_type && newData) {
        const processType = processTypesProps.value.find(
          (p) => p.type === selectedDetailItem.value?.validator_type
        )

        if (processType) {
          processType.rows = newData
        }
      }
    },
    { deep: true }
  )

  watch(
    () => detailedMovementsParticipation.value,
    (newData) => {
      if (newData) {
        const processType = processTypesProps.value.find(
          (p) => p.type === 'movements'
        )

        if (processType) {
          processType.rows = newData
        }
      }
    },
    { deep: true }
  )

  return {
    tableProps,
    isValidated,
    headerProps,
    filterConfig,
    selectedRows,
    alertModalRef,
    selectedDetailItem,
    reviewProcessProps,
    processTypesProps,
    detailReviewModalRef,
    undoValidationModalRef,
    investmentFundsTableProps,
    validationDetailsTableProps,
    hasTransferredParticipationTypes,
    filtersComponentRef,
    defaultIconsLucide,
    statusMixed,
    flagStatusFunds,
    statusAllValidated,
    statusAllPending,
    textValidate,
    validate,
    updatePage,
    handleClear,
    goToURL,
    handleFilter,
    updatePerPage,
    undoValidation,
    showDetailReview,
    onUpdateSelected,
    handleFundsSelection,
    confirmUndoValidation,
    filterFundsValidations,
    transferParticipationType,
  }
}
