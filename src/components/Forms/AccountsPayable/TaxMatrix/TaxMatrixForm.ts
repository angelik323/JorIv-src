// Vue - Pinia - Quasar
import { computed, ref, watch } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import { ActionType } from '@/interfaces/global'
import {
  ITaxMatrixItem,
  ITaxMatrixRow,
  TaxType,
} from '@/interfaces/customs/accounts-payable/TaxMatrix'

const OBLIGATION_LABEL_MAP: Record<string, string> = {
  'Agente de retencion IVA': 'Agente de retención',
  Autorretenedor: 'Autorretenedor',
  'Gran contribuyente': 'Gran contribuyente',
  'No responsable': 'No responsable',
  'Regimen simple de tributacion': 'Régimen simple de tributación',
  'Regimen especial': 'Régimen especial',
}

const normalizeLabel = (backendLabel: string): string => {
  return OBLIGATION_LABEL_MAP[backendLabel] || backendLabel
}

const useTaxMatrixForm = (props: {
  action: ActionType
  data?: ITaxMatrixItem | null
  taxType: TaxType | 'RFT' | 'RIV' | 'RIC' | 'RTE'
}) => {
  const taxMatrixFormRef = ref()

  const tableProps = ref({
    loading: false,
    columns: [] as QTable['columns'],
    customColumns: [] as string[],
    rows: [] as ITaxMatrixRow[],
  })

  const getValues = () => ({
    tax_type: props.taxType,
    rows: tableProps.value.rows,
  })

  const isReadonly = computed(() => ['list', 'view'].includes(props.action))

  const generateColumns = (rows: ITaxMatrixRow[]): void => {
    if (!rows || rows.length === 0) {
      tableProps.value.columns = []
      tableProps.value.customColumns = []
      return
    }

    const firstRow = rows[0]
    const columnKeys = Object.keys(firstRow.columns)

    const columns: QTable['columns'] = [
      {
        name: 'tercero',
        required: true,
        label: 'Tercero',
        align: 'left',
        field: (row: ITaxMatrixRow) => normalizeLabel(row.third_obligation),
        sortable: false,
      },
    ]

    columnKeys.forEach((key) => {
      columns.push({
        name: key,
        required: true,
        label: normalizeLabel(key),
        align: 'center',
        field: key,
        sortable: false,
      })
    })

    tableProps.value.columns = columns
    tableProps.value.customColumns = columnKeys
  }

  watch(
    () => props.data,
    (newVal) => {
      if (newVal && newVal.rows) {
        generateColumns(newVal.rows)

        tableProps.value.rows = newVal.rows.map((row: ITaxMatrixRow) => ({
          ...row,
        }))
      }
    },
    { immediate: true }
  )

  return {
    isReadonly,
    getValues,
    tableProps,
    taxMatrixFormRef,
  }
}

export default useTaxMatrixForm
