import { useMainLoader } from '@/composables'
import { IBillingTrustForm, IBillingTrustResponse } from '@/interfaces/customs'
import { ITabs } from '@/interfaces/global'
import { useBillingTrustsStore } from '@/stores'
import { defaultIconsLucide } from '@/utils'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const useBillingTrustRead = () => {
  const router = useRouter()
  const route = useRoute()
  const searchId = +route.params.id
  const { _getByIdBillingTrusts, _clearData } = useBillingTrustsStore('v1')
  const { billing_trusts_response } = storeToRefs(useBillingTrustsStore('v1'))
  const { openMainLoader } = useMainLoader()

  const data_information_form = ref<IBillingTrustForm | null>(null)

  const headerProps = {
    title: 'Ver periodo de facturación',
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
        route: 'BillingTrustRead',
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
    router.push({ name: 'BillingTrustList' })
  }

  const setFormRead = (data: IBillingTrustResponse) => {
    data_information_form.value = {
      business_code: data.business_code_snapshot,
      business_name: data.business_name_snapshot,
      start_date: data.start_date,
      end_date: data.end_date,
      periodicity: data.periodicity,
      other: data.other,
    }
  }

  onMounted(async () => {
    _clearData()
    openMainLoader(true)
    await _getByIdBillingTrusts(searchId)
    openMainLoader(false)
  })

  watch(
    () => billing_trusts_response.value,
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
  }
}

export default useBillingTrustRead
