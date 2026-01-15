// Vue - Pinia - Quasar
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IAccountingParametersProcessCodes,
  IAccountingParametersProcessCodesList,
} from '@/interfaces/customs/fics/ProcessCodes'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useAccountingParametersProcessCodesStore } from '@/stores/fics/accounting-parameters/process-codes'

const useAccountingParametersProcessCodesList = () => {
  const { _getProcessCodes, _clearDataProcessCodes } =
    useAccountingParametersProcessCodesStore('v1')

  const { process_codes_list } = storeToRefs(
    useAccountingParametersProcessCodesStore('v1')
  )

  const { defaultIconsLucide } = useUtils()

  const tableProps = ref({
    title: 'Códigos de procesos',
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
        name: 'code',
        required: false,
        label: 'Código',
        align: 'center',
        field: 'code',
        sortable: true,
      },
      {
        name: 'description',
        required: false,
        label: 'Descripción',
        align: 'center',
        field: 'description',
        sortable: true,
      },
      {
        name: 'classes_movement_type',
        required: false,
        label: 'Tipo',
        align: 'center',
        field: (row: IAccountingParametersProcessCodes) =>
          `${row.classes_movement_type?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'classes_movement_nature',
        required: false,
        label: 'Naturaleza',
        align: 'center',
        field: (row: IAccountingParametersProcessCodes) =>
          `${row.classes_movement_nature?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'classes_movement_class',
        required: false,
        label: 'Clase',
        align: 'center',
        field: (row: IAccountingParametersProcessCodes) =>
          `${row.classes_movement_class?.code ?? ''}`,
        sortable: true,
      },
      {
        name: 'movement_code',
        required: false,
        label: 'Código de movimiento',
        align: 'center',
        sortable: true,
        field: (row: IAccountingParametersProcessCodes) =>
          `${row.movement_code?.code ?? ''}`,
      },
    ] as QTable['columns'],
    rows: process_codes_list.value as IAccountingParametersProcessCodesList,
    rowsPerPageOptions: [100],
  })

  const listAction = async () => {
    tableProps.value.rows = []
    tableProps.value.loading = true
    await _getProcessCodes()
    tableProps.value.loading = false
  }

  onMounted(() => {
    listAction()
  })

  onUnmounted(() => {
    _clearDataProcessCodes()
  })

  watch(
    () => process_codes_list.value,
    () => {
      tableProps.value.rows = process_codes_list.value
    }
  )

  return {
    tableProps,
    defaultIconsLucide,
  }
}

export default useAccountingParametersProcessCodesList
