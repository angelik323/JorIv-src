import { onBeforeMount, ref, watch } from 'vue'

import { useMainLoader } from '@/composables'
import { useBankContactsStore, useBankingEntitiesStore } from '@/stores'
import { useRoute } from 'vue-router'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'

const useBankContactsView = () => {
  const route = useRoute()
  const { bank_contacts_request } = storeToRefs(useBankContactsStore('v1'))
  const { openMainLoader } = useMainLoader()
  const { _getByIdBankContacts } = useBankContactsStore('v1')
  const { bank_receipt_request } = storeToRefs(useBankingEntitiesStore('v1'))
  const bankBrancheId = +route.params.id
  const bankingEntitieId = bank_contacts_request.value?.bank_id ?? 0

  const headerProperties = ref({
    title: 'Ver contacto bancario',
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

    await _getByIdBankContacts(bankBrancheId)
    openMainLoader(false)
  })

  return {
    headerProperties,
    activeTab,
    tabs,
    tabActiveIdx,
    tabActive,
    bank_contacts_request,
    bankingEntitieId,
  }
}

export default useBankContactsView
