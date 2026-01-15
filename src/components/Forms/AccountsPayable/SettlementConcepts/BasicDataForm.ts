// vue - pinia
import { computed, onBeforeMount, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global'
import { ISettlementConceptsForm } from '@/interfaces/customs/accounts-payable/SettlementConcepts'
import { ISelectorResources } from '@/interfaces/customs'

// composables
import { useUtils, useRules } from '@/composables'

// stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useAccountsPayableResourceStore } from '@/stores/resources-manager/accounts-payable'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useBasicDataForm = (
  props: {
    action?: ActionType
    data?: ISettlementConceptsForm | null
  },
  emit: Function
) => {
  const { isEmptyOrZero } = useUtils()
  const { is_required, max_length, only_alphanumeric, max_integer_decimal } =
    useRules()

  const { account_structures, accounts_by_structure, tree_status } =
    storeToRefs(useAccountingResourceStore('v1'))
  const {
    settlement_concept_types,
    settlement_concept_classes,
    fiscal_charges,
  } = storeToRefs(useAccountsPayableResourceStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  // refs
  const basicDataFormRef = ref()
  const filteredClassOptions = ref<ISelectorResources[]>([])
  const isEdit = ref(false)
  const structureDescription = ref<string>('')

  const models = ref<ISettlementConceptsForm>({
    id: null,
    structure_id: null,
    structure_label: null,
    concept_code: null,
    description: null,
    type: null,
    apply_iva: false,
    class: null,
    percentage: null,
    has_minimum_uvt: false,
    min_withholding_uvt: null,
    min_withholding_iva_uvt: null,
    min_withholding_pesos: null,
    min_withholding_iva_pesos: null,
    plan_account_id: null,
    plan_account_label: null,
    liability_account_id: null,
    liability_account_label: null,
    expense_account_id: null,
    expense_account_label: null,
    fiscal_charge_id: null,
    fiscal_charge_label: null,
    credit_notes_account_id: null,
    credit_notes_account_label: null,
    status_id: null,
    created_at: null,
    updated_at: null,
  })

  // Computed para detectar si es tipo Impuesto + clase ITE
  const isITETax = computed(() => {
    return models.value.type === 'Impuesto' && models.value.class === 'ITE'
  })

  const updateIsEdit = () => {
    isEdit.value = props.action === 'edit'
  }

  const updateFilteredClassOptions = () => {
    if (!models.value.type) {
      filteredClassOptions.value = settlement_concept_classes.value
      return
    }

    switch (models.value.type) {
      case 'Base':
        filteredClassOptions.value = settlement_concept_classes.value.filter(
          (opt) => opt.value === 'BAS'
        )
        break

      case 'Descuento':
      case 'Pagos':
        filteredClassOptions.value = settlement_concept_classes.value.filter(
          (opt) => opt.value === 'OTR'
        )
        break

      case 'Impuesto':
      default:
        filteredClassOptions.value = settlement_concept_classes.value.filter(
          (opt) => opt.value !== 'BAS' && opt.value !== 'OTR'
        )
        break
    }
  }

  // Handlers
  const handleTypeChange = (value: string) => {
    models.value.type = value

    if (value !== 'Base') {
      models.value.apply_iva = false
    }

    models.value.class = null
    updateFilteredClassOptions()
  }

  const handleClassChange = (value: string) => {
    models.value.class = value

    // Si cambia a ITE, limpiar las cuentas que se ocultarán
    if (isITETax.value && props.action === 'create') {
      models.value.liability_account_id = null
      models.value.liability_account_label = null
      models.value.expense_account_id = null
      models.value.expense_account_label = null
      models.value.credit_notes_account_id = null
      models.value.credit_notes_account_label = null
    }
  }

  const handleUVTChange = (value: boolean) => {
    models.value.has_minimum_uvt = value

    // Solo limpiar campos en modo CREATE, no en EDIT
    if (props.action === 'create') {
      if (value) {
        // Si selecciona UVT, limpiar campos de pesos
        models.value.min_withholding_pesos = null
        models.value.min_withholding_iva_pesos = null
      } else {
        // Si selecciona Pesos, limpiar campos de UVT
        models.value.min_withholding_uvt = null
        models.value.min_withholding_iva_uvt = null
      }
    }
  }

  const handlePlanAccountChange = (value: number | string) => {
    models.value.plan_account_id = value
    const account = accounts_by_structure.value.find(
      (item) => item.value === value
    )
    models.value.plan_account_label = account?.label ?? ''
  }

  const handleLiabilityAccountChange = (value: number | string) => {
    models.value.liability_account_id = value
    const account = accounts_by_structure.value.find(
      (item) => item.value === value
    )
    models.value.liability_account_label = account?.label ?? ''
  }

  const handleExpenseAccountChange = (value: number | string) => {
    models.value.expense_account_id = value
    const account = accounts_by_structure.value.find(
      (item) => item.value === value
    )
    models.value.expense_account_label = account?.label ?? ''
  }

  // Watchers
  watch(
    () => models.value,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val && props.data) models.value = props.data
    },
    { immediate: true }
  )

  watch(
    () => props.action,
    () => {
      updateIsEdit()
    },
    { immediate: true }
  )

  watch(
    () => settlement_concept_classes.value,
    () => {
      updateFilteredClassOptions()
    },
    { immediate: true }
  )

  watch(
    () => models.value.structure_id,
    (newId, oldId) => {
      if (!newId) {
        structureDescription.value = ''
        return
      }

      const selected = account_structures.value.find((s) => {
        const sValue =
          typeof s.value === 'string' ? parseInt(s.value, 10) : s.value
        const modelId = typeof newId === 'string' ? parseInt(newId, 10) : newId
        return sValue === modelId
      })

      if (selected) {
        const label = String(selected.label ?? '')
        const separator = ' - '
        const index = label.indexOf(separator)
        structureDescription.value =
          index >= 0 ? label.slice(index + separator.length) : label
      } else {
        structureDescription.value = ''
      }

      if (props.action === 'edit' && !oldId) {
        return
      }

     _getResources(
  { accounting: ['accounts_by_structure'] },
  `filter[account_structure_id]=${newId}&filter[type]=Operativo,Catálogo de cuentas contables`
)

      if (oldId && newId !== oldId && props.action === 'create') {
        models.value.plan_account_id = null
        models.value.plan_account_label = null
        models.value.liability_account_id = null
        models.value.liability_account_label = null
        models.value.expense_account_id = null
        models.value.expense_account_label = null
        models.value.credit_notes_account_id = null
        models.value.credit_notes_account_label = null
      }
    }
  )

  onBeforeMount(() => {
    updateIsEdit()
    updateFilteredClassOptions()
  })

  return {
    basicDataFormRef,
    models,
    structureDescription,

    account_structures,
    accounts_by_structure,
    settlement_concept_types,
    settlement_concept_classes,
    fiscal_charges,
    filteredClassOptions,
    tree_status,

    isEdit,
    isITETax,

    // rules
    is_required,
    max_length,
    only_alphanumeric,
    max_integer_decimal,

    // handlers
    handleTypeChange,
    handleClassChange,
    handleUVTChange,
    handlePlanAccountChange,
    handleLiabilityAccountChange,
    handleExpenseAccountChange,
  }
}

export default useBasicDataForm