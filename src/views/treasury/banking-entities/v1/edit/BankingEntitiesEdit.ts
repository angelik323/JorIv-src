import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useBankingEntitiesStore } from '@/stores'
import { ref, onBeforeMount, onUnmounted } from 'vue'
import { defaultIconsLucide } from '@/utils'
import { useMainLoader } from '@/composables'

const useBankingEntitiesEdit = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const bankingEntitieId = +route.params.id

  const {
    data_information_form,
    bank_receipt_request,
    error_information_form,
  } = storeToRefs(useBankingEntitiesStore('v1'))
  const {
    _getByIdBankingEntities,
    _setDataBasicBankingEntitie,
    _updateBankingEntities,
  } = useBankingEntitiesStore('v1')
  const ERROR_INVALID_BANK_CODE_OR_NIT = error_information_form

  const headerProperties = {
    title: 'Editar banco',
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
        label: 'Editar',
        route: 'BankingEntitiesEdit',
      },
      {
        label: bankingEntitieId.toString(),
      },
    ],
  }

  const tabs = ref([
    {
      name: 'InformationForm',
      label: 'Datos Básicos',
      icon: defaultIconsLucide.listBulleted,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])

  const activeTab = ref(tabs.value[0].name)
  const alertModalRef = ref()

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const modelModalJustification = ref<{ justification: string }>({
    justification: '',
  })
  const formInformation = ref()

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const bankType = 'Banco'
    return {
      description: data_information_form.value?.description,
      third_party_id: data_information_form.value?.nit ?? null,
      bank_code: data_information_form.value?.bank_code ?? null,
      type: bankType,
      justification: error_information_form.value
        ? modelModalJustification.value.justification
        : '',
      validated: !error_information_form.value,
      status_id: data_information_form.value?.status ?? null,
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()

      if (await _updateBankingEntities(bankingEntitieId, payload)) {
        router.push({ name: 'BankingEntitiesList' })
      } else if (error_information_form.value) {
        await alertModalRef.value.openModal()
      }
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const changeStatusAction = async () => {
    await alertModalRef.value.closeModal()
    openMainLoader(true)
    const payload = makeDataRequest()
    const EditResult = await _updateBankingEntities(bankingEntitieId, payload)
    if (EditResult) {
      router.push({ name: 'BankingEntitiesList' })
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdBankingEntities(bankingEntitieId)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataBasicBankingEntitie(null)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    data_information_form,
    formInformation,
    bank_receipt_request,
    modelModalJustification,
    ERROR_INVALID_BANK_CODE_OR_NIT,
    alertModalRef,
    handlerGoTo,
    onSubmit,
    changeStatusAction,
  }
}

export default useBankingEntitiesEdit
