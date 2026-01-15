// Vue
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// Composables & utils
import { useGoToUrl, useUtils } from '@/composables'
import { defaultIconsLucide } from '@/utils'

// Interfaces
import type { ITabs } from '@/interfaces/global'
import { IBankNetworkLoadModel } from '@/interfaces/customs'

// Stores
import { useResourceManagerStore } from '@/stores'
import { useBankNetworkLoadStore } from '@/stores/treasury/bank-network-load'

export const useBankNetworkLoadEdit = () => {
  const route = useRoute()
  const bankNetworkLoadId = +route.params.id

  const { formatDate } = useUtils()
  const { goToURL } = useGoToUrl()
  const { _getBankNetworkLoadById, _getBankNetworkLoadDetailById } =
    useBankNetworkLoadStore('v1')

  // refs
  const bankNetworkLoadForm = ref()
  const bank_network_load_form = ref<IBankNetworkLoadModel | undefined>()
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const keys = {
    treasury: ['banks', 'business_trust', 'bank_account'],
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
    title: 'Editar cargue de red bancaria',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Tesorería' },
      {
        label: 'Cargue de red bancaria',
        route: 'BankNetworkLoadList',
      },
      { label: 'Editar', route: 'BankNetworkLoadEdit' },
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

    const response = await _getBankNetworkLoadById(bankNetworkLoadId)
    const details = await _getBankNetworkLoadDetailById(bankNetworkLoadId)

    if (response) {
      let documentFiles: File[] = []

      if (response.file_name) {
        const mockFile = new File([''], response.file_name, {
          type: 'text/plain',
          lastModified: new Date(response.created_at ?? '').getTime(),
        })
        documentFiles = [mockFile]
      }

      bank_network_load_form.value = {
        id: response.id,
        type: response.request_type ?? '',
        office_id: response.office?.id ?? '',
        business_id: response.business_trust?.id ?? '',
        business_name: response.business_trust?.name ?? '',
        bank_id: response.bank?.id ?? '',
        bank_name: response.bank?.description ?? '',
        format_id: response.format_type?.id ?? '',
        format_name: response.format_type?.description ?? '',
        closing_date: '',
        upload_date: formatDate(response.created_at ?? '', 'YYYY-MM-DD'),
        bank_account_id: response.bank_account?.id ?? '',
        bank_account_name: response.bank_account?.account_number ?? '',
        documentFiles: documentFiles,
        file_name: response.file_name ?? '',
        total_count: response.total_count ?? 0,
        structure_validation_summary:
          response.structure_validation_summary ?? undefined,
        details: details ?? undefined,
        treasury_movement_code_id: response.treasury_movement_code?.id ?? '',
      }
    }
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    activeTab,
    activeTabIdx,
    bankNetworkLoadForm,
    goToURL,

    // refs
    bank_network_load_form,
  }
}
