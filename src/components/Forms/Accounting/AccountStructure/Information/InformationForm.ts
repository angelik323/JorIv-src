import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

import { ActionType } from '@/interfaces/global'
import {
  IAccountStructureModel,
  IAccountStructureResponse,
  ICatalogLimit,
  ICatalogLimitResponse,
} from '@/interfaces/customs'

import { useAccountingResourceStore, useAccountStructuresStore } from '@/stores'
import { useAlert } from '@/composables'

const useAccountStructureForm = (
  props: {
    action: ActionType
    data?: IAccountStructureResponse
  },
  emits: Function
) => {
  const {
    account_structure_types,
    catalog_limit_groups,
    catalog_limit_natures,
    catalog_limit_types,
  } = storeToRefs(useAccountingResourceStore('v1'))

  const { showAlert } = useAlert()

  const { _deleteValidation } = useAccountStructuresStore('v1')

  const { accounting_catalog_type } = useAccountStructuresStore('v1')

  const accountStructureForm = ref()

  const maxAccountInputLenght = ref(60)

  const models = ref<IAccountStructureModel>({
    structure: '',
    purpose: '',
    type: '',
    status_id: 1,
    catalog_limits: [],
  })

  const canShowLimitAlert = ref(true)

  const notifyLimitConflict = () => {
    if (!canShowLimitAlert.value) return

    showAlert(
      'El rango de cuentas se superpone con otro límite con la misma naturaleza, tipo y grupo.',
      'warning',
      undefined,
      10000
    )

    canShowLimitAlert.value = false
  }

  const isAccountingCatalog = computed(
    () => models.value?.type === accounting_catalog_type
  )

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const catalogLimitsTableProps = ref({
    title: 'Límites de cuentas',
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
        name: 'code',
        required: true,
        label: 'Código',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'description',
        required: true,
        label: 'Descripción',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.description}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'nature',
        required: true,
        label: 'Naturaleza',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.nature.value}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'type',
        required: true,
        label: 'Tipo',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.type.value}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'group',
        required: true,
        label: 'Grupo',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.group.value}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'from_account',
        required: true,
        label: 'Desde cuenta',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.from_account}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'to_account',
        required: true,
        label: 'Hasta cuenta',
        align: 'left',
        field: (row: ICatalogLimitResponse) => `${row.to_account}`,
        sortable: true,
        style: styleColumn(200),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ICatalogLimit[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const isEdit = computed(() => props.action === 'edit')

  let perPage = 20

  watch(
    () => models.value,
    () => {
      catalogLimitsTableProps.value.rows = models.value.catalog_limits
      catalogLimitsTableProps.value.pages.lastPage = Math.ceil(
        models.value.catalog_limits.length / perPage
      )
      updateCatalogLimitsTableRows()
      emits('update')
    },
    {
      deep: true,
    }
  )

  const updateCatalogLimitsTableRows = () => {
    let { currentPage } = catalogLimitsTableProps.value.pages
    const { lastPage } = catalogLimitsTableProps.value.pages

    if (currentPage > lastPage) {
      currentPage = lastPage
    }

    catalogLimitsTableProps.value.rows = models.value.catalog_limits.slice(
      (currentPage - 1) * perPage,
      (currentPage - 1) * perPage + perPage
    )
  }

  const updatePage = () => {
    updateCatalogLimitsTableRows()
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    catalogLimitsTableProps.value.pages.lastPage = Math.ceil(
      models.value.catalog_limits.length / perPage
    )
  }

  const selectType = (row: ICatalogLimit, type: string) => {
    row.type = type
    row.group = ''
  }

  const rangesOverlap = (
    aFrom: number,
    aTo: number,
    bFrom: number,
    bTo: number
  ) => {
    if (
      Number.isNaN(aFrom) ||
      Number.isNaN(aTo) ||
      Number.isNaN(bFrom) ||
      Number.isNaN(bTo)
    )
      return false
    return aFrom <= bTo && aTo >= bFrom
  }

  const hasOverlappingLimit = (
    currentRow: ICatalogLimit,
    overrideFrom?: string,
    overrideTo?: string
  ): string | true => {
    if (!currentRow.nature || !currentRow.type || !currentRow.group) return true

    const currentFrom = Number(overrideFrom ?? currentRow.from_account)
    const currentTo = Number(overrideTo ?? currentRow.to_account)

    if (!currentFrom || !currentTo) return true

    const limits = models.value.catalog_limits
    const currentIndex = limits.findIndex((l) => l === currentRow)

    const sameGroupLimits = limits.filter((limit, index) => {
      if (limit === currentRow) return false
      if (index >= currentIndex) return false

      return (
        limit.nature === currentRow.nature &&
        limit.type === currentRow.type &&
        limit.group === currentRow.group
      )
    })

    const overlap = sameGroupLimits.some((limit) => {
      const from = Number(limit.from_account)
      const to = Number(limit.to_account)
      return rangesOverlap(currentFrom, currentTo, from, to)
    })

    if (overlap) {
      notifyLimitConflict()
      return ''
    }

    return true
  }

  const validateFromAccount = (row: ICatalogLimit) => (v: string) => {
    if (!v) return true

    if (row.to_account && Number(v) >= Number(row.to_account)) {
      return 'La cuenta desde debe ser menor que la cuenta hasta.'
    }

    const result = hasOverlappingLimit(row, v, row.to_account)
    if (result !== true) return result

    return true
  }

  const validateToAccount = (row: ICatalogLimit) => (v: string) => {
    if (!v) return true

    if (row.from_account && Number(row.from_account) >= Number(v)) {
      return 'La cuenta hasta debe ser mayor que la cuenta desde.'
    }

    const result = hasOverlappingLimit(row, row.from_account, v)
    if (result !== true) return result

    return true
  }

  const hasDuplicatedRow = (currentRow: ICatalogLimit): string | true => {
    if (
      !currentRow.nature ||
      !currentRow.type ||
      !currentRow.group ||
      !currentRow.from_account ||
      !currentRow.to_account
    ) {
      return true
    }

    const limits = models.value.catalog_limits
    const currentIndex = limits.findIndex((l) => l === currentRow)

    const duplicated = limits.some((limit, index) => {
      if (index === currentIndex) return false

      return (
        limit.nature === currentRow.nature &&
        limit.type === currentRow.type &&
        limit.group === currentRow.group &&
        String(limit.from_account) === String(currentRow.from_account) &&
        String(limit.to_account) === String(currentRow.to_account)
      )
    })

    if (duplicated) {
      notifyLimitConflict()
      return ''
    }

    return true
  }

  const validateUniqueLimit =
    (row: ICatalogLimit) =>
    (_v?: string): true | string => {
      return hasDuplicatedRow(row)
    }

  const addCatalogLimit = () => {
    models.value.catalog_limits.push({
      description: '',
      nature: '',
      type: '',
      group: '',
      from_account: '',
      to_account: '',
    })
  }

  const removeCatalogLimit = async (catalogLimitItem: ICatalogLimit) => {
    const { success } = await _deleteValidation(catalogLimitItem.id!)
    if (success) {
      const index = models.value.catalog_limits.indexOf(catalogLimitItem)
      if (index > -1) {
        models.value.catalog_limits.splice(index, 1)
      }
    }
  }

  const setFormData = () => {
    if (props.data) {
      models.value.structure = props.data.structure
      models.value.purpose = props.data.purpose
      models.value.type = props.data.type.value
      models.value.status_id = props.data.status.id
      props.data.catalog_limits.forEach((catalog_limit) => {
        models.value.catalog_limits.push({
          id: catalog_limit.id,
          code: catalog_limit.code,
          description: catalog_limit.description,
          nature: catalog_limit.nature.value,
          type: catalog_limit.type.value,
          group: catalog_limit.group.value,
          from_account: catalog_limit.from_account,
          to_account: catalog_limit.to_account,
        })
      })
    }
  }

  onMounted(async () => {
    setFormData()
  })

  watch(
    () => props.data,
    () => {
      setFormData()
    }
  )

  watch(
    () => models.value.structure,
    (val) => {
      if (val) {
        const coincidences = val.match(/0/g)
        maxAccountInputLenght.value = coincidences ? coincidences.length : 1
        if (
          accountStructureForm.value &&
          models.value.purpose &&
          models.value.type
        ) {
          accountStructureForm.value.validate(false)
        }
      }
    }
  )

  watch(
    () => models.value.catalog_limits,
    () => {
      canShowLimitAlert.value = true
    },
    { deep: true }
  )

  return {
    account_structure_types,
    catalog_limit_groups,
    catalog_limit_natures,
    catalog_limit_types,
    models,
    catalogLimitsTableProps,
    accountStructureForm,
    isEdit,
    isAccountingCatalog,
    maxAccountInputLenght,
    removeCatalogLimit,
    addCatalogLimit,
    updatePage,
    updatePerPage,
    selectType,
    validateFromAccount,
    validateToAccount,
    validateUniqueLimit,
  }
}

export default useAccountStructureForm
