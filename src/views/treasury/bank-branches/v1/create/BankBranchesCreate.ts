import { onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'

import { defaultIcons } from '@/utils'
import { useBankBranchesStore, useBankingEntitiesStore } from '@/stores'

const useBankBranchesCreate = () => {
  const router = useRouter()

  const { openMainLoader } = useMainLoader()
  const { bank_receipt_request } = storeToRefs(useBankingEntitiesStore('v1'))
  const { data_information_form } = storeToRefs(useBankBranchesStore('v1'))
  const { _createBankBranches, _setDataBasicBankBranches } =
    useBankBranchesStore('v1')
  const BankBranchesBasicDataRef = ref()
  const bankingEntitieId = bank_receipt_request?.value?.id

  const tabs = ref([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIcons.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const activeTab = ref(tabs.value[0].name)

  const headerProperties = ref({
    title: 'Crear sucursal bancaria',
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
        label: 'Entidades bancarias',
        route: 'BankingEntitiesList',
      },
      {
        label: 'Ver entidad bancaria',
        route: 'BankingEntitiesView',
      },
      {
        label: '',
        route: '',
      },
      {
        label: 'Crear sucursal bancaria',
        route: '',
      },
    ],
  })

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const tabActive = ref(tabs.value[0].name)

  const handlerGoTo = (goURL: string, bankingEntitieId?: number) => {
    router.push({ name: goURL, params: { id: bankingEntitieId } })
  }

  const validateForm = async () => {
    return (await BankBranchesBasicDataRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const { id } = bank_receipt_request.value ?? {}
    const { code, name, address, city_id } = data_information_form.value ?? {}
    return {
      code: code,
      bank_id: id,
      name: name,
      address: address,
      city_id: city_id,
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createBankBranches(payload)) {
        handlerGoTo('BankingEntitiesView', bankingEntitieId)
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  watch(
    () => bank_receipt_request.value?.description,
    (labelProperties) => {
      headerProperties.value.breadcrumbs[4].label = labelProperties ?? ''
    },
    { immediate: true }
  )

  onUnmounted(async () => {
    _setDataBasicBankBranches(null)
  })

  return {
    tabs,
    activeTab,
    headerProperties,
    tabActiveIdx,
    bank_receipt_request,
    BankBranchesBasicDataRef,
    tabActive,
    bankingEntitieId,
    onSubmit,
    handlerGoTo,
  }
}
export default useBankBranchesCreate
