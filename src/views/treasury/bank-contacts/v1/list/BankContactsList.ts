import { useBankBranchesStore, useBankContactsStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { ref, watch } from 'vue'
import { QTable } from 'quasar'
import { useRouter } from 'vue-router'
import { useMainLoader } from '@/composables'
import { formatParamsCustom } from '@/utils'
import { IBankContactList } from '@/interfaces/customs/treasury/BankContacts'

const useBankContactsList = () => {
  const router = useRouter()
  const { openMainLoader } = useMainLoader()
  const { _getBankBranchesByEntitiesList } = useBankBranchesStore('v1')
  const { bank_contacts_pages, bank_contacts_list, bank_contacts_request } =
    storeToRefs(useBankContactsStore('v1'))
  const { _deleteBankContacts, _getBankContactsList } =
    useBankContactsStore('v1')
  let perPage = 20

  const tableProps = ref({
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'full_name',
        required: false,
        label: 'Nombre contacto',
        align: 'left',
        field: 'full_name',
        sortable: true,
      },
      {
        name: 'job_title',
        required: true,
        label: 'Cargo',
        align: 'left',
        field: 'job_title',
        sortable: true,
      },
      {
        name: 'area',
        required: true,
        label: 'Área',
        align: 'left',
        field: 'area',
        sortable: true,
      },
      {
        name: 'email',
        required: true,
        label: 'Email',
        align: 'left',
        field: 'email',
        sortable: true,
      },
      {
        name: 'mobile_phone',
        required: true,
        label: 'Celular',
        align: 'left',
        field: 'mobile_phone',
        sortable: true,
      },
      {
        name: 'status',
        required: true,
        label: 'Estado',
        align: 'left',
        field: 'status',
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
    rows: [] as IBankContactList[],
    pages: bank_contacts_pages,
    rowsPerPage: perPage,
  })

  const alertModalRef = ref()

  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el contacto bancario?',
    id: null as number | null,
  })

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit':
        router.push({ name: 'BankContactsEdit', params: { id } })
        break
      case 'delete':
        if (id) {
          alertModalConfig.value.id = id
          await alertModalRef.value.openModal()
        }
        break
      default:
        break
    }
  }

  const listAction = async (filterString: string = '') => {
    tableProps.value.loading = true
    tableProps.value.rows = []

    await _getBankBranchesByEntitiesList(
      filterString,
      bank_contacts_request.value?.bank_id ?? 0
    )
    await _getBankContactsList(
      filterString,
      bank_contacts_request.value?.bank_id ?? 0
    )

    tableProps.value.loading = false
  }
  const deleteBankContacts = async () => {
    openMainLoader(true)
    await alertModalRef.value.closeModal()
    if (!alertModalConfig.value.id) return
    await _deleteBankContacts(alertModalConfig.value.id)
    await listAction()
    openMainLoader(false)
  }

  const filtersFormat = ref<Record<string, string | number>>({})

  const updatePage = (page: number) => {
    filtersFormat.value = {
      ...filtersFormat.value,
      page: page,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  const updatePerPage = (rowsPerPage: number) => {
    perPage = rowsPerPage
    filtersFormat.value = {
      ...filtersFormat.value,
      rows: perPage,
    }
    const queryString = formatParamsCustom(filtersFormat.value)

    listAction(queryString ? '&' + queryString : '')
  }

  watch(
    () => bank_contacts_list.value,
    () => {
      tableProps.value.rows = bank_contacts_list.value
    }
  )
  watch(
    () => bank_contacts_pages.value,
    () => {
      tableProps.value.pages = bank_contacts_pages.value
    }
  )

  return {
    tableProps,
    alertModalRef,
    alertModalConfig,
    handleOptions,
    deleteBankContacts,
    updatePage,
    updatePerPage,
  }
}

export default useBankContactsList
