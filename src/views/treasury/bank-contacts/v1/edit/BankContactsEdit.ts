import { onBeforeMount, onUnmounted, ref, watch } from 'vue'
import { useMainLoader } from '@/composables'
import { useBankContactsStore, useBankingEntitiesStore } from '@/stores'
import { useRouter, useRoute } from 'vue-router'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'

const useBankContactsEdit = () => {
  const route = useRoute()
  const router = useRouter()

  const { openMainLoader } = useMainLoader()
  const {
    _getByIdBankContacts,
    _setDataBasicBankContacts,
    _updateBankContacts,
  } = useBankContactsStore('v1')
  const { bank_receipt_request } = storeToRefs(useBankingEntitiesStore('v1'))
  const {
    bank_contacts_request,
    data_information_form_contacts,
    bankingEntitieContactsId,
  } = storeToRefs(useBankContactsStore('v1'))
  const bankContactId = +route.params.id
  const bankingEntitieId = bank_receipt_request.value?.id
  const BankContactsBasicDataRef = ref()

  const headerProperties = ref({
    title: 'Editar contacto bancario',
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
        label: 'Ver entidades bancarias',
        route: 'BankingEntitiesList',
      },
      {
        label: '',
        route: '',
      },
      {
        label: 'Editar contacto bancario',
        route: '',
      },
    ],
  })

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
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )

  const validateForm = async () => {
    return (await BankContactsBasicDataRef.value?.validateForm()) ?? false
  }

  const makeDataRequest = () => {
    const {
      bank_branch_id,
      full_name,
      job_title,
      description,
      area,
      landline_phone,
      mobile_phone,
      email,
      preferred_contact_channel,
      products,
      working_days,
      available_from,
      available_to,
      status_id,
    } = data_information_form_contacts.value ?? {}

    return {
      bank_id: bankingEntitieContactsId.value,
      bank_branch_id: bank_branch_id,
      full_name: full_name,
      job_title: job_title,
      description: description,
      area: area,
      landline_phone: landline_phone,
      mobile_phone: mobile_phone,
      email: email,
      preferred_contact_channel: preferred_contact_channel,
      products: products,
      working_days: working_days,
      available_from: available_from,
      available_to: available_to,
      status_id: status_id,
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _updateBankContacts(bankContactId, payload)) {
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
    (description) => {
      headerProperties.value.breadcrumbs[4].label = description
        ? `${description.charAt(0).toUpperCase()}${description
            .slice(1)
            .toLowerCase()}`
        : ''
    },
    { immediate: true }
  )

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdBankContacts(bankContactId)
    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setDataBasicBankContacts(null)
  })

  return {
    headerProperties,
    activeTab,
    tabs,
    tabActiveIdx,
    tabActive,
    bank_contacts_request,
    bankingEntitieId,
    BankContactsBasicDataRef,
    onSubmit,
    handlerGoTo,
  }
}

export default useBankContactsEdit
