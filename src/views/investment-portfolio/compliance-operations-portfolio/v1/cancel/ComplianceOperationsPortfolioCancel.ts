import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  useComplianceOperationsPortfolioStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const useComplianceOperationsPortfolioCancel = () => {
  const { defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { headerPropsDefault } = storeToRefs(
    useComplianceOperationsPortfolioStore('v1')
  )
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Anulación cumplimiento operaciones portafolio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Anular',
      },
    ],
  }

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

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

  const keys = {
    investment_portfolio: ['operation_compliance_statuses'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    tabActive.value = tabs.value[0].name
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    goToURL,
  }
}

export default useComplianceOperationsPortfolioCancel
