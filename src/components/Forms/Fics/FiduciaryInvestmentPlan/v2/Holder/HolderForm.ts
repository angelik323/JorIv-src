// Vue - Pinia
import { computed, onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces - Constants
import { IAddresses, IContact } from '@/interfaces/customs/IThirdParties'
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { estate_origin } from '@/constants'
import {
  IFiduciaryInvestmentPlansEmail,
  IFiduciaryInvestmentPlansForm,
  IFiduciaryInvestmentPlansHolder,
  IFiduciaryInvestmentPlansPropsForm,
} from '@/interfaces/customs/fics/FiduciaryInvestmentPlans'

// Composables
import { useUtils } from '@/composables/useUtils'
import { useRules } from '@/composables/useRules'
import { useAlert } from '@/composables/useAlert'

// Stores
import { useFiduciaryInvestmentPlanStore } from '@/stores/fics/fiduciary-investment-plan'
import { useThirdPartyResourceStore } from '@/stores/resources-manager/third-party'
import { useAssetResourceStore } from '@/stores/resources-manager/assets'
import { useFicResourceStore } from '@/stores/resources-manager/fics'

const useHolderForm = (props: IFiduciaryInvestmentPlansPropsForm) => {
  const { calculateCheckDigit, isEmptyOrZero, cleanAddress } = useUtils()
  const {
    only_number,
    length_exactly,
    email_validation,
    no_special_characters,
    no_consecutive_spaces,
  } = useRules()

  const {
    _setDataForm,
    setHolders,
    setSelectedHolder,
    setEmails,
  } = useFiduciaryInvestmentPlanStore('v1')
  const { data_form, holder_tables } = storeToRefs(
    useFiduciaryInvestmentPlanStore('v1')
  )
  const { third_parties } = storeToRefs(useThirdPartyResourceStore('v1'))
  const { print_groups } = storeToRefs(useFicResourceStore('v1'))
  const { cities, legal_people_fund_sources } = storeToRefs(
    useAssetResourceStore('v1')
  )

  const selectedRowCheck = ref<IFiduciaryInvestmentPlansHolder[]>([])
  const selectedRow = ref<number | null>(null)
  const { showAlert } = useAlert()
  const formHolder = ref()
  const alertModalRef = ref()
  const MAX_HOLDERS = 20
  const MAX_EMAILS = 20

  const models = ref<IFiduciaryInvestmentPlansForm>({
    holder_identification: {
      holder_id: null,
      fic_print_group_id: null,
      funding_source: '',
      residential_address: '',
      email_address: '',
      phone: '',
      holder: {
        id: null,
        document: '',
        check_digit: '',
        document_type: {
          name: '',
          abbreviation: '',
        },
        name: '',
        type: '',
        contacts: [],
        addresses: [],
        financialInfo: {
          id: null,
          third_party_id: null,
          funding_source: '',
        },
        natural_person: {
          last_name: '',
          middle_name: '',
          name: '',
          second_last_name: '',
        },
        fundingSourceNaturalPerson: null,
        fundingSourceLegalPerson: null,
      },
    },
    email: '',
    emails: null,
    randomCheck: null,
  })

  const tableHolderProps = ref<
    IBaseTableProps<IFiduciaryInvestmentPlansHolder>
  >({
    title: 'Listado de titulares',
    loading: false,
    wrapCells: true,
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
        name: 'document',
        required: false,
        label: 'Identificación titular',
        align: 'left',
        field: 'document',
        sortable: true,
        format: (item) => (item ? item : '-'),
      },
      {
        name: 'document_type',
        required: false,
        label: 'Tipo de documento',
        align: 'left',
        field: 'document_type',
        sortable: true,
        format: (item) => (item.name ? item.name : '-'),
      },
      {
        name: 'last_name',
        required: false,
        label: 'Primer apellido',
        align: 'left',
        field: 'natural_person',
        sortable: true,
        format: (item) => item?.last_name || '-',
      },
      {
        name: 'second_last_name',
        required: false,
        label: 'Segundo apellido',
        align: 'left',
        field: 'natural_person',
        sortable: true,
        format: (item) => item?.second_last_name || '-',
      },
      {
        name: 'natural_person',
        required: false,
        label: 'Nombres',
        align: 'left',
        field: 'natural_person',
        sortable: true,
        format: (item) =>
          item?.name && item?.middle_name
            ? `${item.name} ${item.middle_name}`
            : '-',
      },
      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'center',
        field: 'id',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tableEmailsProps = ref<IBaseTableProps<IFiduciaryInvestmentPlansEmail>>(
    {
      title: 'Listado de correos',
      loading: false,
      wrapCells: true,
      columns: [
        {
          name: 'email',
          required: false,
          label: 'Correo electrónico',
          align: 'left',
          field: 'email',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'extracts_excel',
          required: false,
          label: 'Extractos excel',
          align: 'left',
          field: 'extracts_excel',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'extracts_pdf',
          required: false,
          label: 'Extractos PDF',
          align: 'left',
          field: 'extracts_pdf',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'daily_balances',
          required: false,
          label: 'Saldos diarios',
          align: 'left',
          field: 'daily_balances',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'files_sftp',
          required: false,
          label: 'Archivos sftp',
          align: 'left',
          field: 'files_sftp',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'participation_document',
          required: false,
          label: 'Documento de participación',
          align: 'left',
          field: 'participation_document',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'files_multicash',
          required: false,
          label: 'Archivos multicash',
          align: 'left',
          field: 'files_multicash',
          sortable: true,
          format: (item) => item || '-',
        },
        {
          name: 'actions',
          required: true,
          label: 'Acciones',
          align: 'center',
          field: 'id',
        },
      ],
      rows: [],
      pages: { currentPage: 0, lastPage: 0 },
    }
  )

  const filteredPrintGroups = computed(() => {
    const selectedFundId = data_form.value?.collective_investment_fund_id

    if (!selectedFundId) {
      return print_groups.value
    }

    const filtered = print_groups.value.filter((printGroup) => {
      return printGroup.fund_id === selectedFundId
    })

    const currentPrintGroupId =
      models.value.holder_identification.fic_print_group_id
    if (currentPrintGroupId) {
      const isValidSelection = filtered.some(
        (pg) => pg.value === currentPrintGroupId
      )

      if (!isValidSelection) {
        models.value.holder_identification.fic_print_group_id = null
        if (data_form.value?.holder_identification) {
          data_form.value.holder_identification.fic_print_group_id = null
        }
      }
    }

    return filtered
  })

  const previousFundId = ref(data_form.value?.collective_investment_fund_id)
  const isInitialLoad = ref(true)

  const validatePrintGroup = computed(() => {
    const selectedId = models.value.holder_identification.fic_print_group_id
    if (!selectedId) return { email: false, fisico: false, address: false }

    const printGroup = filteredPrintGroups.value.find(
      (item) => item.value === selectedId
    )

    if (!printGroup) return { email: false, fisico: false, address: false }
    switch (printGroup.send_type) {
      case 'Envio email':
        return { email: true, fisico: false, address: false }
      case 'Envio fisico':
        return { email: false, fisico: true, address: true }
      case 'Envio fisico y por email':
        return { email: true, fisico: true, address: true }
      case 'No enviar':
        return { email: false, fisico: false, address: false }
      default:
        return { email: false, fisico: false, address: false }
    }
  })

  const fundingSourceOptions = computed(() => {
    const holderId = models.value.holder_identification?.holder_id

    if (!holderId) {
      return []
    }

    const thirdParty = third_parties.value.find(
      (item) => item.value === holderId
    )

    if (!thirdParty) {
      return []
    }

    const isNaturalPerson =
      thirdParty.natural_person &&
      Object.keys(thirdParty.natural_person).length > 0 &&
      Object.values(thirdParty.natural_person).some(
        (value) => value !== null && value !== ''
      )

    if (isNaturalPerson) {
      return estate_origin || []
    } else {
      return legal_people_fund_sources.value || []
    }
  })

  const handlerActionForm = (action: ActionType) => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: setValueModel,
      edit: data_form.value ? setValueModel : setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const setValueModel = () => {
    if (data_form.value) {
      data_form.value.holder_identification =
        data_form.value.holder_identification

      data_form.value.holder_identification.holder_id =
        data_form.value.holder_identification.holder_id ??
        data_form.value.holder_identification.id

      data_form.value.holder_identification.fic_print_group_id =
        data_form.value.holder_identification.fic_print_group_id ??
        data_form.value.holder_identification.fic_print_group?.id

      data_form.value.holder_identification.city_id =
        data_form.value.holder_identification.city_id ??
        data_form.value.holder_identification.city?.id

      data_form.value.holder_identification.funding_source_id =
        data_form.value.holder_identification.funding_source_id ??
        data_form.value.holder_identification.holder?.financialInfo
          ?.funding_source ??
        undefined

      if (props.action == 'edit') {
        data_form.value.holder_identification.holder_id =
          data_form.value.holder_identification.holder?.id

        const dv = calculateCheckDigit(
          data_form.value.holder_identification.holder?.document || ''
        )

        data_form.value.holder_identification?.holder &&
          (data_form.value.holder_identification.holder.check_digit = isNaN(dv)
            ? null
            : dv.toString())

        const isNaturalPerson =
          data_form.value.holder_identification.holder?.natural_person &&
          Object.keys(
            data_form.value.holder_identification.holder.natural_person
          ).length > 0

        data_form.value.holder_identification.funding_source_id =
          (isNaturalPerson
            ? data_form.value.holder_identification?.holder
                ?.fundingSourceNaturalPerson?.source_of_goods
            : data_form.value.holder_identification?.holder
                ?.fundingSourceLegalPerson?.funding_source) || ''
        models.value = { ...data_form.value }

        setEmailsFromData()
      } else {
        models.value = { ...data_form.value }
      }
    }
  }

  const setFormView = () => {
    if (props.data) {
      props.data.holder_identification = props.data.holder_identification

      props.data.holder_identification.holder_id =
        props.data.holder_identification.holder_id ??
        props.data.holder_identification.id

      props.data.holder_identification.fic_print_group_id =
        props.data.holder_identification.fic_print_group_id ??
        props.data.holder_identification.fic_print_group?.id

      props.data.holder_identification.city_id =
        props.data.holder_identification.city_id ??
        props.data.holder_identification.city?.id

      props.data.holder_identification.funding_source_id =
        props.data.holder_identification.funding_source_id ??
        props.data.holder_identification.holder?.financialInfo?.id ??
        undefined

      const dv = calculateCheckDigit(
        props.data.holder_identification.holder?.document || ''
      )

      props.data.holder_identification?.holder &&
        (props.data.holder_identification.holder.check_digit = isNaN(dv)
          ? null
          : dv.toString())

      const isNaturalPerson =
        props.data.holder_identification.holder?.natural_person &&
        Object.keys(props.data.holder_identification.holder.natural_person)
          .length > 0

      models.value.holder_identification.funding_source_id =
        (isNaturalPerson
          ? models.value.holder_identification?.holder
              ?.fundingSourceNaturalPerson?.source_of_goods
          : models.value.holder_identification?.holder?.fundingSourceLegalPerson
              ?.funding_source) || ''
      models.value = { ...props.data }
      setEmailsFromData()
    }
  }

  const setFormEdit = () => {
    if (props.data) {
      props.data.holder_identification = props.data.holder_identification

      props.data.holder_identification.holder_id =
        props.data.holder_identification.holder_id ??
        props.data.holder_identification.id

      props.data.holder_identification.fic_print_group_id =
        props.data.holder_identification.fic_print_group_id ??
        props.data.holder_identification.fic_print_group?.id

      props.data.holder_identification.city_id =
        props.data.holder_identification.city_id ??
        props.data.holder_identification.city?.id

      props.data.holder_identification.funding_source_id =
        props.data.holder_identification.funding_source_id ??
        props.data.holder_identification.holder?.financialInfo?.id ??
        ''

      models.value = { ...props.data }

      models.value.holder_identification?.holder_id
    }
  }

  const getMainAddress = (addresses: IAddresses[] | undefined): string => {
    if (!addresses?.length) return ''

    const mainAddress = addresses.find((addr) => addr.is_main === true)?.address
    const fallbackAddress = addresses[0]?.address

    return cleanAddress(mainAddress) || cleanAddress(fallbackAddress) || ''
  }

  const getContactByType = (
    contacts: IContact[] | undefined,
    contactType: string
  ): string => {
    if (!contacts?.length) return ''

    const mainContact = contacts.find(
      (contact) =>
        contact.is_main === true && contact.contact_type === contactType
    )?.contact_value

    if (mainContact) return mainContact

    const fallbackContact = contacts.find(
      (contact) => contact.contact_type === contactType
    )?.contact_value

    return fallbackContact || ''
  }

  const getPhoneContact = (contacts: IContact[] | undefined): string => {
    if (!contacts?.length) return ''

    const phoneTypes = ['phone', 'mobile']

    const mainPhone = contacts.find(
      (contact) =>
        contact.is_main === true && phoneTypes.includes(contact.contact_type)
    )?.contact_value

    if (mainPhone) {
      return mainPhone.replace(/\D/g, '').replace(/^57/, '')
    }

    const fallbackPhone = contacts.find((contact) =>
      phoneTypes.includes(contact.contact_type)
    )?.contact_value

    return fallbackPhone
      ? fallbackPhone.replace(/\D/g, '').replace(/^57/, '')
      : ''
  }
  const alertModalConfig = ref({
    title: '',
    description: '',
    textBtnConfirm: '',
    textBtnCancel: '',
    id: 0 as number,
    type: 'warning',
  })

  // Holder
  const loadHolderFromTable = (holderId: number | null) => {
    if (!holderId) return
    const thirdParty = third_parties.value.find((item) => item.id === holderId)

    if (!thirdParty) return

    const dv = calculateCheckDigit(thirdParty.document ?? '')

    models.value.holder_identification.holder_id = thirdParty.id
    models.value.holder_identification.city_id =
      thirdParty.addresses?.[0]?.city_id ?? null

    models.value.holder_identification.holder = {
      id: thirdParty.id ?? null,
      document: thirdParty.document ?? '',
      check_digit: isNaN(dv) ? null : dv.toString(),
      document_type: {
        name: thirdParty.document_type?.name ?? '',
        abbreviation: thirdParty.document_type?.abbreviation ?? '',
      },
      name: thirdParty.name ?? '',
      contacts: thirdParty.contacts ?? [],
      addresses: thirdParty.addresses ?? [],
      financialInfo: {
        id: thirdParty.financial_info?.id ?? null,
        third_party_id: thirdParty.id ?? null,
        funding_source: thirdParty.financial_info?.funding_source ?? '',
      },
      natural_person: {
        last_name: thirdParty.natural_person?.last_name ?? '',
        middle_name: thirdParty.natural_person?.middle_name ?? '',
        name: thirdParty.natural_person?.name ?? '',
        second_last_name: thirdParty.natural_person?.second_last_name ?? '',
      },
    }

    const isNaturalPerson =
      thirdParty.natural_person &&
      Object.keys(thirdParty.natural_person).length > 0

    models.value.holder_identification.funding_source_id = isNaturalPerson
      ? thirdParty.estate?.source_of_goods
      : thirdParty.financial_info?.funding_source

    models.value.holder_identification.residential_address = getMainAddress(
      thirdParty.addresses
    )

    models.value.holder_identification.email_address = getContactByType(
      thirdParty.contacts,
      'email'
    )

    models.value.holder_identification.phone = getPhoneContact(
      thirdParty.contacts
    )
  }
  const addHolder = () => {
    if (tableHolderProps.value.rows.length >= MAX_HOLDERS) {
      showAlert(
        `Solo se pueden agregar máximo ${MAX_HOLDERS} titulares`,
        'warning',
        undefined,
        2000
      )
      return
    }

    const holder = third_parties.value.find(
      (item) => item.id === models.value.holder_identification?.holder_id
    )

    if (!holder) return

    const exists = tableHolderProps.value.rows.some(
      (row) => row.id === holder.id
    )
    if (exists) {
      showAlert('El titular ya fue agregado', 'warning', undefined, 2000)
      return
    }
    const isFirst = tableHolderProps.value.rows.length === 0

    const row: IFiduciaryInvestmentPlansHolder = {
      id: holder.id ?? null,
      document: holder.document != null ? String(holder.document) : '',
      document_type: { name: holder.document_type?.name },
      legal_person: { business_name: holder.legal_person?.business_name },
      natural_person: {
        last_name: holder.natural_person?.last_name || '',
        middle_name: holder.natural_person?.middle_name || '',
        name: holder.natural_person?.name || '',
        second_last_name: holder.natural_person?.second_last_name || '',
      },
      main_holder: isFirst,
    }

    tableHolderProps.value.rows = [...tableHolderProps.value.rows, row]

    if (isFirst) {
      selectedRowCheck.value = [row]
      selectedRow.value = row.id ?? null
      loadHolderFromTable(row.id ?? null)
    }
  }
  const removeHolder = (id: number | null) => {
    if (!id) return

    const rows = tableHolderProps.value.rows
    const index = rows.findIndex((row) => row.id === id)
    if (index === -1) return

    const wasMain = rows[index].main_holder === true
    const remaining = rows.filter((row) => row.id !== id)
    tableHolderProps.value.rows = remaining

    if (remaining.length === 0) {
      selectedRow.value = null
      selectedRowCheck.value = []
      return
    }

    if (wasMain) {
      remaining[0].main_holder = true
      selectedRow.value = remaining[0].id ?? null
      selectedRowCheck.value = [remaining[0]]
    }
  }

  const onSelectedRow = (rows: IFiduciaryInvestmentPlansHolder[]) => {
    if (!rows.length || !rows[0].id) return

    const selectedId = rows[0].id
    selectedRow.value = selectedId

    tableHolderProps.value.rows = tableHolderProps.value.rows.map((row) => ({
      ...row,
      main_holder: row.id === selectedId,
    }))

    loadHolderFromTable(selectedId)
  }
  const closeAlertModal = () => {
    alertModalRef.value?.closeModal()
  }
  // Email
  let emailIdCounter = 1
  const addEmail = () => {
    if (tableEmailsProps.value.rows.length >= MAX_EMAILS) {
      showAlert(
        `Solo se pueden agregar máximo ${MAX_EMAILS} emails`,
        'warning',
        undefined,
        2000
      )
      return
    }

    const email = models.value.email?.trim()
    if (!email) return

    const exists = tableEmailsProps.value.rows.some(
      (row) => row.email === email
    )

    if (exists) {
      showAlert('El correo ya fue agregado', 'warning', undefined, 2000)
      return
    }

    const row: IFiduciaryInvestmentPlansEmail = {
      id: emailIdCounter++,
      email,
      extracts_excel: false,
      extracts_pdf: false,
      daily_balances: false,
      files_sftp: false,
      participation_document: false,
      files_multicash: false,
    }

    tableEmailsProps.value.rows = [...tableEmailsProps.value.rows, row]

    models.value.email = ''
  }
  const removeEmail = () => {
    const id = alertModalConfig.value.id
    if (!id) return

    tableEmailsProps.value.rows = tableEmailsProps.value.rows.filter(
      (row) => row.id !== id
    )
    closeAlertModal()
  }

  const setEmailsFromData = () => {
    const emails = models.value.emails
    if (!emails?.length) return

    tableEmailsProps.value.rows = emails.map((item, index) => ({
      id: item.id ?? index + 1,
      email: item.email,
      extracts_excel: !!item.extracts_excel,
      extracts_pdf: !!item.extracts_pdf,
      daily_balances: !!item.daily_balances,
      files_sftp: !!item.files_sftp,
      participation_document: !!item.participation_document,
      files_multicash: !!item.files_multicash,
    }))

    emailIdCounter =
      Math.max(...tableEmailsProps.value.rows.map((r) => r.id ?? 0)) + 1
  }

  const openAlertModal = (id: number | null) => {
    alertModalConfig.value.id = id ?? 0
    const row = tableEmailsProps.value.rows.find((row) => row.id === id)

    if (!row) return
    alertModalConfig.value.title = `¿Esta seguro que desea eliminar el correo ${row.email}?`
    alertModalRef.value?.openModal()
  }

  onMounted(async () => {

    handlerActionForm(props.action)
    setTimeout(() => {
      isInitialLoad.value = false
    }, 100)

    models.value.randomCheck = Math.floor(Math.random() * 10)
    tableHolderProps.value.rows = [...holder_tables.value.holders]
    tableEmailsProps.value.rows = [...holder_tables.value.emails]

    if (holder_tables.value.selected_holder_id) {
      selectedRow.value = holder_tables.value.selected_holder_id
      selectedRowCheck.value = tableHolderProps.value.rows.filter(
        (r) => r.id === holder_tables.value.selected_holder_id
      )
    }
  })

  watch(
    () => data_form.value?.collective_investment_fund_id,
    (newFundId) => {
      if (newFundId !== previousFundId.value) {
        models.value.holder_identification.fic_print_group_id = null

        if (data_form.value?.holder_identification) {
          data_form.value.holder_identification.fic_print_group_id = null
        }

        previousFundId.value = newFundId
      }
    },
    { immediate: false }
  )

  watch(
    () => models.value.holder_identification.city_id,
    () => {
      if (models.value.holder_identification.city_id) {
        const city = cities.value.filter(
          (item) => item.value == models.value.holder_identification.city_id
        )

        if (city) {
          if (!models.value.holder_identification.city) {
            models.value.holder_identification.city = {
              id: null,
              name: '',
              code: '',
            }
          }
          models.value.holder_identification.city.name = city[0].name ?? ''
        }
      } else {
        models.value.holder_identification.city_description = ''
      }
    }
  )

  watch(
    () => props.data,
    (val) => {
      if (val) {
        isInitialLoad.value = true
        handlerActionForm(props.action)
        setTimeout(() => {
          isInitialLoad.value = false
        }, 100)
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataForm(null)
      } else {
        _setDataForm({ ...models.value })
      }
    },
    { deep: true }
  )

  watch(
    () => tableHolderProps.value.rows,
    (rows) => {
      const mainIndex = rows.findIndex((r) => r.main_holder)

      models.value.holder_identifications_list = rows.map((row, index) => ({
        holder_id: row.id ?? null,
        main_holder: index === mainIndex,
      }))
      setHolders(rows)
    }
  )
  watch(
    () => tableEmailsProps.value.rows,
    (rows) => {
      models.value.emails = rows
      setEmails(rows)
    },
    { deep: true }
  )
  watch(
    () => selectedRow.value,
    (id) => {
      setSelectedHolder(id)
    }
  )
  return {
    models,
    cities,
    addEmail,
    addHolder,
    formHolder,
    only_number,
    removeEmail,
    removeHolder,
    third_parties,
    onSelectedRow,
    alertModalRef,
    length_exactly,
    openAlertModal,
    closeAlertModal,
    alertModalConfig,
    tableHolderProps,
    email_validation,
    tableEmailsProps,
    selectedRowCheck,
    validatePrintGroup,
    filteredPrintGroups,
    fundingSourceOptions,
    no_consecutive_spaces,
    no_special_characters,
    legal_people_fund_sources,
  }
}

export default useHolderForm
