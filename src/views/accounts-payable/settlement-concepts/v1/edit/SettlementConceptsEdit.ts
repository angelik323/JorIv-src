// vue- pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  ISettlementConceptsForm,
  ISettlementConceptsUpdatePayload,
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
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useSettlementConceptsEdit = () => {
  const route = useRoute()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  const settlementConceptId = Number(route.params.id)

  const { account_structures, accounts_by_structure } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { fiscal_charges } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const keys = ref({
    accounting: ['account_structures', 'tree_status'],
    accounts_payable: [
      'settlement_concept_types',
      'settlement_concept_classes',
      'fiscal_charges',
    ],
  })
  const basicDataFormRef = ref()
  const settlement_concepts_form = ref<ISettlementConceptsForm | null>()

  const { _getSettlementConceptById, _updateSettlementConcept } =
    useSettlementConceptsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Editar concepto de liquidación',
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
        label: 'Editar',
        route: 'SettlementConceptsEdit',
      },
      {
        label: `${settlementConceptId}`,
        route: '',
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
): ISettlementConceptsUpdatePayload => {
  const isITETax = form.type === 'Impuesto' && form.class === 'ITE'

  const payload: ISettlementConceptsUpdatePayload = {
    structure_id: Number(form.structure_id),
    description: String(form.description),
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
    status_id: Number(form.status_id),
  }

  if (form.type === 'Base') {
    payload.apply_iva = Boolean(form.apply_iva)
  }

  if (form.has_minimum_uvt) {
    payload.min_withholding_uvt = Number(form.min_withholding_uvt)
    payload.min_withholding_iva_uvt = Number(form.min_withholding_iva_uvt)
    payload.min_withholding_pesos = null
    payload.min_withholding_iva_pesos = null
  } else {
    payload.min_withholding_pesos = Number(form.min_withholding_pesos)
    payload.min_withholding_iva_pesos = Number(form.min_withholding_iva_pesos)
    payload.min_withholding_uvt = null
    payload.min_withholding_iva_uvt = null
  }

  return payload
}

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!settlement_concepts_form.value) return

    openMainLoader(true)
    const payload = makePayload(settlement_concepts_form.value)

    if (await _updateSettlementConcept(payload, settlementConceptId)) {
      goToURL('SettlementConceptsList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    openMainLoader(true)

    // 1. Cargar estructuras contables con filtros
    await _getResources(
      { accounting: ['account_structures', 'tree_status'] },
      'filter[status_id]=1&filter[type]=Catálogo de cuentas contables'
    )

    // 2. Cargar recursos de cuentas por pagar
    await _getResources({
      accounts_payable: [
        'settlement_concept_types',
        'settlement_concept_classes',
        'fiscal_charges',
      ],
    })

    // 3. Cargar datos del concepto
    const data: ISettlementConceptsForm | null =
      await _getSettlementConceptById(settlementConceptId)

    if (data) {
      // 4. Cargar cuentas de la estructura
      if (data.structure_id) {
        await _getResources(
          { accounting: ['accounts_by_structure'] },
          `filter[account_structure_id]=${data.structure_id}&filter[type]=Operativo,Catálogo de cuentas contables`
        )
      }

      // 5. Mapear labels usando los stores
      const structureOption = account_structures.value.find(
        (s) => s.value === data.structure_id
      )
      if (structureOption) {
        data.structure_label = String(structureOption.label)
      }

      const planAccountOption = accounts_by_structure.value.find(
        (a) => a.value === data.plan_account_id
      )
      if (planAccountOption) {
        data.plan_account_label = String(planAccountOption.label)
      }

      const liabilityAccountOption = accounts_by_structure.value.find(
        (a) => a.value === data.liability_account_id
      )
      if (liabilityAccountOption) {
        data.liability_account_label = String(liabilityAccountOption.label)
      }

      const expenseAccountOption = accounts_by_structure.value.find(
        (a) => a.value === data.expense_account_id
      )
      if (expenseAccountOption) {
        data.expense_account_label = String(expenseAccountOption.label)
      }

      const fiscalChargeOption = fiscal_charges.value.find(
        (f) => f.value === data.fiscal_charge_id
      )
      if (fiscalChargeOption) {
        data.fiscal_charge_label = String(fiscalChargeOption.label)
      }

      const creditNotesAccountOption = accounts_by_structure.value.find(
        (a) => a.value === data.credit_notes_account_id
      )
      if (creditNotesAccountOption) {
        data.credit_notes_account_label = String(
          creditNotesAccountOption.label
        )
      }

      // 6. Asignar al formulario
      settlement_concepts_form.value = data
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys.value)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    settlement_concepts_form,
    handleEdit,
    goToURL,
    validateRouter,
  }
}

export default useSettlementConceptsEdit