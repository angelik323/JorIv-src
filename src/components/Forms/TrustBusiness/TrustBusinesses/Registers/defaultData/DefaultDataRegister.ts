// quasar - vue - pinia
import { QTable } from 'quasar'
import { watch, ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'

// interfaces
import { ITrustBusinessRequest } from '@/interfaces/customs/trust-business/TrustBusinesses'
import { IResource } from '@/interfaces/global'

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useTrustBusinessStore } from '@/stores/trust-business/trust-businesses'

// composables
import { useAlert, useBigNumbers, useMainLoader } from '@/composables'
const { createBigNumber } = useBigNumbers()

// constants
import { TIMEOUT_ALERT } from '@/constants/alerts'

export const useDefaultDataRegister = (
  props: {
    action: 'create' | 'edit' | 'view'
    data?: ITrustBusinessRequest[] | null
    title?: string
    type_resource?: number
  },
  emit: Function
) => {
  const { business_trust_third_parties } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )
  const { openMainLoader } = useMainLoader()

  const { showAlert } = useAlert()

  const {
    _setBusinessResource,
    _dowloadTemplateTrustors,
    _uploadMassiveTrustBusinessList,
  } = useTrustBusinessStore('v1')

  // computed
  const hasInvalidRows = computed(() => {
    const ids = models.value.business_resources.map(
      (item) => item.third_party_id
    )
    const duplicatedIds = ids.filter(
      (id, index) => id && ids.indexOf(id) !== index
    )

    return models.value.business_resources.some(
      (item) =>
        !item.third_party_id ||
        item.third_party_id === 0 ||
        !item.percentage_participation ||
        Number(item.percentage_participation) > 100 ||
        !/^\d+(\.\d{1,10})?$/.test(item.percentage_participation) ||
        duplicatedIds.includes(item.third_party_id)
    )
  })

  const styleColumn = (width: number = 200) => ({
    'white-space': 'pre-wrap',
    'min-width': `${width}px`,
    'max-width': `${width}px`,
    'overflow-wrap': 'break-word',
  })

  // table
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
    rows: [] as ITrustBusinessRequest[],
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

  // refs
  const total_percentaje = ref<number | string>(0)
  const fileInput = ref<HTMLInputElement | null>(null)
  const data_select = ref<IResource[]>([])

  const models = ref<{
    business_resources: ITrustBusinessRequest[]
  }>({
    business_resources: [],
  })

  // actions
  const addRowTable = () => {
    const aux: ITrustBusinessRequest = {
      third_party_id: null,
      percentage_participation: '',
      type_resource: props.type_resource,
      third_party: null,
    }

    models.value.business_resources?.push(aux)

    data_select.value = business_trust_third_parties.value.filter(
      (item) =>
        !models.value.business_resources.some(
          (resource) => resource.third_party_id === item.id
        )
    )
  }

  const onSubmit = async () => {
    if (Number(total_percentaje.value) > 100) {
      showAlert('Campo', 'error', undefined, TIMEOUT_ALERT)
      return
    }
    _setBusinessResource(
      models.value.business_resources.map((item: ITrustBusinessRequest) => {
        return {
          ...item,
          third_party: business_trust_third_parties.value.find(
            (resource: IResource) => item.third_party_id === resource.id
          ),
        }
      }) as unknown as ITrustBusinessRequest[],
      Number(props.type_resource)
    )
    emit('save')
  }

  const cancel = async () => {
    _setBusinessResource([], Number(props.type_resource))
    emit('save')
  }

  const deleteRegister = (row: ITrustBusinessRequest) => {
    const index = models.value.business_resources?.findIndex(
      (item) => item === row
    )

    if (index !== -1 && index !== undefined) {
      models.value.business_resources?.splice(index, 1)
      _setBusinessResource(
        models.value.business_resources,
        Number(props.type_resource)
      )
    }
  }

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
      models.value.business_resources = [
        ...models.value.business_resources,
        ...(await data),
      ]
    }
    _setBusinessResource(
      models.value.business_resources,
      Number(props.type_resource)
    )
    openMainLoader(false)
    target.value = ''
  }

  // onMounted
  onMounted(async () => {
    models.value.business_resources = props.data ? props.data : []
    data_select.value = business_trust_third_parties.value
  })

  // watch
  watch(
    () => models.value.business_resources,
    () => {
      tableProps.value.rows = models.value.business_resources ?? []
      total_percentaje.value = models.value.business_resources
        .reduce((total, item) => {
          const value = createBigNumber(item.percentage_participation || 0)
          return total.plus(value)
        }, createBigNumber(0))
        .valueOf()
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
    models,
    fileInput,
    data_select,
    hasInvalidRows,
    pageSize,
    paginated,

    handleFileChange,
    triggerFileUpload,
    downloadTemplate,
    addRowTable,
    deleteRegister,
    onSubmit,
    cancel,
  }
}
