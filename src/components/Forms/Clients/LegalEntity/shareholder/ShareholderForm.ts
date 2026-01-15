import {
  IClientsContacts,
  ILegalClientShareholder,
  IShareholder,
} from '@/interfaces/customs'
import { QTable } from 'quasar'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUtils, useAlert } from '@/composables'
import { useClientsStore } from '@/stores'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useShareHolderForm = (props: any) => {
  const { data_shareholder_legal_form } = storeToRefs(useClientsStore('v1'))
  const { _setDataLegalCLientsShareholder } = useClientsStore('v1')
  const { formatFullName, defaultIconsLucide } = useUtils()
  const { showAlert } = useAlert()

  type PersonType = 'Natural' | 'Juridica'
  type FormType = 'create' | 'edit' | 'view'

  const formShareholder = ref()
  const isSelectionOpen = ref(false)
  const isGeneratorOpen = ref(false)
  const personType = ref<PersonType>('Natural')
  const formType = ref<FormType>('create')
  const itemToEdit = ref<IShareholder | undefined>(undefined)

  const models = ref<ILegalClientShareholder>({
    have_shareholder: false,
    shareholders: [],
  })

  const tableProperties = reactive({
    title: 'Listado de accionistas agregados',
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
                lastName: row.first_last_name,
                secondLastName: row.second_last_name,
              })
            : row.social_reason
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
        name: 'shareholder_type',
        required: true,
        label: 'Tipo de accionista',
        align: 'left',
        field: (row) => row.shareholder_type,
        sortable: true,
      },
      {
        name: 'participation_percent',
        required: true,
        label: 'Porcentaje de participación',
        align: 'left',
        field: (row) => `${row.participation_percent}%`,
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
    rows: computed(() => models.value?.shareholders || []),
  })

  const handleOptions = async ({
    option,
    type,
    row,
  }: {
    option: string
    type?: PersonType
    row?: IShareholder
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

  const handleEdition = (shareholder: IShareholder) => {
    if (!shareholder.person_type) return
    openGenerator(shareholder.person_type as PersonType, 'edit', shareholder)
  }

  const handleVisualization = (shareholder: IShareholder) => {
    if (!shareholder.person_type) return
    openGenerator(shareholder.person_type as PersonType, 'view', shareholder)
  }

  const openGenerator = (
    type: PersonType,
    action: FormType,
    shareholder?: IShareholder
  ) => {
    itemToEdit.value = shareholder ? { ...shareholder } : undefined
    personType.value = type
    formType.value = action
    isGeneratorOpen.value = true
  }

  const maxId = () =>
    models.value.shareholders.reduce(
      (max, item) => (item.id !== undefined ? Math.max(max, item.id) : max),
      0
    )

  const handleSave = (newItem: IShareholder) => {
    const { shareholders } = models.value

    const newPercent = parseFloat(newItem.participation_percent || '0')

    if (newItem.shareholder_type === 'Directo') {
      const sum = shareholders
        .filter((e) => e.shareholder_type === newItem.shareholder_type)
        .reduce(
          (acc, r) =>
            r.id === newItem.id
              ? acc
              : acc + Number(r.participation_percent ?? 0),
          0
        )

      const projectedTotal = sum + newPercent

      if (projectedTotal > 100) {
        return showAlert(
          'La participación total de los accionistas directos excede el 100%',
          'error',
          undefined,
          5000
        )
      }
    }

    if (newItem.id) {
      const index = shareholders.findIndex((item) => item.id === newItem.id)
      if (index !== -1) {
        // Se edita el registro en el array
        shareholders[index] = { ...shareholders[index], ...newItem }
      }
    } else {
      const itemData: IShareholder = {
        ...newItem,
        id: maxId() + 1,
      }

      if (itemData.id) {
        // Se agrega un nuevo registro
        shareholders.push({ ...itemData })
      }
    }
  }

  const deleteRow = (id: number | string) => {
    models.value.shareholders = models.value.shareholders.filter(
      (item) => item.id !== id
    )
  }

  const handlerActionForm = (action: FormType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_shareholder_legal_form.value ? _setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setFormView = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.have_shareholder = !!data?.shareholders?.length
      models.value.shareholders =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.shareholders?.map((it: any) => {
          const {
            shareholder_info,
            natural_person,
            legal_person,
            pep_info,
            tax_info,
          } = it

          const shareholder: IShareholder = {
            id: it.id,
            person_type: it.third_party_category ?? null,

            // InfoForm
            shareholder_type: shareholder_info?.shareholder_type_id ?? null,
            beneficial_owner_by_ownership:
              shareholder_info?.beneficiary_ownership ?? null,
            beneficial_owner_by_beneficiaries:
              shareholder_info?.beneficiary_benefits ?? null,
            participation_percent:
              shareholder_info?.participating_percentage ?? null,
            has_control_over_legal_entity:
              shareholder_info?.control_over_legal_person === 'Si',

            // ProfileForm
            document_type_id: it.document_type ?? null,
            document_number: it.document ?? null,
            social_reason: legal_person?.business_name ?? null,
            first_name: natural_person?.name ?? null,
            second_name: natural_person?.middle_name ?? null,
            first_last_name: natural_person?.last_name ?? null,
            second_last_name: natural_person?.second_last_name ?? null,
            expedition_date: natural_person?.issue_date ?? null,
            birth_country: natural_person?.birth_country ?? null,
            incorporation_country: legal_person?.country ?? null,
            expedition_country:
              natural_person?.document_issuance_country ?? null,
            birth_date: natural_person?.birth_date ?? null,
            postal_code: it.addresses?.[0]?.postal_code ?? null,
            country: it.addresses?.[0]?.country ?? null,
            department: it.addresses?.[0]?.department ?? null,
            city: it.addresses?.[0]?.city ?? null,
            address: it.addresses?.[0]?.address ?? null,
            email_contact:
              it.contacts?.find(
                (it: IClientsContacts) => it.contact_type === 'email'
              )?.contact_value ?? null,
            beneficiary_date: shareholder_info?.beneficiary_date ?? null,
            tax_country: tax_info?.country ?? null,
            nationality: tax_info?.nationality ?? null,
            taxpayer_document_number: tax_info?.tin ?? null,
            tax_address: tax_info?.branch_address ?? null,
            legal_phone_number:
              it.contacts?.find(
                (it: IClientsContacts) => it.contact_type === 'phone'
              )?.contact_value ?? null,
            has_international_tax_responsibility:
              tax_info?.foreign_responsibility ?? null,
            has_only_foreign_tax_responsibility:
              tax_info?.has_tax_responsibility_outside_colombia ?? null,

            // PEPForm
            is_pep: pep_info?.is_pep ?? null,
            political_decree_830_2021: pep_info?.is_politician ?? null,
            is_representative_intl_org: pep_info?.is_international_pep ?? null,
            is_pep_international: pep_info?.is_pep_international ?? null,
            has_pep_relative: pep_info?.has_pep_relatives ?? null,
            related_pep_full_name: pep_info?.relatives?.[0]?.full_name ?? null,
            pep_relationship: pep_info?.relatives?.[0]?.relationship ?? null,
            position_held: pep_info?.relatives?.[0]?.position ?? null,

            // TributaryForm HACER VALIDACIONES CAMPOS CUANDO ES JURIDICO O NATURAL
            tributary_has_control_over_legal_entity:
              tax_info?.foreign_responsibility ?? null,
            tributary_country: tax_info?.country ?? null,
            giin_code: tax_info?.giin_code ?? null,
          }
          return shareholder
        }) ?? []
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data = props.data
    if (data) {
      models.value.have_shareholder = !!data?.shareholders?.length
      models.value.shareholders =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data?.shareholders?.map((it: any) => {
          const {
            shareholder_info,
            natural_person,
            legal_person,
            pep_info,
            tax_info,
          } = it

          const shareholder: IShareholder = {
            id: it.id,
            person_type: it.third_party_category ?? null,

            // InfoForm
            shareholder_type: shareholder_info?.shareholder_type_id ?? null,
            beneficial_owner_by_ownership:
              shareholder_info?.beneficiary_ownership ?? null,
            beneficial_owner_by_beneficiaries:
              shareholder_info?.beneficiary_benefits ?? null,
            participation_percent:
              shareholder_info?.participating_percentage ?? null,
            has_control_over_legal_entity:
              shareholder_info?.control_over_legal_person === 'Si',

            // ProfileForm
            document_type_id: it.document_type_id ?? null,
            document_number: it.document ?? null,
            social_reason: legal_person?.business_name ?? null,
            first_name: natural_person?.name ?? null,
            second_name: natural_person?.middle_name ?? null,
            first_last_name: natural_person?.last_name ?? null,
            second_last_name: natural_person?.second_last_name ?? null,
            expedition_date: natural_person?.issue_date ?? null,
            birth_country: natural_person?.birth_country_id ?? null,
            incorporation_country: legal_person?.country_id ?? null,
            expedition_country:
              natural_person?.document_issuance_country_id ?? null,
            birth_date: natural_person?.birth_date ?? null,
            postal_code: it.addresses?.[0]?.postal_code ?? null,
            country: shareholder_info?.country_id ?? null,
            department: shareholder_info?.department_id ?? null,
            city: shareholder_info.city_id ?? null,
            address: shareholder_info?.address ?? null,
            email_contact:
              it.contacts?.find(
                (it: IClientsContacts) => it.contact_type === 'email'
              )?.contact_value ?? null,
            beneficiary_date: shareholder_info?.beneficiary_date ?? null,
            tax_country: tax_info?.country_id ?? null,
            nationality: tax_info?.nationality_id ?? null,
            taxpayer_document_number: tax_info?.tin ?? null,
            tax_address: tax_info?.branch_address ?? null,
            legal_phone_number:
              it.contacts?.find(
                (it: IClientsContacts) => it.contact_type === 'phone'
              )?.contact_value ?? null,
            has_international_tax_responsibility:
              tax_info?.foreign_responsibility ?? null,
            has_only_foreign_tax_responsibility:
              tax_info?.has_tax_responsibility_outside_colombia ?? null,

            // PEPForm
            is_pep: pep_info?.is_pep ?? null,
            political_decree_830_2021: pep_info?.is_politician ?? null,
            is_representative_intl_org: pep_info?.is_international_pep ?? null,
            is_pep_international: pep_info?.is_pep_international ?? null,
            has_pep_relative: pep_info?.has_pep_relatives ?? null,
            related_pep_full_name: pep_info?.relatives?.[0]?.full_name ?? null,
            pep_relationship: pep_info?.relatives?.[0]?.relationship ?? null,
            position_held: pep_info?.relatives?.[0]?.position ?? null,

            // TributaryForm HACER VALIDACIONES CAMPOS CUANDO ES JURIDICO O NATURAL
            tributary_has_control_over_legal_entity:
              tax_info?.foreign_responsibility ?? null,
            tributary_country: tax_info?.country_id ?? null,
            giin_code: tax_info?.giin_code ?? null,
          }
          return shareholder
        }) ?? []
    }
  }

  const _setValueModel = () => {
    if (data_shareholder_legal_form.value) {
      models.value = { ...data_shareholder_legal_form.value }
    }
  }

  const clearForm = () => {
    models.value.have_shareholder = undefined
    models.value.shareholders = []
  }

  const validateTotalPercent = () => {
    const directRows = tableProperties.rows

    const sum = directRows.reduce(
      (acc, r) => acc + Number(r.participation_percent ?? 0),
      0
    )

    return Math.abs(sum - 100) < 0.001
  }

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  watch(
    () => [models.value.have_shareholder, models.value.shareholders],
    () => {
      if (useUtils().isEmpty(models.value)) {
        _setDataLegalCLientsShareholder(null)
      } else {
        _setDataLegalCLientsShareholder({
          have_shareholder: models.value.have_shareholder ?? undefined,
          shareholders: models.value.shareholders ?? [],
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
    formShareholder,
    tableProperties,
    defaultIconsLucide,
    handleOptions,
    handleSave,
    validateTotalPercent,
  }
}

export default useShareHolderForm
