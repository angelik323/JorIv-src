import { useBankContactsStore, useBankingEntitiesStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'
import { ref, onBeforeMount, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'

const useBankingEntitiesView = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const bankingEntitieId = +route.params.id
  const { bank_receipt_request } = storeToRefs(useBankingEntitiesStore('v1'))
  const { bankingEntitieContactsId } = storeToRefs(useBankContactsStore('v1'))
  bankingEntitieContactsId.value = +route.params.id
  const {
    _setDataBasicBankingEntitie,
    _getByIdBankingEntities,
    _setBankReceiptRequest,
  } = useBankingEntitiesStore('v1')

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
    title: 'Ver entidad bancaria',
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
    ],
  })

  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === activeTab.value)
  )
  const tabActive = ref(tabs.value[0].name)

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
    _setDataBasicBankingEntitie(null)
    _setBankReceiptRequest(null)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdBankingEntities(bankingEntitieId)
    openMainLoader(false)
  })

  watch(
    () => bank_receipt_request.value?.id,
    (id) => {
      headerProperties.value.breadcrumbs[4].label = id ? `${id}` : ''
    },
    { immediate: true }
  )
  return {
    tabs,
    activeTab,
    headerProperties,
    tabActiveIdx,
    bank_receipt_request,
    tabActive,
    handlerGoTo,
  }
}

export default useBankingEntitiesView
