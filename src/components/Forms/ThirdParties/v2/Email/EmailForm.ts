import { IEmailForm } from '@/interfaces/global'
import {
  IEmailData,
  IEmail,
  IThirdParty,
} from '@/interfaces/global/ThirdParties'
import { QTable } from 'quasar'
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useThirdPartiesStore } from '@/stores'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useEmailForm = (props: any) => {
  const { _setEmailState } = useThirdPartiesStore()
  const { emailState } = storeToRefs(useThirdPartiesStore())

  const formValues = ref<IEmailForm>({
    emails: [],
  })
  const emailForm = ref<IEmailData>({
    email: '' as string,
    isMain: false,
  })
  const isEmailGeneratorOpen = ref(false)
  const itemToEdit = ref<IEmail | undefined>(undefined)
  const formElementRef = ref()

  const customColumns = ['isMain', 'actions']
  const tableProperties = reactive({
    title: 'Listado de correos electrónicos',
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
        name: 'email',
        required: true,
        label: 'Dirección de correo electrónico',
        align: 'left',
        field: 'email',
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
    rows: computed(() => formValues.value?.emails.toReversed() || []),
  })

  const handleOptions = async (option: string, row?: IEmailData) => {
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

  const handleCreation = (item: IEmail) => {
    if (item.id) return

    formElementRef.value.validate().then((success: boolean) => {
      if (!success) return

      const itemWithId: IEmail = {
        ...item,
        id: `temp-${Math.random().toString(36).substr(2, 9)}`,
      }
      handleSave(itemWithId)
    })
  }

  const handleEdition = (item: IEmail) => {
    itemToEdit.value = item ? { ...item } : undefined
    isEmailGeneratorOpen.value = true
  }

  const handleSave = (newItem: IEmail) => {
    if (!newItem.id) return

    const { emails } = formValues.value
    const index = emails.findIndex((item) => item.id === newItem.id)

    if (index !== -1) {
      // Se edita el registro en el array
      emails[index] = { ...emails[index], ...newItem }
    } else {
      // Se agrega un nuevo registro
      const itemData: IEmailData = {
        ...newItem,
        isMain: false,
      }

      if (itemData.id) {
        emails.push({ ...itemData })
        setMainItem(itemData.id)
        clearAll()
      }
    }
  }

  const setMainItem = (id: number | string | null) => {
    formValues.value.emails = formValues.value.emails.map((item) => ({
      ...item,
      isMain: item.id === id,
    }))
  }

  const deleteItem = (id: number | string, is_main: boolean) => {
    formValues.value.emails = formValues.value.emails.filter(
      (item) => item.id !== id
    )

    if (is_main) {
      setMainItem(
        formValues.value.emails[formValues.value.emails.length - 1]?.id ?? null
      )
    }
  }

  const clearAll = () => {
    emailForm.value.email = undefined
    formElementRef.value.reset()
  }

  watch(
    formValues,
    (newValue: IEmailForm) => {
      _setEmailState(newValue)
    },
    { deep: true }
  )

  const initData = () => {
    if (!emailState.value) return
    formValues.value = { ...emailState.value }
  }

  const clearForm = () => {
    setTimeout(() => {
      formElementRef.value?.reset()
    }, 500)
  }

  const setFormView = () => {
    clearForm()
    const data: IThirdParty = props.data
    const { emails } = formValues.value

    if (data) {
      emails.push(
        ...data.emails.map(
          (email) =>
            ({
              id: email.id,
              isMain: email.is_main,
              email: email.email_address,
            } as IEmailData)
        )
      )
    }
  }

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: initData,
      edit: emailState.value ? initData : setFormView,
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

  return {
    emailForm,
    isEmailGeneratorOpen,
    customColumns,
    tableProperties,
    itemToEdit,
    formElementRef,
    handleOptions,
    setMainItem,
    handleSave,
  }
}
