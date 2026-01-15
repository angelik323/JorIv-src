import { IBankContactList } from '@/interfaces/customs'
import {
  useBankingEntitiesStore,
  useBankContactsStore,
  useResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'

const useBankContactsBasicData = (props: any) => {
  const { data_information_form } = storeToRefs(useBankingEntitiesStore('v1'))
  const { data_information_form_contacts, bankingEntitieContactsId } =
    storeToRefs(useBankContactsStore('v1'))

  const { bank_branches_contacts, channel, days, available, status } =
    storeToRefs(useResourceStore('v1'))

  const statusBankContacts = [
    ...status.value.filter((item) => item.value !== 0),
  ]

  const { _setDataBasicBankContacts } = useBankContactsStore('v1')
  const dirty = ref(true)

  const schedule_from_input = ref()
  const schedule_to_input = ref()

  const landlinePhone = ref()
  const mobilePhone = ref()

  const BankContactsBasicDataRef = ref()
  const models = ref<{
    description: string | null
    bank_code: string | null
    status?: number
    code: string | null
    full_name?: string | null
    job_title?: string | null
    area: string | null
    bank_branch_id?: number | null
    mobile_phone?: string | null
    email?: string | null
    preferred_contact_channel?: string | null
    products?: string
    working_days?: string[]
    available_from?: string
    available_to?: string
    landline_phone?: string | null
    status_id?: number
  }>({
    description: '',
    bank_code: '',
    status: 0,
    code: '',
    full_name: null,
    job_title: null,
    area: null,
    bank_branch_id: null,
    landline_phone: null,
    mobile_phone: null,
    email: null,
    preferred_contact_channel: null,
    products: '',
    working_days: [],
    available_from: '',
    available_to: '',
    status_id: 1,
  })

  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: setFormEdit,
      view: setFormView,
    }
    actionHandlers[action]?.()
  }

  const _setValueModel = () => {
    if (data_information_form.value || data_information_form_contacts.value) {
      models.value = {
        description: data_information_form.value?.description ?? null,
        bank_code: data_information_form.value?.bank_code ?? null,
        status: data_information_form.value?.status ?? 0,
        code: data_information_form.value?.code ?? null,
        full_name: data_information_form_contacts.value?.full_name ?? null,
        job_title: data_information_form_contacts.value?.job_title ?? null,
        area: data_information_form_contacts.value?.area ?? null,
        bank_branch_id:
          data_information_form_contacts.value?.bank_branch_id ?? null,
        landline_phone:
          data_information_form_contacts.value?.landline_phone ?? null,
        mobile_phone:
          data_information_form_contacts.value?.mobile_phone ?? null,
        email: data_information_form_contacts.value?.email ?? null,
        preferred_contact_channel:
          data_information_form_contacts.value?.preferred_contact_channel ??
          null,
        products: data_information_form_contacts.value?.products ?? '',
        working_days: data_information_form_contacts.value?.working_days ?? [],
        available_from:
          data_information_form_contacts.value?.available_from ?? '',
        available_to: data_information_form_contacts.value?.available_to ?? '',
      }
    }
  }

  const setFormEdit = () => {
    clearForm()
    const data: IBankContactList = props.data

    if (!data) {
      dirty.value = false
      return
    }
    models.value.description = data_information_form.value?.description ?? ''
    models.value.bank_code = data_information_form.value?.bank_code ?? ''
    models.value.status = data_information_form.value?.status === 1 ? 1 : 0
    models.value.code = data.code ?? ''
    models.value.full_name = data.full_name ?? null
    models.value.job_title = data.job_title ?? null
    models.value.area = data.area ?? null
    models.value.bank_branch_id = data.bank_branch_id ?? null
    models.value.landline_phone = data.landline_phone ?? null
    models.value.mobile_phone = data.mobile_phone ?? null
    models.value.email = data.email ?? null
    models.value.preferred_contact_channel =
      data.preferred_contact_channel ?? null
    models.value.products = data.products ?? ''
    models.value.working_days = data.working_days ?? []
    models.value.available_from = data.available_from ?? ''
    models.value.available_to = data.available_to ?? ''
    models.value.status_id = data.status_id
  }

  const clearForm = () => {
    models.value.description = ''
    models.value.bank_code = ''
    models.value.status = 0
    models.value.code = ''
    models.value.full_name = null
    models.value.job_title = null
    models.value.area = null
    models.value.bank_branch_id = null
    models.value.landline_phone = null
    models.value.mobile_phone = null
    models.value.email = null
    models.value.preferred_contact_channel = null
    models.value.products = ''
    models.value.working_days = []
    models.value.available_from = ''
    models.value.available_to = ''
    models.value.status_id = 1
  }

  const setFormView = () => {
    clearForm()
    const data: IBankContactList = props.data
    if (data) {
      models.value.description = data_information_form.value?.description ?? ''
      models.value.bank_code = data_information_form.value?.bank_code ?? ''
      models.value.status = data_information_form.value?.status ?? 0
      models.value.code = data.code ?? null
      models.value.full_name = data.full_name ?? null
      models.value.job_title = data.job_title ?? null
      models.value.area = data.area ?? null
      models.value.bank_branch_id = data.bank_branch_id ?? null
      models.value.landline_phone = data.landline_phone ?? null
      models.value.mobile_phone = data.mobile_phone ?? null
      models.value.email = data.email ?? null
      models.value.preferred_contact_channel =
        data.preferred_contact_channel ?? null
      models.value.products = data.products ?? ''
      models.value.working_days = data.working_days ?? []
      models.value.available_from = data.available_from ?? ''
      models.value.available_to = data.available_to ?? ''
      models.value.status_id = data.status_id
    }
    _setDataBasicBankContacts(null)
  }

  const isEmpty = (obj: Record<string, any>): boolean => {
    return Object.values(obj).every(
      (value) => value === 0 || value === '' || value === null
    )
  }

  const updateModelValue = <T extends keyof typeof models.value>(
    field: T,
    value: (typeof models.value)[T]
  ) => {
    models.value[field] = (
      typeof value === 'string' ? value.toUpperCase() : value
    ) as (typeof models.value)[T]
  }

  const filteredAvailableTo = computed(() => {
    const fromIndex = available.value.findIndex(
      ({ value }) => value === models.value.available_from
    )

    if (fromIndex === -1) return available.value

    const toIndex = available.value.findIndex(
      ({ value }) => value === models.value.available_to
    )

    if (toIndex !== -1 && toIndex <= fromIndex) {
      models.value.available_to = ''
    }

    return available.value.slice(fromIndex + 1)
  })

  const getBankBranchLabel = (id: number | null): string | null => {
    const branch = bank_branches_contacts.value.find(
      (branch) => branch.value === id
    )
    return branch ? branch.label : null
  }

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    }
  )
  
  watch(
    () => models.value,
    () => {
      if (isEmpty(models.value)) {
        _setDataBasicBankContacts(null)
      } else {
        _setDataBasicBankContacts({
          bank_id: bankingEntitieContactsId.value ?? undefined,
          bank_branch_id: models.value.bank_branch_id ?? null,
          full_name: models.value.full_name ?? '',
          job_title: models.value.job_title ?? '',
          description: models.value.description ?? '',
          area: models.value.area ?? '',
          landline_phone: models.value.landline_phone ?? '',
          mobile_phone: models.value.mobile_phone ?? '',
          email: models.value.email ?? null,
          preferred_contact_channel:
            models.value.preferred_contact_channel ?? null,
          products: models.value.products ?? '',
          working_days: models.value.working_days ?? [],
          available_from: models.value.available_from ?? '',
          available_to: models.value.available_to ?? '',
          status_id: models.value.status_id ?? 0,
        })
      }
    },
    { deep: true }
  )

  watch(
    () => [models.value.landline_phone, models.value.mobile_phone],
    () => {
      if (
        !models.value.landline_phone?.trim().match(/\((\+\d+)\)\s*([\d\s]+)/)
      ) {
        setTimeout(() => {
          landlinePhone.value?.resetValidation()
          models.value.landline_phone = ''
        }, 500)
      }

      if (!models.value.mobile_phone?.trim().match(/\((\+\d+)\)\s*([\d\s]+)/)) {
        setTimeout(() => {
          mobilePhone.value?.resetValidation()
          models.value.mobile_phone = ''
        }, 500)
      }
    }
  )
  
  watch(
    () => models.value.working_days,
    () => {
      if (
        !models.value.working_days ||
        models.value.working_days.length === 0
      ) {
        models.value.available_from = ''
        models.value.available_to = ''
        setTimeout(() => {
          schedule_from_input.value?.resetValidation()
          schedule_to_input.value?.resetValidation()
        }, 500)
      }
    }
  )

  watch(
    () => models.value.area,
    () => {
      models.value.area ??= ''
    }
  )

  watch(
    () => models.value.email,
    () => {
      models.value.email ??= ''
    }
  )

  onMounted(async () => {
    handlerActionForm(props.action)
  })

  return {
    BankContactsBasicDataRef,
    models,
    bank_branches_contacts,
    channel,
    days,
    available,
    statusBankContacts,
    filteredAvailableTo,
    schedule_from_input,
    schedule_to_input,
    landlinePhone,
    mobilePhone,
    updateModelValue,
    getBankBranchLabel,
  }
}

export default useBankContactsBasicData
