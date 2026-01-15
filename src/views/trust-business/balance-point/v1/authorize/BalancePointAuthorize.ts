// Componsables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Interfaces
import { ITabs } from '@/interfaces/global/Tabs'

// Stores
import { useBalancePointStore } from '@/stores/trust-business/balance-point'

// Vue
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const useBalancePointAuthorize = () => {
  const router = useRouter()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const idBalancePoint = router.currentRoute.value.params.id
  const AUTHORIZATION_ID = 71
  const DENY_AUTHORIZATION_ID = 10

  const { headerPropsDefault, data_authorization_form } = storeToRefs(
    useBalancePointStore('v1')
  )
  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Autorizar punto de equilibrio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Autorizar',
      },
      {
        label: idBalancePoint.toString(),
      },
    ],
  }

  const { _authorizeOrDenyBalancePoint, _getBalancePointById } =
    useBalancePointStore('v1')

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'mandate_data',
      label: 'Encargo',
      icon: defaultIconsLucide.ArrowLeftRight,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'summary_data',
      label: 'Resumen',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'authorize_data',
      label: 'Autorización',
      icon: defaultIconsLucide.checkCircle,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const authorizeFormRef = ref()

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const nextTab = async () => {
    const isValid = await validateForms()
    if (!isValid) return

    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const validateForms = async () => {
    if (tabActive.value === 'authorize_data') {
      return await authorizeFormRef.value?.validateForm()
    }

    return true
  }

  const confirmationModalRef = ref()
  const confirmationModalConfig = ref({
    title: '',
    description: '',
    action: null as (() => void) | null,
  })

  const openConfirmationModal = (title: string, action: () => void) => {
    confirmationModalConfig.value.title = title
    confirmationModalConfig.value.action = action
    confirmationModalRef.value?.openModal()
  }

  const handleConfirmation = () => {
    if (confirmationModalConfig.value.action) {
      confirmationModalConfig.value.action()
    }
  }

  const handleAuthorizeOrDeny = async (authorizationId: number) => {
    if (!(await validateForms())) return

    confirmationModalRef.value?.closeModal()
    openMainLoader(true)
    const success = await _authorizeOrDenyBalancePoint(
      idBalancePoint.toString(),
      data_authorization_form.value?.observation!,
      authorizationId
    )
    if (success) {
      router.push({ name: 'BalancePointList', query: { reload: 1 } })
    }
    openMainLoader(false)
  }

  const onAuthorize = () => handleAuthorizeOrDeny(AUTHORIZATION_ID)
  const onDeny = () => handleAuthorizeOrDeny(DENY_AUTHORIZATION_ID)

  const openAuthorizeModal = async () => {
    if (!(await validateForms())) return
    openConfirmationModal(
      '¿Desea autorizar el punto de equilibrio?',
      onAuthorize
    )
  }

  const openDenyModal = async () => {
    if (!(await validateForms())) return
    openConfirmationModal('¿Desea rechazar el punto de equilibrio?', onDeny)
  }

  onMounted(async () => {
    openMainLoader(true)
    if (idBalancePoint) {
      await _getBalancePointById(idBalancePoint.toString())
    }
    openMainLoader(false)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    defaultIconsLucide,
    authorizeFormRef,
    goToURL,
    nextTab,
    backTab,
    confirmationModalRef,
    confirmationModalConfig,
    handleConfirmation,
    openAuthorizeModal,
    openDenyModal,
    onAuthorize,
    onDeny,
  }
}

export default useBalancePointAuthorize
