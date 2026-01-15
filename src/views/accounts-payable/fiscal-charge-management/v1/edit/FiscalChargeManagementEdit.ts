// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { IFiscalChargeManagementForm } from '@/interfaces/customs/accounts-payable/FiscalChargeManagement'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiscalChargeManagementStore } from '@/stores/accounts-payable/fiscal-charge-management'
import { useResourceManagerStore } from '@/stores'

export const useFiscalChargeManagementEdit = () => {
  const { goToURL } = useGoToUrl()
  const route = useRoute()
  const FiscalChargeManagementId = +route.params.id

  const { defaultIconsLucide } = useUtils()

  const { openMainLoader } = useMainLoader()

  const { _getFiscalChargeManagementById, _updateFiscalChargeManagement } =
    useFiscalChargeManagementStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const basicDataFormRef = ref()

  const basic_data_form = ref<IFiscalChargeManagementForm | null>(null)

  const headerProps = {
    title: 'Editar cargo fiscal',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Cuentas por pagar', route: '' },
      {
        label: 'Gestión de cargo fiscal',
        route: 'FiscalChargeManagementList',
      },
      {
        label: 'Editar',
        route: 'FiscalChargeManagementEdit',
      },
      {
        label: `${FiscalChargeManagementId}`,
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

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return
    if (!basic_data_form.value) return
    openMainLoader(true)
    const payload = { ...basic_data_form.value }
    if (
      await _updateFiscalChargeManagement(payload, FiscalChargeManagementId)
    ) {
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

  const setEditData = async () => {
    const data = await _getFiscalChargeManagementById(FiscalChargeManagementId)
    if (data) {
      basic_data_form.value = {
        code: data.code ?? '',
        name: data.name ?? '',
        tax_type_id: data.tax_type.id ?? null,
        tax_nature_id: data.tax_nature.id ?? null,
        revenue_beneficiary_entity_id:
          data.revenue_beneficiary_entity.id ?? null,
        status_id: data.status.id,
      }
    }
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys, 'sort=id')
    await setEditData()
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    basicDataFormRef,
    basic_data_form,
    handleEdit,
    goToURL,
  }
}

export default useFiscalChargeManagementEdit
