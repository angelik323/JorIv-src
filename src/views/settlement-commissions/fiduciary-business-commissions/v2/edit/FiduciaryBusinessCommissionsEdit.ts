import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import {
  IFiduciaryBusinessCommissionsFormV2,
  IFiduciaryBusinessCommissionsResponseV2,
} from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'
import { ITabs } from '@/interfaces/global'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useFiduciaryBusinessCommissionsEdit = () => {
  const {
    _updateRFiduciaryBusinessCommissions,
    _getByIdFiduciaryBusinessCommissions,
  } = useFiduciaryBusinessCommissionsStore('v2')

  const basic_data_form = ref<IFiduciaryBusinessCommissionsFormV2 | null>(null)
  const initial_basic_data_form = ref<IFiduciaryBusinessCommissionsFormV2 | null>(
    null
  )

  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Editar comisión de negocios fiduciarios',
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
        label: 'Editar',
        route: 'FiduciaryBusinessCommissionsEdit',
      },
      {
        label: `${searchId}`,
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

  const setFormEdit = (data: IFiduciaryBusinessCommissionsResponseV2) => {
    const form = {
      business_id: data.business_trust_commission.business_id ?? null,
      commission_type_id: data.business_trust_commission.commission_type_id ?? null,
      billing_trust_id: data.business_trust_commission.billing_trust_id ?? null,
      third_party_billings_id: data.business_trust_commission.third_party_billings_id ?? null,
      accounting_parameters_id: data.relationships.accounting_parameters?.id ?? null,
      business_code: data.business_trust_commission.business_id ?? null,
      colllection: data.business_trust_commission.collection ?? null,
      observation: data.business_trust_commission.observation ?? null,
      description: data.business_trust_commission.description ?? null,

      calculation_type: data.business_trust_commission.calculation.calculation_type ?? null,
      minimum_wage_amount: data.business_trust_commission.calculation.minimum_wage_amount ? Number(data.business_trust_commission.calculation.minimum_wage_amount) : null,
      count_salaries: data.business_trust_commission.calculation.count_salaries ?? null,
      base_commission_amount: data.business_trust_commission.calculation.base_commission_amount ? Number(data.business_trust_commission.calculation.base_commission_amount) : null,
      fixed_value: data.business_trust_commission.calculation.fixed_value ? Number(data.business_trust_commission.calculation.fixed_value) : null,
      commission_percentage: data.business_trust_commission.calculation.commission_percentage ? Number(data.business_trust_commission.calculation.commission_percentage) : null,
      commission_transaction: data.business_trust_commission.calculation.commission_transaction ? Number(data.business_trust_commission.calculation.commission_transaction) : null,

      start_date: data.business_trust_commission.business_start_date_snapshot ?? null,
      business_trust_id: data.business_trust_commission.business_code_snapshot,
      periodicity: data.business_trust_commission.periodicity ?? null,
      code_movement: data.relationships.accounting_parameters?.business_movement_code_snapshot ?? null,
    }

    basic_data_form.value = form
    setInitialFormData()
  }

  const setInitialFormData = () => {
    setTimeout(() => {
      initial_basic_data_form.value = JSON.parse(
        JSON.stringify(basic_data_form.value)
      )
    }, 1000)
  }

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

  const hasChanges = computed(() => {
    if (!initial_basic_data_form.value) return false
    return (
      JSON.stringify(basic_data_form.value) !==
      JSON.stringify(initial_basic_data_form.value)
    )
  })

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _updateRFiduciaryBusinessCommissions(
      payload,
      searchId
    )
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

    const response = await _getByIdFiduciaryBusinessCommissions(searchId)

    if (response) {
      await _getResources(keys)
      await _getResources(
        {
          trust_business: ['business_trusts'],
        },
        'filter[status_id]=59,57'
      )

      setFormEdit(response)
    }

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
    hasChanges,
  }
}

export default useFiduciaryBusinessCommissionsEdit
