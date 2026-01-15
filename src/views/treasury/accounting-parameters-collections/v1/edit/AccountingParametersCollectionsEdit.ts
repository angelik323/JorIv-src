import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { IAccountingParametersCollections, IAccountingParametersCollectionsForm } from '@/interfaces/customs'
import { ICollectionAccountingBlocksResponse, ICollectionAccountingBlocksForm } from '@/interfaces/customs/treasury/CollectionAccountingBlocks'
import {
  useAccountingParametersCollectionsStore,
  useCollectionAccountingBlocksStore,
  useResourceManagerStore,
} from '@/stores'

const useAccountingParametersCollectionsEdit = () => {
  const route = useRoute()

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  const {
    collectionAccountingBlockSelected,
    type_accounting_blocks_collections_request,
  } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const {
    accounting_parameters_collections_response
  } = storeToRefs(useAccountingParametersCollectionsStore('v1'))

  const {
    _updateAccountingParametersCollections,
    _getByIdAccountingParametersCollections,
    _clearData,
  } = useAccountingParametersCollectionsStore('v1')
  const { _getByIdCollectionAccountingBlocks } = useCollectionAccountingBlocksStore('v1')

  const data_information_form = ref<IAccountingParametersCollectionsForm | null>(null)
  const data_blocks_form = ref<ICollectionAccountingBlocksForm | null>(null)

  const accountingBlockCollectionsId = collectionAccountingBlockSelected.value
  const accountingParametersCollectionsId = +route.params.id

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: [
      'third_parties',
      'third_party_types',
    ]
  }

  const headerProps = {
    title: 'Editar parametros contables de recaudo',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Bloques contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Parámetros contables de recaudo',
        route: 'CollectionAccountingBlocksList',
      },
      {
        label: 'Editar',
        route: 'AccountingParametersCollectionsEdit',
      },
      {
        label: accountingParametersCollectionsId.toString(),
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

  const informationFormRef = ref()

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IAccountingParametersCollectionsForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (data: IAccountingParametersCollectionsForm | null) => {
    if (!data) return {}

    const request: Partial<IAccountingParametersCollectionsForm> = {
      third_party_type: data.third_party_type ?? '',
      third_party_id: data.third_party_id ?? null,
      account_chart_id: data.account_chart_id ?? null,
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? null,
      collection_concept_id: data.collection_concept_id,
      cost_center_id: data.cost_center_id ?? null,
      distributes_business_percentage: data.distributes_business_percentage ?? false,
      description: data.description ?? '',
      cash_flow_structure_id: data.cash_flow_structure_id ?? null,
      budget_item_id: data.budget_item_id ?? null,
      budget_area_id: data.budget_area_id ?? null,
      budget_resource_id: data.budget_resource_id ?? null,
      budget_document_type_id: data.budget_document_type_id ?? null,
      budget_movement_code_id: data.budget_movement_code_id ?? null,
    }
    
    return cleanEmptyFields(request)
  }

  const validateForm = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      valid = await forms[tabActiveIdx.value]?.value?.validateForm() ?? false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _updateAccountingParametersCollections(
      payload as IAccountingParametersCollectionsForm,
      accountingParametersCollectionsId
    )

    if (success) {
      goToURL('CollectionAccountingBlocksList')
    }
    openMainLoader(false)
  }

  const setFormEdit = (data: IAccountingParametersCollections) => {
    data_information_form.value = {
      collection_concept_id: data.collection_concept?.id ?? 0,
      third_party_type: data.third_party_type ?? '',
      third_party_id: data.third_party?.id ?? null,
      account_chart_id: data.account_chart?.id ?? null,
      cost_center_id: data.cost_center?.id ?? null,
      distributes_business_percentage: data.distributes_business_percentage ?? false,
      description: data.description ?? '',
      cash_flow_structure_id: data.cash_flow_structure?.id ?? null,
      budget_item_id: data.budget_item?.id ?? null,
      budget_area_id: data.budget_area?.id ?? null,
      budget_resource_id: data.budget_resource?.id ?? null,
      budget_document_type_id: data.budget_document_type?.id ?? null,
      budget_movement_code_id: data.budget_movement_code?.id ?? null,
    }
  }

  const setFormInfoEdit = (data: ICollectionAccountingBlocksResponse) => {
    data_blocks_form.value = {
      code: data.code ?? '',
      description: data.description ?? '',
      collection_structure_name: `${data.collection_structure?.code} - ${data.collection_structure?.purpose}`,
      accounting_structure_name: `${data.accounting_structure?.code} - ${data.accounting_structure?.purpose}`,
      cost_center_structure_name: data.cost_center_structure?.code ? `${data.cost_center_structure?.code} - ${data.cost_center_structure?.purpose}` : '',
      budget_structure_name: data.budget_structure?.budget_item_code ? `${data.budget_structure?.budget_item_code} - ${data.budget_structure?.formatted_structure}` : '',
      cash_flow_structure_name: data.cash_flow_structure?.code ? `${data.cash_flow_structure?.code} - ${data.cash_flow_structure?.purpose}` : '',
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    try {
      await _getResources(keys)
      
      await _getByIdAccountingParametersCollections(accountingParametersCollectionsId)
      await _getByIdCollectionAccountingBlocks(accountingBlockCollectionsId)
    } finally {
      openMainLoader(false)
    }
  })

  onBeforeUnmount(() => {
    _clearData()
    _resetKeys(keys)
  })

  watch(
    () => accounting_parameters_collections_response.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

  watch(
    () => type_accounting_blocks_collections_request.value,
    async (val) => {
      if (!val) return
      setFormInfoEdit(val)
      await _getResources({treasury: [`collection_concepts_codes&filter[structure_id]=${val.collection_structure?.id}`]}, '', 'v2')
      await _getResources({treasury: [`accounting_account_contrapart&id_structure=${val.accounting_structure?.id}`]})

      await _getResources({treasury: [`operational_cost_centers&filter[account_structures_id]=${val.cost_center_structure?.id}`]})
      await _getResources({treasury: [`cash_flow_structures&filter[type]=Operativo&filter[account_structure_id]=${val.cash_flow_structure?.id}`]})

      await _getResources({budget: [`budget_document_types&budget_document_types_filters[level_class]=EJE`]})
      await _getResources({budget: [`code_movements&budget_document_types_filters[level_class]=EJE`]})
      await _getResources({budget: [`budget_item_codes&filter[type]=Operativo&filters[budget_structure_id]=${val.budget_structure?.id}`]})
      await _getResources({budget: [`areas_resposabilities_codes&filter[type]=Operativo&filters[budget_structure_id]=${val.budget_structure?.id}`]})
      await _getResources({budget: [`budget_resource_codes&filter[type]=Operativo&filters[budget_structure_id]=${val.budget_structure?.id}`]})
    }
  )

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    data_information_form,
    data_blocks_form,

    onSubmit,
    goToURL,
  }
}

export default useAccountingParametersCollectionsEdit
