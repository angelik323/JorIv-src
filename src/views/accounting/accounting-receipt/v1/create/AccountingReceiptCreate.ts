import { useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { useAccountingReceiptsStore } from '@/stores'
import { defaultIcons } from '@/utils'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const useAccountingReceiptCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _createAccountingReceipt } = useAccountingReceiptsStore('v1')

  const accountingReceiptForm = ref()

  const headerProps = {
    title: 'Crear comprobante contable',
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
        label: 'Crear',
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
      if (await _createAccountingReceipt(payload)) {
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
    onSubmit,
  }
}

export default useAccountingReceiptCreate
