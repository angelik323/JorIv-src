// vue - router - quasar - pinia
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
// Interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import {
  IResourceBankAccountForm,
  IResourceBudget,
  IResourceBudgetForm,
  IResourceBudgetPayload,
} from '@/interfaces/customs/budget/ResourceBudget'
// composables
import { useGoToUrl, useUtils } from '@/composables'
// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useBudgetResourceModuleStore } from '@/stores/budget/budget-resources'
const useResourceBudgetEdit = () => {
  const route = useRoute()
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const resourceId = route.params.id

  const { _updateAction, _showAction } = useBudgetResourceModuleStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const resourceForm = ref()
  const bankAccountForm = ref()
  const resourceData = ref<IResourceBudgetForm>()
  const bankAccountData = ref<IResourceBankAccountForm>()
  const validateForms = async () => {
    if (await resourceForm.value?.validateForm()) return true
    if (
      resourceData.value?.has_bank_account &&
      (await bankAccountForm.value?.validateForm())
    )
      return true
    return false
  }

  const headerProps = {
    title: 'Editar recurso presupuestal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Recursos presupuestales', route: 'ResourceBudgetList' },
      { label: 'Editar', route: 'ResourceBudgetEdit' },
      { label: resourceId.toString() },
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
    {
      name: 'bank',
      label: 'Cuenta bancaria',
      icon: defaultIconsLucide.bank,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ]

  const filteredTabs = tabs.filter((tab) => tab.show)
  const tabActive = ref(filteredTabs[0]?.name ?? 'information')
  const tabActiveIdx = computed(() =>
    filteredTabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const buildPayload = () => {
    const payload: IResourceBudgetPayload = {
      id: Number(resourceId),
      code: resourceData.value?.code ?? '',
      description: resourceData.value?.description ?? '',
      type: resourceData.value?.type ?? '',
      code_type_id: Number(resourceData.value?.resource_type_id),
      budget_structure_id: Number(resourceData.value?.structure_resource),
      manage_bank_account: resourceData.value?.has_bank_account ? 1 : 0,
      status_id: resourceData.value?.status_id,
    }

    if (payload.manage_bank_account && bankAccountData.value) {
      payload.bank_id = bankAccountData.value.bank_id
      payload.city_id = bankAccountData.value.city_id
      payload.branch_id = bankAccountData.value.branch_id
      payload.type_account = bankAccountData.value.account_type
      payload.number_account = bankAccountData.value.account_number
    }

    return payload
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    const payload = buildPayload()

    const success = await _updateAction(payload)

    if (success) goToURL('ResourceBudgetList')
  }

  const mapResourceToForm = (resource: IResourceBudget) => {
    resourceData.value = {
      code: resource.code ?? '',
      description: resource.description ?? '',
      type: resource.type as 'totalizador' | 'operativo' | '',
      resource_type_id: Number(resource.resource_type.id) ?? null,
      structure_resource: resource.structure?.code ?? null,
      has_bank_account: resource.manage_bank_account === 'Si' ? true : false,
      status_id: resource.status_id ?? null,
    }
    bankAccountData.value = {
      bank_id: Number(resource.bank_account?.bank?.id) ?? null,
      bank_name: resource.bank_account?.bank?.name ?? '',
      city_id: resource.bank_account?.city?.id ?? null,
      branch_id: resource.bank_account?.branch?.id ?? null,
      account_type: resource.bank_account?.account?.type ?? null,
      account_number: resource.bank_account?.account?.number ?? null,
    } as IResourceBankAccountForm
  }

  const BudgetKeys = [
    'cities',
    'banks',
    'branches',
    'account_structures',
    'type_accounts',
    'budget_item_types',
    'budget_resources_types',
    'budget_items_statuses',
  ]

  onMounted(async () => {
    _getResources({ budget: BudgetKeys })

    const resource = await _showAction(Number(resourceId))
    if (resource) {
      mapResourceToForm(resource)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys({ budget: BudgetKeys })
  })

  const onBack = () => {
    tabActive.value = 'information'
  }

  const onContinue = () => {
    tabActive.value = 'bank'
  }

  return {
    resourceData,
    bankAccountData,
    headerProps,
    resourceForm,
    bankAccountForm,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    onSubmit,
    goToURL,
    onBack,
    onContinue,
    validateForms,
  }
}

export default useResourceBudgetEdit
