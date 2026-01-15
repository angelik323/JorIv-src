// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

// Composables
import { useMainLoader } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { IGeneralRequests } from '@/interfaces/customs/trust-business/GeneralRequests'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useGeneralRequestsStore } from '@/stores/trust-business'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useGeneralRequestsEdit = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _showAction, _updateAction } = useGeneralRequestsStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const keys = {
    investment_portfolio: ['coins'],
    trust_business: ['fiduciary_mandates_statuses'],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const initialData = ref<IGeneralRequests>({
    id: 0,
    name: '',
    business_trust_id: 0,
    currency_id: 0,
    record_status_id: 0,
    fund_id: 0,
  })

  const headerProps = {
    title: 'Editar encargo general',
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
        label: 'Editar',
        route: 'GeneralRequestsEdit',
      },
      {
        label: id,
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

  const allKeys = [keys, keys2]

  const loadData = async () => {
    openMainLoader(true)

    await Promise.all(allKeys.map((k) => _getResources(k)))

    const success = await _showAction(Number(id))

    if (success) {
      initialData.value = success
      isLoaded.value = true
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleSubmitForm = async () => {
    const isValid = await informationFormRef.value?.validateForm()
    if (!isValid) return

    openMainLoader(true)

    const data = informationFormRef.value?.getValues()

    const payload: IGeneralRequests = {
      id: data.id,
      name: data.name,
      business_trust_id: data.business_trust_id,
      currency_id: data.currency_id,
      record_status_id: data.record_status_id,
      fund_id: data.fund_id,
    }

    const success = await _updateAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({ name: 'GeneralRequestsList', query: { reload: 1 } })

  onMounted(() => loadData())

  onBeforeUnmount(async () => {
    await Promise.all(allKeys.map((k) => _resetKeys(k)))
  })

  return {
    tabs,
    isLoaded,
    tabActive,
    initialData,
    headerProps,
    tabActiveIdx,
    handleGoToList,
    handleSubmitForm,
    informationFormRef,
  }
}

export default useGeneralRequestsEdit
