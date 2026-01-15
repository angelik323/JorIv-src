//Vue - Pinia
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

//Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

//Interfaces
import { ITabs } from '@/interfaces/global'
import { IExchangedDifferenceRestatementDataForm } from '@/interfaces/customs/accounting/AccountingRestatement'

//Stores
import { useAccountingRestatementStore } from '@/stores/accounting/accounting-restatement'

const useExchangeDifferenceRestatementDetail = () => {
  //Form ref for validate
  const informationFormRef = ref()

  //Desestructuring stores and refs
  const { headerPropsDefault, reexpresion_difference_response } = storeToRefs(
    useAccountingRestatementStore('v2')
  )

  //Route for request
  const route = useRoute()
  const paramsRoute = route.params.id

  // Store and methods
  const { _getExchangeDifferencerRestatementNews } =
    useAccountingRestatementStore('v2')

  // Ref for modal
  const subReceiptRef = ref<number>(0)

  //Utils and functions
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // Resource manager store

  // Data form ref
  const basic_data_form = ref<IExchangedDifferenceRestatementDataForm | null>(
    null
  )

  //Header for the page
  const headerProperties = {
    title: 'Ver novedades reexpresión por diferencia en cambio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver novedades',
        route: 'ExchangeDifferenceRestatementDetail',
      },
      {
        label: String(paramsRoute),
        route: '',
      },
    ],
  }

  //Tabs and properties
  const tabs = ref<ITabs[]>([
    {
      name: 'information_form',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ])
  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const setFormView = (data: IExchangedDifferenceRestatementDataForm) => {
    basic_data_form.value = {
      view_data: { ...(data as Record<string, unknown>) },
    }
  }

  // Fetch data on mount
  onMounted(async () => {
    openMainLoader(true)
    await _getExchangeDifferencerRestatementNews(Number(paramsRoute))
    openMainLoader(false)
  })

  // watcher for response data
  watch(
    () => reexpresion_difference_response.value,
    (val) => {
      if (!val) return
      setFormView(val)
    }
  )

  return {
    headerProperties,

    //Tabs properties
    tabs,
    tabActive,
    tabActiveIdx,

    //Form properties and methods
    basic_data_form,
    subReceiptRef,
    informationFormRef,

    //Navigate
    goToURL,
  }
}
export default useExchangeDifferenceRestatementDetail
