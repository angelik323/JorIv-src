import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { ICollectionReferenceForm } from '@/interfaces/customs/treasury/CollectionReference'

import { useResourceManagerStore } from '@/stores/resources-manager'
import { useCollectionReferenceStore } from '@/stores/treasury/collection-reference'
import { useCollectionAccountingBlocksStore } from '@/stores/treasury/collection-accounting-blocks'
import { useAccountingParametersCollectionsStore } from '@/stores/treasury/accounting-parameters-collections'

const useCollectionsReferenceCreate = () => {
  const { _createCollectionReference, _clearData } = useCollectionReferenceStore('v1')

  const { _getByIdCollectionAccountingBlocks } = useCollectionAccountingBlocksStore('v1')
  const { type_accounting_blocks_collections_request } = storeToRefs(useCollectionAccountingBlocksStore('v1'))

  const { _getByIdAccountingParametersCollections } = useAccountingParametersCollectionsStore('v1')
  const { accounting_parameters_collections_response } = storeToRefs(useAccountingParametersCollectionsStore('v1'))

  
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const route = useRoute()
  const accountingBlockCollectionsId = +route.params.idBlock
  const accountingParameterCollectionsId = +route.params.idParam
  const data_information_form = ref<ICollectionReferenceForm | null>(null)
  
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  const keys = {
    treasury: [
      'origin',
    ],
  }

  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear referencia de recaudo',
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
        label: 'Referencia de recaudo',
        route: 'CollectionAccountingBlocksList',
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
      label: 'Datos básicos',
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
    const apiRequestBody: Partial<ICollectionReferenceForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (data: ICollectionReferenceForm | null) => {
    if (!data) return {}

    const request: Partial<ICollectionReferenceForm> = {
      accounting_blocks_collection_id: data.accounting_blocks_collection_id ?? 0,
      accounting_parameters_collection_id: data.accounting_parameters_collection_id ?? 0,
      origin_id: data.origin_id ?? 0,
      bank_reference: data.bank_reference ?? '',
      bar_code: data.bar_code ?? '',
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
    const success = await _createCollectionReference(payload as ICollectionReferenceForm)

    if (success) {
      goToURL('CollectionAccountingBlocksList')
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)

    data_information_form.value = {
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? 0,
      accounting_parameters_collection_id: accountingParameterCollectionsId ?? 0,
      origin_id: 0,
      bank_reference: '',
      bar_code: '',
    }

    await _getByIdCollectionAccountingBlocks(accountingBlockCollectionsId)
    await _getByIdAccountingParametersCollections(accountingParameterCollectionsId)
    openMainLoader(false)
  })

  watch(
    [type_accounting_blocks_collections_request, accounting_parameters_collections_response],
    ([newBlockData, newParamData]) => {
      if (data_information_form.value) {
        data_information_form.value.info_block_code = newBlockData?.code || ''
        data_information_form.value.info_param_code = newParamData?.code || ''
      }
    }
  )

  onBeforeUnmount(() => {
    _clearData()
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    informationFormRef,
    data_information_form,

    onSubmit,
    goToURL,
  }
}

export default useCollectionsReferenceCreate