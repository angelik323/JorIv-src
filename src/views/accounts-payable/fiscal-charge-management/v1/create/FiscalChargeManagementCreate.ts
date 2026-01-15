// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Interfaces
import { IFiscalChargeManagementForm } from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'
import { ITabs } from '@/interfaces/global/Tabs'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiscalChargeManagementStore } from '@/stores/accounts-payable/fiscal-charge-management'
import { useResourceManagerStore } from '@/stores/resources-manager'

export const useFiscalChargeManagementCreate = () => {
  const { goToURL } = useGoToUrl()
  const { openMainLoader } = useMainLoader()

  const { defaultIconsLucide } = useUtils()

  const { _createFiscalChargeManagement } = useFiscalChargeManagementStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()

  const basic_data_form = ref<IFiscalChargeManagementForm | null>(null)

  const headerProps = {
    title: 'Crear cargo fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Gestión de cargo fiscal',
        route: 'FiscalChargeManagementList',
      },
      {
        label: 'Crear',
        route: 'FiscalChargeManagementCreate',
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

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (await _createFiscalChargeManagement(payload)) {
      goToURL('FiscalChargeManagementList')
    }
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  const keys = {
    accounts_payable: [
      'tax_types',
      'tax_natures',
      'revenue_beneficiary_entities',
    ],
  }

  onMounted(() => {
    _getResources(keys, 'sort=id')
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleCreate,
    goToURL,
  }
}

export default useFiscalChargeManagementCreate
