/* eslint-disable @typescript-eslint/no-explicit-any */

import { ILegalClientManager, IManager } from '@/interfaces/customs/Clients'
import { QTable } from 'quasar'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUtils } from '@/composables/useUtils'
import { useClientsStore } from '@/stores'

const useManagerForm = (props: any) => {
  const { data_manager_legal_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataLegalCLientsManager } = useClientsStore('v1')
  const { formatFullName } = useUtils()

  type PersonType = 'Natural' | 'Juridica'
  type FormType = 'create' | 'edit' | 'view'

  const formManager = ref()
  const isSelectionOpen = ref(false)
  const isGeneratorOpen = ref(false)
  const personType = ref<PersonType>('Natural')
  const formType = ref<FormType>('create')
  const itemToEdit = ref<IManager | undefined>(undefined)

  const models = ref<ILegalClientManager>({
    board_directors: false,
    managers: [],
  })

  const tableProperties = reactive({
    title: 'Listado de consejo directivo agregados',
    loading: false,
    columns: [
      {
        name: '#',
        required: true,
        label: '#',
        align: 'left',
        field: (row) => row.id,
        sortable: true,
        style: {
          'max-width': '50px',
          'overflow-wrap': 'break-word',
          'white-space': 'break-spaces',
        },
      },
      {
        name: 'person_type',
        required: true,
        label: 'Tipo de persona',
        align: 'left',
        field: (row) => {
          return row.person_type?.toLowerCase() === 'natural'
            ? 'Natural'
            : 'Jurídica'
        },
        sortable: true,
      },
      {
        name: 'name',
        required: true,
        label: 'Nombre / Razón social',
        align: 'left',
        field: (row) => {
          return row.person_type?.toLowerCase() === 'natural'
            ? formatFullName({
                firstName: row.first_name,
                middleName: row.second_name,
                lastName: row.first_lastname,
                secondLastName: row.second_lastname,
              })
            : row.business_name
        },
        sortable: true,
      },
      {
        name: 'document_number',
        required: true,
        label: 'Documento',
        align: 'left',
        field: (row) => row.document_number,
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
    rows: computed(() => models.value?.managers || []),
  })

  const handleOptions = async ({
    option,
    type,
    row,
  }: {
    option: string
    type?: PersonType
    row?: IManager
  }) => {
    switch (option) {
      case 'create':
        if (type) handleCreation(type)
        break
      case 'edit':
        if (row) handleEdition(row)
        break
      case 'view':
        if (row) handleVisualization(row)
        break
      case 'delete':
        if (row?.id) deleteRow(row.id)
        break
      default:
        break
    }
  }

  const handleCreation = (type: PersonType) => openGenerator(type, 'create')

  const handleEdition = (manager: IManager) => {
    if (!manager.person_type) return
    openGenerator(manager.person_type as PersonType, 'edit', manager)
  }

  const handleVisualization = (manager: IManager) => {
    if (!manager.person_type) return
    openGenerator(manager.person_type as PersonType, 'view', manager)
  }

  const openGenerator = (
    type: PersonType,
    action: FormType,
    manager?: IManager
  ) => {
    itemToEdit.value = manager ? { ...manager } : undefined
    personType.value = type
    formType.value = action
    isGeneratorOpen.value = true
  }

  const maxId = () =>
    models.value.managers.reduce(
      (max, item) => (item.id !== undefined ? Math.max(max, item.id) : max),
      0
    )

  const handleSave = (newItem: IManager) => {
    const { managers } = models.value

    if (newItem.id) {
      const index = managers.findIndex((item) => item.id === newItem.id)
      if (index !== -1) {
        // Se edita el registro en el array
        managers[index] = { ...managers[index], ...newItem }
      }
    } else {
      const itemData: IManager = {
        ...newItem,
        id: maxId() + 1,
      }

      if (itemData.id) {
        // Se agrega un nuevo registro
        managers.push({ ...itemData })
      }
    }
  }

  const deleteRow = (id: number | string) => {
    models.value.managers = models.value.managers.filter(
      (item) => item.id !== id
    )
  }

   
  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const handlerActionForm = (action: FormType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_manager_legal_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.board_directors = !!data?.board_members?.length
      models.value.managers =
         
        data?.board_members?.map((it: any) => {
          const { natural_person, pep_info, legal_person } = it

          const manager: IManager = {
            id: it.id,
            person_type: it.third_party_category ?? null,

            // InfoForm
            document_type: it.document_type ?? null,
            document_number: it.document ?? null,
            first_name: natural_person?.name ?? null,
            second_name: natural_person?.middle_name ?? null,
            first_lastname: natural_person?.last_name ?? null,
            second_lastname: natural_person?.second_last_name ?? null,
            business_name: legal_person?.business_name ?? null,

            // PEPForm
            is_pep: pep_info?.is_pep ?? null,
            political_decree_830_2021: pep_info?.is_politician ?? null,
            is_representative_intl_org: pep_info?.is_international_pep ?? null,
            is_pep_international: pep_info?.is_pep_international ?? null,
            has_pep_relative: pep_info?.has_pep_relatives ?? null,
            related_pep_full_name: pep_info?.relatives?.[0]?.full_name ?? null,
            pep_relationship: pep_info?.relatives?.[0]?.relationship ?? null,
            position_held: pep_info?.relatives?.[0]?.position ?? null,
          }
          return manager
        }) ?? []
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.board_directors = !!data?.board_members?.length
      models.value.managers =
         
        data?.board_members?.map((it: any) => {
          const { natural_person, pep_info, legal_person } = it

          const manager: IManager = {
            id: it.id,
            person_type: it.third_party_category ?? null,

            // InfoForm
            document_type: it.document_type_id ?? null,
            document_number: it.document ?? null,
            first_name: natural_person?.name ?? null,
            second_name: natural_person?.middle_name ?? null,
            first_lastname: natural_person?.last_name ?? null,
            second_lastname: natural_person?.second_last_name ?? null,
            business_name: legal_person?.business_name ?? null,

            // PEPForm
            is_pep: pep_info?.is_pep ?? null,
            political_decree_830_2021: pep_info?.is_politician ?? null,
            is_representative_intl_org: pep_info?.is_international_pep ?? null,
            is_pep_international: pep_info?.is_pep_international ?? null,
            has_pep_relative: pep_info?.has_pep_relatives ?? null,
            related_pep_full_name: pep_info?.relatives?.[0]?.full_name ?? null,
            pep_relationship: pep_info?.relatives?.[0]?.relationship ?? null,
            position_held: pep_info?.relatives?.[0]?.position ?? null,
          }
          return manager
        }) ?? []
    }
  }

  const _setValueModel = () => {
    if (data_manager_legal_form.value) {
      models.value = { ...data_manager_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.board_directors = undefined
    models.value.managers = []
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [models.value.board_directors, models.value.managers],
    () => {
      if (isEmpty(models.value)) {
        _setDataLegalCLientsManager(null)
      } else {
        _setDataLegalCLientsManager({
          board_directors: models.value.board_directors ?? undefined,
          managers: models.value.managers ?? [],
        })
      }
    }
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
    isSelectionOpen,
    isGeneratorOpen,
    personType,
    formType,
    itemToEdit,
    formManager,
    tableProperties,
    handleOptions,
    handleSave,
  }
}

export default useManagerForm
