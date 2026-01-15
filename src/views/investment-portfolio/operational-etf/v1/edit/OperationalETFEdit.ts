import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useOperationalETFStore, useResourceManagerStore } from '@/stores'

const useOperationalETFEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const OperationalETFId = +route.params.id
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const {
    _updateOperationalETF,
    _getOperationalETF,
    _cleanOperationalETFsData,
  } = useOperationalETFStore('v1')

  const OperationalETFForm = ref()

  const headerProps = {
    title: "Editar ETF's",
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones' },
      { label: "Definición ETF's", route: 'OperationalETFList' },
      { label: 'Editar' },
      { label: `${OperationalETFId}` },
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
    return OperationalETFForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const payload = OperationalETFForm.value.getFormData()
      const success = await _updateOperationalETF(OperationalETFId, payload)
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

  const hasLoadedData = ref(false)

  onMounted(async () => {
    openMainLoader(true)
    const portfolioPromise = _getOperationalETF(OperationalETFId)
    const resourcePromise = _getResources(keys)

    Promise.all([resourcePromise, portfolioPromise]).finally(() => {
      hasLoadedData.value = true
      openMainLoader(false)
    })
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
    OperationalETFFormRef: OperationalETFForm,
    OperationalETFId,
    hasLoadedData,
    onSubmit,
  }
}

export default useOperationalETFEdit
