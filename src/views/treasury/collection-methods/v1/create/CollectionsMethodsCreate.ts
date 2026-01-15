import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useRoute } from 'vue-router'
import { CollectionMethodsForm } from '@/interfaces/customs/treasury/CollectionForms'

import { useCollectionFormsStore } from '@/stores/treasury/collection-forms'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCollectionsMethodsCreate = () => {
  const { _createCollectionMethod } = useCollectionFormsStore('v1')
  const data_information_form = ref<CollectionMethodsForm | null>(null)
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const route = useRoute()
  const accountingBlockCollectionsId = +route.params.idBlock
  const bankEntityId = +route.params.idBankEntity
  
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide, cleanEmptyFields } = useUtils()
  const { goToURL } = useGoToUrl()

  const keys = {
    treasury: [
      'commission_rate',
    ],
  }

  const informationFormRef = ref()

  const headerProps = {
    title: 'Crear formas de recaudo asociadas al cobro por comisión',
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
        label: 'Formas de recaudo asociadas al cobro por comisión',
        route: '',
      },
      {
        label: 'Crear',
        route: 'CollectionsMethodsCreate',
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
    const apiRequestBody: Partial<CollectionMethodsForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (data: CollectionMethodsForm | null) => {
    if (!data) return {}

    const request: Partial<CollectionMethodsForm> = {
      description: data.description ?? '',
      type_receive_id: data.type_receive_id ?? 0,
      accounting_blocks_collection_id: accountingBlockCollectionsId ?? 0,
      bank_entity_id: bankEntityId ?? 0,
      commission_rate: data.commission_rate ?? '',
      commission_percentage: data.commission_percentage ?? 0,
      fixed_value: data.fixed_value ?? '',
      observations: data.observations ?? '',
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
    const success = await _createCollectionMethod(payload as CollectionMethodsForm)

    if (success) {
      goToURL('CollectionAccountingBlocksList')
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources({treasury: ['typeReceive&filter[exclude_sebra]=1']})
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
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

export default useCollectionsMethodsCreate