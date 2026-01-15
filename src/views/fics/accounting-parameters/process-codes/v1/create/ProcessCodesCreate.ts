// Vue  - Pinia
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

// Interfaces
import {
  IAccountingParametersProcessCodes,
  IAccountingParametersProcessCodesFormList,
} from '@/interfaces/customs/fics/ProcessCodes'

// Composables
import { useGoToUrl, useMainLoader } from '@/composables'

// Stores
import { useAccountingParametersProcessCodesStore } from '@/stores/fics/accounting-parameters/process-codes'

const useProcessCodesCreate = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const { _createProcessCode } = useAccountingParametersProcessCodesStore('v1')
  const { process_codes_list } = storeToRefs(
    useAccountingParametersProcessCodesStore('v1')
  )

  const processCodesFormRef = ref()

  const headerProps = {
    title: 'Asignar códigos de procesos',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Fics',
      },
      {
        label: 'Parámetros contabilidad',
        route: 'AccountingParametersList',
      },
      {
        label: 'Asignar códigos de procesos',
        route: 'ProcessCodesCreate',
      },
    ],
  }

  const makeDataRequest = (): IAccountingParametersProcessCodesFormList => {
    const filteredItems = process_codes_list.value.filter(
      (item: IAccountingParametersProcessCodes) =>
        item.movement_code_id !== null &&
        item.movement_code_id !== undefined &&
        item.movement_code_id !== 0
    )

    const form = filteredItems.map(
      (item: IAccountingParametersProcessCodes) => ({
        id: item.id ?? null,
        code: item.code ?? null,
        description: item.description ?? null,
        process_type_id: item.classes_movement_type?.id ?? null,
        process_nature_id: item.classes_movement_nature?.id ?? null,
        process_class_id: item.classes_movement_class?.id ?? null,
        movement_code_id: item.movement_code_id ?? null,
      })
    )

    return {
      process_codes: form,
    }
  }

  const validateForm = async () => {
    return (await processCodesFormRef.value?.validateForm()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return

    openMainLoader(true)

    const payload = makeDataRequest()
    const success = await _createProcessCode(payload)

    if (success) onBack()

    openMainLoader(false)
  }

  const onBack = () =>
    goToURL('AccountingParametersList', {
      params: { activeTab: 'codigos-procesos' },
    })

  return {
    onBack,
    onSubmit,
    headerProps,
    processCodesFormRef,
  }
}

export default useProcessCodesCreate
