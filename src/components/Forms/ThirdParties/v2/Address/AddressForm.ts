import { IAddressLocationForm } from '@/interfaces/global'
import {
  ILocation,
  ILocationData,
  IThirdParty,
} from '@/interfaces/global/ThirdParties'
import { QTable } from 'quasar'
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThirdPartiesStore } from '@/stores'
import { useAlert } from '@/composables'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAddressForm = (props: any) => {
  const { _setAddressLocationForm } = useThirdPartiesStore()
  const { addressLocationForm } = storeToRefs(useThirdPartiesStore())
  const { showAlert } = useAlert()

  const formElementRef = ref()
  const formValues = ref<IAddressLocationForm>({
    locations: [],
    other: 'test',
  })
  const isAddressGeneratorOpen = ref(false)
  const locationToEdit = ref<ILocation | undefined>(undefined)

  const customColumns = ['isMain', 'actions']
  const tableProperties = reactive({
    title: 'Listado de dirección de residencia',
    loading: false,
    columns: [
      {
        name: 'isMain',
        required: true,
        label: 'Principal',
        align: 'left',
        field: 'isMain',
        sortable: true,
      },
      {
        name: 'country',
        required: true,
        label: 'País',
        align: 'left',
        field: (row) => row.country?.name,
        sortable: true,
      },
      {
        name: 'department',
        required: true,
        label: 'Departamento/estado',
        align: 'left',
        field: (row) => row.department?.name ?? 'Sin información',
        sortable: true,
      },
      {
        name: 'city',
        required: true,
        label: 'Ciudad',
        align: 'left',
        field: (row) => row.city?.name ?? 'Sin información',
        sortable: true,
      },
      {
        name: 'address',
        label: 'Dirección completa',
        align: 'left',
        field: (row) => row.address,
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
    rows: computed(() => formValues.value?.locations.toReversed() || []),
  })

  const handleOptions = async (option: string, row?: ILocationData) => {
    switch (option) {
      case 'create':
        handleLocationCreation()
        break
      case 'edit':
        if (row) handleLocationEdition(row)
        break
      case 'delete':
        if (row?.id) deleteLocation(row.id, row.isMain)
        break
      default:
        break
    }
  }

  const handleLocationCreation = () => openAddressGenerator()
  const handleLocationEdition = (location: ILocation) =>
    openAddressGenerator(location)

  const openAddressGenerator = (location?: ILocation) => {
    locationToEdit.value = location ? { ...location } : undefined
    isAddressGeneratorOpen.value = true
  }

  const handleSaveAddress = (newItem: ILocation) => {
    if (!newItem.id) return

    const { locations } = formValues.value
    const index = locations.findIndex((item) => item.id === newItem.id)

    if (index !== -1) {
      // Se edita el registro en el array
      locations[index] = { ...locations[index], ...newItem }
    } else {
      // Se agrega un nuevo registro
      const itemData: ILocationData = {
        ...newItem,
        isMain: false,
      }

      if (itemData.id) {
        if (locations.length === 5)
          return showAlert(
            'Solo se permiten 5 registros',
            'error',
            undefined,
            1000
          )
        locations.push({ ...itemData })
        setMainItem(itemData.id)
      }
    }
  }

  const setMainItem = (id: number | string | null) => {
    formValues.value.locations = formValues.value.locations.map((item) => ({
      ...item,
      isMain: item.id === id,
    }))
  }

  const deleteLocation = (id: number | string, is_main: boolean) => {
    formValues.value.locations = formValues.value.locations.filter(
      (loc) => loc.id !== id
    )

    if (is_main) {
      setMainItem(
        formValues.value.locations[formValues.value.locations.length - 1]?.id ??
          null
      )
    }
  }

  const initData = () => {
    if (!addressLocationForm.value) return
    formValues.value = { ...addressLocationForm.value }
  }

  const clearForm = () => {
    setTimeout(() => {
      formElementRef.value?.reset()
    }, 500)
  }

  const setFormView = () => {
    clearForm()
    const data: IThirdParty = props.data
    const { locations } = formValues.value

    if (data) {
      locations.push(
        ...data.addresses.map(
          (address) =>
            ({ isMain: address.is_main, ...address } as ILocationData)
        )
      )
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: IThirdParty = props.data
    const { locations } = formValues.value

    if (data) {
      locations.push(
        ...data.addresses.map(
          (address) =>
            ({ isMain: address.is_main, ...address } as ILocationData)
        )
      )
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: initData,
      edit: addressLocationForm.value ? initData : setFormEdit,
      view: setFormView,
    }

    actionHandlers[action]?.()
  }

  onMounted(async () => {
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

  watch(
    formValues,
    (newValue: IAddressLocationForm) => {
      _setAddressLocationForm(newValue)
    },
    { deep: true }
  )

  return {
    isAddressGeneratorOpen,
    customColumns,
    tableProperties,
    locationToEdit,
    handleOptions,
    setMainItem,
    handleSaveAddress,
    formElementRef,
  }
}
