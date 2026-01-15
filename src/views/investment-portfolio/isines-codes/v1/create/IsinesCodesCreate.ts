// vue | quasar | router
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

// store
import { useIsinesCodesStore, useResourceManagerStore } from '@/stores'

// composables
import { useAlert, useMainLoader, useUtils } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

// Components
import InformationForm from '@/components/Forms/InvestmentPortfolio/IsinesCodes/Information/InformationForm.vue'

const useIsinesCodesCreate = () => {
  const { _createIsinesCodes } = useIsinesCodesStore('v1')
  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { cleanEmptyFields } = useUtils()

  // props
  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null
  )

  const headerProps = {
    title: 'Códigos ISINES',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Códigos ISINES',
        route: 'IsinesCodesList',
      },
      {
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
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

  // handlers / actions
  const makeDataRequest = () => {
    const form = cleanEmptyFields(
      informationFormRef.value?.getFormValues() ?? {},
      true
    )

    return {
      ...form,
      fixed_rate_value: form?.fixed_rate_value
        ? Number(form?.fixed_rate_value)
        : 0,
    }
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) {
      showAlert('El registro no pudo ser creado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()

    const success = await _createIsinesCodes(payload)

    if (success) {
      router.push({ name: 'IsinesCodesList' })
    }

    openMainLoader(false)
  }

  // lifecycle hooks
  const keys = {
    investment_portfolio: [
      'administrators_codes',
      'titles_classes',
      'perioricities',
      'rate',
      'interest_rates',
      'rates_behaviors',
      'emitter_anna_codes',
    ],
  }
  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    await _getResources(keys)
  })

  return {
    informationFormRef,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    onSubmit,
  }
}

export default useIsinesCodesCreate
