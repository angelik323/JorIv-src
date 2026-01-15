import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useResourceManagerStore } from '@/stores'

const useScheduleDeferralCreate = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const scheduleDeferralForm = ref()

  const headerProps = {
    title: 'Programar y procesar diferidos',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      {
        label: 'Programar y procesar diferidos',
        route: 'ScheduleDeferralList',
      },
      { label: 'Programar' },
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
    openMainLoader(false)
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

  const onSaved = async () => {
    router.push({ name: 'ScheduleDeferralList' })
  }

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    scheduleDeferralForm,
    onSaved,
  }
}

export default useScheduleDeferralCreate
