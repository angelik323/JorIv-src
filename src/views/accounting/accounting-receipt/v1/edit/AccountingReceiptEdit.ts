import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAccountingReceiptsStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useAccountingReceiptEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const accountingReceiptId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { _updateAccountingReceipt } = useAccountingReceiptsStore('v1')
  const { accounting_receipt } = storeToRefs(useAccountingReceiptsStore('v1'))

  const accountingReceiptForm = ref()

  const headerProps = {
    title: 'Editar comprobante contable',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: '',
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
      {
        label: `${accountingReceiptId}`,
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
