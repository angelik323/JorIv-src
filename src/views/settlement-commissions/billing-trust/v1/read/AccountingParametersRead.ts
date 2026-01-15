import { useGoToUrl, useMainLoader } from '@/composables'
import {
  IAccountingParametersForm,
  IAccountingParametersResponse,
} from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useBillingTrustsStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const useAccountingParametersRead = () => {
  const route = useRoute()
  const searchId = +route.params.id
  const { _getByIdAccountingParameters, _clearData } =
    useBillingTrustsStore('v1')
  const { accounting_parameters_response } = storeToRefs(
    useBillingTrustsStore('v1')
  )
  const { openMainLoader } = useMainLoader()
  const { goToURL } = useGoToUrl()

  const data_information_form = ref<IAccountingParametersForm | null>(null)

  const headerProps = {
    title: 'Ver parámetros contables',
    breadcrumbs: [
      {
        label: 'Inicio',
        route: 'HomeView',
      },
      {
        label: 'Liquidación de comisiones',
        route: '',
      },
      {
        label: 'Definición inicial fideicomiso para facturación',
        route: 'BillingTrustList',
      },
      {
        label: 'Ver',
        route: 'AccountingParametersRead',
      },
      {
        label: `${searchId}`,
      },
    ],
  }

  const tabs = ref<ITabs[]>([
    {
      name: 'basic_data',
      label: 'Datos básicos',
      icon: defaultIconsLucide.bulletList,
      outlined: true,
      disable: true,
      show: true,
      required: false,
    },
  ])

  const filteredTabs = computed(() => tabs.value.filter((tab) => tab.show))

  const tabActive = ref(filteredTabs.value[0].name)

  const tabActiveIdx = ref(
    filteredTabs.value.findIndex((tab) => tab.name === tabActive.value)
  )

  const goToList = () => {
    goToURL('BillingTrustList')
  }

  const goToEdit = () => {
    goToURL('AccountingParametersEdit', searchId)
  }

  const setFormRead = (data: IAccountingParametersResponse) => {
    data_information_form.value = {
      business_code: data.business_code_snapshot,
      business_name: data.business_name_snapshot,
      accounts: data.accounts,
      who_pays: data.who_pays,
      generates_iva: data.generates_iva,
      iva: data.iva,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdAccountingParameters(searchId)
    openMainLoader(false)
  })

  watch(
    () => accounting_parameters_response.value,
    (val) => {
      if (!val) return
      setFormRead(val)
    }
  )

  return {
    headerProps,
    filteredTabs,
    tabActive,
    tabActiveIdx,
    data_information_form,
    goToList,
    goToEdit,
  }
}

export default useAccountingParametersRead
