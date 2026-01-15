import { IPhoneNumberForm } from '@/interfaces/global'
import { IPhoneNumberData, IThirdParty } from '@/interfaces/global/ThirdParties'
import { IPhoneNumber } from '@/interfaces/customs/phoneNumberGenerator'
import { QTable } from 'quasar'
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useResourceStore, useThirdPartiesStore } from '@/stores'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const usePhoneNumberForm = (props: any) => {
  const { _setPhoneNumberState } = useThirdPartiesStore()
  const { phoneNumberState } = storeToRefs(useThirdPartiesStore())

  const { phone_types } = storeToRefs(useResourceStore('v1'))

  const formValues = ref<IPhoneNumberForm>({
    phoneNumbers: [],
  })
  const phoneNumberForm = ref<IPhoneNumberData>({
    type: { id: 'phone', name: 'Fijo' }, //Default
    number: '' as string,
    isMain: false,
  })
  const isNumberGeneratorOpen = ref(false)
  const phoneNumberToEdit = ref<IPhoneNumber | undefined>(undefined)
  const formElementRef = ref()

  const customColumns = ['isMain', 'actions']

  const tableProperties = reactive({
    title: 'Listado de números de teléfonos',
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
        name: 'type',
        required: true,
        label: 'Tipo de teléfono',
        align: 'left',
        field: (row) => row.type.name,
        sortable: true,
      },
      {
        name: 'number',
        required: true,
        label: 'Número de teléfono',
        align: 'left',
        field: (row) => row.number,
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
    rows: computed(() => formValues.value?.phoneNumbers.toReversed() || []),
  })

  const handleOptions = async (option: string, row?: IPhoneNumberData) => {
    switch (option) {
      case 'create':
        if (row) handleCreation(row)
        break
      case 'edit':
        if (row) handleEdition(row)
        break
      case 'delete':
        if (row?.id) deleteItem(row.id, row.isMain)
        break
      default:
        break
    }
  }

  const handleCreation = (item: IPhoneNumber) => {
    if (item.id) return

    formElementRef.value.validate().then((success: boolean) => {
      if (!success) return

      if (formValues.value?.phoneNumbers.length === 5) return

      const itemWithId: IPhoneNumber = {
        ...item,
        id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      }
      handleSave(itemWithId)
      clearAll()
    })
  }

  const handleEdition = (item: IPhoneNumber) => {
    const regex = /\((\+\d+)\)(\d+)/
    const match = item.number?.replace(/\s+/g, '').match(regex)

    phoneNumberToEdit.value = item ? { ...item, code: match?.[1] } : undefined
    isNumberGeneratorOpen.value = true
  }

  const handleSave = (newItem: IPhoneNumber) => {
    if (!newItem.id) return

    const { phoneNumbers } = formValues.value
    const index = phoneNumbers.findIndex((item) => item.id === newItem.id)

    if (index !== -1) {
      // Se edita el registro en el array
      phoneNumbers[index] = { ...phoneNumbers[index], ...newItem }
    } else {
      // Se agrega un nuevo registro
      const itemData: IPhoneNumberData = {
        ...newItem,
        isMain: false,
      }

      if (itemData.id) {
        phoneNumbers.push({ ...itemData })
        setMainItem(itemData.id)
        clearAll()
      }
    }
  }

  const setMainItem = (id: number | string | null) => {
    formValues.value.phoneNumbers = formValues.value.phoneNumbers.map(
      (item) => ({
        ...item,
        isMain: item.id === id,
      })
    )
  }

  const deleteItem = (id: number | string, is_main: boolean) => {
    formValues.value.phoneNumbers = formValues.value.phoneNumbers.filter(
      (item) => item.id !== id
    )

    if (is_main) {
      setMainItem(
        formValues.value.phoneNumbers[formValues.value.phoneNumbers.length - 1]
          ?.id ?? null
      )
    }
  }

  const clearAll = () => {
    phoneNumberForm.value.number = undefined
    formElementRef.value.reset()
  }

  const initData = () => {
    if (!phoneNumberState.value) return
    formValues.value = { ...phoneNumberState.value }
  }

  const clearForm = () => {
    setTimeout(() => {
      formElementRef.value?.reset()
    }, 500)
  }

  const setFormView = () => {
    clearForm()
    const data: IThirdParty = props.data
    const { phoneNumbers } = formValues.value

    if (data) {
      phoneNumbers.push(
        ...data.phones.map(
          (phone) =>
            ({
              id: phone.id,
              isMain: phone.is_main,
              type: {
                name:
                  phone.phone_type === 'mobile'
                    ? 'Celular'
                    : phone.phone_type === 'phone'
                    ? 'Fijo'
                    : '',
                id: phone.phone_type == 'mobile' ? phone.phone_type : 'phone',
              },
              number: phone.phone_number,
            } as IPhoneNumberData)
        )
      )
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: initData,
      edit: phoneNumberState.value ? initData : setFormView,
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
    formValues,
    (newValue: IPhoneNumberForm) => {
      _setPhoneNumberState(newValue)
    },
    { deep: true }
  )

  watch(
    () => phoneNumberForm.value.type?.id,
    () => {
      phoneNumberForm.value.number = undefined
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.formType)
      }
    }
  )

  return {
    phoneNumberForm,
    isNumberGeneratorOpen,
    customColumns,
    tableProperties,
    phoneNumberToEdit,
    formElementRef,
    phone_types,

    // Methods
    handleOptions,
    setMainItem,
    handleSave,
  }
}
