import { IDetailOfIndividualExpensesRequest } from '@/interfaces/customs'
import {
  useRecordIndividualExpensesStore,
  useTreasuryResourceStore,
} from '@/stores'
import { storeToRefs } from 'pinia'
import { QTable } from 'quasar'
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  useMainLoader,
  useAlert,
  useUtils,
  useRouteValidator,
} from '@/composables'

const useRecordIndividualExpensesList = () => {
  const router = useRouter()
  const { showAlert } = useAlert()

  const formInformation = ref()
  const {
    data_information_form,
    data_list,
    new_form_data,
    record,
    is_editing,
    successValidateCreate,
    effective_date_filter,
    resetFormFilter,
  } = storeToRefs(useRecordIndividualExpensesStore('v1'))

  const {
    _postRecordIndividualExpensesValidate,
    _postRecordIndividualExpenses,
    _setDataBasicRecodIndividualExpenses,
  } = useRecordIndividualExpensesStore('v1')

  const {
    payments,
    banks_initial_balance,
    banks_third_parties,
    active_third_parties,
  } = storeToRefs(useTreasuryResourceStore('v1'))

  const detailOfIndividualBasicDataRef = ref()
  const totalForeignCurrencyValue = ref(0)
  const totalLocalCurrencyValue = ref(0)
  const { openMainLoader } = useMainLoader()
  const { validateRouter } = useRouteValidator()

  const headerProperties = ref({
    title: 'Egresos individuales',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Tesorería',
        route: 'RecordIndividualExpensesList',
      },
      {
        label: 'Egresos individuales',
        route: 'RecordIndividualExpensesList',
      },
    ],
  })

  const tableProps = ref({
    title: 'Listado de egresos individuales',
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
        name: 'nit_third_party_id',
        required: false,
        label: 'NIT beneficiario',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.nit_third_party_name || '-',
        sortable: true,
      },
      {
        name: 'method_payment_id',
        required: true,
        label: 'Forma de pago',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.method_payment_name || '-',
        sortable: true,
      },
      {
        name: 'cost_center_id',
        required: true,
        label: 'Centro de costo',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.cost_center_name || '-',
        sortable: true,
      },
      {
        name: 'cash_flow_id',
        required: true,
        label: 'Flujo de caja',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.cash_flow_name && row.cash_flow_id
            ? `${row.cash_flow_id} - ${row.cash_flow_name}`
            : '-',
        sortable: true,
      },
      {
        name: 'bank_id',
        required: true,
        label: 'Banco',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.bank_name || '-',
        sortable: true,
      },
      {
        name: 'bank_account_id',
        required: true,
        label: 'Cuenta bancaria',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.bank_account_name || '-',
        sortable: true,
      },
      {
        name: 'concept',
        required: true,
        label: 'Concepto',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          `${row.concept}` || '-',
        sortable: true,
      },
      {
        name: 'foreign_currency_value',
        required: true,
        label: 'Valor moneda extranjera',
        align: 'right',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          useUtils().formatCurrencyString(row.foreign_currency_value, {
            showCurrencySymbol: false,
          }) || '-',
        sortable: true,
      },
      {
        name: 'coin',
        required: true,
        label: 'Moneda',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          `${row.coin}` || '-',
        sortable: true,
      },
      {
        name: 'trm',
        required: true,
        label: 'TRM',
        align: 'right',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          useUtils().formatCurrencyString(row.trm, {
            showCurrencySymbol: false,
          }) || '-',
        sortable: true,
      },
      {
        name: 'value',
        required: true,
        label: 'Valor',
        align: 'right',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          useUtils().formatCurrencyString(row.value, {
            showCurrencySymbol: false,
          }) || '-',
        sortable: true,
      },
      {
        name: 'instructions',
        required: true,
        label: 'Instrucciones',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.instructions || '-',
        sortable: true,
      },
      {
        name: 'effective_date',
        required: true,
        label: 'Fecha efectiva',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.effective_date || '-',
        sortable: true,
      },
      {
        name: 'beneficiary_bank_id',
        required: true,
        label: 'Banco beneficiario',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          detailOfIndividualBasicData(row),
        sortable: true,
      },
      {
        name: 'beneficiary_bank_account',
        required: true,
        label: 'Cuenta bancaria',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.beneficiary_bank_account_name || '-',
        sortable: true,
      },
      {
        name: 'authorized_document_type_id',
        required: true,
        label: 'Tipo de documento autorizado',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.authorized_document_type_name || '-',
        sortable: true,
      },
      {
        name: 'identification_authorized',
        required: true,
        label: 'Identificación del autorizado',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          useUtils().getLabel(
            row.identification_authorized,
            active_third_parties.value
          ),

        sortable: true,
      },
      {
        name: 'bank_branch_id',
        required: true,
        label: 'Sucursal',
        align: 'left',
        field: (row: IDetailOfIndividualExpensesRequest) =>
          row.bank_branch_name || '-',
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
    rows: data_list ?? [],
    pages: {
      currentPage: ref(1),
      lastPage: 1,
    },
  })
  const detailOfIndividualBasicData = (
    row: IDetailOfIndividualExpensesRequest
  ) => {
    const requiresBankWithdrawal = payments.value.some((payment) => {
      const isSameMethod = payment.value === row.method_payment_id
      const isThirdPartyBank = banks_third_parties.value.some(
        (item) => item.id === row.beneficiary_bank_id
      )

      return isSameMethod && !isThirdPartyBank
    })

    const bankList = requiresBankWithdrawal
      ? banks_initial_balance.value
      : banks_third_parties.value

    return row.beneficiary_bank_id
      ? String(useUtils().getLabel(row.beneficiary_bank_id, bankList))
      : '-'
  }

  const is_creating = computed(() => data_list.value.length > 0)

  const alertModalRef = ref()
  const alertDeleteModalRef = ref()
  const alertCreateModalRef = ref()
  const alertModalConfig = ref({
    description: 'Descripción',
    id: null as number | null,
  })

  const alertDeleteModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea eliminar el egreso individual?',
    id: null as number | null,
  })

  const alertCreateModalConfig = ref({
    title: 'Advertencia',
    description: '¿Desea confirmar el egreso individual?',
  })

  const handleOptions = async (option: string, id: number) => {
    switch (option) {
      case 'edit': {
        record.value =
          data_list.value.find((item) => item.id === id) ??
          ({} as IDetailOfIndividualExpensesRequest)

        router.push({
          name: 'RecordIndividualExpensesEdit',
          params: { id: id },
        })
        is_editing.value = true
        break
      }
      case 'view':
        alertModalConfig.value.id = id
        await alertModalRef.value.openModal()
        break

      case 'delete':
        if (id) {
          alertDeleteModalConfig.value.id = id
          await alertDeleteModalRef.value.openModal()
        }
        break
      default:
        break
    }
  }

  const calculateTotals = () => {
    data_list.value.forEach((row) => {
      const value = Number(row.value) || 0
      if (row.coin === 'Extranjera') {
        totalForeignCurrencyValue.value += value
      } else if (row.coin === 'Local') {
        totalLocalCurrencyValue.value += value
      }
    })
  }

  const validateForm = async () => {
    return (await formInformation.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    successValidateCreate.value = false
    const isFormValid = await validateForm()

    if (!isFormValid) return
    if (data_information_form.value) {
      const successValidate = await _postRecordIndividualExpensesValidate(
        data_information_form.value
      )

      if (successValidate) {
        router.push({ name: 'RecordIndividualExpensesCreate' })
      }
    }
  }

  const addForm = () => {
    router.push({
      name: 'RecordIndividualExpensesCreate',
    })
    new_form_data.value = true
  }

  const createRecordIndividual = async () => {
    openMainLoader(true)
    await alertCreateModalRef.value.closeModal()

    const payload = {
      ...data_information_form.value,
      details: data_list.value.map((item) => ({
        ...item,
        identification_authorized:
          active_third_parties.value.find(
            (third) => third.value === item.identification_authorized
          )?.document ?? null,
      })),
    }

    if (await _postRecordIndividualExpenses(payload)) {
      data_list.value = []
      effective_date_filter.value = null
      successValidateCreate.value = false
      record.value = {} as IDetailOfIndividualExpensesRequest
      await _setDataBasicRecodIndividualExpenses(null)
    }
    setTimeout(() => {
      openMainLoader(false)
      resetFormFilter.value = true
    }, 1000)
  }

  const openCreateConfirmationModal = async () => {
    if (!alertCreateModalConfig.value) return
    await alertCreateModalRef.value.openModal()
  }

  const deleteRecordIndividualExpenses = async () => {
    openMainLoader(true)
    await alertDeleteModalRef.value.closeModal()
    if (!alertDeleteModalConfig.value.id) return

    const id = alertDeleteModalConfig.value.id
    const index = data_list.value.findIndex((item) => item.id === id)

    if (index !== -1) {
      data_list.value.splice(index, 1)
      calculateTotals()
    }

    setTimeout(() => {
      showAlert(`Registro eliminado exitosamente`, 'success', undefined, 1000)
    }, 500)
    openMainLoader(false)
  }

  onMounted(() => {
    calculateTotals()
  })

  watch(data_list, () => {
    calculateTotals()
  })

  return {
    totalForeignCurrencyValue,
    totalLocalCurrencyValue,
    headerProperties,
    tableProps,
    formInformation,
    data_information_form,
    is_creating,
    data_list,
    alertModalRef,
    alertModalConfig,
    alertDeleteModalRef,
    alertDeleteModalConfig,
    detailOfIndividualBasicDataRef,
    alertCreateModalRef,
    alertCreateModalConfig,
    resetFormFilter,
    // Methods
    openCreateConfirmationModal,
    createRecordIndividual,
    handleOptions,
    addForm,
    onSubmit,
    deleteRecordIndividualExpenses,
    validateRouter,
  }
}

export default useRecordIndividualExpensesList
