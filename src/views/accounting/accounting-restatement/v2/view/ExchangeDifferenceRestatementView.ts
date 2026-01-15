//Vue - Pinia
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
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
import { useResourceManagerStore } from '@/stores'

const useExchangeDifferenceRestatementView = () => {
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
  const {
    _getExchangeDifferenceRestatementProcessList,
    _getExchangeDifferenceRestatementListVouchers,
  } = useAccountingRestatementStore('v2')

  // Ref for modal
  const subReceiptRef = ref<number>(0)

  //Utils and functions
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // Resource manager store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  // Data form ref
  const basic_data_form = ref<IExchangedDifferenceRestatementDataForm | null>(
    null
  )

  //Header for the page
  const headerProperties = {
    title: 'Ver reexpresión por diferencia en cambio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Ver',
        route: 'ExchangeDifferenceRestatementCreate',
      },
      {
        label: String(paramsRoute),
        route: '',
      },
    ],
  }

  //Keys constant
  const keysAccounting = {
    accounting: [
      'account_structures&filter[status_id]=1&filter[type]=Catálogo de cuentas contables',
    ],
    investment_portfolio: ['coins'],
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
      process_data: { ...(data.process as Record<string, unknown>) },
    }
  }
  // Lifecycle hooks for keys management
  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keysAccounting)
    await _getResources(
      {
        accounting: ['status_by_id&filter[ids]=84,85,86'],
      },
      '',
      'v2'
    )
    await _getResources(
      {
        accounting: [
          'sub_receipt_types&filter[is_cancellation]=false&filter[voucher_type]=Automático',
        ],
      },
      '',
      'v2'
    )
    openMainLoader(false)
  })

  // Fetch data on mount
  onMounted(async () => {
    openMainLoader(true)
    await _getExchangeDifferenceRestatementProcessList(Number(paramsRoute), {})
    await _getExchangeDifferenceRestatementListVouchers(Number(paramsRoute))
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysAccounting)
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
export default useExchangeDifferenceRestatementView
