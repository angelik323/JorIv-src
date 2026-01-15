import { useResourceStore, useMovementCodeStore } from '@/stores'
import { storeToRefs } from 'pinia'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { IMovementCodes } from '@/interfaces/customs'
import { isEmptyOrZero } from '@/utils'
import { useRoute } from 'vue-router'

const useInformationForm = (props: {
  action: 'create' | 'edit' | 'view'
  data?: IMovementCodes[]
}) => {
  const { data_information_form } = storeToRefs(useMovementCodeStore('v1'))
  const { _setDataInformationForm } = useMovementCodeStore('v1')
  const { _getResourcesTreasuries } = useResourceStore('v1')
  const {
    receipt_type,
    sub_receipt_type,
    movement_code_override,
    operation_movement_codes_list,
    nature_movement_codes_list,
  } = storeToRefs(useResourceStore('v1'))
  const keys = ['receipt_type', 'sub_receipt_type']
  const keysMenu = ['nature', 'operation']
  const formInformation = ref()
  const generateEspecialContributionIsDisable = ref()
  const route = useRoute()

  const models = ref<{
    id?: string
    description: string
    nature: string
    operation: string
    generate_special_contribution: boolean
    handles_accounting_offset: boolean
    conciliation_movement: boolean
    transfer_investments: boolean
    transfer_accounts: boolean
    receipt_types_id: number | null
    sub_receipt_types_id: number | null
    move_override: number | null
  }>({
    id: '',
    description: '',
    nature: '',
    operation: '',
    generate_special_contribution: false,
    handles_accounting_offset: false,
    conciliation_movement: false,
    transfer_investments: false,
    transfer_accounts: false,
    receipt_types_id: null,
    sub_receipt_types_id: null,
    move_override: null,
  })
  const handlerActionForm = (action: 'create' | 'edit' | 'view') => {
    const actionHandlers: Record<typeof action, () => void> = {
      create: _setValueModel,
      edit: data_information_form.value ? _setValueModel : setFormEdit,
      view: _setFormView,
    }
    actionHandlers[action]?.()
  }
  const fieldCode = {
    label: 'Código',
    value: () => route.query.code ?? '',
    fallback: 'No registrado',
  }

  const filteredOperations = computed(() => {
    const operations = JSON.parse(
      JSON.stringify(operation_movement_codes_list.value)
    )
    return operations
  })
  const _setValueModel = () => {
    if (data_information_form.value) {
      models.value.description = data_information_form.value.description ?? ''
      models.value.nature = data_information_form.value.nature ?? ''
      models.value.operation = data_information_form.value.operation ?? ''
      models.value.generate_special_contribution =
        data_information_form.value.generate_special_contribution ?? false
      models.value.handles_accounting_offset =
        data_information_form.value.handles_accounting_offset ?? false
      models.value.conciliation_movement =
        data_information_form.value.conciliation_movement ?? false
      models.value.transfer_investments =
        data_information_form.value.transfer_investments ?? false
      models.value.transfer_accounts =
        data_information_form.value.transfer_accounts ?? false
      models.value.receipt_types_id =
        data_information_form.value.receipt_types_id ?? null
      models.value.sub_receipt_types_id =
        data_information_form.value.sub_receipt_types_id ?? null
      models.value.move_override =
        data_information_form.value.move_override ?? null
    }
  }

  const setFormEdit = async () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value.description = data.description ?? ''
      models.value.nature = data.nature ?? ''
      models.value.operation = data.operation ?? ''
      models.value.generate_special_contribution =
        data.generate_special_contribution ?? false
      models.value.handles_accounting_offset =
        data.handles_accounting_offset ?? false
      models.value.conciliation_movement = data.conciliation_movement ?? false
      models.value.transfer_investments = data.transfer_investments ?? false
      models.value.transfer_accounts = data.transfer_accounts ?? false
      models.value.receipt_types_id = data.receipt_types_id ?? null
      models.value.sub_receipt_types_id = data.sub_receipt_types_id ?? null
      models.value.move_override = data.move_override ?? null
    }
  }
  const clearForm = () => {
    models.value.description = ''
    models.value.nature = ''
    models.value.operation = ''
    models.value.generate_special_contribution = false
    models.value.handles_accounting_offset = false
    models.value.conciliation_movement = false
    models.value.transfer_investments = false
    models.value.transfer_accounts = false
    models.value.receipt_types_id = null
    models.value.sub_receipt_types_id = null
    models.value.move_override = null
  }
  const _setFormView = async () => {
    clearForm()
    const data = data_information_form.value
    if (data) {
      models.value.description = data.description ?? ''
      models.value.nature = data.nature ?? ''
      models.value.operation = data.operation ?? ''
      models.value.generate_special_contribution =
        data.generate_special_contribution ?? false
      models.value.handles_accounting_offset =
        data.handles_accounting_offset ?? false
      models.value.conciliation_movement = data.conciliation_movement ?? false
      models.value.transfer_investments = data.transfer_investments ?? false
      models.value.transfer_accounts = data.transfer_accounts ?? false
      models.value.receipt_types_id = data.receipt_types_id ?? null
      models.value.sub_receipt_types_id = data.sub_receipt_types_id ?? null
      models.value.move_override = data.move_override ?? null
    }
  }

  const getOppositeNature = (nature: string) => {
    if (nature === 'Ingresos') return 'Ingresos'
    if (nature === 'Egresos') return 'Egresos'
    return nature
  }

  onMounted(async () => {
    await _getResourcesTreasuries(`keys[]=${keys.join('&keys[]=')}`)
    handlerActionForm(props.action)
    await _getResourcesTreasuries(`keys[]=${keysMenu.join('&keys[]=')}`)
    movement_code_override.value = []

    if (
      (props.action === 'create' || props.action === 'edit') &&
      models.value.nature
    ) {
      const oppositeNature = getOppositeNature(models.value.nature)
      if (oppositeNature) {
        await _getResourcesTreasuries(
          `keys[]=MoveOverride&nature=${oppositeNature}`
        )
      }
    }
  })

  onUnmounted(async () => {
    _setDataInformationForm(null)
  })

  watch(
    () => props.data,
    (val) => {
      if (val) {
        handlerActionForm(props.action)
      }
    },
    { deep: true }
  )
  watch(
    () => models.value.receipt_types_id,
    (newId, oldId) => {
      if (!newId) return
      _getResourcesTreasuries(
        `keys[]=sub_receipt_type&receipt_type_id=${newId}`
      )
      if (oldId && newId !== oldId) {
        models.value.sub_receipt_types_id = null
      }
    }
  )
  watch(
    () => models.value.nature,
    async (newNature, oldNature) => {
      if (newNature && newNature !== oldNature) {
        await _getResourcesTreasuries(`keys[]=operation&nature=${newNature}`)

        const newOperations = operation_movement_codes_list.value || []
        const isCurrentOperationValid = newOperations.some(
          (op) => op.value === models.value.operation
        )

        if (!isCurrentOperationValid) {
          models.value.operation = ''
        }

        const oppositeNature = getOppositeNature(newNature)
        if (oppositeNature) {
          await _getResourcesTreasuries(
            `keys[]=MoveOverride&nature=${oppositeNature}`
          )
        }

        const overrideList = movement_code_override.value || []
        if (
          models.value.move_override !== null &&
          !overrideList.some(
            (item) => item.value === models.value.move_override
          )
        ) {
          models.value.move_override = null
        }
      } else if (!newNature) {
        models.value.operation = ''
        models.value.move_override = null
      }
    }
  )
  watch(
    () => models.value.operation,
    (newOperation, oldOperation) => {
      if (oldOperation && newOperation !== 'Traslado') {
        if (models.value.transfer_investments) {
          models.value.transfer_investments = false
        }
      }
      if (newOperation !== 'Traslado' && models.value.transfer_accounts) {
        models.value.transfer_accounts = false
      }

      generateEspecialContributionIsDisable.value =
        newOperation === 'GMF' ? true : false

      if (generateEspecialContributionIsDisable.value) {
        models.value.generate_special_contribution = false
      }
    }
  )

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setDataInformationForm(null)
      } else {
        _setDataInformationForm({
          ...models.value,
        } as IMovementCodes)
      }
    },
    { deep: true }
  )

  return {
    models,
    formInformation,
    operation_movement_codes_list,
    nature_movement_codes_list,
    receipt_type,
    sub_receipt_type,
    movement_code_override,
    generateEspecialContributionIsDisable,
    fieldCode,
    filteredOperations,
  }
}

export default useInformationForm
