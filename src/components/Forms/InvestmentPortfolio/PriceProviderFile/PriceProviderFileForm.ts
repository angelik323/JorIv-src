// Vue
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'

// Composables & Utils
import { isEmptyOrZero } from '@/utils'
import { useRules, useUtils } from '@/composables'

// Interfaces
import { ActionType, StatusID } from '@/interfaces/global'
import type {
  IPriceProviderFileModel,
  IPriceProviderFileFormModel,
  IPriceProviderFileFormViewModel,
  IFileItem,
} from '@/interfaces/customs'

// Stores
import {
  useInvestmentPortfolioResourceStore,
  usePriceProviderFileStore,
} from '@/stores'

const usePriceProviderFileForm = (props: {
  action: ActionType
  data?: IPriceProviderFileModel
  readonly?: boolean
}) => {
  const priceProviderFileForm = ref()
  const { _setDataInformationForm, _updatePriceProviderFile } =
    usePriceProviderFileStore('v1')
  const { price_provider_issuers, name_files_list, date_formats } = storeToRefs(
    useInvestmentPortfolioResourceStore('v1')
  )
  const { data_information_form } = storeToRefs(usePriceProviderFileStore('v1'))

  const isCreate = computed(() => props.action === 'create')
  const isEdit = computed(() => props.action === 'edit')
  const isView = computed(() => props.action === 'view')

  const { defaultIconsLucide } = useUtils()
  const isRowActive = (status: number | { id: number }) => {
    const id = typeof status === 'number' ? status : status.id
    return id === StatusID.ACTIVE
  }
  const models = ref<IPriceProviderFileFormModel>({
    issuers_counterparty_id: '',
    document_third: '',
    description: '',
    files: [],
  })

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'name',
        label: 'Nombre archivo*',
        field: 'name',
        align: 'left',
        sortable: true,
      },
      {
        name: 'prefix',
        label: 'Prefijo*',
        field: 'prefix',
        align: 'left',
        sortable: true,
      },
      {
        name: 'date_format',
        label: 'Formato fecha*',
        field: 'date_format',
        align: 'left',
        sortable: true,
      },
      {
        name: 'extension',
        label: 'Extensión*',
        field: 'extension',
        align: 'left',
        sortable: true,
      },
      {
        name: 'identification',
        label: 'Identificación archivo*',
        field: 'identification',
        align: 'left',
        sortable: true,
      },
      {
        name: 'status_id',
        label: 'Estado',
        field: 'status_id',
        align: 'center',
        sortable: true,
        format: (val: boolean) => (val ? 'Activo' : 'Inactivo'),
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
  })

  const changeHistory = ref({
    created_at: '',
    created_by_user: '',
    updated_at: '',
    updated_by_user: '',
  })

  const { is_required } = useRules()

  const addPriceProviderFileRow = () => {
    models.value.files.push({
      id: 0,
      name: '',
      prefix: '',
      date_format: '',
      extension: '',
      identification: '',
      status_id: 1,
    })
  }

  const deleteFile = (index: number) => {
    if (isCreate.value) {
      models.value.files.splice(index, 1)
    }
  }

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: setForm,
      view: setForm,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_information_form.value) {
      models.value = { ...data_information_form.value }
    }
  }

  const setForm = () => {
    if (props.data) {
      const safeData =
        props.data as Partial<IPriceProviderFileFormViewModel> & {
          change_history?: {
            created_at?: string
            created_by_user?: string
            updated_at?: string
            updated_by_user?: string
          }
        }

      safeData.files = (safeData.files ?? []).map((file) => {
        return {
          ...file,
          status_id: file.status_id,
        }
      })

      const data: IPriceProviderFileFormViewModel = {
        issuers_counterparty_id: Number(safeData.code),
        code: safeData.code ?? '',
        document_third: safeData.document_third ?? '',
        description: safeData.description ?? '-',
        files: safeData.files ?? [],
      }

      models.value = data

      changeHistory.value = {
        created_at: safeData.change_history?.created_at ?? '',
        created_by_user: safeData.change_history?.created_by_user ?? '',
        updated_at: safeData.change_history?.updated_at ?? '',
        updated_by_user: safeData.change_history?.updated_by_user ?? '',
      }
    }
  }

  const columns = computed(
    () =>
      tableProps.value.columns?.filter((col) => {
        if (col.name === 'actions') return isCreate.value
        return true
      }) ?? []
  )

  const updateStatus = async (row: IFileItem, event: boolean) => {
    row.status_id = event ? 1 : 2
    await _updatePriceProviderFile(row.id)
  }

  const handleToggleChange = (row: IFileItem, value: boolean) => {
    if (isEdit.value) {
      updateStatus(row, value)
    } else if (isCreate.value) {
      row.status_id = value ? StatusID.ACTIVE : StatusID.INACTIVE
    }
  }

  watch(
    () => models.value.issuers_counterparty_id,
    () => {
      if (isCreate.value) {
        models.value.description = String(
          price_provider_issuers.value?.[0].description
        )
      }
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

  watch(
    () =>
      models.value.files.map((row) => [
        row.prefix,
        row.date_format,
        row.extension,
      ]),
    () => {
      const today = new Date()

      models.value.files.forEach((row) => {
        if (row.prefix && row.date_format && row.extension) {
          const day = String(today.getDate()).padStart(2, '0')
          const month = String(today.getMonth() + 1).padStart(2, '0')
          const yearFull = String(today.getFullYear())
          const yearShort = yearFull.slice(2)

          let formattedDate = row.date_format
            .replace(/DD/, day)
            .replace(/MM/, month)
            .replace(/AAAA/, yearFull)
            .replace(/AA/, yearShort)

          formattedDate = formattedDate.replace(/[^a-zA-Z0-9]/g, '')

          row.identification = `${row.prefix}${formattedDate}.${row.extension}`
        } else {
          row.identification = ''
        }
      })
    },
    { immediate: true, deep: true }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    models,
    tableProps,
    is_required,
    price_provider_issuers,
    name_files_list,
    date_formats,
    addPriceProviderFileRow,
    deleteFile,
    defaultIconsLucide,
    isRowActive,
    priceProviderFileForm,
    changeHistory,
    isCreate,
    isEdit,
    isView,
    columns,
    handleToggleChange,
  }
}

export default usePriceProviderFileForm
