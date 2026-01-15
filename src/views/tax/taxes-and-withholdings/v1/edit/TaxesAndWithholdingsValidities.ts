import { onMounted, ref } from 'vue'

// Interfaces
import { ITabs } from '@/interfaces/global'
import {
  ITaxesAndWithholdingsValidities,
  Validity,
} from '@/interfaces/customs/tax/TaxesAndWithholdings'

// Composables
import { useGoToUrl, useUtils, useMainLoader } from '@/composables'

// Stores
import { useTaxesAndWithholdingsStore } from '@/stores/tax/taxes-and-withholdings'
import { useResourceManagerStore } from '@/stores'

// Router
import { useRoute } from 'vue-router'

const useTaxesAndWithholdingsValidities = () => {
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()
  const { defaultIconsLucide } = useUtils()

  const keys = {
    tax: ['tax_types'],
  }

  const id = useRoute().params?.id || null

  const title: string = 'Vigencias'
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
      label: 'Impuestos y retenciones',
      route: 'TaxesAndWithholdingsList',
    },
    {
      label: 'Editar',
      route: 'TaxesAndWithholdingsEdit',
    },
    {
      label: id!.toString(),
    },
  ]

  const tabs: ITabs[] = [
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ]

  const tabActive = ref(tabs[0].name)
  const tabActiveIdx = ref(
    tabs.findIndex((tab) => tab.name === tabActive.value)
  )

  // Referencias a formularios
  const informationFormRef = ref()

  const basic_data_form = ref<ITaxesAndWithholdingsValidities | null>(null)

  const onSubmit = async () => {
    openMainLoader(true)
    const list = basic_data_form.value?.validities ?? []
    const payload = list[list.length - 1] as Validity

    const successResponse =
      await useTaxesAndWithholdingsStore()._updateValidities(
        Number(id),
        payload
      )

    if (successResponse) {
      goToURL('TaxesAndWithholdingsList')
    }
    openMainLoader(false)
  }

  const showById = async () => {
    if (!id) {
      goToURL('TaxesAndWithholdingsList')
    }
    const data = await useTaxesAndWithholdingsStore()._getValiditiesById(
      Number(id)
    )

    if (data) {
      basic_data_form.value = {
        validities: data,
      }
    }
  }

  onMounted(async () => {
    showById()
    useResourceManagerStore('v1')._getResources(keys)
  })

  return {
    title,
    breadcrumbs,
    tabs,
    tabActive,
    tabActiveIdx,
    basic_data_form,
    informationFormRef,
    onSubmit,
    goToURL,
  }
}

export default useTaxesAndWithholdingsValidities
