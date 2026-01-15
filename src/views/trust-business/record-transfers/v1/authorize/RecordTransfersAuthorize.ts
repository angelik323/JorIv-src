// vue - quasar - router - pinia
import { useRoute, useRouter } from 'vue-router'
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
} from 'vue'
import { storeToRefs } from 'pinia'

// store
import { useRecordTransfersStore } from '@/stores/trust-business/record-transfers'
import { useResourceManagerStore } from '@/stores/resources-manager'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'

const useRecordTransfersAuthorize = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const recordTransfersId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const {
    data_information_form,
    record_tranfers_request,
    documents_request,
    data_authorization,
  } = storeToRefs(useRecordTransfersStore('v1'))

  const {
    _setDataInformationForm,
    _getByIdRecordTransfer,
    _getByIdRecordTransferDocuments,
    _authorize,
    _clearData,
    _setDataRecordTransfersList,
  } = useRecordTransfersStore('v1')

  const keys = {
    trust_business: ['participant_types', 'third_parties'],
  }

  const keysFilter = {
    trust_business: ['business_trusts&filter[effect]=true'],
  }

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const formAuthorize = ref()

  const headerProps = {
    title: 'Autorizar registro de cesión',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Registrar cesiones',
        route: 'RecordTransfersList',
      },
      {
        label: 'Autorizar',
      },
      {
        label: `${recordTransfersId}`,
      },
    ],
  }

  // tabs
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
    {
      name: 'documents',
      label: 'Documentos*',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'auth',
      label: 'Autorizar*',
      icon: defaultIconsLucide.circleCheckBig,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdRecordTransfer(recordTransfersId)
    await _getByIdRecordTransferDocuments(recordTransfersId)
    openMainLoader(false)
  })

  onMounted(async () => {
    await _getResources(keys)
    await _getResources(keysFilter)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
    _clearData()
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysFilter)
    _clearData()
    _setDataInformationForm(null)
    _setDataRecordTransfersList()
    record_tranfers_request.value = null
    documents_request.value = null
  })

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async (action: boolean) => {
    if (await formAuthorize.value?.validateForm()) {
      openMainLoader(true)
      const isSuccess = await _authorize(
        recordTransfersId,
        action,
        data_authorization.value ?? ''
      )
      if (isSuccess)
        router.push({
          name: 'RecordTransfersList',
          query: {
            reload: 1,
          },
        })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    record_tranfers_request,
    documents_request,
    formAuthorize,

    onSubmit,
    handlerGoTo,
    backTab,
    nextTab,
  }
}

export default useRecordTransfersAuthorize
