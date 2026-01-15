// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { usePaymentBlocksStore } from '@/stores/accounts-payable/payment-blocks'
import { IPaymentBlockForm } from '@/interfaces/customs/accounts-payable/PaymentBlocks'

const usePaymentBlocksEdit = () => {
  // hooks
  const route = useRoute()
  const id = +route.params.id
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
  const { _getPaymentBlockById, _updatePaymentBlock } =
    usePaymentBlocksStore('v1')

  // configs
  const headerProps = {
    title: 'Editar bloque de pago',
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
        label: 'Editar',
        route: 'PaymentBlocksEdit',
      },
      {
        label: `${id}`,
        route: '',
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
  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!payment_block_form.value) return

    openMainLoader(true)
    if (await _updatePaymentBlock(payment_block_form.value, id)) {
      goToURL('PaymentBlocksList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    payment_block_form.value = await _getPaymentBlockById(id)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

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
    handleEdit,
    goToURL,
  }
}

export default usePaymentBlocksEdit
