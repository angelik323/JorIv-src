// Vue
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Composables
import { useMainLoader } from '@/composables'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { IFiduciaryTrust } from '@/interfaces/customs/trust-business/FiduciaryTrust'
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useFiduciaryTrustStore } from '@/stores/trust-business/fiduciary-trust'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryTrustCreate = () => {
  const { openMainLoader } = useMainLoader()
  const router = useRouter()

  const { _createAction } = useFiduciaryTrustStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const informationFormRef = ref()

  const keys = {
    fics: ['funds'],
    trust_business: ['fiduciary_mandates_statuses'],
  }

  const keys2 = {
    trust_business: ['business_trusts'],
  }

  const keys3 = {
    trust_business: ['business_trust_real_estate_project'],
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
    title: 'Crear encargo fiduciario',
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
        label: 'Crear',
        route: 'FiduciaryTrustCreate',
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

    const payload: IFiduciaryTrust = {
      name: data.name,
      business_trust_id: data.business_trust_id,
      real_estate_project_id: data.real_estate_project_id,
      stage_id: data.stage_id,
      currency: data.currency,
      status_id: data.status_id,
      investment_fund_id: data.investment_fund_id,
    }

    const success = await _createAction(payload)

    if (success) handleGoToList()

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handleGoToList = () =>
    router.push({ name: 'FiduciaryTrustList', query: { reload: 'true' } })

  const allKeys = [keys, keys2, keys3]
  onMounted(async () => {
    await Promise.all(allKeys.map((k) => _getResources(k)))
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

export default useFiduciaryTrustCreate
