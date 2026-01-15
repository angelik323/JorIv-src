// core
import { onBeforeUnmount, onMounted, ref } from 'vue'

// composables
import {
  useGoToUrl,
  useMainLoader,
  useRouteValidator,
  useUtils,
} from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IMovementManagementForm,
  IMovementManagementCreatePayload,
} from '@/interfaces/customs/accounts-payable/MovementManagement'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useMovementManagementStore } from '@/stores/accounts-payable/movement-management'

const useMovementManagementCreate = () => {
  // hooks
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()
  const { validateRouter } = useRouteValidator()

  // refs
  const keys = ref({
    budget: ['code_movements', 'budget_document_types_selector'],
    accounting: ['sub_receipt_types'],
    treasury: ['treasury_movement_codes'],
    fics: ['movements_codes'],
  })
  const basicDataFormRef = ref()
  const movement_management_form = ref<IMovementManagementForm | null>()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _createMovementManagement } = useMovementManagementStore('v1')

  // configs
  const headerProps = {
    title: 'Crear tipos de movimiento por pagar',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Cuentas por pagar',
        route: '',
      },
      {
        label: 'Gestión de movimientos de cuentas por pagar',
        route: 'MovementManagementList',
      },
      {
        label: 'Crear',
        route: 'MovementManagementCreate',
      },
    ],
    btn: {
      label: validateRouter(
        'AccountsPayable',
        'MovementManagementList',
        'create'
      )
        ? 'Importar'
        : undefined,
      icon: defaultIconsLucide.cloudUpload,
      color: 'orange',
      class: 'custom',
      textColor: 'black',
    },
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'information',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const tabActive = ref(tabs.value[0].name)
  const tabActiveIdx = ref(
    tabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  // actions
  const makePayload = (form: IMovementManagementForm) => {
    return {
      name: form.name,
      disbursement_type: form.disbursement_type,
      has_handle_budget: form.has_handle_budget,
      has_generates_accrual: form.has_generates_accrual,
      has_generates_treasury: form.has_generates_treasury,
      has_amortizes_fund: form.has_amortizes_fund,
      has_contract_execution: form.has_contract_execution,
      has_compliance_without_treasury: form.has_compliance_without_treasury,
      has_requests_invoice: form.has_requests_invoice,
      has_validates_final_act: form.has_validates_final_act,
      budget_reference_document_type_id: form.budget_reference_document_type_id,
      budget_generate_document_type_id: form.budget_generate_document_type_id,
      budget_generate_movement_id: form.budget_generate_movement_id,
      fund_movement_code_id: form.fund_movement_code_id,
      accounting_accrual_subtype_id: form.accounting_accrual_subtype_id,
      treasury_funds_payment_movement_id:
        form.treasury_funds_payment_movement_id,
      treasury_bank_payment_movement_id: form.treasury_bank_payment_movement_id,
    } as IMovementManagementCreatePayload
  }

  const handleCreate = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!movement_management_form.value) return

    openMainLoader(true)
    const payload = makePayload(movement_management_form.value)
    if (await _createMovementManagement(payload)) {
      goToURL('MovementManagementList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    await _getResources(keys.value)
  })

  onBeforeUnmount(() => _resetKeys(keys.value))

  return {
    // configs
    headerProps,
    tabs,
    tabActive,
    tabActiveIdx,

    // refs
    basicDataFormRef,
    movement_management_form,

    // methods
    handleCreate,
    goToURL,
  }
}

export default useMovementManagementCreate
