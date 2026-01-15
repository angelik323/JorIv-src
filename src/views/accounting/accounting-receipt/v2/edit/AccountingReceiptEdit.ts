// vue - router - pinia - quasar
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// interfaces
import { ITabs } from '@/interfaces/global'

// composables - utils
import { useMainLoader } from '@/composables'
import { defaultIcons } from '@/utils'

// stores
import { useAccountingReceiptsStore, useResourceManagerStore } from '@/stores'

const useAccountingReceiptEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const accountingReceiptId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { _updateAccountingReceipt } = useAccountingReceiptsStore('v2')
  const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v2'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    accounting: ['business_trust', 'third_parties', 'voucher_natures'],
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
        route: '',
      },
      {
        label: 'Editar',
        route: '',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIcons.bulletList,
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
        router.push({ name: 'AccountingReceiptList' })
      }

      setTimeout(() => {
        openMainLoader(false)
      }, 1000)
    }
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)
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
  }
}

export default useAccountingReceiptEdit
