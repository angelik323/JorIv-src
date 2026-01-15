// vue - pinia - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { QTable } from 'quasar'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType } from '@/interfaces/global/Action'
import { INotificationAuthorizeTrustBusiness } from '@/interfaces/customs/trust-business/v2/TrustBusinessManagement'
import { ISaleRealStateResource } from '@/interfaces/customs/resources/TrustBusiness'

// stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'

// composables
import { useUtils, useRules, useAlert } from '@/composables'
const { showAlert } = useAlert()

const { defaultIconsLucide } = useUtils()
const { is_required, not_exist_in_array } = useRules()

const useNotification = (
  props: {
    data?: INotificationAuthorizeTrustBusiness[]
    action: ActionType
    title: string
  },
  emit: Function
) => {
  // imports
  const { business_trust_third_parties } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  // computed
  const is_view = computed(() => props.action === 'view')

  const data_select = ref<ISaleRealStateResource[]>([])
  const all_third_parties = ref<ISaleRealStateResource[]>([])

  const idsInArray = computed(() =>
    tableProps.value.rows.map((fl) => {
      return fl.third_party_id
    })
  )

  const _setValueModel = () => {
    if (props.data) {
      tableProps.value.rows = [...props.data]
    }
  }

  // table
  const tableProps = ref({
    title: `Listado de ${props.title.toLowerCase()}`,
    loading: false,
    columns: [
      {
        name: 'third_party_id',
        required: true,
        field: 'third_party_id',
        label: '#',
        align: 'center',
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        field: 'name',
        label: 'Nombre',
        align: 'center',
        sortable: true,
      },
      {
        name: 'email',
        field: 'email',
        required: true,
        label: 'Correo electrónico',
        align: 'center',
        sortable: true,
      },
      {
        name: 'phone',
        required: true,
        field: 'phone',
        label: 'Teléfono',
        align: 'center',
        sortable: true,
      },
      {
        name: 'extension',
        required: true,
        field: 'extension',
        label: 'Extensión',
        align: 'center',
        sortable: true,
      },
      {
        name: 'address',
        required: true,
        field: 'address',
        label: 'Dirección física',
        align: 'center',
        sortable: true,
      },
      ...(is_view.value
        ? []
        : [
            {
              name: 'actions',
              field: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              sortable: true,
            },
          ]),
    ] as QTable['columns'],
    rows: [] as INotificationAuthorizeTrustBusiness[],
    pages: {
      currentPage: ref(1),
      lastPage: ref(1),
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

  // actions
  const addRow = () => {
    tableProps.value.rows.unshift({
      type: props.title === 'Notificaciones' ? 'Notificación' : 'Autorización',
    } as INotificationAuthorizeTrustBusiness)
  }

  const deleteRow = () => {
    tableProps.value.rows = tableProps.value.rows.filter(
      (item) => item !== alertModalConfig.value.row
    )
    alertModalConfig.value.row = null

    showAlert('Registro eliminado exitosamente', 'success')

    alertModalRef.value.closeModal()
  }

  const getOptions = (row: INotificationAuthorizeTrustBusiness) => {
    return business_trust_third_parties.value.filter(
      (item) =>
        !tableProps.value.rows.some(
          (r) => r.third_party_id === item.id && r !== row
        )
    )
  }

  const updateRow = (row: INotificationAuthorizeTrustBusiness, id: number) => {
    row.third_party_id = id
    const found = all_third_parties.value.find((tp) => tp.id === id)
    if (found) {
      row.name = found.name ?? ''
      row.email = found.email ?? ''
      row.phone = found.phone ?? ''
      const match = found.phone ? found.phone.match(/\(([^)]+)\)/) : null
      row.extension = match ? match[1] : ''
      row.address = found.address ?? ''
    }
  }

  // modal
  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    row: null as INotificationAuthorizeTrustBusiness | null,
  })

  const openAlertModal = async (row: INotificationAuthorizeTrustBusiness) => {
    alertModalConfig.value.row = row
    alertModalConfig.value.description = `¿Desea eliminar el registro de ${props.title.toLowerCase()}?`
    await alertModalRef.value.openModal()
  }

  // lifecycle
  onMounted(async () => {
    await _setValueModel()
    all_third_parties.value = business_trust_third_parties.value
    data_select.value = business_trust_third_parties.value
  })

  // watchs
  watch(
    () => tableProps.value.rows,
    () => {
      if (tableProps.value.rows.length === 0) {
        emit('update:models', [])
      } else {
        emit('update:models', [...tableProps.value.rows])
      }
    },
    { deep: true }
  )

  return {
    defaultIconsLucide,
    is_view,
    idsInArray,
    data_select,
    alertModalConfig,
    alertModalRef,

    tableProps,
    paginated,

    addRow,
    deleteRow,
    getOptions,
    updateRow,
    is_required,
    not_exist_in_array,
    update_rows_per_page,
    openAlertModal,
  }
}

export default useNotification
