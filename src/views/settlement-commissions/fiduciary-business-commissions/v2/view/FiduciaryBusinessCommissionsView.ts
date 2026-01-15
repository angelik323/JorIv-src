import { ref, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  IFiduciaryBusinessCommissionsFormV2,
  IFiduciaryBusinessCommissionsResponseV2,
} from '@/interfaces/customs/settlement-commissions/FiduciaryBusinessCommissionsV2'

// Composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// Stores
import { useFiduciaryBusinessCommissionsStore } from '@/stores/settlement-commissions/fiduciary-business-commissions'

const useFiduciaryBusinessCommissionsView = () => {
  const { _getByIdFiduciaryBusinessCommissions } =
    useFiduciaryBusinessCommissionsStore('v2')

  // Referencias a formularios
  const basicDataFormRef = ref()

  const route = useRoute()
  const searchId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const basic_data = ref<IFiduciaryBusinessCommissionsFormV2 | null>(null)

  const headerProps = {
    title: 'Ver comisión de negocio fiduciario',
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
        label: 'Ver',
        route: 'FiduciaryBusinessCommissionsView',
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

  const setFormRead = (data: IFiduciaryBusinessCommissionsResponseV2) => {
    basic_data.value = {
      business_id: data.business_trust_commission.business_id,
      accounting_parameters_id: data.relationships.accounting_parameters?.id ?? null,
      business_trust_id: data.business_trust_commission.business_code_snapshot + ' - ' + data.business_trust_commission.business_name_snapshot,
      start_date: data.business_trust_commission.business_start_date_snapshot ?? null,
      commission_type_id: data.relationships.commission_type.code + ' - ' + data.relationships.commission_type.description,
      commission_class_catalog_name: data.relationships.commission_class_catalog.name,
      commission_type_catalog_name: data.relationships.commission_type_catalog.name,
      calculation_type: data.business_trust_commission.calculation.calculation_type,
      minimum_wage_amount: data.business_trust_commission.calculation.minimum_wage_amount ? Number(data.business_trust_commission.calculation.minimum_wage_amount) : null,
      count_salaries: data.business_trust_commission.calculation.count_salaries ?? null,
      fixed_value: data.business_trust_commission.calculation.fixed_value ? Number(data.business_trust_commission.calculation.fixed_value) : null,
      base_commission_amount: data.business_trust_commission.calculation.base_commission_amount ? Number(data.business_trust_commission.calculation.base_commission_amount) : null,
      commission_percentage: data.business_trust_commission.calculation.commission_percentage ? Number(data.business_trust_commission.calculation.commission_percentage) : null,
      commission_transaction: data.business_trust_commission.calculation.commission_transaction ? Number(data.business_trust_commission.calculation.commission_transaction) : null,
      count_transaction: data.business_trust_commission.calculation.count_transaction ?? null,
      colllection: data.business_trust_commission.collection ?? null,
      third_party_billings_id:
        data.relationships.third_party_billing.third_party_document
        + ' - ' +
        data.relationships.third_party_billing.third_party_document_type
        + ' - ' +
        data.relationships.third_party_billing.third_party_name,
      description: data.business_trust_commission.description ?? null,
      observation: data.business_trust_commission.observation ?? null,

      billing_trust_id: data.relationships.billing_trust.id ?? null,
      billing_trust_label: data.relationships.billing_trust.code + ' - ' + data.relationships.billing_trust.periodicity,
    }
  }

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = 0

  const onSubmit = async () => {
    goToURL('BusinessTrustCommissionsList')
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    const response = await _getByIdFiduciaryBusinessCommissions(searchId)
    if (response) {
      setFormRead(response)
    }
    openMainLoader(false)
  })

  return {
    basic_data,
    basicDataFormRef,
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    onSubmit,
    goToURL,
  }
}

export default useFiduciaryBusinessCommissionsView
