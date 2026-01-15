// vue - quasar
import { computed, onMounted, ref, watch } from 'vue'
import { QTableColumn } from 'quasar'
import { storeToRefs } from 'pinia'

// interfaces
import { ActionType, IBaseTableProps } from '@/interfaces/global'
import { ISelectorResources } from '@/interfaces/customs'
import { IAccountingParameters } from '@/interfaces/customs/fixed-assets/v1/AcountingConfiguration'

// composables
import { useAlert, useRules, useUtils } from '@/composables'

// stores
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingParametersList = (
  props: {
    modelValue: IAccountingParameters[]
    configuration_novelty_types: ISelectorResources[]
    debit_nature: ISelectorResources[]
    action: ActionType
  },
  emit: Function
) => {
  // imports
  const { showAlert } = useAlert()
  const { defaultIconsLucide } = useUtils()
  const { is_required, min_length, max_length } = useRules()

  // general stores
  const { _getResources } = useResourceManagerStore('v1')

  const { accounts_chart } = storeToRefs(useAccountingResourceStore('v1'))

  const accountingKeys = {
    accounting: ['accounts_chart&accounts_chart_limit=1000'],
  }

  // table
  const createEmptyRow = (): IAccountingParameters => ({
    configuration_novelty_type_id: null,
    debit_nature: null,
    debit_accounts_chart_id: null,
    credit_nature: null,
    credit_accounts_chart_id: null,
    detail_transaction: null,
  })

  const tableProps = ref<IBaseTableProps<IAccountingParameters>>({
    loading: false,
    columns: [
      {
        name: 'novelty_code',
        field: 'novelty_code',
        label: 'Código de novedad',
        align: 'left',
        style:
          props.action !== 'view' ? 'max-width: 140px; min-width: 140px;' : '',
        headerStyle:
          props.action !== 'view'
            ? 'white-space: normal; max-width: 140px; min-width: 140px;'
            : '',
      },
      {
        name: 'debit_nature',
        field: 'debit_nature',
        label: 'Naturaleza partida',
        align: 'left',
        style: 'max-width: 135px; min-width: 135px;',
        headerStyle: 'white-space: normal; max-width: 135px; min-width: 135px;',
      },
      {
        name: 'debit_account',
        field: 'debit_account',
        label: 'Cuenta contable partida',
        align: 'left',
        style: 'max-width: 135px; min-width: 135px;',
        headerStyle: 'white-space: normal; max-width: 135px; min-width: 135px;',
      },
      {
        name: 'credit_nature',
        field: 'credit_nature',
        label: 'Naturaleza contrapartida',
        align: 'left',
        style: 'max-width: 140px; min-width: 140px;',
        headerStyle: 'white-space: normal; max-width: 140px; min-width: 140px;',
      },
      {
        name: 'credit_account',
        field: 'credit_account',
        label: 'Cuenta contable contrapartida',
        align: 'left',
        style: 'max-width: 150px; min-width: 150px;',
        headerStyle: 'white-space: normal; max-width: 150px; min-width: 150px;',
      },
      {
        name: 'detail_transaction',
        field: 'detail_transaction',
        label: 'Detalle registro',
        align: 'left',
        style: 'max-width: 180px; min-width: 180px;',
        headerStyle: 'white-space: normal;',
      },
      ...(props.action !== 'view'
        ? [
            {
              name: 'actions',
              field: '',
              label: 'Acciones',
              align: 'left',
              style: 'max-width: 100px; min-width: 100px;',
            },
          ]
        : []),
    ] as QTableColumn<IAccountingParameters>[],
    rows:
      props.modelValue?.length > 0 ? [...props.modelValue] : [createEmptyRow()],
    pages: {
      currentPage: 1,
      lastPage: 1,
    },
  })

  const filteredDebitAccountsByRow = computed(() => {
    return tableProps.value.rows.map((row) => {
      if (!row.credit_accounts_chart_id) {
        return accounts_chart.value
      }
      return accounts_chart.value.filter(
        (account) => account.value !== row.credit_accounts_chart_id
      )
    })
  })

  const filteredCreditAccountsByRow = computed(() => {
    return tableProps.value.rows.map((row) => {
      if (!row.debit_accounts_chart_id) {
        return accounts_chart.value
      }
      return accounts_chart.value.filter(
        (account) => account.value !== row.debit_accounts_chart_id
      )
    })
  })

  // form management
  const accountingParametersListFormRef = ref()

  const updateRow = (
    index: number,
    field: keyof IAccountingParameters,
    value: string | null
  ) => {
    if (field === 'configuration_novelty_type_id' && value) {
      const isDuplicate = tableProps.value.rows.some(
        (row, idx) =>
          idx !== index && row.configuration_novelty_type_id === Number(value)
      )

      if (isDuplicate) {
        showAlert(
          'Ya existe un parámetro con este código de novedad',
          'error',
          undefined,
          3000
        )
        return
      }
    }

    tableProps.value.rows[index] = {
      ...tableProps.value.rows[index],
      [field]: value,
    }

    if (field === 'debit_nature') {
      const oppositeNature = value
        ? props.debit_nature.find((nature) => nature.value !== value)?.value
        : null

      tableProps.value.rows[index].credit_nature = oppositeNature || null
    }
    emit('update:modelValue', tableProps.value.rows)
  }
  const addNewRow = () => {
    tableProps.value.rows.push(createEmptyRow())
    emit('update:modelValue', tableProps.value.rows)
  }
  const removeRow = (index: number) => {
    tableProps.value.rows.splice(index, 1)
    emit('update:modelValue', tableProps.value.rows)
  }
  const validateAndAddRow = async () => {
    const isValid = await accountingParametersListFormRef.value?.validate()

    if (isValid) {
      addNewRow()
    }
  }
  const handleNoveltyChange = (index: number, code: string | null) => {
    if (!code) {
      updateRow(index, 'configuration_novelty_type_id', null)
      tableProps.value.rows[index].novelty_code = null
      return
    }

    const novelty = props.configuration_novelty_types.find(
      (n) => n.code === code
    )

    if (novelty) {
      tableProps.value.rows[index].novelty_code = code
      updateRow(index, 'configuration_novelty_type_id', novelty.id.toString())
    }
  }

  // watch
  watch(
    () => props.modelValue,
    (newValue) => {
      if (newValue && newValue.length > 0) {
        tableProps.value.rows = newValue.map((row) => ({
          ...row,
          novelty_code:
            row.configuration_novelty_type?.code?.toString() || null,
        }))
      }
    },
    { deep: true }
  )

  // lifecycle
  onMounted(() => {
    _getResources(accountingKeys, '', 'v2')
  })

  return {
    accountingParametersListFormRef,

    tableProps,
    filteredCreditAccountsByRow,
    filteredDebitAccountsByRow,
    defaultIconsLucide,

    updateRow,
    addNewRow,
    removeRow,
    validateAndAddRow,
    handleNoveltyChange,

    is_required,
    min_length,
    max_length,
  }
}

export default useAccountingParametersList
