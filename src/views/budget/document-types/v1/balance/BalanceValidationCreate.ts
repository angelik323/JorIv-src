import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IBugdetDocumentTypeResponse } from '@/interfaces/customs/budget/BudgetDocumentTypes'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetDocumentTypesStore } from '@/stores/budget/document-types'

const useBalanceValidationCreate = () => {
  const { _updateAction, _getDocumentTypeById } =
    useBudgetDocumentTypesStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const router = useRouter()
  const route = useRoute()
  const documentTypeId = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  const headerProps = computed(() => ({
    title: 'Agregar saldos por tipo de documento',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      {
        label: 'Tipos de documentos presupuestales',
        route: 'BudgetDocumentTypesList',
      },
      { label: 'Agregar' },
      { label: documentTypeId.toString() },
    ],
  }))

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'balance_validation',
      label: 'Validación de saldos',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[1].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const hasBalanceValidation = ref<boolean>(false)

  const basicDataFormRef = ref()
  const balanceValidationFormRef = ref()

  const validateForms = async () => {
    const forms = [basicDataFormRef, balanceValidationFormRef]
    if (forms.length && forms[tabActiveIdx.value]) {
      return forms[tabActiveIdx.value].value.validateForm()
    }
    return false
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const documentTypeData = ref()

  const onSubmit = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = basicDataFormRef.value.getFormData()
    payload.id = Number(documentTypeId)
    const balanceValidation = balanceValidationFormRef.value.getFormData()

    if (balanceValidation && hasBalanceValidation.value) {
      payload.balance_validations =
        documentTypeData?.value?.budget_document_type_balance_validations || []

      payload.balance_validations.push({
        accounting_budget_mapping_parameter_id:
          balanceValidation.accounting_budget_mapping_parameter_id,
        code_movement_id: balanceValidation.code_movement_id,
        balance_validation_level_id:
          balanceValidation.balance_validation_level_id,
        validates_document_type: balanceValidation.validates_document_type,
        validated_document_type_id:
          balanceValidation.validated_document_type_id,
      })
    }

    if (!payload.has_expiration_date) {
      delete payload.expiration_periodicity
    }

    const documentTypeResponse = await _updateAction(payload)

    if (documentTypeResponse) {
      router.push({ name: 'BudgetDocumentTypesList' })
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys({
      budget: [
        'budget_levels',
        'budget_document_validities',
        'budget_document_expiration_periodicities',
        'budget_document_numbering_types',
        'code_movements',
        'budget_document_types_selector',
        'accounting_budget_mapping_parameters',
        'code_movements_types_contracting',
      ],
    })
    await _getResources({
      budget: [
        'budget_levels',
        'budget_document_validities',
        'budget_document_expiration_periodicities',
        'budget_document_numbering_types',
        'code_movements',
        'budget_document_types_selector',
        'accounting_budget_mapping_parameters',
      ],
    })

    const response = await _getDocumentTypeById(Number(documentTypeId))
    if (response) {
      documentTypeData.value = response as IBugdetDocumentTypeResponse
      hasBalanceValidation.value =
        documentTypeData.value.requires_balance_validation_by_document_type
    }

    openMainLoader(false)
  })

  const previousTab = () => {
    tabActiveIdx.value = 0
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  return {
    basicDataFormRef,
    balanceValidationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    hasBalanceValidation,
    documentTypeData,
    goToURL,
    nextTab,
    onSubmit,
    previousTab,
  }
}

export default useBalanceValidationCreate
