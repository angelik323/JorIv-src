// vue - quasar - router
import { ref, onBeforeMount, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// utils
import { defaultIconsLucide } from '@/utils'

// composables
import { useMainLoader } from '@/composables'

// stores
import { useExtendTrustStore } from '@/stores/trust-business/extend-trust'

// interfaces
import { ITabs } from '@/interfaces/global'
import { IExtendTrustCreate } from '@/interfaces/customs/trust-business/ExtendTrust'

const useExtendTrustEdit = () => {
  // imports
  const router = useRouter()
  const route = useRoute()

  const extendTrustId = +route.params.id

  const { openMainLoader } = useMainLoader()

  const { data_information_form, extend_trust_request } = storeToRefs(
    useExtendTrustStore('v1')
  )

  const { _setDataInformationForm, _getExtendById, _createExtendTrustAction } =
    useExtendTrustStore('v1')

  const headerProps = {
    title: 'Editar prórroga fideicomiso',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
      },
      {
        label: 'Prórroga fideicomiso',
        route: 'ExtendTrustList',
      },
      {
        label: 'Editar',
      },
      { label: `${extendTrustId}` },
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
  ])

  const makeDataRequest = (): IExtendTrustCreate => {
    return {
      id: data_information_form.value?.id ?? 0,
      extension_date: data_information_form.value?.new_extension_date || data_information_form.value?.extension_date || '',
      observation: data_information_form.value?.observation ?? '',
    }
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    data_information_form.value = null
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getExtendById(extendTrustId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IExtendTrustCreate = makeDataRequest()
      if (await _createExtendTrustAction(payload, 'update')) {
        router.push({
          name: 'ExtendTrustList',
          query: {
            reload: 1,
          },
        })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    extend_trust_request,
    formInformation,
    onSubmit,
    handlerGoTo,
  }
}

export default useExtendTrustEdit
