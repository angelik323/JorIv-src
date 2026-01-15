import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import {
  useCancellationRejectionReasonsStore,
  useResourceManagerStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useCancellationRejectionReasonsCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide } = useUtils()

  const { cancellation_rejection_reasons_form } = storeToRefs(
    useCancellationRejectionReasonsStore('v1')
  )

  const { _createCancellationRejectionReasons } =
    useCancellationRejectionReasonsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounts_payable: ['cancellation_reason_types'],
  }

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Crear motivo de anulación y rechazo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Motivos de anulación y rechazo',
        route: 'CancellationRejectionReasonsList',
      },
      {
        label: 'Crear',
        route: 'CancellationRejectionReasonsCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
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

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!cancellation_rejection_reasons_form.value) return
    openMainLoader(true)
    const payload = { ...cancellation_rejection_reasons_form.value }
    if (await _createCancellationRejectionReasons(payload)) {
      goToURL('CancellationRejectionReasonsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    await _getResources(keys)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    handleCreate,
    goToURL,
  }
}

export default useCancellationRejectionReasonsCreate
