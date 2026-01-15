// core
import { onBeforeUnmount, onMounted, ref } from 'vue'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { usePaymentBlocksStore } from '@/stores/accounts-payable/payment-blocks'
import { IPaymentBlockForm } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

const usePaymentBlocksCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // refs
  const keysV2 = ref({
    accounting: ['budget_structures_generate'],
  })
  const keysParams = ref({
    accounting: ['account_structures'],
  })
  const basicDataFormRef = ref()
  const payment_block_form = ref<IPaymentBlockForm | null>()

  // stores
  const accountingStore = useAccountingResourceStore('v1')
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createPaymentBlock } = usePaymentBlocksStore('v1')

  // configs
  const headerProps = {
    title: 'Crear bloque de pago',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Bloques de pago',
        route: 'PaymentBlocksList',
      },
      {
        label: 'Crear',
        route: 'PaymentBlocksCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // actions
  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!payment_block_form.value) return

    openMainLoader(true)
    if (await _createPaymentBlock(payment_block_form.value)) {
      goToURL('PaymentBlocksList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keysV2.value, '', 'v2')
    await _getResources(
      keysParams.value,
      'filter[type]=Catálogo de cuentas contables&filter[status_id]=1'
    )
    accountingStore.account_structures_accounting_concepts = [
      ...accountingStore.account_structures_payment_concepts,
    ]
    await _getResources(
      keysParams.value,
      'filter[type]=Catálogo de conceptos pago&filter[status_id]=1'
    )
  })

  onBeforeUnmount(() => _resetKeys(keysParams.value))

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    payment_block_form,

    // methods
    handleCreate,
    goToURL,
  }
}

export default usePaymentBlocksCreate
