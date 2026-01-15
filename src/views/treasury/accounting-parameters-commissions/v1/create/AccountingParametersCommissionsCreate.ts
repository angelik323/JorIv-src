import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ICommissionParametersForm } from '@/interfaces/customs/treasury/CommissionParameters'
import { ITabs } from '@/interfaces/global'

// stores
import { useResourceManagerStore } from '@/stores'
import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'
import { useCommissionParametersStore } from '@/stores/treasury/commission-parameters'

const useAccountingParametersCommissionsCreate = () => {
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getByIdCollectionAccountingBlocks } = useCollectionAccountingBlocksStore('v1')
  const { _createCommissionAccountingParameters, _clearData } = useCommissionParametersStore('v1')

  const { type_accounting_blocks_collections_request } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const { defaultIconsLucide } = useUtils()

  const informationFormRef = ref()
  const data_information_form = ref<ICommissionParametersForm | null>(null)

  const router = useRouter()
  const route = useRoute()
  const accountingBlockCollectionsId = +route.params.id

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields } = useUtils()

  const keys = {
    treasury: [
      'counter_auxiliary_type',
      'third_parties',
    ],
    budget: [
      'code_movements',
      'budget_document_types'
    ]
  }

  const headerProps = {
    title: 'Crear parámetros contables de comisión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Parámetros contables comisiones',
        route: '',
      },
      {
        label: 'Crear',
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeBaseInfoRequest = (data: ICommissionParametersForm | null) => {
    if (!data) return {}

    const request: Partial<ICommissionParametersForm> = {
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? null,
      account_chart_id: data.account_chart_id ?? null,
      cost_center_id: data.cost_center_id ?? null,
      aux_type: data.aux_type ?? null,
      third_party_id: data.third_party_id ?? null,
      cash_flow_structure_id: data.cash_flow_structure_id ?? null,
      contra_account_chart_id: data.contra_account_chart_id ?? null,
      contra_cost_center_id: data.contra_cost_center_id ?? null,
      contra_aux_type: data.contra_aux_type ?? null,
      contra_third_party_id: data.contra_third_party_id ?? null,
      contra_cash_flow_structure_id: data.contra_cash_flow_structure_id ?? null,
      budget_item_id: data.budget_item_id ?? null,
      budget_area_id: data.budget_area_id ?? null,
      budget_resource_id: data.budget_resource_id ?? null,
      budget_document_type_id: data.budget_document_type_id ?? null,
      budget_movement_code_id: data.budget_movement_code_id ?? null,
    }

    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ICommissionParametersForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createCommissionAccountingParameters(payload)
    if (success) {
      router.push({ name: 'CollectionAccountingBlocksList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCollectionAccountingBlocks(accountingBlockCollectionsId)
    await _getResources(keys)

    await _getResources({budget: ['budget_item_codes&filter[type]=Operativo']})
    await _getResources({budget: ['areas_resposabilities_codes&filter[type]=Operativo']})
    await _getResources({budget: ['budget_resource_codes&filter[type]=Operativo']})
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys({ treasury: ['accounting_account_contrapart', 'operational_cost_centers', 'cash_flow_structures'] })
    _resetKeys({ budget: ['budget_item_codes', 'areas_resposabilities_codes', 'budget_resource_codes'] })
    _clearData()
  })

  watch(
    () => type_accounting_blocks_collections_request.value,
    async (val) => {
      if (!val) return
      
      if(val.cost_center_structure){
        await _getResources({
          treasury: [`operational_cost_centers&filter[account_structures_id]=${val.cost_center_structure?.id}`]
        })
      }
      
      if(val.accounting_structure){
        await _getResources({
          treasury: [`accounting_account_contrapart&id_structure=${val.accounting_structure?.id}`]
        })
      }

      if(val.cash_flow_structure){
        await _getResources({
          treasury: [`cash_flow_structures&filter[type]=Operativo&filter[account_structure_id]=${val.cash_flow_structure?.id}`]
        })
      }
      
    }
  )

  return {
    data_information_form,
    informationFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    type_accounting_blocks_collections_request,

    defaultIconsLucide,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useAccountingParametersCommissionsCreate