import { useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ITabs } from '@/interfaces/global'
import { defaultIconsLucide } from '@/utils'
import { ICancellationCodesResponse } from '@/interfaces/customs'
import { useResourceStore, useCancellationCodesStore } from '@/stores'

const useCancellationCodesEdit = () => {
  const { openMainLoader } = useMainLoader()

  const router = useRouter()
  const route = useRoute()

  const cancellationCodeId = +route.params.id

  const { data_information_form, cancellation_codes_request } = storeToRefs(
    useCancellationCodesStore('v1')
  )

  const {
    _getByIdCancellationCode,
    _updateCancellationCode,
    _setDataCancellationCodes,
  } = useCancellationCodesStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')

  const keys = ['treasury_cancellation_code_type']

  const headerProps = {
    title: 'Editar código de anulación de tesorería',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Código de anulación tesorería',
        route: 'CancellationCodesList',
      },
      {
        label: 'Editar',
        route: '',
      },
      {
        label: `${cancellationCodeId}`,
      },
    ],
  }
  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básica',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const makeDataRequest = () => {
    return {
      description: data_information_form.value?.description ?? '',
      type: data_information_form.value?.type ?? '',
      reverse_conciliation:
        data_information_form.value?.reverses_conciliation ?? false,
      preserve_consecutive_check:
        data_information_form.value?.retains_consecutive_check ?? false,
    }
  }

  const tabActive = ref(tabs.value[0].name)

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(async () => {
    _setDataCancellationCodes(null)
  })

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: ICancellationCodesResponse = makeDataRequest()
      if (await _updateCancellationCode(payload, cancellationCodeId)) {
        router.push({ name: 'CancellationCodesList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdCancellationCode(cancellationCodeId)
    openMainLoader(false)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    cancellation_codes_request,
    formInformation,
    onSubmit,
  }
}

export default useCancellationCodesEdit
