//Vue - Pinia
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
//Quasar
import { QTable } from 'quasar'
//Router
import router from '@/router'
//Composables
import { useMainLoader, useUtils, useGoToUrl } from '@/composables'
//Interfaces
import { ActionType } from '@/interfaces/global'
import {
  IRangeRow,
  IFieldFilters,
  ISelectorResources,
  IRangesForDeferredRequest,
} from '@/interfaces/customs'
//Stores
import {
  useResourceManagerStore,
  useRangesForDeferredStore,
  useAccountingResourceStore,
} from '@/stores'

const useInformationForm = (props: { action: ActionType; id?: string }) => {
  const { defaultIconsLucide, formatParamsCustom } = useUtils()
  const { openMainLoader } = useMainLoader()

  const {
    deferred_impairment_natures: natures,
    deferred_impairment_accounts: accounts,
    deferred_impairment_range_types: range_types,
    deferred_impairment_receipt_types: receipt_types,
    deferred_impairment_business_trusts: business_trusts,
    deferred_impairment_sub_receipt_types: sub_receipt_types,
    deferred_impairment_account_structures: account_structures,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createAction, _updateAction, _showAction } =
    useRangesForDeferredStore('v1')

  const filtersFormat = ref<Record<string, string | number>>({})
  const accounts_from = ref<ISelectorResources[]>([])
  const accounts_to = ref<ISelectorResources[]>([])
  const selectedRowId = ref<number | null>()
  const informationFormRef = ref()
  const structureLabel = ref('')
  const purposeLabel = ref('')
  const isView = computed(() => ['view'].includes(props.action))
  const isEdit = computed(() => ['edit'].includes(props.action))
  const isCreate = computed(() => ['create'].includes(props.action))
  const { goToURL } = useGoToUrl()
  let nextRowId = 1

  const keys = [
    'deferred_impairment_natures',
    'deferred_impairment_accounts',
    'deferred_impairment_range_types',
    'deferred_impairment_receipt_types',
    'deferred_impairment_business_trusts',
    'deferred_impairment_sub_receipt_types',
    'deferred_impairment_account_structures',
  ]

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'search',
      label: 'Estructura contable',
      type: 'q-input',
      value: null,
      class: 'col-12',
      disable: false,
      prepend_icon: defaultIconsLucide.magnify,
      clean_value: true,
      placeholder: 'Buscar por código de estructura y/o finalidad',
    },
  ])

  const tablePropertiesStructure = ref({
    loading: false,
    columns: [
      {
        name: 'radio_button',
        align: 'center',
        label: '',
        field: 'radio_button',
        sortable: true,
      },
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        align: 'left',
        label: 'Código estructura',
        field: (row) => row.code ?? '-',
        sortable: true,
      },
      {
        name: 'purpose',
        align: 'left',
        label: 'Finalidad',
        field: (row) => row.purpose ?? '-',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ISelectorResources[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tablePropertiesBusiness = ref({
    title: 'Negocios asociados a la estructura',
    loading: false,
    columns: [
      {
        name: 'id',
        align: 'left',
        label: '#',
        field: 'id',
        sortable: true,
      },
      {
        name: 'name',
        align: 'left',
        label: 'Negocio',
        field: (row) => row.name ?? '-',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as ISelectorResources[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const tablePropertiesRanges = ref({
    title: 'Rangos',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'range_type',
        required: true,
        label: 'Tipo de rango*',
        align: 'left',
        field: 'range_type',
        sortable: true,
      },
      {
        name: 'receipt_type',
        required: true,
        label: 'Tipo de comprobante*',
        align: 'left',
        field: 'receipt_type',
        sortable: true,
      },
      {
        name: 'sub_receipt_types',
        required: true,
        label: 'Sub tipo de comprobante*',
        align: 'left',
        field: 'sub_receipt_types',
        sortable: true,
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza*',
        align: 'left',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'account_from',
        required: true,
        label: 'Desde cuenta*',
        align: 'left',
        field: 'account_from',
        sortable: true,
      },
      {
        name: 'account_from_name',
        required: true,
        label: 'Nombre de cuenta*',
        align: 'left',
        field: 'account_from_name',
        sortable: true,
      },
      {
        name: 'account_to',
        required: true,
        label: 'Hasta cuenta*',
        align: 'left',
        field: 'account_to',
        sortable: true,
      },
      {
        name: 'account_to_name',
        required: true,
        label: 'Nombre de cuenta*',
        align: 'left',
        field: 'account_to_name',
        sortable: true,
      },
      ...(props.action === 'edit' || props.action === 'create'
        ? [
            {
              name: 'delete_button',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'delete_button',
              sortable: false,
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IRangeRow[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const loadDataStructures = async (filters?: string) => {
    openMainLoader(true)
    await _getResources(
      { accounting: ['deferred_impairment_account_structures'] },
      `${filters || ''}`
    )

    tablePropertiesStructure.value.rows = account_structures.value

    openMainLoader(false)
  }

  const loadDataBusiness = async (id: number) => {
    openMainLoader(true)
    await _getResources(
      { accounting: ['deferred_impairment_business_trusts'] },
      `filter[account_structure_id]=${id}`
    )

    tablePropertiesBusiness.value.rows = business_trusts.value
    openMainLoader(false)
  }

  const loadDataRanges = async () => {
    if (selectedRowId.value != null) {
      await _getResources(
        { accounting: ['deferred_impairment_accounts'] },
        `filter[account_structure_id]=${selectedRowId.value}`
      )

      accounts_from.value = accounts.value.map((acc) => ({ ...acc }))
      accounts_to.value = accounts.value.map((acc) => ({ ...acc }))
    }
  }

  const loadReceiptSubTypes = async (receiptTypeId: number) =>
    await _getResources(
      { accounting: ['deferred_impairment_sub_receipt_types'] },
      `filter[receipt_type_id]=${receiptTypeId}`
    )

  const loadAccountNameById = async (
    accountId: number,
    accountList: ISelectorResources[]
  ) => {
    await _getResources(
      { accounting: ['deferred_impairment_accounts'] },
      `filter[account_structure_id]=${accountId}`
    )

    const account = accountList.find((a) => a.value === accountId)
    return account?.name ?? accountList[0]?.name ?? '-'
  }

  const handleSelectReceiptType = (row: IRangeRow, receiptTypeId: number) => {
    row.receipt_type = receiptTypeId

    loadReceiptSubTypes(receiptTypeId)

    row.sub_receipt_types = sub_receipt_types.value[0]?.id
  }

  const handleSelectAccountFrom = async (row: IRangeRow, accountId: number) => {
    row.account_from = accountId
    row.account_from_name = await loadAccountNameById(
      accountId,
      accounts_from.value
    )
  }

  const handleSelectAccountTo = async (row: IRangeRow, accountId: number) => {
    row.account_to = accountId
    row.account_to_name = await loadAccountNameById(
      accountId,
      accounts_to.value
    )
  }

  const loadData = async () => {
    if (!props.id) return

    const data = await _showAction(Number(props.id))

    if (!data) return

    selectedRowId.value = data.account_structure.id
    tablePropertiesStructure.value.rows = [data.account_structure]

    structureLabel.value = isEdit
      ? `${data.account_structure.code} - ${data.account_structure.purpose}`
      : data.account_structure.code
    purposeLabel.value = data.account_structure.purpose

    tablePropertiesBusiness.value.rows = data.business_trusts || []

    await _getResources(
      { accounting: ['deferred_impairment_accounts'] },
      `filter[account_structure_id]=${data.account_structure.id}`
    )

    accounts_from.value = accounts.value.map((acc) => ({ ...acc }))
    accounts_to.value = accounts.value.map((acc) => ({ ...acc }))

    const mappedRanges: IRangeRow[] = []

    for (const range of data.ranges) {
      const accountFromId = isEdit
        ? range.from_account?.structure?.id
        : range.from_account?.structure?.code
      const accountToId = isEdit
        ? range.to_account?.structure?.id
        : range.to_account?.structure?.code

      const receiptTypeId = isEdit
        ? range.receipt_type?.id
        : range.receipt_type?.name

      const subReceiptTypeId = isEdit
        ? range.sub_receipt_type?.id
        : range.sub_receipt_type?.name

      const accountFromName = accountFromId
        ? await loadAccountNameById(accountFromId, accounts_from.value)
        : '-'

      const accountToName = accountToId
        ? await loadAccountNameById(accountToId, accounts_to.value)
        : '-'

      mappedRanges.push({
        id: range.id,
        range_type: range.range_type ?? null,
        nature: range.nature ?? null,
        receipt_type: receiptTypeId,
        sub_receipt_types: subReceiptTypeId,
        account_from: accountFromId,
        account_from_name: accountFromName,
        account_to: accountToId,
        account_to_name: accountToName,
      })
    }

    tablePropertiesRanges.value.rows = mappedRanges
  }
  const handleGoToList = () =>
    router.push({ name: 'RangesForDeferredList', query: { reload: 'true' } })

  const isFormValid = computed(() => {
    if (!selectedRowId.value) return false

    if (!tablePropertiesBusiness.value.rows.length) return false

    if (!tablePropertiesRanges.value.rows.length) return false

    return tablePropertiesRanges.value.rows.every(
      (row) =>
        row.range_type &&
        row.receipt_type &&
        row.sub_receipt_types &&
        row.nature &&
        row.account_from &&
        row.account_from_name &&
        row.account_to &&
        row.account_to_name
    )
  })

  const handleRadioSelection = (rowId: number, value: boolean) => {
    if (value) {
      selectedRowId.value = rowId
      loadDataBusiness(rowId)
    } else if (selectedRowId.value === rowId) selectedRowId.value = null
  }

  const handleAddRow = () => {
    tablePropertiesRanges.value.rows.push({
      id: nextRowId++,
      range_type: null,
      receipt_type: null,
      sub_receipt_types: null,
      nature: null,
      account_from: null,
      account_from_name: null,
      account_to: null,
      account_to_name: null,
    })
    loadDataRanges()
  }

  const handleDeleteRow = (id: number) => {
    const index = tablePropertiesRanges.value.rows.findIndex(
      (row) => row.id === id
    )
    if (index !== -1) {
      tablePropertiesRanges.value.rows.splice(index, 1)
    }
  }

  const handleFilter = ($filters: { 'filter[search]': string }) => {
    filtersFormat.value = {
      ...$filters,
    }
    loadDataStructures(formatParamsCustom(filtersFormat.value))
  }

  const handleClearFilters = () => {
    filtersFormat.value = {}

    loadDataStructures()
  }

  const handleSubmitForm = async () => {
    if (isView.value) handleGoToList()
    else {
      openMainLoader(true)

      let success = false
      const accountStructureId = selectedRowId.value
      const businessTrustId = tablePropertiesBusiness.value.rows[0]?.id

      if (accountStructureId == null || businessTrustId == null) {
        openMainLoader(false)
        return
      }

      const ranges = tablePropertiesRanges.value.rows.map((row) => ({
        range_type: String(row.range_type),
        nature: String(row.nature),
        receipt_type_id: Number(row.receipt_type),
        sub_receipt_type_id: Number(row.sub_receipt_types),
        from_account_id: Number(row.account_from),
        to_account_id: Number(row.account_to),
      }))

      const payload: IRangesForDeferredRequest = {
        id: Number(props.id),
        account_structure_id: accountStructureId,
        business_trust_id: businessTrustId,
        ranges,
      }

      if (isCreate) {
        success = await _createAction(payload)
        if (success) {
          goToURL('RangesForDeferredList')
        }
      } else if (isEdit) {
        success = await _updateAction(payload)
      }

      setTimeout(() => {
        if (success) handleGoToList()
        openMainLoader(false)
      }, 1000)
    }
  }
  watch(
    () => business_trusts.value,
    () => {
      tablePropertiesBusiness.value.rows = business_trusts.value
    }
  )

  onMounted(async () => {
    if (!isCreate.value) loadData()
    await _getResources({
      accounting: [
        'deferred_impairment_receipt_types',
        'deferred_impairment_range_types',
        'deferred_impairment_natures',
      ],
    })
  })

  onBeforeUnmount(() => _resetKeys({ accounting: keys }))

  return {
    isView,
    isEdit,
    natures,
    isCreate,
    isFormValid,
    accounts_to,
    range_types,
    purposeLabel,
    filterConfig,
    tablePropertiesBusiness,
    tablePropertiesStructure,
    accounts_from,
    receipt_types,
    selectedRowId,
    tablePropertiesRanges,
    structureLabel,
    sub_receipt_types,
    informationFormRef,
    defaultIconsLucide,

    handleSubmitForm,
    handleRadioSelection,
    handleSelectAccountTo,
    handleDeleteRow,
    handleClearFilters,
    handleSelectReceiptType,
    handleSelectAccountFrom,
    handleFilter,
    handleAddRow,
  }
}

export default useInformationForm
