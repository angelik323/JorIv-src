// vue | quasar | router
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// store
import { useIsinesCodesStore, useResourceManagerStore } from '@/stores'

// composables
import { useAlert, useMainLoader, useUtils } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

// Components
import InformationForm from '@/components/Forms/InvestmentPortfolio/IsinesCodes/Information/InformationForm.vue'

const useIsinesCodesEdit = () => {
  const { _updateIsinesCodes, _cleanData, _getByIdIsinesCodes } =
    useIsinesCodesStore('v1')
  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const { cleanEmptyFields } = useUtils()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id
  const informationFormRef = ref<InstanceType<typeof InformationForm> | null>(
    null,
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // props
  const headerProps = {
    title: 'Editar Código ISIN',
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
        label: 'Editar',
      },
      {
        label: id,
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
    tabs.value.findIndex((tab) => tab.name === tabActive.value),
  )

  // handlers / actions
  const makeDataRequest = () => {
    const form = cleanEmptyFields(
      informationFormRef.value?.getFormValues() ?? {},
      true,
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
      showAlert('El registro no pudo ser actualizado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()

    const success = await _updateIsinesCodes(payload, Number(id))

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
      'emitter_codes',
      'rate',
      'rates_behaviors',
    ],
  }
  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  onBeforeMount(async () => {
    _cleanData()
    openMainLoader(true)
    Promise.all([_getResources(keys), _getByIdIsinesCodes(Number(id))])
    openMainLoader(false)
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

export default useIsinesCodesEdit
