// vue- pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  ISettlementConceptsForm,
  ISettlementConceptsCreatePayload,
} from '@/interfaces/customs/accounts-payable/SettlementConcepts'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// stores
import { useSettlementConceptsStore } from '@/stores/accounts-payable/settlement-concepts'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useSettlementConceptsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const keys = ref({
    accounting: ['account_structures'],
    accounts_payable: [
      'settlement_concept_types',
      'settlement_concept_classes',
      'fiscal_charges',
    ],
  })
  const basicDataFormRef = ref()
  const settlement_concepts_form = ref<ISettlementConceptsForm | null>()

  const { _createSettlementConcept } = useSettlementConceptsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear concepto de liquidación',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Conceptos de liquidación',
        route: 'SettlementConceptsList',
      },
      {
        label: 'Crear',
        route: 'SettlementConceptsCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const makePayload = (
    form: ISettlementConceptsForm
  ): ISettlementConceptsCreatePayload => {
    const isITETax = form.type === 'Impuesto' && form.class === 'ITE'

    const payload: ISettlementConceptsCreatePayload = {
      structure_id: Number(form.structure_id),
      concept_code: String(form.concept_code),
      description: String(form.description),
      type: String(form.type),
      apply_iva: Boolean(form.apply_iva),
      class: String(form.class),
      percentage: Number(form.percentage),
      has_minimum_uvt: Boolean(form.has_minimum_uvt),
      plan_account_id: form.plan_account_id
        ? Number(form.plan_account_id)
        : null,
      liability_account_id: isITETax
        ? null
        : form.liability_account_id
        ? Number(form.liability_account_id)
        : null,
      expense_account_id: isITETax
        ? null
        : form.expense_account_id
        ? Number(form.expense_account_id)
        : null,
      fiscal_charge_id: Number(form.fiscal_charge_id),
      credit_notes_account_id: isITETax
        ? null
        : form.credit_notes_account_id
        ? Number(form.credit_notes_account_id)
        : null,
    }

    if (form.has_minimum_uvt) {
      // Si es UVT, agregar solo campos UVT
      payload.min_withholding_uvt = Number(form.min_withholding_uvt)
      payload.min_withholding_iva_uvt = Number(form.min_withholding_iva_uvt)
      payload.min_withholding_pesos = null
      payload.min_withholding_iva_pesos = null
    } else {
      // Si es Pesos, agregar solo campos Pesos
      payload.min_withholding_pesos = Number(form.min_withholding_pesos)
      payload.min_withholding_iva_pesos = Number(form.min_withholding_iva_pesos)
      payload.min_withholding_uvt = null
      payload.min_withholding_iva_uvt = null
    }

    return payload
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!settlement_concepts_form.value) return

    openMainLoader(true)
    const payload = makePayload(settlement_concepts_form.value)

    if (await _createSettlementConcept(payload)) {
      goToURL('SettlementConceptsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    await _getResources(
      { accounting: ['account_structures'] },
      'filter[status_id]=1&filter[type]=Catálogo de cuentas contables'
    )

    await _getResources({
      accounts_payable: [
        'settlement_concept_types',
        'settlement_concept_classes',
      ],
    })

    await _getResources(
      { accounts_payable: ['fiscal_charges'] },
      'filter[status_id]=1'
    )
  })

  onBeforeUnmount(() => {
    _resetKeys(keys.value)
  })

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    settlement_concepts_form,

    // methods
    handleCreate,
    goToURL,
    validateRouter,
  }
}

export default useSettlementConceptsCreate