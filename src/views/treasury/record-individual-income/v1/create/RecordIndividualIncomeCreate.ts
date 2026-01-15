import { ref, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUtils, useMainLoader } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { IRecordIndividualIncomeToCreate } from '@/interfaces/customs'
import {
  useRecordIndividualIncomeStore,
  useResourceManagerStore,
} from '@/stores'

const useRecordIndividualIncomeCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const { _createRecordIndividualIncome, _setDataDetailForm } =
    useRecordIndividualIncomeStore('v1')
  const { data_filter_form, data_detail_form, income_record_id } = storeToRefs(
    useRecordIndividualIncomeStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['third_parties', 'typeReceive', 'banks', 'bank_accounts_income'],
  }

  const detailInformationRef = ref()

  const headerProps = {
    title: 'Detalle ingresos individuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
      },
      {
        label: 'Ingresos individuales',
        route: 'RecordIndividualIncomeList',
      },
      {
        label: 'Crear',
        route: 'RecordIndividualIncomeCreate',
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos*',
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

  const makeDataRequest = (): IRecordIndividualIncomeToCreate => {
    const filterForm = data_filter_form.value
    const detailForm = data_detail_form.value

    const requestData: IRecordIndividualIncomeToCreate = {
      office_id: filterForm?.office_id ?? null,
      name_office: filterForm?.name_office ?? '',
      business_trust_id: filterForm?.business_trust_id ?? null,
      name_business: filterForm?.name_business ?? '',
      date: filterForm?.date ?? '',
      movement_id: filterForm?.movement_id ?? null,
      voucher: filterForm?.voucher ?? '',
      sub_voucher: filterForm?.sub_voucher ?? '',
      details: detailForm ? [detailForm] : [],
    }

    if (income_record_id.value) {
      requestData.income_record_id = income_record_id.value
    }

    return requestData
  }

  const validateForm = async () => {
    return (await detailInformationRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createRecordIndividualIncome(payload)

    if (success) {
      await _setDataDetailForm(null)
      router.push({ name: 'RecordIndividualIncomeList' })
    }
    openMainLoader(false)
  }

  onMounted(async () => {
    openMainLoader(true)
    if (data_filter_form.value?.business_trust_id) {
      const keys_business_id = {
        treasury: ['bank_account_cost_centers'],
      }
      const key = {
        treasury: ['cash_flow_structure_egreso'],
      }
      const query = `business_trust_id=${data_filter_form.value?.business_trust_id}`
      await _getResources(key, query)
      const query_business_id_ = `business_id=${data_filter_form.value?.business_trust_id}`
      await _getResources(keys_business_id, query_business_id_)
    }
    await _getResources(keys)
    openMainLoader(false)
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
    _resetKeys({ treasury: ['cash_flow_structure_egreso'] })
    _resetKeys({ treasury: ['bank_account_cost_centers'] })
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    detailInformationRef,
    onSubmit,
  }
}

export default useRecordIndividualIncomeCreate
