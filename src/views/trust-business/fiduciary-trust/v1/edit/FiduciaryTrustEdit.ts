// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import router from '@/router'

// Composables
import { useMainLoader } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { ITabs } from '@/interfaces/global/Tabs'
import { IFiduciaryTrust } from '@/interfaces/customs/trust-business/FiduciaryTrust'

// Stores
import { useFiduciaryTrustStore } from '@/stores/trust-business/fiduciary-trust'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryTrustEdit = () => {
  const { openMainLoader } = useMainLoader()
  const route = useRoute()

  const { _showAction, _updateAction } = useFiduciaryTrustStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()
  const isLoaded = ref(false)

  const id = route.params.id as string

  const keys = {
    trust_business: ['fiduciary_mandates_statuses'],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const initialData = ref<IFiduciaryTrust>({
    id: 0,
    name: '',
    business_trust_id: 0,
    real_estate_project_id: 0,
    stage_id: 0,
    currency: '',
    status_id: 0,
    investment_fund_id: 0,
  })

  const headerProps = {
    title: 'Editar encargo fiduciario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Encargos fiduciarios',
        route: 'FiduciaryTrustList',
      },
      {
        label: 'Editar',
        route: 'FiduciaryTrustEdit',
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

  const loadData = async () => {
    openMainLoader(true)

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

    const payload: IFiduciaryTrust = {
      id: data.id,
      name: data.name,
      business_trust_id: data.business_trust_id,
      real_estate_project_id: data.real_estate_project_id,
      stage_id: data.stage_id,
      currency: data.currency,
      status_id: data.status_id,
      investment_fund_id: data.investment_fund_id,
    }

    const success = await _updateAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({ name: 'FiduciaryTrustList', query: { reload: 'true' } })

  const allKeys = [keys, keys2]

  onMounted(async () => {
    loadData()
    await Promise.all(allKeys.map((k) => _getResources(k)))
  })

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

export default useFiduciaryTrustEdit
