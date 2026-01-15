// Vue - Pinia - Router - Quasar
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
// import { useRoute } from 'vue-router'

// Composables
// import { useUtils } from '@/composables'

// Interfaces
import {
  IBaseTableProps,
  ActionType,
  ActionTypeEnum,
} from '@/interfaces/global'
import {
  ISettlementFormulaItem,
  ISettlementFormula,
} from '@/interfaces/customs/clients/Clients'
import { ISettlementFormulasItem } from '@/interfaces/customs/accounts-payable/SettlementFormulas'

// Stores
import { useSettlementFormulasStore } from '@/stores/accounts-payable/settlement-formulas'
// import { useTrustBusinessResourceStore } from '@/stores/resources-manager'

const useTributaryList = (
  props: {
    action: ActionType
    selectedSettlementFormulasList?: ISettlementFormula[] | null
  },
  emit: Function
) => {
  const { _getSettlementFormulasList } = useSettlementFormulasStore('v1')
  const { settlement_formulas_list } = storeToRefs(
    useSettlementFormulasStore('v1')
  )

  const selectedRow = ref<number | null>(null)
  const selectedDataList = ref<ISettlementFormula[]>([])
  const assignSettlementFormulasList = ref<ISettlementFormula[]>([])

  const tableProps = ref<IBaseTableProps<ISettlementFormulaItem>>({
    title: 'Parámetros tributarios',
    loading: false,
    wrapCells: true,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'code',
        required: true,
        label: 'Código del Parámetro',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre del parámetro tributario',
        align: 'center',
        field: 'name',
        sortable: true,
      },
      {
        name: 'iva',
        required: true,
        label: 'IVA',
        align: 'center',
        field: 'iva',
        sortable: true,
      },
      {
        name: 'rete_iva',
        required: true,
        label: 'Rete IVA',
        align: 'center',
        field: 'rete_iva',
        sortable: true,
      },
      {
        name: 'rete_ica',
        required: true,
        label: 'Rete ICA',
        align: 'center',
        field: 'rete_ica',
        sortable: true,
      },
      {
        name: 'rete_fuente',
        required: true,
        label: 'Rete fuente',
        align: 'center',
        field: 'rete_fuente',
        sortable: true,
      },
      {
        name: 'municipal_taxes',
        required: true,
        label: 'Impuestos municipales',
        align: 'center',
        field: 'municipal_taxes',
        sortable: true,
      },
      {
        name: 'is_main',
        required: true,
        label: 'Principal',
        align: 'center',
        field: 'is_main',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const setValueTableProps = async (data: ISettlementFormulaItem[] | null) => {
    tableProps.value.rows = data ?? []
  }

  const setValueSelecteds = (data: ISettlementFormula[] | null) => {
    if (!data || !data.length) return

    const settlementIds = data
      .map((item) => Number(item.settlement_formula_id))
      .filter((id): id is number => id !== null && id !== undefined)

    const matchingRows = settlement_formulas_list.value
      .filter((row) => row.id !== undefined && settlementIds.includes(row.id))
      .map((row) => ({
        ...row,
        settlement_formula_id: row.id,
        is_main: data.some(
          (item) =>
            (item.settlement_formula_id === row.id || item.id === row.id) &&
            item.is_main
        ),
      }))

    const mainItem = data.find(
      (item) =>
        item.is_main &&
        item.settlement_formula_id &&
        settlementIds.includes(item.settlement_formula_id)
    )

    if (mainItem?.settlement_formula_id) {
      selectedRow.value = mainItem.settlement_formula_id
    }

    onUpdateSelectedDataList(matchingRows)
  }

  const listAction = async (
    filters: Record<string, string | number | null>
  ) => {
    tableProps.value.rows = []
    tableProps.value.loading = true

    const filtersObj =
      typeof filters === 'string'
        ? filters
          ? { search: filters }
          : {}
        : filters

    await _getSettlementFormulasList(filtersObj)

    tableProps.value.loading = false
  }

  const onUpdateSelectedDataList = (selecteds: ISettlementFormula[]) => {
    selectedDataList.value = selecteds

    onUpdateAssignSettlementFormulasList(selecteds)
  }

  const onUpdateAssignSettlementFormulasList = (
    selecteds: ISettlementFormula[]
  ) => {
    assignSettlementFormulasList.value = selecteds.map((item) => ({
      settlement_formula_id: item.id ?? item.settlement_formula_id ?? null,
      is_main: item.is_main ?? false,
    }))
  }

  const onUpdateSelectionRow = (row: ISettlementFormulaItem) => {
    if (!row.id) return
    if (!selectedDataList.value.some((item) => item.id === row.id)) return

    assignSettlementFormulasList.value = assignSettlementFormulasList.value.map(
      (item) => ({
        ...item,
        is_main: item.settlement_formula_id === row.id,
      })
    )

    emit('update:selected-row', row)
  }

  onMounted(async () => {
    if (props.action !== ActionTypeEnum.VIEW) return
    await listAction({})
  })

  watch(
    () => settlement_formulas_list.value as ISettlementFormulasItem[],
    (val) => {
      if (!val) return
      setValueTableProps(val)
    },
    { immediate: true, deep: true }
  )

  watch(
    [
      () => settlement_formulas_list.value,
      () => props.selectedSettlementFormulasList,
    ],
    ([list, selected]) => {
      if (!list?.length || !selected?.length) return
      setValueSelecteds(selected)
    },
    { immediate: true, deep: true }
  )

  watch(
    () => assignSettlementFormulasList.value,
    (val) => {
      if (!val) return
      emit('update:selected-settlement-formulas-list', val)
    },
    { immediate: true, deep: true }
  )

  return {
    tableProps,
    selectedRow,
    selectedDataList,

    onUpdateSelectedDataList,
    onUpdateSelectionRow,
  }
}

export default useTributaryList
