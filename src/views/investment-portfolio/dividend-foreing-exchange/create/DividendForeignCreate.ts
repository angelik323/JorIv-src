import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useDividendForeignStore, useResourceManagerStore } from '@/stores'

const useDividendForeignCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _createDividendForeign, _cleanDividendForeignData } =
    useDividendForeignStore('v1')

  const operationalETFFormRef = ref()

  const headerProps = {
    title: 'Crear registro de dividendos ETFs moneda extranjera',
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
      const success = await _createDividendForeign(payload)
      if (success) {
        router.push({ name: 'DividendLocalList' })
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: [
      'emitter_anna_codes',
      'exchange_traded_fund_foreign',
      'coins',
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
    _cleanDividendForeignData()
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

export default useDividendForeignCreate
