// Vue - Pinia - Quasar
import { ref, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Interfaces
import {
  IAccountingParametersProcessCodes,
  IAccountingParametersProcessCodesList,
} from '@/interfaces/customs/fics/ProcessCodes'

// Stores
import { useAccountingParametersProcessCodesStore } from '@/stores/fics/accounting-parameters/process-codes'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useProcessCodesForm = () => {
  const { process_codes_list } = storeToRefs(
    useAccountingParametersProcessCodesStore('v1')
  )
  const { _getProcessCodes, _clearDataProcessCodes } =
    useAccountingParametersProcessCodesStore('v1')

  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { movements_codes } = storeToRefs(useFicResourceStore('v1'))

  const keys = {
    fics: ['movements_codes'],
  }

  const processCodesFormElementRef = ref()

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
        name: 'movement_code_id',
        required: false,
        label: 'Código de movimiento',
        align: 'center',
        field: (row: IAccountingParametersProcessCodes) =>
          `${row.movement_code?.id ?? null}`,
        sortable: true,
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

  const onMovementCodeSelector = (
    value: string,
    row: IAccountingParametersProcessCodes
  ) => {
    row.movement_code_id = value ? Number(value) : null
  }

  onBeforeMount(async () => {
    await _getResources(keys)
  })

  onMounted(async () => {
    await listAction()
  })

  onBeforeUnmount(() => {
    _clearDataProcessCodes()
    _resetKeys(keys)
  })

  watch(
    () => process_codes_list.value,
    () => {
      tableProps.value.rows = process_codes_list.value
    }
  )

  return {
    tableProps,
    processCodesFormElementRef,
    onMovementCodeSelector,
    movements_codes,
  }
}

export default useProcessCodesForm
