// Vuew
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import {
  IAddressV2,
  IEmailV2,
  IPhoneV2,
  IThirdPartyBillingFormV2,
} from '@/interfaces/customs/settlement-commissions/ThirdPartyBillingV2'
import { ActionType, IBaseTableProps } from '@/interfaces/global'

// Composables
import { useRules, useUtils } from '@/composables'

// Stores
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useThirdPartiesStore } from '@/stores/third-parties'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IThirdPartyBillingFormV2 | null
  },
  emit: Function
) => {
  const { _getByIdAction } = useThirdPartiesStore()
  const { is_required } = useRules()
  const { isEmptyOrZero, defaultIconsLucide } = useUtils()

  const { thirdpartie_request } = storeToRefs(useThirdPartiesStore())

  const { business_trust_third_parties } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const { business_trusts_value_is_code } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const formElementRef = ref()

  const initialModelsValues: IThirdPartyBillingFormV2 = {
    business_code_snapshot: null,
    third_party_id: null,
    created_date: null,
    emails: [],
    phones: [],
    addresses: [],

    status: null,
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const modalAddressRef = ref()
  const editAddress = ref(false)

  const modelsAddress = ref<IAddressV2>({
    is_main: false,
    address: null,
    country_id: null,
    department_id: null,
    city_id: null,
    phone: null,
    phone_extra: null,
  })

  const tablePropsAddress = ref<IBaseTableProps<IAddressV2>>({
    title: 'Listado de direcciones',
    loading: false,
    wrapCells: true,
    columns: [
      ...(props.action === 'view'
        ? []
        : [
            {
              name: 'is_main',
              field: 'is_main',
              required: true,
              label: 'Principal',
              align: 'center',
              sortable: false,
            } as const,
          ]),
      {
        name: 'id',
        field: (row) => row.id ?? '--',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'country_id',
        field: (row) => row.country?.name ?? '-',
        required: true,
        label: 'País',
        align: 'left',
        sortable: true,
      },
      {
        name: 'department_id',
        field: (row) => row?.department?.name ?? '-',
        required: true,
        label: 'Departamento/estado',
        align: 'left',
        sortable: true,
      },
      {
        name: 'city_id',
        field: (row) => row?.city?.name ?? '-',
        required: true,
        label: 'Ciudad',
        align: 'left',
        sortable: true,
      },
      {
        name: 'address',
        field: 'address',
        required: true,
        label: 'Dirección completa',
        align: 'left',
        sortable: true,
        format: (val) => val ?? '-',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropsPhone = ref<IBaseTableProps<IPhoneV2>>({
    title: 'Listado de números de teléfonos',
    loading: false,
    wrapCells: true,
    columns: [
      ...(props.action === 'view'
        ? []
        : [
            {
              name: 'is_main',
              field: 'is_main',
              required: true,
              label: 'Principal',
              align: 'center',
              sortable: false,
            } as const,
          ]),
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'phone_type',
        field: 'phone_type',
        required: true,
        label: 'Tipo de teléfono',
        align: 'left',
        sortable: true,
        format: (val) =>
          val === 'mobile' ? 'Celular' : val === 'fixed' ? 'Fijo' : val,
      },
      {
        name: 'phone_number',
        field: 'phone_number',
        required: true,
        label: 'Número de teléfono',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const tablePropsEmail = ref<IBaseTableProps<IEmailV2>>({
    title: 'Listado de correos electrónicos',
    loading: false,
    wrapCells: true,
    columns: [
      ...(props.action === 'view'
        ? []
        : [
            {
              name: 'is_main',
              field: 'is_main',
              required: true,
              label: 'Principal',
              align: 'center',
              sortable: false,
            } as const,
          ]),
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'email_address',
        field: 'email_address',
        required: true,
        label: 'Correo electrónico',
        align: 'left',
        sortable: true,
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)

    tablePropsAddress.value.rows = models.value.addresses
    tablePropsEmail.value.rows = models.value.emails
    tablePropsPhone.value.rows = models.value.phones
  }

  const openModalAddAddress = () => {
    if (!modalAddressRef.value) return
    modalAddressRef.value.openModal()
  }

  const editAddressModal = (data: IAddressV2) => {
    editAddress.value = true
    modelsAddress.value = {
      id: data.id,
      is_main: data.is_main,
      address: data.address,
      country_id: data.country_id ?? null,
      department_id: data.department_id ?? null,
      city_id: data.city_id ?? null,
      phone: data.phone ?? null,
      phone_extra: data.phone_extra ?? null,
    }
    openModalAddAddress()
  }

  const handleMainChange = <T extends { is_main: boolean }>(
    rows: T[],
    selectedRow: T,
    value: boolean
  ) => {
    if (value) {
      rows?.forEach((row) => {
        if (row !== selectedRow) {
          row.is_main = false
        }
      })
    }
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  watch(
    models,
    (val) => {
      if (JSON.stringify(val) === JSON.stringify(props.data)) return
      emit('update:data', isEmptyOrZero(val) ? null : val)
    },
    { deep: true }
  )

  watch(
    [
      () => tablePropsEmail.value.rows,
      () => tablePropsAddress.value.rows,
      () => tablePropsPhone.value.rows,
    ],
    ([emails, addresses, phones]) => {
      models.value.emails = emails
      models.value.addresses = addresses
      models.value.phones = phones
    }
  )

  watch(
    () => thirdpartie_request.value,
    (val) => {
      if (['view'].includes(props.action)) return
      if (val?.emails) models.value.emails = val.emails
      if (val?.addresses) models.value.addresses = val.addresses
      if (val?.phones) models.value.phones = val.phones
    }
  )

  watch(
    () => models.value.third_party_id,
    async (val) => {
      if (val && ['create'].includes(props.action)) {
        await _getByIdAction(val)
      }
    }
  )

  return {
    formElementRef,
    models,
    tablePropsEmail,
    tablePropsAddress,
    tablePropsPhone,
    business_trust_third_parties,
    is_required,
    business_trusts_value_is_code,
    defaultIconsLucide,

    editAddressModal,
    handleMainChange,
  }
}

export default useBasicDataForm
