// Vue - Pinia - Router
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTerritorialTaxesStoreV1 } from '@/stores/accounts-payable/territorial-taxes/territorial-taxes-v1'

const useTerritorialTaxesEdit = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const TerritorialTaxId = Number(route.params.id)

  const { defaultIconsLucide } = useUtils()
  const { openMainLoader } = useMainLoader()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    third_party: ['cities'],
    accounts_payable: ['ica_activity_statuses'],
  }

  const keysSettlementConcept = {
    accounts_payable: ['settlement_concept'],
  }

  const keysThirdParty = {
    third_party: ['third_parties'],
  }

  const ttStore = useTerritorialTaxesStoreV1()
  const { territorial_taxes_form, territorial_taxes_response } =
    storeToRefs(ttStore)
  const { _getTerritorialTaxById, _updateTerritorialTax } = ttStore

  const basicDataFormRef = ref<{
    validateForm: () => Promise<boolean> | boolean
  } | null>(null)

  const headerProps = {
    title: 'Editar impuestos territoriales',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      { label: 'Impuestos territoriales', route: 'TerritorialTaxesList' },
      { label: 'Editar', route: 'TerritorialTaxesEdit' },
      { label: `${TerritorialTaxId}` },
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
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm?.()
    if (!isValid) return
    if (!territorial_taxes_form.value) return

    openMainLoader(true)
    const payload = { ...territorial_taxes_form.value }
    const ok = await _updateTerritorialTax(payload, TerritorialTaxId)
    if (ok) {
      goToURL('TerritorialTaxesList')
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)

    await _getResources(keys)
    await _getResources(keysSettlementConcept, 'filter[class]=ITE')
    await _getResources(
      keysThirdParty,
      'include[]=legalPerson&include[]=naturalPerson&fields[third_parties]=id,document,validator_digit,status_id,third_party_type,document_type_id&fields[legal_people]=third_party_id,id,business_name&fields[natural_people]=third_party_id,id,name,middle_name,last_name,second_last_name'
    )

    await _getTerritorialTaxById(TerritorialTaxId)

    openMainLoader(false)
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
    territorial_taxes_response,
    handleEdit,
    goToURL,
    defaultIconsLucide,
  }
}

export default useTerritorialTaxesEdit