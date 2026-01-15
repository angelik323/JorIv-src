// vue | quasar | router
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'

// store
import { storeToRefs } from 'pinia'
import { useGroundsBankRefundStore, useResourceStore } from '@/stores'

// composables
import { useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'
import { ITabs } from '@/interfaces/global'
import { IGroundsBankRefund } from '@/interfaces/customs'

const useGroundsForBankRefundCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { data_information_form } = storeToRefs(useGroundsBankRefundStore('v1'))
  const { _setDataInformationForm, _createGroundsBankRefund } =
    useGroundsBankRefundStore('v1')
  const { _getResourcesTreasuries } = useResourceStore('v1')

  // props
  const keys = ['reason_return_apply']

  const headerProps = {
    title: 'Crear causales bancarias',
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
        label: 'Crear',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos Básicos',
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
    return {
      name: data_information_form.value?.name ?? '',
      apply: data_information_form.value?.apply ?? '',
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload: IGroundsBankRefund = makeDataRequest()
      if (await _createGroundsBankRefund(payload)) {
        router.push({ name: 'GroundsForBankRefund' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  return {
    GroundsForBankRefundDataRef,
    tabActiveIdx,
    headerProps,
    tabActive,
    tabs,
    onSubmit,
  }
}

export default useGroundsForBankRefundCreate
