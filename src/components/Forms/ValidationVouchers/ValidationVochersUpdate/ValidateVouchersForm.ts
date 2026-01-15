import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import moment from 'moment'
import { useMainLoader } from '@/composables'
import { isEmptyOrZero } from '@/utils'
import { IResource, ActionType, ActionHandlers } from '@/interfaces/global'
import {
  IValidateVouchersForm,
  IValidationVouchersView,
} from '@/interfaces/customs'
import {
  useValidationVouchersStore,
  useAccountingResourceStore,
  useResourceManagerStore,
} from '@/stores'

const useValidateVouchersForm = (props: {
  action: ActionType
  data?: IValidationVouchersView
}) => {
  const { openMainLoader } = useMainLoader()

  const { _setValidateVouchersForm } = useValidationVouchersStore('v1')
  const { validation_vouchers_view } = storeToRefs(
    useValidationVouchersStore('v1')
  )

  const {
    business_trusts_with_description_by_account_structure_code,
    account_structures_active_revert_vouchers,
  } = storeToRefs(useAccountingResourceStore('v1'))
  const { _getResources } = useResourceManagerStore('v1')

  const formValidateElementRef = ref()
  const firstDay = ref('')
  const lastDay = ref('')

  const keyBusinessTrust = {
    accounting: ['business_trusts_with_description_by_account_structure'],
  }

  const initialModelsValuesToEdit: IValidateVouchersForm = {
    period_date: '',
    structure: '',
    structure_name: '',
    from_business_trust_id: '',
    from_business_trust_name: '',
    to_business_trust_id: '',
    to_business_trust_name: '',
    from_update: true,
    daily_closing: false,
    update: 'Mes',
    day_to_update: '',
    needs_voucher: false,
  }

  const initialModelsValuesToView: IValidationVouchersView = {
    id: null,
    period_date: '',
    structure: '',
    structure_name: '',
    from_business_trust_id: {
      id: null,
      business_code: '',
      business_name: '',
    },
    to_business_trust_id: {
      id: null,
      business_code: '',
      business_name: '',
    },
    daily_closing: false,
    update: '',
    day_to_update: '',
    needs_voucher: false,
    receipt_type_id: {
      id: null,
      code: null,
      name: '',
    },
    sub_receipt_type_id: {
      id: null,
      code: null,
      name: '',
    },
    status: {
      id: null,
      status: '',
    },
  }

  const editModel = ref<IValidateVouchersForm>({ ...initialModelsValuesToEdit })
  const viewModel = ref<IValidationVouchersView>({
    ...initialModelsValuesToView,
  })

  const handlerActionForm = (action: Partial<ActionType>) => {
    const actionHandlers: ActionHandlers = {
      edit: () =>
        validation_vouchers_view.value
          ? setFormView(validation_vouchers_view.value)
          : props.data
          ? setFormView(props.data)
          : setFormView(initialModelsValuesToView),
      view: () => {
        validation_vouchers_view.value
          ? setFormView(validation_vouchers_view.value)
          : props.data
          ? setFormView(props.data)
          : setFormView(initialModelsValuesToView)
      },
    }
    actionHandlers[action]?.()
  }

  const setFormView = async (data: IValidationVouchersView) => {
    clearForm()
    Object.assign(viewModel.value, data)

    const parts = (data.structure || '').split(' - ')
    viewModel.value.structure = parts[0]?.trim() || data.structure || ''
    viewModel.value.structure_name = parts[1]?.trim() || data.structure || ''
  }

  const clearForm = () => {
    Object.assign(viewModel.value, initialModelsValuesToView)
  }

  const setDayToUpdate = () => {
    if (!editModel.value.period_date) {
      editModel.value.day_to_update = ''
      return
    }
    if (!editModel.value.daily_closing && editModel.value.period_date) {
      const momentDate = moment(editModel.value.period_date, 'YYYY-MM', true)
      editModel.value.day_to_update = momentDate.isValid()
        ? momentDate.endOf('month').format('YYYY-MM-DD')
        : ''
    }
  }

  const setRangeDayOfMonth = (): void => {
    if (!editModel.value.period_date) {
      firstDay.value = ''
      lastDay.value = ''
      return
    }

    const momentDate = moment(editModel.value.period_date, 'YYYY-MM', true)
    if (momentDate.isValid()) {
      firstDay.value = momentDate.startOf('month').format('YYYY-MM-DD')
      lastDay.value = momentDate.endOf('month').format('YYYY-MM-DD')
    } else {
      firstDay.value = ''
      lastDay.value = ''
    }
  }

  const handleDailyClosingChange = (event: boolean) => {
    editModel.value.daily_closing = event
    editModel.value.update = event ? 'Día' : 'Mes'
    setDayToUpdate()
  }

  const selectStructure = (event: number) => {
    const selectedStructure =
      account_structures_active_revert_vouchers.value.find(
        (structure: IResource) => structure.id === event
      )
    if (selectedStructure) {
      editModel.value.structure = selectedStructure.id ?? ''
      editModel.value.structure_name = selectedStructure.purpose ?? ''
    }
    editModel.value.from_business_trust_id = ''
    editModel.value.to_business_trust_id = ''
    editModel.value.from_business_trust_name = ''
    editModel.value.to_business_trust_name = ''
  }

  const selectFromBusiness = (event: number) => {
    const selectedFromBusiness =
      business_trusts_with_description_by_account_structure_code.value.find(
        (business: IResource) => business.id === event
      )
    if (selectedFromBusiness) {
      editModel.value.from_business_trust_id = selectedFromBusiness.id ?? ''
      const rawDescription = selectedFromBusiness?.business_description ?? ''
      const match = rawDescription.match(/^\s*\d+\s*[-+]\s*(.+)$/)
      editModel.value.from_business_trust_name = match
        ? match[1].trim()
        : rawDescription.trim()
    }
  }

  const selectToBusiness = (event: number) => {
    const selectedToBusiness =
      business_trusts_with_description_by_account_structure_code.value.find(
        (business: IResource) => business.id === event
      )
    if (selectedToBusiness) {
      editModel.value.to_business_trust_id = selectedToBusiness.id ?? ''
      const rawDescription = selectedToBusiness?.business_description ?? ''
      const match = rawDescription.match(/^\s*\d+\s*[-+]\s*(.+)$/)
      editModel.value.to_business_trust_name = match
        ? match[1].trim()
        : rawDescription.trim()
    }
  }

  onMounted(() => {
    handlerActionForm(props.action)
  })

  watch(
    () => editModel.value,
    () => {
      const data = isEmptyOrZero(editModel.value)
        ? null
        : { ...editModel.value }

      if (props.action === 'edit') {
        _setValidateVouchersForm(data)
      }
    },
    { deep: true }
  )

  watch(
    [() => editModel.value.period_date, () => editModel.value.daily_closing],
    ([periodDate, dailyClosing]) => {
      if (!periodDate) return

      if (dailyClosing) {
        setRangeDayOfMonth()
      } else {
        setDayToUpdate()
      }
    }
  )

  watch(
    () => editModel.value.structure,
    async (newStructureId, oldStructureId) => {
      if (!newStructureId) {
        business_trusts_with_description_by_account_structure_code.value = []
        editModel.value.from_business_trust_id = ''
        editModel.value.to_business_trust_id = ''
        return
      }

      if (newStructureId !== oldStructureId) {
        openMainLoader(true)
        await _getResources(
          keyBusinessTrust,
          `filter[account_structures_id]=${newStructureId}`
        )

        if (
          !business_trusts_with_description_by_account_structure_code.value
            .length
        ) {
          editModel.value.from_business_trust_id = ''
          editModel.value.to_business_trust_id = ''
        }
        openMainLoader(false)
      }
    },
    { immediate: true }
  )

  return {
    editModel,
    viewModel,
    formValidateElementRef,
    business_trusts_with_description_by_account_structure_code,
    account_structures_active_revert_vouchers,
    handleDailyClosingChange,
    selectStructure,
    selectFromBusiness,
    selectToBusiness,
    firstDay,
    lastDay,
  }
}

export default useValidateVouchersForm
