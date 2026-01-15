// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Composables
import { useMainLoader } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { IGeneralRequests } from '@/interfaces/customs/trust-business/GeneralRequests'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useGeneralRequestsStore } from '@/stores/trust-business/general-requests'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGeneralRequestsCreate = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  const { _createAction } = useGeneralRequestsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()

  const keys = {
    investment_portfolio: ['coins'],
    trust_business: ['fiduciary_mandates_statuses'],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      show: true,
      disable: true,
      outlined: true,
      required: true,
    },
  ])

  const headerProps = {
    title: 'Crear encargo general',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Encargos general',
        route: 'GeneralRequestsList',
      },
      {
        label: 'Crear',
        route: 'GeneralRequestsCreate',
      },
    ],
  }

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    const data = informationFormRef.value?.getValues()

    const payload: IGeneralRequests = {
      name: data.name,
      business_trust_id: data.business_trust_id,
      currency_id: data.currency_id,
      record_status_id: data.record_status_id,
      fund_id: data.fund_id,
    }

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({ name: 'GeneralRequestsList', query: { reload: 1 } })

  const allKeys = [keys, keys2]

  onMounted(async () => {
    openMainLoader(true)

    await Promise.all(allKeys.map((k) => _getResources(k)))

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  return {
    tabs,
    tabActive,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    informationFormRef,
  }
}

export default useGeneralRequestsCreate
