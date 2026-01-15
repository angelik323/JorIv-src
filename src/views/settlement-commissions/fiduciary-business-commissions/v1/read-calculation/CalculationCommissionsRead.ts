import { ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

// Utils
import { defaultIconsLucide } from '@/utils'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useMainLoader } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores'

const useCalculationCommissionsRead = () => {
  const { _getByIdCalculationCommissions, _clearData } =
    useFiduciaryBusinessCommissionsStore('v1')
  const { calculation_commissions_response } = storeToRefs(
    useFiduciaryBusinessCommissionsStore('v1')
  )

  // Referencias a formularios
  const basicDataFormRef = ref()

  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Ver cálculo de comisión fiduciaria',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definir Comisiones de negocios fiduciarios',
        route: 'BusinessTrustCommissionsList',
      },
      {
        label: 'ver',
        route: 'FiduciaryBusinessCommissionsRead',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic-data',
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

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    router.push({ name: 'BusinessTrustCommissionsList' })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    _clearData()
    await _getByIdCalculationCommissions(searchId)
    openMainLoader(false)
  })

  return {
    calculation_commissions_response,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    nextTab,
    backTab,
    onSubmit,
  }
}

export default useCalculationCommissionsRead
