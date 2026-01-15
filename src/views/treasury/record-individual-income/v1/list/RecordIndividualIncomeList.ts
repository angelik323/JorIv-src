import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { useMainLoader, useRouteValidator, useUtils } from '@/composables'
import {
  IRecordIndividualIncomeFilterForm,
  IRecordIndividualIncomeDetailList,
  IRecordIndividualIncomeResponse,
  IRecordIndividualIncomeToConfirm,
  IRecordIndividualIncomeDetailView,
} from '@/interfaces/customs'
import {
  useRecordIndividualIncomeStore,
  useResourceManagerStore,
} from '@/stores'

const useRecordIndividualIncomeList = () => {
  const router = useRouter()

  const {
    data_list,
    data_pages,
    income_record_id,
    data_response,
    data_detail_view,
    data_filter_form,
  } = storeToRefs(useRecordIndividualIncomeStore('v1'))

  const {
    _getRecordIndividualIncomeList,
    _deleteRecordIndividualIncomeDetail,
    _getByIdRecordIndividualIncomeDetail,
    _confirmRecordIndividualIncome,
    _clearData,
    _validateRecordIndividualIncomeFilter,
  } = useRecordIndividualIncomeStore('v1')

  const { openMainLoader } = useMainLoader()
  const { formatParamsCustom } = useUtils()
  const { validateRouter } = useRouteValidator()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keysTreasury = { treasury: ['business_trusts_egreso'] }
  const keysFics = { fics: ['offices'] }

  const headerProperties = ref({
    title: 'Ingresos individuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Ingresos individuales',
        route: 'RecordIndividualIncomeList',
      },
    ],
  })

  const tableProps = ref({
    title: 'Listado de ingresos individuales',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'third_party',
        required: false,
        label: 'NIT beneficiario',
        align: 'left',
        field: (row: IRecordIndividualIncomeDetailView) => {
          const code = row.third_party?.document ?? ''
          const name = row.third_party?.name ?? ''
          return code || name ? `${code} - ${name}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'type_receive',
        required: false,
        label: 'Tipo de recaudo',
        align: 'center',
        field: (row: IRecordIndividualIncomeDetailView) => {
          const code = row.type_receive?.code ?? ''
          const description = row.type_receive?.description ?? ''
          return code || description ? `${code} - ${description}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'cost_center',
        required: false,
        label: 'Centro de costo',
        align: 'center',
        field: (row: IRecordIndividualIncomeDetailView) => {
          const code = row.cost_center?.code ?? ''
          const name = row.cost_center?.name ?? ''
          return code || name ? `${code} - ${name}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'cash_flow',
        required: false,
        label: 'Flujo de caja',
        align: 'center',
        field: (row: IRecordIndividualIncomeDetailView) => {
          const code = row.cash_flow?.code ?? ''
          const name = row.cash_flow?.name ?? ''
          return code || name ? `${code} - ${name}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'bank',
        required: false,
        label: 'Banco',
        align: 'center',
        field: (row: IRecordIndividualIncomeDetailView) => {
          const code = row.bank?.bank_code ?? ''
          const description = row.bank?.description ?? ''
          return code || description ? `${code} - ${description}`.trim() : ''
        },
        sortable: true,
      },
      {
        name: 'bank_account',
        required: false,
        label: 'Cuenta bancaria',
        align: 'center',
        field: (row: IRecordIndividualIncomeDetailView) => {
          const account_name = row.bank_account?.account_name ?? ''
          const account_number = row.bank_account?.account_number ?? ''
          return account_number || account_name
            ? `${account_number} - ${account_name}`.trim()
            : ''
        },
        sortable: true,
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: data_list.value as IRecordIndividualIncomeDetailList,
    pages: data_pages.value,
  })

  const formFilterRef = ref()
  const showModalView = ref(false)
  const alertModalDeleteRef = ref()
  const alertModalConfirmRef = ref()

  const initialModelsValues: IRecordIndividualIncomeResponse = {
    id: null,
    local_currency_value_total: 0,
    foreign_currency_value_total: 0,
    calculated_foreign_total: 0,
    calculated_local_total: 0,
    state: null,
    details: [],
  }

  const models = ref<IRecordIndividualIncomeResponse>({
    ...initialModelsValues,
  })

  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number | null>>({
    income_record_id: income_record_id.value,
  })

  const createdListData = computed(() => {
    return data_list.value.length > 0
  })

  const setValues = () => {
    if (!data_response.value) return
    Object.assign(models.value, data_response.value)
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getRecordIndividualIncomeList(filters)
    tableProps.value.loading = false

    setValues()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      income_record_id: income_record_id.value ?? null,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
      income_record_id: income_record_id.value ?? null,
    }
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const validateForm = async () => {
    return (await formFilterRef.value?.validateForm()) ?? false
  }

  const clearFilter = () => {
    formFilterRef.value?.clearForm()
  }

  const continueToCreate = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)
    const payload = data_filter_form.value as IRecordIndividualIncomeFilterForm
    const success = await _validateRecordIndividualIncomeFilter(payload)
    if (success) {
      router.push({ name: 'RecordIndividualIncomeCreate' })
    }
    openMainLoader(false)
  }

  const makeDataRequestConfirm = (): IRecordIndividualIncomeToConfirm => {
    const filterForm = data_filter_form.value
    const responseForm = data_response.value

    return {
      office_id: filterForm?.office_id ?? null,
      name_office: filterForm?.name_office ?? '',
      business_id: filterForm?.business_trust_id ?? null,
      name_business: filterForm?.name_business ?? '',
      date: filterForm?.date ?? '',
      movement_id: filterForm?.movement_id ?? null,
      voucher: filterForm?.voucher ?? '',
      sub_voucher: filterForm?.sub_voucher ?? '',
      foreign_currency_value_total:
        responseForm?.calculated_foreign_total ?? null,
      local_currency_value_total: responseForm?.calculated_local_total ?? null,
      state: null,
    }
  }

  const openModalView = async (id: number) => {
    await _getByIdRecordIndividualIncomeDetail(id)
    showModalView.value = true
  }

  const closeModalView = () => {
    showModalView.value = false
  }

  const openAlertModal = async (action: string, entityId: number | null) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Desea ${action} el ingreso individual?`
    if (action === 'eliminar') {
      await alertModalDeleteRef.value.openModal()
    } else if (action === 'confirmar') {
      await alertModalConfirmRef.value.openModal()
    }
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalDeleteRef.value.closeModal()
    openMainLoader(true)
    await _deleteRecordIndividualIncomeDetail(alertModalConfig.value.entityId)
    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
    openMainLoader(false)
  }

  const confirmAction = async () => {
    if (!income_record_id.value) return

    await alertModalConfirmRef.value.closeModal()
    const dataRequestConfirm = makeDataRequestConfirm()
    openMainLoader(true)
    const success = await _confirmRecordIndividualIncome(
      dataRequestConfirm,
      income_record_id.value
    )
    if (success) {
      await _clearData()
      await formFilterRef.value?.clearForm()
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keysTreasury, 'nature=Ingresos')
    await _getResources(keysFics)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysTreasury)
    _resetKeys(keysFics)
  })

  watch(
    () => data_list.value,
    () => {
      tableProps.value.rows = data_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...data_pages.value,
      }
    }
  )

  watch(
    () => income_record_id.value,
    (newId) => {
      if (newId) {
        const queryString = formatParamsCustom(filtersFormat.value)
        listAction(queryString ? '&' + queryString : '')
      }
    },
    { immediate: true }
  )

  return {
    headerProperties,
    clearFilter,
    continueToCreate,
    formFilterRef,
    tableProps,
    createdListData,
    alertModalConfig,
    alertModalConfirmRef,
    alertModalDeleteRef,
    showModalView,
    openModalView,
    closeModalView,
    openAlertModal,
    deleteAction,
    confirmAction,
    models,
    data_detail_view,
    updatePage,
    updatePerPage,
    validateRouter,
  }
}

export default useRecordIndividualIncomeList
