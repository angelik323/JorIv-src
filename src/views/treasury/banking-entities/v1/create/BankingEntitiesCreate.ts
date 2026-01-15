import { reactive, ref, onUnmounted } from 'vue'
import { defaultIconsLucide } from '@/utils'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { storeToRefs } from 'pinia'
import { useBankingEntitiesStore } from '@/stores'

const useBankingEntitiesCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const {
    data_information_form,
    error_information_form,
    bank_entity_creation_error_flag,
  } = storeToRefs(useBankingEntitiesStore('v1'))
  const { _createBankingEntities, _setDataBasicBankingEntitie } =
    useBankingEntitiesStore('v1')

  const ERROR_INVALID_BANK_CODE_OR_NIT = error_information_form
  const informationFormRef = ref()
  const alertModalRef = ref()
  const formModalRef = ref()

  const headerProperties = {
    title: 'Crear banco',
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
        label: 'Crear',
        route: 'BankingEntitiesCreate',
      },
    ],
  }

  const tabs = reactive([
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

  const activeTab = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === activeTab.value)
  )

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  const validateForm = async () => {
    return (await informationFormRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const { description, nit, bank_code } = data_information_form.value ?? {}
    const bankType = 'Banco'
    return {
      description: description ?? null,
      third_party_id: nit,
      bank_code: bank_code ?? '',
      type: bankType,
      justification: error_information_form.value
        ? modelModalJustification.value.justification
        : '',
      validated: bank_entity_creation_error_flag.value,
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createBankingEntities(payload)) {
        router.push({ name: 'BankingEntitiesList' })
      } else if (error_information_form.value) {
        await alertModalRef.value.openModal()
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const changeStatusAction = async () => {
    if (await formModalRef.value.validate()) {
      await alertModalRef.value.closeModal()
      openMainLoader(true)
      const payload = makeDataRequest()
      if (modelModalJustification.value.justification) {
        payload.validated = !bank_entity_creation_error_flag.value
      }

      const creationResult = await _createBankingEntities(payload)
      if (creationResult) {
        router.push({ name: 'BankingEntitiesList' })
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  const modelModalJustification = ref<{ justification: string }>({
    justification: '',
  })

  onUnmounted(() => {
    _setDataBasicBankingEntitie(null)
  })

  return {
    headerProperties,
    tabs,
    activeTab,
    tabActiveIdx,
    informationFormRef,
    alertModalRef,
    modelModalJustification,
    ERROR_INVALID_BANK_CODE_OR_NIT,
    formModalRef,

    changeStatusAction,
    handlerGoTo,
    onSubmit,
  }
}
export default useBankingEntitiesCreate
