// pinia - vue - quasar
import { storeToRefs } from 'pinia'
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { QTable } from 'quasar'

// stores
import { useAccountingParametersMovementCodesStore } from '@/stores/trust-business/accounting-parameters-movement-codes'
import { useResourceManagerStore } from '@/stores/resources-manager'
import { useTrustBusinessResourceStore } from '@/stores/resources-manager/trust-business'
import { useAccountingResourceStore } from '@/stores/resources-manager/accounting'

// interfaces
import {
  IAccountingParametersMovementCodesParameter,
  IAccountingParametersMovementCodes,
} from '@/interfaces/customs/trust-business/AccountingParametersMovementCodes'

// composables
import { useMainLoader, useRouteValidator } from '@/composables'

const useInformationForm = () => {
  const { validateRouter } = useRouteValidator()
  const {
    _getListAction,
    _setMaxId,
    _getCodeDescription,
    _clearDataCodes,
    _setRowSelected,
    _getParameters,
    _setMaxIdParameters,
    _deleteAccountingParametersMovementCodesParameters,
    _deleteAccountingParametersMovementCodes,
  } = useAccountingParametersMovementCodesStore('v1')

  const {
    accounting_parameters_movement_codes_list,
    max_id,
    codes_business_trust_list,
    accounting_parameters_movement_codes_parameters_list,
    max_id_parameters,
  } = storeToRefs(useAccountingParametersMovementCodesStore('v1'))

  const { _getResources } = useResourceManagerStore('v1')

  const { openMainLoader } = useMainLoader()

  const {
    business_trust_types,
    account_structures,
    cost_centers_structures,

    //
    movement_codes_parameters,
    params_good_class,
    params_good_type,
    params_nature,
    params_auxiliary_type,
    receipt_types,
    sub_receipt_types,
    business_trust_third_parties,
    params_accounting_account,
  } = storeToRefs(useTrustBusinessResourceStore('v1'))

  const { budget_structures } = storeToRefs(
    useAccountingResourceStore('v1')
  )

  const formInformation = ref()
  // table accounting block
  const tablePropsAccountingBlock = ref({
    title: 'Bloque contable',
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
        name: 'business_type_id',
        required: true,
        label: 'Tipo de negocio',
        align: 'left',
        field: 'business_type_id',
        sortable: true,
      },
      {
        name: 'accounting_structure_id',
        required: true,
        label: 'Estructura Contable',
        align: 'left',
        field: 'accounting_structure_id',
        sortable: true,
      },
      {
        name: 'cost_center_structure_id',
        required: false,
        label: 'Estructura Centro de Costos',
        align: 'cost_center_structure_id',
        field: 'nature',
        sortable: true,
      },
      {
        name: 'budget_structure_id',
        required: false,
        label: 'Estructura presupuestal',
        align: 'left',
        field: 'budget_structure_id',
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
    rows: [] as IAccountingParametersMovementCodes[],
    pages: {
      currentPage: ref(0),
      lastPage: ref(0),
    },
  })

  const addRowTable = () => {
    const newUid = (max_id.value ?? 0) + 1
    const aux: IAccountingParametersMovementCodes = {
      id: null,
      _uid: newUid,
      business_type_id: null,
      accounting_structure_id: null,
      cost_center_structure_id: null,
      budget_structure_id: null,
    }
    _setMaxId(newUid)
    accounting_parameters_movement_codes_list.value.unshift(aux)
  }

  const alertModalRef = ref()
  const alertModalConfig = ref({
    title: 'Advertencia',
    description: '',
    isBlock: false,
    entityId: null as number | null,
  })

  const openAlertModal = async (
    status: string,
    entityId: number,
    isBlock: boolean
  ) => {
    alertModalConfig.value.entityId = entityId
    alertModalConfig.value.description = setAlertModalDescription(status)
    alertModalConfig.value.isBlock = isBlock
    await alertModalRef.value.openModal()
  }

  const setAlertModalDescription = (status: string) => {
    return `¿Está seguro que desea ${status} el negocio?`
  }

  const deleteRowTableAccountingBlock = async () => {
    if (alertModalConfig.value.entityId as number) {
      alertModalRef.value.closeModal()
      openMainLoader(true)
      await _deleteAccountingParametersMovementCodesParameters(
        alertModalConfig.value.entityId as number
      )
      rowSelected.value = null
      await _getListAction()
      return openMainLoader(false)
    }

    const index = tablePropsAccountingBlock.value.rows.findIndex(
      (item) => item.id === (alertModalConfig.value.entityId as number)
    )
    if (index !== -1) {
      tablePropsAccountingBlock.value.rows.splice(index, 1)
    }
  }

  const rowSelected = ref<IAccountingParametersMovementCodes | null>(null)
  const handleSelected = async ({
    selected,
  }: {
    rows: number
    selected: IAccountingParametersMovementCodes[]
  }) => {
    await _clearDataCodes()
    tablePropsNfi.value.rows = []
    tablePropsProperties.value.rows = []
    const [row] = selected
    if (!row) rowSelected.value = null
    rowSelected.value = row
  }

  // table accounting block
  const tablePropsNfi = ref({
    title: 'Negocios fiduciarios',
    loading: false,
    columns: [
      {
        name: 'business_code',
        required: true,
        label: 'Código y nombre del negocio',
        align: 'left',
        field: (row) => `${row.business_code} - ${row.name}`,
        sortable: true,
      },
      {
        name: 'status_id',
        required: true,
        label: 'Estado de negocio',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAccountingParametersMovementCodes[],
    pages: {
      currentPage: ref(0),
      lastPage: ref(0),
    },
  })

  // table accounting block
  const tablePropsProperties = ref({
    title: 'Detalle de parámetros',
    loading: false,
    columns: [
      {
        name: 'movement_code_id',
        required: true,
        label: 'Código de movimiento',
        align: 'center',
        field: 'movement_code_id',
        sortable: true,
      },
      {
        name: 'good_class',
        required: true,
        label: 'Clase',
        align: 'center',
        field: 'good_class',
        sortable: true,
      },
      {
        name: 'good_type',
        required: true,
        label: 'Tipo',
        align: 'center',
        field: 'good_type',
        sortable: true,
      },
      {
        name: 'split_nature',
        required: true,
        label: 'Naturaleza partida',
        align: 'center',
        field: 'split_nature',
        sortable: true,
      },
      {
        name: 'split_accounting_account_id',
        required: true,
        label: 'Cuenta contable partida',
        align: 'center',
        field: 'split_accounting_account_id',
        sortable: true,
      },
      {
        name: 'np_auxiliary_type',
        required: true,
        label: 'Tipo auxiliar',
        align: 'center',
        field: 'np_auxiliary_type',
        sortable: true,
      },
      {
        name: 'np_specific',
        required: true,
        label: 'Específico',
        align: 'center',
        field: 'np_specific',
        sortable: true,
      },
      {
        name: 'np_cost_center_id',
        required: true,
        label: 'Centro de costos',
        align: 'center',
        field: 'np_cost_center_id',
        sortable: true,
      },
      {
        name: 'counterpart_nature',
        required: true,
        label: 'Naturaleza contrapartida',
        align: 'center',
        field: 'counterpart_nature',
        sortable: true,
      },
      {
        name: 'offsetting_accounting_account_id',
        required: true,
        label: 'Cuenta contable contrapartida',
        align: 'center',
        field: 'offsetting_accounting_account_id',
        sortable: true,
      },

      {
        name: 'ncp_auxiliary_type',
        required: true,
        label: 'Tipo auxiliar',
        align: 'center',
        field: 'ncp_auxiliary_type',
        sortable: true,
      },
      {
        name: 'ncp_specific',
        required: true,
        label: 'Específico',
        align: 'center',
        field: 'ncp_specific',
        sortable: true,
      },
      {
        name: 'ncp_cost_center_id',
        required: true,
        label: 'Centro de costos',
        align: 'center',
        field: 'ncp_cost_center_id',
        sortable: true,
      },
      {
        name: 'voucher_id',
        required: true,
        label: 'Comprobante',
        align: 'center',
        field: 'voucher_id',
        sortable: true,
      },
      {
        name: 'sub_voucher_id',
        required: true,
        label: 'Sub comprobante',
        align: 'center',
        field: 'sub_voucher_id',
        sortable: true,
      },

      {
        name: 'actions',
        required: true,
        label: 'Acciones',
        align: 'left',
        field: 'status_id',
        sortable: true,
      },
    ] as QTable['columns'],
    rows: [] as IAccountingParametersMovementCodesParameter[],
    pages: {
      currentPage: ref(0),
      lastPage: ref(0),
    },
  })

  const addRowTableParameters = () => {
    const newUid = (max_id_parameters.value ?? 0) + 1
    const aux: IAccountingParametersMovementCodesParameter = {
      id: null,
      _uid: newUid,
      movement_code_id: undefined,
      good_class: undefined,
      good_type: undefined,
      split_nature: undefined,
      np_auxiliary_type: undefined,
      np_specific: undefined,
      split_accounting_account_id: undefined,
      np_cost_center_id: undefined,
      counterpart_nature: undefined,
      offsetting_accounting_account_id: undefined,
      ncp_auxiliary_type: undefined,
      ncp_specific: undefined,
      ncp_cost_center_id: undefined,
      voucher_id: undefined,
      sub_voucher_id: undefined,
      accounting_block_id: undefined,
    }
    _setMaxIdParameters(newUid)
    accounting_parameters_movement_codes_parameters_list.value.push(aux)
  }

  const deleteRowTable = async () => {
    if (alertModalConfig.value.entityId as number) {
      alertModalRef.value.closeModal()
      openMainLoader(true)
      await _deleteAccountingParametersMovementCodes(
        alertModalConfig.value.entityId as number
      )
      rowSelected.value = null
      await _getListAction()
      return openMainLoader(false)
    }
    const index =
      accounting_parameters_movement_codes_parameters_list.value.findIndex(
        (item) => item.id === (alertModalConfig.value.entityId as number)
      )
    if (index !== -1) {
      accounting_parameters_movement_codes_parameters_list.value.splice(
        index,
        1
      )
    }
  }

  const copyRowTable = (row: IAccountingParametersMovementCodesParameter) => {
    const newUid = (max_id_parameters.value ?? 0) + 1
    const newRow = {
      ...row,
      id: null,
      _uid: newUid,
    }
    _setMaxIdParameters(newUid)
    accounting_parameters_movement_codes_parameters_list.value.push(newRow)
  }

  const selectNpAuxiliarType = (
    value: string,
    row: IAccountingParametersMovementCodesParameter
  ) => {
    row.np_auxiliary_type = value
    formInformation.value?.resetValidation()
  }

  const selectNcpAuxiliaryType = (
    value: string,
    row: IAccountingParametersMovementCodesParameter
  ) => {
    row.ncp_auxiliary_type = value
    formInformation.value?.resetValidation()
  }

  onBeforeMount(() => {
    _setMaxId(0)
    _setMaxIdParameters(0)
  })

  onMounted(async () => {
    openMainLoader(true)

    await _getListAction()

    openMainLoader(false)
  })

  onUnmounted(async () => {
    _setMaxId(0)
    _setMaxIdParameters(0)
    _clearDataCodes()
  })

  watch(
    () => rowSelected.value,
    async () => {
      if (!rowSelected.value) return

      const {
        business_type_id,
        accounting_structure_id,
        cost_center_structure_id,
      } = rowSelected.value

      if (business_type_id && accounting_structure_id) {
        openMainLoader(true)
        const filters = new URLSearchParams({
          'filter[accounting_structure]': String(accounting_structure_id),
          'filter[type]': String(business_type_id),
        })

        if (cost_center_structure_id) {
          filters.append(
            'filter[cost_center_structure]',
            String(cost_center_structure_id)
          )
        }

        await _getResources(
          { trust_business: ['params_accounting_account'] },
          `filter[account_structure_id]=${accounting_structure_id}`
        )

        if (rowSelected.value._uid) {
          await _getParameters(rowSelected.value._uid)
        }
        await _getCodeDescription(filters.toString())
        _setRowSelected(rowSelected.value)
        openMainLoader(false)
      }
    },
    { immediate: true, deep: true }
  )

  watch(
    () => accounting_parameters_movement_codes_list.value,
    () => {
      tablePropsAccountingBlock.value.rows = [
        ...accounting_parameters_movement_codes_list.value,
      ]
    },
    { immediate: true, deep: true }
  )

  watch(
    () => codes_business_trust_list.value,
    () => {
      tablePropsNfi.value.rows = [...codes_business_trust_list.value]
    },
    { immediate: true, deep: true }
  )

  watch(
    () => accounting_parameters_movement_codes_parameters_list.value,
    () => {
      tablePropsProperties.value.rows = [
        ...accounting_parameters_movement_codes_parameters_list.value,
      ]
    },
    { immediate: true, deep: true }
  )

  return {
    formInformation,
    business_trust_types,
    account_structures,
    cost_centers_structures,
    tablePropsAccountingBlock,
    tablePropsNfi,
    tablePropsProperties,
    rowSelected,

    //
    movement_codes_parameters,
    params_good_class,
    params_good_type,
    params_nature,
    params_auxiliary_type,
    receipt_types,
    sub_receipt_types,
    business_trust_third_parties,
    params_accounting_account,
    budget_structures,
    alertModalRef,
    alertModalConfig,
    copyRowTable,
    addRowTable,
    handleSelected,
    addRowTableParameters,
    deleteRowTable,
    selectNpAuxiliarType,
    selectNcpAuxiliaryType,
    deleteRowTableAccountingBlock,
    openAlertModal,
    validateRouter,
  }
}

export default useInformationForm
