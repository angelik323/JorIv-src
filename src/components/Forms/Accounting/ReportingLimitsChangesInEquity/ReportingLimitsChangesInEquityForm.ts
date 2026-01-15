import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import {
  IAccountStructureFilter,
  IBusinessTrustTableRow,
  IFieldFilters,
  ITableRowLimit,
} from '@/interfaces/customs'

import {
  useAccountingResourceStore,
  useReportingLimitsForChangesInEquityStore,
  useResourceManagerStore,
} from '@/stores'
import { formatParamsCustom } from '@/utils'
import { WriteActionType } from '@/interfaces/global'
import { useAlert, useUtils } from '@/composables'

const useReportingLimitsChangesInEquityForm = (
  props: {
    action?: WriteActionType
    business?: string
    accountStructure?: string
    businessId?: number
    limitType?: string
  },
  emits: (event: 'update', payload: ITableRowLimit) => void
) => {
  const {
    account_structures_with_purpose,
    business_trusts_with_description_by_account_structure,
    patrimony_limit_type,
    account_group_by_code,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')
  const { _getListReportingLimits } =
    useReportingLimitsForChangesInEquityStore('v1')
  const { limits_list } = storeToRefs(
    useReportingLimitsForChangesInEquityStore('v1')
  )
  const { showAlert } = useAlert()

  const accountStructureForm = ref()
  let lastAccountStructureId: number | null

  const filterConfig = ref<IFieldFilters[]>([
    {
      name: 'account_structure_id',
      label: 'Estructura contable',
      type: 'q-select',
      value: null,
      clean_value: true,
      class: 'col-12 col-md-4',
      disable: false,
      options: account_structures_with_purpose,
      autocomplete: true,
      placeholder: 'Seleccione',
      isForceValue: false,
    },
  ])

  const businessTableProps = ref({
    loading: false,
    columns: [
      {
        name: 'business',
        label: 'Negocio',
        align: 'left' as const,
        field: (row: IBusinessTrustTableRow) => row.business_description,
        sortable: true,
      },
    ],
    rows: [] as IBusinessTrustTableRow[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const addReportingLimitsTableProps = ref({
    title: 'Agregar límites de reportes',
    loading: false,
    columns: [
      {
        name: 'limit',
        required: true,
        label: 'Límite*',
        align: 'left' as const,
        field: (row: ITableRowLimit) => row.limit ?? '',
        sortable: false,
      },
      {
        name: 'from_account',
        required: true,
        label: 'Desde cuenta*',
        align: 'left' as const,
        field: (row: ITableRowLimit) => row.from_account ?? '',
        sortable: false,
      },
      {
        name: 'to_account',
        required: true,
        label: 'Hasta cuenta*',
        align: 'left' as const,
        field: (row: ITableRowLimit) => row.to_account ?? '',
        sortable: false,
      },
    ],
    rows: [] as ITableRowLimit[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const getFormData = () => ({
    accounting_structure_id:
      filterConfig.value.find((f) => f.name === 'account_structure_id')?.value
        ?.id || null,
    limit: addReportingLimitsTableProps.value.rows.map((row) => ({
      limit_type: row.limit,
      from_account: row.from_account,
      to_account: row.to_account,
    })),
  })

  const loadExistingLimits = async () => {
    if (!lastAccountStructureId) return

    const filters = {
      'filter[account_structure_id]': lastAccountStructureId,
      'filter[business_trust_id]': props.businessId,
      'filter[limit_type]': props.limitType,
    }

    await _getListReportingLimits(formatParamsCustom(filters))

    addReportingLimitsTableProps.value.rows = (limits_list.value || []).map(
      (item) => ({
        id: item.id,
        limit: item.limit_type,
        from_account: item.from_account,
        to_account: item.to_account,
      })
    )
  }

  const handleFilter = async (filters: IAccountStructureFilter) => {
    let accountStructureId =
      filters['filter[account_structure_id]'] ?? filters.account_structure_id

    if (typeof accountStructureId === 'object') {
      accountStructureId = accountStructureId?.id
    }
    if (!accountStructureId) return

    const optionSelected = account_structures_with_purpose.value.find(
      (item) => item.id === Number(accountStructureId)
    )

    const filterItem = filterConfig.value.find(
      (f) => f.name === 'account_structure_id'
    )
    if (filterItem) {
      filterItem.value = optionSelected
        ? { id: optionSelected.id, label: optionSelected.name }
        : { id: accountStructureId }
    }

    lastAccountStructureId = Number(accountStructureId)

    const keyBusiness = {
      accounting: [
        `business_trusts_with_description_by_account_structure&filter[account_structures_id]=${accountStructureId}`,
      ],
    }

    await _getResources(keyBusiness)
    businessTableProps.value.rows =
      business_trusts_with_description_by_account_structure.value as IBusinessTrustTableRow[]

    if (!businessTableProps.value.rows.length) {
      showAlert(
        'No hay negocios asociados a esta estructura contable',
        'warning'
      )
    }
  }

  const patrimonyLimitOptions = computed(() =>
    (patrimony_limit_type.value || []).filter(
      (opt: { label?: string }) => opt.label?.toLowerCase() !== 'todos'
    )
  )

  const addRowTable = () => {
    if (!lastAccountStructureId) return

    const keyResources = {
      accounting: [
        `account_group_by_code&filter[account_structure_id]=${lastAccountStructureId}`,
        'patrimony_limit_type',
      ],
    }

    _getResources(keyResources, '', 'v2')

    addReportingLimitsTableProps.value.rows.push({
      id: null,
      limit: null,
      from_account: null,
      to_account: null,
    })
  }
  const notifyRowChange = (row: ITableRowLimit) => {
    emits('update', row)
  }

  const hideButton = () => {
    return props.action !== 'edit'
  }

  const handleClear = () => {
    const filterItem = filterConfig.value.find(
      (f) => f.name === 'account_structure_id'
    )
    if (filterItem) {
      filterItem.value = null
    }
    accountStructureForm.value = null
    lastAccountStructureId = null

    businessTableProps.value.rows = []
    addReportingLimitsTableProps.value.rows = []
  }

  const initializeEditMode = async () => {
    if (props.action === 'edit' && props.accountStructure) {
      const found = account_structures_with_purpose.value.find(
        (item) => item.code_purpose.trim() === props.accountStructure
      )

      if (found) {
        lastAccountStructureId = found.id

        const keyResources = {
          accounting: ['account_group_by_code', 'patrimony_limit_type'],
        }

        const filters = {
          'filter[account_structure_id]': found.id,
        }

        await _getResources(
          keyResources,
          useUtils().formatParamsCustom(filters),
          'v2'
        )
      }

      const filterItem = filterConfig.value.find(
        (f) => f.name === 'account_structure_id'
      )
      if (filterItem) {
        filterItem.value = {
          id: lastAccountStructureId,
          label: props.accountStructure,
        }
        filterItem.options = [
          { id: lastAccountStructureId, label: props.accountStructure },
        ]
        filterItem.disable = true
        filterItem.isForceValue = true
      }

      if (props.business) {
        businessTableProps.value.rows = [
          {
            business_code: '',
            business_description: props.business,
          } as IBusinessTrustTableRow,
        ]
      }
      await loadExistingLimits()
    }
  }

  const hasBusinesses = computed(() => businessTableProps.value.rows.length > 0)

  watch(account_structures_with_purpose, (list) => {
    if (list.length && props.action === 'edit') {
      initializeEditMode()
    }
  })

  return {
    addReportingLimitsTableProps,
    accountStructureForm,
    filterConfig,
    businessTableProps,
    patrimony_limit_type,
    account_group_by_code,
    hasBusinesses,
    patrimonyLimitOptions,
    handleFilter,
    addRowTable,
    getFormData,
    handleClear,
    hideButton,
    notifyRowChange,
  }
}

export default useReportingLimitsChangesInEquityForm
