import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useDividendLocalStore, useResourceManagerStore } from '@/stores'

const useDividendLocalCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createDividendLocal, _cleanDividendLocalsData } =
    useDividendLocalStore('v1')

  const operationalETFFormRef = ref()

  const headerProps = {
    title: 'Crear registro de dividendos ETFs moneda local',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      {
        label: 'Registro de dividendos ETFs moneda local',
        route: 'DividendLocalList',
      },
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
      const success = await _createDividendLocal(payload)
      if (success) {
        router.push({ name: 'DividendLocalList' })
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: ['emitter_anna_codes', 'exchange_traded_fund_local'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _cleanDividendLocalsData()
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

export default useDividendLocalCreate
