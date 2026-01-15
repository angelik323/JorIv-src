// quasar - vue - pinia
import { QTable } from 'quasar'
import { watch, ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType, IResource } from '@/interfaces/global'
import { ITrustBusinessRegisterThird } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

// composables
import {
  useAlert,
  useBigNumbers,
  useMainLoader,
  useRules,
  useUtils,
} from '@/composables'
const { createBigNumber } = useBigNumbers()
const { defaultIconsLucide } = useUtils()

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

const useDataModalThirds = (
  props: {
    action: ActionType
    data?: ITrustBusinessRegisterThird[] | null
    title?: string
    type_resource?: number
  },
  emit: Function
) => {
  // loader
  const { openMainLoader } = useMainLoader()

  // alert
  const { showAlert } = useAlert()

  // imports
  const { business_trust_third_parties } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { _dowloadTemplateTrustors, _uploadMassiveTrustBusinessList } =
    useTrustBusinessStore('v2')

  // computed
  const hasInvalidRows = computed(() => {
    const ids = localModels.value.business_resources.map(
      (item) => item.third_party_id
    )
    const duplicatedIds = ids.filter(
      (id, index) => id && ids.indexOf(id) !== index
    )

    return localModels.value.business_resources.some(
      (item) =>
        !item.third_party_id ||
        item.third_party_id === 0 ||
        !item.percentage_participation ||
        Number(item.percentage_participation) === 0 ||
        Number(item.percentage_participation) > 100 ||
        !/^\d+(\.\d{1,10})?$/.test(item.percentage_participation) ||
        duplicatedIds.includes(item.third_party_id)
    )
  })

  // table
  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'third_party_id',
        required: true,
        field: 'third_party_id',
        label: 'Cliente',
        align: 'center',
        sortable: true,
        style: styleColumn(150),
      },
      {
        name: 'percentage_participation',
        field: 'percentage_participation',
        required: true,
        label: '% de participación',
        align: 'center',
        sortable: true,
        style: styleColumn(50),
      },
      {
        name: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        field: 'actions',
      },
    ] as QTable['columns'],
    rows: [] as ITrustBusinessRegisterThird[],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const pageSize = ref(20)

  const paginated = computed(() => {
    const start = (tableProps.value.pages.currentPage - 1) * pageSize.value
    return tableProps.value.rows.slice(start, start + pageSize.value)
  })

  const update_rows_per_page = (val: number) => {
    pageSize.value = val
    tableProps.value.pages.currentPage = 1
  }

  // refs
  const total_percentaje = ref<number | string>(0)
  const fileInput = ref<HTMLInputElement | null>(null)
  const data_select = ref<IResource[]>([])
  const all_third_parties = ref<IResource[]>([])

  const localModels = ref<{
    business_resources: ITrustBusinessRegisterThird[]
  }>({
    business_resources: JSON.parse(JSON.stringify(props.data || [])),
  })

  // delete modal
  const deleteModalRef = ref()
  const deleteRowSelected = ref<ITrustBusinessRegisterThird | null>(null)

  // actions
  const addRowTable = () => {
    const aux: ITrustBusinessRegisterThird = {
      third_party_id: null,
      percentage_participation: '',
      type_resource: props.type_resource,
      third_party: null,
    }

    localModels.value.business_resources?.push(aux)
  }

  const onSubmit = async () => {
    if (Number(total_percentaje.value) > 100) {
      showAlert('Campo', 'error', undefined, TIMEOUT_ALERT)
      return
    }
    emit('update:models', transformDataResource())
  }

  const cancel = async () => {
    emit('cancel')
  }

  const deleteRegister = (row: ITrustBusinessRegisterThird) => {
    deleteRowSelected.value = row
    deleteModalRef.value?.openModal()
  }

  const updateThirdPartyId = (
    row: ITrustBusinessRegisterThird,
    value: number | null
  ) => {
    const index = localModels.value.business_resources?.findIndex(
      (item) => item === row
    )
    if (index !== -1 && index !== undefined) {
      localModels.value.business_resources[index].third_party_id = value
    }
  }

  const updatePercentage = (
    row: ITrustBusinessRegisterThird,
    value: string | null
  ) => {
    const index = localModels.value.business_resources?.findIndex(
      (item) => item === row
    )
    if (index !== -1 && index !== undefined) {
      localModels.value.business_resources[index].percentage_participation =
        value
    }
  }

  const confirmDelete = () => {
    if (!deleteRowSelected.value) return

    const index = localModels.value.business_resources?.findIndex(
      (item) => item === deleteRowSelected.value
    )

    if (index !== -1 && index !== undefined) {
      const total = localModels.value.business_resources?.length ?? 0

      if (total === 1) {
        localModels.value.business_resources[index] = {
          third_party_id: null,
          percentage_participation: '',
          type_resource: props.type_resource,
          third_party: null,
        }
        showAlert(
          'Registro eliminado exitosamente',
          'success',
          undefined,
          TIMEOUT_ALERT
        )
      } else {
        localModels.value.business_resources?.splice(index, 1)
        showAlert(
          'Registro eliminado exitosamente',
          'success',
          undefined,
          TIMEOUT_ALERT
        )
      }
    }

    deleteModalRef.value?.closeModal()
    deleteRowSelected.value = null
  }

  // files
  const downloadTemplate = async () => {
    await _dowloadTemplateTrustors()
  }

  const triggerFileUpload = () => {
    fileInput.value?.click()
  }

  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    openMainLoader(true)
    if (file) {
      const data = await _uploadMassiveTrustBusinessList(
        Number(props.type_resource),
        file
      )
      localModels.value.business_resources = [
        ...localModels.value.business_resources,
        ...(await data),
      ]
    }

    openMainLoader(false)
    target.value = ''
  }

  const transformDataResource = () => {
    return localModels.value.business_resources.map((item) => {
      const found = all_third_parties.value.find(
        (ds) => ds.id === item.third_party_id
      )
      return {
        ...item,
        third_party: found
          ? {
              ...found,
            }
          : null,
      }
    })
  }

  // lifecycles
  onMounted(async () => {
    localModels.value.business_resources = props.data
      ? JSON.parse(JSON.stringify(props.data))
      : []
    all_third_parties.value = business_trust_third_parties.value
    data_select.value = business_trust_third_parties.value
  })

  // watch
  watch(
    () => localModels.value.business_resources,
    () => {
      tableProps.value.rows = localModels.value.business_resources ?? []
      const sum = localModels.value.business_resources.reduce((total, item) => {
        const value = createBigNumber(item.percentage_participation || 0)
        return total.plus(value)
      }, createBigNumber(0))

      total_percentaje.value = sum.toFixed(10).replace(/\.?0+$/, '')
    },
    { deep: true }
  )

  watch(
    [() => tableProps.value.rows, () => pageSize.value],
    () => {
      tableProps.value.pages.lastPage = Math.ceil(
        tableProps.value.rows.length / pageSize.value
      )
    },
    { deep: true }
  )

  return {
    tableProps,
    total_percentaje,
    localModels,
    fileInput,
    data_select,
    hasInvalidRows,
    pageSize,
    paginated,
    defaultIconsLucide,
    deleteModalRef,

    update_rows_per_page,
    handleFileChange,
    triggerFileUpload,
    downloadTemplate,
    addRowTable,
    deleteRegister,
    confirmDelete,
    onSubmit,
    cancel,
    useRules,
    updateThirdPartyId,
    updatePercentage,
  }
}

export default useDataModalThirds
