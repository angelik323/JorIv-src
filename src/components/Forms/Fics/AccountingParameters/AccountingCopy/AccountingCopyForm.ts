// Vue - Pinia
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'

// Interfaces
import { IAccountingParametersAccountingCopyForm } from '@/interfaces/customs/fics/AccountingCopy'
import { ISelectorResources } from '@/interfaces/customs/Filters'

// Composables
import { useMainLoader, useUtils } from '@/composables'

// Stores
import { useAccountingParametersAccountingCopyStore } from '@/stores/fics/accounting-parameters/accounting-copy'
import { useFicResourceStore } from '@/stores/resources-manager/fics'
import { useResourceManagerStore } from '@/stores/resources-manager'

const useAccountingCopyForm = () => {
  const { openMainLoader } = useMainLoader()
  const { isEmptyOrZero } = useUtils()

  const { accounting_copy_form } = storeToRefs(
    useAccountingParametersAccountingCopyStore('v1')
  )
  const { _setAccountingCopyForm, _createAccountingCopy } =
    useAccountingParametersAccountingCopyStore('v1')

  const { accounting_blocks } = storeToRefs(useFicResourceStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')

  const accounting_blocks_destination = ref<ISelectorResources[]>()
  const accounting_blocks_origin = ref<ISelectorResources[]>()
  const accountingCopyFormElementRef = ref()

  const keys = {
    fics: ['accounting_blocks'],
  }

  const headerProps = {
    title: 'Generar copias contables',
    description:
      'Genere una copia de un bloque contable que ya tenga configurados sus parámetros contables. Esta copia se realizará hacia otro bloque contable destino, siempre y cuando ambos compartan la misma contabilidad',
  }

  const initialModels: IAccountingParametersAccountingCopyForm = {
    origin_accounting_block_id: null,
    destination_accounting_block_id: null,
  }

  const models = ref<IAccountingParametersAccountingCopyForm>({
    ...initialModels,
  })

  const setFormCreate = () => {
    clearForm()

    if (accounting_copy_form.value) {
      Object.assign(models.value, {
        ...accounting_copy_form.value,
      })
    }
  }

  const loadResources = async () => {
    openMainLoader(true)
    setFormCreate()

    await _getResources(keys, 'destination=false')

    accounting_blocks_origin.value = accounting_blocks.value

    await _getResources(keys, 'destination=true')

    accounting_blocks_destination.value = accounting_blocks.value

    openMainLoader(false)
  }

  const clearForm = () => {
    Object.assign(models.value, initialModels)
  }

  const makeDataRequest = (): IAccountingParametersAccountingCopyForm => {
    const form = accounting_copy_form.value

    return {
      origin_accounting_block_id: form?.origin_accounting_block_id ?? null,
      destination_accounting_block_id:
        form?.destination_accounting_block_id ?? null,
    }
  }

  const validateForm = async () => {
    return (await accountingCopyFormElementRef.value?.validate()) ?? false
  }

  const onSubmit = async () => {
    if (!(await validateForm())) return
    openMainLoader(true)

    const payload = makeDataRequest()
    let success = false

    success = await _createAccountingCopy(payload)

    if (success) {
      _setAccountingCopyForm(null)
    }

    openMainLoader(false)
  }

  onMounted(async () => await loadResources())

  onBeforeUnmount(async () => {
    _setAccountingCopyForm(null)
    _resetKeys(keys)
  })

  watch(
    () => models.value,
    () => {
      if (isEmptyOrZero(models.value)) {
        _setAccountingCopyForm(null)
      } else {
        _setAccountingCopyForm({ ...models.value })
      }
    },
    { deep: true }
  )

  return {
    headerProps,
    models,
    accountingCopyFormElementRef,
    onSubmit,
    accounting_blocks_origin,
    accounting_blocks_destination,
  }
}

export default useAccountingCopyForm
