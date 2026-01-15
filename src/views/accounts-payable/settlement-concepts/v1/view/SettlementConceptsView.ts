// vue - pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global'
import { ISettlementConceptsForm } from '@/interfaces/customs/accounts-payable/SettlementConcepts'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useSettlementConceptsStore } from '@/stores/accounts-payable/settlement-concepts'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'

const useSettlementConceptsView = () => {
  const route = useRoute()
  const conceptId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const { account_structures, accounts_by_structure } = storeToRefs(
    useAccountingResourceStore('v1')
  )
  const { fiscal_charges,settlement_concept_classes } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const keys = ref({
    accounting: ['account_structures', 'tree_status'],
    accounts_payable: [
      'settlement_concept_types',
      'settlement_concept_classes',
      'fiscal_charges',
    ],
  })

  const { _getSettlementConceptById } = useSettlementConceptsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()
  const settlement_concepts_form = ref<ISettlementConceptsForm | null>()

  const headerProps = {
    title: 'Ver concepto de liquidación',
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
        label: 'Ver',
        route: 'SettlementConceptsView',
      },
      {
        label: `${conceptId}`,
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
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const handleView = async () => {
    goToURL('SettlementConceptsList')
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(
      { accounting: ['account_structures', 'tree_status'] },
      'filter[status_id]=1&filter[type]=Catálogo de cuentas contables'
    )

    await _getResources({
      accounts_payable: [
        'settlement_concept_types',
        'settlement_concept_classes',
        'fiscal_charges',
      ],
    })

    const data: ISettlementConceptsForm | null =
      await _getSettlementConceptById(conceptId)

    if (data) {
      if (data.structure_id) {
        await _getResources(
          { accounting: ['accounts_by_structure'] },
          `filter[account_structure_id]=${data.structure_id}`
        )
      }

      const structureOption = account_structures.value.find(
        (s) => s.value === data.structure_id
      )
      if (structureOption) {
        data.structure_label = String(structureOption.label)
      }

      const classOption = settlement_concept_classes.value.find(
        (c) => c.value === data.class
      )
      if (classOption) {
        data.class_label = String(classOption.label)
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
        data.credit_notes_account_label = String(creditNotesAccountOption.label)
      }

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
    handleView,
  }
}

export default useSettlementConceptsView
