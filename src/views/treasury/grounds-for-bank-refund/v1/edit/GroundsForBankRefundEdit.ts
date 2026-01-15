// vue | quasar | router
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { useGroundsBankRefundStore, useResourceStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'

const useGroundsForBankRefundEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id

  const { data_information_form, data_grounds_bank_request } = storeToRefs(
    useGroundsBankRefundStore('v1')
  )

  const {
    _setDataInformationForm,
    _updateGroundsBankRefund,
    _getByIdGroundsBankRefund,
  } = useGroundsBankRefundStore('v1')

  const { _getResourcesTreasuries } = useResourceStore('v1')
  const { openMainLoader } = useMainLoader()

  // props
  const keys = ['reason_return_apply', 'reason_return_status']

  const headerProps = {
    title: 'Editar causales bancarias',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Causales de devolución bancaría',
        route: 'GroundsForBankRefund',
      },
      {
        label: 'editar',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Información básica*',
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

  const GroundsForBankRefundDataRef = ref()

  // handlers / actions
  const validateForm = async () => {
    return (await GroundsForBankRefundDataRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const form = data_information_form.value
    if (!form) return
    return {
      name: form.name,
      apply: form.apply,
      status_id: form.status_id,
      causal_code: form.causal_code,
    }
  }
  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (!payload) return

      if (await _updateGroundsBankRefund(payload, searchId)) {
        router.push({ name: 'GroundsForBankRefund' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    data_information_form.value = null
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  onBeforeMount(async () => {
    openMainLoader(true)
    data_information_form.value = null
    await _getByIdGroundsBankRefund(searchId)
    openMainLoader(false)
  })

  return {
    GroundsForBankRefundDataRef,
    data_grounds_bank_request,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    onSubmit,
  }
}

export default useGroundsForBankRefundEdit
