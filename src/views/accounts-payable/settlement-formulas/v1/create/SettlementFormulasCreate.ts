// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import {
  ISettlementFormulasCreatePayload,
  ISettlementFormulasForm,
  ISettlementFormulasTaxesType,
} from '@/interfaces/customs/accounts-payable/SettlementFormulas'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

//Store
import { useSettlementFormulasStore } from '@/stores/accounts-payable/settlement-formulas'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useSettlementFormulasCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide } = useUtils()

  const { _createSettlementFormulas } = useSettlementFormulasStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basic_data_form = ref<ISettlementFormulasForm | null>(null)

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Crear fórmulas de liquidación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Fórmulas de liquidación',
        route: 'SettlementFormulasList',
      },
      {
        label: 'Crear',
        route: 'SettlementFormulasCreate',
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
      person_type: form.person_type,
      fiscal_responsibility: form.fiscal_responsibility,
      name: form.name,
      taxes: createTaxes(form),
    } as ISettlementFormulasCreatePayload
  }
  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = makePayload(basic_data_form.value)
    if (await _createSettlementFormulas(payload)) {
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

  onMounted(() => _getResources(keys, 'filter[class]=RFT,IVA,RIV,ITE'))

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleCreate,
    goToURL,
  }
}

export default useSettlementFormulasCreate
