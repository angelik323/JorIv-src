import { onMounted, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITaxTypeTaxResponse,
  ITaxTypeTaxRequest,
} from '@/interfaces/customs/tax/TaxType'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useTaxesTypeStore } from '@/stores/tax/taxes-type'

// Router
import { useRoute } from 'vue-router'
const useTaxTypeEdit = () => {
  const id = useRoute().params?.id || null

  const title: string = 'Editar tipo de impuesto'
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
      label: 'Editar',
      route: 'TaxTypeEdit',
    },
    {
      label: id!.toString(),
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

  // Referencias a formularios
  const informationFormRef = ref()

  const response_data = ref<ITaxTypeTaxResponse | null | undefined>(null)
  const payload_edit = ref<ITaxTypeTaxRequest | null>(null)

  const goToURL = useGoToUrl().goToURL

  onMounted(async () => {
    showById()
  })

  const showById = async () => {
    if (!id) {
      goToURL('TaxTypeList')
    }
    response_data.value = await useTaxesTypeStore()._getTaxType(Number(id))
  }

  const onSubmit = async () => {
    if (await informationFormRef.value?.validate()) {
      useMainLoader().openMainLoader(true)
      const successResponse = await useTaxesTypeStore()._updateTaxType(
        Number(id),
        payload_edit.value as ITaxTypeTaxRequest
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
    response_data,
    payload_edit,
    informationFormRef,
    onSubmit,
    goToURL,
  }
}

export default useTaxTypeEdit
