import { storeToRefs } from 'pinia'
import { nextTick, onMounted, ref, watch } from 'vue'

// Stores
import { useSuppliesStore, useResourcesStore } from '@/stores'

// Interfaces
import { IDataTable, ILinkedAssetsTable } from '@/interfaces/customs'
import { QTable } from 'quasar'

// Utils
import { defaultIcons } from '@/utils'

// Images
import defaultImgConfirmation from '@/assets/images/alert-confirmation.jpg'

// Composables
import {
  useAlert,
  useAlertModal,
  useMainLoader,
  useRules,
  useUtilsCalendarMethods,
} from '@/composables'
import { IAlertParams, ISuppliesRequest } from '@/interfaces/global'

const useLinkedAssetsComponent = (props: any) => {
  const { date_before_or_equal_to_the_current_date } = useRules()

  const { options_calendar_date_less_than_or_equal_to_the_current_date } =
    useUtilsCalendarMethods()
  const { data_table_linked_assets } = storeToRefs(useSuppliesStore('v1'))

  const { general_assets } = storeToRefs(useResourcesStore())

  const { _setDataLinkedAssets, _exportLinkedAssetsXLS } =
    useSuppliesStore('v1')

  const { showAlertInformation } = useAlertModal()

  const { showAlert } = useAlert()

  const { openMainLoader } = useMainLoader()

  const models = ref({
    asset_id: null as number | null,
    association_date: null as string | null,
    quantity: null as string | null,
  })

  const entityId = ref<number | null>(null)

  const linkedAssetsCreateForm = ref()

  const dataTableLinkedAssets = ref<IDataTable<ILinkedAssetsTable>>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })

  const tableProps = ref({
    title: 'Listado de activos vinculados',
    loading: false,
    rows: [] as ILinkedAssetsTable[],
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
        name: 'asset_name',
        required: false,
        label: 'Activo',
        align: 'center',
        field: (row: ILinkedAssetsTable) => row.asset_name ?? '--',
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'description',
        required: false,
        label: 'Nombre',
        align: 'center',
        field: (row: ILinkedAssetsTable) => row.description ?? '--',
        sortable: true,
        style: {
          'max-width': '140px',
          'min-width': '100px',
          'word-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'association_date',
        required: false,
        label: 'Fecha de asociación',
        align: 'center',
        field: (row: ILinkedAssetsTable) => row.association_date ?? '--',
        sortable: true,
      },
      {
        name: 'quantity',
        required: false,
        label: 'Cantidad',
        align: 'center',
        field: (row: ILinkedAssetsTable) => row.quantity ?? '--',
        sortable: true,
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
    },
  })

  const openDialog = ref(false)

  const openDialogEdit = ref(false)

  const maxId = () =>
    dataTableLinkedAssets.value?.data?.reduce(
      (max, item) => Math.max(max, item.id),
      0
    )

  const onResetForm = () => {
    models.value.asset_id = null
    models.value.association_date = null
    models.value.quantity = null

    entityId.value = null
  }

  const createDataTableObject = (): ILinkedAssetsTable => {
    return {
      id: maxId() + 1,
      asset_name:
        general_assets.value.find(
          (item) => item.value === models.value.asset_id
        )?.plate_code ?? null,
      description:
        general_assets.value.find(
          (item) => item.value === models.value.asset_id
        )?.description ?? null,
      asset_id: models.value.asset_id?.toString() ?? null,
      association_date: models.value.association_date ?? null,
      quantity: models.value.quantity ?? null,
      saved: false,
    }
  }

  const addToTable = () => {
    linkedAssetsCreateForm.value.validate().then(async (success: any) => {
      if (success) {
        const dataTable: ILinkedAssetsTable = createDataTableObject()

        if (
          tableProps.value.rows.find(
            (item) => item.asset_id == dataTable.asset_id
          )
        ) {
          return showAlert(
            'Ya el activo esta registrado/agregado, utilice otro',
            'error',
            undefined,
            1000
          )
        }

        dataTableLinkedAssets.value.data.push(dataTable)

        dataTableLinkedAssets.value.total =
          dataTableLinkedAssets.value.data.length

        tableProps.value.rows = [...dataTableLinkedAssets.value.data]

        saveToStore()
        onResetForm()

        openDialog.value = false
      }
    })
  }

  const editRecord = async (row: typeof models.value, id: number) => {
    entityId.value = id

    openDialogEdit.value = true

    await nextTick(() => {
      models.value = {
        asset_id: Number(row.asset_id),
        association_date: row.association_date,
        quantity: row.quantity,
      }
    })
  }

  const addTableRowEdit = () => {
    linkedAssetsCreateForm.value.validate().then(async (success: any) => {
      if (success) {
        const assetId = models.value?.asset_id ?? 0
        const assetData = general_assets.value?.find(
          (asset) => asset.value === assetId
        )

        const updatedData = dataTableLinkedAssets.value.data.map((row) => {
          if (row.id === entityId.value) {
            return {
              ...row,
              id: assetId,
              asset_id: assetId?.toString() ?? null,
              asset_name: assetData?.plate_code ?? null,
              description: assetData?.description ?? null,
              association_date: models.value.association_date ?? null,
              quantity: models.value.quantity ?? null,
            }
          }
          return row
        })

        // Actualizar los datos y propiedades de la tabla
        dataTableLinkedAssets.value.data = updatedData
        dataTableLinkedAssets.value.total = updatedData.length

        tableProps.value.rows = [...updatedData]

        // Persistir cambios y resetear formulario
        saveToStore()
        onResetForm()
        openDialogEdit.value = false
      }
    })
  }

  const deleteRecord = (id: number | string) => {
    // Función para filtrar por ID
    const filterById = (item: { id: number }) => item.id !== id

    // Actualizar data y tablas
    dataTableLinkedAssets.value.data =
      dataTableLinkedAssets.value.data?.filter(filterById) ?? []

    tableProps.value.rows = [...dataTableLinkedAssets.value.data]

    // Notificación y guardar estado
    setTimeout(() => {
      showAlert(`Registro eliminado exitosamente`, 'success', undefined, 1000)
      saveToStore()
    }, 500)
  }

  const saveToStore = () => {
    _setDataLinkedAssets(dataTableLinkedAssets.value)
  }

  const _setValueModels = () => {
    const data = data_table_linked_assets.value ?? null
    if (['create', 'edit'].includes(props.action)) {
      if (data && data.length > 0) {
        tableProps.value.rows = [...data]
        dataTableLinkedAssets.value.data = [...data]
        dataTableLinkedAssets.value.total = Number(data)
      }
    }
  }

  const setFormView = () => {
    const data: ISuppliesRequest = props.data

    if (data) {
      tableProps.value.rows = data.assets.map((asset) => ({
        id: asset.id ?? null,
        asset_name: asset.plate_code ?? null,
        asset_id:
          general_assets.value.find((item) => item.plate_code === asset.asset)
            ?.id ?? null,
        description: asset.asset ?? null,
        supply_name: '',
        association_date: asset.association_date ?? null,
        measurement_unit: '',
        quantity: asset.quantity ?? null,
        saved: true,
      })) as ILinkedAssetsTable[]

      dataTableLinkedAssets.value.data = [...tableProps.value.rows]
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModels,
      edit: _setValueModels,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  const execConfirmation = async (message: string): Promise<boolean> => {
    const alertParams: IAlertParams = {
      params_html: `<p class="modal__confirmation--text">Confirmación</p><p>${message}</p>`,
      image_url: defaultImgConfirmation,
      confirm_button_text: 'Aceptar',
      cancel_button_text: 'Cancelar',
    }

    return await showAlertInformation(alertParams)
  }

  const deleteRowValidation = async (id: number): Promise<void> => {
    const message = `¿Desea eliminar el registro seleccionado?`
    const confirm = await execConfirmation(message)

    if (confirm) {
      deleteRecord(id)
    }
  }

  const exportXLSX = async () => {
    const NO_DATA_MESSAGE = 'No hay datos para exportar'
    const ALERT_TYPE = 'warning'
    const ALERT_TIMEOUT = 1000

    if (tableProps.value.rows.length === 0) {
      return showAlert(NO_DATA_MESSAGE, ALERT_TYPE, undefined, ALERT_TIMEOUT)
    }

    openMainLoader(true)
    await _exportLinkedAssetsXLS(props.data.id)

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  onMounted(() => {
    if (props.action === 'view') {
      tableProps.value.columns?.splice(
        tableProps.value.columns.findIndex((obj: { name?: string }) => {
          return obj.name == 'actions'
        }),
        1
      )
    }

    handlerActionForm(props.action)
  })

  watch(
    () => data_table_linked_assets.value,
    (val) => {
      tableProps.value.rows =
        val && val.length > 0 ? val.map((item) => ({ ...item })) : []
    },
    { deep: true }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )

  return {
    models,
    linkedAssetsCreateForm,
    tableProps,
    defaultIcons,
    openDialog,
    general_assets,
    openDialogEdit,

    // Methods
    addToTable,
    deleteRowValidation,
    editRecord,
    addTableRowEdit,
    onResetForm,
    exportXLSX,
    date_before_or_equal_to_the_current_date,
    options_calendar_date_less_than_or_equal_to_the_current_date,
  }
}

export default useLinkedAssetsComponent
