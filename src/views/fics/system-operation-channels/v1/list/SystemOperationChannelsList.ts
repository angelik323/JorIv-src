// Vue - Pinia - Quasar
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { ISystemOperationChannel } from '@/interfaces/customs/fics/SystemOperationChannels'

// Stores
import { useSystemOperationChannelsStore } from '@/stores/fics/system-operation-channels'

export const useSystemOperationChannelsList = () => {
  const { system_operation_channels_list } = storeToRefs(
    useSystemOperationChannelsStore('v1')
  )
  const { _getSystemOperationChannelsList } =
    useSystemOperationChannelsStore('v1')

  const headerProps = {
    title: 'Canales de operación del sistema',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Canales de operación del sistema',
        route: 'SystemOperationChannels',
      },
    ],
  }

  const tableProps = ref<{
    title: string
    loading: boolean
    columns: QTable['columns']
    rows: ISystemOperationChannel[]
    hideBottom: boolean
  }>({
    title: 'Canales de operación del sistema',
    loading: false,
    columns: [
      {
        name: 'name',
        required: false,
        label: 'Canales',
        align: 'left',
        field: 'name',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [],
    hideBottom: true,
  })

  onMounted(() => {
    _getSystemOperationChannelsList()
  })

  watch(
    () => system_operation_channels_list.value,
    () => {
      tableProps.value.rows = system_operation_channels_list.value
    }
  )

  return {
    tableProps,
    headerProps,
  }
}
