// vue | quasar | router
import { ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// stores
import { usePermissionUserPorfolioStore } from '@/stores'

// composables
import { useAlert, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const usePermissionUserPorfolioEdit = () => {
  const {
    _updatePermissionUserPorfolio,
    _cleanData,
    _getByIdPermissionUserPorfolio,
  } = usePermissionUserPorfolioStore('v1')

  const { showAlert } = useAlert()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const route = useRoute()
  const id = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id

  // props
  const informationFormRef = ref()
  const headerProps = {
    title: 'Editar permisos a usuario',
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
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // handlers / actions
  const makeDataRequest = () => {
    const form = informationFormRef.value.models
    return {
      user_id: form?.user_id ?? null,
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
      showAlert('El registro no pudo ser actualizado.', 'error')
      return
    }

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updatePermissionUserPorfolio(payload, Number(id))

    if (success) {
      router.push({ name: 'PermissionUserPorfolioList' })
    }
    openMainLoader(false)
  }

  // lifecycle hooks
  onBeforeMount(async () => {
    _cleanData()
    openMainLoader(true)
    await _getByIdPermissionUserPorfolio(Number(id))
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

export default usePermissionUserPorfolioEdit
