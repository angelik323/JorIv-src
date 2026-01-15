//Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

//Composables
import { useMainLoader } from '@/composables'
import { useGoToUrl } from '@/composables/useGoToUrl'
import { useUtils } from '@/composables/useUtils'

//Interfaces
import { ITabs } from '@/interfaces/global'

//Stores
import { useAccountingRestatementStore } from '@/stores/accounting/accounting-restatement'
import { useAccountingResourceStore, useResourceManagerStore } from '@/stores'
import {
  IExchangedDifferenceRestatementDataForm,
  IExchangeDifferenceRestatementVoucherProcess,
} from '@/interfaces/customs/accounting/AccountingRestatement'

const useExchangeDifferenceRestatementCreate = () => {
  //Form ref for validate
  const informationFormRef = ref()

  //Desestructuring stores and refs
  const { headerPropsDefault } = storeToRefs(
    useAccountingRestatementStore('v2')
  )
  const { _generateVouchersExchangeDifferenceRestatement } =
    useAccountingRestatementStore('v2')
  const { sub_receipt_types } = storeToRefs(useAccountingResourceStore('v1'))

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
    title: 'Procesar reexpresión por diferencia en cambio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Reexpresar',
        route: 'ExchangeDifferenceRestatementCreate',
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
  //Modal ref and config
  const modalRef = ref()
  const alertModalConfig = ref({
    title: '¿Desea reexpresar el comprobante contable?',
    description:
      'Relacione el tipo de comprobante a generar para el ajuste contable por diferencia de cambio',
    id: null as number | null,
  })

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

  // Prepare data request for payload
  const makeDataRequest = (): IExchangeDifferenceRestatementVoucherProcess => {
    return {
      restatement_ids:
        basic_data_form.value?.voucher_data?.restatement_ids ?? [],
      sub_receipt_type_id: subReceiptRef.value ?? 0,
    }
  }

  // Validate forms before submit
  const validateForms = async () => {
    let valid = false
    const forms = [informationFormRef]

    if (tabActiveIdx.value >= 0 && tabActiveIdx.value < forms.length) {
      try {
        valid =
          (await forms[tabActiveIdx.value]?.value?.validateForm()) ?? false
      } catch {
        valid = false
      }
    }
    return valid
  }

  // Submit handler
  const onSubmit = async () => {
    if (!(await validateForms())) return
    openMainLoader(true)
    const payload = makeDataRequest()
    const exchangeDifference =
      await _generateVouchersExchangeDifferenceRestatement(payload)
    if (exchangeDifference) {
      modalRef.value = false
      goToURL('AccountingRestatementList')
    }
    openMainLoader(false)
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

  onBeforeUnmount(() => {
    _resetKeys(keysAccounting)
  })

  return {
    headerProperties,

    //Tabs properties
    tabs,
    tabActive,
    tabActiveIdx,

    //Modals properties
    modalRef,
    alertModalConfig,
    sub_receipt_types,

    //Form properties and methods
    basic_data_form,
    subReceiptRef,
    informationFormRef,
    onSubmit,

    //Navigate
    goToURL,
  }
}
export default useExchangeDifferenceRestatementCreate
