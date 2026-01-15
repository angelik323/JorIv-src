import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useDividendLocalStore, useResourceManagerStore } from '@/stores'

const useDividendLocalEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const DividendLocalId = +route.params.id
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _updateDividendLocal, _getDividendLocal, _cleanDividendLocalsData } =
    useDividendLocalStore('v1')

  const DividendLocalForm = ref()

  const headerProps = {
    title: "Editar registro de dividendos ETF's moneda local",

    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Operaciones renta variable', route: 'DividendLocalList' },
      { label: 'Editar' },
      { label: `${DividendLocalId}` },
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
    return DividendLocalForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = DividendLocalForm.value.getFormData()
      const success = await _updateDividendLocal(DividendLocalId, payload)
      if (success) {
        router.push({ name: 'DividendLocalList' })
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: ['emitter_anna_codes', 'exchange_traded_fund_local'],
  }

  const hasLoadedData = ref(false)

  onMounted(async () => {
    openMainLoader(true)
    const portfolioPromise = _getDividendLocal(DividendLocalId)
    const resourcePromise = _getResources(keys)

    Promise.all([resourcePromise, portfolioPromise]).finally(() => {
      hasLoadedData.value = true
      openMainLoader(false)
    })
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
    DividendLocalFormRef: DividendLocalForm,
    DividendLocalId,
    hasLoadedData,
    onSubmit,
  }
}

export default useDividendLocalEdit
