// Vue - Pinia - Quasar
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IAccountingParametersAccountingBlockList } from '@/interfaces/customs/fics/AccountingBlocks'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils, useMainLoader } from '@/composables'

// Stores
import { useAccountingParametersAccountingParametersMovementsStore } from '@/stores/fics/accounting-parameters/accounting-parameters-movements'
import { useAccountingParametersAccountingBlockStore } from '@/stores/fics/accounting-parameters/accounting-block'

const useAccountingBlockList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const {
    _getAccountingBlock,
    _setAccountingBlockSelected,
    _getByIdAccountingBlock,
    _clearDataAccountingBlock,
  } = useAccountingParametersAccountingBlockStore('v1')
  const { accounting_block_list, accounting_block_pages } = storeToRefs(
    useAccountingParametersAccountingBlockStore('v1')
  )
  const { _setAccountingParametersMovementsBlockSelected } =
    useAccountingParametersAccountingParametersMovementsStore('v1')

  const tableProps = ref({
    title: 'Bloque contable',
    loading: false,
    columns: [
      {
        name: 'select',
        label: '',
        field: 'id',
        align: 'left',
        sortable: true,
        required: true,
      },
      {
        name: 'consecutive',
        required: false,
        label: 'Consecutivo',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'business_group',
        required: false,
        label: 'Grupo negocio',
        align: 'center',
        field: (row: IAccountingParametersAccountingBlockList) =>
          `${row.business_group?.indice ?? ''}`,
        sortable: true,
      },
      {
        name: 'accounting_plan',
        required: false,
        label: 'Plan contable',
        align: 'center',
        field: (row: IAccountingParametersAccountingBlockList) =>
          `${row.accounting_plan?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'plan_cost_center',
        required: false,
        label: 'Centro de costos del plan',
        align: 'center',
        field: (row: IAccountingParametersAccountingBlockList) =>
          `${row.plan_cost_center?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'budget_block_id',
        required: false,
        label: 'Bloque presupuesto',
        align: 'center',
        field: 'budget_block_id',
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
    rows: accounting_block_list.value as IAccountingParametersAccountingBlockList[],
    pages: accounting_block_pages.value,
  })

  const accountingBlockSelected =
    ref<IAccountingParametersAccountingBlockList | null>(null)
  const filtersFormat = ref<Record<string, string | number>>({})
  const actionModal = ref<ActionType>('create')
  const showModalAccountingBlock = ref(false)

  const titleModalAccountingBlock = computed(() => {
    return actionModal.value === 'create'
      ? 'Crear bloque contable'
      : 'Editar bloque contable'
  })

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAccountingBlock(filters)
    tableProps.value.loading = false

    clearSelected()
  }

  const updatePage = async (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: rowsPerPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const getAccountingBlockById = async (id: number) => {
    openMainLoader(true)
    await _getByIdAccountingBlock(id)
    openMainLoader(false)
  }

  const openModalAccountingBlock = async (
    action: ActionType,
    id: number | null
  ) => {
    if (action === 'edit' && id) {
      await getAccountingBlockById(id)
    }
    actionModal.value = action
    showModalAccountingBlock.value = true
  }

  const closeModalAccountingBlock = () => {
    showModalAccountingBlock.value = false
  }

  const clearSelected = () => {
    accountingBlockSelected.value = null
    _setAccountingBlockSelected(null)
  }

  onMounted(() => {
    listAction()
  })

  onBeforeUnmount(() => {
    clearSelected()
    _clearDataAccountingBlock()
  })

  watch(
    () => accounting_block_list.value,
    () => {
      tableProps.value.rows = accounting_block_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...accounting_block_pages.value,
      }
    }
  )

  watch(
    () => accountingBlockSelected.value,
    () => {
      _setAccountingBlockSelected(accountingBlockSelected.value)
      _setAccountingParametersMovementsBlockSelected(
        accountingBlockSelected.value
      )
    }
  )

  return {
    tableProps,
    updatePage,
    updatePerPage,
    defaultIconsLucide,
    accountingBlockSelected,
    actionModal,
    openModalAccountingBlock,
    closeModalAccountingBlock,
    titleModalAccountingBlock,
    showModalAccountingBlock,
    listAction,
  }
}

export default useAccountingBlockList
