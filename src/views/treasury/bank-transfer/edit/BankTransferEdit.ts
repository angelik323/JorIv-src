// vur
import { computed, onMounted, ref } from 'vue'

// store
import { useResourceStore } from '@/stores'

// composables
import { useGoToUrl, useMainLoader } from '@/composables'

// utils
import { defaultIconsLucide } from '@/utils'

// interfaces
import { ITabs } from '@/interfaces/global'

const useBankTransferEdit = () => {
  const { _getResourcesTreasuries, _getResourcesFics } = useResourceStore('v1')
  const { getUrlId } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const keyBusinessName = ref<string>('keys[]=business_trust')
  const keyMovements = ref<string>('keys[]=movements')
  const keyBanks = ref<string>('keys[]=banks')
  const keyBankAccounts = ref<string>('keys[]=bank_account')

  const keyCollectionTypes = ref<string>('keys[]=payments')
  const keyForeignCurrencies = ref<string>('keys[]=cash_flow_structure_egreso')

  const keyCoinType = ref<string>('keys[]=coin_type')
  const keyFunds = ref<string>('keys[]=funds')

  const gettreasuriesURL = computed(
    () =>
      `${keyBusinessName.value}&${keyBanks.value}&${keyBankAccounts.value}&${keyCollectionTypes.value}&${keyForeignCurrencies.value}&${keyCoinType.value}`
  )
  const getFicsURL = computed(() => `${keyFunds.value}&${keyMovements.value}`)

  const { goToURL } = useGoToUrl()
  const headerBreadcrumbs = {
    title: 'Editar traslado bancario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: '',
      },
      {
        label: 'Traslados bancarios',
        route: 'BankTransferList',
      },
      {
        label: 'Editar',
        route: '',
      },

      {
        label: String(getUrlId.value),
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

  onMounted(async () => {
    openMainLoader(true)

    await _getResourcesTreasuries(gettreasuriesURL.value)
    await _getResourcesFics(getFicsURL.value)
    openMainLoader(false)
  })

  return {
    headerBreadcrumbs,
    goToURL,
    tabActive,
    filteredTabs,
    tabActiveIdx,
  }
}

export default useBankTransferEdit
