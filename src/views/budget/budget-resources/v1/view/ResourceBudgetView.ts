// vue - router - quasar - pinia
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
// Composables
import { useGoToUrl, useUtils } from '@/composables'
// Interfaces & types
import { ITabs } from '@/interfaces/global/Tabs'
// Stores
import { useBudgetResourceModuleStore } from '@/stores/budget/budget-resources'
import {
  IResourceBankAccountForm,
  IResourceBudget,
  IResourceBudgetForm,
} from '@/interfaces/customs/budget/ResourceBudget'

const useResourceBudgetView = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const id = route.params.id as string

  const { _showAction } = useBudgetResourceModuleStore('v1')
  const resourceData = ref<IResourceBudgetForm>()
  const bankAccountData = ref<IResourceBankAccountForm>()

  const headerProps = {
    title: 'Ver recurso presupuestal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Presupuesto' },
      { label: 'Recursos presupuestales', route: 'ResourceBudgetList' },
      { label: 'Ver', route: 'ResourceBudgetView' },
      { label: `${id}` },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.information,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'bank',
      label: 'Cuenta Bancaria',
      icon: defaultIconsLucide.bank,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const filteredTabs = tabs.filter((tab) => tab.show)
  const tabActive = ref(filteredTabs[0]?.name ?? 'information')
  const tabActiveIdx = 0

  const mapResourceToView = (resource: IResourceBudget) => {
    resourceData.value = {
      id: resource.id ?? undefined,
      structure_resource: resource.structure?.purpose ?? null,
      code: resource.code ?? '',
      description: resource.description ?? '',
      type: resource.type as 'totalizador' | 'operativo' | '',
      resource_type_description: resource.resource_type.description ?? null,
      has_bank_account: resource.manage_bank_account === 'Si' ? true : false,
      status_id: resource.status_id ?? null,
    }
    if (resource.manage_bank_account === 'Si') {
      bankAccountData.value = {
        bank_code: resource.bank_account?.bank?.code ?? null,
        bank_name: resource.bank_account?.bank?.name ?? '',
        city_name: resource.bank_account?.city?.name ?? '',
        branch_name: resource.bank_account?.branch?.name ?? '',
        account_type: resource.bank_account?.account?.type ?? null,
        account_number: resource.bank_account?.account?.number ?? null,
      } as IResourceBankAccountForm
    }
  }

  onMounted(async () => {
    const resource = await _showAction(Number(id))
    if (resource) {
      mapResourceToView(resource)
    }
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    resourceData,
    bankAccountData,
    goToURL,
  }
}

export default useResourceBudgetView
