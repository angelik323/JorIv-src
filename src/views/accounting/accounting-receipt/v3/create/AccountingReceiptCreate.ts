// vue
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// interfaces
import { ITabs } from '@/interfaces/global'

// composables - utils
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingReceiptsStore } from '@/stores/accounting/accounting-receipt'

const useAccountingReceiptCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()
  const { _createAccountingReceipt } = useAccountingReceiptsStore('v2')
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounting: ['third_parties', 'voucher_natures'],
  }
  const keysV2 = {
    accounting: ['receipt_types_manual_without_cancellation_subtypes'],
  }
  const accountingReceiptForm = ref()

  const headerProps = {
    title: 'Crear comprobante contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Contabilidad',
        route: '',
      },
      {
        label: 'Comprobantes contables',
        route: 'AccountingReceiptList',
      },
      {
        label: 'Crear',
        route: 'AccountingReceiptCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const validateForms = async () => {
    return accountingReceiptForm?.value?.validateForm()
  }

  const onSubmit = async () => {
    if (await validateForms()) {
      openMainLoader(true)
      const dataAccountingReceiptForm =
        accountingReceiptForm.value.getFormData()
      const payload = dataAccountingReceiptForm
      if (await _createAccountingReceipt(payload)) {
        goToURL('AccountingReceiptList')
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)
    await _getResources(
      { accounting: ['business_trust'] },
      'filter[has_consolidator]=false'
    )
    await _getResources(keysV2, '', 'v2')

    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    accountingReceiptForm,
    onSubmit,
    goToURL,
  }
}

export default useAccountingReceiptCreate
