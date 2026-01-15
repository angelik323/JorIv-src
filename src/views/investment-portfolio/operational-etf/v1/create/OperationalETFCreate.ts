import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useOperationalETFStore, useResourceManagerStore } from '@/stores'

const useInvestmentPortfolioCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createOperationalETF, _cleanOperationalETFsData } =
    useOperationalETFStore('v1')

  const operationalETFFormRef = ref()

  const headerProps = {
    title: "Crear ETF's",
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: "Definición ETF's", route: 'OperationalETFList' },
      { label: 'Crear' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    return operationalETFFormRef?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = operationalETFFormRef.value.getFormData()
      const success = await _createOperationalETF(payload)
      if (success) {
        router.push({ name: 'OperationalETFList' })
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: [
      'administrators_codes',
      'coins',
      'isin_code_type_changeable',
      'emitter',
      'isin_code_mnemonics',
    ],
  }

  onMounted(async () => {
    openMainLoader(true)
    _resetKeys({ fics: ['funds'], trust_business: ['business_trusts'] })
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanOperationalETFsData()
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    operationalETFFormRef,
    onSubmit,
  }
}

export default useInvestmentPortfolioCreate
