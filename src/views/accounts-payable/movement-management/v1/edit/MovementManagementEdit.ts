// core
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

// composables
import { useGoToUrl, useMainLoader, useUtils } from '@/composables'

// interfaces
import { ITabs } from '@/interfaces/global'
import {
  IMovementManagementForm,
  IMovementManagementUpdatePayload,
} from '@/interfaces/customs/accounts-payable/MovementManagement'

// stores
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useMovementManagementStore } from '@/stores/accounts-payable/movement-management'

const useMovementManagementEdit = () => {
  // hooks
  const route = useRoute()
  const movementId = +route.params.id
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  // stores
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { _getMovementById, _updateMovementManagement } =
    useMovementManagementStore('v1')

  // refs
  const keys = ref({
    budget: ['code_movements', 'budget_document_types_selector'],
    accounting: ['sub_receipt_types'],
    treasury: ['treasury_movement_codes'],
    fics: ['movements_codes'],
  })
  const basicDataFormRef = ref()
  const movement_management_form = ref<IMovementManagementForm | null>()

  // configs
  const headerProps = {
    title: 'Editar tipos de movimiento por pagar',
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
        label: 'Editar',
        route: 'MovementManagementEdit',
      },
      {
        label: `${movementId}`,
        route: '',
      },
    ],
    btn: {
      label: 'Crear',
      icon: defaultIconsLucide.plusCircleOutline,
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
    } as IMovementManagementUpdatePayload
  }

  const handleEdit = async () => {
    const isValid = await basicDataFormRef.value?.validateForm()
    if (!isValid) return

    if (!movement_management_form.value) return

    openMainLoader(true)
    const payload = makePayload(movement_management_form.value)
    if (await _updateMovementManagement(payload, movementId)) {
      goToURL('MovementManagementList')
    }

    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  }

  // lifecycle hooks
  onMounted(async () => {
    openMainLoader(true)
    movement_management_form.value = await _getMovementById(movementId)
    setTimeout(() => {
      openMainLoader(false)
    }, 1000)
  })

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
    handleEdit,
    goToURL,
  }
}

export default useMovementManagementEdit
