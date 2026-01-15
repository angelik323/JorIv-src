// Vue - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  ISettlementFormulasUpdatePayload,
  ISettlementFormulasForm,
  ISettlementFormulasTaxesType,
  ISettlementFormulaVariablesMap,
} from '@/interfaces/customs/accounts-payable/SettlementFormulas'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Store
import { useSettlementFormulasStore } from '@/stores/accounts-payable/settlement-formulas'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useSettlementFormulasEdit = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { defaultIconsLucide } = useUtils()

  const { _updateSettlementFormulas, _getSettlementFormulasById } =
    useSettlementFormulasStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<ISettlementFormulasForm | null>(null)

  const basicDataFormRef = ref()

  const settlementFormulaId = +route.params.id

  const headerProps = {
    title: 'Editar fórmulas de liquidación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Fórmulas de liquidación',
        route: 'SettlementFormulasList',
      },
      {
        label: 'Editar',
        route: 'SettlementFormulasEdit',
      },
      {
        label: `${settlementFormulaId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const createTaxes = (form: ISettlementFormulasForm) => {
    const taxes = [] as ISettlementFormulasTaxesType[]

    if (form.applies_withholding_tax) {
      taxes.push({
        tax_type: 'RFT',
        is_applicable: '1',
        settlement_concept_id: form.withholding_tax_liquidation_concept,
      })
    }

    if (form.applies_vat) {
      taxes.push({
        tax_type: 'IVA',
        is_applicable: '1',
        settlement_concept_id: form.vat_liquidation_concept,
      })
    }

    if (form.applies_vat_withholding) {
      taxes.push({
        tax_type: 'RIV',
        is_applicable: '1',
        settlement_concept_id: form.vat_withholding_liquidation_concept,
      })
    }

    if (form.applies_ica_withholding) {
      taxes.push({
        tax_type: 'RIC',
        is_applicable: '1',
        settlement_concept_id: null,
      })
    }

    if (form.applies_territorial_taxes) {
      taxes.push({
        tax_type: 'RTE',
        is_applicable: '1',
        settlement_concept_id: form.territorial_taxes_liquidation_concept,
      })
    }

    return taxes
  }

  const makePayload = (form: ISettlementFormulasForm) => {
    return {
      name: form.name,
      taxes: createTaxes(form),
    } as ISettlementFormulasUpdatePayload
  }

  const setEditData = async () => {
    const data = await _getSettlementFormulasById(settlementFormulaId)
    if (!data) return
    //Mapeo de tipos de impuestos y variables a asignar valores en vista
    const taxTypeMap: ISettlementFormulaVariablesMap = {
      RFT: {
        applies: 'applies_withholding_tax',
        concept: 'withholding_tax_liquidation_concept',
      },
      IVA: {
        applies: 'applies_vat',
        concept: 'vat_liquidation_concept',
      },
      RIV: {
        applies: 'applies_vat_withholding',
        concept: 'vat_withholding_liquidation_concept',
      },
      RTE: {
        applies: 'applies_territorial_taxes',
        concept: 'territorial_taxes_liquidation_concept',
      },
      RIC: {
        applies: 'applies_ica_withholding',
      },
    }

    const form_data = {
      code: data.code,
      person_type: data.person_type,
      fiscal_responsibility: data.fiscal_responsibility,
      name: data.name,
      applies_withholding_tax: false,
      withholding_tax_liquidation_concept: null,
      withholding_tax_liquidation_concept_description: '',
      applies_vat: false,
      vat_liquidation_concept: null,
      vat_liquidation_concept_description: '',
      applies_vat_withholding: false,
      vat_withholding_liquidation_concept: null,
      vat_withholding_liquidation_concept_description: '',
      applies_ica_withholding: false,
      applies_territorial_taxes: false,
      territorial_taxes_liquidation_concept: null,
      territorial_taxes_liquidation_concept_description: '',
    } as ISettlementFormulasForm

    if (data.taxes && data.taxes.length > 0) {
      for (const tax of data.taxes) {
        const map = taxTypeMap[tax.tax_type]
        if (map) {
          form_data[map.applies] = tax.is_applicable

          if (map.concept && tax.is_applicable) {
            form_data[map.concept] = tax.settlement_concept_id
          }
        }
      }
    }

    basic_data_form.value = form_data
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = makePayload(basic_data_form.value)
    if (await _updateSettlementFormulas(payload, settlementFormulaId)) {
      goToURL('SettlementFormulasList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    accounts_payable: ['settlement_concept', 'settlement_formula_person_types'],
    assets: ['fiscal_responsability'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleEdit,
    goToURL,
  }
}

export default useSettlementFormulasEdit
