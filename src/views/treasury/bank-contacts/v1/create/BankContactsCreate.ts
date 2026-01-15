import { onUnmounted, ref, watch } from 'vue'
import { defaultIcons } from '@/utils'
import { useRouter, useRoute } from 'vue-router'
import { useBankContactsStore, useBankingEntitiesStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { useMainLoader } from '@/composables'

const useBankContactsCreate = () => {
  const BankContactsBasicDataRef = ref()
  const router = useRouter()
  const route = useRoute()
  const { _setDataBasicBankContacts, _createBankContacts } =
    useBankContactsStore('v1')
  const { bank_receipt_request } = storeToRefs(useBankingEntitiesStore('v1'))
  const { data_information_form_contacts, bank_contacts_request } = storeToRefs(
    useBankContactsStore('v1')
  )
  const bankBrancheId = +route.params.bank
  const bankingEntitieId = bank_contacts_request.value?.bank_id ?? 0

  const { openMainLoader } = useMainLoader()

  const headerProperties = ref({
    title: 'Crear contacto bancario',
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
        label: 'Crear contacto bancario',
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

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )

  const handlerGoTo = (goURL: string, bankingEntitieId: number) => {
    router.push({ name: goURL, params: { id: bankingEntitieId } })
  }

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
    } = data_information_form_contacts.value ?? {}

    return {
      bank_id: bankBrancheId,
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
    }
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()
      if (await _createBankContacts(payload)) {
        handlerGoTo('BankingEntitiesView', bankBrancheId)
      }
      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
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

  onUnmounted(async () => {
    _setDataBasicBankContacts(null)
  })

  return {
    headerProperties,
    tabs,
    tabActiveIdx,
    activeTab,
    BankContactsBasicDataRef,
    bankBrancheId,
    bankingEntitieId,
    onSubmit,
  }
}
export default useBankContactsCreate
