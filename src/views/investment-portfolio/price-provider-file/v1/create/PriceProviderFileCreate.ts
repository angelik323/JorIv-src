// Vue
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

// Composables & utils
import { useMainLoader } from '@/composables'
import { defaultIconsLucide } from '@/utils'

// Interfaces
import type { ITabs } from '@/interfaces/global'
import { IFileItem, IPriceProviderFileFormModel } from '@/interfaces/customs'

// Stores
import { usePriceProviderFileStore, useResourceManagerStore } from '@/stores'

export const usePriceProviderFileCreate = () => {
  const priceProviderFileForm = ref()
  const router = useRouter()
  const { _createPriceProviderFile, _clearData } =
    usePriceProviderFileStore('v1')
  const { data_information_form } = storeToRefs(usePriceProviderFileStore('v1'))
  const { _getResources, _resetKeys } = useResourceManagerStore('v1')
  const { openMainLoader } = useMainLoader()

  const headerProps = {
    title: 'Crear archivo proveedor precios',
    breadcrumbs: [
      { label: 'Inicio', route: 'HomeView' },
      { label: 'Portafolio de inversiones', route: '' },
      {
        label: 'Definición archivos de proveedor de precios',
        route: 'PriceProviderFile',
      },
      { label: 'Crear', route: 'PriceProviderFileCreate' },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: false,
      show: true,
      required: false,
    },
  ])

  const activeTab = ref<string>(tabs.value[0].name)
  const activeTabIdx = ref<number>(0)

  const disabledButtom = computed(() => {
    const form = data_information_form.value

    if (!form) return false

    const filesAreValid =
      Array.isArray(form.files) &&
      form.files.length > 0 &&
      form.files.every(
        (file) =>
          file.name?.trim() &&
          file.prefix?.trim() &&
          file.date_format?.trim() &&
          file.extension?.trim() &&
          file.identification?.trim()
      )

    const requiredFieldsFilled =
      form.issuers_counterparty_id !== '' && filesAreValid

    return requiredFieldsFilled
  })

  const validateForm = async () => {
    return priceProviderFileForm.value?.validateForm() ?? false
  }

  const makeDataRequest = () => {
    const form = data_information_form.value
    if (!form) return null

    const payload: IPriceProviderFileFormModel = {
      issuers_counterparty_id: form.issuers_counterparty_id,
      description: form.description ?? '',
      files: form.files.map((file: IFileItem) => ({
        id: file.id,
        name: file.name,
        prefix: file.prefix,
        date_format: file.date_format,
        extension: file.extension,
        identification: file.identification,
        status_id: file.status_id,
      })),
    }
    return payload
  }

  const onSubmit = async () => {
    if (await validateForm()) {
      openMainLoader(true)
      const payload = makeDataRequest()

      if (!payload) {
        openMainLoader(false)
        return
      }

      if (await _createPriceProviderFile(payload)) {
        router.push({ name: 'PriceProviderFile' })
      }
      openMainLoader(false)
    }
  }

  const keys = {
    investment_portfolio: [
      'price_provider_issuers',
      'name_files_list',
      'date_formats',
    ],
  }

  onMounted(async () => {
    _clearData()
    await _getResources(keys)
  })

  onBeforeUnmount(() => _resetKeys(keys))

  return {
    headerProps,
    tabs,
    activeTab,
    activeTabIdx,
    onSubmit,
    priceProviderFileForm,
    validateForm,
    disabledButtom,
  }
}
