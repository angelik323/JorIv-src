import { ref, computed } from 'vue'
import { QTable } from 'quasar'
import {
  ITirPurchaseForm,
  ITirPurchaseFlow,
  IIrrFlowRequest,
  ITableRoww,
} from '@/interfaces/customs'
import { useRegisterFixedIncomeLocalCurrencyStore } from '@/stores'

const useTirPurchase = () => {
  const formData = ref<ITirPurchaseForm>({ flows: [], tir_purchase: null })

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ITableRoww[]
    pages: { currentPage: number; lastPage: number }
  }>({
    title: 'TIR Compra',
    loading: false,
    columns: [
      {
        name: 'index',
        label: '#',
        align: 'left',
        field: '__index',
        sortable: false,
      },
      {
        name: 'date',
        label: 'Fecha',
        align: 'left',
        field: 'date',
        sortable: false,
      },
      {
        name: 'interest',
        label: 'Interés',
        align: 'right',
        field: 'interest',
        sortable: false,
      },
      {
        name: 'capital',
        label: 'Capital',
        align: 'right',
        field: 'capital',
        sortable: false,
      },
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 },
  })

  const rows = computed<ITableRoww[]>(() =>
    (formData.value.flows ?? []).map((f: ITirPurchaseFlow, idx: number) => ({
      __key: `${f.date}-${idx}`,
      __index: idx + 1,
      ...f,
    }))
  )

  const displayTir = computed(() =>
    typeof formData.value.tir_purchase === 'number' &&
    Number.isFinite(formData.value.tir_purchase)
      ? formData.value.tir_purchase
      : null
  )

  const setFlows = (flows: ITirPurchaseFlow[] = []) => {
    formData.value.flows = Array.isArray(flows) ? flows : []
    tableProps.value.rows = rows.value
  }

  const setTirPurchase = (tir: number | null | undefined) => {
    formData.value.tir_purchase =
      typeof tir === 'number' && Number.isFinite(tir) ? tir : null
  }

  const resetForm = () => {
    formData.value = { flows: [], tir_purchase: null }
    tableProps.value.rows = []
  }

  const validateForm = async (): Promise<boolean> => {
    return formData.value.flows.length > 0
  }

  const { _getIrrPurchaseFlow } = useRegisterFixedIncomeLocalCurrencyStore('v1')

  const loadFromService = async (payload: IIrrFlowRequest) => {
    tableProps.value.loading = true
    resetForm()
    const res = await _getIrrPurchaseFlow(payload)
    if (res) {
      const flows = res.cashflows.map((cf) => ({
        date: cf.date,
        interest: cf.amount - (cf.capital ?? 0),
        capital: cf.capital ?? 0,
      }))
      setFlows(flows)
      setTirPurchase(res.tir)
    }
    tableProps.value.loading = false
  }

  return {
    formData,
    tableProps,
    rows,
    displayTir,
    setFlows,
    setTirPurchase,
    resetForm,
    loadFromService,
    validateForm,
  }
}

export default useTirPurchase
