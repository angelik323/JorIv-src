// Vue - Pinia
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTerritorialTaxesStoreV1 } from '@/stores/accounts-payable/territorial-taxes/territorial-taxes-v1'

const useTerritorialTaxesCreate = () => {
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    third_party: ['cities'],
  }

  const keysSettlementConcept = {
    accounts_payable: ['settlement_concept'],
  }

  const keysThirdParty = {
    third_party: ['third_parties'],
  }

  const headerProps = {
    title: 'Crear impuestos territoriales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas Por Pagar', route: '' },
      { label: 'Impuestos territoriales', route: 'TerritorialTaxesList' },
      { label: 'Crear', route: 'TerritorialTaxesCreate' },
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

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(0)

  const basicDataFormRef = ref<{
    validateForm: () => Promise<boolean> | boolean
  } | null>(null)

  const ttStore = useTerritorialTaxesStoreV1()
  const { territorial_taxes_form } = storeToRefs(ttStore)
  const { _createTerritorialTax } = ttStore

  const handleCreate = async () => {
    const ok = await basicDataFormRef.value?.validateForm?.()
    if (!ok) return
    if (!territorial_taxes_form.value) return

    const success = await _createTerritorialTax(territorial_taxes_form.value)
    if (success) goToURL('TerritorialTaxesList')
  }

  onMounted(async () => {
    await _getResources(keys)
    await _getResources(keysSettlementConcept, 'filter[class]=ITE')
    await _getResources(
      keysThirdParty,
      'include[]=legalPerson&include[]=naturalPerson&fields[third_parties]=id,document,validator_digit,status_id,third_party_type,document_type_id&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name'
    )
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys(keysSettlementConcept)
    _resetKeys(keysThirdParty)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    handleCreate,
    goToURL,
    defaultIconsLucide,
  }
}

export default useTerritorialTaxesCreate