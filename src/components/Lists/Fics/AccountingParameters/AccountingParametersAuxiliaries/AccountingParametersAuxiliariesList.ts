// Vue - Pinia - Quasar
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import { IAccountingParametersAccountingParametersAuxiliariesList } from '@/interfaces/customs/fics/AccountingParametersAuxiliaries'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountingParametersAccountingParametersAuxiliariesStore } from '@/stores/fics/accounting-parameters/accounting-parameters-auxiliaries'

const useAccountingParametersAuxiliariesList = () => {
  const {
    _getAccountingParametersAuxiliaries,
    _clearDataAccountingParametersAuxiliaries,
  } = useAccountingParametersAccountingParametersAuxiliariesStore('v1')

  const { accounting_parameters_auxiliaries_list } = storeToRefs(
    useAccountingParametersAccountingParametersAuxiliariesStore('v1')
  )

  const { defaultIconsLucide } = useUtils()

  const tableProps = ref({
    title: 'Auxiliares parámetros contables',
    description:
      'Observe la descripción de los auxiliares que conforman el bloque contable para permitir la configuración de los parámetros contables sobre estos campos establecidos en la página de la Fiduprevisora',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'center',
        field: 'id',
        sortable: true,
      },
      {
        name: 'abbreviation',
        required: false,
        label: 'Código auxiliar',
        align: 'center',
        field: 'abbreviation',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción auxiliar',
        align: 'center',
        field: 'description',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: accounting_parameters_auxiliaries_list.value as IAccountingParametersAccountingParametersAuxiliariesList,
  })

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getAccountingParametersAuxiliaries()
    tableProps.value.loading = false
  }

  onMounted(() => {
    listAction()
  })

  onUnmounted(() => {
    _clearDataAccountingParametersAuxiliaries()
  })

  watch(
    () => accounting_parameters_auxiliaries_list.value,
    () => {
      tableProps.value.rows = accounting_parameters_auxiliaries_list.value
    }
  )

  return {
    tableProps,
    defaultIconsLucide,
  }
}

export default useAccountingParametersAuxiliariesList
