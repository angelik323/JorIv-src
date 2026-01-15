// Vue - Pinia - Router - Quasar
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Composables
import { useUtils } from '@/composables'

// Interfaces
import {
  ITributaryForm,
  ILiquidationParamRow,
  ITributaryParamRow,
  IFormulaTax,
  ISettlementFormulaTributary,
  TaxesUIMap,
  SettlementParametersResult
} from '@/interfaces/customs/clients/ClientIndirectNaturalPerson'
import { ActionType } from '@/interfaces/global/Action'
import { IBaseTableProps } from '@/interfaces/global'

// Constants
import { TAX_TYPE_TO_FIELD_MAP, EMPTY_TAXES_UI } from '@/constants/clients/indirect/tributary'

// Stores
import { useClientsResourceStore, useResourceManagerStore } from '@/stores'

const useTributaryForm = (
  props: {
    action: ActionType
    data?: ITributaryForm | null
    settlement_formulas_list: ISettlementFormulaTributary[]
    thirdParty?: string
  },
  emit?: (e: 'update:data', value: ITributaryForm | null) => void
) => {

  const { isEmptyOrZero, defaultIconsLucide } = useUtils()

  const settlementFormulasListLocal = ref<ISettlementFormulaTributary[]>([])
  const thirdPartyFullName = ref<string | null>(null)

  const { _getResources: _getResourcesClientsV1, _resetKeys: _resetKeysClientsV1 } =
    useResourceManagerStore('v1')

  const formTributary = ref()
  const principalSelected = ref<number | null>(null)
  const selectedLiquidationRows = ref<ILiquidationParamRow[]>([])

  const isSettingModel = ref(false)

  const indirectNaturalPersonKeys = {
    clients: [
      'countries',
      'fiscal_responsability',
      'nationalities',
      'third_party_tin_options'
    ]
  }

  const {
    countries,
    fiscal_responsability,
    nationalities,
    third_party_tin_options
  } = storeToRefs(useClientsResourceStore('v1'))

  const models = ref<ITributaryForm>({
    tax_info: {
      tax_obligations: null,
      declares_tax: false,
      responsible_iva: false,
      has_tax_responsibility_outside_colombia: false,
      files_tax_return: false,
      vat_responsibility: "NO",
      foreign_phone: null,
      address: {
        id: null,
        address: null,
        postal_code: null,
        country_id: null,
        country: null
      }
    },
    nationality: {
      // TODO: en el payload se va el negado de este valor. Es true aqui para gestionar la logica a nivel de UI.
      has_different_nationality: true,
      nationality: null
    },
    address: {
      country: null,
      department: null,
      city: null,
      postal_address: null,
      has_notary_power_abroad: false,
      taxable_country: null,
      country_id: null,
      branch_address: null
    },
    details: {
      phone_code: null,
      tin_status: null,
      tin: null
    },
    liquidation_params: {
      thirdparty: null,
      tax_obligations: null,
      iva_responsible: null,
      iva_name_concept: null,
      iva_percentage: null,
      reteiva_name_concept: null,
      reteiva_percentage: null
    },
    settlement_formulas: []
  })

  const tableProps = ref<IBaseTableProps<ITributaryParamRow>>({
    loading: false,
    wrapCells: true,
    columns: [
      { name: 'id', required: true, label: '#', align: 'center', field: 'id', sortable: true },
      { name: 'tributary_param', required: true, label: 'Código', align: 'center', field: 'tributary_param', sortable: true },
      { name: 'liquidation_param_name', required: true, label: 'Nombre del tipo de pago', align: 'center', field: 'liquidation_param_name', sortable: true },
      { name: 'iva', required: true, label: 'IVA', align: 'center', field: 'iva', sortable: true },
      { name: 'retelca', required: true, label: 'RetelCA', align: 'center', field: 'retelca', sortable: true },
      { name: 'retefuente', required: true, label: 'ReteFuente', align: 'center', field: 'retefuente', sortable: true },
      { name: 'multiretelca', required: true, label: 'MultiretelCA', align: 'center', field: 'multiretelca', sortable: true },
      { name: 'impuestos_municipales', required: true, label: 'Impuestos municipales', align: 'center', field: 'impuestos_municipales', sortable: true }
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 }
  })

  const tableLiquidationParamsProps = ref<IBaseTableProps<ILiquidationParamRow>>({
    loading: false,
    wrapCells: true,
    columns: [
      { name: 'selected_ui', label: '', align: 'center', field: 'selected_ui', sortable: false },
      { name: 'id', required: true, label: '#', align: 'center', field: 'id', sortable: true },
      { name: 'tributary_param', required: true, label: 'Código', align: 'center', field: 'tributary_param', sortable: true },
      { name: 'liquidation_param_name', required: true, label: 'Nombre del tipo de pago', align: 'center', field: 'liquidation_param_name', sortable: true },
      { name: 'iva', required: true, label: 'IVA', align: 'center', field: 'iva', sortable: true },
      { name: 'retelca', required: true, label: 'RetelCA', align: 'center', field: 'retelca', sortable: true },
      { name: 'retefuente', required: true, label: 'ReteFuente', align: 'center', field: 'retefuente', sortable: true },
      { name: 'multiretelca', required: true, label: 'MultiretelCA', align: 'center', field: 'multiretelca', sortable: true },
      { name: 'impuestos_municipales', required: true, label: 'Impuestos municipales', align: 'center', field: 'impuestos_municipales', sortable: true },
      { name: 'principal', required: false, label: 'Principal', align: 'center', field: 'principal', sortable: true }
    ],
    rows: [],
    pages: { currentPage: 1, lastPage: 1 }
  })

  onMounted(() => {
    _setValueModel()
  })

  const _setValueModel = () => {
    if (!props.data) return
    isSettingModel.value = true
    
    const incoming: ITributaryForm = {
      tax_info: {
        tax_obligations: props.data?.tax_info?.tax_obligations ?? models.value.tax_info.tax_obligations,
        declares_tax: Boolean(props.data?.tax_info?.declares_tax),
        responsible_iva: Boolean(props.data?.tax_info?.responsible_iva),
        foreign_phone: props.data?.tax_info?.foreign_phone ?? models.value.tax_info.foreign_phone,
        has_tax_responsibility_outside_colombia: Boolean(
          props.data?.tax_info?.has_tax_responsibility_outside_colombia
      ),
        vat_responsibility:
          props.data?.tax_info?.vat_responsibility === 'SI' ? 'SI' : 'NO',
        files_tax_return: Boolean(props.data?.tax_info?.files_tax_return),
        address: props.data?.tax_info?.address ?? models.value.tax_info.address.address
      },

      nationality: {
        has_different_nationality: Boolean(props.data?.nationality?.has_different_nationality),
        nationality: props.data?.nationality?.nationality ?? models.value.nationality.nationality
      },

      address: {
        country: props.data?.address?.country ?? models.value.address.country,
        country_id: props.data?.address?.country_id ?? models.value.address.country_id,
        department: props.data?.address?.department ?? models.value.address.department,
        city: props.data?.address?.city ?? models.value.address.city,
        postal_address: props.data?.address?.postal_address ?? models.value.address.postal_address,
        has_notary_power_abroad: Boolean(props.data?.address?.has_notary_power_abroad),
        taxable_country: props.data?.address?.taxable_country ?? models.value.address.taxable_country,
        branch_address: props.data?.address?.branch_address ?? models.value.address.branch_address
      },

      details: {
        phone_code: props.data?.details?.phone_code ?? models.value.details.phone_code,
        tin_status: props.data?.details?.tin_status ?? models.value.details.tin_status,
        tin: props.data?.details?.tin ?? models.value.details.tin
      },

      liquidation_params: props.data?.liquidation_params ?? models.value.liquidation_params,
      settlement_formulas: props.data?.settlement_formulas ?? models.value.settlement_formulas
    }

    Object.assign(models.value, incoming)
    isSettingModel.value = false
  }

  const onSelectedLiquidationRows = (rows: ILiquidationParamRow[]) => {
    selectedLiquidationRows.value = rows
  }

  const handleCreateLiquidationParams = (closeModal: () => void) => {
    if (!selectedLiquidationRows.value.length) return

    const processedUI = selectedLiquidationRows.value.map(row => ({
      ...row,
      principal: row.id === principalSelected.value
    }))

    models.value.settlement_formulas = processedUI
    tableProps.value.rows = processedUI

    closeModal()
    selectedLiquidationRows.value = []
    principalSelected.value = null
  }

  const syncPrincipalFromModel = () => {
    const principal = models.value.settlement_formulas.find(
      f => f.principal === true
    )

    principalSelected.value = principal ? principal.id : null
  }

  const mapTaxesToUI = (taxes?: IFormulaTax[]): TaxesUIMap => {
    if (!taxes?.length) return { ...EMPTY_TAXES_UI }

    const result: TaxesUIMap = { ...EMPTY_TAXES_UI }

    for (const tax of taxes) {
      const field = TAX_TYPE_TO_FIELD_MAP[tax.tax_type]
      if (field) {
        result[field] = tax.is_applicable ? 1 : 0
      }
    }

    return result
  }

  const mapSettlementFormulasToRows = () => {
    tableLiquidationParamsProps.value.rows =
      props.settlement_formulas_list?.map(
        (item: ISettlementFormulaTributary): ILiquidationParamRow => ({
          selected_ui: false,
          id: item.id,
          tributary_param: item.code,
          liquidation_param_name: item.name,
          ...mapTaxesToUI(item.taxes),
          principal: false,
        })
      ) ?? []
  }

  const getCountryByID = (id: number) => {
    return countries.value.find(country => country.value === id)?.label
  }

  const isRowSelected = (id: number) =>
    selectedLiquidationRows.value.some(r => r.id === id)

  const toggleRowSelected = (row: ILiquidationParamRow) => {
    const idx = selectedLiquidationRows.value.findIndex(r => r.id === row.id)

    if (idx >= 0) {
      selectedLiquidationRows.value.splice(idx, 1)
      if (principalSelected.value === row.id) principalSelected.value = null
      return
    }

    selectedLiquidationRows.value.push(row)
  }

  const syncSelectedFromModel = () => {
    const ids = new Set(models.value.settlement_formulas.map(x => x.id))
    selectedLiquidationRows.value =
      tableLiquidationParamsProps.value.rows.filter(r => ids.has(r.id))

    const principal = models.value.settlement_formulas.find(x => x.principal)
    principalSelected.value = principal?.id ?? null
  }

  const allRowsSelected = computed(() => {
    const rows = tableLiquidationParamsProps.value.rows || []
    if (!rows.length) return false

    return rows.every(row => isRowSelected(row.id))
  })

  const someRowsSelected = computed(() => {
    const rows = tableLiquidationParamsProps.value.rows || []
    if (!rows.length) return false

    const selectedCount = rows.filter(row => isRowSelected(row.id)).length
    return selectedCount > 0 && selectedCount < rows.length
  })

  const toggleSelectAll = (value: boolean) => {
    const rows = tableLiquidationParamsProps.value.rows || []

    rows.forEach(row => {
      const selected = isRowSelected(row.id)

      if (value && !selected) {
        toggleRowSelected(row)
      }

      if (!value && selected) {
        toggleRowSelected(row)
      }
    })
  }

  const getSettlementParameters = (
    row: ILiquidationParamRow, 
    formulasList: ISettlementFormulaTributary[]
  ): SettlementParametersResult => {
    
    const fullFormula = formulasList.find((f: ISettlementFormulaTributary) => f.id === row.id);

    const defaultResult: SettlementParametersResult = { 
      iva_concept: '', 
      iva_tarifa: 0, 
      reteiva_concept: '', 
      reteiva_tarifa: 0 
    };

    if (!fullFormula || !fullFormula.taxes) {
      return defaultResult;
    }

    const ivaTax = fullFormula.taxes.find(
      (t: IFormulaTax) => t.tax_type === 'IVA' && t.concept
    );
    
    const reteivaTax = fullFormula.taxes.find(
      (t: IFormulaTax) => t.tax_type === 'RIV' && t.concept
    );

   return {
      iva_concept: ivaTax?.concept?.description || '',
      iva_tarifa: Number(ivaTax?.concept?.percentage) || 0,
      reteiva_concept: reteivaTax?.concept?.description || '',
      reteiva_tarifa: Number(reteivaTax?.concept?.percentage) || 0,
    };
  };

  onMounted(() => {
    if (props.data) {
      models.value = JSON.parse(JSON.stringify(props.data))

      if (props.data?.settlement_formulas?.length) {
        tableProps.value.rows = JSON.parse(JSON.stringify(props.data.settlement_formulas))
      }
    }
  })

  onBeforeMount(async () => {
    await _getResourcesClientsV1(indirectNaturalPersonKeys)
  })

  onBeforeUnmount(() => {
    _resetKeysClientsV1(indirectNaturalPersonKeys)
  })


  watch(
    models,
    (val) => {
      if (isSettingModel.value) return
      emit?.('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.settlement_formulas_list,
    val => {
      if (!val) return
      settlementFormulasListLocal.value = val
      mapSettlementFormulasToRows()
    },
    { deep: true, immediate: true }
  )

  watch(
    () => props.thirdParty,
    val => {
      if (!val) return
      thirdPartyFullName.value = val
    },
    { deep: true, immediate: true }
  )

  watch(
    () => models.value.nationality.has_different_nationality,
    (val) => {
      if (val) {
        models.value.address.country_id = null
        models.value.nationality.nationality = null
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.tax_info.has_tax_responsibility_outside_colombia,
    (val) => {
      if (!val) {
        models.value.address.country_id = null
        models.value.address.branch_address = null
        models.value.address.postal_address = null
        models.value.address.has_notary_power_abroad = false
        models.value.tax_info.foreign_phone = null
        models.value.details.tin_status = null
        models.value.details.tin = null
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.details.tin_status,
    (val) => {
      if (val !== 'Posee TIN') {
        models.value.details.tin = null
      }
    },
    { deep: true }
  )

  watch(
    () => models.value.settlement_formulas,
    () => {
      syncPrincipalFromModel()
    },
    { deep: true }
  )

  return {
    models,
    formTributary,
    tableProps,
    tableLiquidationParamsProps,
    onSelectedLiquidationRows,
    handleCreateLiquidationParams,
    defaultIconsLucide,
    countries,
    fiscal_responsability,
    nationalities,
    third_party_tin_options,
    principalSelected,
    thirdPartyFullName,
    getCountryByID,
    syncPrincipalFromModel,
    isRowSelected,
    toggleRowSelected,
    syncSelectedFromModel,
    allRowsSelected,
    someRowsSelected,
    toggleSelectAll,
    getSettlementParameters
  }
}

export default useTributaryForm
