import {
  IBalancePointMandateForm,
  IBalancePointStageMandateList,
} from '@/interfaces/customs'
import { ActionType } from '@/interfaces/global'
import { useBalancePointStore, useTrustBusinessResourceStore } from '@/stores'
import { isEmptyOrZero } from '@/utils'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { ref, watch } from 'vue'

const useMandateBalancePointForm = (props: { action: ActionType }) => {
  const mandateFormRef = ref()
  const models = ref<IBalancePointMandateForm>({
    stage_id: null,
    stage_name: '',
    general_mandate_name: '',
    general_mandate_id: null,
    mandates: [],
    total_general_order: 0,
  })

  const trustBusinessResourceStore = useTrustBusinessResourceStore('v1')
  const { project_stage, general_order } = storeToRefs(
    trustBusinessResourceStore
  )

  const { balance_point_response, data_balance_point_mandate_form } =
    storeToRefs(useBalancePointStore('v1'))
  const { _getStageMandateByID, _setDataMandateForm } =
    useBalancePointStore('v1')

  const tableStageMandateProperties = ref({
    title: 'Listado de encargos de la etapa',
    loading: false,
    columns: [
      {
        name: 'checked',
        required: true,
        label: '',
        align: 'center',
        field: 'checked',
        sortable: false,
      },
      {
        name: 'mandate_code',
        required: true,
        label: 'Número de encargo',
        align: 'left',
        field: 'mandate_code',
        sortable: true,
      },
      {
        name: 'fund_name',
        required: true,
        label: 'Fondo de inversión',
        align: 'left',
        field: 'fund_name',
        sortable: true,
      },
      {
        name: 'total_investment_balance',
        required: true,
        label: 'Saldo total de plan de inversión',
        align: 'left',
        field: 'total_investment_balance',
        sortable: true,
      },
      {
        name: 'yields',
        required: true,
        label: 'Rendimientos',
        align: 'left',
        field: 'yields',
        sortable: true,
      },
      {
        name: 'net_with_tax',
        required: true,
        label: 'Neto con impuesto',
        align: 'left',
        field: 'net_with_tax',
        sortable: true,
      },
      {
        name: 'net_without_tax',
        required: true,
        label: 'Neto sin impuesto',
        align: 'left',
        field: 'net_without_tax',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IBalancePointStageMandateList[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
    wrapCells: true,
  })

  const fetchStageMandateDetails = async () => {
    tableStageMandateProperties.value.rows = []
    models.value.mandates = []
    models.value.total_general_order = 0

    if (models.value.stage_id) {
      tableStageMandateProperties.value.loading = true
      const details = await _getStageMandateByID(models.value.stage_id)

      // Marcar como checked los mandatos que están en balance_point_response
      const updatedDetails = details.map((mandate) => ({
        ...mandate,
        checked:
          balance_point_response.value?.mandate_details.some(
            (selectedMandate) => selectedMandate.id === mandate.id
          ) || false,
      }))

      tableStageMandateProperties.value.rows = updatedDetails

      // También actualizar models.value.mandates con los preseleccionados
      if (balance_point_response.value?.mandate_details) {
        const preselectedMandates = updatedDetails.filter(
          (mandate) => mandate.checked
        )

        if (props.action === 'view') {
          tableStageMandateProperties.value.rows = preselectedMandates
        }

        models.value.mandates = preselectedMandates
        models.value.total_general_order = preselectedMandates.reduce(
          (acc, item) => acc + item.net_with_tax,
          0
        )
      }
      tableStageMandateProperties.value.loading = false
    }
  }

  const handleUpdateSelectedStageMandates = (
    selected: IBalancePointStageMandateList[]
  ) => {
    models.value.mandates = selected
    models.value.total_general_order = selected.reduce(
      (acc, item) => acc + item.net_with_tax,
      0
    )
  }

  const isRowSelected = (rowId: string): boolean => {
    return models.value.mandates.some((mandate) => mandate.id === rowId)
  }

  const areAllRowsSelected = (): boolean => {
    if (tableStageMandateProperties.value.rows.length === 0) return false
    return tableStageMandateProperties.value.rows.every((row) =>
      models.value.mandates.some((mandate) => mandate.id === row.id)
    )
  }

  const isSomeRowsSelected = (): boolean => {
    return models.value.mandates.length > 0 && !areAllRowsSelected()
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Seleccionar todas las filas disponibles
      models.value.mandates = [...tableStageMandateProperties.value.rows]
    } else {
      // Deseleccionar todas las filas
      models.value.mandates = []
    }

    // Recalcular el total
    models.value.total_general_order = models.value.mandates.reduce(
      (acc, item) => acc + item.net_with_tax,
      0
    )
  }

  const handleRowSelection = (
    row: IBalancePointStageMandateList,
    checked: boolean
  ) => {
    if (checked) {
      // Agregar el registro a la selección si no está presente
      if (!models.value.mandates.some((mandate) => mandate.id === row.id)) {
        models.value.mandates.push(row)
      }
    } else {
      // Remover el registro de la selección
      models.value.mandates = models.value.mandates.filter(
        (mandate) => mandate.id !== row.id
      )
    }

    // Recalcular el total
    models.value.total_general_order = models.value.mandates.reduce(
      (acc, item) => acc + item.net_with_tax,
      0
    )
  }

  watch(
    () => models.value.stage_id,
    () => {
      fetchStageMandateDetails()
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataMandateForm(null)
      } else {
        models.value.general_mandate_name =
          general_order.value.find(
            (item) => item.value === models.value.general_mandate_id
          )?.label || models.value.general_mandate_name || ''
        models.value.stage_name =
          project_stage.value.find(
            (item) => item.value === models.value.stage_id
          )?.label || models.value.stage_name || ''
        _setDataMandateForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => balance_point_response.value,
    (balancePoint) => {
      if (balancePoint) {
        const generalOrderExists = general_order.value.some(
          (item) => item.value === balancePoint.general_order.id
        )
        if (!generalOrderExists) {
          trustBusinessResourceStore.general_order.push({
            id: balancePoint.general_order.id,
            name: balancePoint.general_order.name,
            label: balancePoint.general_order.name,
            value: balancePoint.general_order.id,
          })
        }

        models.value = {
          stage_id: balancePoint.stage.id,
          stage_name: '',
          general_mandate_name: balancePoint.general_order.name,
          general_mandate_id: balancePoint.general_order.id,
          mandates: balancePoint.mandate_details,
          total_general_order: balancePoint.total_general_order,
        }
      }
    },
    { immediate: true }
  )

  // Watch para sincronizar las filas de la tabla cuando cambian los datos de la etapa
  watch(
    () => tableStageMandateProperties.value.rows,
    (newRows) => {
      // Si hay mandatos preseleccionados, mantener solo los que existen en las nuevas filas
      if (models.value.mandates.length > 0 && newRows.length > 0) {
        const validMandates = models.value.mandates.filter((mandate) =>
          newRows.some((row) => row.id === mandate.id)
        )
        models.value.mandates = validMandates
        models.value.total_general_order = validMandates.reduce(
          (acc, item) => acc + item.net_with_tax,
          0
        )
      }
    }
  )

  return {
    models,
    mandateFormRef,
    tableStageMandateProperties,
    project_stage,
    general_order,
    data_balance_point_mandate_form,
    handleUpdateSelectedStageMandates,
    isRowSelected,
    handleRowSelection,
    areAllRowsSelected,
    isSomeRowsSelected,
    handleSelectAll,
  }
}

export default useMandateBalancePointForm
