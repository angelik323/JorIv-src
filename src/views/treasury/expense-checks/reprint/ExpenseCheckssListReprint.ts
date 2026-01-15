// vue | pinia
import { computed, onBeforeUnmount, onMounted, ref, toRaw } from 'vue'
import { storeToRefs } from 'pinia'

// router
import router from '@/router'

//stores
import {
  useExpenseChecksStore,
  useFicResourceStore,
  useResourceManagerStore,
  useTreasuryResourceStore,
} from '@/stores'

// composables
import { useAlert, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide, formatParamsCustom } from '@/utils'

// interfaces
import {
  IBusinessBankAccounts,
  IExpenseCheckFilters,
  IExpenseCheckItem,
  IExpenseCheckSendFilters,
  IFieldFilters,
  ISelectorResources,
  TitleDescription,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { IResource } from '@/interfaces/global'
import moment from 'moment'

const { offices } = storeToRefs(useFicResourceStore('v1'))
const { business_bank_accounts, checkbooks, checks, business_trusts_egreso } =
  storeToRefs(useTreasuryResourceStore('v1'))

const { _getResources, _resetKeys } = useResourceManagerStore('v1')
const { showAlert } = useAlert()

const expenseChecksLoader = ref<boolean>(false)

const styleColumn = (width: number = 200) => ({
  'white-space': 'pre-wrap',
  'min-width': `${width}px`,
  'max-width': `${width}px`,
  'overflow-wrap': 'break-word',
})

const useExpenseReprintChecksList = () => {
  const {
    _loadExpenseChecksList,
    _loadPrintCheckPDF,
    _loadPrintChecks,
    _loadInfoCheckById,
    _resetExpenseChecksList,
  } = useExpenseChecksStore('v1')

  const { expenseChecksList, check_info, expense_checks_pages } = storeToRefs(
    useExpenseChecksStore('v1')
  )

  const { openMainLoader } = useMainLoader()

  const viewerFileComponentRef = ref()
  const alertExpenseChecksModalRef = ref()
  const expenseCheckFilterRef = ref()
  const isUpdatingResources = ref(false)

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    btnLabel: '',
    entityId: null as number | null,
    infoModal: [] as { title: string; description: string }[],
  })

  const currentFilters = ref()

  const getCheckbooksOptions = computed(() => checkbooks.value ?? [])
  const getExpenseChecksList = computed(() => expenseChecksList.value)
  const getExpenseChecksPages = computed(() => expense_checks_pages.value)
  const getChecksFromOptions = computed(() => {
    const list = checks.value ?? []
    return [...list].sort((a, b) => Number(a.value) - Number(b.value))
  })
  const getOfficeOptions = computed(() => offices.value ?? [])
  const getBusinessTrustsOptions = computed(
    () => business_trusts_egreso.value ?? []
  )
  const getBusinessBankAccountsOptions = computed(
    () => business_bank_accounts.value ?? []
  )

  const getCheckInfo = computed(() => check_info.value ?? [])

  const optionsMaxCalendar = (date: string | null) => {
    if (date === null) return false
    return date <= moment().format('YYYY/MM/DD')
  }

  const getCurrentFinalDate = ref<string | null>(null)

  const optionsMinCalendar: (date: string | null) => boolean = (date) => {
    const maxDate: string | null = getCurrentFinalDate.value ?? null
    if (!maxDate || !date) return false
    return date >= maxDate
  }

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'office_id',
      label: 'Oficina',
      type: 'q-select',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3',
      options: getOfficeOptions,
      disable: false,
      clean_value: true,
    },
    {
      name: 'office_name',
      label: 'Nombre de la oficina',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3',

      disable: true,
      clean_value: true,
      placeholder: 'Seleccione una oficina',
    },
    {
      name: 'business_id',
      label: 'Negocio',
      type: 'q-select',
      value: null,
      options: getBusinessTrustsOptions,
      autocomplete: true,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'business_name',
      label: 'Nombre del negocio',
      type: 'q-input',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'Seleccione un negocio',
    },
    {
      name: 'bank_account_id',
      label: 'Número de la cuenta bancaria',
      type: 'q-select',
      value: null,
      options: getBusinessBankAccountsOptions,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },

    {
      name: 'start_date',
      label: 'Fecha inicial',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      option_calendar: optionsMaxCalendar,
    },
    {
      name: 'end_date',
      label: 'Fecha final',
      type: 'q-date',
      value: null,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      option_calendar: optionsMinCalendar,
    },

    {
      name: 'checkbooks_id',
      label: 'Chequera',
      type: 'q-select',
      value: null,
      options: getCheckbooksOptions,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: true,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Seleccione',
    },
    {
      name: 'from_check_id',
      label: 'Desde cheque',
      type: 'q-select',
      value: null,
      options: getChecksFromOptions,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
    {
      name: 'to_check_id',
      label: 'Hasta cheque',
      type: 'q-select',
      value: null,
      options: getChecksFromOptions,
      class: 'col-xs-12 col-sm-6 col-md-3',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      hide: true,
    },
  ])

  const headerProps = {
    title: 'Reimprimir cheque con egreso',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Reimprimir cheque con egreso ',
        route: '',
      },
    ],
  }

  const tableProps = ref({
    title: 'Listado de cheque de egresos',
    loading: expenseChecksLoader,
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
        name: 'officeName',
        required: false,
        label: 'Nombre<br>de oficina',
        align: 'left',
        field: 'officeName',
        sortable: true,
      },
      {
        name: 'business',
        required: true,
        label: 'Negocio',
        align: 'left',
        field: 'business',
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'businessName',
        required: true,
        label: 'Nombre<br>del negocio',
        align: 'left',
        field: 'businessName',
        sortable: true,
      },
      {
        name: 'accountNumber',
        required: true,
        label: 'Número de<br>cuenta bancaria',
        align: 'left',
        field: 'accountNumber',
        sortable: true,
      },
      {
        name: 'registerDate',
        required: true,
        label: 'Fecha<br>registro',
        align: 'left',
        field: 'registerDate',
        sortable: true,
      },
      {
        name: 'checks',
        required: true,
        label: 'Chequera',
        align: 'left',
        field: 'checks',
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
    rows: getExpenseChecksList,
    pages: getExpenseChecksPages,
  })

  const loadExpenseChecksList = async (filters: string) => {
    expenseChecksLoader.value = true
    await _loadExpenseChecksList(filters, 69)
    expenseChecksLoader.value = false
  }

  const filtersFormat = ref<Record<string, string | number>>({})

  const setupFilters = (
    currentFilter: IExpenseCheckFilters
  ): IExpenseCheckSendFilters => {
    const excludeKeys = ['filter[office_name]', 'filter[business_name]']

    return Object.fromEntries(
      Object.entries(currentFilter).filter(
        ([key]) => !excludeKeys.includes(key)
      )
    ) as IExpenseCheckSendFilters
  }

  const handlerSearchFilter = ($filters: {
    'filter[office_id]': string
    'filter[office_name]': string
    'filter[business_id]': string
    'filter[business_name]': string
    'filter[bank_account_id]': string
    'filter[start_date]': string
    'filter[end_date]': string
    'filter[checkbooks_id]': string
    'filter[from_check_id]': string
    'filter[to_check_id]': string
  }) => {
    expenseChecksList.value = []
    filtersFormat.value = {
      ...$filters,
    }

    const setFilter = setupFilters($filters)

    const queryString = formatParamsCustom(setFilter)
    const toFilter = queryString ? '&' + queryString : ''
    loadExpenseChecksList(toFilter)
  }

  const handlerGotoIdURL = (componentName: string, idPage: number) => {
    router.push({ name: componentName, params: { id: idPage } })
  }
  const handlerGoToURL = (componentName: string) => {
    router.push({ name: componentName })
  }

  const openExpenseChecksModal = async (infoModal: { id: number }) => {
    openMainLoader(true)
    await _loadInfoCheckById(infoModal.id)
    openMainLoader(false)
    alertModalConfig.value.title = `Información del cheque #${infoModal.id}`
    alertModalConfig.value.entityId = infoModal.id
    alertModalConfig.value.description = `Impresion de cheques con egreso`
    alertModalConfig.value.btnLabel = 'Ver plan de pagos'
    await alertExpenseChecksModalRef.value.openModal()
  }

  const updatePage = async (page: number) => {
    currentFilters.value = {
      ...currentFilters.value,
      page: page,
    }

    const setFilter = setupFilters(currentFilters.value)
    const queryString = formatParamsCustom(setFilter)

    loadExpenseChecksList(queryString ? '&' + queryString : '')
  }
  const updateRows = (rows: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rows,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    loadExpenseChecksList(queryString ? '&' + queryString : '')
  }

  const closeExpenseChecksModal = async () => {
    await alertExpenseChecksModalRef.value.closeModal()
  }

  const showConvertToInfo = (
    columns: QTable['columns'] | undefined,
    descriptions: IExpenseCheckItem[] | null
  ): TitleDescription[] => {
    if (!columns || !descriptions?.length) return []

    const descriptionData = descriptions.find(
      (item): item is IExpenseCheckItem => item !== null
    )

    if (!descriptionData) return []

    const filteredColumns = columns.filter((col) => col.name !== 'actions')

    return filteredColumns.map((col) => ({
      title: col.label,
      description: String(descriptionData[col.name as keyof IExpenseCheckItem]),
    }))
  }

  const checkFilterName = (
    filterId: number,
    getOptions: ISelectorResources[] | IResource[] | IBusinessBankAccounts[],
    type: 'office_id' | 'business_code' | 'bank_account_id'
  ): string | number | IBusinessBankAccounts | null => {
    const check = getOptions.find((item) => item.value === filterId)

    if (type === 'business_code') {
      return check && 'label' in check ? check.label ?? null : null
    }

    if (type === 'office_id') {
      return check && 'office_description' in check
        ? check.office_description ?? null
        : null
    }

    if (type === 'bank_account_id') {
      return check && 'payload' in check ? check.payload.id : null
    }

    return null
  }

  const resetBySelectOffice = () => {
    expenseCheckFilterRef.value.cleanFiltersByNames(['office_name'])
    expenseCheckFilterRef.value.cleanFiltersByNames(['checkbooks_id'])
    expenseCheckFilterRef.value.cleanFiltersByNames(['bank_account_id'])

    business_bank_accounts.value = []
    checkbooks.value = []
    filterConfig.value[4].disable = true
    filterConfig.value[7].disable = true
  }

  const resetBySelectBussinesName = () => {
    expenseCheckFilterRef.value.cleanFiltersByNames(['business_name'])
    expenseCheckFilterRef.value.cleanFiltersByNames(['checkbooks_id'])
    checkbooks.value = []
    filterConfig.value[7].disable = true
  }

  const resetBySelectBankAccount = () => {
    expenseCheckFilterRef.value.cleanFiltersByNames(['checkbooks_id'])
    checkbooks.value = []
    filterConfig.value[8].disable = true
  }

  const selectOffice = async (newVal: number | undefined) => {
    resetBySelectOffice()

    const officeName = newVal
      ? checkFilterName(newVal, getOfficeOptions.value, 'office_id')
      : null

    expenseCheckFilterRef.value.setFieldValueByName('office_name', officeName)
    if (!newVal) return

    await loadBusinessAccountOptions(newVal)
  }

  const selectBusiness = async (businessVal: number, bankVal: number) => {
    resetBySelectBussinesName()

    const businessName = businessVal
      ? checkFilterName(
          businessVal,
          getBusinessTrustsOptions.value,
          'business_code'
        )
      : null

    expenseCheckFilterRef.value.setFieldValueByName(
      'business_name',
      businessName
    )

    const checkBankId = getBusinessBankAccountsOptions.value.find(
      (item) => item.value === bankVal
    )?.payload.bank_id

    if (checkBankId && businessVal) loadChecksbooks(businessVal, checkBankId)
  }

  const selectBankAccount = (newVal: number) => {
    const accountNumber = newVal
      ? checkFilterName(
          newVal,
          getBusinessBankAccountsOptions.value,
          'bank_account_id'
        )
      : null

    const checkBankId = getBusinessBankAccountsOptions.value.find(
      (item) => item.value === newVal
    )?.payload.bank_id
    const checkBusinessId = currentFilters.value['filter[business_id]']

    expenseCheckFilterRef.value.setFieldValueByName(
      'bank_account_id',
      accountNumber
    )

    if (checkBusinessId && checkBankId)
      loadChecksbooks(Number(checkBusinessId), checkBankId)
  }

  const selectInitialDate = (newVal: string) => {
    expenseCheckFilterRef.value.cleanFiltersByNames(['end_date'])
    currentFilters.value['filter[end_date]'] = null

    const initialDate = newVal

    expenseCheckFilterRef.value.setFieldValueByName('start_date', initialDate)

    if (newVal) {
      const formattedDate = moment(newVal, moment.ISO_8601, true).format(
        'YYYY/MM/DD'
      )

      getCurrentFinalDate.value = formattedDate
      filterConfig.value[6].disable = false
    }
  }

  const onExpenseCheckUpdate = async ($filters: IExpenseCheckFilters) => {
    if (isUpdatingResources.value) return
    const currentOffice = $filters['filter[office_id]']
    const currentBusiness = $filters['filter[business_id]']
    const currentAccountBank = $filters['filter[bank_account_id]']
    const currentStartDate = $filters['filter[start_date]']

    if (
      currentFilters.value &&
      currentOffice !== currentFilters.value['filter[office_id]']
    ) {
      currentOffice
        ? selectOffice(Number(currentOffice))
        : resetBySelectOffice()
    }

    if (
      currentFilters.value &&
      currentBusiness !== currentFilters.value['filter[business_id]']
    ) {
      if (currentBusiness) {
        selectBusiness(Number(currentBusiness), Number(currentAccountBank))

        try {
          isUpdatingResources.value = true
          await _getResources(
            { treasury: ['checks'] },
            `filter[business_id]=${currentBusiness}`,
            'v2'
          )
        } finally {
          setTimeout(() => (isUpdatingResources.value = false), 200)
        }
      } else {
        resetBySelectBussinesName()
      }
    }

    if (
      currentFilters.value &&
      currentAccountBank !== currentFilters.value['filter[bank_account_id]']
    ) {
      currentAccountBank
        ? selectBankAccount(Number(currentAccountBank))
        : resetBySelectBankAccount()
    }

    if (
      currentFilters.value &&
      currentStartDate &&
      currentStartDate !== currentFilters.value['filter[start_date]']
    ) {
      selectInitialDate(String(currentStartDate))
    }

    currentFilters.value = {
      ...$filters,
    }
  }

  const loadBusinessAccountOptions = async (businessId: number) => {
    if (!businessId) return

    await _getResources(
      { treasury: ['business_bank_accounts'] },
      `business_id=${businessId ?? ''}`,
      'v2'
    )

    if (business_bank_accounts.value.length > 0) {
      filterConfig.value[4].disable = false
    } else {
      filterConfig.value[4].disable = true
    }
  }

  const loadChecksbooks = async (
    businessId: number,
    banckAccountId: number
  ) => {
    if (!businessId || !banckAccountId) {
      expenseCheckFilterRef.value.setFieldValueByName('checkbooks_id', null)
      filterConfig.value[7].value = null
    } else {
      await _getResources(
        { treasury: ['checkbooks'] },
        `filter[business_trust_id]=${
          businessId ?? ''
        }&filter[bank_id]=${banckAccountId}`,
        'v2'
      )

      if (checkbooks.value.length > 0) {
        filterConfig.value[7].disable = false
      } else {
        filterConfig.value[7].disable = true
      }
    }
  }

  const handlerShowFilters = (showMore: boolean) => {
    const hiddenFilters = ['from_check_id', 'to_check_id']
    filterConfig.value.forEach((field: IFieldFilters) => {
      if (hiddenFilters.includes(field.name)) {
        field.hide = !showMore
      }
    })
  }

  const viewFileasync = async (fileProxy: File | null) => {
    if (!fileProxy) {
      showAlert(`No hay archivo para mostrar`, 'error')
    } else {
      await viewerFileComponentRef.value.showFile(toRaw(fileProxy))
    }
  }

  const handlerShowViewerFile = async (obligationId: number) => {
    openMainLoader(true)
    if (!obligationId) {
      showAlert('No hay un id seleccionado', 'error')
      openMainLoader(false)
      return
    }

    const result = await _loadPrintCheckPDF(69, obligationId)
    await alertExpenseChecksModalRef.value.closeModal()
    openMainLoader(false)
    if (result) {
      await updatePage(1)
      await viewFileasync(result)
    }
  }

  const extractExpenseCheckIds = (items: IExpenseCheckItem[]): number[] => {
    return items.map((item) => item.id)
  }

  const loadPrintChecks = async (expenseChecks: IExpenseCheckItem[]) => {
    openMainLoader(true)
    const checkIds = extractExpenseCheckIds(expenseChecks)

    await _loadPrintChecks(69, checkIds)
    await updatePage(1)

    openMainLoader(false)
  }

  const handlerClear = () => {
    _resetExpenseChecksList()
  }

  onMounted(async () => {
    openMainLoader(true)
    handlerClear()
    await _getResources({ fics: ['offices'] })
    await _getResources({ treasury: ['business_trusts_egreso'] })

    openMainLoader(false)
  })

  onBeforeUnmount(() =>
    _resetKeys({
      fics: ['offices'],
      trust_business: ['business_trusts_egreso'],
      treasury: ['business_bank_accounts', 'checkbooks', 'checks'],
    })
  )

  return {
    headerProps,
    tableProps,
    filterConfig,
    defaultIconsLucide,
    getCheckInfo,

    openExpenseChecksModal,
    alertExpenseChecksModalRef,
    alertModalConfig,
    getExpenseChecksList,
    expenseCheckFilterRef,
    viewerFileComponentRef,

    updatePage,
    updateRows,
    handlerSearchFilter,
    handlerGotoIdURL,
    handlerGoToURL,
    handlerClear,
    closeExpenseChecksModal,
    showConvertToInfo,
    onExpenseCheckUpdate,
    handlerShowFilters,
    handlerShowViewerFile,
    loadPrintChecks,
  }
}

export default useExpenseReprintChecksList
