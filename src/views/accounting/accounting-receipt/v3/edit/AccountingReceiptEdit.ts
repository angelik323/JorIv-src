// vue  - pinia - quasar
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global'

// composables - utils
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingReceiptsStore } from '@/stores/accounting/accounting-receipt'

const useAccountingReceiptEdit = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const route = useRoute()

  const accountingReceiptId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { _updateAccountingReceipt } = useAccountingReceiptsStore('v2')
  const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v2'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounting: ['third_parties', 'voucher_natures'],
  }
  const keysV2 = {
    accounting: ['receipt_types_manual_without_cancellation_subtypes'],
  }
  const accountingReceiptForm = ref()

  const headerProps = {
    title: 'Editar comprobante contable',
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
        label: 'Editar',
        route: 'AccountingReceiptEdit',
      },
      {
        label: `${accountingReceiptId}`,
        route: '',
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
      const payload = accountingReceiptForm.value.getFormData()
      if (await _updateAccountingReceipt(accountingReceiptId, payload)) {
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
    accountingReceiptId,
    accounting_receipt,
    onSubmit,
    goToURL,
  }
}

export default useAccountingReceiptEdit
