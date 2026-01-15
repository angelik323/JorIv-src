import { storeToRefs } from 'pinia'
import { ITabs } from '@/interfaces/global'
import { onBeforeMount, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBankingAccountsStore } from '@/stores'
import { useMainLoader, useUtils } from '@/composables'

const useBankingAccountsView = () => {
  const route = useRoute()
  const router = useRouter()
  const {
    data_information_form,
    information_receipt_request,
    performance_receipt_request,
    restatement_receipt_request,
  } = storeToRefs(useBankingAccountsStore('v1'))
  const { _getByIdBankingAccounts } = useBankingAccountsStore('v1')
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide } = useUtils()

  const bankingEntitieId = +route.params.id

  const formInformation = ref()
  const formPerformance = ref()
  const formRestatement = ref()

  const headerProperties = {
    title: 'Ver cuenta bancaria',
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
        label: 'Cuentas bancarias',
        route: 'BankingAccountsList',
      },
      {
        label: 'Ver',
        route: 'BankingAccountsView',
      },
      {
        label: `${bankingEntitieId}`,
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
      required: true,
    },
    {
      name: 'performance',
      label: 'Rendimientos y Tasas',
      icon: defaultIconsLucide.dollarSign,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
    {
      name: 'restatement',
      label: 'Reexpresión',
      icon: defaultIconsLucide.chartLine,
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

  const nextTab = async () => {
    tabActiveIdx.value++
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const backTab = () => {
    tabActiveIdx.value--
    tabActive.value = tabs.value[tabActiveIdx.value].name
  }

  const onSubmit = async () => {
    router.push({ name: 'BankingAccountsList' })
  }

  const handlerGoTo = (goURL: string) => {
    router.push({ name: goURL })
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    await _getByIdBankingAccounts(bankingEntitieId)
    openMainLoader(false)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    formInformation,
    formPerformance,
    formRestatement,
    data_information_form,
    information_receipt_request,
    performance_receipt_request,
    restatement_receipt_request,

    nextTab,
    backTab,
    onSubmit,
    handlerGoTo,
  }
}

export default useBankingAccountsView
