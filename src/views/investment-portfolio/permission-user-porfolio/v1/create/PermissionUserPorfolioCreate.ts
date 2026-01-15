// vue | quasar | router
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// store
import { usePermissionUserPorfolioStore } from '@/stores'

// composables
import { useAlert, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const usePermissionUserPorfolioCreate = () => {
  const { _createPermissionUserPorfolio } = usePermissionUserPorfolioStore('v1')

  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()

  // props
  const informationFormRef = ref()
  const headerProps = {
    title: 'Permisos por portafolio',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Portafolio de inversiones',
      },
      {
        label: 'Permisos por portafolio',
        route: 'PermissionUserPorfolioList',
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
    const form = informationFormRef.value.models
    return {
      user_id: form?.user_code.id ?? null,
      user_name: form?.user_name ?? '',
      investment_portfolio_id: form?.portfolio_code.id ?? null,
      portfolio_description: form?.portfolio_description ?? '',
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
    const success = await _createPermissionUserPorfolio(payload)

    if (success) {
      router.push({ name: 'PermissionUserPorfolioList' })
    }
    openMainLoader(false)
  }

  return {
    informationFormRef,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    onSubmit,
  }
}

export default usePermissionUserPorfolioCreate
