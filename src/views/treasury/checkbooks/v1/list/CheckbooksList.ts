// Vue - pinia
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IFieldFilters, ICheckbookResponse } from '@/interfaces/customs'
import { QTable } from 'quasar'

// Composables - utils - constants
import { useMainLoader, useRouteValidator } from '@/composables'
import { useValidator } from '@/composables/useValidator'

// Stores
import {
  useCheckbooksStore,
  useTreasuryResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useCheckbooksList = () => {
  const { _getCheckbooks, _deleteCheckbook, _clearData } =
    useCheckbooksStore('v1')
  const { data_list, data_pages } = storeToRefs(useCheckbooksStore('v1'))

  const {
    business_trust,
    banks_record_expenses,
    bank_account,
    reason_return_status,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()
  const { validateNumericStrict } = useValidator()
  const { validateRouter } = useRouteValidator()
  const bankReferenceId = ref()
  const accountBankId = ref()
  const filterRef = ref()
  const keys = {
    treasury: [
      'business_trust',
      'reason_return_status',
      'banks_record_expenses',
    ],
  }

  const tableProps = ref({
    title: 'Listado de chequeras',
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
        name: 'code',
        field: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        sortable: true,
      },
      {
        name: 'range_from',
        field: 'range_from',
        required: true,
        label: 'Rango desde',
        align: 'left',
        sortable: true,
      },
      {
        name: 'range_to',
        field: 'range_to',
        required: true,
        label: 'Rango hasta',
        align: 'left',
        sortable: true,
      },
      {
        name: 'assignment_date',
        field: 'assignment_date',
        required: true,
        label: 'Fecha asignación',
        align: 'left',
        sortable: true,
      },
      {
        name: 'next_consecutive',
        field: 'next_consecutive',
        required: true,
        label: 'Siguiente consecutivo',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status',
        field: 'status_id',
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
    rows: [] as ICheckbookResponse[],
    pages: data_pages,
  })

  const headerProps = {
    title: 'Chequeras',
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
        label: 'Chequeras',
        route: 'CheckbooksList',
      },
    ],
  }
  const filtersFormat = ref<
    {
      page: number
      rowsPerPage: number
    } & Record<string, string | number>
  >({
    page: 1,
    rowsPerPage: 20,
  })
  const onFilterBusiness = async (structureId: number, filterName: string) => {
    filtersFormat.value[filterName] = structureId

    const bank_keys = {
      treasury: ['banks_record_expenses'],
    }
    await _resetKeys(bank_keys)

    if (filtersFormat.value['filter[business_trust_id]']) {
      const structureFilter = `business_trust_id=${filtersFormat.value['filter[business_trust_id]']}`

      _getResources(bank_keys, structureFilter)
    }

    filterRef.value.cleanFiltersByNames(['bank_id', 'bank_account_id'])
  }

  const onFilterBank = async (structureId: number, filterName: string) => {
    filtersFormat.value[filterName] = structureId

    const bank_keys = {
      treasury: ['bank_account'],
    }
    await _resetKeys(bank_keys)

    if (
      filtersFormat.value['filter[business_trust_id]'] &&
      filtersFormat.value['filter[bank_id]']
    ) {
      const structureFilter = `filter[business_id]=${filtersFormat.value['filter[business_trust_id]']}&filter[bank_id]=${filtersFormat.value['filter[bank_id]']}`

      _getResources(bank_keys, structureFilter)
    }

    filterRef.value.cleanFiltersByNames(['bank_account_id'])
  }
  const filterConfig = computed<IFieldFilters[]>(() => [
    {
      name: 'business_trust_id',
      label: 'Negocio*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: business_trust.value,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El negocio es requerido'],
      onChange: onFilterBusiness,
    },
    {
      name: 'bank_id',
      label: 'Banco*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: banks_record_expenses.value,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'El banco es requerido'],
      onChange: onFilterBank,
    },
    {
      name: 'bank_account_id',
      label: 'Cuenta bancaria*',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: !banks_record_expenses.value.length
        ? []
        : bank_account.value.map((item) => ({
            label: item.name,
            value: item.id,
          })),
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => !!val || 'La cuenta bancaria es requerida'],
    },
    {
      name: 'code',
      label: 'Código',
      type: 'q-input',
      value: null,
      class: 'col-12 col-md-4',
      disable: false,
      clean_value: true,
      placeholder: 'Seleccione',
      rules: [(val: string) => validateNumericStrict(val, 3)],
    },
    {
      name: 'status_id',
      label: 'Estado',
      type: 'q-select',
      value: null,
      class: 'col-12 col-md-4',
      options: reason_return_status.value,
      disable: false,
      autocomplete: true,
      clean_value: true,
      placeholder: 'Seleccione',
    },
  ])

  const handleUpdateValues = (
    filters: Record<string, string | number | null>
  ) => {
    const bussinesId = filters['filter[business_trust_id]']
    const bankId = filters['filter[bank_id]']
    if (bussinesId) {
      const selectedStructure = business_trust.value.find(
        (item) => item.value === Number(bussinesId)
      )
      bankReferenceId.value = selectedStructure?.value ?? null
    }

    if (bankId) {
      const selectedBank = banks_record_expenses.value.find(
        (item) => item.value === Number(bankId)
      )
      accountBankId.value = selectedBank?.id ?? null
    } else {
      filterRef.value.setFieldValueByName('bank_account_id', null)
    }
  }

  const listAction = async (filters: Record<string, string | number>) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    await _getCheckbooks(filters)

    tableProps.value.loading = false
  }

  const handleFilter = async ($filters: {
    'filter[business_trust_id]': string
    'filter[bank_id]': string
    'filter[bank_account_id]': string
    'filter[code]': string
    'filter[status_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
      page: 1,
      rowsPerPage: filtersFormat.value.rowsPerPage,
    }

    await listAction(filtersFormat.value)
  }

  const clearFilters = () => {
    tableProps.value.rows = []
  }

  const updatePage = async (page: number) => {
    filtersFormat.value.page = page
    await listAction(filtersFormat.value)
  }

  const updateRowsPerPage = async (rowsPerPage: number) => {
    filtersFormat.value.page = 1
    filtersFormat.value.rowsPerPage = rowsPerPage

    await listAction(filtersFormat.value)
  }

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    entityId: null as number | null,
  })

  const openAlertModal = async (status: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} la chequera?`
  }

  const changeStatusAction = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)

    const success = await _deleteCheckbook(
      alertModalConfig.value.entityId as number
    )
    if (success) await listAction(filtersFormat.value)

    openMainLoader(false)
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  watch(
    data_list,
    () => {
      tableProps.value.rows = [...data_list.value]

      const { currentPage, lastPage } = data_pages.value
      tableProps.value.pages = {
        currentPage,
        lastPage,
      }
    },
    { deep: true }
  )

  /* watch(
    () => bankReferenceId.value,
    async (newValue) => {
      if (!newValue) return
      await _getResources({
        treasury: [`banks_record_expenses&business_trust_id=${newValue}`],
      })
    }
  ) */
  /* 
  watch(
    () => accountBankId.value,
    async () => {
      if (!accountBankId.value) return
      await _getResources({
        treasury: [
          `bank_account&filter[business_id]=${bankReferenceId.value}&filter[bank_id]=${accountBankId.value}`,
        ],
      })
    }
  ) */

  return {
    headerProps,
    tableProps,
    filterConfig,
    alertModalRef,
    filterRef,
    handleFilter,
    clearFilters,
    updatePage,
    updateRowsPerPage,
    openAlertModal,
    changeStatusAction,
    validateRouter,
    handleUpdateValues,
  }
}

export default useCheckbooksList
