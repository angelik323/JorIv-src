import { ref, onMounted, onBeforeUnmount } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { IFiduciaryBusinessCommissionsFormV2 } from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryBusinessCommissionsCreate = () => {
  const { _createFiduciaryBusinessCommissions } =
    useFiduciaryBusinessCommissionsStore('v2')

  // Data de formularios
  const basic_data_form = ref<IFiduciaryBusinessCommissionsFormV2 | null>(null)

  // Referencias a formularios
  const basicDataFormRef = ref()

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear comisión de negocio fiduciario',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Comisiones de negocios fiduciarios',
        route: 'FiduciaryBusinessCommissionsList',
      },
      {
        label: 'Crear',
        route: 'FiduciaryBusinessCommissionsCreate',
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: true,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  // Datos básicos form
  const makeBaseInfoRequest = (
    data: IFiduciaryBusinessCommissionsFormV2 | null
  ) => {
    if (!data) return {}
    const request: Partial<IFiduciaryBusinessCommissionsFormV2> = {
      business_id: data.business_id ?? null,
      commission_type_id: data.commission_type_id ?? null,
      billing_trust_id: data.billing_trust_id ?? null,
      third_party_billings_id: data.third_party_billings_id ?? null,
      accounting_parameters_id: data.accounting_parameters_id ?? null,
      business_code: data.business_trust_id ?? null,
      colllection: data.colllection ?? null,
      observation: data.observation ?? null,
      description: data.description ?? null,

      calculation_type: data.calculation_type ?? null,
      minimum_wage_amount: data.minimum_wage_amount ?? null,
      count_salaries: data.count_salaries ?? null,
      base_commission_amount: data.base_commission_amount ?? null,
      fixed_value: data.fixed_value ?? null,
      commission_percentage: data.commission_percentage ?? null,
      commission_transaction: data.commission_transaction ?? null,
      count_transaction: data.count_transaction ?? null,
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<IFiduciaryBusinessCommissionsFormV2> = {
      ...makeBaseInfoRequest(basic_data_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    return (await basicDataFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createFiduciaryBusinessCommissions(payload)
    if (success) {
      goToURL('BusinessTrustCommissionsList')
    }
    openMainLoader(false)
  }

  const keys = {
    settlement_commissions: ['commission_types', 'calculation_bases'],
  }

  const keysBusinessToClear = {
    trust_business: ['business_trusts'],
    settlement_commissions: ['commission_types', 'calculation_bases'],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getResources(
      {
        trust_business: ['business_trusts'],
      },
      'filter[status_id]=59,57'
    )
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _resetKeys(keysBusinessToClear)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default useFiduciaryBusinessCommissionsCreate
