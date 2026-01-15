import { ref, onBeforeMount, onBeforeUnmount, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { ICollectionReferenceForm, ICollectionReference } from '@/interfaces/customs/treasury/CollectionReference'

import { useResourceManagerStore } from '@/stores/resources-manager'
import { useCollectionReferenceStore } from '@/stores/treasury/collection-reference'

const useCollectionsReferenceEdit = () => {
  const {
    _getByIdCollectionReference,
    _updateCollectionReference,
    _clearData
  } = useCollectionReferenceStore('v1')

  const { collection_reference_view } = storeToRefs(useCollectionReferenceStore('v1'))

  const data_information_form = ref<ICollectionReferenceForm | null>(null)
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const route = useRoute()
  const collectionsRefId = +route.params.id
  
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
    title: 'Editar referencia de recaudo',
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
        label: 'Editar',
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

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ICollectionReferenceForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (
    data: ICollectionReferenceForm | null
  ) => {
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
    const success = await _updateCollectionReference(payload as ICollectionReferenceForm, collectionsRefId)

    if (success) {
      goToURL('CollectionAccountingBlocksList')
    }
    openMainLoader(false)
  }

  const setFormEdit = (data: ICollectionReference) => {
    data_information_form.value = {
      accounting_blocks_collection_id: data.accounting_block_collection.id,
      accounting_parameters_collection_id: data.accounting_parameters_collection.id,
      info_block_code: data.accounting_block_collection.code,
      info_param_code: data.accounting_parameters_collection.code,
      origin_id: data.origin.id ?? null,
      bank_reference: data.bank_reference ?? null,
      bar_code: data.bar_code ?? null,
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getByIdCollectionReference(collectionsRefId)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _clearData()
    _resetKeys(keys)
  })

  watch(
    () => collection_reference_view.value,
    (val) => {
      if (!val) return
      setFormEdit(val)
    }
  )

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

export default useCollectionsReferenceEdit