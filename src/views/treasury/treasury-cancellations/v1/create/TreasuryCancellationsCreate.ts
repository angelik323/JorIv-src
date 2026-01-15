import { useRoute } from 'vue-router'
import { ref, onMounted, onBeforeMount } from 'vue'
import router from '@/router'
import { storeToRefs } from 'pinia'

import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useMainLoader } from '@/components/loader/composable/useMainLoader'

import {
  ITreasureCancellations,
  ITreasureCancellationsAnnulate,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'

import {
  useResourceManagerStore,
  useTreasuryResourceStore,
  useTreasuryCancellationsStore,
} from '@/stores'

const useTreasuryCancellationCreate = () => {
  const { defaultIconsLucide } = useUtils()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { treasury_periods: periodsSelect, reasons_bank_return } = storeToRefs(
    useTreasuryResourceStore('v1')
  )

  const { treasury_cancellation_selected } = storeToRefs(
    useTreasuryCancellationsStore('v1')
  )

  const { _createAction } = useTreasuryCancellationsStore('v1')

  const { openMainLoader } = useMainLoader()

  const route = useRoute()
  const { goToURL } = useGoToUrl()

  const document_query = route.query.document_query as string | null

  const cancellationModalRef = ref()

  const cancellationModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea anular el registro?',
  })

  const formData = ref<ITreasureCancellations>({})

  const headerProperties = {
    title:
      document_query === 'Movimiento de tesorería'
        ? 'Anulación de movimiento de tesorería'
        : 'Anulación de traslados',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Anulación de tesorería',
        route: 'TreasuryCancellationsList',
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

  const formDisableds = ref({
    value_local: '',
  })
  const keysTes = ['treasury_periods', 'reasonsForBankReturn']

  const holidays = ref<string[]>([])

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const openModalCancellation = () => {
    cancellationModalRef.value.openModal()
  }

  const makeDateRequest = () => {
    let payload: ITreasureCancellationsAnnulate = {
      id:
        (treasury_cancellation_selected.value?.authorization_id as number) ??
        '',
      annulate_date: formData.value.fecha as string,
      period: formData.value.periodo as string,
      observations: formData.value.observaciones as string,
      annulate_code_id: Number(formData.value.causal),
      cancellation_code_id: Number(
        treasury_cancellation_selected.value?.cancellation_code_id
      ),
    }

    if (document_query === 'Movimiento de tesorería') {
      payload = {
        ...payload,
        bank_id: Number(treasury_cancellation_selected.value?.bank?.id ?? 0),
        bank_account_id: Number(
          treasury_cancellation_selected.value?.bank_account?.id ?? 0
        ),
      }
    }

    return payload
  }

  const handleCancellation = async () => {
    openMainLoader(true)
    const payload = makeDateRequest()
    const success = await _createAction(payload)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)

    if (!success) return

    treasury_cancellation_selected.value = null
    await cancellationModalRef.value.closeModal()
    await handleGoToList()
  }

  const handleGoToList = () =>
    router.push({
      name: 'TreasuryCancellationsList',
      query: { reload: 'true' },
    })

  const handlerHolidays = async ({ year }: { year: number }) => {
    holidays.value = await useUtils().getHolidaysByYear(year)
  }

  onMounted(async () => {
    if (!treasury_cancellation_selected.value) {
      handleGoToList()
    }

    formDisableds.value.value_local =
      treasury_cancellation_selected?.value?.value?.local ?? ''
    await _getResources({ treasury: [keysTes[0]] }, '', 'v2')
    await _getResources({ treasury: [keysTes[1]] }, '', 'v1')
  })

  onBeforeMount(() =>
    _resetKeys({
      treasury: keysTes,
    })
  )

  return {
    tabs,
    type: document_query,
    formData,
    tabActive,
    tabActiveIdx,
    headerProperties,
    handleCancellation,
    cancellationModalRef,
    openModalCancellation,
    goToURL,
    cancellationModalConfig,
    periodsSelect,
    reasons_bank_return,
    treasury_cancellation_selected,
    formDisableds,
    holidays,
    handlerHolidays,
    useUtils,
  }
}

export default useTreasuryCancellationCreate
