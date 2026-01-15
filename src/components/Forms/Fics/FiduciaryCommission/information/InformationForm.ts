// Vue - Quasar
import { computed, onMounted, ref } from 'vue'
import { QTable } from 'quasar'

// Interfaces
import {
  IVariableCommission,
  IFiduciaryCommission,
} from '@/interfaces/customs/fics/FiduciaryCommission'
import { ActionType } from '@/interfaces/global'

// Composables
import { useUtils } from '@/composables'

const useInformationForm = (props: {
  action: ActionType
  data?: IFiduciaryCommission
}) => {
  const { defaultIconsLucide, formatCurrencyString } = useUtils()

  const addCommissionModalRef = ref()
  const informationFormRef = ref()
  const initialBalanceRef = ref()
  const ratePercentageRef = ref()
  const finalBalanceRef = ref()

  const modalCommissionData = ref<IVariableCommission>({
    id: 0,
    initial_balance: 0,
    final_balance: 0,
    rate_percentage: '',
  })

  const formData = ref<IFiduciaryCommission>({
    id: 0,
    code: '',
    type: 2,
    type_description: 0,
    liquidation_base: 'SFF - Saldo final fondo',
    liquidation_base_abv: '',
    rate_type: 'EF - Efectiva',
    rate_type_abv: '',
    fixed_rate_percentage: '',
    description: '',
    variable_rates: [],
  })

  const tableProperties = ref({
    title: '',
    loading: false,
    columns: [
      {
        name: 'id',
        required: true,
        label: '#',
        align: 'left',
        field: 'id',
        sortable: true,
      },
      {
        name: 'initial_balance',
        required: true,
        label: 'Saldo inicial',
        align: 'left',
        field: (row) => formatCurrencyString(row.initial_balance) || '-',
        sortable: true,
      },
      {
        name: 'final_balance',
        required: true,
        label: 'Saldo final',
        align: 'left',
        field: (row) => formatCurrencyString(row.final_balance) || '-',
        sortable: true,
      },
      {
        name: 'rate_percentage',
        required: true,
        label: 'Tasa comisión',
        align: 'left',
        field: 'rate_percentage',
        sortable: true,
      },
      ...(props.action === 'create'
        ? [
            {
              name: 'actions',
              required: true,
              label: 'Acciones',
              align: 'center',
              field: 'actions',
              sortable: false,
            },
          ]
        : []),
    ] as QTable['columns'],
    rows: [] as IVariableCommission[],
  })

  const handleOpenModal = () => {
    const initialBalanceProcessed = +(
      tableProperties.value.rows[tableProperties.value.rows.length - 1]
        ?.final_balance ?? 0
    )

    modalCommissionData.value = {
      id: 0,
      initial_balance: +(initialBalanceProcessed > 0
        ? initialBalanceProcessed + 0.01
        : 0),
      final_balance: 0,
      rate_percentage: '',
    }

    addCommissionModalRef.value?.openModal?.()
  }

  const handleCloseModal = () => addCommissionModalRef.value?.closeModal?.()

  const handleAdd = async () => {
    const isInitialValid = await initialBalanceRef.value?.validate()
    const isFinalValid = await finalBalanceRef.value?.validate()
    const isRateValid = await ratePercentageRef.value?.validate()

    if (!isInitialValid || !isFinalValid || !isRateValid) {
      return
    }

    const existingIndex = formData.value.variable_rates?.findIndex(
      (item) => item.id === modalCommissionData.value.id
    )

    if (existingIndex !== undefined && existingIndex >= 0) {
      const nextItem = formData.value.variable_rates![existingIndex + 1]

      if (nextItem) {
        const initialBalanceProcessed = +(
          modalCommissionData?.value.final_balance ?? 0
        )
        nextItem.initial_balance =
          initialBalanceProcessed > 0 ? initialBalanceProcessed + 0.01 : 0
      }

      formData.value.variable_rates![existingIndex] = {
        ...modalCommissionData.value,
      }
    } else {
      const lastId = formData.value.variable_rates?.slice(-1)[0]?.id ?? 0

      formData.value.variable_rates?.push({
        ...modalCommissionData.value,
        id: lastId + 1,
      })
    }

    tableProperties.value.rows = [...formData.value.variable_rates!]
    handleCloseModal()
  }

  const handleEdit = (id: number) => {
    const item = formData.value.variable_rates?.find((item) => item.id === id)

    if (item) {
      modalCommissionData.value = { ...item }
      addCommissionModalRef.value?.openModal?.()
    }
  }

  const loadData = () => {
    if (props.action !== 'create' && props.data) {
      formData.value = {
        ...props.data,
        liquidation_base:
          props.data.liquidation_base_abv === 'SIF'
            ? 'SIF - Saldo inicial fondo'
            : 'SFF - Saldo final fondo',
        rate_type:
          props.data.rate_type_abv === 'NO' ? 'NO - Nominal' : 'EF - Efectiva',
        variable_rates: props.data.variable_rates ?? [],
      }

      tableProperties.value.rows = [...(formData.value.variable_rates ?? [])]
    }
  }

  const commissionTypeBoolean = computed<boolean>({
    get: () => formData.value.type === 1,
    set: (val: boolean) => {
      formData.value.type = val ? 1 : 2
    },
  })

  const liquidationBaseBoolean = computed<boolean>({
    get: () => formData.value.liquidation_base === 'SIF - Saldo inicial fondo',
    set: (val: boolean) => {
      formData.value.liquidation_base = val
        ? 'SIF - Saldo inicial fondo'
        : 'SFF - Saldo final fondo'
    },
  })

  const rateTypeBoolean = computed<boolean>({
    get: () => formData.value.rate_type === 'NO - Nominal',
    set: (val: boolean) => {
      formData.value.rate_type = val ? 'NO - Nominal' : 'EF - Efectiva'
    },
  })

  const isView = computed(() => ['view'].includes(props.action))
  const isCreate = computed(() => ['create'].includes(props.action))

  onMounted(() => loadData())

  return {
    isView,
    isCreate,
    formData,
    handleAdd,
    handleEdit,
    handleOpenModal,
    rateTypeBoolean,
    tableProperties,
    finalBalanceRef,
    handleCloseModal,
    initialBalanceRef,
    ratePercentageRef,
    informationFormRef,
    defaultIconsLucide,
    modalCommissionData,
    addCommissionModalRef,
    commissionTypeBoolean,
    liquidationBaseBoolean,
  }
}

export default useInformationForm
