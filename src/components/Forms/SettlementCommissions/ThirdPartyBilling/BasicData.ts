import { IAddress, IEmail, IThirdPartyBillingForm } from '@/interfaces/customs'
import { onMounted, ref, watch } from 'vue'
import { useRules } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { QTable } from 'quasar'
import {
  useAssetResourceStore,
  useThirdPartiesStore,
  useTrustBusinessResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { ActionType } from '@/interfaces/global'

const useBasicDataForm = (
  props: {
    action: ActionType
    data: IThirdPartyBillingForm | null
  },
  emit: Function
) => {
  const { _getByIdAction } = useThirdPartiesStore()
  const { is_required, max_length, no_leading_zeros, email_validation } =
    useRules()
  const { countries, departments, cities } = storeToRefs(
    useAssetResourceStore('v1')
  )
  const { thirdpartie_request } = storeToRefs(useThirdPartiesStore())

  const { business_trust_third_parties: third_party } = storeToRefs(
    useTrustBusinessResourceStore('v1')
  )

  const formElementRef = ref()

  const initialModelsValues: IThirdPartyBillingForm = {
    third_party_id: null,
    created_date: null,
    emails: [],
    phones: [],
    addresses: [],
  }

  const models = ref<typeof initialModelsValues>({ ...initialModelsValues })

  const modalAddressRef = ref()
  const isAddressGeneratorOpen = ref(false)
  const editAddress = ref(false)

  const modelsAddress = ref<IAddress>({
    is_main: false,
    address: null,
    country_id: null,
    department_id: null,
    city_id: null,
    phone: null,
    phone_extra: null,
  })

  const tablePropsEmail = ref({
    title: 'Listado de emails',
    loading: false,
    columns: [
      {
        name: 'id',
        field: 'id',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'is_main',
        field: 'is_main',
        required: true,
        label: 'Principal',
        align: 'center',
        sortable: false,
      },
      {
        name: 'email_address',
        field: 'email_address',
        required: true,
        label: 'Correo electrónico',
        align: 'left',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [
      {
        id: 1,
        email_address: '',
        is_main: false,
      },
    ] as IEmail[],
  })

  const tablePropsAddress = ref({
    title: 'Listado de direcciones',
    loading: false,
    columns: [
      {
        name: 'id',
        field: (row) => row.id ?? '--',
        required: false,
        label: '#',
        align: 'left',
        sortable: true,
      },
      {
        name: 'is_main',
        field: 'is_main',
        required: true,
        label: 'Principal',
        align: 'center',
        sortable: false,
      },
      {
        name: 'country_id',
        field: (row) => row?.country_id ?? row?.country?.id,
        required: true,
        label: 'País',
        align: 'left',
        sortable: true,
        format: (val: number) => {
          return (
            countries.value.find((country) => country.value === val)?.label ||
            ''
          )
        },
      },
      {
        name: 'department_id',
        field: (row) => row?.department_id ?? row?.department?.id,
        required: true,
        label: 'Departamento/estado',
        align: 'left',
        sortable: true,
        format: (val: number) => {
          return (
            departments.value.find((department) => department.value === val)
              ?.label || ''
          )
        },
      },
      {
        name: 'city_id',
        field: (row) => row?.city_id ?? row?.city?.id,
        required: true,
        label: 'Ciudad',
        align: 'left',
        sortable: true,
        format: (val: number) => {
          return cities.value.find((city) => city.value === val)?.label || ''
        },
      },
      {
        name: 'address',
        field: 'address',
        required: true,
        label: 'Dirección completa',
        align: 'left',
        sortable: true,
      },
      {
        name: 'phone',
        field: 'phone',
        required: false,
        label: 'Celular',
        align: 'left',
        sortable: true,
      },
      {
        name: 'actions',
        field: 'actions',
        required: false,
        label: 'Acciones',
        align: 'center',
        sortable: false,
      },
    ] as QTable['columns'],
    rows: [] as IAddress[],
  })

  const _setValueModel = () => {
    if (!props.data) return
    models.value = { ...props.data }

    tablePropsAddress.value.rows = models.value.addresses
    tablePropsEmail.value.rows = models.value.emails
  }

  const openModalAddAddress = () => {
    if (!modalAddressRef.value) return
    modalAddressRef.value.openModal()
  }

  const openModalGenerateAddress = () => {
    if (!modalAddressRef.value) return
    isAddressGeneratorOpen.value = true
    modalAddressRef.value.closeModal()
  }

  const addEmail = () => {
    if (!tablePropsEmail.value) return
    tablePropsEmail.value.rows.push({
      id: tablePropsEmail.value.rows.length + 1,
      is_main: false,
      email_address: '',
    })
  }

  const saveAddress = () => {
    modalAddressRef.value.closeModal()
    tablePropsAddress.value.rows.push({
      id: null,
      is_main: false,
      country_id: modelsAddress.value?.country_id,
      department_id: modelsAddress.value?.department_id,
      city_id: modelsAddress.value?.city_id,
      phone: modelsAddress.value?.phone,
      phone_extra: modelsAddress.value?.phone_extra,
      address: modelsAddress.value?.address,
    })

    cleanModelsAddressValues()
  }

  const cleanModelsAddressValues = () => {
    modelsAddress.value = {
      phone: null,
      phone_extra: null,
      address: null,
      country_id: null,
      department_id: null,
      city_id: null,
    }
  }

  const editAddressModal = (data: IAddress) => {
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

  const updateAddress = () => {
    modalAddressRef.value.closeModal()
    const index = tablePropsAddress.value.rows.findIndex(
      (row) => row.id === modelsAddress.value.id
    )
    if (index !== -1) {
      tablePropsAddress.value.rows[index] = {
        ...tablePropsAddress.value.rows[index],
        is_main: modelsAddress.value.is_main,
        country_id: modelsAddress.value.country_id,
        department_id: modelsAddress.value.department_id,
        city_id: modelsAddress.value.city_id,
        phone: modelsAddress.value.phone,
        phone_extra: modelsAddress.value.phone_extra,
        address: modelsAddress.value.address,
      }
    }
    cleanModelsAddressValues()
    editAddress.value = false
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
    [() => tablePropsEmail.value.rows, () => tablePropsAddress.value.rows],
    ([emails, addresses]) => {
      models.value.emails = emails
      models.value.addresses = addresses
    }
  )

  watch(
    () => thirdpartie_request.value,
    (val) => {
      if (props.action === 'view') return
      if (val?.emails) models.value.emails = val.emails
      if (val?.addresses)
        models.value.addresses = val.addresses.map((e) => ({
          ...e,
          phone:
            props.data?.addresses.find((v) => v.id === e.id)?.phone ?? null,
        }))
    }
  )

  watch(
    () => models.value.third_party_id,
    async (val) => {
      if (val) {
        await _getByIdAction(val)
      }
    }
  )

  onMounted(() => {
    if (props.action === 'view') {
      tablePropsAddress.value.columns?.pop()
    }
  })

  return {
    formElementRef,
    models,
    tablePropsEmail,
    tablePropsAddress,
    modalAddressRef,
    modelsAddress,
    isAddressGeneratorOpen,
    editAddress,
    third_party,
    countries,
    departments,
    cities,
    updateAddress,
    editAddressModal,
    saveAddress,
    openModalGenerateAddress,
    addEmail,
    openModalAddAddress,
    is_required,
    max_length,
    no_leading_zeros,
    email_validation,
  }
}

export default useBasicDataForm
