import { ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'

// Composables
import { useUtils, useGoToUrl, useMainLoader } from '@/composables'

// Interfaces
import { ITaxTypeTaxRequest } from '@/interfaces/customs/tax/TaxType'

// Stores
import { useTaxesTypeStore } from '@/stores/tax/taxes-type'
const useTaxTypeCreate = () => {
  const title: string = 'Crear tipo de impuesto'
  const breadcrumbs = [
    {
      label: 'Inicio',
      route: 'HomeView',
    },
    {
      label: 'Tributario',
      route: '',
    },
    {
      label: 'Tipos de impuestos',
      route: 'TaxTypeList',
    },
    {
      label: 'Crear',
      route: 'TaxTypeCreate',
    },
  ]

  const tabs: ITabs[] = [
    {
      name: 'information',
      label: 'Datos básicos',
      icon: useUtils().defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = tabs[0].name
  const tabActiveIdx = 0

  const payload_create = ref<ITaxTypeTaxRequest | null>(null)

  const informationFormRef = ref()

  const goToURL = useGoToUrl().goToURL
  const onSubmit = async () => {
    if (await informationFormRef.value?.validate()) {
      useMainLoader().openMainLoader(true)
      const successResponse = await useTaxesTypeStore()._createTaxType(
        payload_create.value as ITaxTypeTaxRequest
      )

      if (successResponse) {
        goToURL('TaxTypeList')
      }
      useMainLoader().openMainLoader(false)
    }
  }

  return {
    title,
    breadcrumbs,
    tabs,
    tabActive,
    tabActiveIdx,
    payload_create,
    informationFormRef,
    onSubmit,
    goToURL,
  }
}

export default useTaxTypeCreate
