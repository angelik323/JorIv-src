// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'

// Composables & utils
import { useGoToUrl } from '@/composables'
import { defaultIconsLucide } from '@/utils'

// Interfaces
import type { ITabs } from '@/interfaces/global'

// Stores
import { useResourceManagerStore } from '@/stores'

export const useBankNetworkLoadCreate = () => {
  const { goToURL } = useGoToUrl()
  const bankNetworkLoadForm = ref()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = {
    fics: ['offices'],
  }

  const keysV2 = {
    treasury: [
      'bank_structures',
      'banking_network_upload_request_types',
      'banking_network_upload_statuses',
    ],
  }

  const headerProps = {
    title: 'Crear cargue de red bancaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Cargue de red bancaria',
        route: 'BankNetworkLoadList',
      },
      { label: 'Crear', route: 'BankNetworkLoadCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  onMounted(async () => {
    await _getResources(keys)
    await _getResources(keysV2, '', 'v2')

    await _getResources(
      { treasury: ['treasury_movement_codes'] },
      `filter[nature]=Ingresos&filter[handles_accounting_offset]=true`
    )
  })

  onBeforeUnmount(() => {
    _resetKeys({
      treasury: [
        'banks',
        'banks_label_code',
        'bank_structures',
        'bank_account',
      ],
      fics: [...keys.fics],
    })
  })

  return {
    headerProps,
    tabs,
    activeTab,
    activeTabIdx,
    bankNetworkLoadForm,
    goToURL,
  }
}
