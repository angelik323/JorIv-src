import { IEconActivity, IThirdParty } from '@/interfaces/global/ThirdParties'
import { QTable } from 'quasar'
import { reactive, ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useResourceStore, useThirdPartiesStore } from '@/stores'
import { IDataTable, IThirdPartiesTable } from '@/interfaces/customs'
import { useAlert } from '@/composables'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEconActivityForm = (props: any) => {
  const { _setActivitiesCIIUSTable } = useThirdPartiesStore()

  const { data_table_activities_ciius } = storeToRefs(useThirdPartiesStore())

  const { ciius, cities } = storeToRefs(useResourceStore('v1'))

  const { showAlert } = useAlert()

  const models = ref({
    ciiu: null as number | null,
    city: null as number | null,
  })
  const isActivityGeneratorOpen = ref(false)
  const itemToEdit = ref<IEconActivity | undefined>(undefined)
  const formElementRef = ref()
  const isLoading = ref(false)

  const customColumns = ['is_main', 'actions']

  const dataTableThirdParties = ref<IDataTable<IThirdPartiesTable>>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })

  const tableProperties = reactive({
    title: 'Listado de actividades económicas (Código CIIU)',
    loading: false,
    columns: [
      {
        name: 'is_main',
        required: true,
        label: 'Principal',
        align: 'left',
        field: 'is_main',
        sortable: true,
      },
      {
        name: 'activity',
        required: true,
        label: 'Código / Actividad económica',
        align: 'left',
        style: {
          'max-width': '200px',
          'overflow-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
        field: (row: IThirdPartiesTable) =>
          row.ciiu_code
            ? `${row.ciiu_code} - ${row.ciiu_name}`
            : 'Sin información',
        sortable: true,
      },
      {
        name: 'city',
        required: true,
        label: 'Ciudad',
        align: 'left',
        field: (row: IThirdPartiesTable) =>
          row.city_code
            ? `${row.city_code} - ${row.city_name}`
            : 'Sin información',
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
    rows: [] as IThirdPartiesTable[],
  })

  const entityId = ref<number | null>(null)

  const maxId = () =>
    dataTableThirdParties.value?.data?.reduce(
      (max, item) => Math.max(max, item.id),
      0
    )

  const createDataTableObject = (): IThirdPartiesTable => {
    const ciiu = ciius.value.find((ciiu) => ciiu.value === models.value.ciiu)
    const city = cities.value.find((city) => city.value === models.value.city)
    return {
      id: maxId() + 1,
      is_main: false,
      ciiu_id: (ciiu?.value as number) ?? null,
      ciiu_code: ciiu?.code ?? '--',
      ciiu_name: ciiu?.description ?? '--',
      city_id: (city?.value as number) ?? null,
      city_code: city?.code ?? '--',
      city_name: city?.name ?? '--',
      saved: false,
    }
  }

  const addToTable = () => {
    formElementRef.value.validate().then(async (success: boolean) => {
      if (success) {
        const dataTable: IThirdPartiesTable = createDataTableObject()

        if (tableProperties.rows.length === 5) {
          return showAlert(
            'Solo se permiten 5 registros',
            'error',
            undefined,
            1000
          )
        }

        if (
          tableProperties.rows.find(
            (item) =>
              item.city_code == dataTable.city_code &&
              item.ciiu_code == dataTable.ciiu_code
          )
        ) {
          return showAlert(
            'Ya la actividad esta registrada a esa ciudad',
            'error',
            undefined,
            1000
          )
        }

        dataTableThirdParties.value.data.push(dataTable)

        dataTableThirdParties.value.total =
          dataTableThirdParties.value.data.length

        tableProperties.rows = [...dataTableThirdParties.value.data]

        saveToStore()
        onResetForm()
        setMainItem(dataTable.id)
      }
    })
  }

  const saveToStore = () => {
    _setActivitiesCIIUSTable(dataTableThirdParties.value)
  }

  const onResetForm = () => {
    models.value.ciiu = null
    models.value.city = null

    entityId.value = null

    setTimeout(() => {
      formElementRef.value?.reset()
    }, 500)
  }

  const handleSave = (newItem: IEconActivity) => {
    const ciiu = ciius.value.find((ciiu) => ciiu.value === newItem.ciiu?.id)
    const city = cities.value.find((city) => city.value === newItem.city?.id)

    const updatedData = dataTableThirdParties.value.data.map((row) => {
      if (row.id === entityId.value) {
        return {
          id: row.id,
          is_main: row.is_main,
          ciiu_id: ciiu?.value as number,
          ciiu_code: ciiu?.code ?? '--',
          ciiu_name: ciiu?.description ?? '--',
          city_id: city?.value as number,
          city_code: city?.code ?? '--',
          city_name: city?.name ?? '--',
        }
      }
      return row
    })

    // Actualizar los datos y propiedades de la tabla
    dataTableThirdParties.value.data = updatedData
    dataTableThirdParties.value.total = updatedData.length
    tableProperties.rows = [...dataTableThirdParties.value.data]

    // Persistir cambios y resetear formulario
    saveToStore()
    onResetForm()
    isActivityGeneratorOpen.value = false
  }

  const setMainItem = (id: number | string) => {
    dataTableThirdParties.value.data = [
      ...dataTableThirdParties.value.data.map((item) => ({
        ...item,
        is_main: item.id === id,
      })),
    ]

    dataTableThirdParties.value.total = dataTableThirdParties.value.data.length

    tableProperties.rows = [...dataTableThirdParties.value.data]
    saveToStore()
  }

  const deleteRecord = (id: number | string, is_main: boolean) => {
    // Función para filtrar por ID
    const filterById = (item: { id: number }) => item.id !== id

    // Actualizar data y tablas
    dataTableThirdParties.value.data =
      dataTableThirdParties.value.data?.filter(filterById) ?? []

    if (is_main) {
      setMainItem(
        dataTableThirdParties.value.data[
          dataTableThirdParties.value.data.length - 1
        ]?.id ?? null
      )
    }

    tableProperties.rows = [...dataTableThirdParties.value.data]

    // Notificación y guardar estado
    setTimeout(() => {
      showAlert(`Registro eliminado exitosamente`, 'success', undefined, 1000)
      saveToStore()
    }, 500)
  }

  const editRecord = async (row: IThirdPartiesTable, id: number) => {
    entityId.value = id

    isActivityGeneratorOpen.value = true

    await nextTick(() => {
      itemToEdit.value = {
        id: entityId.value as number,
        ciiu: {
          code: row.ciiu_code ?? '',
          name: row.ciiu_name ?? '',
          id: row.ciiu_id ?? 0,
        },
        city: {
          name: row.city_name ?? '',
          id: row.city_id ?? 0,
        },
      }
    })
  }

  const _setValueModels = () => {
    const data = data_table_activities_ciius.value ?? null
    if (['create', 'edit'].includes(props.formType)) {
      if (data && data.length > 0) {
        tableProperties.rows = [...data]
        dataTableThirdParties.value.data = [...data]
        dataTableThirdParties.value.total = Number(data)
      }
    }
  }

  const setFormView = () => {
    const data: IThirdParty = props.data

    if (data) {
      tableProperties.rows = data.economic_activities.map((ea) => {
        const ciiu = ciius.value.find((ciiu) => ea.ciiu_id === ciiu.value)
        return {
          id: ea.id ?? null,
          ciiu_id: ea.ciiu_id ?? null,
          ciiu_code: ciiu?.code ?? null,
          ciiu_name: ciiu?.description ?? null,
          city_id: ea.city_id ?? null,
          city_code: ea.city?.code ?? null,
          city_name: ea.city?.name ?? null,
          is_main: ea.is_main ?? false,
          saved: true,
        }
      }) as IThirdPartiesTable[]

      dataTableThirdParties.value.data = [...tableProperties.rows]
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

  onMounted(async () => {
    // getResources('keys[]=cities&keys[]=ciius')
    if (props.formType === 'view') {
      tableProperties.columns?.splice(
        tableProperties.columns.findIndex((obj: { name?: string }) => {
          return obj.name == 'actions'
        }),
        1
      )
    }

    handlerActionForm(props.formType)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    }
  )

  return {
    models,
    isActivityGeneratorOpen,
    customColumns,
    tableProperties,
    itemToEdit,
    formElementRef,
    ciius,
    cities,
    isLoading,

    addToTable,
    editRecord,
    deleteRecord,
    setMainItem,
    handleSave,
  }
}
