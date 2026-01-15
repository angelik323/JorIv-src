// vue | store
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// stores
import { useChangeTrustStatusStore } from '@/stores/trust-business/change-trust-status'
import { useResourceStore } from '@/stores/resources-selects'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interface
import { ITabs } from '@/interfaces/customs/Tab'
import { IChangeTrustStatusRequest } from '@/interfaces/customs/trust-business/ChangeTrustStatus'

const useChangeTrustStatusEdit = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const changeTrustStatusId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { data_information_form, change_trust_status_request } = storeToRefs(
    useChangeTrustStatusStore('v1')
  )

  const {
    _getByIdChangeTrustStatus,
    _updateChangeTrustStatus,
    _setDataInformationForm,
  } = useChangeTrustStatusStore('v1')
  const { _getTrustBusinessResources } = useResourceStore('v1')

  const keys = ['business_trust_change_status']

  // props
  const headerProps = {
    title: 'Editar cambio de estado de fideicomisos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios Fiduciarios',
        route: '',
      },
      {
        label: 'Cambio de estado fideicomisos',
        route: 'ChangeTrustStatusList',
      },
      {
        label: `${changeTrustStatusId}`,
        route: 'ChangeTrustStatusEdit',
      },
    ],
  }

  // tabs
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
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

  // refs
  const formInformation = ref()

  // actions
  const makeDataRequest = (): IChangeTrustStatusRequest => {
    const data = data_information_form.value
    return {
      id_business_trust: data?.id_business_trust,
      id_status_history: data?.id_status_history,
      business_code: data?.business_code ?? '',
      name: data?.name ?? '',
      status_id: data?.status_id ?? 0,
      status: data?.status ?? '',
      observation: data?.observation ?? '',
    }
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    await _getTrustBusinessResources(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(() => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdChangeTrustStatus(changeTrustStatusId)
    openMainLoader(false)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const data = makeDataRequest()
      if (await _updateChangeTrustStatus(data, changeTrustStatusId)) {
        router.push({
          name: 'ChangeTrustStatusList',
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
    formInformation,
    change_trust_status_request,
    onSubmit,
  }
}

export default useChangeTrustStatusEdit
