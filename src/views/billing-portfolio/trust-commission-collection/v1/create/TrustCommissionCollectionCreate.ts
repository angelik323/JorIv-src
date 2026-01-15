// vue - router - quasar
import { ref, onBeforeMount, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import Big from 'big.js'

// Interfaces
import {
  IApplyCollection,
  ITrustCommissionCollectionItemList,
} from '@/interfaces/customs'
import { IBaseTableProps, IResource, ITabs } from '@/interfaces/global'

// Composables
import {
  useBigNumbers,
  useGoToUrl,
  useMainLoader,
  useUtils,
} from '@/composables'

// Stores
import { useTrustCommissionCollectionStore } from '@/stores/billing-portfolio/trust-commission-collection'
import { useBillingCollectStore } from '@/stores/resources-manager/billing-collect'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useTrustCommissionCollectionCreate = () => {
  const { _applyCollection, _getTrustCommissionCollectionList } =
    useTrustCommissionCollectionStore('v1')

  const { number_of_pay } = storeToRefs(useBillingCollectStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { createBigNumber, sum, minus } = useBigNumbers()

  // Referencias a formularios
  const basicDataFormRef = ref()

  const ops_number_of_pay = ref<IResource[]>([])

  const { formatCurrency, defaultIconsLucide, cleanEmptyFields, formatDate } =
    useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Aplicar recaudo de facturas',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Facturación y cartera',
        route: '',
      },
      {
        label: 'Recaudo de comisión fiduciaria',
        route: 'CollectionTrustCommissionList',
      },
      {
        label: 'Aplicar',
        route: 'CollectionTrustCommissionCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tableProps = ref<IBaseTableProps<ITrustCommissionCollectionItemList>>({
    title: 'Datos básicos de la factura',
    loading: false,
    wrapCells: true,
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
        name: 'invoice_number',
        field: 'invoice_number',
        required: true,
        label: 'Número factura',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
      {
        name: 'third_party',
        field: 'third_party_billing',
        required: true,
        label: 'Tercero',
        align: 'left',
        sortable: true,
        format: (val) =>
          val?.id
            ? `${val?.third_party_document_type} - ${val?.third_party_document} - ${val?.third_party_name}`
            : '-',
      },
      {
        name: 'total',
        field: 'total',
        required: true,
        label: 'Valor Total',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrency(val),
      },
      {
        name: 'expire_at',
        field: 'expire_at',
        required: true,
        label: 'Fecha de vencimiento',
        align: 'left',
        sortable: true,
        format: (val) => formatDate(val, 'YYYY-MM-DD'),
      },
      {
        name: 'status',
        field: 'status_id',
        required: true,
        label: 'Estado',
        align: 'center',
        sortable: true,
      },
      {
        name: 'payment_number',
        field: 'payment_number',
        required: true,
        label: 'Número de pago',
        align: 'center',
        sortable: true,
        format: (val) => formatCurrency(val ?? 0),
      },
      {
        name: 'payment_amount',
        field: 'payment_amount',
        required: true,
        label: 'Valor del pago',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrency(val ?? 0),
      },
      {
        name: 'amount_credited',
        field: 'amount_credited',
        required: true,
        label: 'Valor abonado a factura',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrency(val ?? 0),
      },
      {
        name: 'amount_pending',
        field: 'amount_pending',
        required: true,
        label: 'Valor pendiente de factura',
        align: 'left',
        sortable: true,
        format: (val) => formatCurrency(val ?? 0),
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: ITrustCommissionCollectionItemList[] | null
  ) => {
    if (!data) return {}

    const request: Partial<IApplyCollection> = {
      invoices:
        data.map((item) => ({
          id: item.id,
          payment_number: item.payment_number?.toString() ?? '',
          payment_amount: item.payment_amount ?? 0,
          amount_credited: item.amount_credited ?? 0,
          amount_pending: item.amount_pending ?? 0,
          type: item.type_invoice ?? '',
        })) || [],
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IApplyCollection> = {
      ...makeBaseInfoRequest(tableProps.value.rows),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [basicDataFormRef]

    try {
      valid = (await forms[tabActiveIdx]?.value?.validateForm()) ?? false
    } catch {
      valid = false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _applyCollection(payload)
    if (success) {
      goToURL('CollectionTrustCommissionList')
    }
    openMainLoader(false)
  }

  const updatePaymentOption = (
    opt: { label: string; value: number } | null,
    row: ITrustCommissionCollectionItemList
  ) => {
    const amountPending = createBigNumber(row?.amount_pending ?? 0)
    if (opt?.value && amountPending.gt(opt.value)) {
      const idx = ops_number_of_pay.value.findIndex(
        (item) => item.label === opt.label
      )
      if (idx !== -1) {
        ops_number_of_pay.value.splice(idx, 1)
      }
    } else {
      const optNotSelectedItem = number_of_pay.value?.find(
        (item) =>
          !ops_number_of_pay.value?.some((op) => op.label === item.label)
      )

      if (optNotSelectedItem) {
        ops_number_of_pay.value.push(optNotSelectedItem)
      }
    }
  }

  const getUsedPaymentAmount = (
    paymentLabel: string,
    excludeRowId: number
  ): Big => {
    return tableProps.value.rows.reduce((total, row) => {
      if (row.id === excludeRowId) return total
      if (row.payment_number === paymentLabel) {
        return sum(total, createBigNumber(row.payment_amount || 0))
      }
      return total
    }, createBigNumber(0))
  }

  const resetRowPayment = (
    row: ITrustCommissionCollectionItemList,
    totalInvoice: Big
  ) => {
    const creditedOriginal = createBigNumber(row.amount_credited_original || 0)

    row.payment_amount = 0

    row.amount_credited = creditedOriginal.lte(totalInvoice)
      ? creditedOriginal
      : totalInvoice

    const pending = minus(totalInvoice, creditedOriginal)
    row.amount_pending = pending.gte(0) ? pending : createBigNumber(0)
  }

  const updateRowPayment = (
    row: ITrustCommissionCollectionItemList,
    amountToApply: Big,
    totalInvoice: Big
  ) => {
    row.payment_amount = amountToApply

    const creditedOriginal = createBigNumber(row.amount_credited_original || 0)
    const newCredited = sum(creditedOriginal, amountToApply)

    row.amount_credited = newCredited.lte(totalInvoice)
      ? newCredited
      : totalInvoice

    const finalCredited = createBigNumber(row.amount_credited)
    const pending = minus(totalInvoice, finalCredited)
    row.amount_pending = pending.gte(0) ? pending : createBigNumber(0)
  }

  const handlePaymentNumberChange = (
    row: ITrustCommissionCollectionItemList,
    opt: { label: string; value: number } | null
  ) => {
    row.payment_number = opt?.label

    const totalInvoice = createBigNumber(row.total)

    updatePaymentOption(opt, row)

    if (!opt?.value) {
      resetRowPayment(row, totalInvoice)
      return
    }

    const totalPaymentAmount = createBigNumber(opt.value)
    const usedAmount = getUsedPaymentAmount(opt.label, row.id)
    const availableAmount = minus(totalPaymentAmount, usedAmount)

    if (availableAmount.lte(0)) {
      resetRowPayment(row, totalInvoice)
      return
    }

    const currentCredited = createBigNumber(row.amount_credited_original || 0)
    const pendingAmount = minus(totalInvoice, currentCredited)

    const amountToApply = availableAmount.lte(pendingAmount)
      ? availableAmount
      : pendingAmount

    updateRowPayment(row, amountToApply, totalInvoice)
  }

  const keys = {
    billing_collect: ['numbers-of-pay'],
  }

  onBeforeMount(async () => {
    _resetKeys({ billing_collect: ['numbers_of_pay'] })
  })

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)
    const storedData = localStorage.getItem(
      'trust-commission-collection-store-v1'
    )
    const result = await _getTrustCommissionCollectionList({
      with_total_payment: 'true',
      'filter[id]': storedData || '',
    })

    if (result) {
      tableProps.value.rows =
        result.list?.map((item) => ({
          ...item,
          amount_credited: item.payment?.total_pay ?? 0,
          amount_credited_original: item.payment?.total_pay ?? 0,
          amount_pending: item.payment?.total_pending ?? 0,
          amount_pending_original: item.payment?.total_pending ?? 0,
        })) || []
    }

    openMainLoader(false)
  })

  watch(number_of_pay, (newVal) => {
    ops_number_of_pay.value = [...newVal]
  })

  return {
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    tableProps,
    ops_number_of_pay,

    onSubmit,
    handlePaymentNumberChange,
    goToURL,
  }
}

export default useTrustCommissionCollectionCreate
