// Vue - Pinia - Quasar
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  IAccountingParametersMovements,
  IAccountingParametersMovementsList,
} from '@/interfaces/customs/fics/AccountingParametersMovements'

// Composables
import { useUtils, useMainLoader } from '@/composables'

// Stores
import { useAccountingParametersAccountingParametersMovementsStore } from '@/stores/fics/accounting-parameters/accounting-parameters-movements'
import { useAccountingParametersAccountingBlockStore } from '@/stores/fics/accounting-parameters/accounting-block'

const useAccountingParametersMovementsList = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, formatParamsCustom } = useUtils()

  const {
    _getAccountingParametersMovements,
    _deleteAccountingParametersMovements,
  } = useAccountingParametersAccountingParametersMovementsStore('v1')
  const {
    accounting_parameters_movements_list,
    accounting_parameters_movements_pages,
  } = storeToRefs(
    useAccountingParametersAccountingParametersMovementsStore('v1')
  )
  const { accounting_block_selected } = storeToRefs(
    useAccountingParametersAccountingBlockStore('v1')
  )

  const tableProps = ref({
    title: 'Parámetros contables',
    loading: false,
    customNoDataMessageTitle: 'Selecciona un bloque contable.',
    customNoDataMessageSubtitle: 'Aquí visualizará los parámetros contables.',
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
        name: 'movement_code',
        required: false,
        label: 'Código movimiento',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.movement_code?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'fund_type',
        required: false,
        label: 'Tipo fondo',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.fund_type?.abbreviation ?? ''} (${
            row.fund_type?.description ?? ''
          })`,
        sortable: true,
      },
      {
        name: 'departure_nature',
        required: false,
        label: 'Naturaleza de la partida',
        align: 'center',
        field: 'departure_nature',
        sortable: true,
      },
      {
        name: 'departure_account_chart',
        required: false,
        label: 'Cuenta contable partida',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.departure_account_chart?.code ?? ''} ${
            row.departure_account_chart?.name
              ? `- ${row.departure_account_chart?.name}`
              : ''
          }`,
        sortable: true,
      },
      {
        name: 'departure_auxiliar',
        required: false,
        label: 'Auxiliar',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.departure_auxiliar?.abbreviation ?? ''} ${
            row.departure_auxiliar?.description
              ? `(${row.departure_auxiliar?.description})`
              : ''
          }`,
        sortable: true,
      },
      {
        name: 'departure_third_party',
        required: false,
        label: 'Especifico',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.departure_third_party?.document ?? ''}`,
        sortable: true,
      },
      {
        name: 'departure_cost_center',
        required: false,
        label: 'Centro de costo',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.departure_cost_center?.code ?? ''} ${
            row.departure_cost_center?.name
              ? `- ${row.departure_cost_center?.name}`
              : ''
          }`,
        sortable: true,
      },
      {
        name: 'counterpart_type',
        required: false,
        label: 'Tipo contrapartida',
        align: 'center',
        field: 'counterpart_type',
        sortable: true,
      },
      {
        name: 'counterpart_nature',
        required: false,
        label: 'Naturaleza contrapartida',
        align: 'center',
        field: 'counterpart_nature',
        sortable: true,
      },
      {
        name: 'counterpart_account_chart',
        required: false,
        label: 'Cuenta contable contrapartida',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.counterpart_account_chart?.code ?? ''} ${
            row.counterpart_account_chart?.name
              ? `- ${row.counterpart_account_chart?.name}`
              : ''
          }`,
        sortable: true,
      },
      {
        name: 'counterpart_auxiliar',
        required: false,
        label: 'Auxiliar contrapartida',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.counterpart_auxiliar?.abbreviation ?? ''} ${
            row.counterpart_auxiliar?.description
              ? `(${row.counterpart_auxiliar?.description})`
              : ''
          }`,
        sortable: true,
      },
      {
        name: 'counterpart_third_party',
        required: false,
        label: 'Especifico contrapartida',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.counterpart_third_party?.document ?? ''}`,
        sortable: true,
      },
      {
        name: 'counterpart_cost_center',
        required: false,
        label: 'Centro de costo contrapartida',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.counterpart_cost_center?.code ?? ''} ${
            row.counterpart_cost_center?.name
              ? `- ${row.counterpart_cost_center?.name}`
              : ''
          }`,
        sortable: true,
      },
      {
        name: 'receipt_type',
        required: false,
        label: 'Comprobante',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.receipt_type?.label ?? ''}`,
        sortable: true,
      },
      {
        name: 'sub_receipt_type',
        required: false,
        label: 'Subcomprobante',
        align: 'center',
        field: (row: IAccountingParametersMovements) =>
          `${row.sub_receipt_type?.label ?? ''}`,
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
    rows: [] as IAccountingParametersMovementsList,
    pages: accounting_parameters_movements_pages.value,
  })

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    entityId: null as number | null,
  })

  const filtersFormat = ref<Record<string, string | number>>({
    accounting_block_id: accounting_block_selected.value?.id ?? 0,
  })

  const handleFilter = async ($filters: {
    'filter[accounting_block_id]': string
  }) => {
    filtersFormat.value = {
      ...$filters,
    }

    const queryString = formatParamsCustom(filtersFormat.value)
    listAction(queryString ? '&' + queryString : '')
  }

  const listAction = async (filters: string = '') => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAccountingParametersMovements(filters)
    tableProps.value.loading = false
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

  const openAlertModal = async (action: string, entityId: number) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.title = `¿Está seguro que desea ${action} el parámetro contable?`
    await alertModalRef.value.openModal()
  }

  const deleteAction = async () => {
    if (!alertModalConfig.value.entityId) return

    await alertModalRef.value.closeModal()
    openMainLoader(true)
    await _deleteAccountingParametersMovements(alertModalConfig.value.entityId)
    handleFilter({
      'filter[accounting_block_id]': String(
        accounting_block_selected.value?.id
      ),
    })
    openMainLoader(false)
  }

  watch(
    () => accounting_parameters_movements_list.value,
    () => {
      tableProps.value.rows = accounting_parameters_movements_list.value
      tableProps.value.pages = {
        ...tableProps.value.pages,
        ...accounting_parameters_movements_pages.value,
      }
    }
  )

  watch(
    () => accounting_block_selected.value,
    (newAccountingBlock) => {
      if (newAccountingBlock) {
        handleFilter({
          'filter[accounting_block_id]': String(newAccountingBlock.id),
        })
      } else tableProps.value.rows = []
    },
    { immediate: true, deep: true }
  )

  return {
    tableProps,
    updatePage,
    updatePerPage,
    defaultIconsLucide,
    alertModalRef,
    alertModalConfig,
    openAlertModal,
    deleteAction,
    accounting_block_selected,
  }
}

export default useAccountingParametersMovementsList
