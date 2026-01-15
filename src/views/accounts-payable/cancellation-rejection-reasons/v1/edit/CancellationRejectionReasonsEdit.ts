import { useGoToUrl, useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useCancellationRejectionReasonsStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

export const useCancellationRejectionReasonsEdit = () => {
  const route = useRoute()

  const { goToURL } = useGoToUrl()
  const cancellationRejectionReasonsId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const {
    cancellation_rejection_reasons_form,
    cancellation_rejection_reasons_response,
  } = storeToRefs(useCancellationRejectionReasonsStore('v1'))

  const {
    _getCancellationRejectionReasonsById,
    _updateCancellationRejectionReasons,
  } = useCancellationRejectionReasonsStore('v1')

  const basicDataFormRef = ref()

  const headerProps = {
    title: 'Editar motivo de anulación y rechazo',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Motivos de anulación y rechazo',
        route: 'CancellationRejectionReasonsList',
      },
      {
        label: 'Editar',
        route: 'CancellationRejectionReasonsEdit',
      },
      {
        label: `${cancellationRejectionReasonsId}`,
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

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!cancellation_rejection_reasons_form.value) return
    openMainLoader(true)
    const payload = { ...cancellation_rejection_reasons_form.value }
    if (
      await _updateCancellationRejectionReasons(
        payload,
        cancellationRejectionReasonsId
      )
    ) {
      goToURL('CancellationRejectionReasonsList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getCancellationRejectionReasonsById(cancellationRejectionReasonsId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    cancellation_rejection_reasons_response,
    handleEdit,
    goToURL,
  }
}

export default useCancellationRejectionReasonsEdit
