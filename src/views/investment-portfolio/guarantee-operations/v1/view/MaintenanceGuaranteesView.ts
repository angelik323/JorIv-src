// Vue - pinia
import { onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IGuaranteeOperationResponseById } from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useGuaranteeOperationsStore } from '@/stores/investment-portfolio/guarantee-operations'

const useMaintenanceGuaranteesView = () => {
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { headerPropsDefault } = storeToRefs(useGuaranteeOperationsStore('v1'))
  const { _getGuaranteeOperationById } = useGuaranteeOperationsStore('v1')

  const basicDataResponse = ref<IGuaranteeOperationResponseById | null>(null)

  const maintenanceGuaranteesId = Number(router.currentRoute.value.params.id)

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Ver mantenimiento de garantías',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver mantenimiento de garantías',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const basicDataFormRef = ref()

  const tabActive = ref('')
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  onMounted(async () => {
    openMainLoader(true)
    const data = await _getGuaranteeOperationById(maintenanceGuaranteesId)
    if (data) {
      basicDataResponse.value = data
      tabActive.value = tabs.value[0].name
    } else {
      goToURL('GuaranteeOperationsList')
    }
    openMainLoader(false)
  })

  const onFinish = async () => {
    goToURL('GuaranteeOperationsList')
  }

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basicDataResponse,
    goToURL,
    onFinish,
  }
}

export default useMaintenanceGuaranteesView
