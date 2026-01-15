// vue - quasar - router -pinia
import { useRoute, useRouter } from 'vue-router'
import { onBeforeMount, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

// store
import { usePolicyStore } from '@/stores/trust-business/policy'

// composables
import { useMainLoader, useAlertModal } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'

// assets
import imageAlert from '@/assets/images/icons/alert_popup.svg'

const usePolicyView = () => {
  // router
  const router = useRouter()
  const route = useRoute()
  const policyId = +route.params.id

  // imports
  const { openMainLoader } = useMainLoader()
  const { showAlertInformation } = useAlertModal()
  const { policy_request, data_authorization } = storeToRefs(
    usePolicyStore('v1')
  )

  const { _getByIdPolicy, _setDataInformationForm, _authorize, _clearData } =
    usePolicyStore('v1')

  const formAuthorize = ref()

  const headerProps = {
    title: 'Autorizar póliza',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Negocios fiduciarios',
      },
      {
        label: 'Pólizas',
        route: 'PolicyAuthorize',
      },
      {
        label: 'Autorizar',
      },
      {
        label: `${policyId}`,
      },
    ],
  }

  // tabs
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
    {
      name: 'auth',
      label: 'Autorizar*',
      icon: defaultIconsLucide.circleCheckBig,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdPolicy(policyId)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _clearData()
    _setDataInformationForm(null)
  })

  const onSubmit = async (action: boolean) => {
    if (await formAuthorize.value?.validateForm()) {
      const actionText = action ? 'autorizar' : 'rechazar'

      const isConfirmed = await showAlertInformation({
        title: `¿Desea ${actionText} la póliza?`,
        description: '',
        image_url: imageAlert,
        confirm_button_text: 'Aceptar',
        cancel_button_text: 'Cancelar',
        show_cancel_button: true,
      })

      if (!isConfirmed) {
        return
      }

      openMainLoader(true)
      await _authorize(policyId, action, data_authorization.value ?? '')
      router.push({
        name: 'PolicyList',
        query: {
          reload: 1,
        },
      })
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    policy_request,
    formAuthorize,

    onSubmit,
    handlerGoTo,
    backTab,
    nextTab,
  }
}

export default usePolicyView
