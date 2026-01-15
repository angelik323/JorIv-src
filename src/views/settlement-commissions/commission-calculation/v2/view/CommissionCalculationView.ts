import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ICommissionCalculationFormV2,
  ICommissionCalculationResponseV2,
} from '@/interfaces/customs/settlement-commissions/CommissionCalculationV2'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useCommissionCalculationStore } from '@/stores/settlement-commissions/commission-calculation'

const useCommissionCalculationView = () => {
  const { _getByIdCommissionCalculation } = useCommissionCalculationStore('v2')

  // Referencias a formularios
  const basicDataFormRef = ref()
  const listCommissionRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide, formatCodeName, formatDate } = useUtils()

  const basic_data_form = ref<ICommissionCalculationFormV2 | null>(null)
  const commissions_form = ref<ICommissionCalculationFormV2['commissions']>([])

  const headerProps = {
    title: 'Ver cálculo de comisiones',
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
        label: 'ver',
        route: 'CommissionCalculationView',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs: ITabs[] = [
    {
      name: 'basic-data',
      label: 'Datos básicos*',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const setFormRead = (data: ICommissionCalculationResponseV2) => {
    const relationships = data.relationships
    const business_trust_commission = data.business_trust_commission
    const calculation = business_trust_commission?.calculation
    const accounting_parameters = relationships?.accounting_parameters

    basic_data_form.value = {
      business_id: business_trust_commission?.business_id ?? null,
      commission_type_id: relationships?.commission_type?.id ?? null,
      accounting_parameters_id: accounting_parameters?.id ?? null,
      business_trust_id: business_trust_commission?.business_id,
      business_trust: formatCodeName(
        business_trust_commission?.business_code_snapshot,
        business_trust_commission?.business_name_snapshot
      ),
      business_trust_commission_id: business_trust_commission?.id,
      business_trust_commission: formatCodeName(
        relationships?.commission_type?.code,
        relationships?.commission_type?.description
      ),
      start_date: business_trust_commission?.business_start_date_snapshot,
      commission_class_catalog_name:
        relationships?.commission_class_catalog?.name,
      commission_class_catalog_id: Number(
        relationships?.commission_class_catalog?.id
      ),
      commission_type_catalog_name:
        relationships?.commission_type_catalog?.name,
      commission_type_catalog_id: relationships?.commission_type_catalog?.id,
      colllection: business_trust_commission?.collection,
      observation: business_trust_commission?.observation,
      description: business_trust_commission?.description,
      calculation_type: calculation?.calculation_type,
      minimum_wage_amount: Number(calculation?.minimum_wage_amount),
      base_commission_amount: Number(calculation?.base_commission_amount),
      commission_percentage: Number(calculation?.commission_percentage),
      commission_transaction: Number(calculation?.commission_transaction),
      count_salaries: Number(calculation?.count_salaries),
      fixed_value: Number(calculation?.fixed_value),

      billing_trust_id: business_trust_commission?.billing_trust_id,

      billing_trust: formatCodeName(
        relationships?.billing_trust?.code,
        relationships?.billing_trust?.periodicity
      ),

      periodicity: business_trust_commission?.periodicity
        ? business_trust_commission?.periodicity
        : relationships?.billing_trust?.periodicity,

      third_party_billings:
        relationships?.third_party_billing?.third_party_document_type +
        ' - ' +
        relationships?.third_party_billing?.third_party_document +
        ' - ' +
        relationships?.third_party_billing?.third_party_name,
      third_party_billings_id: relationships?.third_party_billing?.id ?? null,
      code_movement:
        relationships?.accounting_parameters?.business_movement_name_snapshot,
      start_date_period: relationships?.billing_trust?.start_date,
      end_date_period: relationships?.billing_trust?.end_date,
      generate_iva: accounting_parameters?.iva ? 'Si' : 'No',
      iva: Number(accounting_parameters?.iva ?? 0),
      generated_source: accounting_parameters?.has_retefuente ? 'Si' : 'No',
      source_percentage: Number(accounting_parameters?.retefuente ?? 0),
      generated_ica: accounting_parameters?.has_reteica ? 'Si' : 'No',
      ica_percentage: Number(accounting_parameters?.reteica ?? 0),
      generated_network_iva: accounting_parameters?.has_reteiva ? 'Si' : 'No',
      network_iva_percentage: Number(accounting_parameters?.reteiva ?? 0),
    }

    commissions_form.value =
      relationships?.settlement_commissions.map((sc) => ({
        ...sc,
        period_start: formatDate(
          sc.period_start?.toString() ?? '',
          'YYYY-MM-DD'
        ),
        period_end: formatDate(sc.period_end?.toString() ?? '', 'YYYY-MM-DD'),
        base_calculation: sc.base_amount,
        count_salaries: calculation?.count_salaries,
        commission_value: sc.base_amount,
        iva: sc.iva_amount,
        iva_percentage: sc.iva_percentage,
        retefuente: sc.retefuente_amount,
        retefuente_percentage: sc.retefuente_percentage,
        reteica: sc.reteica_amount,
        reteica_percentage: sc.reteica_percentage,
        reteiva: sc.reteiva_amount,
        reteiva_percentage: sc.reteiva_percentage,
        total_value: Number(sc.total_amount),
        total_amount: Number(sc.total_amount),
        calculation_base: calculation?.calculation_type ?? '',
        commission_percentage: sc.commission_percentage ?? null,
        transaction_commission: sc.transaction_commission ?? null,
        count_transaction: sc.count_transaction ?? null,
        base_amount: sc.base_amount ?? null,
      })) || []
  }

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const onSubmit = async () => {
    goToURL('CommissionsCalculationList')
  }

  onBeforeMount(async () => {
    openMainLoader(true)

    const response = await _getByIdCommissionCalculation(searchId)
    if (response) setFormRead(response)

    openMainLoader(false)
  })

  return {
    basic_data_form,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    listCommissionRef,
    commissions_form,

    onSubmit,
    goToURL,
  }
}

export default useCommissionCalculationView
