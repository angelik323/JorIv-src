// vue - pinia
import { ref, onUnmounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IDesativateDailyClosingVouchersCreate } from '@/interfaces/customs/accounting/DesactivateDailyClosingVouchersV2'

// composables
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

// stores
import { useDesactivateDailyClousingVouchersStore } from '@/stores/accounting/desactivate-daily-clousing-vouchers'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useDesactivateDailyClousingVouchersCreate = () => {
  const { goToURL } = useGoToUrl()
  const { isEmptyOrZero, defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(
    useDesactivateDailyClousingVouchersStore('v1')
  )

  const { _createAction } = useDesactivateDailyClousingVouchersStore('v2')

  const { _resetKeys } = useResourceManagerStore('v1')

  const isValidatedForm = ref(false)

  const modelReasonModal = ref('')
  const reasonRef = ref()
  const alertModalRef = ref()
  const idDesactivateDailyClosingVouchers = ref<number | null>(null)

  const keysForReset = {
    accounting: [
      'accounting_account_structures',
      'business_trusts_for_period_opening',
    ],
  }

  // props
  const headerProps = {
    title: 'Desactualización de cierres diarios',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Desactualización de cierre diario',
        route: 'DesactivateDailyClosingList',
      },
      {
        label: 'Desactualización',
        route: 'DesactivateDailyClosingCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
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
      name: 'inform_process',
      label: 'Informe del proceso',
      icon: defaultIconsLucide.book,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const makeDataRequest = (): IDesativateDailyClosingVouchersCreate => {
    const formData = formInformationRef.value.getDataForm()

    return {
      ...formData,
      opening_reason: modelReasonModal.value,
    }
  }

  const tabActive = ref(tabs[0].name)

  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformationRef = ref()

  onBeforeUnmount(() => {
    _resetKeys(keysForReset)
  })

  onUnmounted(async () => {
    _resetKeys(keysForReset)
  })

  const openReasonForm = () => {
    const formData = formInformationRef.value.getDataForm()
    if (!isEmptyOrZero(formData)) {
      alertModalRef.value.openModal()
    }
  }

  const onSubmit = async () => {
    if (await reasonRef.value.validate()) {
      openMainLoader(true)
      const payload: IDesativateDailyClosingVouchersCreate = makeDataRequest()

      const { id, success } = await _createAction(payload)
      if (success) {
        alertModalRef.value.closeModal()
        idDesactivateDailyClosingVouchers.value = id
      }
      setTimeout(() => {
        openMainLoader(false)
        tabActive.value = tabs[1].name
        tabActiveIdx.value = tabs.findIndex(
          (tab) => tab.name === tabActive.value
        )
      }, 1000)
    }
  }

  const onFinish = () => {
    goToURL('DesactivateDailyClosingList')
  }

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    data_information_form,
    isValidatedForm,
    modelReasonModal,
    formInformationRef,
    reasonRef,
    alertModalRef,
    idDesactivateDailyClosingVouchers,
    defaultIconsLucide,
    onSubmit,
    onFinish,
    openReasonForm,
  }
}

export default useDesactivateDailyClousingVouchersCreate
