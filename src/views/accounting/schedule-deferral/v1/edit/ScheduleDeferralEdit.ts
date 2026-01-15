import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useResourceManagerStore, useScheduleDeferralStore } from '@/stores'

const useScheduleDeferralEdit = () => {
  const router = useRouter()
  const route = useRoute()
  const voucherDataId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const { _getScheduleDeferral } = useScheduleDeferralStore('v1')

  const { schedule_deferral } = storeToRefs(useScheduleDeferralStore('v1'))

  const scheduleDeferralForm = ref()

  const headerProps = {
    title: 'Editar programar diferidos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Programar y procesar diferidos',
        route: 'ScheduleDeferralList',
      },
      { label: 'Editar' },
      { label: `${voucherDataId}` },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const onSaved = async () => {
    router.push({ name: 'ScheduleDeferralList' })
  }

  const scheduleDeferralData = ref()

  const keys = {
    accounting: [
      'account_structures_active',
      'business_trust',
      'voucher_natures',
      'receipt_types',
      'third_parties',
    ],
  }

  onMounted(async () => {
    openMainLoader(true)
    await _getResources(keys)
    await _getScheduleDeferral(voucherDataId)
    openMainLoader(false)
    const firstParam = schedule_deferral.value.parameters[0]
    scheduleDeferralData.value = {
      voucher_data: schedule_deferral.value.voucher_data,
      parameters: schedule_deferral.value.parameters.map((param) => ({
        counterpart_account_id: param.counterpart_account?.account?.id ?? 0,
        counterpart_auxiliary_id: param.counterpart_auxiliary?.id ?? 0,
        counterpart_cost_center_id: param.counterpart_cost_center?.id || 0,
        percentage: param.percentage ?? 0,
        receipt_type_id: param.receipt_type?.id ?? 0,
        sub_receipt_type_id: param.sub_receipt_type?.id ?? 0,
      })),
      start_period: firstParam.start_period,
      installment_amount: firstParam.installment_amount,
      installments: firstParam.installments,
    }
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [
        ...keys.accounting,
        'third_parties_label',
        'account_structures_active_revert_vouchers',
        'deferred_impairment_business_trusts',
        'deferred_schedule_business_trusts',
        'accounting_chart_operative_by_structure',
        'deferred_receipt_types',
      ],
    })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    scheduleDeferralForm,
    scheduleDeferralData,
    voucherDataId,
    onSaved,
  }
}

export default useScheduleDeferralEdit
