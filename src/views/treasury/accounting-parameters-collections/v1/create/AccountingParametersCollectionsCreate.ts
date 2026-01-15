import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

import { ITabs } from '@/interfaces/global'
import { ICollectionAccountingBlocksResponse , ICollectionAccountingBlocksForm} from '@/interfaces/customs/treasury/CollectionAccountingBlocks'
import { IAccountingParametersCollectionsForm } from '@/interfaces/customs/treasury/AccountingParametersCollection'

// Stores
import { useAccountingParametersCollectionsStore } from '@/stores/treasury/accounting-parameters-collections'
import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingParametersCollectionsCreate = () => {
  const { _createAccountingParametersCollections, _clearData } = useAccountingParametersCollectionsStore('v1')
  const { _getByIdCollectionAccountingBlocks } = useCollectionAccountingBlocksStore('v1')

  const { type_accounting_blocks_collections_request } = storeToRefs(useCollectionAccountingBlocksStore('v1'))
  
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const data_information_form = ref<IAccountingParametersCollectionsForm | null>(null)
  const data_blocks_form = ref<ICollectionAccountingBlocksForm | null>(null)
  
  const route = useRoute()
  const accountingBlockCollectionsId = +route.params.id

  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()
  const { showAlert } = useAlert()

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: `¿Desea cancelar?\nNo quedarán guardados los datos ingresados`,
    id: null as number | null,
  })

  const keys = {
    treasury: [
      'third_parties',
      'third_party_types',
    ]
  }

  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear parámetros contable de recaudo',
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
        label: 'Crear',
        route: 'AccountingParametersCollectionsCreate',
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

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IAccountingParametersCollectionsForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (
    data: IAccountingParametersCollectionsForm | null
  ) => {
    if (!data) return {}

    const request: Partial<IAccountingParametersCollectionsForm> = {
      collection_concept_id: data.collection_concept_id ?? null,
      third_party_type: data.third_party_type ?? '',
      third_party_id: data.third_party_id ?? null,
      ...(data.third_party_type === 'Específico' ? { third_party_id: data.third_party_id ?? null } : {}),
      account_chart_id: data.account_chart_id ?? null,
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? null,
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

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      valid = (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
    }
    return valid
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createAccountingParametersCollections(
      payload as IAccountingParametersCollectionsForm
    )

    if (success) {
      goToURL('CollectionAccountingBlocksList')
    }
    openMainLoader(false)
  }

  const onCancel = async () => {
    await alertModalRef.value.openModal()
  }

  const cancelCreate = async () => {
    goToURL('CollectionAccountingBlocksList')
    showAlert('"Proceso cancelado" Ha cancelado el proceso de creacion de "agregar parámetros"', 'success', undefined, 3000)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getByIdCollectionAccountingBlocks(accountingBlockCollectionsId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _clearData()
    _resetKeys(keys)
  })

  const setFormEdit = (data: ICollectionAccountingBlocksResponse) => {
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

  watch(
    () => type_accounting_blocks_collections_request.value,
    async (val) => {
      if (!val) return
      setFormEdit(val)
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
    alertModalRef,
    alertModalConfig,

    onSubmit,
    onCancel,
    cancelCreate,
    goToURL,
  }
}

export default useAccountingParametersCollectionsCreate
