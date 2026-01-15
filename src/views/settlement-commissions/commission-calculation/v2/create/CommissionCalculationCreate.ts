import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import { ICommissionCalculationFormV2 } from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCommissionCalculationStore } from '@/stores/settlement-commissions/commission-calculation'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useCommissionCalculationCreate = () => {
  const { _createCommisionCalculation } = useCommissionCalculationStore('v2')

  // Data de formularios
  const basic_data_form = ref<ICommissionCalculationFormV2 | null>(null)
  const commissions_form = ref<ICommissionCalculationFormV2['commissions']>([])
  const showTableCommissions = ref(false)

  // Referencias a formularios
  const basicDataFormRef = ref()
  const listCommissionRef = ref()

  const { openMainLoader } = useMainLoader()
  const { cleanEmptyFields, defaultIconsLucide } = useUtils()
  const { goToURL } = useGoToUrl()

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const headerProps = {
    title: 'Crear cálculo de comisiones',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
      },
      {
        label: 'Cálculo de comisiones',
        route: 'CommissionsCalculationList',
      },
      {
        label: 'Crear',
        route: 'CommissionCalculationCreate',
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
    data: ICommissionCalculationFormV2 | null,
    commissions: ICommissionCalculationFormV2['commissions']
  ) => {
    if (!data) return {}

    const request: Partial<ICommissionCalculationFormV2> = {
      business_trust_commission_id: data?.business_trust_commission_id ?? null,
      commissions: commissions ?? [],
    }
    return cleanEmptyFields(request)
  }

  const makeDataRequest = () => {
    const apiRequestBody: Partial<ICommissionCalculationFormV2> = {
      ...makeBaseInfoRequest(basic_data_form.value, commissions_form.value),
    }

    return apiRequestBody
  }

  const validateForms = async () => {
    return (await basicDataFormRef.value?.validateForm()) ?? false
  }

  const handleCreateCalculation = async () => {
    if (!(await validateForms())) return
    if (basic_data_form.value) {
      showTableCommissions.value = true
    }
  }

  const onSubmit = async () => {
    if (!(await validateForms())) return

    openMainLoader(true)
    const payload = makeDataRequest()
    const success = await _createCommisionCalculation(payload)
    if (success) {
      goToURL('CommissionsCalculationList')
    }
    openMainLoader(false)
  }

  const isValidBasicDataForm = computed(() =>
    Boolean(
      basic_data_form.value?.business_trust_id &&
        basic_data_form.value?.commission_class_catalog_name &&
        basic_data_form.value?.periodicity &&
        basic_data_form.value?.business_trust_commission_id
    )
  )

  const keys = {
    settlement_commissions: ['commission_types', 'third_party_billings'],
  }

  const keysBusinessToClear = {
    trust_business: ['business_trusts'],
    settlement_commissions: ['commission_types'],
  }

  watch(
    () => [
      basic_data_form.value?.business_trust_id,
      basic_data_form.value?.business_trust_commission_id,
    ],
    (
      [businessTrustId, businessTrustCommissionId],
      [oldBusinessTrustId, oldBusinessTrustCommissionId]
    ) => {
      const idsChanged =
        businessTrustId !== oldBusinessTrustId ||
        businessTrustCommissionId !== oldBusinessTrustCommissionId

      if (!idsChanged) return

      showTableCommissions.value = false
      commissions_form.value = []
    },
    {
      flush: 'sync',
    }
  )

  onMounted(async () => {
    openMainLoader(true)
    await Promise.all([
      _getResources(
        {
          settlement_commissions: ['business_trusts_commissions_with_business'],
        },
        'only_without_settlements=true'
      ),
      _getResources(keys),
    ])
    openMainLoader(false)
  })

  onBeforeUnmount(async () => {
    _resetKeys(keysBusinessToClear)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    listCommissionRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    isValidBasicDataForm,
    showTableCommissions,
    commissions_form,

    onSubmit,
    goToURL,
    handleCreateCalculation,
  }
}

export default useCommissionCalculationCreate
