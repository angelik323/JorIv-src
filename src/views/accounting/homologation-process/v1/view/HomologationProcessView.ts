import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { defaultIconsLucide } from '@/utils'

import { ITabs } from '@/interfaces/global'

import { useHomologationProcessStore, useResourceManagerStore } from '@/stores'

const useHomologationProcessView = () => {
  const { _getHomologationProcess } = useHomologationProcessStore('v1')

  const route = useRoute()

  const processId = +route.params.id

  const headerProps = {
    title: 'Ver proceso de homologación',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Contabilidad' },
      { label: 'Proceso de homologación', route: 'HomologationProcessList' },
      { label: 'Ver' },
      { label: `${processId}` },
    ],
    showBackBtn: true,
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'simple',
      label: 'Consulta por comprobante',
      icon: defaultIconsLucide.listCheck,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
    {
      name: 'detailed',
      label: 'Consulta detallada',
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

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  onMounted(() => {
    _getHomologationProcess(processId)

    _getResources({
      accounting: ['account_structures_active', 'receipt_types'],
    })
    _getResources(
      {
        accounting: [
          'vouchers_mappings_process_name_types',
          'vouchers_mappings_process_types',
          'vouchers_mapping_process_statuses',
          'vouchers_mapping_process_logs_statuses',
        ],
      },
      '',
      'v2'
    )
  })

  onBeforeUnmount(() => {
    _resetKeys({
      accounting: [
        'account_structures_active',
        'account_structures_active_revert_vouchers',
        'business_trusts_by_account_structure_and_equivalence',
        'voucher_consecutives_by_business_trust_and_receipt_type',
        'receipt_types',
        'vouchers_mappings_process_name_types',
        'vouchers_mappings_process_types',
        'vouchers_mapping_process_statuses',
        'vouchers_mapping_process_logs_statuses',
        'homologation_receipt_types',
      ],
    })
  })

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    processId,
  }
}

export default useHomologationProcessView
