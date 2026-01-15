import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'

import { defaultIcons } from '@/utils'
import { useBankBranchesStore, useBankingEntitiesStore } from '@/stores'

const useBankBranchesEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const { openMainLoader } = useMainLoader()

  const { bank_receipt_request } = storeToRefs(useBankingEntitiesStore('v1'))
  const { bank_branches_request, data_information_form } = storeToRefs(
    useBankBranchesStore('v1')
  )
  const {
    _getByIdBankBranches,
    _updateBankBranches,
    _setDataBasicBankBranches,
  } = useBankBranchesStore('v1')
  const bankingEntitieId = bank_receipt_request.value?.id
  const bankBrancheId = +route.params.id

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
  const BankBranchesBasicDataRef = ref()
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )

  const headerProperties = ref({
    title: 'Editar sucursal bancaria',
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
        label: 'Editar sucursal bancaria',
        route: '',
      },
    ],
  })

  const validateForm = async () => {
    return (await BankBranchesBasicDataRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const { id } = bank_receipt_request.value ?? {}
    return {
      code: data_information_form.value?.code ?? '',
      bank_id: id,
      name: data_information_form.value?.name ?? '',
      address: data_information_form.value?.address ?? '',
      city_id: data_information_form.value?.city_id ?? null,
      status_id: data_information_form.value?.status_id ?? null,
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _updateBankBranches(bankBrancheId, payload)) {
        handlerGoTo('BankingEntitiesView', bankingEntitieId)
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const handlerGoTo = (goURL: string, bankingEntitieId?: number) => {
    router.push({ name: goURL, params: { id: bankingEntitieId } })
  }

  watch(
    () => bank_receipt_request.value?.description,
    (labelProperties) => {
      headerProperties.value.breadcrumbs[4].label = labelProperties
        ? `${labelProperties.charAt(0).toUpperCase()}${labelProperties
            .slice(1)
            .toLowerCase()}`
        : ''
    },
    { immediate: true }
  )

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdBankBranches(bankBrancheId)
    openMainLoader(false)
  })

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
    bank_branches_request,
    onSubmit,
    handlerGoTo,
  }
}
export default useBankBranchesEdit
