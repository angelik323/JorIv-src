// Vue
import { ref, watch } from 'vue'

// Interfaces
import {
  ISecondAuthorizationAuthorizer,
  ISecondAuthorizationBasicDataForm,
  ISecondAuthorizationBeneficiariesItem,
  ISecondAuthorizationInstructionsItem,
} from '@/interfaces/customs/accounts-payable/SecondAuthorization'
import { IBaseTableProps } from '@/interfaces/global/Table'

// Composables
import { useUtils } from '@/composables'

// Stores
import { useSecondAuthorizationStore } from '@/stores/accounts-payable/second-authorization'

const useBasicDataForm = (props: {
  data?: ISecondAuthorizationBasicDataForm | null
}) => {
  const { _getSecondAuthorizationInstructionBeneficiaries } =
    useSecondAuthorizationStore('v1')
  const { formatCurrency } = useUtils()

  const models = ref<ISecondAuthorizationBasicDataForm>({
    instructions: [],
    beneficiaries: [],
    authorizer: null,
  })

  const selectedInstruction = ref()

  const instructionsTableProps = ref<
    IBaseTableProps<ISecondAuthorizationInstructionsItem>
  >({
    title: 'Listado de instrucciones de pago',
    loading: false,
    columns: [
      {
        name: 'payment_request_id',
        required: false,
        label: '#',
        field: 'payment_request_id',
        sortable: true,
        align: 'left',
      },
      {
        name: 'instruction_number',
        required: false,
        label: '# de instrucción',
        field: 'instruction_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'payment_method_id',
        required: false,
        label: 'Forma de pago',
        field: (row) => row.payment_method?.description ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'instruction_number',
        required: false,
        label: 'Fuente de recursos',
        field: (row) => row.payment_source?.label ?? '',
        sortable: true,
        align: 'left',
      },

      {
        name: 'plan_or_account_id',
        required: false,
        label: 'Plan/cuenta',
        field: (row) => row.plan_or_account?.account_name ?? '',
        sortable: true,
        align: 'left',
      },

      {
        name: 'instruction_date',
        required: false,
        label: 'Fecha de instrucción',
        field: 'instruction_date',
        sortable: true,
        align: 'left',
      },

      {
        name: 'instruction_number',
        required: false,
        label: 'Valor base',
        field: (row) => formatCurrency(row.base_value),
        sortable: true,
        align: 'left',
      },

      {
        name: 'tax_discount',
        required: false,
        label: 'Valor descuento tributario',
        field: (row) => formatCurrency(row.tax_discount),
        sortable: true,
        align: 'left',
      },

      {
        name: 'discount_value',
        required: false,
        label: 'Valor descuentos',
        field: (row) => formatCurrency(row.tax_discount),
        sortable: true,
        align: 'left',
      },
      {
        name: 'pay_value',
        required: false,
        label: 'Valor pago',
        field: (row) => formatCurrency(row.pay_value),
        sortable: true,
        align: 'left',
      },
      {
        name: 'net_value',
        required: false,
        label: 'Valor neto',
        field: (row) => formatCurrency(row.net_value),
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const beneficiariesTableProps = ref<
    IBaseTableProps<ISecondAuthorizationBeneficiariesItem>
  >({
    title: 'Listado de beneficiarios de pago',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: (row) => row.beneficiary?.id ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'payment_method_id',
        required: false,
        label: 'Forma de pago',
        field: (row) => row.payment_method_id?.description ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'beneficiary_id',
        required: false,
        label: 'Número de identificación',
        field: (row) => row.beneficiary?.document ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'beneficiary_name',
        required: false,
        label: 'Nombres',
        field: 'beneficiary_name',
        sortable: true,
        align: 'left',
      },
      {
        name: 'beneficiary_bank_account_id',
        required: false,
        label: 'Cuenta bancaria / Llave',
        field: (row) => row.beneficiary_bank_account?.account_number ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'pay_value',
        required: false,
        label: 'Valor a girar',
        field: (row) => formatCurrency(row.pay_value),
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  const authorizersTableProps = ref<
    IBaseTableProps<ISecondAuthorizationAuthorizer>
  >({
    title: 'Listado de autorizadores de pago',
    loading: false,
    columns: [
      {
        name: 'id',
        required: false,
        label: '#',
        field: 'authorized_doc_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'authorized_doc_type_id',
        required: false,
        label: 'Tipo de documento',
        field: (row) => row?.authorized_doc_type?.name ?? '',
        sortable: true,
        align: 'left',
      },
      {
        name: 'authorized_doc_number',
        required: false,
        label: 'Número de identificación',
        field: 'authorized_doc_number',
        sortable: true,
        align: 'left',
      },
      {
        name: 'authorized_full_name',
        required: false,
        label: 'Nombres',
        field: 'authorized_full_name',
        sortable: true,
        align: 'left',
      },
    ],
    rows: [],
    pages: { currentPage: 0, lastPage: 0 },
  })

  watch(
    () => models.value.instructions,
    (val) => {
      instructionsTableProps.value.rows = val
    }
  )

  watch(
    () => selectedInstruction.value,
    async (val) => {
      if (val.length > 0) {
        const result = await _getSecondAuthorizationInstructionBeneficiaries(
          val[0].instruction_number
        )
        if (result) {
          beneficiariesTableProps.value.rows = result.list
        }
      }
    }
  )

  watch(
    () => models.value.authorizer,
    (val) => {
      if (!val) return
      authorizersTableProps.value.rows = [val]
    }
  )

  const _setValueModel = () => {
    if (!props.data) return
    Object.assign(models.value, props.data)
  }

  watch(
    () => props.data,
    (val) => {
      if (!val) return
      _setValueModel()
    },
    { deep: true, immediate: true }
  )

  return {
    models,
    selectedInstruction,
    instructionsTableProps,
    beneficiariesTableProps,
    authorizersTableProps,
  }
}

export default useBasicDataForm
