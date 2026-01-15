// Vue - pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IGuaranteeOperationPayload } from '@/interfaces/customs/investment-portfolio/GuaranteeOperations'

// Composables
import { useAlert, useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useGuaranteeOperationsStore } from '@/stores/investment-portfolio/guarantee-operations'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useMarginCallCreate = () => {
  const { showAlert } = useAlert()
  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { headerPropsDefault } = storeToRefs(useGuaranteeOperationsStore('v1'))
  const { _createGuaranteeOperation } = useGuaranteeOperationsStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProperties = {
    ...headerPropsDefault.value,
    title: 'Crear llamado al margen',
    breadcrumbs: [
      ...headerPropsDefault.value.breadcrumbs,
      {
        label: 'Crear llamado al margen',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const basicDataFormRef = ref()

  const tabActive = ref('')
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    if (tabActive.value === 'basic_data') {
      return await basicDataFormRef.value?.validateForm()
    }

    return true
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    const data_basic_data =
      basicDataFormRef.value?.getValues() as IGuaranteeOperationPayload

    if (!data_basic_data.money_market_transaction_record_id) {
      showAlert(
        'Debes seleccionar una operación de mercado monetario',
        'warning'
      )
      return
    } else if (!data_basic_data.title_guarantee_new_id) {
      showAlert('Debes seleccionar un título de garantía', 'warning')
      return
    }

    const payload = {
      position: data_basic_data.position!,
      money_market_transaction_record_id:
        data_basic_data.money_market_transaction_record_id,
      operation: data_basic_data.operation!,
      title_guarantee_new_id: data_basic_data.title_guarantee_new_id,
      type_guarantee_operation: 'Llamado al margen',
    }

    openMainLoader(true)
    if (await _createGuaranteeOperation(payload)) {
      goToURL('GuaranteeOperationsList')
    }
    openMainLoader(false)
  }

  const keys = {
    investment_portfolio: [
      'list_investment_portfolios_associated_trader',
      'type_of_operation',
      'options_positions_list',
    ],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    tabActive.value = tabs.value[0].name
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProperties,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    goToURL,
    onSubmit,
  }
}

export default useMarginCallCreate
