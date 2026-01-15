// Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITaxSettlementItem,
  ITaxSettlementUpdateItem,
  ITaxSettlementUpdatePayload,
  ITaxSettlementViewHeader,
} from '@/interfaces/customs/accounts-payable/TaxSettlement'

// Composables
import {
  useGoToUrl,
  useMainLoader,
  useUtils,
  useAlert,
  useBigNumbers,
} from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useTaxSettlementStore } from '@/stores/accounts-payable/tax-settlement'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

const useTaxSettlementEdit = () => {
  const route = useRoute()
  const settlementId = route.params.id ? +route.params.id : 1
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, toNumber } = useUtils()
  const { showAlert } = useAlert()
  const { createBigNumber } = useBigNumbers()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { settlement_concept_types, fiscal_charges, settlement_concept } =
    storeToRefs(useAccountsPayableResourceStore('v1'))

  const {
    _getTaxSettlementLiquidationView,
    _getTaxSettlementConceptsView,
    _getTaxSettlementDiscountsView,
    _updateTaxSettlement,
    _deleteTaxSettlementItem,
  } = useTaxSettlementStore('v1')
  const { liquidation_view_response, discounts_view_response } = storeToRefs(
    useTaxSettlementStore('v1')
  )

  const accountingResourcesStore = useAccountingResourceStore('v1')

  // refs
  const formData = ref({
    office_id: null as number | null,
    office_name: null as string | null,
    business_id: null as number | null,
    business_name: null as string | null,
    concept_id: null as number | null,
    concept_name: null as string | null,
    accounting_date: null as string | null,
    person_type: null as string | null,
    supplier: null as string | null,
    payment_request: null as string | null,
    status: null as string | null,
  })
  const settlementRows = ref<ITaxSettlementItem[]>([])
  const netValue = ref('0')

  const conceptsFormRef = ref<{
    handleSaveReteicas: () => Promise<boolean>
  } | null>(null)
  const discountsPaymentsFormRef = ref<{
    handleSaveDiscountEntries: () => Promise<boolean>
  } | null>(null)
  const accountingFormRef = ref<{
    handleUpdateAccounting: () => Promise<boolean>
  } | null>(null)

  const headerProps = {
    title: 'Editar liquidación tributaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Liquidación tributaria',
        route: 'TaxSettlementList',
      },
      {
        label: 'Editar',
        route: 'TaxSettlementEdit',
      },
      {
        label: `${settlementId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'settlement',
      label: 'Liquidación',
      icon: defaultIconsLucide.pdf,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'concepts',
      label: 'Conceptos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'discounts_payments',
      label: 'Descuentos/Pagos',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'accounting',
      label: 'Contabilidad',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(0)

  const resourceKeys = {
    accounts_payable: [
      'settlement_concept_types',
      'fiscal_charges',
      'settlement_concept',
      'ica_economic_activity_concepts',
      'settlement_concepts_by_structure_and_type',
      'settlement_concept_details',
    ],
    accounting: [
      'cost_center_active',
      'cost_center_codes_by_structure',
      'structure_by_business',
      'accounts_by_structure',
      'accounts_chart',
      'cost_center_structures_by_business_and_account_structure',
    ],
    third_party: ['cities'],
  }

  const mapHeaderToFormData = (header: ITaxSettlementViewHeader) => ({
    office_id: header.office_id,
    office_name: header.office_id ? `${header.office_id}` : '-',
    business_id: header.business_id,
    business_name: header.business_id ? `${header.business_id}` : '-',
    concept_id: null,
    concept_name: header.concept || '-',
    accounting_date: header.accounting_date,
    person_type: header.person_type || '-',
    supplier: header.supplier_name || '-',
    payment_request: header.payment_request_code || '-',
    status: header.status || '-',
  })

  const loadSettlementData = async () => {
    openMainLoader(true)

    await _getTaxSettlementLiquidationView(settlementId)
    await _getTaxSettlementConceptsView(settlementId)
    await _getTaxSettlementDiscountsView(settlementId)

    if (liquidation_view_response.value) {
      const { header, items } = liquidation_view_response.value

      formData.value = mapHeaderToFormData(header)

      if (items && Array.isArray(items)) {
        settlementRows.value = items.map((item) => ({
          ...item,
          new_liquidation_value:
            item.new_liquidation_value || item.value || '0',
        }))
        calculateNetValue()
      }
    }

    openMainLoader(false)
  }

  const loadAccountingResources = async () => {
    if (!formData.value.business_id) return

    openMainLoader(true)

    const businessParams = new URLSearchParams()
    businessParams.set(
      'filter[business_id]',
      String(formData.value.business_id)
    )

    await _getResources(
      { accounting: ['structure_by_business'] },
      businessParams.toString()
    )

    const structureByBusiness = accountingResourcesStore.structure_by_business
    if (structureByBusiness && structureByBusiness.length > 0) {
      const structureId = structureByBusiness[0].id
      const filterAccounts = new URLSearchParams()
      filterAccounts.set('filter[account_structure_id]', String(structureId))

      await _getResources(
        { accounting: ['accounts_by_structure'] },
        filterAccounts.toString(),
        'v1'
      )
    }

    await _getResources(
      {
        accounting: [
          'cost_center_structures_by_business_and_account_structure',
        ],
      },
      `filter[business_trust_id]=${formData.value.business_id}`,
      'v2'
    )

    openMainLoader(false)
  }

  const calculateNetValue = () => {
    const totalBase = settlementRows.value.reduce(
      (sum, row) => sum.plus(createBigNumber(toNumber(row.base, 0))),
      createBigNumber(0)
    )

    let totalIva = createBigNumber(0)
    let totalPayments = createBigNumber(0)
    let totalOtherTaxes = createBigNumber(0)

    settlementRows.value.forEach((row) => {
      const val = createBigNumber(
        toNumber(row.new_liquidation_value || row.value, 0)
      )
      const fiscalChargeId = row.fiscal_charge_id
      const fiscalChargeObj = fiscal_charges.value.find(
        (fc) => fc.value == fiscalChargeId
      )

      if (fiscalChargeObj) {
        const label = fiscalChargeObj.label.toLowerCase()
        if (label.includes('iva')) {
          totalIva = totalIva.plus(val)
        } else if (label.includes('pago')) {
          totalPayments = totalPayments.plus(val)
        } else {
          totalOtherTaxes = totalOtherTaxes.plus(val)
        }
      } else {
        totalOtherTaxes = totalOtherTaxes.plus(val)
      }
    })

    let totalDiscounts = createBigNumber(0)
    if (discounts_view_response.value?.summary?.discount_value) {
      totalDiscounts = createBigNumber(
        toNumber(discounts_view_response.value.summary.discount_value, 0)
      )
    }

    const net = totalBase
      .plus(totalIva)
      .plus(totalPayments)
      .minus(totalOtherTaxes)
      .minus(totalDiscounts)
    netValue.value = net.toFixed(2)
  }

  const isSettlementRowValid = (row: ITaxSettlementItem) => {
    if (!row) return false
    if (!row.type || String(row.type).trim() === '') return false
    if (!row.settlement_concept_id) return false

    const base = toNumber(row.base, -1)
    const perc = toNumber(row.percentage, -1)

    return base >= 0 && perc >= 0
  }

  const validateSettlementRows = (rows: ITaxSettlementItem[]) => {
    return Array.isArray(rows) && rows.some((row) => isSettlementRowValid(row))
  }

  const handleDeleteRow = async (itemId: number | string) => {
    if (typeof itemId === 'string' && itemId.startsWith('temp-')) {
      settlementRows.value = settlementRows.value.filter(
        (row) => row.id !== itemId
      )
      calculateNetValue()
      return
    }

    openMainLoader(true)
    await _deleteTaxSettlementItem(Number(itemId))
    await loadSettlementData()
    openMainLoader(false)
  }

  const handleUpdateSettlementRows = (rows: ITaxSettlementItem[]) => {
    settlementRows.value = rows.map((row) => ({ ...row }))
    calculateNetValue()
  }

  const handleContinue = async () => {
    if (tabActive.value === 'settlement') {
      const hasValid = validateSettlementRows(settlementRows.value)
      if (!hasValid) {
        return
      }
    }

    if (tabActive.value === 'concepts') {
      if (conceptsFormRef.value) {
        const saved = await conceptsFormRef.value.handleSaveReteicas()
        if (!saved) return
      }
    }

    if (tabActive.value === 'discounts_payments') {
      if (discountsPaymentsFormRef.value) {
        const saved =
          await discountsPaymentsFormRef.value.handleSaveDiscountEntries()
        if (!saved) return
      }
    }

    if (tabActiveIdx.value < tabs.value.length - 1) {
      tabActiveIdx.value++
      tabActive.value = tabs.value[tabActiveIdx.value].name
    }
  }

  const handleUpdate = async () => {
    if (tabActive.value === 'concepts' && conceptsFormRef.value) {
      const saved = await conceptsFormRef.value.handleSaveReteicas()
      if (!saved) return
    }

    if (
      tabActive.value === 'discounts_payments' &&
      discountsPaymentsFormRef.value
    ) {
      const saved =
        await discountsPaymentsFormRef.value.handleSaveDiscountEntries()
      if (!saved) return
    }

    openMainLoader(true)

    const validRows = settlementRows.value.filter((row) =>
      isSettlementRowValid(row)
    )

    const itemsToUpdate: ITaxSettlementUpdateItem[] = validRows
      .filter((row) => row.type && String(row.type).trim() !== '')
      .map((row: ITaxSettlementItem) => ({
        id: Number(row.id) || undefined,
        type: String(row.type).trim(),
        settlement_concept_id: row.settlement_concept_id || 0,
        fiscal_charge_id: row.fiscal_charge_id || null,
        base: toNumber(row.base, 0),
        percentage: toNumber(row.percentage, 0),
        new_liquidation_value: toNumber(
          row.new_liquidation_value || row.value,
          0
        ),
      }))

    const payload: ITaxSettlementUpdatePayload = {
      items: itemsToUpdate,
    }

    const success = await _updateTaxSettlement(payload, settlementId)

    if (success) {
      showAlert('Registro actualizado exitosamente.', 'success')
      goToURL('TaxSettlementList')
    } else {
      showAlert('El registro no pudo ser actualizado.', 'error')
    }

    openMainLoader(false)
  }

  const handleBack = () => {
    if (tabActiveIdx.value > 0) {
      tabActiveIdx.value--
      tabActive.value = tabs.value[tabActiveIdx.value].name
    } else {
      goToURL('TaxSettlementList')
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    await loadSettlementData()

    openMainLoader(true)

    await _getResources({
      accounts_payable: resourceKeys.accounts_payable,
      third_party: resourceKeys.third_party,
    })

    await _getResources(
      {
        accounting: [
          'cost_center_active',
          'cost_center_codes_by_structure',
          'accounts_chart',
        ],
      },
      'filter[type]=Operativo',
      'v2'
    )

    openMainLoader(false)

    await loadAccountingResources()
  })

  onBeforeUnmount(() => {
    _resetKeys(resourceKeys)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // selects
    settlement_concept_types,
    fiscal_charges,
    settlement_concept,

    // refs
    formData,
    settlementRows,
    netValue,
    conceptsFormRef,
    discountsPaymentsFormRef,
    accountingFormRef,
    settlementId,

    // utils
    defaultIconsLucide,

    // methods
    handleDeleteRow,
    handleUpdateSettlementRows,
    handleContinue,
    handleUpdate,
    handleBack,
    calculateNetValue,
    goToURL,
  }
}

export default useTaxSettlementEdit
