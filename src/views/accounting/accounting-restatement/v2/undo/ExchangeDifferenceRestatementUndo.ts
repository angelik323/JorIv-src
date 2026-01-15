//Vue - Pinia
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'

//Composables
import { useMainLoader } from '@/composables'
import { useUtils } from '@/composables/useUtils'
import { useGoToUrl } from '@/composables/useGoToUrl'

//Interfaces
import { ITabs } from '@/interfaces/global'

//Stores
import { useAccountingRestatementStore } from '@/stores/accounting/accounting-restatement'
import { useResourceManagerStore } from '@/stores'
import {
  IExchangedDifferenceRestatementDataForm,
  IExchangeDifferenceRestatementUndoProcess,
} from '@/interfaces/customs/accounting/AccountingRestatement'

const useExchangeDifferenceRestatementUndo = () => {
  //Form ref for validate
  const informationFormRef = ref()

  const { headerPropsDefault } = storeToRefs(
    useAccountingRestatementStore('v2')
  )
  const changeUndoProcess = ref<number | null>(null)
  // Utils and functions
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  // Resource manager store
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _generateUndoProcessExchangeDifferenceRestatement } =
    useAccountingRestatementStore('v2')
  const basic_data_form = ref<IExchangedDifferenceRestatementDataForm | null>(
    null
  )

  // Ref for modal
  const modalRef = ref()
  const alertModalConfig = ref({
    title:
      '¿Desea deshacer el proceso de reexpresión por diferencia en cambio?',
    id: null as number | null,
  })

  // keys for resources manager
  const keysAccounting = {
    accounting: [
      'account_structures&filter[status_id]=1&filter[type]=Catálogo de cuentas contables',
    ],
    investment_portfolio: ['coins'],
  }

  //Header for the page
  const headerProperties = {
    title: 'Deshacer reexpresión por diferencia en cambio',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Deshacer',
        route: 'ExchangeDifferenceRestatementUndo',
      },
    ],
  }

  // Tabs for the page
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

  // Make data request
  const makeDataRequest = (): IExchangeDifferenceRestatementUndoProcess => {
    if (changeUndoProcess.value) {
      return {
        ids: basic_data_form.value?.undo_data?.ids || [],
        process_id: changeUndoProcess.value,
      }
    }
    return {
      ids: basic_data_form.value?.undo_data?.ids || [],
      filter: {
        period: basic_data_form.value?.undo_data?.filter?.period ?? '',
        structure_id:
          basic_data_form.value?.undo_data?.filter?.structure_id ?? 0,
        from_business:
          basic_data_form.value?.undo_data?.filter?.from_business ?? '',
        to_business:
          basic_data_form.value?.undo_data?.filter?.to_business ?? '',
        undo_date: basic_data_form.value?.undo_data?.filter?.undo_date ?? '',
        closing_type:
          basic_data_form.value?.undo_data?.filter?.closing_type ?? '',
      },
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
    const exchangeDifferenceUndo =
      await _generateUndoProcessExchangeDifferenceRestatement(payload)
    if (exchangeDifferenceUndo) {
      goToURL('ExchangeDifferenceRestatementList')
      modalRef.value?.close()
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
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keysAccounting)
    _resetKeys({
      accounting: ['status_by_id&filter[ids]=84,85,86'],
      investment_portfolio: ['coins'],
    })
  })

  return {
    // header and tabs properties
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,

    //ref for change undo process
    changeUndoProcess,

    //modal config and ref
    modalRef,
    alertModalConfig,

    // form prop and reference
    basic_data_form,
    informationFormRef,

    // methods
    onSubmit,
    goToURL,
  }
}
export default useExchangeDifferenceRestatementUndo
