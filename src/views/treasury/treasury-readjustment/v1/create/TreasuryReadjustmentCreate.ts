import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'

import { ITreasureReadjustmentForm } from '@/interfaces/customs'
import { useResourceManagerStore, useTreasuryReadjustmentStore } from '@/stores'

const useTreasuryReadjustmentCreate = () => {
  const {
   _getResources,
   _resetKeys
  } = useResourceManagerStore('v1')

  const { _treasuryBalanceAdjustmentProcess } = useTreasuryReadjustmentStore('v1')

  const data_information_form = ref<ITreasureReadjustmentForm | null>(null)
  const informationFormRef = ref()
  const alertModalRef = ref()

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()

  const keys = [
    'business_trusts_egreso',
  ]

  const headerProps = {
    title: `Ajustes saldos de tesorería`,
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
        label: `Ajustes saldos de tesorería`,
        route: 'TreasuryReadjustmentCreate',
      }
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
      required: true,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))
  const tabActive = ref(filteredTabs.value[0].name)
  const tabActiveIdx = ref(filteredTabs.value.findIndex((tab) => tab.name === tabActive.value))

  const validateForms = async () => {
    let valid: boolean = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  const nextTab = async () => {
    if (!(await validateForms())) return
    tabActiveIdx.value = tabActiveIdx.value + 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value = tabActiveIdx.value - 1
    tabActive.value = filteredTabs.value[tabActiveIdx.value].name
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ITreasureReadjustmentForm> = {
      ...makeBaseInfoRequest(data_information_form.value),
    }

    return apiRequestBody
  }

  const makeBaseInfoRequest = (data: ITreasureReadjustmentForm | null) => {
    if (!data) return {}

    const request: Partial<ITreasureReadjustmentForm> = {
      from_business_id: data.from_business_id,
      to_business_id: data.to_business_id,
      from_bank_id: data.from_bank_id,
      to_bank_id: data.to_bank_id,
      from_account_id: data.from_account_id,
      to_account_id: data.to_account_id,
      start_date: data.start_date,
      end_date: data.end_date,
    }

    return cleanEmptyFields(request)
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return
    await alertModalRef.value.openModal()
  }

  const treasuryBalanceAdjustmentProcess = async () => {
    alertModalRef.value.closeModal()
    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _treasuryBalanceAdjustmentProcess(payload)
    if (success) {
      setTimeout(() => {
        clearForm()
  
        tabActiveIdx.value = 0
        tabActive.value = filteredTabs.value[0].name
      }, 1000)
    }
    openMainLoader(false)
  }

  const clearForm = () => {
    data_information_form.value = {
      from_business_id: null,
      to_business_id: null,
      from_bank_id: null,
      to_bank_id: null,
      from_account_id: null,
      to_account_id: null,
      start_date: '',
      end_date: '',
    }
    informationFormRef.value?.resetForm()
  }

  onMounted(async () => {
    await _getResources({
      treasury: keys,
    })
  })

  onBeforeUnmount(() => {
    _resetKeys({
      treasury: keys,
    })
  })

  return {
    headerProps,
    tabs,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    
    data_information_form,
    informationFormRef,
    alertModalRef,

    nextTab,
    backTab,
    onSubmit,
    treasuryBalanceAdjustmentProcess,
    clearForm,
  }
}

export default useTreasuryReadjustmentCreate