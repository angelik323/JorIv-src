import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'
import { useMainLoader, useUtils } from '@/composables'
import { ITabs } from '@/interfaces/global'
import { IRecordIndividualIncomeToEdit } from '@/interfaces/customs'
import {
  useRecordIndividualIncomeStore,
  useResourceManagerStore,
} from '@/stores'

const useRecordIndividualIncomeEdit = () => {
  const route = useRoute()
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { defaultIconsLucide } = useUtils()

  const {
    _updateRecordIndividualIncomeDetail,
    _setDataDetailForm,
    _getByIdRecordIndividualIncomeDetail,
  } = useRecordIndividualIncomeStore('v1')
  const { data_filter_form, data_detail_form, data_detail_view } = storeToRefs(
    useRecordIndividualIncomeStore('v1')
  )

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const keys = {
    treasury: ['third_parties', 'typeReceive', 'banks', 'bank_accounts_income'],
  }

  const detailInformationRef = ref()
  const recordIndividualIncomeDetailId = +route.params.id

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
        label: 'Editar',
        route: 'RecordIndividualIncomeEdit',
      },
      {
        label: `${recordIndividualIncomeDetailId}`,
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

  const makeDataRequest = (): IRecordIndividualIncomeToEdit => {
    const detailForm = data_detail_form.value

    return {
      nit_third_party_id: detailForm?.nit_third_party_id ?? null,
      type_receive_id: detailForm?.type_receive_id ?? null,
      cost_center_id: detailForm?.cost_center_id ?? null,
      cash_flow_id: detailForm?.cash_flow_id ?? null,
      concept: detailForm?.concept ?? '',
      bank_id: detailForm?.bank_id ?? null,
      bank_account_id: detailForm?.bank_account_id ?? null,
      foreign_currency_value: detailForm?.foreign_currency_value ?? null,
      coin: detailForm?.coin ?? '',
      trm: detailForm?.trm ?? null,
      value: detailForm?.value ?? null,
      checkbook: detailForm?.checkbook ?? '',
      bank_checkbook_id: detailForm?.bank_checkbook_id ?? null,
      effective_date: detailForm?.effective_date ?? '',
      investment_plans_id: detailForm?.investment_plans_id ?? null,
    }
  }

  const validateForm = async () => {
    return (await detailInformationRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _updateRecordIndividualIncomeDetail(
      payload,
      recordIndividualIncomeDetailId
    )

    if (success) {
      await _setDataDetailForm(null)
      router.push({ name: 'RecordIndividualIncomeList' })
    }
    openMainLoader(false)
  }

  onBeforeMount(async () => {
    openMainLoader(true)
    try {
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
      await _getByIdRecordIndividualIncomeDetail(recordIndividualIncomeDetailId)
    } finally {
      openMainLoader(false)
    }
  })

  onBeforeUnmount(() => {
    _resetKeys(keys)
  })

  return {
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,
    detailInformationRef,
    onSubmit,
    data_detail_view,
  }
}

export default useRecordIndividualIncomeEdit
